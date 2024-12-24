import { Hono } from "hono";
import { signInSchema, signUpSchema } from "../validators/schemas";
import { errorResponse, successResponse } from "../validators/utils";
import { hash, verify } from "@node-rs/argon2";
import { users } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { lucia } from "../db/auth";
import type { Context } from "../lib/context";

// Recommended minimum parameters for Argon2 hashing
const hashOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

const authRoutes = new Hono<Context>();

// Sign in!
authRoutes.post("/sign-in", async (c) => {
  const body = await c.req.json();
  const validationResult = signInSchema.safeParse(body);

  if (!validationResult.success) {
    // Extract error messages from Zod
    const errorMessage = validationResult.error.issues[0].path[0] + ": " + validationResult.error.issues[0].message;
    return c.json(errorResponse(errorMessage, validationResult.error.issues));
  }

  // Extract validated data
  const { username, password } = validationResult.data;

  console.log({ username, password });

  const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();
 
    if (!user) {
      throw new HTTPException(401, { 
        message: "Incorrect username or password" 
      });
    }
 
    // Check if valid password
    const validPassword = await verify(user.password_hash, password, hashOptions);
 
    if (!validPassword) {
      throw new HTTPException(401, {
        message: "Incorrect username or password",
      });
    }

    // Create a session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });


    return c.json({
      success: true,
      message: "You have been signed in!",
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    });
});

// Sign up!
authRoutes.post("/sign-up", async (c) => {

  const body = await c.req.json();
  const validationResult = signUpSchema.safeParse(body);

  if (!validationResult.success) {
    // Extract error messages from Zod
    const errorMessage = validationResult.error.issues[0].path[0] + ": " + validationResult.error.issues[0].message;
    return c.json(errorResponse(errorMessage, validationResult.error.issues));
  }

  // Extract validated data
  const { name, username, password } = validationResult.data;

  const passwordHash = await hash(password, hashOptions);

  const newUser = await db
      .insert(users)
      .values({
        username,
        name,
        password_hash: passwordHash,
      })
      .returning()
      .get();

  const session = await lucia.createSession(newUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

  return c.json(
    {
      success: true,
      message: "You have been signed up!",
      data: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
      },
    },
    201,
  );
});

// Sign out!
authRoutes.post("/sign-out", async (c) => {
  const session = c.get("session");
  
  if (!session) {
    throw new HTTPException(401, { message: "No session found" });
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  c.header("Set-Cookie", sessionCookie.serialize()); // Remove the session cookie from the client

  return c.json({ success: "true", message: "You have been signed out!" });
});

authRoutes.post("/validate-session", async (c) => {
  const session = c.get("session");
  if (!session) {
    throw new HTTPException(401, { message: "No session found" });
  }

  const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

  return c.json({
    success: true,
    message: "Session is valid",
  })
});

export default authRoutes;
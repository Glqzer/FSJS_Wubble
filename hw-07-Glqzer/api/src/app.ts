import { Hono } from "hono";
import deckRoutes from "./routes/decks";
import cardRoutes from "./routes/cards";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { z } from "zod";
import { errorResponse } from "./validators/utils";
import authRoutes from "./routes/auth";
import { logger } from "hono/logger";
import type { Context } from "./lib/context.js";
import { auth } from "./middleware/auth";

const app = new Hono<Context>();

app.use(logger());

app.use(
    "/*",
      cors({
    origin: (origin) => origin, // Allow any origin
    credentials: true, // Allow credentials
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
  }),
);

app.use("/*", auth);

app.get("/", (c) => {
  return c.text("Flashcards API");
});

app.route("/", deckRoutes);

app.route("/", cardRoutes);

app.route("/", authRoutes);


// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(errorResponse(err.message));
  } else if (err instanceof z.ZodError) {
    return c.json(errorResponse(err.issues[0].message, err.issues));
  } else {
    return c.json(errorResponse("Unexpected error occured"));
  }
});

export default app;

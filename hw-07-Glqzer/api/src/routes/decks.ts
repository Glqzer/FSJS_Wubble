import { Hono } from "hono";
import { db } from "../db";
import { decks } from "../db/schema";
import {
  createDeckSchema,
  updateDeckSchema,
} from "../validators/schemas";
import { HTTPException } from "hono/http-exception";
import { eq, like, count, SQL, and, asc, desc } from "drizzle-orm";
import { errorResponse, successResponse } from "../validators/utils";
import { z, ZodError } from "zod";
import type { Context } from "../lib/context";
import { authGuard } from "../middleware/auth-guard";

const deckRoutes = new Hono<Context>();

// Get all decks with optional searching, sorting, and pagination
deckRoutes.get("decks", authGuard, async (c) => {
  try {
    // Parse and validate query parameters manually
    const query = c.req.query();

    const search = query.search || undefined;
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "20", 10);
    const sort = query.sort;

    // Validate `page`, `limit`, and `sort`
    if (isNaN(page) || page < 1) {
      return c.json(errorResponse("Page must be a positive integer", {
        code: "invalid_type",
        expected: "number",
        received: "non-positive",
        path: ["id"],
        message: "Page must be a positive integer",
        name: "ZodError",
      }));
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return c.json(
        errorResponse("Limit must be a positive integer between 1 and 100", {
          code: "invalid_type",
          expected: "number",
          received: "not between 1-100",
          path: ["id"],
          message: "Limit must be a positive integer between 1 and 100",
          name: "ZodError",
        }));
    }

    if (sort && sort !== "asc" && sort !== "desc") {
      return c.json(
        errorResponse('Sort must be either "asc" or "desc" if provided', {
          code: "invalid_type",
          expected: "asc || desc",
          received: "invalid",
          path: ["id"],
          message: "Sort must be either 'asc' or 'desc' if provided",
          name: "ZodError",
        }));
    }

    // Enforce a maximum limit of 100 and ensure `page` and `limit` are positive
    const effectiveLimit = Math.min(Math.max(limit, 1), 100);
    const effectivePage = Math.max(page, 1);

    // Build the WHERE clause based on the search parameter
    const whereClause: (SQL | undefined)[] = [];
    if (search) {
      whereClause.push(like(decks.title, `%${search}%`));
    }

    const offset = (effectivePage - 1) * effectiveLimit;

    // Determine sorting order
    let orderClause;
    if (sort === "asc") {
      orderClause = asc(decks.date);
    } else if (sort === "desc") {
      orderClause = desc(decks.date);
    } else {
      // Default sorting order if `sort` is not provided or invalid
      orderClause = asc(decks.date);
    }

    // USER VALIDATION
    const user = c.get("user");

    const [allDecks, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(decks)
        .where(
          whereClause.length > 0
            ? and(eq(decks.userId, user!.id), ...whereClause)
            : eq(decks.userId, user!.id)
        )
        .orderBy(orderClause)
        .limit(effectiveLimit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(decks)
        .where(
          whereClause.length > 0
            ? and(eq(decks.userId, user!.id), ...whereClause)
            : eq(decks.userId, user!.id)
        ),
    ]);

    const totalPages = Math.ceil(totalCount / effectiveLimit);

    return c.json(
      successResponse(allDecks, "Decks retrieved successfully", {
        page,
        limit,
        totalPages,
        totalCount,
      }),
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues;
      const message = issues[0].message;
      return c.json(message);
    }

    // Handle unexpected errors
    return c.json(errorResponse("Something went wrong"));
  }
});

// Get a single deck by id
deckRoutes.get("decks/:id", authGuard, async (c) => {

  // ID VALIDATION
  const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json(
        errorResponse("id: Expected number, received nan", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["id"],
          message: "Expected number, received nan",
          name: "ZodError",
        }),
      );
    }

  try {
    // Query the database for the deck
    const deck = await db.select().from(decks).where(eq(decks.id, id)).get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }

    const user = c.get("user");

    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to access this deck",
      });
    }

    // Return the successful response
    return c.json(successResponse(deck, "Deck retrieved successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(errorResponse(error.errors[0].message, error.errors));
    }

    if (error instanceof HTTPException) {
      return c.json(errorResponse(error.message));
    }

    // Handle unexpected errors
    return c.json(errorResponse("Something went wrong"));
  }
});

// Delete a deck by id
deckRoutes.delete("decks/:id", authGuard, async (c) => {
  try {

    // ID VALIDATION
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json(
        errorResponse("id: Expected number, received nan", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["id"],
          message: "Expected number, received nan",
          name: "ZodError",
        }),
      );
    }

    // USER VALIDATION
    const user = c.get("user");

    const deck = await db.select().from(decks).where(eq(decks.id, id)).get();

    if (!deck) {
      throw new HTTPException(404, { message: 
        "Deck not found"
      })
    }

    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete this deck",
      });
    }

    // DELETION
    const deletedDeck = await db
      .delete(decks)
      .where(eq(decks.id, id))
      .returning()
      .get();

    return c.json(successResponse(deletedDeck, "Deck retrieved successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");

      return c.json(errorResponse(errorMessage, error.errors));
    }

    if (error instanceof HTTPException) {
      return c.json(errorResponse(error.message));
    }

    // Handle unexpected errors
    return c.json(errorResponse("Something went wrong"));
  }
});

// Create a new deck
deckRoutes.post("decks", authGuard, async (c) => {
  try {

    const body = await c.req.json();
    const validationResult = createDeckSchema.safeParse(body);

    if (!validationResult.success) {
      // Extract error messages from Zod
      const errorMessage = validationResult.error.issues[0].path[0] + ": " + validationResult.error.issues[0].message;
      return c.json(errorResponse(errorMessage, validationResult.error.issues));
    }


    const { title } = validationResult.data;
    const user = c.get("user");

    const newDeck = await db
      .insert(decks)
      .values({
        title,
        date: new Date(),
        numberOfCards: 0,
        userId: user!.id,
      })
      .returning()
      .get();

    // Return a success response
    return c.json(successResponse(newDeck, "Deck created successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage =
        error.issues.length > 0
          ? error.issues[0].message
          : "Validation error occurred";

      console.log(errorMessage);

      return c.json(
        errorResponse(errorMessage, error.issues), // Pass issues correctly
      );
    }

    // Handle unexpected errors
    return c.json(errorResponse("Failed to create deck"));
  }
});

// Update a deck by id
deckRoutes.patch("decks/:id", authGuard, async (c) => {
  try {

    // ID VALIDATION
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json(
        errorResponse("id: Expected number, received nan", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["id"],
          message: "Expected number, received nan",
          name: "ZodError",
        }),
      );
    }

    // BODY VALIDATION
    const body = await c.req.json();
    const validationResult = updateDeckSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].path[0] + ": " + validationResult.error.issues[0].message;
      return c.json(errorResponse(errorMessage, validationResult.error.issues));
    }

    // USER AUTHORIZATION
    const user = c.get("user");

    const deck = await db.select().from(decks).where(eq(decks.id, id)).get();

    if (!deck) {
      throw new HTTPException(404, { message: 
        "Deck not found"
      })
    }

    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to update this deck",
      });
    }

    // UPDATION
    const { title } = validationResult.data;
    const updatedDeck = await db
      .update(decks)
      .set({ title })
      .where(eq(decks.id, id))
      .returning()
      .get();

    if (!updatedDeck) {
      throw new HTTPException(404, { message: "deck not found" });
    }

    return c.json(successResponse(updatedDeck, "Deck created successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return c.json(errorResponse(errorMessage, error.errors));
    }

    if (error instanceof HTTPException) {
      return c.json(errorResponse(error.message));
    }

    // Handle unexpected errors
    return c.json(errorResponse("Failed to create deck"), 500);
  }
});

export default deckRoutes;

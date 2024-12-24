import { Hono } from "hono";
import { db } from "../db";
import { cards, decks } from "../db/schema";
import {
  createCardSchema,
} from "../validators/schemas";
import { HTTPException } from "hono/http-exception";
import { eq, like, count, SQL, and, or, asc, desc } from "drizzle-orm";
import { errorResponse, successResponse } from "../validators/utils";
import { z } from "zod";
import type { Context } from "../lib/context";
import { authGuard } from "../middleware/auth-guard";

const cardRoutes = new Hono<Context>();

// Get all cards for a deck with optional searching and pagination
cardRoutes.get("decks/:deckId/cards", authGuard, async (c) => {
  try {
    // Parse and validate parameters manually
    const deckId = parseInt(c.req.param("deckId"), 10);
    if (isNaN(deckId)) {
      return c.json(
        errorResponse("deckId: expected number, received NaN", {
          code: "invalid_type",
          expected: "number",
          received: "NaN",
          path: ["deckId"],
          message: "deckId: expected number, received NaN",
          name: "ZodError",
        }),
      );
    }

    const query = c.req.query();
    const search = query.search || undefined;
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "20", 10);
    const sort = query.sort;

    // Validate `page`, `limit`, and `sort`
    if (isNaN(page) || page < 1) {
      return c.json(
        errorResponse("Page should be a positive number", {
          code: "invalid_type",
          expected: "number",
          received: "invalid",
          path: ["page"],
          message: "Page should be a positive number",
          name: "ZodError",
        }),
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return c.json(
        errorResponse("Limit should be a positive integer between 1 and 100", {
          code: "invalid_type",
          expected: "number",
          received: "invalid",
          path: ["limit"],
          message: "Limit should be a positive integer between 1 and 100",
          name: "ZodError",
        }),
      );
    }

    if (sort && sort !== "asc" && sort !== "desc") {
      return c.json(
        errorResponse('Sort must be either "asc" or "desc" if provided', {
          code: "invalid_type",
          expected: "asc || desc",
          received: "invalid",
          path: ["sort"],
          message: "Sort must be either 'asc' or 'desc' if provided",
          name: "ZodError",
        }),
      );
    }

    // Ensure limit does not exceed the maximum allowed value
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);

    // Check if the deck exists
    const deckExists = await db
      .select({ count: count() })
      .from(decks)
      .where(eq(decks.id, deckId))
      .then((result) => result[0]?.count > 0);

    if (!deckExists) {
      return c.json(errorResponse("Deck not found"));
    }

    const user = c.get("user");

    const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get();

    if (deck!.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Forbidden Resource: Unauthorized to access this deck",
      });
    }
    
    // Build the where clause for searching
    const whereClause: (SQL | undefined)[] = [eq(cards.deckId, deckId), eq(cards.userId, user!.id)];
    if (search) {
      whereClause.push(
        or(like(cards.front, `%${search}%`), like(cards.back, `%${search}%`)),
      );
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * effectiveLimit;

    // Determine sorting order
    let orderClause;
    if (sort === "asc") {
      orderClause = asc(cards.date);
    } else if (sort === "desc") {
      orderClause = desc(cards.date);
    } else {
      // Default sorting order if `sort` is not provided or invalid
      orderClause = asc(cards.date);
    }

    // Perform the database queries for cards and total count
    const [allCards, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(cards)
        .where(and(...whereClause))
        .orderBy(orderClause)
        .limit(effectiveLimit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(cards)
        .where(and(...whereClause)),
    ]);

    const totalPages = Math.ceil(totalCount / effectiveLimit);

    return c.json(
      successResponse(allCards, "Cards retrieved successfully", {
        page,
        limit,
        totalPages,
        totalCount,
      }),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => {
          return err.message; // Could be customized further for specific validation failures
        })
        .join(", ");
      return c.json(errorResponse(errorMessage, error.errors));
    }

    if (error instanceof HTTPException) {
      return c.json(errorResponse(error.message));
    }

    // Handle unexpected errors
    return c.json(errorResponse("Something went wrong"));
  }
});

// Get a single card by id for a deck
cardRoutes.get("decks/:deckId/cards/:cardId", authGuard, async (c) => {
  try {
    // Parse and validate parameters manually
    const deckId = parseInt(c.req.param("deckId"), 10);
    const cardId = parseInt(c.req.param("cardId"), 10);

    if (isNaN(deckId)) {
      return c.json(
        errorResponse("deckId: Expected number, received NaN", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["deckId"],
          message: "Expected number, received NaN",
          name: "ZodError",
        }),
      );
    }

    if (isNaN(cardId)) {
      return c.json(
        errorResponse("cardId: Expected number, received NaN", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["cardId"],
          message: "Expected number, received NaN",
          name: "ZodError",
        }),
      );
    }

    const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }

    const user = c.get("user");

    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .get();

    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }

    if (deck.userId != user!.id || card.userId != user!.id) {
      throw new HTTPException(403, { message: "Forbidden Resource: Unauthorized to access card or deck" });
    }

    return c.json(successResponse(card, "Card retrieved successfully"));

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors dynamically
      const errorMessage = error.errors
        .map((err) => {
          return err.message;
        })
        .join(", ");

      return c.json(errorResponse(errorMessage, error.errors));
    }

    if (error instanceof HTTPException) {
      return c.json(errorResponse(error.message));
    }

    // Handle unexpected errors
    return c.json(errorResponse("Something went wrong"));
  }
});

// Delete a card by id for a deck
cardRoutes.delete("decks/:deckId/cards/:cardId", authGuard, async (c) => {
  try {
    const deckId = parseInt(c.req.param("deckId"));
    const cardId = parseInt(c.req.param("cardId"));

    if (isNaN(deckId)) {
      return c.json(
        errorResponse("deckId: Expected number, received NaN", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["deckId"],
          message: "Expected number, received NaN",
          name: "ZodError",
        }),
      );
    }

    if (isNaN(cardId)) {
      return c.json(
        errorResponse("cardId: Expected number, received NaN", {
          code: "invalid_type",
          expected: "number",
          received: "nan",
          path: ["cardId"],
          message: "Expected number, received NaN",
          name: "ZodError",
        }),
      );
    }

    const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }

    const user = c.get("user");

    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .get();

    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }

    if (deck.userId != user!.id || card.userId != user!.id) {
      throw new HTTPException(403, { message: "Forbidden Resource: Unauthorized to delete card" });
    }

    const deletedCard = await db
      .delete(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .returning()
      .get();
    return c.json(successResponse(deletedCard, "Card deleted successfully"));

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors dynamically
      const errorMessage = error.errors
        .map((err) => {
          return err.message;
        })
        .join(", ");

      return c.json(errorResponse(errorMessage, error.errors));
    }

    if (error instanceof HTTPException) {
      return c.json(errorResponse(error.message));
    }

    // Handle unexpected errors
    return c.json(errorResponse("Something went wrong"));
  }
});

// Create a new card for a deck
cardRoutes.post(
  "decks/:deckId/cards", authGuard, 
  async (c) => {
    try {
      // Parse and validate `deckId`
      const deckId = parseInt(c.req.param("deckId"));
      if (isNaN(deckId)) {
        return c.json(
          errorResponse("deckId: Expected number, received NaN", {
            code: "invalid_type",
            expected: "number",
            received: "nan",
            path: ["deckId"],
            message: "Expected number, received NaN",
            name: "ZodError",
          }),
        );
      }

    // Check if the deck exists
    const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }

    const user = c.get("user");

    if (deck.userId != user!.id) {
      throw new HTTPException(403, { message: "Forbidden Resource: Unauthorized to create card" });
    }

      // Parse and validate JSON body using `safeParse`
      const body = await c.req.json();
      const validationResult = createCardSchema.safeParse(body);

      if (!validationResult.success) {
        // Extract error messages from Zod
        const errorMessage = validationResult.error.issues[0].path[0] + ": " + validationResult.error.issues[0].message;
        return c.json(errorResponse(errorMessage, validationResult.error.issues));
      }

      // Extract validated data
      const { front, back } = validationResult.data;

      const newCard = await db
        .insert(cards)
        .values({
          front,
          back,
          date: new Date(),
          deckId,
          userId: user!.id,
        })
        .returning()
        .get();

      return c.json(successResponse(newCard, "Card created successfully"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors dynamically
        const errorMessage = error.errors
          .map((err) => {
            return err.message;
          })
          .join(", ");

        return c.json(errorResponse(errorMessage, error.errors));
      }

      if (error instanceof HTTPException) {
        return c.json(errorResponse(error.message));
      }

      // Handle unexpected errors
      return c.json(errorResponse("Something went wrong"));
    }
  },
);

// Update a card by id for a deck
cardRoutes.patch(
  "decks/:deckId/cards/:cardId", authGuard, 
  async (c) => {
    try {
      const deckId = parseInt(c.req.param("deckId"));
      const cardId = parseInt(c.req.param("cardId"));
      if (isNaN(deckId)) {
        return c.json(
          errorResponse("deckId: Expected number, received NaN", {
            code: "invalid_type",
            expected: "number",
            received: "nan",
            path: ["deckId"],
            message: "Expected number, received NaN",
            name: "ZodError",
          }),
        );
      }

      if (isNaN(cardId)) {
        return c.json(
          errorResponse("cardId: Expected number, received NaN", {
            code: "invalid_type",
            expected: "number",
            received: "nan",
            path: ["cardId"],
            message: "Expected number, received NaN",
            name: "ZodError",
          }),
        );
      }

      // Parse and validate JSON body using `safeParse`
      const body = await c.req.json();
      const validationResult = createCardSchema.safeParse(body);

      if (!validationResult.success) {
        // Extract error messages from Zod
        const errorMessage = validationResult.error.issues[0].path[0] + ": " + validationResult.error.issues[0].message;
        return c.json(errorResponse(errorMessage, validationResult.error.issues));
      }

      // Extract validated data
      const { front, back } = validationResult.data;

      const deck = await db
        .select()
        .from(decks)
        .where(eq(decks.id, deckId))
        .get();
      if (!deck) {
        throw new HTTPException(404, { message: "Deck not found" });
      }

      // USER VALIDATION
      const user = c.get("user");

      const card = await db
        .select()
        .from(cards)
        .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
        .get();

      if (!card) {
        throw new HTTPException(404, { message: "Card not found" });
      }

      if (deck.userId != user!.id || card.userId != user!.id) {
        throw new HTTPException(403, {
          message: "Forbidden Resource: Unauthorized to update card",
        });
      }

      const updatedCard = await db
        .update(cards)
        .set({ front, back })
        .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
        .returning()
        .get();
      return c.json(successResponse(updatedCard, "Card updated successfully"));

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors dynamically
        const errorMessage = error.errors
          .map((err) => {
            return err.message;
          })
          .join(", ");

        return c.json(errorResponse(errorMessage, error.errors));
      }

      if (error instanceof HTTPException) {
        return c.json(errorResponse(error.message));
      }

      // Handle unexpected errors
      return c.json(errorResponse("Something went wrong"));
    }
  },
);

export default cardRoutes;

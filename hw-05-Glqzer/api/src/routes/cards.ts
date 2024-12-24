import { Hono } from "hono";
import { db } from "../db";
import { cards } from "../db/schema";
import {
  createCardSchema,
  updateCardSchema,
  getCardsSchema,
  getCardSchema,
  queryParamsSchema,
} from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { eq, like, count, SQL, and, or } from "drizzle-orm";

const cardRoutes = new Hono();

// Get all cards for a deck with optional searching and pagination
cardRoutes.get(
  "decks/:deckId/cards",
  zValidator("param", getCardsSchema),
  zValidator("query", queryParamsSchema), // Assuming queryParamsSchema handles page, limit, and search
  async (c) => {
    const { deckId } = c.req.valid("param");
    const { page = 1, limit = 20, search } = c.req.valid("query");

    // Ensure limit does not exceed the maximum allowed value
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);

    // Build the where clause for searching
    const whereClause: (SQL | undefined)[] = [eq(cards.deckId, deckId)];
    if (search) {
      whereClause.push(
        or(like(cards.front, `%${search}%`), like(cards.back, `%${search}%`)),
      );
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * effectiveLimit;

    // Perform the database queries for cards and total count
    const [allCards, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(cards)
        .where(and(...whereClause))
        .limit(effectiveLimit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(cards)
        .where(and(...whereClause)),
    ]);

    const totalPages = Math.ceil(totalCount / effectiveLimit);

    // Return the response with the cards and pagination metadata
    return c.json({
      cards: allCards,
      page,
      limit: effectiveLimit,
      totalPages,
      totalCount,
      search: search || null
    });
  },
);

// Get a single comment by id for a post
cardRoutes.get(
  "decks/:deckId/cards/:cardId",
  zValidator("param", getCardSchema),
  async (c) => {
    const { deckId, cardId } = c.req.valid("param");
    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .get();
    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json(card);
  },
);

// Delete a card by id for a deck
cardRoutes.delete(
  "decks/:deckId/cards/:cardId",
  zValidator("param", getCardSchema),
  async (c) => {
    const { deckId, cardId } = c.req.valid("param");
    const deletedCard = await db
      .delete(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .returning()
      .get();
    if (!deletedCard) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json({
      message: "Card successfully deleted"
    });
  },
);

// Create a new card for a deck
cardRoutes.post(
  "decks/:deckId/cards",
  zValidator("param", getCardsSchema),
  zValidator("json", createCardSchema),
  async (c) => {
    const { deckId } = c.req.valid("param");
    const { front, back } = c.req.valid("json");
    const newCard = await db
      .insert(cards)
      .values({
        front,
        back,
        deckId,
      })
      .returning()
      .get();

    return c.json(newCard);
  },
);

// Update a card by id for a deck
cardRoutes.patch(
  "decks/:deckId/cards/:cardId",
  zValidator("param", getCardSchema),
  zValidator("json", updateCardSchema),
  async (c) => {
    const { deckId, cardId } = c.req.valid("param");
    const { front, back } = c.req.valid("json");
    const updatedCard = await db
      .update(cards)
      .set({ front, back })
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .returning()
      .get();

    if (!updatedCard) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json(updatedCard);
  },
);

export default cardRoutes

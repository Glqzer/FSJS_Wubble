import { Hono } from "hono";
import { db } from "../db";
import { decks } from "../db/schema";
import {
  createDeckSchema,
  updateDeckSchema,
  getDeckSchema,
  queryParamsSchema,
} from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { eq, like, count, SQL, and } from "drizzle-orm";

const deckRoutes = new Hono();

// Get all decks with optional searching and pagination
deckRoutes.get("decks", zValidator("query", queryParamsSchema), async (c) => {
  const { search, page = 1, limit = 20 } = c.req.valid("query");

  // Enforce a maximum limit of 100
  const effectiveLimit = Math.min(limit, 100);

  const whereClause: (SQL | undefined)[] = [];
  if (search) {
    whereClause.push(like(decks.title, `%${search}%`));
  }

  const offset = (page - 1) * effectiveLimit;

  const [allDecks, [{ totalCount }]] = await Promise.all([
    db
      .select()
      .from(decks)
      .where(and(...whereClause))
      .limit(effectiveLimit)
      .offset(offset),
    db
      .select({ totalCount: count() })
      .from(decks)
      .where(and(...whereClause)),
  ]);

  const totalPages = Math.ceil(totalCount / effectiveLimit);

  return c.json({
    data: allDecks,
    page,
    limit: effectiveLimit,
    totalPages,
    totalCount,
    search: search || null,
  });
});

// Get a single deck by id
deckRoutes.get("decks/:id", zValidator("param", getDeckSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const deck = await db.select().from(decks).where(eq(decks.id, id)).get();
  if (!deck) {
    throw new HTTPException(404, { message: "Deck not found" });
  }
  return c.json(deck);
});

// Delete a deck by id
deckRoutes.delete(
  "decks/:id",
  zValidator("param", getDeckSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const deletedDeck = await db
      .delete(decks)
      .where(eq(decks.id, id))
      .returning()
      .get();
    if (!deletedDeck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    return c.json({
      message: "Deck and associated cards deleted successfully!"
    });
  },
);

// Create a new deck
deckRoutes.post("decks", zValidator("json", createDeckSchema), async (c) => {
  const { title } = await c.req.json();
  const newDeck = await db
    .insert(decks)
    .values({
      title,
    })
    .returning()
    .get();

  return c.json(newDeck);
});

// Update a deck by id
deckRoutes.patch(
  "decks/:id",
  zValidator("param", getDeckSchema),
  zValidator("json", updateDeckSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const { title } = await c.req.json();
    const updatedDeck = await db
      .update(decks)
      .set({ title })
      .where(eq(decks.id, id))
      .returning()
      .get();

    if (!updatedDeck) {
      throw new HTTPException(404, { message: "deck not found" });
    }
    return c.json(updatedDeck);
  },
);

export default deckRoutes;

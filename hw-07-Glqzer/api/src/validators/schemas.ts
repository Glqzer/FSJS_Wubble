import { z } from "zod";

export const createDeckSchema = z.object({
  title: z
    .string()
    .min(1, "Content is required")
    .max(100, "Content must be 100 characters or less")
    .regex(/^[a-zA-Z0-9\s]*$/, "Title can only contain alphanumeric characters and spaces"),
});

export const updateDeckSchema = createDeckSchema.partial();

export const getDeckSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createCardSchema = z.object({
  front: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be 500 characters or less"),
  back: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be 1000 characters or less"),
});

export const updateCardSchema = createCardSchema.partial();

export const getCardsSchema = z.object({
  deckId: z.coerce.number().int().positive(),
});

export const getCardSchema = z.object({
  deckId: z.coerce.number().int().positive(),
  cardId: z.coerce.number().int().positive(),
});

export const queryParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

// AUTH SCHEMAS

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (value) => {
        return (
          /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value)
        );
      },
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      },
    ),
});
 
export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});
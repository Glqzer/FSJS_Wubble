import { Hono } from "hono";
import deckRoutes from "./routes/decks";
import cardRoutes from "./routes/cards";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { z } from "zod";
import { errorResponse } from "./validators/utils";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Flashcards API");
});

app.route("/", deckRoutes);

app.route("/", cardRoutes);

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

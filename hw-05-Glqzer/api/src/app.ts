import { Hono } from "hono";
import deckRoutes from "./routes/decks";
import cardRoutes from "./routes/cards";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Flashcards API");
});

app.route("/", deckRoutes);

app.route("/", cardRoutes);

// Error handling
app.onError((err, c) => {
  console.error("Caught error:", err);

  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
      },
      400
    );
  } else {
    return c.json(
      {
        message: "Unexpected error occurred",
      },
      500
    );
  }
});

export default app;

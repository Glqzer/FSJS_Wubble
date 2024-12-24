import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: `${BASE_URL}`, // Home page with a list of posts
  error: `${BASE_URL}/404`,
  deck: `${BASE_URL}/decks/:deckId`, // Post page with a list of comments
});
import { API_URL } from "@/env"; // what the fuck
import { CardType, DeckType } from "./types";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";

// Fetch all decks with pagination support (always 10 decks per page)
export const fetchDecks = async (page: number = 1): Promise<{ data: DeckType[], meta: any }> => {
  const response = await fetch(`${API_URL}/decks?sort=desc&page=${page}&limit=10`);

  // Parse the response JSON
  const { success, message, data, meta }: { success: boolean, message: string, data: DeckType[], meta: any } = await response.json();

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error(message || "Unknown error");
  }

  // Return both data and meta if successful
  return { data, meta };
};



// Delete a deck by id
export const deleteDeck = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/decks/${id}`, { method: "DELETE" });

  // If the response is not OK, throw an error with the message from the API
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API request failed! with status: ${response.status}`);
  }

  const { success }: { success: boolean } = await response.json();

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error("Failed to delete deck");
  }

  return true;
};

export const createDeck = async (title: string): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, numberOfCards: 0 }),
  });

  // Parse the response once
  const { success, message, data }: { success: boolean, message: string, data: DeckType } = await response.json();

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error(message || "Failed to create deck");
  }

  // Return the created deck data
  return data;
};


// Edit a deck
export const editDeck = async (id: number, title: string): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  // Parse the response only once
  const responseData = await response.json();

  const { success, message }: { success: boolean, message: string } = responseData;

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error(message || "Failed to edit deck");
  }

  return responseData.data; // Assuming the response contains the updated deck in `data`
};



// CARD FUNCTIONS ARE BELOW

// Fetch all cards for a deck with pagination support (always 10 cards per page)
export const fetchCards = async (deckId: number, page: number = 1): Promise<{ data: CardType[], meta: any }> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards?sort=desc&page=${page}&limit=2`);

  const { success, message, data, meta }: { success: boolean, message: string, data: CardType[], meta: any } = await response.json();

  // If the API returns success as false, throw an error
  if (!success) {
    openPage($router, "error");
    throw new Error(message || "Failed to fetch cards");
  }

  // Return both data and meta if successful
  return { data, meta };
};

// Delete a card for a deck
export const deleteCard = async (deckId: number, cardId: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards/${cardId}`, {
    method: "DELETE",
  });

  const { success }: { success: boolean } = await response.json();

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error("Failed to delete card");
  }

  return true;
};

// Create a card for a deck
export const createCard = async (deckId: number, front: string, back: string): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ front, back }),
  });

  // Parse the response only once
  const responseData = await response.json();

  const { success, message }: { success: boolean, message: string } = responseData;

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error(message || "Failed to create card");
  }

  return responseData.data; // Assuming the response contains the created card in `data`
};


// Edit a card for a deck
export const editCard = async (deckId: number, front: string, back: string, cardId: number): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards/${cardId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ front, back }),
  });

  // Parse the response only once
  const responseData = await response.json();

  const { success, message }: { success: boolean, message: string } = responseData;

  // If the API returns success as false, throw an error
  if (!success) {
    throw new Error(message || "Failed to edit card");
  }

  return responseData.data; // Assuming the response contains the updated card in `data`
};



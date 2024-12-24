import { API_URL } from "@/env"; // what the fuck
import { DeckType } from "./types";

// Fetch all decks
export const fetchDecks = async (): Promise<DeckType[]> => {
  const response = await fetch(`${API_URL}/decks`);
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  
  const data = await response.json();
  return data; // Return the decks array from the response
};

// Delete a deck by id
export const deleteDeck = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/decks/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true;
};

// Create a deck
export const createDeck = async (title: string): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks`, { // Changed to /decks
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, numberOfCards: 0 }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: DeckType = await response.json();
  return data; // Assuming the response contains the created deck
};

// Edit a deck
export const editDeck = async ( // Changed from editPost to editDeck
  id: number,
  title: string,
): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks/${id}`, { // Changed to /decks
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: DeckType = await response.json();
  return data; // Assuming the response contains the updated deck
};

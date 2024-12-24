import { atom } from "nanostores";
import { CardType, DeckType } from "@/data/types";

export const $decks = atom<DeckType[]>([]);

export function setDecks(decks: DeckType[]) {
  $decks.set(decks);
}

export function addDeck(deck: DeckType) {
  $decks.set([deck, ...$decks.get()]);
}

export function removeDeck(id: number) {
  $decks.set($decks.get().filter((deck) => deck.id !== id));
}

export function updateDeckTitle(id: number, title: string) {
  $decks.set(
    $decks.get().map((deck) => {
      if (deck.id === id) {
        return { ...deck, title: title };
      }
      return deck;
    }),
  );
}

// CARD STUFF IS BELOW

export const $cards = atom<CardType[]>([]);

export function setCards(cards: CardType[]) {
  $cards.set(cards);
}

export function addCard(card: CardType) {
  $cards.set([card, ...$cards.get()]);
}

export function removeCard(id: number) {
  $cards.set($cards.get().filter((card) => card.id !== id));
}

export function updateCardContent(id: number, front: string, back: string) {
  $cards.set(
    $cards.get().map((card) => {
      if (card.id === id) {
        return { ...card, front: front, back: back };
      }
      return card;
    }),
  );
}

// Create a store to track the visibility of the "Add Deck" dialog
export const $showAddDeck = atom(false);

// Create a store to track the visibility of the "Add Card" dialog
export const $showAddCard = atom(false);

// Functions to toggle the visibility of these dialogs
export const toggleAddDeck = () => {
  $showAddDeck.set(!$showAddDeck.get());
};

export const toggleAddCard = () => {
  $showAddCard.set(!$showAddCard.get());
};

// AUTH STORES GO UNDER HERE

import { persistentMap } from "@nanostores/persistent";
import type { UserType } from "@/data/types";

const defaultUser: UserType = {
  id: "",
  name: "",
  username: "",
};

export const $user = persistentMap<UserType>("user:", defaultUser);

export function setUser(user: UserType) {
  $user.set(user);
}

export function clearUser() {
  $user.set(defaultUser);
}
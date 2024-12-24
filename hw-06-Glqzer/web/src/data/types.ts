export interface DeckType {
    id: number;
    title: string;
    date: string;
    numberOfCards: number;
  }

export type CardType = {
    id: number;
    front: string;
    back: string;
    date: string;
    deckId: number;
};
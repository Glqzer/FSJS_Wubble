import { DeckType } from "@/data/types";
import DeckActions from "./deck-actions";
import { useState } from "react";
import EditDeck from "./edit-deck-dialog";
import { $router } from "@/lib/router"; // Assuming $router is the Nanostores router
import { openPage } from "@nanostores/router";

type DeckProps = {
  deck: DeckType;
};

const Deck = ({ deck }: DeckProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const navigateToDeck = () => {
    // Use the Nanostores router to update the route
    openPage($router, "deck", { deckId: deck.id.toString() });
  };

  return (
    <div className="relative p-4 bg-white border-b rounded-md shadow-md">
      {/* Container for Deck Actions, positioned outside the deck box */}
      <div className="absolute top-0 right-0 z-10 mt-2 mr-2">
        <DeckActions deck={deck} setIsEditing={setIsEditing} />
      </div>

      {/* Deck content */}
      <div
        className="relative w-11/12 h-40 p-4 bg-white border-b rounded-md shadow-md cursor-pointer"
        onClick={navigateToDeck}
      >
        {/* Deck title */}
        <h2 className="text-xl font-bold">
          {deck.title}
        </h2>

        {/* Number of cards (upper left) */}
        <p className="text-sm text-gray-500">{deck.numberOfCards} cards</p>

        {/* Bottom left creation date */}
        <div className="mt-auto text-sm text-left text-gray-400">
          <p>Created on: {new Date(deck.date).toLocaleDateString()}</p>
        </div>
      </div>

      {isEditing && <EditDeck deck={deck} setIsEditing={setIsEditing} />}
    </div>
  );
};

export default Deck;

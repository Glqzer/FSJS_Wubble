import { DeckType } from "@/data/types";
import DeckActions from "./deck-actions"
import { useState } from "react";
import EditDeck from "./edit-deck-dialog";

type DeckProps = {
  deck: DeckType;
}

const Deck = ({ deck }: DeckProps) => {

  const [isEditing, setIsEditing] = useState(false);

  
  return (
    <div className="p-4 border-b">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{deck.title}</h2>
          <p className="text-gray-500">{deck.numberOfCards} cards</p>
        </div>
        <DeckActions deck={deck} setIsEditing={setIsEditing} />
      </div>

      {isEditing && (
          <EditDeck deck={deck} setIsEditing={setIsEditing} />
      )}
      
    </div>
  );
};

export default Deck;

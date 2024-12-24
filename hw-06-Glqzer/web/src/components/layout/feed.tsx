import { useState, useEffect } from "react";
import Header from "./header";
import Decks from "../decks/decks";
import Cards from "../cards/cards"; // Assuming you have a Cards component to display cards

type FeedProps = {
  deckId: number | null;
};

const Feed = ({ deckId }: FeedProps) => {
  const [totalItems, setTotalItems] = useState<number>(0); // Total items (decks or cards)
  const [startIndex, setStartIndex] = useState<number>(0); // Starting index of current page
  const [endIndex, setEndIndex] = useState<number>(0); // Ending index of current page
  const [itemType, setItemType] = useState<"Decks" | "Cards">("Decks"); // Type of items being shown

  useEffect(() => {
    if (deckId !== null) {
      setItemType("Cards"); // Show cards when a deckId is provided
    } else {
      setItemType("Decks"); // Show decks when no deckId is provided
    }
  }, [deckId]);

  // Callback to update header with pagination data
  const updateHeaderData = (totalItems: number, startIndex: number, endIndex: number, type: "Decks" | "Cards") => {
    setTotalItems(totalItems);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setItemType(type);
  };

  return (
    <div className="flex flex-col w-full min-h-screen border-x">
      {/* Pass the pagination data to Header */}
      <Header
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        itemType={itemType}
      />

      {/* Conditionally render Decks or Cards based on deckId */}
      {deckId === null ? (
        <Decks onUpdateHeader={updateHeaderData} /> // Pass the update function to Decks
      ) : (
        <Cards deckId={deckId} onUpdateHeader={updateHeaderData} /> // Pass the update function to Cards
      )}
    </div>
  );
};

export default Feed;

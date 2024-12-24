import { useEffect } from "react";
import Deck from "./deck";
import useQueryDecks from "@/hooks/use-query-decks";
import DeckPagination from "./deck-pagination";
import { toast } from "../ui/use-toast";
import useAuth from "@/hooks/use-auth";

type DecksProps = {
  onUpdateHeader: (
    totalItems: number,
    startIndex: number,
    endIndex: number,
    itemType: "Decks" | "Cards",
  ) => void;
};

const Decks = ({ onUpdateHeader }: DecksProps) => {
  const { user } = useAuth();
  if (user.name) {
    const { decks, currentPage, totalPages, totalDecks, loading, goToPage } =
    useQueryDecks();

  useEffect(() => {
    // Calculate pagination indices
    const startIndex = (currentPage - 1) * 10 + 1; // Assuming 10 items per page
    const endIndex = Math.min(currentPage * 10, totalDecks);

    // Pass pagination info to the parent component (Feed)
    onUpdateHeader(totalDecks, startIndex, endIndex, "Decks");
  }, [decks, currentPage, totalDecks, onUpdateHeader]);

  useEffect(() => {
    if (!loading) {
      if (!decks) {
        toast({
          variant: "destructive",
          title: "Sorry! There was an error reading the decks 🙁",
          description: "API Error when reading decks",
        });
      }
    }
  }, [loading, decks]);

  return (
    <div className="relative min-h-screen">
      {" "}
      {/* Ensure parent div takes full height */}
      {/* Loading State */}
      {loading && <div className="flex justify-center mt-4">Loading...</div>}
      {/* Show message when no decks are present */}
      {!loading && decks.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-black">
          <div>No decks found. Add some decks to get started!</div>

          {/* Pagination appears under the text when no decks */}
          <div className="mt-6">
            <DeckPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>
      )}
      {/* Render decks */}
      {!loading && decks.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {/* Decks List */}
          {decks.map((deck) => (
            <Deck key={deck.id} deck={deck} />
          ))}
        </div>
      )}
      {/* Pagination Component (Only appears if decks exist) */}
      {!loading && totalPages > 1 && decks.length > 0 && (
        <div className="flex justify-center mt-6">
          <DeckPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}
};

export default Decks;

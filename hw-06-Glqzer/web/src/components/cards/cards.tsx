import { useEffect } from "react";
import Card from "./card";
import useQueryCards from "@/hooks/use-query-cards";
import CardPagination from "@/components/cards/card-pagination";
import { toast } from "../ui/use-toast";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";

const Cards = ({
  deckId,
  onUpdateHeader,
}: {
  deckId: number;
  onUpdateHeader: (
    totalItems: number,
    startIndex: number,
    endIndex: number,
    type: "Decks" | "Cards",
  ) => void;
}) => {
  const { cards, currentPage, totalPages, totalItems, loading, goToPage } =
    useQueryCards(deckId);

  // Update pagination info to the header
  useEffect(() => {
    const itemsPerPage = 2; // Set 2 cards per page
    const startIndex = (currentPage - 1) * itemsPerPage + 1; // Calculate start index for 2 cards per page
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems); // Ensure endIndex doesn't exceed totalItems
    onUpdateHeader(totalItems, startIndex, endIndex, "Cards");
  }, [currentPage, totalItems, onUpdateHeader]);

  useEffect(() => {
    if (!loading) {
      if (!cards) {
        openPage($router, "error");
        toast({
          variant: "destructive",
          title: "Sorry! There was an error reading the cards 🙁",
          description: "An unexpected error occured",
        });
      }
    }
  }, [loading, cards]);

  return (
    <div className="relative min-h-screen">
      {" "}
      {/* Ensure parent div takes full height */}
      {loading && <div className="text-center">Loading...</div>}
      {/* Show message when no cards are present */}
      {!loading && cards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-black">
          No cards in this deck. Add some cards to get started!
        </div>
      )}
      {/* Render cards */}
      {!loading && cards.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
          {" "}
          {/* Smaller gap between cards */}
          {cards.map((card) => (
            <div className="w-full p-4" key={card.id}>
              <Card card={card} />
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4">
          <CardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default Cards;

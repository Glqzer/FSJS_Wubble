import { useEffect, useState } from "react";
import { fetchCards } from "@/data/api";
import { useStore } from "@nanostores/react";
import { setCards, $cards } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";

function useQueryCards(deckId: number) {
  const cards = useStore($cards);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Store totalItems
  const [loading, setLoading] = useState(false);

  const loadCards = async (page: number = 1) => {
    try {
      setLoading(true);
      const { data, meta } = await fetchCards(deckId, page);
      setCards(data);
      setTotalPages(meta.totalPages);
      setTotalItems(meta.totalCount); // Set totalItems from the response
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the cards 🙁",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards(currentPage);
  }, [deckId, currentPage]);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return { cards, currentPage, totalPages, totalItems, loading, goToPage }; // Return totalItems
}

export default useQueryCards;

import { useEffect, useState } from "react";
import { fetchDecks } from "@/data/api";
import { useStore } from "@nanostores/react";
import { setDecks, $decks } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";

function useQueryDecks() {
  const decks = useStore($decks);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDecks, setTotalDecks] = useState(0); // Store totalDecks
  const [loading, setLoading] = useState(false);

  const loadDecks = async (page: number = 1) => {
    try {
      setLoading(true);
      const { data, meta } = await fetchDecks(page);
      setDecks(data);
      setTotalPages(meta.totalPages);
      setTotalDecks(meta.totalCount); // Set totalDecks from the response
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the decks 🙁",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks(currentPage);
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return { decks, currentPage, totalPages, totalDecks, loading, goToPage }; // Return totalDecks
}

export default useQueryDecks;

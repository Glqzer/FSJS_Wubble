import { createDeck, deleteDeck, editDeck } from "@/data/api";
import { addDeck, removeDeck, updateDeckTitle } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";

function useMutationDecks() {
  const deleteDeckById = async (deckId: number) => {
    try {
      await deleteDeck(deckId);
      removeDeck(deckId);
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the deck 🙁",
        description: errorMessage,
      });
    }
  };

  const addNewDeck = async (title: string) => {
    try {
      if (!title) {
        throw new Error("Title cannot be empty!");
      }
      const newDeck = await createDeck(title);
      addDeck(newDeck);
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding the deck 🙁",
        description: errorMessage,
      });
    }
  };

  const updateDeck = async (deckId: number, title: string) => {
    try {
      if (!title) {
        throw new Error("Title cannot be empty!");
      }
      const updatedDeck = await editDeck(deckId, title);
      updateDeckTitle(updatedDeck.id, updatedDeck.title);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error editing the deck 🙁",
        description: errorMessage,
      });
    }
  };

  return {
    deleteDeckById,
    addNewDeck,
    updateDeck,
  };
}

export default useMutationDecks;

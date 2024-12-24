import { toast } from "@/components/ui/use-toast";
import { createCard, deleteCard, editCard } from "@/data/api";
import { addCard, removeCard, updateCardContent } from "@/lib/store";

function useMutationCards(deckId: number) {
  const deleteCardById = async (cardId: number) => {
    try {
      await deleteCard(deckId, cardId);
      removeCard(cardId);
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the card 🙁",
        description: errorMessage,
      });
    }
  };

  const addNewCard = async (front: string, back: string) => {
    try {
      const newCard = await createCard(deckId, front, back);
      addCard(newCard);
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new card 🙁",
        description: errorMessage,
      });
    }
  };

  const updateCard = async (cardId: number, front: string, back: string) => {
    try {
      const updatedCard = await editCard(deckId, front, back, cardId);
      updateCardContent(updatedCard.id, updatedCard.front, updatedCard.back);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the card 🙁",
        description: errorMessage,
      });
    }
  };

  return {
    deleteCardById,
    addNewCard,
    updateCard,
  };
}

export default useMutationCards;
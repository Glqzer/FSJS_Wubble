import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useMutationCards from "@/hooks/use-mutation-cards";

type DeleteCardDialogProps = {
  cardId: number;
  deckId: number; // Added deckId as a required prop
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteCardDialog = ({ cardId, deckId, setIsDeleting }: DeleteCardDialogProps) => {
  const { deleteCardById } = useMutationCards(deckId); // Initialize with deckId

  const handleDelete = () => {
    deleteCardById(cardId); // Pass only the cardId to delete
    setIsDeleting(false); // Close the dialog after deletion
  };

  const handleCancel = () => {
    setIsDeleting(false); // Close the dialog when canceled
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the card and remove it from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCardDialog;

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
  import useMutationDecks from "@/hooks/use-mutation-decks"; // Assuming there's a similar hook for decks
  
  type DeleteDeckDialogProps = {
    deckId: number; // The ID of the deck to delete
    setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>; // To close the dialog
  };
  
  const DeleteDeckDialog = ({ deckId, setIsDeleting }: DeleteDeckDialogProps) => {
    const { deleteDeckById } = useMutationDecks(); // Initialize with a hook for deleting decks
  
    const handleDelete = () => {
      deleteDeckById(deckId); // Delete the deck by its ID
      setIsDeleting(false); // Close the dialog after deletion
    };
  
    const handleCancel = () => {
      setIsDeleting(false); // Close the dialog when canceled
    };
  
    return (
      <AlertDialog open={true}> {/* Always open when isDeleting is true */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the deck and all of its cards.
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
  
  export default DeleteDeckDialog;
  
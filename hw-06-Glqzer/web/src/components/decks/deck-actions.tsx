import { Button } from "@/components/ui/button";
import { DeckType } from "@/data/types";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteDeckDialog from "./delete-deck-dialog"; // Import the DeleteDeckDialog component

type DeckActionsProps = {
  deck: DeckType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeckActions = ({ deck, setIsEditing }: DeckActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false); // State to control visibility of the delete dialog

  const handleDelete = () => {
    setIsDeleting(true); // Show the delete confirmation dialog
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <DotsVerticalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Button variant={"default"} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button variant={"default"} onClick={handleDelete}>
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add DeleteDeckDialog here, conditionally render it */}
      {isDeleting && (
        <DeleteDeckDialog
          deckId={deck.id} // Pass the deck ID
          setIsDeleting={setIsDeleting} // Close the dialog after deletion
        />
      )}
    </div>
  );
};

export default DeckActions;

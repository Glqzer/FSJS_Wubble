import { Button } from "@/components/ui/button";
import { DeckType } from "@/data/types";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useMutationDecks from "@/hooks/use-mutation-decks"

type DeckActionsProps = {
  deck: DeckType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeckActions = ({ deck, setIsEditing }: DeckActionsProps) => {

  const { deleteDeckById } = useMutationDecks();
  
  const handleDelete = async () => {
    deleteDeckById(deck.id)
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"} size={"icon"}>
            <DotsVerticalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button variant={"default"} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={"default"} onClick={handleDelete}>
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DeckActions;

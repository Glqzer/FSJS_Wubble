import { Button } from "@/components/ui/button";
import { CardType } from "@/data/types";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteCardDialog from "./delete-card-dialog";
import EditCardDialog from "./edit-card-dialog";

type CardActionsProps = {
  card: CardType;
};

const CardActions = ({ card }: CardActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
            <Button variant={"default"} onClick={() => setIsDeleting(true)}>
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conditionally render dialogs */}
      {isEditing && <EditCardDialog card={card} setIsEditing={setIsEditing} />}
      {isDeleting && (
        <DeleteCardDialog
          cardId={card.id}
          deckId={card.deckId}
          setIsDeleting={setIsDeleting}
        />
      )}
    </div>
  );
};

export default CardActions;

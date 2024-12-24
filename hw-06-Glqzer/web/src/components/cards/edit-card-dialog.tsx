import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { CardType } from "@/data/types";
import useMutationCards from "@/hooks/use-mutation-cards";

type EditCardProps = {
  card: CardType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCardDialog = ({ card, setIsEditing }: EditCardProps) => {
  const [id, setId] = useState(0);
  const [deckId, setDeckId] = useState(0);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const { updateCard } = useMutationCards(deckId);

  useEffect(() => {
    if (card) {
      setId(card.id);
      setDeckId(card.deckId);
      setFront(card.front);
      setBack(card.back);
    }
  }, [card]);

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFront(e.target.value);
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBack(e.target.value);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (deckId && id) {
      await updateCard(id, front, back);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>Edit the front and back of your card.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="front" className="text-right">
              Front
            </Label>
            <Input
              id="front"
              value={front}
              className="col-span-3"
              onChange={handleFrontChange}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="back" className="text-right">
              Back
            </Label>
            <Input
              id="back"
              value={back}
              className="col-span-3"
              onChange={handleBackChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="reset" variant={"secondary"} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardDialog;

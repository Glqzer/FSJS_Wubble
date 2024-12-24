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
import { useState } from "react";
import useMutationDecks from "@/hooks/use-mutation-decks";

type AddDeckProps = {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AddDeck({ setIsCreating }: AddDeckProps) {
  
  const [title, setTitle] = useState("");
  const { addNewDeck } = useMutationDecks();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      addNewDeck(title);
      setTitle("");
      setIsCreating(false);
  };

  const handleCancel = () => {
    setTitle("");
    setIsCreating(false);
  };

  return (
    <Dialog defaultOpen onOpenChange={setIsCreating}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Deck</DialogTitle>
          <DialogDescription>Give a title to your deck here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              className="col-span-3"
              onChange={handleTextChange}
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
}

export default AddDeck;

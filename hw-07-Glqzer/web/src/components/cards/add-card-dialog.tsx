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
import useMutationCards from "@/hooks/use-mutation-cards";
import { toast } from "@/components/ui/use-toast"; // Ensure you have a toast utility in place

type AddCardProps = {
  deckId: number;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>; // Add a function to control dialog state
};

export function AddCard({ deckId, setIsCreating }: AddCardProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const { addNewCard } = useMutationCards(deckId);

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFront(e.target.value);
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBack(e.target.value);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!front || !back) {
      toast({
        variant: "destructive",
        title: "Fields cannot be empty! 🙁",
        description: `Please fill out both the front and back of your card.`,
      });
      return;
    }
    await addNewCard(front, back); // Add the new card
    setFront(""); // Clear fields after save
    setBack("");
    setIsCreating(false); // Close the dialog after saving
    window.location.reload();
  };

  const handleCancel = () => {
    setFront(""); // Clear fields on cancel
    setBack("");
    setIsCreating(false); // Close the dialog on cancel
  };

  return (
    <Dialog open={true} onOpenChange={setIsCreating}> {/* Ensure dialog is always controlled */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
          <DialogDescription>
            Add a front and back for your card here.
          </DialogDescription>
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
}

export default AddCard;

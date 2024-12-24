import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { DeckType } from "@/data/types"
import useMutationDecks from "@/hooks/use-mutation-decks";

type EditDeckProps = {
  deck: DeckType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditDeck = ({ deck, setIsEditing }: EditDeckProps) => {

  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const { updateDeck } = useMutationDecks();

  useEffect(() => {
    if (deck && deck.id !== id && deck.title !== title) {
      setId(deck.id);
      setTitle(deck.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
      };
     

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        updateDeck(id, title)
        setTitle("");
        setIsEditing(false);
      };
     
      const handleCancel = () => {
        setTitle("");
        setIsEditing(false);
      };
    
    return (
      <Dialog defaultOpen>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Give a title to your deck here.
            </DialogDescription>
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
    )
  }

export default EditDeck;
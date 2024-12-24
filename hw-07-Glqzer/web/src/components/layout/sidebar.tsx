import { HomeIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useStore } from "@nanostores/react";
import { $router } from "@/lib/router"; // Access route directly
import { openPage } from "@nanostores/router";

type SidebarProps = {
  onOpenAddDeck: () => void;
  onOpenAddCard: () => void;
};

const Sidebar = ({ onOpenAddDeck, onOpenAddCard }: SidebarProps) => {
  const page = useStore($router); // Access current route directly

  if (!page || !page.route) return null; // Ensure route is available

  const handleHomeClick = () => {
    openPage($router, "home"); // Navigate to home page
  };

  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      {/* Home button: Navigate to "home" route */}
      <Button aria-label={"Home"} variant="ghost" size="icon" onClick={handleHomeClick}>
        <HomeIcon className="w-5 h-5" />
      </Button>

      {/* Show "Make a Deck" button on the home page */}
      {page.route === "home" && (
        <Button
          aria-label={"Make a Deck"}
          variant="default" // Default variant (black)
          size="icon"
          onClick={onOpenAddDeck} // Trigger Add Deck dialog
        >
          <PlusCircledIcon className="w-5 h-5" />
        </Button>
      )}

      {/* Show "Make a Card" button on the deck page */}
      {page.route === "deck" && (
        <Button
          aria-label={"Make a Card"}
          variant="destructive" // Destructive variant (red)
          size="icon"
          onClick={onOpenAddCard} // Trigger Add Card dialog
        >
          <PlusCircledIcon className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;

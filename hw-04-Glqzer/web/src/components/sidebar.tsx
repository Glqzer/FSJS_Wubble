import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ setIsCreating }: SidebarProps) => {
  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      <Button aria-label={"Home"} variant="ghost" size="icon">
        <HomeIcon className="w-5 h-5" />
      </Button>
      <Button aria-label={"Search"} variant="ghost" size="icon">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>
      <Button aria-label={"Make a Deck"} variant="default" size="icon" onClick={() => setIsCreating(true)}>
          <PlusCircledIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Sidebar;

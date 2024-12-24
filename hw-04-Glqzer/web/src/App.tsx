import { useState } from "react";
import Feed from "./components/feed";
import Sidebar from "./components/sidebar";
import AddDeck from "./components/add-deck-dialog";
import { Toaster } from "./components/ui/toaster";

function App() {

  const [isCreating, setIsCreating] = useState(false)
  
  return (
    <div className="flex min-h-dvh">
      <div className="flex-1 min-w-14">
        <Sidebar setIsCreating={setIsCreating}/>
      </div>
      <div className="w-full max-w-md mx-auto md:max-w-lg">
        <Feed />
      </div>

      {isCreating && (
          <AddDeck setIsCreating={setIsCreating} />
      )}
      
      <div className="flex-1">{/* Placeholder for another sidebar */}</div>
      <Toaster />
    </div>
  );
}

export default App;

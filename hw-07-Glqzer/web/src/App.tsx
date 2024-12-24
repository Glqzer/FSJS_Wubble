import { useEffect, useState } from "react";
import Feed from "./components/layout/feed";
import Sidebar from "./components/layout/sidebar";
import AddDeck from "./components/decks/add-deck-dialog";
import AddCard from "./components/cards/add-card-dialog";
import { Toaster } from "./components/ui/toaster";
import { useStore } from "@nanostores/react";
import { $router } from "@/lib/router";
import { openPage } from "@nanostores/router";
import Login from "./pages/login";
import Register from "./pages/register";
import UserMenu from "./components/layout/user-menu";
import useAuth from "./hooks/use-auth";

function App() {
  const page = useStore($router); // Access route directly
  const [isCreating, setIsCreating] = useState(false);
  const [isCardCreating, setIsCardCreating] = useState(false); // State for AddCard dialog
  const { user, validate } = useAuth();

  useEffect(() => {
    if ( !user.name && page && page.route !== "login" && page.route != "register" && page.route != "error" ) {
      openPage($router, "login");
    }
  }, [user.name, page]);

  useEffect(() => {
    if (user.name) {
      validate();
    }
  });

  // Handle 404 for unknown routes or invalid deckId
  if (!page || (page.route === "deck" && !page.params?.deckId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <h1>404 Not Found</h1>
        <p>The page you're looking for does not exist.</p>
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
          onClick={() => {
            if (!user.name) {
              openPage($router, "login")
            } else {
              openPage($router, "home")
            }
          }
        } // Navigate back to the home page
        >
          Go to Home
        </button>
      </div>
    );
  }
  
  if (page.route === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <h1>404 Not Found</h1>
        <p>The page you're looking for does not exist.</p>
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
          onClick={() => {
            if (!user.name) {
              openPage($router, "login")
            } else {
              openPage($router, "home")
            }
          }
          } // Navigate back to the home page
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Handle logging in and registering.
  if (page.route === "login" || page.route === "register") {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        {page.route === "login" && <Login />}
        {page.route === "register" && <Register />}
      </div>
    );
  }

  // Parse the deckId to a number if it's provided
  const deckId = page.route === "deck" ? Number(page.params.deckId) : null;

  // Callback function for opening AddDeck dialog
  const onOpenAddDeck = () => setIsCreating(true);

  // Callback function for opening AddCard dialog
  const onOpenAddCard = () => setIsCardCreating(true);

  return (
    <div className="flex min-h-dvh">
      <div className="flex-1 min-w-14">
        {/* Pass the callback functions to Sidebar */}
        <Sidebar onOpenAddDeck={onOpenAddDeck} onOpenAddCard={onOpenAddCard} />
      </div>
      <div className="w-full max-w-md mx-auto md:max-w-lg">
        {/* Show different views based on the route */}
        {page.route === "home" && <Feed deckId={null} />}
        {page.route === "deck" && deckId && <Feed deckId={deckId} />}
      </div>
      <div className="flex-1"><UserMenu /></div>

      {/* Show AddDeck dialog if 'isCreating' is true */}
      {isCreating && <AddDeck setIsCreating={setIsCreating} />}

      {/* Show AddCard dialog if 'isCardCreating' is true and deckId is valid */}
      {isCardCreating && deckId && <AddCard deckId={deckId} setIsCreating={setIsCardCreating} />}
      <Toaster />
    </div>
  );
}

export default App;

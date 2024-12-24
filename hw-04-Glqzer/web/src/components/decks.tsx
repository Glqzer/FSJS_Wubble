import Deck from "./deck";
import useQueryDecks from "@/hooks/use-query-decks";

const Decks = () => {
  const { decks } = useQueryDecks();

  return (
    <div>
      {decks.map((deck) => (
          <Deck key={deck.id} deck={deck} />
        ))}
    </div>
  );
};

export default Decks;
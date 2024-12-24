import { CardType } from "@/data/types";
import { useState } from "react";
import CardActions from "./card-actions";

const Card = ({ card }: { card: CardType }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="relative p-4 bg-white border-b rounded-md shadow-md">
      {/* Dropdown for actions - positioned outside the box */}
      <div className="absolute top-0 right-0 mt-2 mr-2">
        <CardActions card={card} />
      </div>

      {/* Card content */}
      <div
        className={`flex items-center w-96 justify-center p-6 text-center border rounded-md cursor-pointer h-60 hover:shadow-md ${
          isFlipped ? "bg-black text-white" : "bg-white text-gray-700"
        }`}
        onClick={handleFlip}
      >
        <p className="text-xl">{isFlipped ? card.back : card.front}</p>
      </div>
    </div>
  );
};

export default Card;

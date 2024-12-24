type HeaderProps = {
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemType: "Decks" | "Cards";
};

const Header = ({ totalItems, startIndex, endIndex, itemType }: HeaderProps) => {
  const textColor = itemType === "Decks" ? "text-black" : "text-red-600"; // Conditional text color
  const fontWeight = "font-bold"; // Make text bold

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b"> {/* Added px-4 for side padding */}
      <div className={`ml-auto ${textColor} ${fontWeight}`}>
        Showing {startIndex} - {endIndex} of {totalItems} {itemType}
      </div>
    </div>
  );
};

export default Header;

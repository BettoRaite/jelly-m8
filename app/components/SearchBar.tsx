import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
type Props = {
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  className?: string;
  classNameContainer?: string;
  showSearchBtn?: boolean;
  styles?: {
    btnText?: string;
    text?: string;
  };
};
function SearchBar({
  onSearch,
  onChange,
  className,
  classNameContainer,
  showSearchBtn = true,
  styles = {
    btnText: "text-slate-500 active:text-white",
    text: "text-gray-700",
  },
}: Props) {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onChange?.(event.target.value);
  };

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const { btnText, text } = styles;
  return (
    <div className={joinClasses(classNameContainer, "flex items-center gap-4")}>
      <input
        type="text"
        placeholder="Поиск..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className={joinClasses(
          className,
          "p-2 px-4 focus:outline-none border rounded-xl focus:border-purple-300 transition duration-300 font-bold",
          text
        )}
      />
      {showSearchBtn && (
        <Button
          type="button"
          onClick={handleSearch}
          variant="outline"
          className={`bg-opacity-20  border border-gray-500 hover:border-opacity-30 active:border-gray-100
        shadow-lg  active:bg-purple-400 font-bold ${btnText}`}
        >
          <BiSearch />
          Search
        </Button>
      )}
    </div>
  );
}

export default SearchBar;

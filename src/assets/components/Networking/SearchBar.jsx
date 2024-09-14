import React from "react";
import { FaFilter } from "react-icons/fa";

const SearchBar = ({ searchQuery, setSearchQuery, onFilterClick }) => {
  return (
    <div className="w-full flex items-center bg-white rounded-lg shadow-md h-11">
      <input
        type="text"
        placeholder="Search Alumni..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow h-full pl-4 text-gray-700 text-base font-bold bg-transparent outline-none rounded-l-lg"
      />
      <button
        onClick={onFilterClick}
        className="h-full px-3 rounded-r-lg bg-[#1c255b] text-white border-2 border-[#1c255b] hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b] transition-colors duration-300"
      >
        <FaFilter size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
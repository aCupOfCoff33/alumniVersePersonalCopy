import React, { useEffect, useRef, useState } from "react";
import SearchBarWithFilter from "./SearchBarWithFilter";
import DisplayGrid from "./DisplayGrid";
import { cards } from "./cardsData";
import FilterForCompany from "./FilterForCompany";
import FilterForLocation from "./FilterForLocation";
import FilterForMajor from "./FilterForMajor";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for all selected filters
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);

  // State to show/hide filters
  const [showFilters, setShowFilters] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Toggle filter visibility when the filter button is clicked
  const onFilterClick = () => {
    setShowFilters(!showFilters);
  };

  // Filter the cards based on all three filters (companies, locations, majors)
  const filteredCards = cards.filter(
    (card) =>
      (card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCompanies.length === 0 ||
        selectedCompanies.includes(card.description)) &&
      (selectedLocations.length === 0 ||
        selectedLocations.includes(card.workplace)) &&
      (selectedMajors.length === 0 ||
        selectedMajors.includes(card.fieldOfStudy))
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center w-full text-white">
      {/* Center the search bar */}
      <div className="flex justify-center w-full max-w-7xl mt-8">
        <SearchBarWithFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterClick={onFilterClick}
        />
      </div>

      {/* Conditionally render filters based on showFilters state */}
      {showFilters && (
        <div className="flex flex-col md:flex-row justify-between mt-8 space-y-4 md:space-y-0 md:space-x-8 w-full max-w-7xl">
          {/* White box styling removed; Apply padding and styling directly to each filter */}
          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md text-black">
            <FilterForCompany
              selectedCompanies={selectedCompanies}
              setSelectedCompanies={setSelectedCompanies} showMore={undefined}            />
          </div>

          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md text-black">
            <FilterForLocation
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations} showMore={undefined}            />
          </div>

          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md text-black">
            <FilterForMajor
              selectedMajors={selectedMajors}
              setSelectedMajors={setSelectedMajors} showMore={undefined}            />
          </div>
        </div>
      )}

      {/* Display grid for filtered cards */}
      <div className=" w-full max-w-7xl">
        <DisplayGrid
          filteredCards={filteredCards}
          active={active}
          setActive={setActive}
          cardRef={React.createRef<HTMLDivElement>()}
        />
      </div>
    </div>
  );
}

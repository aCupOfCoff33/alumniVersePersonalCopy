import React, { useEffect, useRef, useState } from "react";
import SearchBarWithFilter from "./SearchBarWithFilter";
import DisplayGrid from "./DisplayGrid";
import { cards } from "./cardsData";
import FilterForCompany from "./FilterForCompany";
import FilterForLocation from "./FilterForLocation";
import FilterForMajor from "./FilterForMajor";
import { AnimatePresence, motion } from "framer-motion"; // Import motion and AnimatePresence

// CloseIcon component for the close (X) button
export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }} // Faster exit transition
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

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
          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md text-black">
            <FilterForCompany
              selectedCompanies={selectedCompanies}
              setSelectedCompanies={setSelectedCompanies}
              showMore={undefined}
            />
          </div>

          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md text-black">
            <FilterForLocation
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              showMore={undefined}
            />
          </div>

          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md text-black">
            <FilterForMajor
              selectedMajors={selectedMajors}
              setSelectedMajors={setSelectedMajors}
              showMore={undefined}
            />
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

      {/* Render the mini X button when a card is active */}
      <AnimatePresence>
        {active && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }} // Faster exit transition
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* X button in the top-right corner, visible only on small screens */}
            <motion.button
              className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 lg:hidden" // Visible only on small screens
              onClick={() => setActive(null)}
              exit={{ opacity: 0, transition: { duration: 0.1 } }} // Faster exit transition
              style={{ zIndex: 2000 }} // Ensure this is on top of everything
            >
              <CloseIcon />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

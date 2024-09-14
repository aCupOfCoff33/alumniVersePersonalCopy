import React, { useState } from "react";
import FilterForLocation from "./FilterForLocation";
import FilterForMajor from "./FilterForMajor";
import FilterForCompany from "./FilterForCompany";
import PaginatedCardGrid from "./PaginatedCardGrid";
import { cards } from "./cardsData";

const FilterContainer = () => {
  // State for selected filters
  const [selectedLocations, setSelectedLocations] = useState([]); // Locations (workplace)
  const [selectedMajors, setSelectedMajors] = useState([]); // Majors (fieldOfStudy)
  const [selectedCompanies, setSelectedCompanies] = useState([]); // Companies

  // State for controlling "Show More" functionality for all filters
  const [showFullFilters, setShowFullFilters] = useState(false);

  // Filter the cards based on selected options from all filters
  const filteredCards = cards.filter((card) => {
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(card.workplace);
    const matchesMajor =
      selectedMajors.length === 0 || selectedMajors.includes(card.fieldOfStudy);
    const matchesCompany =
      selectedCompanies.length === 0 ||
      selectedCompanies.includes(card.description);

    return matchesLocation && matchesMajor && matchesCompany;
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Filter Alumni</h2>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
        {/* Filter by Company */}
        <div className="mb-8">
          <FilterForCompany
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            showFullFilters={showFullFilters} // Pass centralized "show more" state
          />
        </div>

        {/* Filter by Location */}
        <div className="mb-8">
          <FilterForLocation
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            showFullFilters={showFullFilters} // Pass centralized "show more" state
          />
        </div>

        {/* Filter by Major */}
        <div className="mb-8">
          <FilterForMajor
            selectedMajors={selectedMajors}
            setSelectedMajors={setSelectedMajors}
            showFullFilters={showFullFilters} // Pass centralized "show more" state
          />
        </div>
      </div>

      {/* "Show More" Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowFullFilters(!showFullFilters)} // Toggle showing more
          className="text-blue-500 underline"
        >
          {showFullFilters ? "Show Less" : "Show More"}
        </button>
      </div>

      {/* Display the filtered cards */}
      <div className="mt-8">
        <PaginatedCardGrid cards={filteredCards} />
      </div>
    </div>
  );
};

export default FilterContainer;

import React from "react";
import BarGraphFilter from "./BarGraphFilter";
import { cards } from "./cardsData";

const FilterForLocation = ({
  selectedLocations,
  setSelectedLocations,
  showMore,
}) => {
  // Function to handle when a location (workplace) is clicked
  const handleLocationClick = (workplace) => {
    if (selectedLocations.includes(workplace)) {
      // Deselect the workplace if it's already selected
      setSelectedLocations(
        selectedLocations.filter((loc) => loc !== workplace)
      );
    } else {
      // Select the workplace if it's not yet selected
      setSelectedLocations([...selectedLocations, workplace]);
    }
  };

  // Calculate how many cards are associated with each workplace (location)
  const workplaceData = cards.reduce((acc, card) => {
    const workplace = card.workplace;
    if (!acc[workplace]) {
      acc[workplace] = 1;
    } else {
      acc[workplace]++;
    }
    return acc;
  }, {});

  // Convert the workplace data into an array and sort it by count
  const sortedWorkplaceData = Object.entries(workplaceData)
    .map(([workplace, count]) => ({ workplace, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="relative">
      <BarGraphFilter
        data={sortedWorkplaceData.map(({ workplace, count }) => ({
          company: workplace, // Use 'company' as a generic label in BarGraphFilter
          count,
        }))}
        selectedCompanies={selectedLocations} // Pass selectedLocations
        onCompanyClick={handleLocationClick} // Use the generic onCompanyClick handler
        headerName="What They Do" // Display appropriate header for the filter
        showMore={showMore} // Pass showMore prop to control visibility of items
      />
    </div>
  );
};

export default FilterForLocation;

import React from "react";
import BarGraphFilter from "./BarGraphFilter";
import { cards } from "./cardsData";

const FilterForMajor = ({ selectedMajors, setSelectedMajors, showMore }) => {
  // Function to handle when a major (field of study) is clicked
  const handleMajorClick = (fieldOfStudy) => {
    if (selectedMajors.includes(fieldOfStudy)) {
      // Deselect the major if it's already selected
      setSelectedMajors(selectedMajors.filter((major) => major !== fieldOfStudy));
    } else {
      // Select the major if it's not yet selected
      setSelectedMajors([...selectedMajors, fieldOfStudy]);
    }
  };

  // Calculate how many cards are associated with each field of study (major)
  const fieldOfStudyData = cards.reduce((acc, card) => {
    const fieldOfStudy = card.fieldOfStudy;
    if (!acc[fieldOfStudy]) {
      acc[fieldOfStudy] = 1;
    } else {
      acc[fieldOfStudy]++;
    }
    return acc;
  }, {});

  // Convert the fieldOfStudy data into an array and sort it by count
  const sortedFieldOfStudyData = Object.entries(fieldOfStudyData)
    .map(([fieldOfStudy, count]) => ({ fieldOfStudy, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="relative">
      <BarGraphFilter
        data={sortedFieldOfStudyData.map(({ fieldOfStudy, count }) => ({
          company: fieldOfStudy, // Use 'company' as a generic label in BarGraphFilter
          count,
        }))}
        selectedCompanies={selectedMajors} // Pass selectedMajors
        onCompanyClick={handleMajorClick} // Use the generic onCompanyClick handler
        headerName="What They Studied" // Display appropriate header for the filter
        showMore={showMore} // Pass showMore prop to control visibility of items
      />
    </div>
  );
};

export default FilterForMajor;
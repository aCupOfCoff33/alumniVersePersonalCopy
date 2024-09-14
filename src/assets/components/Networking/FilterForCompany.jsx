import React from "react";
import BarGraphFilter from "./BarGraphFilter";
import { cards } from "./cardsData";

const FilterForCompany = ({
  selectedCompanies,
  setSelectedCompanies,
  showMore,
}) => {
  const handleCompanyClick = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company)); // Deselect
    } else {
      setSelectedCompanies([...selectedCompanies, company]); // Select
    }
  };

  // Calculate company data
  const companyData = cards.reduce((acc, card) => {
    const company = card.description;
    if (!acc[company]) acc[company] = 1;
    else acc[company]++;
    return acc;
  }, {});

  const sortedCompanyData = Object.entries(companyData)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="relative">
            <BarGraphFilter
        data={sortedCompanyData}
        selectedCompanies={selectedCompanies}
        onCompanyClick={handleCompanyClick}
        headerName="Where They Work"
        showMore={showMore} // Pass showMore prop
      />

    </div>
  );
};

export default FilterForCompany;

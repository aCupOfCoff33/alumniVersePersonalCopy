import React, { useState } from "react";
import { FaFilter } from "react-icons/fa"; 
import BarGraphFilter from "./BarGraphFilter";
import { cards } from "./cardsData"; 

const SearchBarWithFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCompanies,
  setSelectedCompanies,
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const handleCompanyClick = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const companyData = cards.reduce((acc, card) => {
    const company = card.description;
    if (!acc[company]) {
      acc[company] = 1;
    } else {
      acc[company]++;
    }
    return acc;
  }, {});

  const sortedCompanyData = Object.entries(companyData)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="relative mx-auto w-full max-w-lg bg-white rounded-lg shadow-md flex flex-col items-start p-4">
      <div className="flex items-center w-full">
        <input
          type="text"
          placeholder="Search Alumni..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-4 text-gray-700 text-base font-bold bg-transparent outline-none rounded-lg"
        />
        <button onClick={() => setShowFilter(!showFilter)} className="ml-2">
          <FaFilter size={20} />
        </button>
      </div>

      {showFilter && (
        <div className="w-full mt-4">
          <BarGraphFilter
            data={sortedCompanyData}
            selectedCompanies={selectedCompanies}
            onCompanyClick={handleCompanyClick}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBarWithFilter;

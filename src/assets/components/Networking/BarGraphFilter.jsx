import React, { useState } from "react";

const BarGraphFilter = ({
  data,
  selectedCompanies,
  onCompanyClick,
  headerName,
  barHeight = "16px",
  barSpacing = "8px",
  fontSize = "12px",
  headerFontSize = "24px",
}) => {
  const [showFullList, setShowFullList] = useState(false); // State to track if we are showing 5 or 15 items
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isSearchActive, setIsSearchActive] = useState(false); // State to toggle search input visibility

  // Filter data based on search input
  const filteredData = data.filter((item) =>
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let inputName;

  if (headerName == "Where They Work") {
    inputName = "any company!"
  } else if (headerName == "What They Do") { 
    inputName = "any position!"
  } else { 
    inputName = "any major!"
  };

  // Logic to determine how many items to display
  const visibleData = showFullList
    ? filteredData.slice(0, 15)
    : filteredData.slice(0, 5);

  return (
    <div>
      {/* Search Input and Header Logic */}
      <div className="flex items-center justify-between mb-2">
        {!isSearchActive ? (
          <>
            {/* Header */}
            <h2
              className="text-black font-bold"
              style={{ fontSize: headerFontSize }}
            >
              {headerName}
            </h2>

            {/* + Add Button */}
            <button
              onClick={() => setIsSearchActive(true)} // Toggle search input
              className="bg-[#1c255b] font-bold text-white py-1 px-4 rounded-lg"
            >
              + Add
            </button>
          </>
        ) : (
          <>
            {/* Search Input (takes full space when active) */}
            <input
              type="text"
              placeholder={`Search ${inputName}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-2 border rounded w-full bg-slate-100"
            />
            <button
              onClick={() => {
                setIsSearchActive(false);
                setSearchTerm(""); // Clear search when closing
              }}
              className="text-gray-600 p-2"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Display the limited or full list */}
      {visibleData.map((item, index) => (
        <div
          key={index}
          className={`flex items-center cursor-pointer ${
            selectedCompanies.includes(item.company) ? "bg-gray-300" : ""
          }`}
          style={{
            padding: "8px",
            marginBottom: barSpacing,
            height: `calc(${barHeight} + 16px)`,
            borderRadius: "8px",
          }}
          onClick={() => onCompanyClick(item.company)}
        >
          <div className="flex items-center w-full">
            {/* Company Name */}
            <span
              style={{
                fontSize,
                width: "100px",
                textAlign: "left",
                color: "black",
              }}
            >
              {item.company}
            </span>

            {/* Bar */}
            <div
              className="flex items-center bg-gray-200 rounded-lg ml-4"
              style={{ flex: 1, height: barHeight }}
            >
              <div
                className="bg-[#1c255b] rounded-lg"
                style={{ width: `${item.count * 20}px`, height: barHeight }}
              ></div>
            </div>

            {/* Count */}
            <span
              className="ml-2"
              style={{
                fontSize,
                minWidth: "30px",
                textAlign: "right",
                color: "black",
              }}
            >
              {item.count}
            </span>
          </div>
        </div>
      ))}

      {/* Button to toggle between 5 and 15 items */}
      {filteredData.length > 5 && (
        <button
          onClick={() => setShowFullList(!showFullList)}
          className="mt-2 text-blue-500 underline"
        >
          {showFullList ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default BarGraphFilter;

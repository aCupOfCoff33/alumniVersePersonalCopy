import React, { useState } from "react";

const PaginatedCardGrid = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const cardsPerPage = 16; // Number of cards per page

  // Calculate the total number of pages
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  // Slice the cards array to get only the cards for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  // Handler for navigating to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handler for navigating to the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Display the grid of current cards */}
      <div className="grid grid-cols-4 gap-4">
        {currentCards.map((card) => (
          <div key={card.id} className="border p-4 rounded-lg shadow-md">
            <img
              src={card.src}
              alt={card.title}
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <h3 className="text-lg font-bold">{card.title}</h3>
            <p>{card.description}</p>
            <p>{card.workplace}</p>
            <p>{card.fieldOfStudy}</p>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded-lg ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ←
        </button>
        <p>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded-lg ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default PaginatedCardGrid;
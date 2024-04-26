import React from "react";

const BookFilter = ({ onFilterChange }) => {
  const handleFilterChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="genreFilter">Filter by Genre:</label>
      <select id="genreFilter" onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="Romance">Romance</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Fiction">Fiction</option>
      </select>
    </div>
  );
};

export default BookFilter;

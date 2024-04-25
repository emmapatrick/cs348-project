import React from "react";

const AuthorFilter = ({ onFilterChange }) => {
  const handleFilterChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="genderFilter">Filter by Gender:</label>
      <select id="genderFilter" onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Nonbinary">Nonbinary</option>
      </select>
    </div>
  );
};

export default AuthorFilter;

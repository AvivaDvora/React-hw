import React from 'react';

export default function FilterBar({ searchTerm, onSearchChange }) {
  return (
    <section className="filter-bar">
      <input
        type="text"
        className="input-field"
        placeholder="חיפוש לפי שם קורס או תיאור..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </section>
  );
}

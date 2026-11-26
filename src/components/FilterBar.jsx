import React from 'react';

/**
 * סרגל חיפוש וסינון עבור רשימת הקורסים.
 * קומפוננטה מבוקרת (Controlled) — הערכים מגיעים כ-props והשינויים עולים ב-callback.
 */
export default function FilterBar({
  searchTerm,
  onSearchChange,
  categories = [],
  selectedCategory = 'הכל',
  onCategoryChange,
  onlyOpen = false,
  onOnlyOpenChange,
  placeholder = 'חיפוש...'
}) {
  const hasFilters = categories.length > 0 && onCategoryChange;

  return (
    <section className="filter-bar">
      <input
        type="text"
        className="input-field"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      {hasFilters && (
        <>
          <select
            className="input-field"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            aria-label="סינון לפי קטגוריה"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {onOnlyOpenChange && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={(event) => onOnlyOpenChange(event.target.checked)}
              />
              הצג רק קורסים שפתוחים להרשמה
            </label>
          )}
        </>
      )}
    </section>
  );
}

import React from 'react';

/**
 * קומפוננטה להצגת סיכום נתונים.
 * שימו לב: הנתונים כאן לא נשמרים ב-State נפרד, אלא מחושבים ישירות
 * מתוך ה-Props (Derived State).
 */
export default function SummaryBar({ courses = [] }) {
  return (
    <section className="summary-bar">
      <div className="summary-card">
        <span className="summary-number">{courses.length}</span>
        <span className="summary-label">קורסים פעילים</span>
      </div>
    </section>
  );
}

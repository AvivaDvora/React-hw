import React from 'react';

/**
 * סיכום נתונים. הנתונים אינם נשמרים ב-State נפרד, אלא מחושבים
 * ישירות מתוך ה-Props (Derived State).
 *
 * הערה: אין במודל "מספר מקומות" (maxSpots), ולכן אין כאן
 * "מקומות פנויים" או "קורסים מלאים". הסטטיסטיקות מוגבלות למה שאפשר לגזור.
 */
export default function SummaryBar({ courses = [], students = [], enrollments = [] }) {
  const openCourses = courses.filter((course) => course.isOpen !== false).length;
  const closedCourses = courses.length - openCourses;

  const items = [
    { label: 'קורסים', value: courses.length, tone: 'neutral' },
    { label: 'פתוחים להרשמה', value: openCourses, tone: 'open' },
    { label: 'סגורים להרשמה', value: closedCourses, tone: closedCourses > 0 ? 'closed' : 'neutral' },
    { label: 'סטודנטים', value: students.length, tone: 'neutral' },
    { label: 'הרשמות', value: enrollments.length, tone: 'neutral' }
  ];

  return (
    <section className="summary-bar">
      {items.map(({ label, value, tone }) => (
        <div className={`summary-card summary-${tone}`} key={label}>
          <span className="summary-number">{value}</span>
          <span className="summary-label">{label}</span>
        </div>
      ))}
    </section>
  );
}

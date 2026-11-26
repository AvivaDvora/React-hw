import React from 'react';

/**
 * כרטיס סטודנט — קומפוננטת תצוגה בלבד.
 */
export default function StudentCard({ student, coursesCount = 0, onEdit, onDelete }) {
  return (
    <article className="workshop-card">
      <h3 className="card-title">{student.name}</h3>
      <p className="card-instructor">גיל: {student.age}</p>
      <p className="card-instructor">קורסים רשומים: {coursesCount}</p>

      <div className="card-footer">
        <button className="btn btn-sm btn-outline" type="button" onClick={() => onEdit(student)}>עריכה</button>
        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(student.id)}>מחיקה</button>
      </div>
    </article>
  );
}

import React from 'react';

/**
 * כרטיס קורס — קומפוננטת תצוגה בלבד.
 * מקבל את הקורס, את רשימת הנרשמים המוכנה, ואת הקריאות לפעולות.
 */
export default function CourseCard({
  course,
  registered = [],
  onEdit,
  onAddStudent,
  onDelete,
  onToggleOpen,
  onEditEnrollment,
  onRemoveEnrollment
}) {
  // קורס בלי isOpen (נתונים ישנים מהשרת) נחשב פתוח
  const isOpen = course.isOpen !== false;

  return (
    <article className={`workshop-card${isOpen ? '' : ' workshop-card-closed'}`}>
      <div className="card-header">
        <h3 className="card-title">{course.name}</h3>
        <span className={`status-badge ${isOpen ? 'status-open' : 'status-full'}`}>
          {isOpen ? 'הרשמה פתוחה' : 'הרשמה סגורה'}
        </span>
      </div>

      {course.category && <span className="category-badge">{course.category}</span>}
      <p className="card-instructor">{course.description}</p>

      <div className="card-footer">
        <button className="btn btn-sm btn-outline" type="button" onClick={() => onEdit(course)}>עריכה</button>
        <button
          className="btn btn-sm btn-outline"
          type="button"
          onClick={() => onAddStudent(course)}
          disabled={!isOpen}
          title={isOpen ? '' : 'ההרשמה לקורס סגורה'}
        >הוספת סטודנט לקורס</button>
        <button className="btn btn-sm btn-outline" type="button" onClick={() => onToggleOpen(course)}>
          {isOpen ? 'סגירת הרשמה' : 'פתיחת הרשמה'}
        </button>
        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(course.id)}>מחיקה</button>
      </div>

      <h4>סטודנטים ({registered.length})</h4>
      {registered.length === 0 ? (
        <p className="empty-text">אין רשומים.</p>
      ) : (
        <ul className="participants-list">
          {registered.map(({ enrollment, student }) => (
            <li className="participant-item" key={enrollment.id}>
              <span>{student.name}</span>
              <span className="participant-actions">
                <button
                  className="btn btn-sm btn-outline"
                  type="button"
                  onClick={() => onEditEnrollment(enrollment)}
                >עריכה</button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                  onClick={() => onRemoveEnrollment(enrollment.id)}
                >הסר</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

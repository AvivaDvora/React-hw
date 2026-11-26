import React, { useState } from 'react';
import Modal from './Modal';

/**
 * טופס הרשמת סטודנט לקורס.
 * מקבל את רשימות הסטודנטים והקורסים להצגה, ומחזיר אובייקט מוכן לשמירה.
 */
export default function EnrollmentModal({
  initialEnrollment = null,
  students = [],
  courses = [],
  initialCourseId = '',
  onSave,
  onClose
}) {
  const [studentId, setStudentId] = useState(
    initialEnrollment ? String(initialEnrollment.studentId) : ''
  );
  const [courseId, setCourseId] = useState(
    initialEnrollment ? String(initialEnrollment.courseId) : String(initialCourseId || '')
  );
  const [searchTerm, setSearchTerm] = useState('');

  const isEditing = initialEnrollment !== null;
  const term = searchTerm.trim().toLowerCase();
  const filteredStudents = students.filter(
    (student) => !term || student.name.toLowerCase().includes(term)
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!studentId || !courseId) return;

    onSave({ studentId: Number(studentId), courseId: Number(courseId) });
  };

  return (
    <Modal title={isEditing ? 'עריכת הרשמה' : 'הרשמת סטודנט לקורס'} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <input
            className="input-field"
            type="search"
            placeholder="חיפוש סטודנט לפי שם..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            className="input-field"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            required
          >
            <option value="">בחרי סטודנט</option>
            {filteredStudents.map((student) => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>

        <select
          className="input-field"
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          required
        >
          <option value="">בחרי קורס</option>
          {courses.map((course) => {
            // קורס סגור מסומן, כדי שלא נבחר אותו בלי לשים לב
            const closed = course.isOpen === false;
            return (
              <option key={course.id} value={course.id} disabled={closed}>
                {closed ? `${course.name} (ההרשמה סגורה)` : course.name}
              </option>
            );
          })}
        </select>

        <button className="btn btn-success" type="submit">
          {isEditing ? 'עדכון הרשמה' : 'הוספת הרשמה'}
        </button>
      </form>
    </Modal>
  );
}

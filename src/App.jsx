import React, { useEffect, useState } from 'react';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  setCourseOpen,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  isLocalMode
} from './services/dataSource';
import { CATEGORIES, ALL_CATEGORIES } from './constants';
import SummaryBar from './components/SummaryBar';
import FilterBar from './components/FilterBar';
import CourseCard from './components/CourseCard';
import StudentCard from './components/StudentCard';
import CourseModal from './components/CourseModal';
import StudentModal from './components/StudentModal';
import EnrollmentModal from './components/EnrollmentModal';

const CLOSED_MODAL = { type: null, item: null, courseId: '' };

/** קורס בלי isOpen (נתונים ישנים) נחשב פתוח */
const isCourseOpen = (course) => course.isOpen !== false;

export default function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  // סינון קורסים
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [onlyOpen, setOnlyOpen] = useState(false);

  // החלון הפתוח כרגע — מקום אחד לכל המודלים, במקום boolean לכל אחד
  const [modal, setModal] = useState(CLOSED_MODAL);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setError('');
        const [serverCourses, serverStudents, serverEnrollments] = await Promise.all([
          fetchCourses(), fetchStudents(), fetchEnrollments()
        ]);
        if (!cancelled) {
          setCourses(serverCourses);
          setStudents(serverStudents);
          setEnrollments(serverEnrollments);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'לא ניתן להתחבר לשרת');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  const closeModal = () => {
    setModal(CLOSED_MODAL);
    setStudentSearchTerm('');
  };

  // עוזר: מריץ בקשה, ומעדכן state רק אם השרת הצליח
  async function runRequest(request, onSuccess) {
    try {
      setError('');
      const result = await request();
      onSuccess(result);
      closeModal();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  const confirmAction = (message) => window.confirm(message);

  const replaceCourse = (courseId, updated) =>
    setCourses((previous) => previous.map((course) => (course.id === courseId ? updated : course)));

  const handleSaveCourse = (courseData) => {
    const isEditing = modal.type === 'course-edit';
    return runRequest(
      () => (isEditing ? updateCourse(modal.item.id, courseData) : createCourse(courseData)),
      (saved) => {
        if (isEditing) {
          replaceCourse(modal.item.id, saved);
        } else {
          setCourses((previous) => [saved, ...previous]);
        }
      }
    );
  };

  const handleSaveStudent = (studentData) => {
    const isEditing = modal.type === 'student-edit';
    return runRequest(
      () => (isEditing ? updateStudent(modal.item.id, studentData) : createStudent(studentData)),
      (saved) => {
        setStudents((previous) => (isEditing
          ? previous.map((student) => (student.id === modal.item.id ? saved : student))
          : [saved, ...previous]));
      }
    );
  };

  const handleSaveEnrollment = (enrollmentData) => {
    const isEditing = modal.type === 'enrollment-edit';

    // מניעת הרשמה כפולה לאותו קורס
    const alreadyExists = enrollments.some((item) =>
      item.studentId === enrollmentData.studentId &&
      item.courseId === enrollmentData.courseId &&
      (!isEditing || item.id !== modal.item.id)
    );
    if (alreadyExists) {
      setError('הסטודנט כבר רשום לקורס זה.');
      return false;
    }

    // מניעת הרשמה לקורס שההרשמה אליו סגורה
    const targetCourse = courses.find((course) => course.id === enrollmentData.courseId);
    if (targetCourse && !isCourseOpen(targetCourse)) {
      setError('ההרשמה לקורס זה סגורה.');
      return false;
    }

    return runRequest(
      () => (isEditing ? updateEnrollment(modal.item.id, enrollmentData) : createEnrollment(enrollmentData)),
      (saved) => {
        setEnrollments((previous) => (isEditing
          ? previous.map((item) => (item.id === modal.item.id ? saved : item))
          : [saved, ...previous]));
      }
    );
  };

  const handleToggleCourseOpen = (course) => {
    const nextOpen = !isCourseOpen(course);
    const message = nextOpen
      ? `לפתוח את ההרשמה לקורס "${course.name}"?`
      : `לסגור את ההרשמה לקורס "${course.name}"? סטודנטים חדשים לא יוכלו להירשם.`;
    if (!confirmAction(message)) return;

    runRequest(
      () => setCourseOpen(course.id, nextOpen),
      (saved) => replaceCourse(course.id, saved)
    );
  };

  const handleDeleteCourse = (courseId) => {
    if (!confirmAction('למחוק את הקורס? כל ההרשמות אליו יימחקו גם כן.')) return;
    runRequest(
      () => deleteCourse(courseId),
      () => {
        setCourses((previous) => previous.filter((course) => course.id !== courseId));
        // רשימת ההרשמות המקומית צריכה להתעדכן בהתאם
        setEnrollments((previous) => previous.filter((item) => item.courseId !== courseId));
      }
    );
  };

  const handleDeleteStudent = (studentId) => {
    if (!confirmAction('למחוק את הסטודנט?')) return;
    runRequest(
      () => deleteStudent(studentId),
      () => {
        setStudents((previous) => previous.filter((student) => student.id !== studentId));
        setEnrollments((previous) => previous.filter((item) => item.studentId !== studentId));
      }
    );
  };

  const handleDeleteEnrollment = (enrollmentId) => {
    if (!confirmAction('להסיר את הסטודנט מהקורס?')) return;
    runRequest(
      () => deleteEnrollment(enrollmentId),
      () => setEnrollments((previous) => previous.filter((item) => item.id !== enrollmentId))
    );
  };

  const term = searchTerm.trim().toLowerCase();
  const studentTerm = studentSearchTerm.trim().toLowerCase();

  // חיפוש לפי שם קורס או תיאור, וסינון לפי קטגוריה וזמינות
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = !term
      || course.name.toLowerCase().includes(term)
      || course.description.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES || (course.category ?? CATEGORIES[0]) === selectedCategory;
    const matchesAvailability = !onlyOpen || isCourseOpen(course);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const filteredStudents = students.filter((student) =>
    !studentTerm || student.name.toLowerCase().includes(studentTerm)
  );

  // נרשמים לכל קורס — מחושב, לא נשמר ב-State
  const registeredByCourse = (courseId) =>
    enrollments
      .filter((item) => item.courseId === courseId)
      .map((item) => ({ enrollment: item, student: students.find((s) => s.id === item.studentId) }))
      .filter((item) => item.student);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ניהול קורסים, סטודנטים והרשמות</h1>
        <p className="mode-badge">
          מצב נתונים: {isLocalMode ? 'מקומי (זיכרון הדפדפן)' : 'שרת API'}
        </p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? <div className="loading-state">טוען נתונים...</div> : (
        <>
          <div className="action-buttons">
            <button type="button" className="btn btn-primary"
              onClick={() => setModal({ type: 'course-create', item: null, courseId: '' })}>
              הוספת קורס
            </button>
            <button type="button" className="btn btn-primary"
              onClick={() => setModal({ type: 'student-create', item: null, courseId: '' })}>
              הוספת סטודנט
            </button>
            <button type="button" className="btn btn-primary"
              onClick={() => setModal({ type: 'enrollment-create', item: null, courseId: '' })}>
              הרשמת סטודנט לקורס
            </button>
          </div>

          <SummaryBar courses={courses} students={students} enrollments={enrollments} />

          {(modal.type === 'course-create' || modal.type === 'course-edit') && (
            <CourseModal
              initialCourse={modal.type === 'course-edit' ? modal.item : null}
              onSave={handleSaveCourse}
              onClose={closeModal}
            />
          )}

          {(modal.type === 'student-create' || modal.type === 'student-edit') && (
            <StudentModal
              initialStudent={modal.type === 'student-edit' ? modal.item : null}
              onSave={handleSaveStudent}
              onClose={closeModal}
            />
          )}

          {(modal.type === 'enrollment-create' || modal.type === 'enrollment-edit') && (
            <EnrollmentModal
              initialEnrollment={modal.type === 'enrollment-edit' ? modal.item : null}
              initialCourseId={modal.courseId}
              students={students}
              courses={courses}
              onSave={handleSaveEnrollment}
              onClose={closeModal}
            />
          )}

          <h2>קורסים וסטודנטים רשומים</h2>
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="חיפוש לפי שם קורס או תיאור..."
            categories={[ALL_CATEGORIES, ...CATEGORIES]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onlyOpen={onlyOpen}
            onOnlyOpenChange={setOnlyOpen}
          />
          <main className="workshops-grid">
            {filteredCourses.length === 0 ? (
              <div className="empty-state">לא נמצאו קורסים להצגה.</div>
            ) : (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  registered={registeredByCourse(course.id)}
                  onEdit={(selected) => setModal({ type: 'course-edit', item: selected, courseId: '' })}
                  onAddStudent={(selected) => setModal({ type: 'enrollment-create', item: null, courseId: selected.id })}
                  onDelete={handleDeleteCourse}
                  onToggleOpen={handleToggleCourseOpen}
                  onEditEnrollment={(enrollment) => setModal({ type: 'enrollment-edit', item: enrollment, courseId: '' })}
                  onRemoveEnrollment={handleDeleteEnrollment}
                />
              ))
            )}
          </main>

          <h2>כל הסטודנטים</h2>
          <FilterBar
            searchTerm={studentSearchTerm}
            onSearchChange={setStudentSearchTerm}
            placeholder="חיפוש סטודנט לפי שם..."
          />
          <main className="workshops-grid">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                coursesCount={enrollments.filter((item) => item.studentId === student.id).length}
                onEdit={(selected) => setModal({ type: 'student-edit', item: selected, courseId: '' })}
                onDelete={handleDeleteStudent}
              />
            ))}
          </main>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} from './services/workshopsApi';

export default function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [courseForm, setCourseForm] = useState({ name: '', description: '' });
  const [studentForm, setStudentForm] = useState({ name: '', age: '' });
  const [enrollmentForm, setEnrollmentForm] = useState({ studentId: '', courseId: '' });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

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

  const handleSaveCourse = async (event) => {
    event.preventDefault();
    try {
      setError('');
      if (editingCourseId !== null) {
        const updated = await updateCourse(editingCourseId, courseForm);
        setCourses((previous) => previous.map((course) => course.id === editingCourseId ? updated : course));
      } else {
        const created = await createCourse(courseForm);
        setCourses((previous) => [created, ...previous]);
      }
      setCourseForm({ name: '', description: '' });
      setEditingCourseId(null);
      setIsCourseModalOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSaveStudent = async (event) => {
    event.preventDefault();
    try {
      setError('');
      const studentData = { name: studentForm.name, age: Number(studentForm.age) };
      if (editingStudentId !== null) {
        const updated = await updateStudent(editingStudentId, studentData);
        setStudents((previous) => previous.map((student) => student.id === editingStudentId ? updated : student));
      } else {
        const created = await createStudent(studentData);
        setStudents((previous) => [created, ...previous]);
      }
      setStudentForm({ name: '', age: '' });
      setEditingStudentId(null);
      setIsStudentModalOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSaveEnrollment = async (event) => {
    event.preventDefault();
    if (!enrollmentForm.studentId || !enrollmentForm.courseId) return;

    try {
      setError('');
      const data = {
        studentId: Number(enrollmentForm.studentId),
        courseId: Number(enrollmentForm.courseId)
      };

      if (editingEnrollmentId !== null) {
        const updated = await updateEnrollment(editingEnrollmentId, data);
        setEnrollments((previous) => previous.map((item) => item.id === editingEnrollmentId ? updated : item));
      } else {
        const created = await createEnrollment(data);
        setEnrollments((previous) => [created, ...previous]);
      }
      setEnrollmentForm({ studentId: '', courseId: '' });
      setStudentSearchTerm('');
      setEditingEnrollmentId(null);
      setIsEnrollmentModalOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses((previous) => previous.filter((course) => course.id !== courseId));
    } catch (requestError) { setError(requestError.message); }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteStudent(studentId);
      setStudents((previous) => previous.filter((student) => student.id !== studentId));
    } catch (requestError) { setError(requestError.message); }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    try {
      await deleteEnrollment(enrollmentId);
      setEnrollments((previous) => previous.filter((item) => item.id !== enrollmentId));
    } catch (requestError) { setError(requestError.message); }
  };

  const term = searchTerm.trim().toLowerCase();
  const studentTerm = studentSearchTerm.trim().toLowerCase();
  const filteredStudents = students.filter((student) =>
    !studentTerm || student.name.toLowerCase().includes(studentTerm)
  );
  const filteredCourses = courses.filter((course) =>
    !term || course.name.toLowerCase().includes(term) || course.description.toLowerCase().includes(term)
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ניהול קורסים, סטודנטים והרשמות</h1>
       
      </header>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? <div className="loading-state">טוען נתונים מהשרת...</div> : (
        <>
          <div className="action-buttons">
            <button type="button" className="btn btn-primary" onClick={() => {
              setEditingCourseId(null);
              setCourseForm({ name: '', description: '' });
              setIsCourseModalOpen(true);
            }}>הוספת קורס</button>

            <button type="button" className="btn btn-primary" onClick={() => {
              setEditingStudentId(null);
              setStudentForm({ name: '', age: '' });
              setIsStudentModalOpen(true);
            }}>הוספת סטודנט</button>

            <button type="button" className="btn btn-primary" onClick={() => {
              setEditingEnrollmentId(null);
              setEnrollmentForm({ studentId: '', courseId: '' });
              setStudentSearchTerm('');
              setIsEnrollmentModalOpen(true);
            }}>הרשמת סטודנט לקורס</button>
          </div>

          {isCourseModalOpen && (
            <div className="modal-backdrop" role="dialog" aria-modal="true">
              <div className="modal-card">
                <button type="button" className="modal-close" onClick={() => setIsCourseModalOpen(false)}>×</button>
                <h3>{editingCourseId !== null ? 'עריכת קורס' : 'הוספת קורס'}</h3>
                <form className="form-grid" onSubmit={handleSaveCourse}>
                  <input className="input-field" placeholder="שם הקורס" value={courseForm.name} onChange={(event) => setCourseForm({ ...courseForm, name: event.target.value })} required />
                  <input className="input-field" placeholder="תיאור הקורס" value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} required />
                  <button className="btn btn-success" type="submit">{editingCourseId !== null ? 'עדכון קורס' : 'הוספת קורס'}</button>
                </form>
              </div>
            </div>
          )}

          {isStudentModalOpen && (
            <div className="modal-backdrop" role="dialog" aria-modal="true">
              <div className="modal-card">
                <button type="button" className="modal-close" onClick={() => setIsStudentModalOpen(false)}>×</button>
                <h3>{editingStudentId !== null ? 'עריכת סטודנט' : 'הוספת סטודנט'}</h3>
                <form className="form-grid" onSubmit={handleSaveStudent}>
                  <input className="input-field" placeholder="שם הסטודנט" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} required />
                  <input className="input-field" type="number" min="1" placeholder="גיל" value={studentForm.age} onChange={(event) => setStudentForm({ ...studentForm, age: event.target.value })} required />
                  <button className="btn btn-success" type="submit">{editingStudentId !== null ? 'עדכון סטודנט' : 'הוספת סטודנט'}</button>
                </form>
              </div>
            </div>
          )}

          {isEnrollmentModalOpen && (
            <div className="modal-backdrop" role="dialog" aria-modal="true">
              <div className="modal-card">
                <button type="button" className="modal-close" onClick={() => setIsEnrollmentModalOpen(false)}>×</button>
                <h3>{editingEnrollmentId !== null ? 'עריכת הרשמה' : 'הרשמת סטודנט לקורס'}</h3>
                <form className="form-grid" onSubmit={handleSaveEnrollment}>
                  <div>
                    <input
                      className="input-field"
                      type="search"
                      placeholder="חיפוש סטודנט לפי שם..."
                      value={studentSearchTerm}
                      onChange={(event) => setStudentSearchTerm(event.target.value)}
                    />
                    <select
                      className="input-field"
                      value={enrollmentForm.studentId}
                      onChange={(event) => setEnrollmentForm({ ...enrollmentForm, studentId: event.target.value })}
                      required
                    >
                      <option value="">בחרי סטודנט</option>
                      {filteredStudents.map((student) => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                  <select className="input-field" value={enrollmentForm.courseId} onChange={(event) => setEnrollmentForm({ ...enrollmentForm, courseId: event.target.value })} required>
                    <option value="">בחרי קורס</option>
                    {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                  </select>
                  <button className="btn btn-success" type="submit">{editingEnrollmentId !== null ? 'עדכון הרשמה' : 'הוספת הרשמה'}</button>
                </form>
              </div>
            </div>
          )}

          <div className="filter-bar">
            <input className="input-field" placeholder="חיפוש קורסים..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>

          <h2>קורסים וסטודנטים רשומים</h2>
          <main className="workshops-grid">
            {filteredCourses.map((course) => {
              const registered = enrollments
                .filter((item) => item.courseId === course.id)
                .map((item) => ({ enrollment: item, student: students.find((student) => student.id === item.studentId) }))
                .filter((item) => item.student);

              return (
                <article className="workshop-card" key={course.id}>
                  <h3 className="card-title">{course.name}</h3>
                  <p className="card-instructor">{course.description}</p>
                  <div className="card-footer">
                    <button className="btn-link-muted" type="button" onClick={() => {
                      setEditingCourseId(course.id);
                      setCourseForm({ name: course.name, description: course.description });
                      setIsCourseModalOpen(true);
                    }}>עריכה</button>
                    <button className="btn-link-muted" type="button" onClick={() => {
                      setEditingEnrollmentId(null);
                      setEnrollmentForm({ studentId: '', courseId: String(course.id) });
                      setStudentSearchTerm('');
                      setIsEnrollmentModalOpen(true);
                    }}>הוספת סטודנט לקורס</button>
                    <button className="btn-link-danger" type="button" onClick={() => handleDeleteCourse(course.id)}>מחיקה</button>
                  </div>
                  <h4>סטודנטים ({registered.length})</h4>
                  {registered.length === 0 ? <p className="empty-text">אין רשומים.</p> : (
                    <ul className="participants-list">
                      {registered.map(({ enrollment, student }) => (
                        <li className="participant-item" key={enrollment.id}>
                          <span>{student.name}</span>
                          <span>
                            <button className="btn-link-muted" type="button" onClick={() => { setEditingEnrollmentId(enrollment.id); setEnrollmentForm({ studentId: String(enrollment.studentId), courseId: String(enrollment.courseId) }); }}>עריכה</button>
                            <button className="btn-link-danger" type="button" onClick={() => handleDeleteEnrollment(enrollment.id)}>הסר</button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </main>

          <h2>כל הסטודנטים</h2>
          <main className="workshops-grid">
            {students.map((student) => (
              <article className="workshop-card" key={student.id}>
                <h3 className="card-title">{student.name}</h3>
                <p className="card-instructor">גיל: {student.age}</p>
                <div className="card-footer">
                  <button className="btn-link-muted" type="button" onClick={() => {
                    setEditingStudentId(student.id);
                    setStudentForm({ name: student.name, age: String(student.age) });
                    setIsStudentModalOpen(true);
                  }}>עריכה</button>
                  <button className="btn-link-danger" type="button" onClick={() => handleDeleteStudent(student.id)}>מחיקה</button>
                </div>
              </article>
            ))}
          </main>
        </>
      )}
    </div>
  );
}

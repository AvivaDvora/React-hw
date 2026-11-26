/**
 * שכבת נתונים מקומית — "חלק א' של השיעור".
 *
 * מממשת בדיוק את אותו "חוזה" (interface) כמו workshopsApi.js:
 * אותה רשימת פונקציות ואותם ערכי החזרה. בזכות זה אפשר להחליף בין
 * המצב המקומי למצב ה-API בלי לגעת ב-App או בקומפוננטות.
 *
 * הנתונים נשמרים בזיכרון בלבד ומתאפסים ברענון הדף.
 */

let courses = [];
let students = [];
let enrollments = [];

let nextCourseId = 1;
let nextStudentId = 1;
let nextEnrollmentId = 1;

/**
 * דימוי השהיית רשת, כדי שמצבי הטעינה והשגיאה ייראו כמו במצב API.
 * אפשר להקטין ל-0 או להסיר — הלוגיקה לא תלויה בזה.
 */
const NETWORK_DELAY_MS = 300;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));
}

/** מחזיר עותק, כדי שקוד חיצוני לא ישנה את הנתונים "מאחורי הגב" */
const clone = (value) => JSON.parse(JSON.stringify(value));

// ---------- קורסים ----------

export async function fetchCourses() {
  return delay(clone(courses));
}

export async function createCourse(newCourseData) {
  // קורס חדש נפתח להרשמה כברירת מחדל, אלא אם צוין אחרת במפורש
  const course = { isOpen: true, ...newCourseData, id: nextCourseId++ };
  courses = [course, ...courses];
  return delay(clone(course));
}

export async function updateCourse(courseId, courseData) {
  const existing = courses.find((course) => course.id === courseId);
  if (!existing) throw new Error('הקורס לא נמצא');

  const updated = { ...existing, ...courseData };
  courses = courses.map((course) => (course.id === courseId ? updated : course));
  return delay(clone(updated));
}

export async function deleteCourse(courseId) {
  courses = courses.filter((course) => course.id !== courseId);
  // מוחקים גם את ההרשמות התלויות — כמו בשרת
  enrollments = enrollments.filter((item) => item.courseId !== courseId);
  return delay(null);
}

export async function setCourseOpen(courseId, isOpen) {
  const existing = courses.find((course) => course.id === courseId);
  if (!existing) throw new Error('הקורס לא נמצא');

  const updated = { ...existing, isOpen };
  courses = courses.map((course) => (course.id === courseId ? updated : course));
  return delay(clone(updated));
}

// ---------- סטודנטים ----------

export async function fetchStudents() {
  return delay(clone(students));
}

export async function createStudent(studentData) {
  const student = { id: nextStudentId++, ...studentData };
  students = [student, ...students];
  return delay(clone(student));
}

export async function updateStudent(studentId, studentData) {
  const existing = students.find((student) => student.id === studentId);
  if (!existing) throw new Error('הסטודנט לא נמצא');

  const updated = { ...existing, ...studentData };
  students = students.map((student) => (student.id === studentId ? updated : student));
  return delay(clone(updated));
}

export async function deleteStudent(studentId) {
  students = students.filter((student) => student.id !== studentId);
  enrollments = enrollments.filter((item) => item.studentId !== studentId);
  return delay(null);
}

// ---------- הרשמות ----------

export async function fetchEnrollments() {
  return delay(clone(enrollments));
}

export async function createEnrollment(enrollmentData) {
  const enrollment = { id: nextEnrollmentId++, ...enrollmentData };
  enrollments = [...enrollments, enrollment];
  return delay(clone(enrollment));
}

export async function updateEnrollment(enrollmentId, enrollmentData) {
  const existing = enrollments.find((item) => item.id === enrollmentId);
  if (!existing) throw new Error('ההרשמה לא נמצאה');

  const updated = { ...existing, ...enrollmentData };
  enrollments = enrollments.map((item) => (item.id === enrollmentId ? updated : item));
  return delay(clone(updated));
}

export async function deleteEnrollment(enrollmentId) {
  enrollments = enrollments.filter((item) => item.id !== enrollmentId);
  return delay(null);
}

// ---------- נתוני התחלה ----------

let hasSeeded = false;

/**
 * מילוי נתוני ההתחלה — נקרא פעם אחת בעליית האפליקציה במצב מקומי.
 * אידמפוטנטי: קריאה שנייה לא תמחק שינויים שנעשו בינתיים.
 */
export function seedLocalStore({ courses: seedCourses = [], students: seedStudents = [], enrollments: seedEnrollments = [] } = {}) {
  if (hasSeeded) return;
  hasSeeded = true;

  courses = clone(seedCourses);
  students = clone(seedStudents);
  enrollments = clone(seedEnrollments);

  const maxId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0);

  nextCourseId = maxId(courses) + 1;
  nextStudentId = maxId(students) + 1;
  nextEnrollmentId = maxId(enrollments) + 1;
}

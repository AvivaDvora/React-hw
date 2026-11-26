/**
 * שכבת התקשורת מול שרת ה-Node.js שלכן.
 * כל כתובות ה-API מרוכזות כאן, כך ששינוי כתובת השרת מתבצע במקום אחד בלבד.
 */
export const API_BASE_URL = 'http://localhost:3000';
export const COURSES_URL = `${API_BASE_URL}/courses`;
export const STUDENTS_URL = `${API_BASE_URL}/students`;
export const ENROLLMENT_URL = `${API_BASE_URL}/enrollment`;

function getHeaders(includeJson = false) {
  return {
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
    'auth-key': import.meta.env.VITE_AUTH_KEY
  };
}

async function handleResponse(response, successMessage) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || successMessage);
  }
  return payload.data;
}

// 1. שליפת כל הקורסים (GET)
export async function fetchCourses() {
  const response = await fetch(COURSES_URL, { headers: getHeaders() });
  return handleResponse(response, 'שגיאה בטעינת הקורסים');
}

// 2. יצירת קורס חדש (POST)
export async function createCourse(newCourseData) {
  const response = await fetch(COURSES_URL, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(newCourseData)
  });
  return handleResponse(response, 'שגיאה ביצירת קורס');
}

// 3. עדכון קורס קיים (PUT)
export async function updateCourse(courseId, courseData) {
  const response = await fetch(`${COURSES_URL}/${courseId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(courseData)
  });
  return handleResponse(response, 'שגיאה בעדכון הקורס');
}

// 4. מחיקת קורס (DELETE)
export async function deleteCourse(courseId) {
  const response = await fetch(`${COURSES_URL}/${courseId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response, 'שגיאה במחיקת הקורס');
}

// 4b. פתיחה / סגירה של הרשמה לקורס
export async function setCourseOpen(courseId, isOpen) {
  const response = await fetch(`${COURSES_URL}/${courseId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ isOpen })
  });
  return handleResponse(response, 'שגיאה בעדכון מצב ההרשמה');
}

// 5. שליפת כל הסטודנטים (GET)
export async function fetchStudents() {
  const response = await fetch(STUDENTS_URL, { headers: getHeaders() });
  return handleResponse(response, 'שגיאה בטעינת הסטודנטים');
}

// 6. שליפת כל ההרשמות (GET)
export async function fetchEnrollments() {
  const response = await fetch(ENROLLMENT_URL, { headers: getHeaders() });
  return handleResponse(response, 'שגיאה בטעינת ההרשמות');
}

// 7. מחיקת הרשמה (DELETE)
export async function deleteEnrollment(enrollmentId) {
  const response = await fetch(`${ENROLLMENT_URL}/${enrollmentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response, 'שגיאה בביטול ההרשמה');
}

// 8. יצירת סטודנט חדש (POST)
export async function createStudent(studentData) {
  const response = await fetch(STUDENTS_URL, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(studentData)
  });
  return handleResponse(response, 'שגיאה ביצירת סטודנט');
}

// 9. עדכון פרטי סטודנט (PUT)
export async function updateStudent(studentId, studentData) {
  const response = await fetch(`${STUDENTS_URL}/${studentId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(studentData)
  });
  return handleResponse(response, 'שגיאה בעדכון סטודנט');
}

// 10. מחיקת סטודנט (DELETE)
export async function deleteStudent(studentId) {
  const response = await fetch(`${STUDENTS_URL}/${studentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response, 'שגיאה במחיקת סטודנט');
}

// 11. יצירת הרשמה חדשה (POST)
export async function createEnrollment(enrollmentData) {
  const response = await fetch(ENROLLMENT_URL, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(enrollmentData)
  });
  return handleResponse(response, 'שגיאה ביצירת הרשמה');
}

// 12. עדכון הרשמה (PUT)
export async function updateEnrollment(enrollmentId, enrollmentData) {
  const response = await fetch(`${ENROLLMENT_URL}/${enrollmentId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(enrollmentData)
  });
  return handleResponse(response, 'שגיאה בעדכון הרשמה');
}

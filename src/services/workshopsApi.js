/**
 * שכבת התקשורת מול שרת ה-Node.js שלכן.
 * כדי להתאים את הריאקט לפרויקט ה-Node שכתבתן, מספיק לעדכן כאן
 * את כתובת ה-API ואת הנתיבים (Routes).
 */
export const API_BASE_URL = 'http://localhost:3000/courses';

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
  const response = await fetch(API_BASE_URL, { headers: getHeaders() });
  return handleResponse(response, 'שגיאה בטעינת הקורסים');
}

// 2. יצירת קורס חדש (POST)
export async function createCourse(newCourseData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(newCourseData)
  });
  return handleResponse(response, 'שגיאה ביצירת קורס');
}

// 3. עדכון קורס קיים (PUT)
export async function updateCourse(courseId, courseData) {
  const response = await fetch(`${API_BASE_URL}/${courseId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(courseData)
  });
  return handleResponse(response, 'שגיאה בעדכון הקורס');
}

// 4. מחיקת קורס (DELETE)
export async function deleteCourse(courseId) {
  const response = await fetch(`${API_BASE_URL}/${courseId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response, 'שגיאה במחיקת הקורס');
}

// 5. שליפת כל הסטודנטים (GET)
export async function fetchStudents() {
  const response = await fetch('http://localhost:3000/students', { headers: getHeaders() });
  return handleResponse(response, 'שגיאה בטעינת הסטודנטים');
}

// 6. שליפת כל ההרשמות (GET)
export async function fetchEnrollments() {
  const response = await fetch('http://localhost:3000/enrollment', { headers: getHeaders() });
  return handleResponse(response, 'שגיאה בטעינת ההרשמות');
}

// 7. מחיקת הרשמה (DELETE)
export async function deleteEnrollment(enrollmentId) {
  const response = await fetch(`http://localhost:3000/enrollment/${enrollmentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response, 'שגיאה בביטול ההרשמה');
}

// 8. יצירת סטודנט חדש (POST)
export async function createStudent(studentData) {
  const response = await fetch('http://localhost:3000/students', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(studentData)
  });
  return handleResponse(response, 'שגיאה ביצירת סטודנט');
}

// 9. עדכון פרטי סטודנט (PUT)
export async function updateStudent(studentId, studentData) {
  const response = await fetch(`http://localhost:3000/students/${studentId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(studentData)
  });
  return handleResponse(response, 'שגיאה בעדכון סטודנט');
}

// 10. מחיקת סטודנט (DELETE)
export async function deleteStudent(studentId) {
  const response = await fetch(`http://localhost:3000/students/${studentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response, 'שגיאה במחיקת סטודנט');
}

// 11. יצירת הרשמה חדשה (POST)
export async function createEnrollment(enrollmentData) {
  const response = await fetch('http://localhost:3000/enrollment', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(enrollmentData)
  });
  return handleResponse(response, 'שגיאה ביצירת הרשמה');
}

// 12. עדכון הרשמה (PUT)
export async function updateEnrollment(enrollmentId, enrollmentData) {
  const response = await fetch(`http://localhost:3000/enrollment/${enrollmentId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(enrollmentData)
  });
  return handleResponse(response, 'שגיאה בעדכון הרשמה');
}

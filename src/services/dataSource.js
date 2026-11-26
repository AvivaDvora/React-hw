/**
 * שכבת נתונים מתחלפת: מצב מקומי או שרת API.
 *
 * כל האפליקציה מייבאת מכאן, וכך בוחרים את המצב במקום אחד —
 * ב-.env, בלי לגעת ב-App או בקומפוננטות.
 *
 *   VITE_DATA_MODE=local   → שכבת נתונים מקומית (חלק א')
 *   VITE_DATA_MODE=api     → שרת Node.js (חלק ב')
 */
import * as localStore from './localStore';
import * as api from './workshopsApi';
import { SEED_COURSES, SEED_STUDENTS, SEED_ENROLLMENTS } from '../data/seedData';

export const DATA_MODE =
  import.meta.env.VITE_DATA_MODE === 'local' ? 'local' : 'api';

export const isLocalMode = DATA_MODE === 'local';

// במצב מקומי ממלאים את הנתונים פעם אחת בעליית המודול
if (isLocalMode) {
  localStore.seedLocalStore({
    courses: SEED_COURSES,
    students: SEED_STUDENTS,
    enrollments: SEED_ENROLLMENTS
  });
}

// בחירת המימוש פעם אחת, לפי המצב
const source = isLocalMode ? localStore : api;

export const API_BASE_URL = api.API_BASE_URL;

// קורסים
export const fetchCourses = source.fetchCourses;
export const createCourse = source.createCourse;
export const updateCourse = source.updateCourse;
export const deleteCourse = source.deleteCourse;
export const setCourseOpen = source.setCourseOpen;

// סטודנטים
export const fetchStudents = source.fetchStudents;
export const createStudent = source.createStudent;
export const updateStudent = source.updateStudent;
export const deleteStudent = source.deleteStudent;

// הרשמות
export const fetchEnrollments = source.fetchEnrollments;
export const createEnrollment = source.createEnrollment;
export const updateEnrollment = source.updateEnrollment;
export const deleteEnrollment = source.deleteEnrollment;

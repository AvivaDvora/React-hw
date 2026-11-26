import { CATEGORIES } from '../constants';

/**
 * נתוני התחלה למצב המקומי (חלק א').
 * מקבלים אותם העתקה לתוך localStore.js בהפעלה.
 */
export const SEED_COURSES = [
  { id: 1, name: 'קורס לדוגמה 1', description: 'תיאור לדוגמה 1', category: CATEGORIES[0], isOpen: true },
  { id: 2, name: 'קורס לדוגמה 2', description: 'תיאור לדוגמה 2', category: CATEGORIES[1], isOpen: true },
  { id: 3, name: 'קורס לדוגמה 3', description: 'תיאור לדוגמה 3', category: CATEGORIES[2], isOpen: false }
];

export const SEED_STUDENTS = [
  { id: 1, name: 'סטודנט לדוגמה 1', age: 20 },
  { id: 2, name: 'סטודנט לדוגמה 2', age: 22 },
  { id: 3, name: 'סטודנט לדוגמה 3', age: 25 }
];

export const SEED_ENROLLMENTS = [
  { id: 1, studentId: 1, courseId: 1 },
  { id: 2, studentId: 2, courseId: 1 },
  { id: 3, studentId: 3, courseId: 2 }
];

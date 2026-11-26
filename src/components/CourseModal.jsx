import React, { useState } from 'react';
import Modal from './Modal';
import { CATEGORIES } from '../constants';

/**
 * טופס הוספה/עריכה של קורס.
 * ה-State של השדות חי כאן, ולא ב-App — App מקבל רק את הערכים המוכנים לשמירה.
 */
export default function CourseModal({ initialCourse = null, onSave, onClose }) {
  const [name, setName] = useState(initialCourse?.name ?? '');
  const [description, setDescription] = useState(initialCourse?.description ?? '');
  const [category, setCategory] = useState(initialCourse?.category ?? CATEGORIES[0]);

  const isEditing = initialCourse !== null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) return;

    // שולחים לשרת רק את השדות שהוא מצפה להם
    onSave({
      name: name.trim(),
      description: description.trim(),
      category
    });
  };

  return (
    <Modal title={isEditing ? 'עריכת קורס' : 'הוספת קורס'} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="שם הקורס"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="תיאור הקורס"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <select
          className="input-field"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="קטגוריית הקורס"
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button className="btn btn-success" type="submit">
          {isEditing ? 'עדכון קורס' : 'הוספת קורס'}
        </button>
      </form>
    </Modal>
  );
}

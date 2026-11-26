import React, { useState } from 'react';
import Modal from './Modal';

/**
 * טופס הוספה/עריכה של סטודנט.
 */
export default function StudentModal({ initialStudent = null, onSave, onClose }) {
  const [name, setName] = useState(initialStudent?.name ?? '');
  const [age, setAge] = useState(initialStudent ? String(initialStudent.age) : '');

  const isEditing = initialStudent !== null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !age) return;

    // המרה מפורשת למספר — הטופס מחזיק מחרוזות
    onSave({ name: name.trim(), age: Number(age) });
  };

  return (
    <Modal title={isEditing ? 'עריכת סטודנט' : 'הוספת סטודנט'} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="שם הסטודנט"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          className="input-field"
          type="number"
          min="1"
          placeholder="גיל"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          required
        />
        <button className="btn btn-success" type="submit">
          {isEditing ? 'עדכון סטודנט' : 'הוספת סטודנט'}
        </button>
      </form>
    </Modal>
  );
}

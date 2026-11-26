import React, { useState } from 'react';

export default function AddWorkshopForm({ onAddWorkshop }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const submitCourse = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) return;

    onAddWorkshop({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <section className="add-workshop-section">
      <button type="button" className="btn btn-primary" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? 'סגירת טופס' : '+ הוספת קורס חדש'}
      </button>

      {isOpen && (
        <form className="workshop-form" onSubmit={submitCourse}>
          <div className="form-grid">
            <input className="input-field" placeholder="שם הקורס" value={name} onChange={(event) => setName(event.target.value)} required />
            <input className="input-field" placeholder="תיאור הקורס" value={description} onChange={(event) => setDescription(event.target.value)} required />
          </div>
          <button type="submit" className="btn btn-success">שמירת קורס</button>
        </form>
      )}
    </section>
  );
}

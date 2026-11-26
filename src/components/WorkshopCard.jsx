import React, { useState } from 'react';

export default function WorkshopCard({ workshop: course, onUpdate, onDeleteWorkshop }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);

  const saveChanges = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onUpdate(course.id, { name: name.trim(), description: description.trim() });
    setIsEditing(false);
  };

  return (
    <article className="workshop-card">
      {isEditing ? (
        <form className="workshop-form" onSubmit={saveChanges}>
          <input className="input-field" value={name} onChange={(event) => setName(event.target.value)} required />
          <input className="input-field" value={description} onChange={(event) => setDescription(event.target.value)} required />
          <button type="submit" className="btn btn-success">שמירה</button>
          <button type="button" className="btn-link-muted" onClick={() => setIsEditing(false)}>ביטול</button>
        </form>
      ) : (
        <>
          <h3 className="card-title">{course.name}</h3>
          <p className="card-instructor">{course.description}</p>
          <div className="card-footer">
            <button type="button" className="btn-link-muted" onClick={() => setIsEditing(true)}>עריכת קורס</button>
            <button type="button" className="btn-link-danger" onClick={() => onDeleteWorkshop(course.id)}>מחיקת קורס</button>
          </div>
        </>
      )}
    </article>
  );
}

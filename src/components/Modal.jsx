import React from 'react';

/**
 * קומפוננטת תצוגה כללית לחלון מודאלי.
 * היא לא מכירה שרת, טפסים או נתונים — רק "מה להציג" ו"מה לעשות בסגירה".
 */
export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

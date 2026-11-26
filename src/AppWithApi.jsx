import React, { useState, useEffect } from 'react';
import SummaryBar from './components/SummaryBar';
import FilterBar from './components/FilterBar';
import AddWorkshopForm from './components/AddWorkshopForm';
import WorkshopCard from './components/WorkshopCard';
import {
  fetchWorkshops,
  createWorkshop,
  registerParticipant,
  unregisterParticipant,
  deleteWorkshop
} from './services/workshopsApi';

/**
 * חלק ב' של השיעור: המעבר מ-State סטטי ל-useEffect וחיבור לשרת Node.js.
 * שימו לב: כל קומפוננטות ה-UI (SummaryBar, FilterBar, WorkshopCard, AddWorkshopForm)
 * לא השתנו בכלל! רק שכבת הנתונים ב-App התחלפה.
 */
export default function AppWithApi() {
  // שלושת מצבי המסך הקלאסיים של קריאת API:
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // מצבי סינון (נשארים מקומיים ב-UI)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // טעינה ראשונית מהשרת בעליית הקומפוננטה
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWorkshops();
        if (!isCancelled) {
          setWorkshops(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'לא ניתן להתחבר לשרת. ודאי ששרת ה-Node פעיל ומוגדר CORS.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    // Cleanup למניעת עדכון State אם הקומפוננטה ירדה מהמסך
    return () => {
      isCancelled = true;
    };
  }, []); // <-- מערך תלויות ריק: רץ פעם אחת בלבד בטעינה!

  const handleAddWorkshop = async (newWorkshopData) => {
    try {
      setError(null);
      const savedWorkshop = await createWorkshop(newWorkshopData);
      setWorkshops((prev) => [savedWorkshop, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (workshopId, participantName) => {
    try {
      setError(null);
      const updatedWorkshop = await registerParticipant(workshopId, participantName);
      setWorkshops((prev) =>
        prev.map((w) => (w.id === workshopId ? updatedWorkshop : w))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnregister = async (workshopId, participantName) => {
    try {
      setError(null);
      const updatedWorkshop = await unregisterParticipant(workshopId, participantName);
      setWorkshops((prev) =>
        prev.map((w) => (w.id === workshopId ? updatedWorkshop : w))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteWorkshop = async (workshopId) => {
    try {
      setError(null);
      await deleteWorkshop(workshopId);
      setWorkshops((prev) => prev.filter((w) => w.id !== workshopId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.includes(searchTerm.trim()) ||
      w.instructor.includes(searchTerm.trim());
    const matchesCategory =
      selectedCategory === 'הכל' || w.category === selectedCategory;
    const matchesAvailability =
      !onlyAvailable || w.participants.length < w.maxSpots;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>מערכת הרשמה לסדנאות וחוגים</h1>
        <p>מחובר לשרת Node.js באמצעות useEffect ו-Fetch API</p>
      </header>

      {/* רינדור מותנה למצב שגיאה */}
      {error && (
        <div className="error-banner">
          <strong>שגיאת תקשורת:</strong> {error}
        </div>
      )}

      {/* רינדור מותנה למצב טעינה */}
      {isLoading ? (
        <div className="loading-state">טוען סדנאות מהשרת...</div>
      ) : (
        <>
          <SummaryBar workshops={workshops} />
          <AddWorkshopForm onAddWorkshop={handleAddWorkshop} />
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onlyAvailable={onlyAvailable}
            onOnlyAvailableChange={setOnlyAvailable}
          />

          {filteredWorkshops.length === 0 ? (
            <div className="empty-state">לא נמצאו סדנאות להצגה.</div>
          ) : (
            <main className="workshops-grid">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  onDeleteWorkshop={handleDeleteWorkshop}
                />
              ))}
            </main>
          )}
        </>
      )}
    </div>
  );
}

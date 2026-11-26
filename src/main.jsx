import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// למעבר לחלק ב' של השיעור (useEffect ו-API):
// החליפי את השורה מעל בשורה הבאה:
// import App from './AppWithApi.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

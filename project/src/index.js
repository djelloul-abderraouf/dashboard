import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ nouvelle API
import './index.css';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root')); // ✅ compatible React 18

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18
import './styles/main.css'; // Import the CSS file
import App from './App';

// Create a root element for React 18
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


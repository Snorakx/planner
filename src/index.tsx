import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initializeDemoData } from './utils/demoData';
import './index.css';

// Initialize demo data in localStorage
initializeDemoData();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 
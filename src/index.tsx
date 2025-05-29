import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initializeDemoData } from './utils/demoData';
import './index.css';

// Initialize demo data in localStorage
initializeDemoData();

// Initialize dark mode
const initDarkMode = () => {
  // Check for saved preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Run dark mode initialization
initDarkMode();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 
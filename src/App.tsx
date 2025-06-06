import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Common/Navigation';
import { CodernoSignature } from './components/Common/CodernoSignature';
import { Planner } from './pages/Planner';
import { Pomodoro } from './pages/Pomodoro';
import { FocusMode } from './pages/FocusMode';
import { Progress } from './pages/Progress';
import DailyView from './pages/DailyView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/focus/:taskId" element={<FocusMode />} />
        <Route path="/focus" element={<FocusMode />} />
        <Route
          path="/pomodoro"
          element={
            <div className="min-h-screen bg-background dark:bg-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-black pb-16 md:pb-0">
              <Navigation />
              <div className="container mx-auto px-4 py-4">
                <Pomodoro />
              </div>
            </div>
          }
        />
        <Route
          path="/progress"
          element={
            <div className="min-h-screen bg-background dark:bg-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-black pb-16 md:pb-0">
              <Navigation />
              <div className="container mx-auto px-4 py-4">
                <Progress />
              </div>
            </div>
          }
        />
        <Route
          path="/daily"
          element={
            <div className="min-h-screen bg-background dark:bg-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-black pb-16 md:pb-0">
              <Navigation />
              <div className="container mx-auto px-4 py-4">
                <DailyView />
              </div>
            </div>
          }
        />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-background dark:bg-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-black pb-16 md:pb-0">
              <Navigation />
              <div className="container mx-auto px-4 py-4">
                <Planner />
              </div>
            </div>
          }
        />
      </Routes>
      
      {/* Global Coderno Signature - appears on all pages */}
      <CodernoSignature />
    </BrowserRouter>
  );
}; 
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
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
            <div className="min-h-screen bg-background">
              <Navigation />
              <div className="container mx-auto px-4 py-6">
                <Pomodoro />
              </div>
            </div>
          }
        />
        <Route
          path="/progress"
          element={
            <div className="min-h-screen bg-background">
              <Navigation />
              <div className="container mx-auto px-4 py-6">
                <Progress />
              </div>
            </div>
          }
        />
        <Route
          path="/daily"
          element={
            <div className="min-h-screen bg-background">
              <Navigation />
              <div className="container mx-auto px-4 py-6">
                <DailyView />
              </div>
            </div>
          }
        />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-background">
              <Navigation />
              <div className="container mx-auto px-4 py-6">
                <Planner />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}; 
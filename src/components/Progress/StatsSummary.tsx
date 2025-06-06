import React from 'react';
import { ProgressStats } from '../../types/Progress';
import { formatDate } from '../../utils/dateUtils';

interface StatsSummaryProps {
  stats: ProgressStats;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  const { streak, bestDay, averageFocusTime } = stats;
  
  // Calculate total tasks and pomodoro sessions from all weeks
  const totalTasks = stats.weeklyData.reduce((sum, week) => sum + week.totalTasksCompleted, 0);
  const totalPomodoros = stats.weeklyData.reduce((sum, week) => sum + week.totalPomodoroSessions, 0);
  
  // Format average focus time
  const formatFocusTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} min` 
      : `${hours} hour${hours !== 1 ? 's' : ''}`;
  };
  
  // Generate motivation message based on data
  const getMotivationMessage = () => {
    if (streak.currentStreak > 0) {
      if (streak.currentStreak >= 5) {
        return "Amazing consistency! Keep up the great work!";
      } else if (streak.currentStreak >= 3) {
        return "You're building momentum! Keep that streak going!";
      } else {
        return "Great start! Let's keep building that streak!";
      }
    } else if (totalTasks > 0) {
      return "Ready to start a new streak? Every day is a fresh opportunity!";
    } else {
      return "Getting started is the hardest part. You've got this!";
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Your Progress Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Tasks Completed */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{totalTasks}</p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Pomodoro Sessions */}
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Pomodoro Sessions</p>
              <p className="text-2xl font-bold text-red-800 dark:text-red-300">{totalPomodoros}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-800 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Current Streak */}
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Current Streak</p>
              <p className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Best: {streak.longestStreak} day{streak.longestStreak !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Average Focus Time */}
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg. Focus Time</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                {formatFocusTime(averageFocusTime)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">Per active day</p>
            </div>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Day Section */}
      {bestDay && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Your Best Day</h3>
          <div className="flex items-center">
            <div className="mr-4 bg-purple-100 dark:bg-purple-800/40 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(bestDay.date, 'long')}</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {bestDay.tasksCompleted} task{bestDay.tasksCompleted !== 1 ? 's' : ''} completed • {formatFocusTime(bestDay.focusMinutes)} of focused work
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Motivation Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-blue-800 dark:text-blue-300 font-medium">{getMotivationMessage()}</p>
      </div>
    </div>
  );
}; 
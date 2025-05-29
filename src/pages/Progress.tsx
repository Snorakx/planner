import React, { useState, useEffect } from 'react';
import { ProgressChart } from '../components/ProgressChart';
import { StatsSummary } from '../components/StatsSummary';
import { ProgressService } from '../services/ProgressService';
import { DateRangeFilter, ProgressData, ProgressStats, WeeklySummary } from '../types/Progress';
import { getDateDaysAgo } from '../utils/dateUtils';

export const Progress: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [chartData, setChartData] = useState<ProgressData[] | WeeklySummary[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: getDateDaysAgo(30), // Last 30 days by default
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly'>('daily');
  const [dataType, setDataType] = useState<'tasks' | 'pomodoros' | 'focus'>('tasks');
  const [generatingSample, setGeneratingSample] = useState<boolean>(false);
  
  const progressService = ProgressService.getInstance();
  
  // Load progress data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get stats
        const progressStats = await progressService.getProgressStats(dateRange.startDate, dateRange.endDate);
        setStats(progressStats);
        
        // Set chart data based on timeFrame
        if (timeFrame === 'weekly') {
          setChartData(progressStats.weeklyData);
        } else {
          // Flatten daily data from all weeks
          const dailyData: ProgressData[] = [];
          progressStats.weeklyData.forEach(week => {
            dailyData.push(...week.dailyData);
          });
          // Sort by date (newest first)
          dailyData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setChartData(dailyData);
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dateRange, timeFrame, generatingSample]);
  
  // Handle date range change
  const handleDateRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    let startDate = today;
    
    switch (value) {
      case '7days':
        startDate = getDateDaysAgo(7);
        break;
      case '30days':
        startDate = getDateDaysAgo(30);
        break;
      case '90days':
        startDate = getDateDaysAgo(90);
        break;
      case 'all':
        startDate = getDateDaysAgo(365); // Just use a large value
        break;
      default:
        startDate = getDateDaysAgo(30);
    }
    
    setDateRange({
      startDate,
      endDate: today
    });
  };
  
  // Generate sample data for demonstration
  const handleGenerateSampleData = async () => {
    if (confirm('This will replace any existing progress data with sample data. Are you sure?')) {
      setLoading(true);
      try {
        await progressService.generateSampleData();
        setGeneratingSample(prev => !prev); // Toggle to trigger data reload
      } catch (error) {
        console.error('Error generating sample data:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-neutral-900 dark:text-white">Progress & Insights</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Date Range Filter */}
          <select
            value={dateRange.startDate === getDateDaysAgo(7) ? '7days' : 
                  dateRange.startDate === getDateDaysAgo(30) ? '30days' :
                  dateRange.startDate === getDateDaysAgo(90) ? '90days' : 'all'}
            onChange={handleDateRangeChange}
            className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          {/* Generate Sample Data Button */}
          <button
            onClick={handleGenerateSampleData}
            className="text-white/70 hover:bg-white/10 rounded-xl px-3 py-2 text-sm transition-colors backdrop-blur-md"
          >
            Generate Sample Data
          </button>
        </div>
      </header>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Tasks Card */}
              <div className="rounded-2xl p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 flex flex-col gap-1">
                <span className="text-3xl font-semibold text-white dark:text-white">
                  {stats.weeklyData.reduce((sum, week) => sum + week.totalTasksCompleted, 0)}
                </span>
                <span className="text-sm text-white/60 dark:text-white/50">Tasks Done</span>
              </div>
              
              {/* Pomodoros Card */}
              <div className="rounded-2xl p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 flex flex-col gap-1">
                <span className="text-3xl font-semibold text-white dark:text-white">
                  {stats.weeklyData.reduce((sum, week) => sum + week.totalPomodoroSessions, 0)}
                </span>
                <span className="text-sm text-white/60 dark:text-white/50">Pomodoros</span>
              </div>
              
              {/* Streak Card */}
              <div className="rounded-2xl p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 flex flex-col gap-1">
                <span className="text-3xl font-semibold text-white dark:text-white">
                  {stats.streak.currentStreak}
                </span>
                <span className="text-sm text-white/60 dark:text-white/50">Day Streak</span>
              </div>
              
              {/* Focus Time Card */}
              <div className="rounded-2xl p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 flex flex-col gap-1">
                <span className="text-3xl font-semibold text-white dark:text-white">
                  {stats.averageFocusTime >= 60 
                    ? `${Math.floor(stats.averageFocusTime / 60)}h` 
                    : `${stats.averageFocusTime}m`}
                </span>
                <span className="text-sm text-white/60 dark:text-white/50">Avg. Focus</span>
              </div>
            </div>
          )}
          
          {/* Chart Section */}
          <div className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white dark:text-white mb-4">Visualization</h2>
              
              {/* Chart Type & Time Frame Controls */}
              <div className="flex space-x-2 mb-4">
                <div className="flex bg-white/5 dark:bg-white/10 p-1 rounded-full">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      chartType === 'line'
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      chartType === 'bar'
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Bar
                  </button>
                </div>
                
                <div className="flex bg-white/5 dark:bg-white/10 p-1 rounded-full">
                  <button
                    onClick={() => setTimeFrame('daily')}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      timeFrame === 'daily'
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setTimeFrame('weekly')}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      timeFrame === 'weekly'
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>
              
              {/* Data Type Tabs */}
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => setDataType('tasks')}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    dataType === 'tasks'
                      ? "bg-primary text-white dark:bg-primary dark:text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setDataType('pomodoros')}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    dataType === 'pomodoros'
                      ? "bg-primary text-white dark:bg-primary dark:text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  Pomodoros
                </button>
                <button
                  onClick={() => setDataType('focus')}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    dataType === 'focus'
                      ? "bg-primary text-white dark:bg-primary dark:text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  Focus Time
                </button>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <div className="relative h-[200px] w-full rounded-xl bg-white/5 dark:bg-white/10 p-2">
                <ProgressChart
                  data={chartData}
                  chartType={chartType}
                  timeFrame={timeFrame}
                  dataType={dataType}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 rounded-xl bg-white/5 dark:bg-white/10">
                <div className="text-center">
                  <p className="text-white/70 dark:text-white/70 mb-2">No data available for the selected period</p>
                  <p className="text-sm text-white/50 dark:text-white/50">Complete tasks or focus sessions to see your progress</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Weekly Summary */}
          {stats && stats.weeklyData.length > 0 && (
            <div className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white dark:text-white mb-4">Weekly Progress</h2>
              
              <div className="mt-4 space-y-4">
                {stats.weeklyData.slice(0, 4).map((week, index) => (
                  <div key={week.weekStart} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70 dark:text-white/70">{week.weekStart} to {week.weekEnd}</span>
                      <span className="text-sm font-medium text-white dark:text-white">
                        {week.totalTasksCompleted} tasks
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-green-400 transition-all" 
                        style={{ width: `${Math.min(week.totalTasksCompleted * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Productivity Tips */}
          <div className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white dark:text-white mb-4">Productivity Tips</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium text-white dark:text-white">Time Blocking</h3>
                <p className="text-sm text-white/70 dark:text-white/70">Dedicate specific time blocks for focused work. This creates structure and reduces decision fatigue.</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-white dark:text-white">Body Doubling</h3>
                <p className="text-sm text-white/70 dark:text-white/70">Work alongside someone else (in person or virtually) to increase accountability and focus.</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-white dark:text-white">Task Breakdown</h3>
                <p className="text-sm text-white/70 dark:text-white/70">Break large tasks into smaller, manageable subtasks to reduce overwhelm and make progress visible.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 
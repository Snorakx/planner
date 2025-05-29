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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Progress & Insights</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Date Range Filter */}
          <select
            value={dateRange.startDate === getDateDaysAgo(7) ? '7days' : 
                  dateRange.startDate === getDateDaysAgo(30) ? '30days' :
                  dateRange.startDate === getDateDaysAgo(90) ? '90days' : 'all'}
            onChange={handleDateRangeChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                chartType === 'line'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                chartType === 'bar'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Bar
            </button>
          </div>
          
          {/* Time Frame Toggle */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeFrame('daily')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                timeFrame === 'daily'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setTimeFrame('weekly')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                timeFrame === 'weekly'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {stats ? (
            <>
              {/* Stats Summary */}
              <div className="mb-8">
                <StatsSummary stats={stats} />
              </div>
              
              {/* Chart Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Progress Visualization</h2>
                  
                  {/* Data Type Tabs */}
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setDataType('tasks')}
                      className={`py-2 px-4 text-sm font-medium ${
                        dataType === 'tasks'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => setDataType('pomodoros')}
                      className={`py-2 px-4 text-sm font-medium ${
                        dataType === 'pomodoros'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Pomodoros
                    </button>
                    <button
                      onClick={() => setDataType('focus')}
                      className={`py-2 px-4 text-sm font-medium ${
                        dataType === 'focus'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Focus Time
                    </button>
                  </div>
                </div>
                
                {chartData.length > 0 ? (
                  <div className="h-80">
                    <ProgressChart
                      data={chartData}
                      chartType={chartType}
                      timeFrame={timeFrame}
                      dataType={dataType}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No data available for the selected period</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Complete tasks or focus sessions to see your progress</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tips and Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Productivity Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Time Blocking</h3>
                    <p className="text-gray-600 dark:text-gray-400">Dedicate specific time blocks for focused work. This creates structure and reduces decision fatigue.</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Body Doubling</h3>
                    <p className="text-gray-600 dark:text-gray-400">Work alongside someone else (in person or virtually) to increase accountability and focus.</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Task Breakdown</h3>
                    <p className="text-gray-600 dark:text-gray-400">Break large tasks into smaller, manageable subtasks to reduce overwhelm and make progress visible.</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Environment Design</h3>
                    <p className="text-gray-600 dark:text-gray-400">Create a workspace that minimizes distractions and has visual cues for current priorities.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">No Progress Data Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start completing tasks, using the Pomodoro timer, or Focus Mode to track your progress.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  Go to Planner
                </button>
                <button
                  onClick={handleGenerateSampleData}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-opacity-90"
                >
                  Generate Sample Data
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 
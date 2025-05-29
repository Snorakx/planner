import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ProgressData, WeeklySummary } from '../types/Progress';
import { formatDate } from '../utils/dateUtils';

interface ProgressChartProps {
  data: ProgressData[] | WeeklySummary[];
  chartType: 'line' | 'bar';
  timeFrame: 'daily' | 'weekly';
  dataType: 'tasks' | 'pomodoros' | 'focus';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  chartType, 
  timeFrame, 
  dataType 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  // Process data based on timeFrame
  const chartData = React.useMemo(() => {
    if (timeFrame === 'daily') {
      // Daily data (ProgressData[])
      return (data as ProgressData[]).map(item => ({
        date: formatDate(item.date, 'short'),
        tasks: item.tasksCompleted,
        pomodoros: item.pomodoroSessions,
        focus: Math.round(item.focusMinutes / 60 * 10) / 10 // Convert to hours with 1 decimal
      }));
    } else {
      // Weekly data (WeeklySummary[])
      return (data as WeeklySummary[]).map(week => ({
        date: `${formatDate(week.weekStart, 'short')} - ${formatDate(week.weekEnd, 'short')}`,
        tasks: week.totalTasksCompleted,
        pomodoros: week.totalPomodoroSessions,
        focus: Math.round(week.totalFocusMinutes / 60 * 10) / 10 // Convert to hours with 1 decimal
      }));
    }
  }, [data, timeFrame]);

  // Get chart color based on data type
  const getChartColor = () => {
    switch (dataType) {
      case 'tasks':
        return '#4F46E5'; // Indigo
      case 'pomodoros':
        return '#EF4444'; // Red
      case 'focus':
        return '#10B981'; // Green
      default:
        return '#4F46E5';
    }
  };

  // Get label based on data type
  const getDataLabel = () => {
    switch (dataType) {
      case 'tasks':
        return 'Tasks Completed';
      case 'pomodoros':
        return 'Pomodoro Sessions';
      case 'focus':
        return 'Focus Hours';
      default:
        return '';
    }
  };

  const dataKey = dataType;
  const chartColor = getChartColor();
  const dataLabel = getDataLabel();

  // Render appropriate chart based on chartType
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-64">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">{dataLabel}</h3>
      <ResponsiveContainer width="100%" height="85%">
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280' }} 
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280' }} 
              tickLine={{ stroke: '#6B7280' }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '0.25rem',
                color: '#F9FAFB'
              }} 
              itemStyle={{ color: '#F9FAFB' }}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold', marginBottom: '0.5rem' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280' }} 
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280' }} 
              tickLine={{ stroke: '#6B7280' }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '0.25rem',
                color: '#F9FAFB'
              }} 
              itemStyle={{ color: '#F9FAFB' }}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold', marginBottom: '0.5rem' }}
            />
            <Legend />
            <Bar 
              dataKey={dataKey} 
              fill={chartColor} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}; 
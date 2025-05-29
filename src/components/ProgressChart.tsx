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
      <div className="flex items-center justify-center h-full">
        <p className="text-white/70 dark:text-white/70">No data available</p>
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
        return '#5E9FFF'; // iOS blue
      case 'pomodoros':
        return '#FF5E5E'; // iOS red
      case 'focus':
        return '#32D74B'; // iOS green
      default:
        return '#5E9FFF';
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

  // Custom tooltip for iOS style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-black dark:bg-white dark:text-black rounded-xl p-3 shadow-lg">
          <p className="text-xs font-medium mb-1">{label}</p>
          <p className="text-sm font-semibold">{`${getDataLabel()}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Render appropriate chart based on chartType
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="white" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'white', opacity: 0.7, fontSize: 10 }} 
              tickLine={{ stroke: 'white', opacity: 0.2 }}
              axisLine={{ stroke: 'white', opacity: 0.2 }}
            />
            <YAxis 
              tick={{ fill: 'white', opacity: 0.7, fontSize: 10 }} 
              tickLine={{ stroke: 'white', opacity: 0.2 }}
              axisLine={{ stroke: 'white', opacity: 0.2 }}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              strokeWidth={3}
              dot={{ r: 4, fill: chartColor, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: chartColor }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="white" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'white', opacity: 0.7, fontSize: 10 }} 
              tickLine={{ stroke: 'white', opacity: 0.2 }}
              axisLine={{ stroke: 'white', opacity: 0.2 }}
            />
            <YAxis 
              tick={{ fill: 'white', opacity: 0.7, fontSize: 10 }} 
              tickLine={{ stroke: 'white', opacity: 0.2 }}
              axisLine={{ stroke: 'white', opacity: 0.2 }}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={dataKey} 
              fill={chartColor} 
              radius={[4, 4, 0, 0]}
              opacity={0.9}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}; 
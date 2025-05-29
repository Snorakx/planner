export interface ProgressData {
  date: string; // "YYYY-MM-DD"
  tasksCompleted: number;
  pomodoroSessions: number;
  focusMinutes: number;
}

export interface WeeklySummary {
  weekStart: string; // "YYYY-MM-DD" of the first day of week
  weekEnd: string; // "YYYY-MM-DD" of the last day of week
  totalTasksCompleted: number;
  totalPomodoroSessions: number;
  totalFocusMinutes: number;
  dailyData: ProgressData[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD"
}

export interface BestDayData {
  date: string;
  tasksCompleted: number;
  focusMinutes: number;
}

export interface ProgressStats {
  weeklyData: WeeklySummary[];
  streak: StreakData;
  bestDay: BestDayData | null;
  averageFocusTime: number; // in minutes
}

export interface DateRangeFilter {
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
} 
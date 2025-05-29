import { ProgressRepository } from '../repositories/ProgressRepository';
import { BestDayData, ProgressData, ProgressStats, StreakData, WeeklySummary } from '../types/Progress';
import { getWeekStart, getWeekEnd, generateDateRange, getDateDaysAgo, isSameDay } from '../utils/dateUtils';

export class ProgressService {
  private static instance: ProgressService;
  private repository: ProgressRepository;
  private streakDataKey = 'adhd_planner_streak_data';
  
  private constructor() {
    this.repository = ProgressRepository.getInstance();
  }
  
  public static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }
  
  /**
   * Calculate weekly summary from daily progress data
   * @param startDate - Optional start date, defaults to beginning of current week
   * @param endDate - Optional end date, defaults to today
   */
  public async calculateWeeklySummary(startDate?: string, endDate?: string): Promise<WeeklySummary[]> {
    try {
      // Default date range: beginning of current week to today
      const today = new Date().toISOString().split('T')[0];
      const effectiveStartDate = startDate || getWeekStart(today);
      const effectiveEndDate = endDate || today;
      
      // Get all progress data in range
      const progressData = await this.repository.getProgressDataInRange(effectiveStartDate, effectiveEndDate);
      
      // Group by week
      const weekMap = new Map<string, ProgressData[]>();
      
      progressData.forEach(data => {
        const weekStart = getWeekStart(data.date);
        if (!weekMap.has(weekStart)) {
          weekMap.set(weekStart, []);
        }
        weekMap.get(weekStart)?.push(data);
      });
      
      // Transform into weekly summaries
      const weeklySummaries: WeeklySummary[] = [];
      
      // Use Array.from to convert entries to array that can be iterated
      Array.from(weekMap.entries()).forEach(([weekStart, dailyData]) => {
        const weekEnd = getWeekEnd(weekStart);
        
        // Calculate totals with explicit types
        const totalTasksCompleted = dailyData.reduce((sum: number, day: ProgressData) => sum + day.tasksCompleted, 0);
        const totalPomodoroSessions = dailyData.reduce((sum: number, day: ProgressData) => sum + day.pomodoroSessions, 0);
        const totalFocusMinutes = dailyData.reduce((sum: number, day: ProgressData) => sum + day.focusMinutes, 0);
        
        // Create summary
        weeklySummaries.push({
          weekStart,
          weekEnd,
          totalTasksCompleted,
          totalPomodoroSessions,
          totalFocusMinutes,
          dailyData: [...dailyData].sort((a, b) => a.date.localeCompare(b.date))
        });
      });
      
      // Sort by week start date (newest first)
      return weeklySummaries.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
    } catch (error) {
      console.error('Error calculating weekly summary:', error);
      return [];
    }
  }
  
  /**
   * Get user's current and longest streak
   */
  public async getStreak(): Promise<StreakData> {
    try {
      // Try to load existing streak data
      const streakData = localStorage.getItem(this.streakDataKey);
      const existingStreakData: StreakData = streakData 
        ? JSON.parse(streakData) 
        : { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
        
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Get yesterday's date
      const yesterday = getDateDaysAgo(1);
      
      // Check today's progress
      const progressData = await this.repository.getProgressData();
      const todayData = progressData.find(data => data.date === today);
      
      // Update streak based on activity
      let updatedStreakData = { ...existingStreakData };
      
      if (todayData && (todayData.tasksCompleted > 0 || todayData.focusMinutes > 0)) {
        // User was active today
        if (existingStreakData.lastActiveDate === yesterday) {
          // Continuing streak from yesterday
          updatedStreakData.currentStreak += 1;
        } else if (existingStreakData.lastActiveDate !== today) {
          // Starting new streak today
          updatedStreakData.currentStreak = 1;
        }
        updatedStreakData.lastActiveDate = today;
      } else if (existingStreakData.lastActiveDate && existingStreakData.lastActiveDate !== today && existingStreakData.lastActiveDate !== yesterday) {
        // User was not active yesterday or today, but was active before - reset streak
        updatedStreakData.currentStreak = 0;
      }
      
      // Update longest streak if needed
      if (updatedStreakData.currentStreak > updatedStreakData.longestStreak) {
        updatedStreakData.longestStreak = updatedStreakData.currentStreak;
      }
      
      // Save updated streak data
      localStorage.setItem(this.streakDataKey, JSON.stringify(updatedStreakData));
      
      return updatedStreakData;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
    }
  }
  
  /**
   * Find the user's best day based on tasks completed and focus time
   */
  public async getBestDay(): Promise<BestDayData | null> {
    try {
      const progressData = await this.repository.getProgressData();
      
      if (progressData.length === 0) {
        return null;
      }
      
      // Calculate a score for each day (weighting tasks and focus time)
      const scoredDays = progressData.map(day => ({
        ...day,
        score: day.tasksCompleted * 10 + day.focusMinutes * 0.5 // Arbitrary scoring formula
      }));
      
      // Sort by score (highest first)
      scoredDays.sort((a, b) => b.score - a.score);
      
      // Return the best day
      const bestDay = scoredDays[0];
      return {
        date: bestDay.date,
        tasksCompleted: bestDay.tasksCompleted,
        focusMinutes: bestDay.focusMinutes
      };
    } catch (error) {
      console.error('Error finding best day:', error);
      return null;
    }
  }
  
  /**
   * Calculate average focus time per active day
   */
  public async getAverageFocusTime(): Promise<number> {
    try {
      const progressData = await this.repository.getProgressData();
      
      if (progressData.length === 0) {
        return 0;
      }
      
      // Only count days with focus time > 0
      const activeDays = progressData.filter(day => day.focusMinutes > 0);
      
      if (activeDays.length === 0) {
        return 0;
      }
      
      // Calculate average
      const totalFocusMinutes = activeDays.reduce((sum, day) => sum + day.focusMinutes, 0);
      return Math.round(totalFocusMinutes / activeDays.length);
    } catch (error) {
      console.error('Error calculating average focus time:', error);
      return 0;
    }
  }
  
  /**
   * Get complete progress stats
   */
  public async getProgressStats(startDate?: string, endDate?: string): Promise<ProgressStats> {
    const weeklyData = await this.calculateWeeklySummary(startDate, endDate);
    const streak = await this.getStreak();
    const bestDay = await this.getBestDay();
    const averageFocusTime = await this.getAverageFocusTime();
    
    return {
      weeklyData,
      streak,
      bestDay,
      averageFocusTime
    };
  }
  
  /**
   * Update progress when a task is completed
   */
  public async trackCompletedTask(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressData = await this.repository.getProgressData();
      const todayData = progressData.find(data => data.date === today);
      
      if (todayData) {
        await this.repository.saveProgressData({
          ...todayData,
          tasksCompleted: todayData.tasksCompleted + 1
        });
      } else {
        await this.repository.saveProgressData({
          date: today,
          tasksCompleted: 1,
          pomodoroSessions: 0,
          focusMinutes: 0
        });
      }
      
      // Update streak
      await this.getStreak();
    } catch (error) {
      console.error('Error tracking completed task:', error);
    }
  }
  
  /**
   * Update progress when a pomodoro session is completed
   */
  public async trackPomodoroSession(minutes: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressData = await this.repository.getProgressData();
      const todayData = progressData.find(data => data.date === today);
      
      if (todayData) {
        await this.repository.saveProgressData({
          ...todayData,
          pomodoroSessions: todayData.pomodoroSessions + 1,
          focusMinutes: todayData.focusMinutes + minutes
        });
      } else {
        await this.repository.saveProgressData({
          date: today,
          tasksCompleted: 0,
          pomodoroSessions: 1,
          focusMinutes: minutes
        });
      }
      
      // Update streak
      await this.getStreak();
    } catch (error) {
      console.error('Error tracking pomodoro session:', error);
    }
  }
  
  /**
   * Update progress when focus time is completed
   */
  public async trackFocusTime(minutes: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressData = await this.repository.getProgressData();
      const todayData = progressData.find(data => data.date === today);
      
      if (todayData) {
        await this.repository.saveProgressData({
          ...todayData,
          focusMinutes: todayData.focusMinutes + minutes
        });
      } else {
        await this.repository.saveProgressData({
          date: today,
          tasksCompleted: 0,
          pomodoroSessions: 0,
          focusMinutes: minutes
        });
      }
      
      // Update streak
      await this.getStreak();
    } catch (error) {
      console.error('Error tracking focus time:', error);
    }
  }
  
  /**
   * Generate sample data for demonstration purposes
   * This method should only be used for testing or demo
   */
  public async generateSampleData(): Promise<void> {
    try {
      // Clear existing data first
      localStorage.removeItem(this.streakDataKey);
      
      // Clear existing progress data using a direct localStorage key
      const progressStorageKey = 'adhd_planner_progress_data';
      localStorage.setItem(progressStorageKey, JSON.stringify([]));
      
      const today = new Date();
      const sampleData: ProgressData[] = [];
      
      // Generate data for the past 14 days
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate some random but realistic data
        // More tasks and focus time on weekdays, less on weekends
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        const tasksBase = isWeekend ? 1 : 3;
        const focusBase = isWeekend ? 30 : 90;
        const pomodoroBase = isWeekend ? 1 : 4;
        
        // Add some randomness
        const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
        
        sampleData.push({
          date: dateStr,
          tasksCompleted: Math.floor(tasksBase * randomFactor),
          focusMinutes: Math.floor(focusBase * randomFactor),
          pomodoroSessions: Math.floor(pomodoroBase * randomFactor)
        });
        
        // Add some zeros occasionally to make data more realistic
        if (Math.random() < 0.2 && i > 2) { // 20% chance, but not for recent days
          sampleData.push({
            date: dateStr,
            tasksCompleted: 0,
            focusMinutes: 0,
            pomodoroSessions: 0
          });
        }
      }
      
      // Sort by date and ensure no duplicates
      const uniqueDates = new Set<string>();
      const uniqueData = sampleData.filter(item => {
        if (uniqueDates.has(item.date)) {
          return false;
        }
        uniqueDates.add(item.date);
        return true;
      });
      
      // Save data using repository to respect the proper storage mechanism
      for (const data of uniqueData) {
        await this.repository.saveProgressData(data);
      }
      
      // Update streak
      await this.getStreak();
      
      console.log('Sample data generated successfully!');
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  }
} 
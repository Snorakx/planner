import { ProgressData } from '../types/Progress';

export class ProgressRepository {
  private static instance: ProgressRepository;
  private storageKey = 'planner_progress_data';

  private constructor() {}

  public static getInstance(): ProgressRepository {
    if (!ProgressRepository.instance) {
      ProgressRepository.instance = new ProgressRepository();
    }
    return ProgressRepository.instance;
  }

  /**
   * Retrieves all progress data from localStorage
   */
  public async getProgressData(): Promise<ProgressData[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving progress data:', error);
      return [];
    }
  }

  /**
   * Saves a new progress data entry to localStorage
   */
  public async saveProgressData(data: ProgressData): Promise<void> {
    try {
      const existingData = await this.getProgressData();
      
      // Check if entry for this date already exists
      const existingIndex = existingData.findIndex(item => item.date === data.date);
      
      if (existingIndex >= 0) {
        // Update existing entry
        existingData[existingIndex] = data;
      } else {
        // Add new entry
        existingData.push(data);
      }
      
      // Sort by date (newest first)
      existingData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving progress data:', error);
      throw new Error('Failed to save progress data');
    }
  }
  
  /**
   * Updates progress data for the current day
   */
  public async updateTodayProgress(updates: Partial<ProgressData>): Promise<ProgressData> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const existingData = await this.getProgressData();
      let todayData = existingData.find(item => item.date === today);
      
      if (!todayData) {
        // Create new entry for today if it doesn't exist
        todayData = {
          date: today,
          tasksCompleted: 0,
          pomodoroSessions: 0,
          focusMinutes: 0
        };
      }
      
      // Update with new values
      const updatedData: ProgressData = {
        ...todayData,
        ...updates
      };
      
      await this.saveProgressData(updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating today\'s progress:', error);
      throw new Error('Failed to update today\'s progress');
    }
  }
  
  /**
   * Gets progress data within a date range
   */
  public async getProgressDataInRange(startDate: string, endDate: string): Promise<ProgressData[]> {
    try {
      const allData = await this.getProgressData();
      return allData.filter(item => {
        return item.date >= startDate && item.date <= endDate;
      });
    } catch (error) {
      console.error('Error getting progress data in range:', error);
      return [];
    }
  }
} 
import { PomodoroSession } from "../types/Pomodoro";

const STORAGE_KEY = "planner_pomodoro_sessions";

export class PomodoroRepository {
  private static instance: PomodoroRepository;

  private constructor() {}

  public static getInstance(): PomodoroRepository {
    if (!PomodoroRepository.instance) {
      PomodoroRepository.instance = new PomodoroRepository();
    }
    return PomodoroRepository.instance;
  }

  async getSessions(): Promise<PomodoroSession[]> {
    try {
      const sessionsJson = localStorage.getItem(STORAGE_KEY);
      if (!sessionsJson) return [];
      return JSON.parse(sessionsJson) as PomodoroSession[];
    } catch (error) {
      console.error("Error getting Pomodoro sessions from localStorage:", error);
      return [];
    }
  }

  async saveSession(session: PomodoroSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      sessions.push(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving Pomodoro session to localStorage:", error);
      throw error;
    }
  }

  async updateSession(updatedSession: PomodoroSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const index = sessions.findIndex(s => s.id === updatedSession.id);
      
      if (index !== -1) {
        sessions[index] = updatedSession;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } else {
        throw new Error(`Session with id ${updatedSession.id} not found`);
      }
    } catch (error) {
      console.error("Error updating Pomodoro session in localStorage:", error);
      throw error;
    }
  }

  async getSessionsByDate(date: Date): Promise<PomodoroSession[]> {
    try {
      const sessions = await this.getSessions();
      const dateString = date.toISOString().split('T')[0];
      
      return sessions.filter(session => {
        const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
        return sessionDate === dateString;
      });
    } catch (error) {
      console.error("Error filtering Pomodoro sessions by date:", error);
      return [];
    }
  }

  async getCompletedSessionsCount(): Promise<number> {
    try {
      const sessions = await this.getSessions();
      return sessions.filter(session => session.completed).length;
    } catch (error) {
      console.error("Error counting completed Pomodoro sessions:", error);
      return 0;
    }
  }
} 
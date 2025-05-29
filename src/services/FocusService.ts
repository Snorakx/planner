import { FocusSession } from "../types/Focus";
import { Task } from "../types/Task";
import { FocusSessionRepository } from "../repositories/FocusSessionRepository";

export interface FocusProgress {
  sessionId: string;
  taskId: string;
  task: Task | null;
  subtasksTotal: number;
  subtasksCompleted: number;
  percentComplete: number;
  timeElapsed: number;
  timeRemaining: number;
}

export class FocusService {
  private static instance: FocusService;
  private repository: FocusSessionRepository;

  private constructor() {
    this.repository = FocusSessionRepository.getInstance();
  }

  public static getInstance(): FocusService {
    if (!FocusService.instance) {
      FocusService.instance = new FocusService();
    }
    return FocusService.instance;
  }

  async startFocus(taskId: string): Promise<FocusSession> {
    // First, check if there's already an active session
    const currentSession = await this.repository.getCurrentSession();
    console.log(taskId, currentSession, "currentSession")
    
    if (currentSession) {
      if (currentSession.taskId === taskId) {
        // Return the existing session if it's for the same task
        return currentSession;
      } else {
        // Complete the existing session if it's for a different task
        await this.repository.completeSession(currentSession.id);
      }
    }
    
    // Start a new focus session
    return this.repository.startSession(taskId);
  }

  async markSubtaskDone(subtaskId: string, done: boolean = true): Promise<void> {
    const currentSession = await this.repository.getCurrentSession();
    
    if (!currentSession) {
      throw new Error("No active focus session found");
    }
    
    await this.repository.updateProgress(currentSession.id, subtaskId, done);
  }

  async completeFocus(): Promise<void> {
    const currentSession = await this.repository.getCurrentSession();
    
    if (!currentSession) {
      throw new Error("No active focus session found");
    }
    
    await this.repository.completeSession(currentSession.id);
  }

  async cancelFocus(): Promise<void> {
    await this.repository.clearCurrentSession();
  }

  async getCurrentSession(): Promise<FocusSession | null> {
    return this.repository.getCurrentSession();
  }

  async getProgress(): Promise<FocusProgress | null> {
    const currentSession = await this.repository.getCurrentSession();
    
    if (!currentSession) {
      return null;
    }
    
    const task = await this.repository.getTask(currentSession.taskId);
    
    if (!task) {
      return null;
    }
    
    const subtasksTotal = task.subtasks ? task.subtasks.length : 0;
    const subtasksCompleted = Object.values(currentSession.subtaskProgress).filter(done => done).length;
    const percentComplete = subtasksTotal > 0 ? (subtasksCompleted / subtasksTotal) * 100 : 0;
    
    // Calculate time elapsed and remaining
    const startTime = new Date(currentSession.startTime).getTime();
    const currentTime = new Date().getTime();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000 / 60); // in minutes
    const timeRemaining = Math.max(0, currentSession.duration - timeElapsed);
    
    return {
      sessionId: currentSession.id,
      taskId: currentSession.taskId,
      task,
      subtasksTotal,
      subtasksCompleted,
      percentComplete,
      timeElapsed,
      timeRemaining
    };
  }

  async getTask(): Promise<Task | null> {
    const currentSession = await this.repository.getCurrentSession();
    
    if (!currentSession) {
      return null;
    }
    
    return this.repository.getTask(currentSession.taskId);
  }
} 
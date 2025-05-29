import { v4 as uuidv4 } from "uuid";
import { FocusSession } from "../types/Focus";
import { Task } from "../types/Task";
import { TaskRepository } from "./TaskRepository";

const STORAGE_KEY = "adhd_planner_focus_session";
const DEFAULT_DURATION = 25; // 25 minutes

export class FocusSessionRepository {
  private static instance: FocusSessionRepository;
  private taskRepository: TaskRepository;

  private constructor() {
    this.taskRepository = TaskRepository.getInstance();
  }

  public static getInstance(): FocusSessionRepository {
    if (!FocusSessionRepository.instance) {
      FocusSessionRepository.instance = new FocusSessionRepository();
    }
    return FocusSessionRepository.instance;
  }

  async startSession(taskId: string): Promise<FocusSession> {
    try {
      // Get the task to initialize subtasks
      const tasks = await this.taskRepository.getTasks();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      // Initialize subtask progress (all false initially)
      const subtaskProgress: Record<string, boolean> = {};
      if (task.subtasks) {
        task.subtasks.forEach(subtask => {
          subtaskProgress[subtask.id] = subtask.done;
        });
      }
      
      const session: FocusSession = {
        id: uuidv4(),
        taskId,
        startTime: new Date().toISOString(),
        duration: DEFAULT_DURATION,
        completed: false,
        subtaskProgress
      };
      
      // Save the session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      return session;
    } catch (error) {
      console.error("Error starting focus session:", error);
      throw error;
    }
  }

  async updateProgress(sessionId: string, subtaskId: string, done: boolean): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      
      if (!session) {
        throw new Error("No active focus session found");
      }
      
      if (session.id !== sessionId) {
        throw new Error(`Session ID mismatch: ${session.id} vs ${sessionId}`);
      }
      
      // Update subtask progress
      session.subtaskProgress[subtaskId] = done;
      
      // Save the updated session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      // Also update the task in the task repository
      const tasks = await this.taskRepository.getTasks();
      const task = tasks.find(t => t.id === session.taskId);
      
      if (task && task.subtasks) {
        const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
        if (subtaskIndex !== -1) {
          task.subtasks[subtaskIndex].done = done;
          await this.taskRepository.updateTask(task);
        }
      }
    } catch (error) {
      console.error("Error updating focus session progress:", error);
      throw error;
    }
  }

  async completeSession(sessionId: string): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      
      if (!session) {
        throw new Error("No active focus session found");
      }
      
      if (session.id !== sessionId) {
        throw new Error(`Session ID mismatch: ${session.id} vs ${sessionId}`);
      }
      
      // Mark session as completed
      session.completed = true;
      
      // Save the completed session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      // Update the task status if all subtasks are done
      const tasks = await this.taskRepository.getTasks();
      const task = tasks.find(t => t.id === session.taskId);
      
      if (task) {
        // Check if all subtasks are done
        const allSubtasksDone = task.subtasks ? 
          task.subtasks.every(st => session.subtaskProgress[st.id]) : 
          false;
        
        if (allSubtasksDone && task.subtasks && task.subtasks.length > 0) {
          task.status = "done";
        } else if (Object.values(session.subtaskProgress).some(done => done)) {
          task.status = "in-progress";
        }
        
        // Update the task
        await this.taskRepository.updateTask(task);
      }
    } catch (error) {
      console.error("Error completing focus session:", error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<FocusSession | null> {
    try {
      const sessionJson = localStorage.getItem(STORAGE_KEY);
      
      if (!sessionJson) {
        return null;
      }
      
      const session = JSON.parse(sessionJson) as FocusSession;
      
      // If the session is already completed, return null
      if (session.completed) {
        return null;
      }
      
      return session;
    } catch (error) {
      console.error("Error getting current focus session:", error);
      return null;
    }
  }

  async clearCurrentSession(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  async getTask(taskId: string): Promise<Task | null> {
    try {
      const tasks = await this.taskRepository.getTasks();
      const task = tasks.find(t => t.id === taskId);
      return task || null;
    } catch (error) {
      console.error("Error getting task for focus session:", error);
      return null;
    }
  }
} 
import { Task } from "../types/Task";

const STORAGE_KEY = "planner_tasks";

export class TaskRepository {
  private static instance: TaskRepository;

  private constructor() {}

  public static getInstance(): TaskRepository {
    if (!TaskRepository.instance) {
      TaskRepository.instance = new TaskRepository();
    }
    return TaskRepository.instance;
  }

  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = localStorage.getItem(STORAGE_KEY);
      if (!tasksJson) return [];
      return JSON.parse(tasksJson) as Task[];
    } catch (error) {
      console.error("Error getting tasks from localStorage:", error);
      return [];
    }
  }

  async saveTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      tasks.push(task);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving task to localStorage:", error);
      throw error;
    }
  }

  async updateTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const index = tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tasks[index] = task;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } else {
        throw new Error(`Task with id ${task.id} not found`);
      }
    } catch (error) {
      console.error("Error updating task in localStorage:", error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error("Error deleting task from localStorage:", error);
      throw error;
    }
  }
} 
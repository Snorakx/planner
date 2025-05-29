import { v4 as uuidv4 } from "uuid";
import { Task, Subtask } from "../types/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
  private static instance: TaskService;
  private repository: TaskRepository;

  private constructor() {
    this.repository = TaskRepository.getInstance();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getTasksSortedByTime(): Promise<Task[]> {
    const tasks = await this.repository.getTasks();
    return tasks.sort((a, b) => {
      // Put tasks without startTime at the end
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      
      // Sort by startTime
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async getTasksForToday(): Promise<Task[]> {
    const tasks = await this.repository.getTasks();
    const today = new Date().toISOString().split('T')[0];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      return taskDate === today;
    });
  }

  async getTasksForTomorrow(): Promise<Task[]> {
    const tasks = await this.repository.getTasks();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      return taskDate === tomorrowStr;
    });
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || "New Task",
      description: taskData.description,
      subtasks: taskData.subtasks || [],
      startTime: taskData.startTime,
      status: taskData.status || "todo",
      focus: taskData.focus || false,
      createdAt: new Date().toISOString()
    };

    await this.repository.saveTask(newTask);
    return newTask;
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const tasks = await this.repository.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    
    if (!task.subtasks) {
      throw new Error(`Task ${taskId} has no subtasks`);
    }
    
    const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
    
    if (subtaskIndex === -1) {
      throw new Error(`Subtask with id ${subtaskId} not found in task ${taskId}`);
    }
    
    // Toggle the subtask
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
    
    // Check if all subtasks are done to update task status
    const allSubtasksDone = task.subtasks.every(st => st.done);
    if (allSubtasksDone) {
      task.status = "done";
    } else if (task.status === "done") {
      task.status = "in-progress";
    }
    
    await this.repository.updateTask(task);
    return task;
  }

  async markTaskDone(taskId: string): Promise<Task> {
    const tasks = await this.repository.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    
    task.status = "done";
    
    // Mark all subtasks as done
    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks = task.subtasks.map(st => ({ ...st, done: true }));
    }
    
    await this.repository.updateTask(task);
    return task;
  }
  
  async updateTaskStatus(taskId: string, status: "todo" | "in-progress" | "done"): Promise<Task> {
    const tasks = await this.repository.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    
    task.status = status;
    
    // If marking as done, mark all subtasks as done
    if (status === "done" && task.subtasks && task.subtasks.length > 0) {
      task.subtasks = task.subtasks.map(st => ({ ...st, done: true }));
    }
    
    await this.repository.updateTask(task);
    return task;
  }

  async toggleFocus(taskId: string): Promise<Task> {
    const tasks = await this.repository.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    
    task.focus = !task.focus;
    
    await this.repository.updateTask(task);
    return task;
  }

  async updateTask(task: Task): Promise<Task> {
    await this.repository.updateTask(task);
    
    // Add animation trigger to highlight the task after update
    task.lastUpdated = new Date().getTime();
    
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.repository.deleteTask(taskId);
  }

  async reorderTasks(taskId: string, fromIndex: number, toIndex: number): Promise<Task[]> {
    try {
      // Pobierz wszystkie zadania
      const tasks = await this.repository.getTasks();
      
      // Znajdź przesuwane zadanie
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }
      
      // Utwórz tymczasową kopię tablicy zadań do sortowania
      const tempTasks = [...tasks];
      
      // Usuń zadanie z pozycji fromIndex
      const [removedTask] = tempTasks.splice(fromIndex, 1);
      
      // Wstaw zadanie na pozycję toIndex
      tempTasks.splice(toIndex, 0, removedTask);
      
      // Dodaj znacznik czasu ostatniej aktualizacji
      removedTask.lastUpdated = new Date().getTime();
      
      // Zapisz zaktualizowaną listę zadań w repozytorium
      // To jest uproszczone, ponieważ nadpisujemy całą listę zadań
      // W prawdziwej aplikacji powinniśmy mieć dedykowaną metodę do aktualizacji listy
      await this.repository.saveTasks(tempTasks);
      
      return tempTasks;
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  }
} 
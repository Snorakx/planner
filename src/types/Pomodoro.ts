export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: string;
  duration: number; // in minutes
  type: "work" | "short-break" | "long-break";
  completed: boolean;
} 
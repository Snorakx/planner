export interface FocusSession {
  id: string;
  taskId: string;
  startTime: string;
  duration: number;
  completed: boolean;
  subtaskProgress: Record<string, boolean>; // subtaskId -> done
} 
export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subtasks?: Subtask[];
  startTime?: string; // format "HH:mm"
  status: "todo" | "in-progress" | "done";
  focus: boolean; // czy to priorytetowe zadanie
  createdAt: string;
  lastUpdated?: number; // timestamp ostatniej aktualizacji - do animacji
} 
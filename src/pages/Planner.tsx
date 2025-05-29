import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { EditTaskModal } from "../components/EditTaskModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { TaskList } from "../components/TaskList";
import { TaskService } from "../services/TaskService";
import { ProgressService } from "../services/ProgressService";
import { Task } from "../types/Task";
import { DragAndDropProvider } from "../utils/ui/DragAndDropContext";

type FilterType = "today" | "tomorrow" | "all";

export const Planner: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("today");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [lastUpdatedTaskId, setLastUpdatedTaskId] = useState<string | null>(null);
  const newTaskRef = useRef<HTMLDivElement>(null);
  const taskService = TaskService.getInstance();
  const progressService = ProgressService.getInstance();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  useEffect(() => {
    // Scroll to newly updated task
    if (lastUpdatedTaskId && newTaskRef.current) {
      setTimeout(() => {
        const taskElement = document.getElementById(`task-${lastUpdatedTaskId}`);
        if (taskElement) {
          taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          taskElement.classList.add('highlight-task');
          setTimeout(() => {
            taskElement.classList.remove('highlight-task');
            setLastUpdatedTaskId(null);
          }, 2000);
        }
      }, 100);
    }
  }, [lastUpdatedTaskId, tasks]);

  const loadTasks = async () => {
    try {
      let filteredTasks: Task[];
      
      if (filter === "today") {
        filteredTasks = await taskService.getTasksForToday();
      } else if (filter === "tomorrow") {
        filteredTasks = await taskService.getTasksForTomorrow();
      } else {
        filteredTasks = await taskService.getTasksSortedByTime();
      }
      
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setIsFormOpen(false);
      await loadTasks();
      setLastUpdatedTaskId(newTask.id);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await taskService.toggleSubtask(taskId, subtaskId);
      loadTasks();
    } catch (error) {
      console.error("Error toggling subtask:", error);
    }
  };

  const handleMarkDone = async (taskId: string) => {
    try {
      await taskService.markTaskDone(taskId);
      
      // Track completed task in progress stats
      await progressService.trackCompletedTask();
      
      loadTasks();
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const handleToggleFocus = async (taskId: string) => {
    try {
      await taskService.toggleFocus(taskId);
      loadTasks();
    } catch (error) {
      console.error("Error toggling focus:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await taskService.updateTask(updatedTask);
      setEditTask(null);
      await loadTasks();
      setLastUpdatedTaskId(updatedTask.id);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = (task: Task) => {
    setDeleteTask(task);
  };

  const handleConfirmDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setDeleteTask(null);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleReorderTasks = async (taskId: string, fromIndex: number, toIndex: number) => {
    try {
      await taskService.reorderTasks(taskId, fromIndex, toIndex);
      await loadTasks();
      setLastUpdatedTaskId(taskId);
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  return (
    <DragAndDropProvider>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">Task Planner</h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/70 rounded-full shadow-sm p-1.5 border border-gray-200/50 dark:border-gray-700/30">
              <button
                onClick={() => setFilter("today")}
                className={`px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                  filter === "today"
                    ? "bg-blue-500 dark:bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilter("tomorrow")}
                className={`px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                  filter === "tomorrow"
                    ? "bg-blue-500 dark:bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                  filter === "all"
                    ? "bg-blue-500 dark:bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                }`}
              >
                All
              </button>
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm flex items-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Task
            </button>
          </div>
        </header>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="max-w-lg w-full">
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}

        {editTask && (
          <EditTaskModal
            task={editTask}
            onSave={handleUpdateTask}
            onCancel={() => setEditTask(null)}
            isOpen={!!editTask}
          />
        )}

        {deleteTask && (
          <DeleteConfirmationModal
            task={deleteTask}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTask(null)}
            isOpen={!!deleteTask}
          />
        )}

        {tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            onReorderTasks={handleReorderTasks}
            onToggleSubtask={handleToggleSubtask}
            onMarkDone={handleMarkDone}
            onToggleFocus={handleToggleFocus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <div className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 p-8 rounded-3xl shadow-sm border border-gray-200/50 dark:border-gray-700/30 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mb-5 mx-auto text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">No tasks found</p>
              <p className="mt-2 text-center">
                {filter === "today"
                  ? "You have no tasks for today"
                  : filter === "tomorrow"
                  ? "You have no tasks for tomorrow"
                  : "You haven't created any tasks yet"}
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm flex items-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create your first task
            </button>
          </div>
        )}
      </div>
    </DragAndDropProvider>
  );
}; 
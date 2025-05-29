import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { TaskService } from "../services/TaskService";
import { ProgressService } from "../services/ProgressService";
import { Task } from "../types/Task";

type FilterType = "today" | "tomorrow" | "all";

export const Planner: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("today");
  const taskService = TaskService.getInstance();
  const progressService = ProgressService.getInstance();

  useEffect(() => {
    loadTasks();
  }, [filter]);

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
      await taskService.createTask(taskData);
      setIsFormOpen(false);
      loadTasks();
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

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Task Planner</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setFilter("today")}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === "today"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter("tomorrow")}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === "tomorrow"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-lg w-full">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleSubtask={handleToggleSubtask}
              onMarkDone={handleMarkDone}
              onToggleFocus={handleToggleFocus}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
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
            <p className="text-xl">No tasks found</p>
            <p className="mt-2">
              {filter === "today"
                ? "You have no tasks for today"
                : filter === "tomorrow"
                ? "You have no tasks for tomorrow"
                : "You haven't created any tasks yet"}
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Create your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 
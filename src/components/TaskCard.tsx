import React from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../types/Task";

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMarkDone: (taskId: string) => void;
  onToggleFocus: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleSubtask,
  onMarkDone,
  onToggleFocus,
  onEditTask,
  onDeleteTask,
}) => {
  const navigate = useNavigate();
  
  const statusColors = {
    todo: "bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
    "in-progress": "bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    done: "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200",
  };

  const handleStartFocusMode = () => {
    navigate(`/focus/${task.id}`);
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/70 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-5 mb-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] hover:bg-white/90 dark:hover:bg-gray-800/90">
      <div className="flex justify-between items-start mb-3 relative">
        <div className="flex items-center">
          <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${task.status === "done" ? "line-through text-gray-400 dark:text-gray-500" : ""}`}>
            {task.title}
          </h3>
          {task.focus && (
            <span className="ml-2 text-amber-500 dark:text-amber-400 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>
        <div className="flex items-center">
          {task.startTime && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {task.startTime}
            </span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[task.status]} font-medium`}>
            {task.status}
          </span>
          <div className="flex ml-3 space-x-1">
            <button 
              onClick={() => onEditTask(task)}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => onDeleteTask(task)}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{task.description}</p>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Subtasks:</h4>
          <ul className="space-y-2">
            {task.subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center bg-gray-50/70 dark:bg-gray-700/40 p-2 rounded-xl transition-colors">
                <div 
                  onClick={() => onToggleSubtask(task.id, subtask.id)}
                  className={`h-5 w-5 mr-2 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200
                    ${subtask.done 
                      ? 'bg-blue-500 dark:bg-blue-600 border-transparent' 
                      : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800'}`}
                >
                  {subtask.done && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${subtask.done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                  {subtask.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-3">
        {task.status !== "done" && (
          <button
            onClick={handleStartFocusMode}
            className="text-sm px-3.5 py-1.5 rounded-full bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Focus Mode
          </button>
        )}
        
        <button
          onClick={() => onToggleFocus(task.id)}
          className="text-sm px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {task.focus ? "Remove Focus" : "Set Focus"}
        </button>
        
        {task.status !== "done" && (
          <button
            onClick={() => onMarkDone(task.id)}
            className="text-sm px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-colors"
          >
            Mark Done
          </button>
        )}
      </div>
    </div>
  );
}; 
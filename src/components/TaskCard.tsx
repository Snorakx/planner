import React from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../types/Task";

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMarkDone: (taskId: string) => void;
  onToggleFocus: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleSubtask,
  onMarkDone,
  onToggleFocus,
}) => {
  const navigate = useNavigate();
  
  const statusColors = {
    todo: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  const handleStartFocusMode = () => {
    navigate(`/focus/${task.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <h3 className={`font-bold text-lg ${task.status === "done" ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </h3>
          {task.focus && (
            <span className="ml-2 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>
        <div className="flex items-center">
          {task.startTime && (
            <span className="text-sm text-gray-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {task.startTime}
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-1">Subtasks:</h4>
          <ul className="space-y-1">
            {task.subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={subtask.done}
                  onChange={() => onToggleSubtask(task.id, subtask.id)}
                  className="h-4 w-4 text-primary rounded mr-2"
                />
                <span className={subtask.done ? "line-through text-gray-500" : ""}>
                  {subtask.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-2">
        {task.status !== "done" && (
          <button
            onClick={handleStartFocusMode}
            className="text-sm px-2 py-1 rounded bg-purple-700 text-white hover:bg-purple-800 transition-colors"
          >
            Focus Mode
          </button>
        )}
        
        <button
          onClick={() => onToggleFocus(task.id)}
          className="text-sm px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          {task.focus ? "Remove Focus" : "Set Focus"}
        </button>
        
        {task.status !== "done" && (
          <button
            onClick={() => onMarkDone(task.id)}
            className="text-sm px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            Mark Done
          </button>
        )}
      </div>
    </div>
  );
}; 
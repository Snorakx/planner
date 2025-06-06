import React from "react";
import { Task } from "../../types/Task";

interface FocusTaskViewProps {
  task: Task;
}

export const FocusTaskView: React.FC<FocusTaskViewProps> = ({ task }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-6 shadow-xl border border-white/10 mb-8 transform transition-all duration-300 hover:shadow-2xl hover:bg-white/15">
      <div className="flex justify-between items-start mb-5">
        <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{task.title}</h1>
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium bg-blue-500/80 text-white backdrop-blur-sm shadow-sm">
          Focus
        </span>
      </div>
      
      {task.description && (
        <div className="mb-6">
          <p className="text-xl text-gray-300 leading-relaxed">{task.description}</p>
        </div>
      )}
      
      {task.startTime && (
        <div className="flex items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Scheduled start: {task.startTime}
        </div>
      )}
    </div>
  );
}; 
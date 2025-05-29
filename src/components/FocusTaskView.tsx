import React from "react";
import { Task } from "../types/Task";

interface FocusTaskViewProps {
  task: Task;
}

export const FocusTaskView: React.FC<FocusTaskViewProps> = ({ task }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold text-white">{task.title}</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
          Focus
        </span>
      </div>
      
      {task.description && (
        <div className="mb-6">
          <p className="text-xl text-gray-300">{task.description}</p>
        </div>
      )}
      
      {task.startTime && (
        <div className="text-gray-400">
          Scheduled start: {task.startTime}
        </div>
      )}
    </div>
  );
}; 
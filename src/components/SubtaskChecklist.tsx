import React, { useEffect, useRef } from "react";
import { Task } from "../types/Task";

interface SubtaskChecklistProps {
  task: Task;
  subtaskProgress: Record<string, boolean>;
  onToggleSubtask: (subtaskId: string, done: boolean) => void;
}

export const SubtaskChecklist: React.FC<SubtaskChecklistProps> = ({
  task,
  subtaskProgress,
  onToggleSubtask,
}) => {
  const activeSubtaskRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    // Scroll to the first incomplete subtask
    if (activeSubtaskRef.current) {
      activeSubtaskRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [subtaskProgress]);

  if (!task.subtasks || task.subtasks.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="text-center text-gray-400">
          <p>No subtasks for this task.</p>
          <p className="mt-2">Focus on completing the main task.</p>
        </div>
      </div>
    );
  }

  const completedCount = task.subtasks.filter(
    (subtask) => subtaskProgress[subtask.id]
  ).length;
  const progress = (completedCount / task.subtasks.length) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Subtasks</h2>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div 
            className="h-2 bg-primary rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <ul className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        {task.subtasks.map((subtask, index) => {
          const isDone = subtaskProgress[subtask.id];
          // Set ref for the first incomplete subtask
          const isActive = !isDone && 
            task.subtasks!.findIndex((st) => !subtaskProgress[st.id]) === index;
          
          return (
            <li 
              key={subtask.id} 
              ref={isActive ? activeSubtaskRef : null}
              className={`p-3 rounded-md transition-colors ${
                isActive 
                  ? "bg-gray-700 border-l-4 border-primary" 
                  : isDone 
                    ? "bg-gray-700 opacity-60" 
                    : "bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={(e) => onToggleSubtask(subtask.id, e.target.checked)}
                  className="h-5 w-5 rounded border-gray-600 text-primary focus:ring-primary"
                />
                <span 
                  className={`ml-3 text-lg ${
                    isDone 
                      ? "text-gray-400 line-through" 
                      : isActive 
                        ? "text-white font-medium" 
                        : "text-gray-300"
                  }`}
                >
                  {subtask.title}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}; 
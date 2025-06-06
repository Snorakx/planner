import React, { useEffect, useRef } from "react";
import { Task } from "../../types/Task";

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

  // Sprawdzamy, czy zadanie ma podtaski
  if (!task.subtasks || task.subtasks.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-6 shadow-xl border border-white/10 transform transition-all duration-300 hover:shadow-2xl hover:bg-white/15">
        <div className="text-center text-gray-400 py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/40 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">No subtasks for this task</p>
          <p className="text-gray-500">Focus on completing the main task</p>
        </div>
      </div>
    );
  }

  // Od tego momentu wiemy, że task.subtasks istnieje i nie jest pustą tablicą
  const subtasks = task.subtasks;
  
  // Obliczamy postęp tylko dla istniejących subtasków
  const subtaskIds = Object.keys(subtaskProgress);
  const validSubtaskIds = subtasks
    .map(subtask => subtask.id)
    .filter(id => subtaskIds.includes(id));
  
  const completedCount = validSubtaskIds.filter(id => subtaskProgress[id]).length;
  const progress = validSubtaskIds.length > 0 
    ? (completedCount / validSubtaskIds.length) * 100 
    : 0;

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-6 shadow-xl border border-white/10 transform transition-all duration-300 hover:shadow-2xl hover:bg-white/15">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Subtasks</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/30 text-indigo-200 backdrop-blur-sm">
          {completedCount}/{subtasks.length}
        </span>
      </div>
      
      <div className="mb-5">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-700/70 backdrop-blur-sm rounded-full overflow-hidden">
          <div 
            className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 hide-scrollbar">
        {subtasks.map((subtask, index) => {
          // Upewniamy się, że mamy poprawny status dla tego subtaska
          const isDone = subtaskProgress[subtask.id] || false;
          
          // Set ref for the first incomplete subtask
          const isActive = !isDone && 
            subtasks.findIndex((st) => !subtaskProgress[st.id]) === index;
          
          return (
            <li 
              key={subtask.id} 
              ref={isActive ? activeSubtaskRef : null}
              className={`p-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                isActive 
                  ? "bg-white/15 border-l-4 border-indigo-500 animate-pulse-subtle" 
                  : isDone 
                    ? "bg-gray-800/40 opacity-60" 
                    : "bg-gray-800/40"
              }`}
            >
              <div className="flex items-center">
                <div 
                  onClick={() => onToggleSubtask(subtask.id, !isDone)}
                  className={`h-5 w-5 mr-3 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200
                    ${isDone 
                      ? 'bg-indigo-500 dark:bg-indigo-600 border-transparent' 
                      : 'border-gray-500 dark:border-gray-400 bg-gray-700 dark:bg-gray-700'}`}
                >
                  {isDone && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span 
                  className={`text-base ${
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
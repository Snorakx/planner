import React from "react";
import { Task } from "../types/Task";

interface DeleteConfirmationModalProps {
  task: Task;
  onConfirm: (taskId: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  task,
  onConfirm,
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div 
        className="w-full max-w-md bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800/80 overflow-hidden transform transition-all animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-900/40 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Delete Task</h2>
            <p className="text-zinc-300 mb-1">Are you sure you want to delete this task?</p>
            <p className="text-zinc-400 text-sm mb-2">"{task.title}"</p>
            <p className="text-zinc-500 text-sm">This action cannot be undone.</p>
          </div>
          
          <div className="flex flex-col space-y-3 sm:flex-row-reverse sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
            <button
              onClick={() => onConfirm(task.id)}
              className="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20 font-medium"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
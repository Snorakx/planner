import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, Subtask } from "../../types/Task";

interface EditTaskModalProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  onSave,
  onCancel,
  isOpen
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [startTime, setStartTime] = useState(task.startTime || "");
  const [status, setStatus] = useState(task.status);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  useEffect(() => {
    // Reset form when task changes
    setTitle(task.title);
    setDescription(task.description || "");
    setStartTime(task.startTime || "");
    setStatus(task.status);
    setSubtasks(task.subtasks || []);
    setNewSubtaskTitle("");
  }, [task]);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: uuidv4(),
        title: newSubtaskTitle.trim(),
        done: false,
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle("");
    }
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map(subtask => 
        subtask.id === id 
          ? { ...subtask, done: !subtask.done } 
          : subtask
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      ...task,
      title,
      description: description || undefined,
      startTime: startTime || undefined,
      status,
      subtasks,
    };
    onSave(updatedTask);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800/80 overflow-hidden transform transition-all animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-zinc-100 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Edit Task</h2>
            <button 
              onClick={onCancel} 
              className="rounded-full p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1.5">Task Name</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter task name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1.5">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-zinc-300 mb-1.5">Start Time (Optional)</label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task["status"])}
                  className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 text-zinc-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-zinc-300">Subtasks</label>
                <span className="text-xs text-zinc-500">{subtasks.filter(s => s.done).length}/{subtasks.length} completed</span>
              </div>
              
              <div className="bg-zinc-800/60 rounded-xl p-4 mb-4">
                {subtasks.length > 0 ? (
                  <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1 hide-scrollbar">
                    {subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center justify-between bg-zinc-700/40 p-2.5 rounded-xl">
                        <div className="flex items-center">
                          <div 
                            onClick={() => handleToggleSubtask(subtask.id)}
                            className={`h-5 w-5 mr-3 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200
                              ${subtask.done 
                                ? 'bg-indigo-500 dark:bg-indigo-600 border-transparent' 
                                : 'border-zinc-500 bg-zinc-800'}`}
                          >
                            {subtask.done && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${subtask.done ? "line-through text-zinc-500" : "text-zinc-300"}`}>
                            {subtask.title}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="p-1 rounded-full text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                          aria-label="Delete subtask"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-zinc-500">
                    No subtasks added yet
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a new subtask"
                    className="flex-1 px-3 py-2 bg-zinc-700/60 border border-zinc-600 text-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-600/20 font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 
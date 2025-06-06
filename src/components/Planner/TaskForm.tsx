import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, Subtask } from "../../types/Task";

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
  initialValues?: Partial<Task>;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [startTime, setStartTime] = useState(initialValues?.startTime || "");
  const [focus, setFocus] = useState(initialValues?.focus || false);
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    initialValues?.subtasks || []
  );
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim() === "") return;
    
    const subtask: Subtask = {
      id: uuidv4(),
      title: newSubtask,
      done: false,
    };
    
    setSubtasks([...subtasks, subtask]);
    setNewSubtask("");
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    
    const taskData: Partial<Task> = {
      title,
      description: description || undefined,
      startTime: startTime || undefined,
      focus,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    };
    
    onSubmit(taskData);
  };

  return (
    <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-6 border border-gray-100/80 dark:border-gray-700/50 animate-fadeIn">
      <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
        {initialValues?.id ? "Edit Task" : "Create New Task"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-800 dark:text-white"
            placeholder="Task title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-800 dark:text-white"
            placeholder="Task description"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-800 dark:text-white"
          />
        </div>
        
        <div className="mb-5">
          <div className="flex items-center">
            <div 
              className={`relative h-6 w-11 flex items-center rounded-full cursor-pointer transition-colors duration-200 ${focus ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              onClick={() => setFocus(!focus)}
            >
              <span 
                className={`absolute h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${focus ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </div>
            <label htmlFor="focus" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority Focus
            </label>
          </div>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Subtasks
          </label>
          
          <div className="flex mb-3">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 p-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-800 dark:text-white"
              placeholder="Add a subtask"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-4 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-r-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
            >
              Add
            </button>
          </div>
          
          {subtasks.length > 0 && (
            <ul className="space-y-2 mt-3">
              {subtasks.map((subtask) => (
                <li key={subtask.id} className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/30 transition-all duration-200 hover:shadow-sm">
                  <span className="text-gray-800 dark:text-gray-200">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm font-medium"
          >
            {initialValues?.id ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}; 
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, Subtask } from "../types/Task";

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        {initialValues?.id ? "Edit Task" : "Create New Task"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Task title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Task description"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="focus"
              checked={focus}
              onChange={(e) => setFocus(e.target.checked)}
              className="h-4 w-4 text-primary rounded mr-2"
            />
            <label htmlFor="focus" className="text-sm font-medium text-gray-700">
              Priority Focus
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtasks
          </label>
          
          <div className="flex mb-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-opacity-90"
            >
              Add
            </button>
          </div>
          
          {subtasks.length > 0 && (
            <ul className="space-y-2 mt-2">
              {subtasks.map((subtask) => (
                <li key={subtask.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="text-red-500 hover:text-red-700"
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
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            {initialValues?.id ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}; 
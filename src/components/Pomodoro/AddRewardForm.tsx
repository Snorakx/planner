import React, { useState } from "react";

interface AddRewardFormProps {
  onSubmit: (name: string, requiredSessions: number, description?: string) => void;
  onCancel: () => void;
}

export const AddRewardForm: React.FC<AddRewardFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSessions, setRequiredSessions] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Reward name is required");
      return;
    }
    
    if (requiredSessions <= 0) {
      alert("Required sessions must be greater than 0");
      return;
    }
    
    onSubmit(name, requiredSessions, description || undefined);
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-700/30">
      <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">Create New Reward</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reward Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 bg-white/80 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/70 text-gray-900 dark:text-white"
            placeholder="e.g., Coffee Break, Movie Night"
            required
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 bg-white/80 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/70 text-gray-900 dark:text-white"
            placeholder="Describe your reward"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="requiredSessions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Required Focus Sessions *
          </label>
          <input
            type="number"
            id="requiredSessions"
            value={requiredSessions}
            onChange={(e) => setRequiredSessions(parseInt(e.target.value))}
            className="w-full p-2.5 bg-white/80 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/70 text-gray-900 dark:text-white"
            min="1"
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Number of completed focus sessions needed to unlock this reward
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors font-medium"
          >
            Create Reward
          </button>
        </div>
      </form>
    </div>
  );
}; 
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Create New Reward</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Reward Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Coffee Break, Movie Night"
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
            placeholder="Describe your reward"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="requiredSessions" className="block text-sm font-medium text-gray-700 mb-1">
            Required Focus Sessions *
          </label>
          <input
            type="number"
            id="requiredSessions"
            value={requiredSessions}
            onChange={(e) => setRequiredSessions(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            min="1"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Number of completed focus sessions needed to unlock this reward
          </p>
        </div>
        
        <div className="flex justify-end space-x-2">
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
            Create Reward
          </button>
        </div>
      </form>
    </div>
  );
}; 
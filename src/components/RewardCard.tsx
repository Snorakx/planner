import React from "react";
import { Reward } from "../types/Reward";

interface RewardCardProps {
  reward: Reward;
  progress: number;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, progress }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg ${
      reward.unlocked ? "border-2 border-green-500" : ""
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{reward.name}</h3>
          {reward.description && (
            <p className="text-gray-600 text-sm mb-2">{reward.description}</p>
          )}
        </div>
        {reward.unlocked ? (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
            Unlocked
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Locked
          </span>
        )}
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-gray-600">
              Required Sessions: {reward.requiredSessions}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-gray-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              reward.unlocked ? "bg-green-500" : "bg-primary"
            }`}
          ></div>
        </div>
      </div>

      {reward.unlocked && (
        <div className="mt-2 flex justify-center">
          <div className="bg-green-50 px-3 py-2 rounded-md border border-green-200">
            <span className="text-green-600 text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Reward Achieved!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 
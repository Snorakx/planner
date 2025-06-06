import React from "react";
import { Reward } from "../../types/Reward";

interface RewardCardProps {
  reward: Reward;
  progress: number;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, progress }) => {
  return (
    <div className={`bg-white/80 dark:bg-gray-800/40 backdrop-blur-md rounded-xl shadow-sm p-4 mb-4 transition-all border ${
      reward.unlocked 
        ? "border-green-300 dark:border-green-700" 
        : "border-gray-200/50 dark:border-gray-700/30"
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{reward.name}</h3>
          {reward.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{reward.description}</p>
          )}
        </div>
        {reward.unlocked ? (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            Unlocked
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            Locked
          </span>
        )}
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Required Sessions: {reward.requiredSessions}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {progress}%
            </span>
          </div>
        </div>
        <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className={`absolute left-0 top-0 h-full transition-all duration-500 ease-in-out ${
              reward.unlocked ? "bg-green-500 dark:bg-green-500" : "bg-primary dark:bg-primary"
            }`}
          ></div>
        </div>
      </div>

      {reward.unlocked && (
        <div className="mt-3 flex justify-center">
          <div className="bg-green-100/80 dark:bg-green-900/30 px-3 py-2 rounded-xl border border-green-200 dark:border-green-800/50">
            <span className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center">
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
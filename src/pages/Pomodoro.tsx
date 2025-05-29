import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { RewardCard } from "../components/RewardCard";
import { AddRewardForm } from "../components/AddRewardForm";
import { PomodoroService } from "../services/PomodoroService";
import { RewardService } from "../services/RewardService";
import { TaskService } from "../services/TaskService";
import { ProgressService } from "../services/ProgressService";
import { PomodoroSession } from "../types/Pomodoro";
import { Reward } from "../types/Reward";
import { Task } from "../types/Task";

export const Pomodoro: React.FC = () => {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<PomodoroSession | undefined>();
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [unlockedRewards, setUnlockedRewards] = useState<Reward[]>([]);
  const [pendingRewards, setPendingRewards] = useState<Reward[]>([]);
  const [isRewardFormOpen, setIsRewardFormOpen] = useState<boolean>(false);
  const [rewardProgress, setRewardProgress] = useState<Map<string, number>>(new Map());
  
  const pomodoroService = PomodoroService.getInstance();
  const rewardService = RewardService.getInstance();
  const taskService = TaskService.getInstance();
  const progressService = ProgressService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load tasks
      const allTasks = await taskService.getTasksSortedByTime();
      setTasks(allTasks);
      
      // Load rewards
      const unlocked = await rewardService.getUnlockedRewards();
      const pending = await rewardService.getPendingRewards();
      setUnlockedRewards(unlocked);
      setPendingRewards(pending);
      
      // Get completed sessions count
      const completedCount = await pomodoroService.getTotalCompletedSessions();
      setCompletedSessionsCount(completedCount);
      
      // Calculate progress for each reward
      const progress = new Map<string, number>();
      
      // Process rewards one by one with await inside the loop
      for (const reward of [...unlocked, ...pending]) {
        const rewardProgress = await rewardService.getRewardProgress(reward, completedCount);
        progress.set(reward.id, rewardProgress);
      }
      
      setRewardProgress(progress);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleStartSession = async (
    type: "work" | "short-break" | "long-break",
    taskId?: string
  ) => {
    try {
      const session = await pomodoroService.startSession(type, taskId);
      setCurrentSession(session);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleCompleteSession = async (session: PomodoroSession) => {
    try {
      await pomodoroService.completeSession(session.id);
      
      // Only increment count if it was a work session
      if (session.type === "work") {
        const newCount = completedSessionsCount + 1;
        setCompletedSessionsCount(newCount);
        
        // Track in progress stats - 25 minutes for a standard work session
        await progressService.trackPomodoroSession(25);
        
        // Check for newly unlocked rewards
        const unlockedRewards = await pomodoroService.checkAndUnlockRewards();
        if (unlockedRewards.length > 0) {
          // Show notification for unlocked rewards
          unlockedRewards.forEach(reward => {
            alert(`🎉 Congratulations! You've unlocked the "${reward.name}" reward!`);
          });
          await loadData(); // Reload all data
        } else {
          // Just update the progress
          const newProgress = new Map(rewardProgress);
          pendingRewards.forEach(reward => {
            newProgress.set(
              reward.id,
              Math.min(Math.floor((newCount / reward.requiredSessions) * 100), 100)
            );
          });
          setRewardProgress(newProgress);
        }
      }
      
      setCurrentSession(undefined);
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const handleCreateReward = async (
    name: string,
    requiredSessions: number,
    description?: string
  ) => {
    try {
      const reward = await rewardService.createReward(name, requiredSessions, description);
      
      // Calculate progress for the new reward
      const progress = new Map(rewardProgress);
      progress.set(
        reward.id,
        Math.min(Math.floor((completedSessionsCount / requiredSessions) * 100), 100)
      );
      setRewardProgress(progress);
      
      // Add to pending rewards
      setPendingRewards([...pendingRewards, reward]);
      
      // Close form
      setIsRewardFormOpen(false);
      
      // Check if it should be immediately unlocked
      await pomodoroService.checkAndUnlockRewards();
      
      // Reload data to reflect any changes
      await loadData();
    } catch (error) {
      console.error("Error creating reward:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Pomodoro Timer</h1>
        <p className="text-gray-600 dark:text-gray-300 tracking-wide">
          Use the Pomodoro Technique to enhance focus and productivity. 
          Complete focus sessions to unlock rewards!
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <PomodoroTimer
              onComplete={handleCompleteSession}
              onStart={handleStartSession}
              currentSession={currentSession}
              tasks={tasks}
            />
          </div>

          <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Progress</h2>
              <div className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  <span className="font-bold text-primary dark:text-primary">{completedSessionsCount}</span> Sessions Completed
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min(completedSessionsCount * 4, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>0</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(completedSessionsCount, 25) }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs"
                >
                  ✓
                </div>
              ))}
              {Array.from({ length: Math.max(0, 25 - completedSessionsCount) }).map((_, i) => (
                <div 
                  key={i + completedSessionsCount} 
                  className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-md p-6 mb-6 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Rewards</h2>
              <button
                onClick={() => setIsRewardFormOpen(true)}
                className="px-3 py-1 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Add Reward
              </button>
            </div>
            
            {isRewardFormOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="max-w-lg w-full">
                  <AddRewardForm
                    onSubmit={handleCreateReward}
                    onCancel={() => setIsRewardFormOpen(false)}
                  />
                </div>
              </div>
            )}
            
            {unlockedRewards.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400">Unlocked</h3>
                {unlockedRewards.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    progress={rewardProgress.get(reward.id) || 100}
                  />
                ))}
              </div>
            )}
            
            {pendingRewards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Pending</h3>
                {pendingRewards.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    progress={rewardProgress.get(reward.id) || 0}
                  />
                ))}
              </div>
            )}
            
            {unlockedRewards.length === 0 && pendingRewards.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-3.6 2.3L3 8m9-4v4m0 0h4a4 4 0 010 8h-4m4-8H7" />
                </svg>
                <p>No rewards yet</p>
                <p className="mt-2">Create some rewards to motivate yourself!</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pomodoro Technique</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Choose a task to focus on</li>
              <li>Set the timer for 25 minutes</li>
              <li>Work on the task until the timer rings</li>
              <li>Take a short 5-minute break</li>
              <li>After 4 pomodoros, take a longer 15-30 minute break</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
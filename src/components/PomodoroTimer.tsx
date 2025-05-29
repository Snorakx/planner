import React, { useState, useEffect, useRef } from "react";
import { PomodoroSession } from "../types/Pomodoro";
import { Task } from "../types/Task";

interface PomodoroTimerProps {
  onComplete: (session: PomodoroSession) => void;
  onStart: (type: "work" | "short-break" | "long-break", taskId?: string) => void;
  currentSession?: PomodoroSession;
  tasks: Task[];
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onComplete,
  onStart,
  currentSession,
  tasks,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [timerType, setTimerType] = useState<"work" | "short-break" | "long-break">("work");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If there's a current session, initialize the timer
    if (currentSession && !isActive) {
      setTimerType(currentSession.type);
      if (currentSession.taskId) {
        setSelectedTask(currentSession.taskId);
      }
      
      // Set initial time from duration (converting minutes to seconds)
      setSeconds(currentSession.duration * 60);
    }
  }, [currentSession]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            if (currentSession) {
              onComplete(currentSession);
            }
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentSession, onComplete]);

  const handleStart = () => {
    if (!isActive && !currentSession) {
      onStart(timerType, selectedTask || undefined);
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(getDurationForType(timerType) * 60);
  };

  const handleTypeChange = (type: "work" | "short-break" | "long-break") => {
    if (!isActive && !currentSession) {
      setTimerType(type);
      setSeconds(getDurationForType(type) * 60);
    }
  };

  const getDurationForType = (type: "work" | "short-break" | "long-break"): number => {
    switch (type) {
      case "work":
        return 25;
      case "short-break":
        return 5;
      case "long-break":
        return 15;
      default:
        return 25;
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTypeLabel = (type: "work" | "short-break" | "long-break"): string => {
    switch (type) {
      case "work":
        return "Pomodoro";
      case "short-break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Pomodoro";
    }
  };

  const getProgressPercentage = (): number => {
    if (!currentSession) return 0;
    const totalSeconds = currentSession.duration * 60;
    return ((totalSeconds - seconds) / totalSeconds) * 100;
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-8 rounded-2xl bg-black/70 dark:bg-black/70 backdrop-blur-xl shadow-xl">
      {/* Timer type selector - iOS segmented control style */}
      <div className="flex justify-center space-x-2 bg-white/10 dark:bg-white/5 p-1 rounded-full mb-8">
        <button
          onClick={() => handleTypeChange("work")}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            timerType === "work"
              ? "bg-white text-black dark:bg-white dark:text-black"
              : "text-white/60 hover:bg-white/10"
          }`}
          disabled={isActive || !!currentSession}
        >
          Pomodoro
        </button>
        <button
          onClick={() => handleTypeChange("short-break")}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            timerType === "short-break"
              ? "bg-white text-black dark:bg-white dark:text-black"
              : "text-white/60 hover:bg-white/10"
          }`}
          disabled={isActive || !!currentSession}
        >
          Short Break
        </button>
        <button
          onClick={() => handleTypeChange("long-break")}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            timerType === "long-break"
              ? "bg-white text-black dark:bg-white dark:text-black"
              : "text-white/60 hover:bg-white/10"
          }`}
          disabled={isActive || !!currentSession}
        >
          Long Break
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            style={{ width: `${getProgressPercentage()}%` }}
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </div>

      {/* Timer display */}
      <div className="text-center mb-8">
        <div className="text-6xl md:text-7xl font-mono tracking-wider text-white/90 dark:text-white/90">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Task selector (for work sessions) */}
      {timerType === "work" && !currentSession && (
        <div className="mb-8">
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full p-2 bg-white/10 dark:bg-white/5 border border-white/20 rounded-xl text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30"
            disabled={isActive || !!currentSession}
          >
            <option value="">-- Select a task --</option>
            {tasks
              .filter((task) => task.status !== "done")
              .map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="rounded-xl border border-white/20 backdrop-blur-md px-6 py-2 transition hover:bg-white/10 text-white dark:text-white text-sm font-semibold"
          >
            {currentSession ? "Resume" : "Start"}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="rounded-xl border border-white/20 backdrop-blur-md px-6 py-2 bg-white text-black dark:bg-white dark:text-black text-sm font-semibold"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="rounded-xl border border-white/20 backdrop-blur-md px-6 py-2 transition hover:bg-white/10 text-white dark:text-white text-sm font-semibold"
          disabled={!!currentSession}
        >
          Reset
        </button>
      </div>
    </div>
  );
}; 
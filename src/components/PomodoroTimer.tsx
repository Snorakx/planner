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
        return "Focus";
      case "short-break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Focus";
    }
  };

  const getProgressPercentage = (): number => {
    if (!currentSession) return 0;
    const totalSeconds = currentSession.duration * 60;
    return ((totalSeconds - seconds) / totalSeconds) * 100;
  };

  const getTypeColor = (type: "work" | "short-break" | "long-break"): string => {
    switch (type) {
      case "work":
        return "bg-primary";
      case "short-break":
        return "bg-green-500";
      case "long-break":
        return "bg-blue-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleTypeChange("work")}
            className={`px-4 py-2 rounded-md transition-colors ${
              timerType === "work"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            disabled={isActive || !!currentSession}
          >
            Focus
          </button>
          <button
            onClick={() => handleTypeChange("short-break")}
            className={`px-4 py-2 rounded-md transition-colors ${
              timerType === "short-break"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            disabled={isActive || !!currentSession}
          >
            Short Break
          </button>
          <button
            onClick={() => handleTypeChange("long-break")}
            className={`px-4 py-2 rounded-md transition-colors ${
              timerType === "long-break"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            disabled={isActive || !!currentSession}
          >
            Long Break
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-gray-500">
                {getTypeLabel(timerType)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                {getProgressPercentage().toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${getProgressPercentage()}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getTypeColor(
                timerType
              )}`}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold mb-4">{formatTime(seconds)}</div>
        </div>
      </div>

      {timerType === "work" && !currentSession && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Associate with Task (Optional)
          </label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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

      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            {currentSession ? "Resume" : "Start"}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          disabled={!!currentSession}
        >
          Reset
        </button>
      </div>
    </div>
  );
}; 
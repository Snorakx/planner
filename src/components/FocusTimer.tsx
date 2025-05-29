import React, { useState, useEffect, useRef } from "react";

interface FocusTimerProps {
  duration: number; // in minutes
  onComplete: () => void;
  onCancel: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  duration,
  onComplete,
  onCancel
}) => {
  const [minutes, setMinutes] = useState<number>(duration);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 0) {
                clearInterval(intervalRef.current!);
                onComplete();
                return 0;
              }
              return prevMinutes - 1;
            });
            return 59;
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
  }, [isActive, onComplete]);

  const handlePauseResume = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = duration * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="mb-4">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
            <div
              style={{ width: `${getProgressPercentage()}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
          </div>
          <div className="text-gray-400 mb-4">
            Focus Time Remaining
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePauseResume}
          className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isActive
              ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white"
              : "bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white"
          }`}
        >
          {isActive ? "Pause" : "Resume"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Reset
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}; 
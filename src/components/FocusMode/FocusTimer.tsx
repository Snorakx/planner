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
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-6 shadow-xl border border-white/10 transform transition-all duration-300 hover:shadow-2xl hover:bg-white/15">
      <div className="mb-6">
        <div className="relative pt-1">
          <div className="overflow-hidden h-3 mb-6 rounded-full bg-gray-700/70 backdrop-blur-sm">
            <div
              style={{ width: `${getProgressPercentage()}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-200"
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4 font-mono tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
          </div>
          <div className="text-gray-400 mb-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Focus Time Remaining
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-3">
        <button
          onClick={handlePauseResume}
          className={`px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 shadow-md ${
            isActive
              ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white shadow-amber-500/20"
              : "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 text-white shadow-emerald-500/20"
          }`}
        >
          <div className="flex items-center">
            {isActive ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </>
            )}
          </div>
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-600/80 hover:bg-gray-700/80 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 shadow-md shadow-gray-600/10 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-red-500/80 hover:bg-red-600/80 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 shadow-md shadow-red-500/20 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Cancel
        </button>
      </div>
    </div>
  );
}; 
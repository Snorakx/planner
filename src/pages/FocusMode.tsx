import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FocusTaskView } from "../components/FocusMode/FocusTaskView";
import { SubtaskChecklist } from "../components/FocusMode/SubtaskChecklist";
import { FocusTimer } from "../components/FocusMode/FocusTimer";
import { FocusService } from "../services/FocusService";
import { ProgressService } from "../services/ProgressService";
import { Task } from "../types/Task";
import { FocusSession } from "../types/Focus";

export const FocusMode: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  
  const [task, setTask] = useState<Task | null>(null);
  const [session, setSession] = useState<FocusSession | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const focusService = FocusService.getInstance();
  const progressService = ProgressService.getInstance();
  
  useEffect(() => {
    const initFocus = async () => {
      try {
        // Check if there's already an active session
        const currentSession = await focusService.getCurrentSession();
        
        if (currentSession) {
          // If we have an active session, use it
          setSession(currentSession);
          const currentTask = await focusService.getTask();
          if (currentTask) {
            setTask(currentTask);
          } else {
            setError("Could not find the task for the current session");
          }
        } else if (taskId) {
          // If no active session but we have a taskId, start a new session
          const newSession = await focusService.startFocus(taskId);
          setSession(newSession);
          const newTask = await focusService.getTask();
          if (newTask) {
            setTask(newTask);
          } else {
            setError("Could not find the task for the new session");
          }
        } else {
          // No session and no taskId, redirect to planner
          navigate("/");
        }
      } catch (error) {
        console.error("Error initializing focus mode:", error);
        setError("Failed to initialize focus mode. Please try again.");
      }
    };
    
    initFocus();
    
    // Listen for escape key to exit focus mode
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleExitFocus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Enable dark mode for body
    document.body.classList.add("bg-gray-900");
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("bg-gray-900");
    };
  }, [taskId, navigate]);
  
  const handleToggleSubtask = async (subtaskId: string, done: boolean) => {
    try {
      await focusService.markSubtaskDone(subtaskId, done);
      // Refresh session
      const updatedSession = await focusService.getCurrentSession();
      setSession(updatedSession);
    } catch (error) {
      console.error("Error toggling subtask:", error);
    }
  };
  
  const handleCompleteFocus = async () => {
    try {
      await focusService.completeFocus();
      
      // Track focus time in progress stats (using session duration if available)
      if (session && session.duration) {
        await progressService.trackFocusTime(session.duration);
      }
      
      setIsComplete(true);
    } catch (error) {
      console.error("Error completing focus session:", error);
    }
  };
  
  const handleCancelFocus = async () => {
    try {
      await focusService.cancelFocus();
      navigate("/");
    } catch (error) {
      console.error("Error canceling focus session:", error);
    }
  };
  
  const handleExitFocus = () => {
    navigate("/");
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 dark:bg-black bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-8 shadow-xl border border-white/10 text-white max-w-md animate-fadeIn">
          <div className="flex items-center mb-6">
            <div className="bg-red-500/20 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Error</h2>
          </div>
          <p className="mb-8 text-gray-300 leading-relaxed">{error}</p>
          <button
            onClick={handleExitFocus}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-lg shadow-blue-500/20 font-medium flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Planner
          </button>
        </div>
      </div>
    );
  }
  
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-950 dark:bg-black bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-8 shadow-xl border border-white/10 text-white max-w-md animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Focus Session Complete!</h2>
            <p className="text-gray-300 leading-relaxed">
              Great job staying focused and making progress on your tasks.
            </p>
          </div>
          <button
            onClick={handleExitFocus}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-lg shadow-blue-500/20 font-medium flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Planner
          </button>
        </div>
      </div>
    );
  }
  
  if (!task || !session) {
    return (
      <div className="min-h-screen bg-gray-950 dark:bg-black bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-l-2 border-blue-500 animate-spin"></div>
          <div className="absolute top-1 left-1 w-14 h-14 rounded-full border-r-2 border-b-2 border-indigo-400 animate-spin animation-delay-200"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-black bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col px-4 py-8 animate-fadeIn">
      <div className="max-w-4xl w-full mx-auto flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Focus Mode</h1>
          <button
            onClick={handleExitFocus}
            className="px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-700/80 transition-colors duration-200 flex items-center border border-white/10 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Exit Focus
          </button>
        </div>
        
        <FocusTaskView task={task} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FocusTimer
              duration={session.duration}
              onComplete={handleCompleteFocus}
              onCancel={handleCancelFocus}
            />
          </div>
          
          <div>
            <SubtaskChecklist
              task={task}
              subtaskProgress={session.subtaskProgress}
              onToggleSubtask={handleToggleSubtask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 
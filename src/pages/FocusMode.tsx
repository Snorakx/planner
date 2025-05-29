import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FocusTaskView } from "../components/FocusTaskView";
import { SubtaskChecklist } from "../components/SubtaskChecklist";
import { FocusTimer } from "../components/FocusTimer";
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-white max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleExitFocus}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Return to Planner
          </button>
        </div>
      </div>
    );
  }
  
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-white max-w-md">
          <div className="text-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-green-500 mb-4"
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
            <h2 className="text-2xl font-bold mb-2">Focus Session Complete!</h2>
            <p className="text-gray-300">
              Great job staying focused and making progress on your tasks.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleExitFocus}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Return to Planner
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!task || !session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col px-4 py-8">
      <div className="max-w-4xl w-full mx-auto flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Focus Mode</h1>
          <button
            onClick={handleExitFocus}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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
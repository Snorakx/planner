import React from "react";
import { TaskCard } from "./TaskCard";
import { Task } from "../types/Task";

interface DraggableTaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  index: number;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMarkDone: (taskId: string) => void;
  onToggleFocus: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  isDragging: boolean;
  isDraggedOver: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  index,
  onToggleSubtask,
  onMarkDone,
  onToggleFocus,
  onEditTask,
  onDeleteTask,
  isDragging,
  isDraggedOver,
  onDragStart,
  onDragOver,
  onDrop,
  dragHandleProps,
  ...rest
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        relative transition-all duration-300
        ${isDragging ? "opacity-50 scale-95" : ""}
        ${isDraggedOver ? "border-2 border-indigo-400/50 rounded-2xl -m-0.5" : ""}
      `}
      {...rest}
    >
      {/* Drag handle - ikonka po której można przeciągać */}
      <div 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
        {...dragHandleProps}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </div>
      
      {/* Dodajemy standardowy TaskCard */}
      <div className="group">
        <TaskCard
          task={task}
          onToggleSubtask={onToggleSubtask}
          onMarkDone={onMarkDone}
          onToggleFocus={onToggleFocus}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
}; 
import React, { useState } from "react";
import { Task } from "../types/Task";
import { DraggableTaskCard } from "./DraggableTaskCard";
import { useDragAndDropContext } from "../utils/ui/DragAndDropContext";
import { useDragAndDrop } from "../utils/ui/useDragAndDrop";

interface TaskListProps {
  tasks: Task[];
  onReorderTasks: (taskId: string, fromIndex: number, toIndex: number) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMarkDone: (taskId: string) => void;
  onToggleFocus: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

interface DropResult {
  id: string;
  type: string;
  fromIndex: number;
  toIndex: number;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onReorderTasks,
  onToggleSubtask,
  onMarkDone,
  onToggleFocus,
  onEditTask,
  onDeleteTask,
}) => {
  // Stan lokalny dla elementów nad którymi jest drag
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Używamy kontekstu drag-and-drop
  const { 
    draggedItemId, 
    setDraggedItemId, 
    isDragging, 
    setIsDragging 
  } = useDragAndDropContext();

  // Obsługa zakończenia operacji drag-and-drop
  const handleDrop = ({ id, fromIndex, toIndex }: DropResult) => {
    onReorderTasks(id, fromIndex, toIndex);
  };

  // Używamy hooka useDragAndDrop
  const { handleDragStart, handleDragOver, handleDrop: onDrop } = useDragAndDrop(handleDrop);
  
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${isDragging ? 'is-reordering' : ''}`}
    >
      {tasks.map((task, index) => {
        const isBeingDragged = draggedItemId === task.id;
        const isDraggedOver = dragOverIndex === index;
        
        return (
          <div 
            key={task.id} 
            id={`task-${task.id}`}
            className="transition-all duration-300"
          >
            <DraggableTaskCard
              task={task}
              index={index}
              onToggleSubtask={onToggleSubtask}
              onMarkDone={onMarkDone}
              onToggleFocus={onToggleFocus}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              isDragging={isBeingDragged}
              isDraggedOver={isDraggedOver}
              onDragStart={(e) => {
                setIsDragging(true);
                setDraggedItemId(task.id);
                handleDragStart(e, {
                  id: task.id,
                  type: 'task',
                  index
                });
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
                handleDragOver(e);
              }}
              onDrop={(e) => {
                onDrop(e, index);
                setDragOverIndex(null);
                setIsDragging(false);
                setDraggedItemId(null);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}; 
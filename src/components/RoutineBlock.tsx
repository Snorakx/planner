import React from 'react';
import { DailyRoutine } from '../types/DailyRoutine';

interface RoutineBlockProps {
  routine: DailyRoutine;
  onClick: (routine: DailyRoutine) => void;
  onDelete: (id: string) => void;
}

const RoutineBlock: React.FC<RoutineBlockProps> = ({ routine, onClick, onDelete }) => {
  const handleClick = () => {
    onClick(routine);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(routine.id);
  };

  // Określ wysokość bloku na podstawie czasu trwania (każde 15 minut = 1rem wysokości)
  const heightInRem = Math.max(2, routine.duration / 15);

  return (
    <div
      className={`relative rounded-md p-2 shadow-sm cursor-pointer transition-all hover:shadow-md ${routine.color || 'bg-blue-100 dark:bg-blue-900/30'}`}
      style={{ height: `${heightInRem}rem` }}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl" role="img" aria-label={routine.name}>
            {routine.icon}
          </span>
          <div>
            <h3 className="font-medium text-sm text-gray-900 dark:text-white">
              {routine.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {routine.time} ({routine.duration} min)
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          aria-label="Usuń rytuał"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {routine.notes && (
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden">
          {routine.notes}
        </p>
      )}
      
      <div className="absolute bottom-1 right-2 text-xs text-gray-500 dark:text-gray-400">
        {routine.repeat === 'daily' && 'Codziennie'}
        {routine.repeat === 'weekday' && 'Dni robocze'}
        {routine.repeat === 'weekend' && 'Weekendy'}
      </div>
    </div>
  );
};

export default RoutineBlock; 
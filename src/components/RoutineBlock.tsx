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

  // Funkcja zastępująca standardowe kolory gradientami dla lepszego wyglądu
  const getEnhancedColor = (baseColor: string) => {
    if (baseColor.includes('yellow')) {
      return 'bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-900/60';
    } else if (baseColor.includes('green')) {
      return 'bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/20 border border-green-200 dark:border-green-900/60';
    } else if (baseColor.includes('blue')) {
      return 'bg-gradient-to-br from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-900/20 border border-blue-200 dark:border-blue-900/60';
    } else if (baseColor.includes('indigo')) {
      return 'bg-gradient-to-br from-indigo-100 to-violet-200 dark:from-indigo-900/30 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-900/60';
    } else if (baseColor.includes('purple')) {
      return 'bg-gradient-to-br from-purple-100 to-fuchsia-200 dark:from-purple-900/30 dark:to-fuchsia-900/20 border border-purple-200 dark:border-purple-900/60';
    } else if (baseColor.includes('pink')) {
      return 'bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/30 dark:to-rose-900/20 border border-pink-200 dark:border-pink-900/60';
    } else if (baseColor.includes('red')) {
      return 'bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-900/20 border border-red-200 dark:border-red-900/60';
    } else if (baseColor.includes('orange')) {
      return 'bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/30 dark:to-amber-900/20 border border-orange-200 dark:border-orange-900/60';
    } else if (baseColor.includes('gray')) {
      return 'bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-800/60';
    }
    
    // Domyślny niebieski
    return 'bg-gradient-to-br from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-900/20 border border-blue-200 dark:border-blue-900/60';
  };

  return (
    <div
      className={`relative rounded-md p-2 shadow-sm cursor-pointer transition-all duration-200 
        hover:shadow-md hover:translate-x-0.5 hover:-translate-y-0.5 
        ${getEnhancedColor(routine.color || 'bg-blue-100')}`}
      style={{ height: `${heightInRem}rem` }}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl filter drop-shadow-sm" role="img" aria-label={routine.name}>
            {routine.icon}
          </span>
          <div>
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {routine.name}
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              {routine.time} ({routine.duration} min)
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 
            transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
          aria-label="Usuń rytuał"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {routine.notes && (
        <p className="mt-1 text-xs text-gray-700 dark:text-gray-400 line-clamp-2 overflow-hidden">
          {routine.notes}
        </p>
      )}
      
      <div className="absolute bottom-1 right-2 text-xs text-gray-600 dark:text-gray-500 font-medium">
        {routine.repeat === 'daily' && 'Codziennie'}
        {routine.repeat === 'weekday' && 'Dni robocze'}
        {routine.repeat === 'weekend' && 'Weekendy'}
      </div>
    </div>
  );
};

export default RoutineBlock; 
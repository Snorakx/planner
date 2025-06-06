import React from 'react';
import { DailyRoutine } from '../../types/DailyRoutine';

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

  // Uzyskaj kolor w stylu iOS Health/Fitness
  const getIOSStyleColor = (baseColor: string) => {
    // Usuwamy tailwind classes, wyciągamy podstawowy kolor
    const colorName = baseColor.match(/(yellow|green|blue|indigo|purple|pink|red|orange|gray)/)?.[0] || 'blue';
    
    // Mapowanie kolorów na paletę w stylu iOS
    const colorMap: Record<string, string> = {
      yellow: 'bg-amber-400/10 border-amber-400/20 dark:bg-amber-400/15 dark:border-amber-400/30',
      green: 'bg-green-400/10 border-green-400/20 dark:bg-green-400/15 dark:border-green-400/30',
      blue: 'bg-blue-400/10 border-blue-400/20 dark:bg-blue-400/15 dark:border-blue-400/30',
      indigo: 'bg-indigo-400/10 border-indigo-400/20 dark:bg-indigo-400/15 dark:border-indigo-400/30',
      purple: 'bg-purple-400/10 border-purple-400/20 dark:bg-purple-400/15 dark:border-purple-400/30',
      pink: 'bg-pink-400/10 border-pink-400/20 dark:bg-pink-400/15 dark:border-pink-400/30',
      red: 'bg-red-400/10 border-red-400/20 dark:bg-red-400/15 dark:border-red-400/30',
      orange: 'bg-orange-400/10 border-orange-400/20 dark:bg-orange-400/15 dark:border-orange-400/30',
      gray: 'bg-neutral-400/10 border-neutral-400/20 dark:bg-neutral-400/15 dark:border-neutral-400/30',
    };
    
    return colorMap[colorName] || 'bg-blue-400/10 border-blue-400/20 dark:bg-blue-400/15 dark:border-blue-400/30';
  };

  return (
    <div
      className={`rounded-xl backdrop-blur-md ${getIOSStyleColor(routine.color || '')} 
        shadow-sm border p-3 cursor-pointer transition-all duration-200 
        hover:bg-white/20 dark:hover:bg-white/10`}
      style={{ height: `${heightInRem}rem` }}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl" role="img" aria-label={routine.name}>
            {routine.icon}
          </span>
          <div>
            <h3 className="font-medium text-sm text-black dark:text-white">
              {routine.name}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {routine.time} ({routine.duration} min)
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-500 
            hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 
            transition-colors hover:bg-white/20 dark:hover:bg-white/10"
          aria-label="Usuń rytuał"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {routine.notes && (
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 overflow-hidden">
          {routine.notes}
        </p>
      )}
      
      <div className="absolute bottom-2 right-3 text-[10px] font-medium text-neutral-500 dark:text-neutral-500">
        {routine.repeat === 'daily' && 'Codziennie'}
        {routine.repeat === 'weekday' && 'Dni robocze'}
        {routine.repeat === 'weekend' && 'Weekendy'}
      </div>
    </div>
  );
};

export default RoutineBlock; 
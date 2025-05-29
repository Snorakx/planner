import React, { useMemo } from 'react';
import { CombinedBlock, DailyRoutine, TimeSlot } from '../types/DailyRoutine';
import RoutineBlock from './RoutineBlock';
import { Task } from '../types/Task';

interface DailyTimelineProps {
  timeSlots: TimeSlot[];
  blocks: CombinedBlock[];
  onRoutineClick: (routine: DailyRoutine) => void;
  onTaskClick: (task: Task) => void;
  onRoutineDelete: (id: string) => void;
  currentTime?: string; // Format HH:MM - obecny czas do wyświetlenia wskaźnika
}

const DailyTimeline: React.FC<DailyTimelineProps> = ({
  timeSlots,
  blocks,
  onRoutineClick,
  onTaskClick,
  onRoutineDelete,
  currentTime
}) => {
  // Funkcja pomocnicza do konwersji czasu (HH:MM) na indeks na osi czasu
  const getTimeIndex = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const firstSlotHour = Number(timeSlots[0].time.split(':')[0]);
    
    // Indeks = (godzina - początkowa godzina) * 2 + (minuty >= 30 ? 1 : 0)
    return (hours - firstSlotHour) * 2 + (minutes >= 30 ? 1 : 0);
  };

  // Mapa bloków według ich indeksu czasowego
  const blocksByTimeIndex = useMemo(() => {
    const result: Record<number, CombinedBlock[]> = {};
    
    blocks.forEach(block => {
      const startIndex = getTimeIndex(block.startTime);
      
      if (!result[startIndex]) {
        result[startIndex] = [];
      }
      
      result[startIndex].push(block);
    });
    
    return result;
  }, [blocks]);

  // Indeks obecnego czasu na osi
  const currentTimeIndex = currentTime ? getTimeIndex(currentTime) : -1;

  return (
    <div className="relative w-full overflow-y-auto h-[calc(100vh-180px)] pr-2 rounded-lg">
      <div className="grid grid-cols-[80px_1fr] gap-2">
        {/* Lewa kolumna z godzinami */}
        <div className="flex flex-col sticky left-0 z-10">
          {timeSlots.map((slot, index) => (
            <div 
              key={`time-${index}`}
              className={`
                flex items-center justify-end pr-2 h-12
                ${slot.isHalfHour 
                  ? 'text-xs text-gray-400 dark:text-gray-500' 
                  : 'text-sm font-medium text-gray-700 dark:text-gray-300'}
              `}
            >
              {slot.time}
            </div>
          ))}
        </div>

        {/* Prawa kolumna z blokami */}
        <div className="relative flex flex-col flex-1 bg-gray-50/60 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-inner">
          {/* Linie czasowe */}
          {timeSlots.map((slot, index) => (
            <div 
              key={`slot-${index}`}
              className={`
                relative h-12 border-t dark:bg-opacity-50
                ${slot.isHalfHour 
                  ? 'border-gray-200 dark:border-gray-800/60' 
                  : 'border-t-2 border-gray-300 dark:border-gray-700'}
                ${currentTimeIndex === index 
                  ? 'bg-gradient-to-r from-yellow-50/80 to-yellow-50/20 dark:from-amber-900/20 dark:to-transparent' 
                  : index % 4 === 0 
                    ? 'bg-gray-100/40 dark:bg-gray-850/40' 
                    : ''}
                transition-colors duration-150
              `}
            >
              {/* Bloki na danym slocie czasowym */}
              {blocksByTimeIndex[index]?.map((block) => (
                <div 
                  key={`block-${block.id}`}
                  className="absolute left-0 right-0 z-10"
                  style={{
                    top: '4px',
                  }}
                >
                  {block.isRoutine ? (
                    <RoutineBlock 
                      routine={block.data as DailyRoutine}
                      onClick={onRoutineClick}
                      onDelete={onRoutineDelete}
                    />
                  ) : (
                    <div 
                      className={`
                        rounded-md p-2 shadow-sm cursor-pointer 
                        transition-all hover:shadow-md hover:translate-x-0.5 hover:-translate-y-0.5
                        ${block.color || 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'}
                        dark:border dark:border-gray-800/50
                      `}
                      onClick={() => onTaskClick(block.data as Task)}
                      style={{ minHeight: '2rem' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                            {block.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {block.startTime} - {block.endTime}
                          </p>
                        </div>
                        {block.data.focus && (
                          <span className="text-red-500 dark:text-red-400 text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 rounded-full border border-red-200 dark:border-red-800">
                            Priorytet
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Wskaźnik obecnego czasu */}
          {currentTimeIndex >= 0 && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 dark:border-red-400 z-20 pointer-events-none"
              style={{ 
                top: `${currentTimeIndex * 48 + 24}px`,
              }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-red-500 dark:bg-red-400 shadow-lg shadow-red-500/30 dark:shadow-red-600/40 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTimeline; 
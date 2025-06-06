import React, { useMemo } from 'react';
import { CombinedBlock, DailyRoutine, TimeSlot } from '../../types/DailyRoutine';
import RoutineBlock from './RoutineBlock';
import { Task } from '../../types/Task';

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
    <div className="relative w-full h-[calc(100vh-280px)] overflow-auto">
      <div className="grid grid-cols-[70px_1fr] gap-2">
        {/* Lewa kolumna z godzinami */}
        <div className="flex flex-col sticky left-0 z-10">
          {timeSlots.map((slot, index) => (
            <div 
              key={`time-${index}`}
              className={`
                flex items-center justify-end pr-3 h-14
                ${slot.isHalfHour 
                  ? 'text-xs text-neutral-400 dark:text-neutral-500 font-medium' 
                  : 'text-sm font-medium text-neutral-600 dark:text-neutral-300'}
              `}
            >
              {slot.time}
            </div>
          ))}
        </div>

        {/* Prawa kolumna z blokami */}
        <div className="relative flex flex-col flex-1">
          {/* Linie czasowe */}
          {timeSlots.map((slot, index) => (
            <div 
              key={`slot-${index}`}
              className={`
                relative h-14 border-t
                ${slot.isHalfHour 
                  ? 'border-neutral-200/30 dark:border-neutral-700/30' 
                  : 'border-neutral-200/50 dark:border-neutral-700/50'}
                ${currentTimeIndex === index 
                  ? 'bg-blue-50/20 dark:bg-blue-900/10' 
                  : ''}
                transition-colors duration-150
              `}
            >
              {/* Bloki na danym slocie czasowym */}
              {blocksByTimeIndex[index]?.map((block) => (
                <div 
                  key={`block-${block.id}`}
                  className="absolute left-3 right-3 z-10"
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
                      className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/10 shadow-sm 
                        p-3 cursor-pointer transition-all duration-200 hover:bg-white/20 dark:hover:bg-white/10"
                      onClick={() => onTaskClick(block.data as Task)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm text-black dark:text-white">
                            {block.title}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {block.startTime} - {block.endTime}
                          </p>
                        </div>
                        {block.data.focus && (
                          <span className="text-xs px-2 py-0.5 bg-red-500/10 dark:bg-red-500/20 
                            text-red-600 dark:text-red-400 rounded-full border border-red-500/20">
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
              className="absolute left-0 right-0 border-t-2 border-blue-500 dark:border-blue-400 z-20 pointer-events-none"
              style={{ 
                top: `${currentTimeIndex * 56 + 28}px`,
              }}
            >
              <div className="absolute -top-[5px] -left-1 w-[10px] h-[10px] rounded-full bg-blue-500 dark:bg-blue-400 shadow-md"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTimeline; 
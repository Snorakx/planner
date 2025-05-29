import React, { useState, useEffect, useCallback } from 'react';
import { DailyRoutine } from '../types/DailyRoutine';
import { Task } from '../types/Task';
import DailyTimeline from '../components/DailyTimeline';
import RoutineForm from '../components/RoutineForm';
import { DailyStructureService } from '../services/DailyStructureService';
import { DailyRoutineRepository } from '../repositories/DailyRoutineRepository';

const DailyView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timelineBlocks, setTimelineBlocks] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState<DailyRoutine | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [suggestedRoutines, setSuggestedRoutines] = useState<DailyRoutine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Serwisy
  const dailyStructureService = DailyStructureService.getInstance();
  const routineRepository = DailyRoutineRepository.getInstance();
  
  // Formatuj datę do wyświetlenia
  const formattedDate = new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(selectedDate);
  
  // Pobierz bieżący czas w formacie HH:MM
  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);
  
  // Załaduj dane osi czasu
  const loadTimelineData = useCallback(async () => {
    try {
      // Generuj sloty czasowe
      const slots = dailyStructureService.generateTimeSlots(6, 23);
      setTimeSlots(slots);
      
      // Pobierz połączone bloki (rytuały + zadania)
      const blocks = await dailyStructureService.getTimelineWithRoutines(selectedDate);
      setTimelineBlocks(blocks);
    } catch (error) {
      console.error('Error loading timeline data:', error);
    }
  }, [selectedDate, dailyStructureService]);
  
  // Sprawdź czy są dostępne sugestie dla rytualów
  const checkForSuggestions = useCallback(async () => {
    try {
      const suggestions = await dailyStructureService.suggestRoutineFromPattern();
      setSuggestedRoutines(suggestions);
    } catch (error) {
      console.error('Error checking for routine suggestions:', error);
    }
  }, [dailyStructureService]);
  
  // Efekt inicjalizacji
  useEffect(() => {
    loadTimelineData();
    updateCurrentTime();
    checkForSuggestions();
    
    // Aktualizuj bieżący czas co minutę
    const timeInterval = setInterval(updateCurrentTime, 60000);
    
    return () => {
      clearInterval(timeInterval);
    };
  }, [loadTimelineData, updateCurrentTime, checkForSuggestions]);
  
  // Obsługa zmiany daty
  const handleDateChange = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };
  
  // Obsługa kliknięcia w rytuał
  const handleRoutineClick = (routine: DailyRoutine) => {
    setCurrentRoutine(routine);
    setShowRoutineForm(true);
  };
  
  // Obsługa kliknięcia w zadanie
  const handleTaskClick = (task: Task) => {
    // Nawigacja do szczegółów zadania lub akcja
    console.log('Task clicked:', task);
  };
  
  // Obsługa zapisania rytuału
  const handleSaveRoutine = async (routine: DailyRoutine) => {
    try {
      await routineRepository.saveRoutine(routine);
      setShowRoutineForm(false);
      setCurrentRoutine(undefined);
      loadTimelineData(); // Odśwież dane
    } catch (error) {
      console.error('Error saving routine:', error);
    }
  };
  
  // Obsługa usunięcia rytuału
  const handleDeleteRoutine = async (id: string) => {
    try {
      if (window.confirm('Czy na pewno chcesz usunąć ten rytuał?')) {
        await routineRepository.deleteRoutine(id);
        loadTimelineData(); // Odśwież dane
      }
    } catch (error) {
      console.error('Error deleting routine:', error);
    }
  };
  
  // Obsługa dodania sugerowanego rytuału
  const handleAddSuggestion = async (routine: DailyRoutine) => {
    try {
      await routineRepository.saveRoutine(routine);
      // Usuń sugestię z listy
      setSuggestedRoutines(prevSuggestions => 
        prevSuggestions.filter(r => r.id !== routine.id)
      );
      loadTimelineData(); // Odśwież dane
    } catch (error) {
      console.error('Error adding suggested routine:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="pt-6 pb-4 px-6 sticky top-0 z-10 bg-neutral-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold text-black dark:text-white tracking-tight">
            Rytm Dnia
          </h1>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => handleDateChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:bg-white/10 dark:text-neutral-300 
                dark:hover:bg-white/10 transition-colors"
              aria-label="Poprzedni dzień"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 
                dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-sm"
            >
              Dzisiaj
            </button>
            <button 
              onClick={() => handleDateChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:bg-white/10 dark:text-neutral-300 
                dark:hover:bg-white/10 transition-colors"
              aria-label="Następny dzień"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-base text-neutral-600 dark:text-neutral-400 capitalize">
              {formattedDate}
            </h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCurrentRoutine(undefined);
                setShowRoutineForm(true);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/10 
                text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/20 transition-colors shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nowy rytuał
            </button>
            
            {suggestedRoutines.length > 0 && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/10
                  text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/20 transition-colors shadow-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Sugestie ({suggestedRoutines.length})
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal formularza rytuału */}
      {showRoutineForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-xl 
            max-w-lg w-full p-6 animate-fadeIn border border-white/20 dark:border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
              {currentRoutine ? 'Edytuj rytuał' : 'Nowy rytuał'}
            </h2>
            <RoutineForm 
              routine={currentRoutine}
              onSave={handleSaveRoutine}
              onCancel={() => {
                setShowRoutineForm(false);
                setCurrentRoutine(undefined);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Modal sugestii rytuałów */}
      {showSuggestions && suggestedRoutines.length > 0 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-xl 
            max-w-lg w-full p-6 animate-fadeIn border border-white/20 dark:border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Sugerowane rytuały
              </h2>
              <button 
                onClick={() => setShowSuggestions(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:bg-white/10 
                  dark:text-neutral-300 dark:hover:bg-white/10 transition-colors"
                aria-label="Zamknij"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Na podstawie Twoich wzorców aktywności, sugerujemy następujące rytuały do dodania:
            </p>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {suggestedRoutines.map(routine => (
                <div 
                  key={routine.id} 
                  className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm border border-white/10 
                    transition-all duration-200 hover:bg-white/20 dark:hover:bg-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl" role="img" aria-label={routine.name}>
                        {routine.icon}
                      </span>
                      <div>
                        <h3 className="font-medium text-black dark:text-white">
                          {routine.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {routine.time} ({routine.duration} min) • 
                          {routine.repeat === 'daily' && ' Codziennie'}
                          {routine.repeat === 'weekday' && ' Dni robocze'}
                          {routine.repeat === 'weekend' && ' Weekendy'}
                        </p>
                        {routine.notes && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                            {routine.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddSuggestion(routine)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 
                        shadow-sm transition-colors"
                    >
                      Dodaj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Sekcja podsumowania */}
          <div className="mb-6 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-1">Dzisiejszy plan</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Stałe rytuały zmniejszają zmęczenie decyzyjne i zwiększają przewidywalność dnia.
              </p>
              
              {/* Pasek postępu dnia */}
              <div className="mt-4 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-500">00:00</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-500">24:00</span>
                </div>
                <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  {currentTime && (
                    <div 
                      className="h-full bg-blue-500 dark:bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${Math.min(
                          (parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1])) / (24 * 60) * 100, 
                          100
                        )}%` 
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Oś czasu */}
          <div className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 overflow-hidden">
            {timeSlots.length > 0 ? (
              <DailyTimeline
                timeSlots={timeSlots}
                blocks={timelineBlocks}
                onRoutineClick={handleRoutineClick}
                onTaskClick={handleTaskClick}
                onRoutineDelete={handleDeleteRoutine}
                currentTime={currentTime}
              />
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {/* Sekcja wskazówek */}
          <div className="mt-6 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-inner border border-white/10 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-full p-2.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-black dark:text-white text-base mb-1">Wskazówka</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Spróbuj ustalić 3-4 stałe punkty w ciągu dnia, które będą kotwicami dla Twojej uwagi.
                    Regularne przerwy pomiędzy zadaniami pozwolą zachować lepszą koncentrację.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView; 
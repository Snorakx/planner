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
    <div className="flex flex-col h-full">
      {/* Nagłówek */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span role="img" aria-label="Daily Structure">📅</span> 
            Struktura Dnia
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleDateChange(-1)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40"
            >
              Dzisiaj
            </button>
            <button 
              onClick={() => handleDateChange(1)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-lg text-gray-700 dark:text-gray-300 capitalize">
              {formattedDate}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Zaplanuj swój dzień z przewidywalną strukturą
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCurrentRoutine(undefined);
                setShowRoutineForm(true);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj rytuał
            </button>
            
            {suggestedRoutines.length > 0 && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Sugestie ({suggestedRoutines.length})
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal formularza rytuału */}
      {showRoutineForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sugerowane rytuały
              </h2>
              <button 
                onClick={() => setShowSuggestions(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Na podstawie Twoich wzorców aktywności, sugerujemy następujące rytuały do dodania:
            </p>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {suggestedRoutines.map(routine => (
                <div 
                  key={routine.id} 
                  className={`p-3 rounded-md ${routine.color}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl" role="img" aria-label={routine.name}>
                        {routine.icon}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {routine.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {routine.time} ({routine.duration} min) • 
                          {routine.repeat === 'daily' && ' Codziennie'}
                          {routine.repeat === 'weekday' && ' Dni robocze'}
                          {routine.repeat === 'weekend' && ' Weekendy'}
                        </p>
                        {routine.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {routine.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddSuggestion(routine)}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
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
      
      {/* Główna zawartość - oś czasu */}
      <div className="flex-1 overflow-hidden p-4">
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
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Ładowanie struktury dnia...</p>
          </div>
        )}
      </div>
      
      {/* Panel informacyjny ADHD */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-t border-blue-100 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300 text-sm">Wskazówka ADHD</h3>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Stałe rytuały zmniejszają zmęczenie decyzyjne i zwiększają przewidywalność dnia.
              Spróbuj ustalić 3-4 stałe punkty, które będą kotwicami dla Twojej uwagi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView; 
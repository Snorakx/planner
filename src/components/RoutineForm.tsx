import React, { useState, useEffect } from 'react';
import { DailyRoutine } from '../types/DailyRoutine';
import { v4 as uuidv4 } from 'uuid';

interface RoutineFormProps {
  routine?: DailyRoutine;
  onSave: (routine: DailyRoutine) => void;
  onCancel: () => void;
}

// Predefiniowane ikony do wyboru
const ICONS = ['☀️', '🍽️', '🧘', '💤', '📝', '📚', '💻', '🏃', '🧹', '🍲', '🚿', '📱'];

// Predefiniowane kolory do wyboru
const COLORS = [
  { label: 'Żółty', value: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { label: 'Zielony', value: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Niebieski', value: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Indygo', value: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { label: 'Fioletowy', value: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Różowy', value: 'bg-pink-100 dark:bg-pink-900/30' },
  { label: 'Czerwony', value: 'bg-red-100 dark:bg-red-900/30' },
  { label: 'Pomarańczowy', value: 'bg-orange-100 dark:bg-orange-900/30' },
  { label: 'Szary', value: 'bg-gray-100 dark:bg-gray-800' },
];

const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('☀️');
  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState('30');
  const [repeat, setRepeat] = useState<'daily' | 'weekday' | 'weekend'>('daily');
  const [color, setColor] = useState('bg-yellow-100 dark:bg-yellow-900/30');
  const [notes, setNotes] = useState('');

  // Inicjalizacja formularza przy edycji istniejącego rytuału
  useEffect(() => {
    if (routine) {
      setName(routine.name);
      setIcon(routine.icon);
      setTime(routine.time);
      setDuration(routine.duration.toString());
      setRepeat(routine.repeat);
      setColor(routine.color || 'bg-yellow-100 dark:bg-yellow-900/30');
      setNotes(routine.notes || '');
    }
  }, [routine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoutine: DailyRoutine = {
      id: routine?.id || uuidv4(),
      name,
      icon,
      time,
      duration: parseInt(duration, 10),
      repeat,
      color,
      notes: notes.trim() || undefined
    };
    
    onSave(newRoutine);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nazwa rytuału
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="np. Poranna rutyna"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ikona
        </label>
        <div className="mt-1 grid grid-cols-6 gap-2">
          {ICONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`
                flex items-center justify-center p-2 rounded-md text-xl
                ${icon === emoji 
                  ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Czas rozpoczęcia
          </label>
          <input
            type="time"
            id="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Czas trwania (min)
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="15">15 minut</option>
            <option value="30">30 minut</option>
            <option value="45">45 minut</option>
            <option value="60">1 godzina</option>
            <option value="90">1.5 godziny</option>
            <option value="120">2 godziny</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="repeat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Powtarzanie
        </label>
        <select
          id="repeat"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as 'daily' | 'weekday' | 'weekend')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="daily">Codziennie</option>
          <option value="weekday">Dni robocze (pon-pt)</option>
          <option value="weekend">Weekendy (sob-nd)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kolor
        </label>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {COLORS.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setColor(colorOption.value)}
              className={`
                flex items-center justify-center p-2 rounded-md text-sm h-8
                ${colorOption.value}
                ${color === colorOption.value 
                  ? 'ring-2 ring-blue-500' 
                  : 'hover:opacity-80'
                }
              `}
            >
              {color === colorOption.value && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notatki (opcjonalnie)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Dodatkowe informacje o rytuale..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {routine ? 'Zapisz zmiany' : 'Dodaj rytuał'}
        </button>
      </div>
    </form>
  );
};

export default RoutineForm; 
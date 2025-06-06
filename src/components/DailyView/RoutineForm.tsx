import React, { useState, useEffect } from 'react';
import { DailyRoutine } from '../../types/DailyRoutine';
import { v4 as uuidv4 } from 'uuid';

interface RoutineFormProps {
  routine?: DailyRoutine;
  onSave: (routine: DailyRoutine) => void;
  onCancel: () => void;
}

// Predefiniowane ikony do wyboru
const ICONS = ['☀️', '🍽️', '🧘', '💤', '📝', '📚', '💻', '🏃', '🧹', '🍲', '🚿', '📱'];

// Predefiniowane kolory do wyboru z nazwami i wartościami w stylu iOS
const COLORS = [
  { 
    label: 'Żółty', 
    value: 'bg-yellow-100 dark:bg-yellow-900/30',
    preview: 'bg-amber-400/20 dark:bg-amber-400/30'
  },
  { 
    label: 'Zielony', 
    value: 'bg-green-100 dark:bg-green-900/30',
    preview: 'bg-green-400/20 dark:bg-green-400/30'
  },
  { 
    label: 'Niebieski', 
    value: 'bg-blue-100 dark:bg-blue-900/30',
    preview: 'bg-blue-400/20 dark:bg-blue-400/30'
  },
  { 
    label: 'Indygo', 
    value: 'bg-indigo-100 dark:bg-indigo-900/30',
    preview: 'bg-indigo-400/20 dark:bg-indigo-400/30'
  },
  { 
    label: 'Fioletowy', 
    value: 'bg-purple-100 dark:bg-purple-900/30',
    preview: 'bg-purple-400/20 dark:bg-purple-400/30'
  },
  { 
    label: 'Różowy', 
    value: 'bg-pink-100 dark:bg-pink-900/30',
    preview: 'bg-pink-400/20 dark:bg-pink-400/30'
  },
  { 
    label: 'Czerwony', 
    value: 'bg-red-100 dark:bg-red-900/30',
    preview: 'bg-red-400/20 dark:bg-red-400/30'
  },
  { 
    label: 'Pomarańczowy', 
    value: 'bg-orange-100 dark:bg-orange-900/30',
    preview: 'bg-orange-400/20 dark:bg-orange-400/30'
  },
  { 
    label: 'Szary', 
    value: 'bg-gray-100 dark:bg-gray-800',
    preview: 'bg-neutral-400/20 dark:bg-neutral-400/30'
  },
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

  // Znajdź obiekt koloru na podstawie wartości
  const getColorPreview = (colorValue: string) => {
    const colorObj = COLORS.find(c => c.value === colorValue);
    return colorObj?.preview || COLORS[0].preview;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
          Nazwa rytuału
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 
            backdrop-blur-md border border-white/10 text-black dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
          placeholder="np. Poranna rutyna"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
          Ikona
        </label>
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`
                flex items-center justify-center p-2 rounded-xl text-xl h-12 w-full transition-all duration-200
                ${icon === emoji 
                  ? 'bg-blue-500/20 dark:bg-blue-500/30 border border-blue-500/30 dark:border-blue-400/50 shadow-sm' 
                  : 'bg-white/5 backdrop-blur-md dark:bg-white/5 border border-white/10 hover:bg-white/10'
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
          <label htmlFor="time" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
            Czas rozpoczęcia
          </label>
          <input
            type="time"
            id="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block w-full px-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 
              backdrop-blur-md border border-white/10 text-black dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
            Czas trwania (min)
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full px-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 
              backdrop-blur-md border border-white/10 text-black dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1rem' }}
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
        <label htmlFor="repeat" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
          Powtarzanie
        </label>
        <select
          id="repeat"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as 'daily' | 'weekday' | 'weekend')}
          className="block w-full px-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 
            backdrop-blur-md border border-white/10 text-black dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
            backgroundRepeat: 'no-repeat', 
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1rem' }}
        >
          <option value="daily">Codziennie</option>
          <option value="weekday">Dni robocze (pon-pt)</option>
          <option value="weekend">Weekendy (sob-nd)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
          Kolor
        </label>
        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setColor(colorOption.value)}
              className={`
                flex items-center justify-center p-2 rounded-xl h-10 transition-all duration-200
                ${colorOption.preview}
                ${color === colorOption.value 
                  ? 'border border-blue-500/30 dark:border-blue-400/50 shadow-sm' 
                  : 'border border-white/10 hover:border-white/20'
                }
              `}
              title={colorOption.label}
            >
              {color === colorOption.value && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
          Notatki (opcjonalnie)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="block w-full px-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 
            backdrop-blur-md border border-white/10 text-black dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 resize-none"
          placeholder="Dodatkowe informacje o rytuale..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-md 
            border border-white/10 text-black dark:text-white hover:bg-white/20 
            transition-colors duration-200"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full text-sm font-medium bg-blue-500 text-white 
            hover:bg-blue-600 transition-colors duration-200"
        >
          {routine ? 'Zapisz zmiany' : 'Dodaj rytuał'}
        </button>
      </div>
    </form>
  );
};

export default RoutineForm; 
import { v4 as uuidv4 } from 'uuid';
import { DailyRoutine } from '../types/DailyRoutine';

export class DailyRoutineRepository {
  private static instance: DailyRoutineRepository;
  private storageKey = 'planner_daily_routines';

  // Domyślne, wstępne rytuały dla nowego użytkownika
  private defaultRoutines: DailyRoutine[] = [
    {
      id: uuidv4(),
      name: 'Poranna rutyna',
      icon: '☀️',
      time: '07:00',
      duration: 45,
      repeat: 'daily',
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
      notes: 'Prysznic, śniadanie, planowanie dnia'
    },
    {
      id: uuidv4(),
      name: 'Lunch',
      icon: '🍽️',
      time: '13:00',
      duration: 30,
      repeat: 'weekday',
      color: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: uuidv4(),
      name: 'Czas odpoczynku',
      icon: '🧘',
      time: '18:00',
      duration: 60,
      repeat: 'daily',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      notes: 'Relaks, medytacja, brak ekranów'
    },
    {
      id: uuidv4(),
      name: 'Wieczorna rutyna',
      icon: '💤',
      time: '22:00',
      duration: 30,
      repeat: 'daily',
      color: 'bg-indigo-100 dark:bg-indigo-900/30',
      notes: 'Przygotowanie do snu, planowanie następnego dnia'
    }
  ];

  private constructor() {
    // Inicjalizacja domyślnymi rytuałami, jeśli nie ma żadnych zapisanych
    this.initializeDefaultRoutines();
  }

  public static getInstance(): DailyRoutineRepository {
    if (!DailyRoutineRepository.instance) {
      DailyRoutineRepository.instance = new DailyRoutineRepository();
    }
    return DailyRoutineRepository.instance;
  }

  /**
   * Inicjalizuje domyślne rytuały dla nowego użytkownika, jeśli nie ma żadnych zapisanych
   */
  private initializeDefaultRoutines(): void {
    try {
      const existingRoutines = localStorage.getItem(this.storageKey);
      if (!existingRoutines) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.defaultRoutines));
      }
    } catch (error) {
      console.error('Error initializing default routines:', error);
    }
  }

  /**
   * Pobiera wszystkie rytuały z localStorage
   */
  public async getAllRoutines(): Promise<DailyRoutine[]> {
    try {
      const routinesJson = localStorage.getItem(this.storageKey);
      if (!routinesJson) {
        return [];
      }
      
      const routines: DailyRoutine[] = JSON.parse(routinesJson);
      
      // Sortuj rytuały według czasu (od najwcześniejszego do najpóźniejszego)
      return routines.sort((a, b) => {
        const timeA = this.convertTimeToMinutes(a.time);
        const timeB = this.convertTimeToMinutes(b.time);
        return timeA - timeB;
      });
    } catch (error) {
      console.error('Error getting daily routines:', error);
      return [];
    }
  }

  /**
   * Zapisuje nowy lub aktualizuje istniejący rytuał
   */
  public async saveRoutine(routine: DailyRoutine): Promise<void> {
    try {
      const routines = await this.getAllRoutines();
      
      // Sprawdź, czy to nowy rytuał czy aktualizacja istniejącego
      const existingIndex = routines.findIndex(r => r.id === routine.id);
      
      if (existingIndex >= 0) {
        // Aktualizacja istniejącego rytuału
        routines[existingIndex] = routine;
      } else {
        // Dodanie nowego rytuału
        if (!routine.id) {
          routine.id = uuidv4(); // Generuj ID, jeśli nie zostało podane
        }
        routines.push(routine);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(routines));
    } catch (error) {
      console.error('Error saving daily routine:', error);
      throw new Error('Failed to save daily routine');
    }
  }

  /**
   * Usuwa rytuał o podanym ID
   */
  public async deleteRoutine(id: string): Promise<void> {
    try {
      const routines = await this.getAllRoutines();
      const updatedRoutines = routines.filter(routine => routine.id !== id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedRoutines));
    } catch (error) {
      console.error('Error deleting daily routine:', error);
      throw new Error('Failed to delete daily routine');
    }
  }

  /**
   * Pobiera rytuały dla konkretnego dnia tygodnia
   */
  public async getRoutinesForDay(date: Date): Promise<DailyRoutine[]> {
    try {
      const allRoutines = await this.getAllRoutines();
      const dayOfWeek = date.getDay(); // 0 = niedziela, 1-5 = poniedziałek-piątek, 6 = sobota
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Filtruj rytuały według dnia tygodnia
      return allRoutines.filter(routine => {
        if (routine.repeat === 'daily') {
          return true;
        } else if (routine.repeat === 'weekday' && !isWeekend) {
          return true;
        } else if (routine.repeat === 'weekend' && isWeekend) {
          return true;
        }
        return false;
      });
    } catch (error) {
      console.error('Error getting routines for day:', error);
      return [];
    }
  }

  /**
   * Konwertuje czas w formacie "HH:MM" na liczbę minut od północy
   */
  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
} 
import { TaskRepository } from "../repositories/TaskRepository";
import { DailyRoutineRepository } from "../repositories/DailyRoutineRepository";
import { Task } from "../types/Task";
import { CombinedBlock, DailyRoutine, TimeSlot } from "../types/DailyRoutine";
import { v4 as uuidv4 } from 'uuid';

export class DailyStructureService {
  private static instance: DailyStructureService;
  private taskRepository: TaskRepository;
  private routineRepository: DailyRoutineRepository;

  private constructor() {
    this.taskRepository = TaskRepository.getInstance();
    this.routineRepository = DailyRoutineRepository.getInstance();
  }

  public static getInstance(): DailyStructureService {
    if (!DailyStructureService.instance) {
      DailyStructureService.instance = new DailyStructureService();
    }
    return DailyStructureService.instance;
  }

  /**
   * Generuje oś czasu z przedziałami co 30 minut
   */
  public generateTimeSlots(startHour: number = 6, endHour: number = 23): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Pełna godzina
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        isHalfHour: false
      });
      
      // Połowa godziny
      if (hour < endHour) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:30`,
          isHalfHour: true
        });
      }
    }
    
    return slots;
  }

  /**
   * Zwraca zadania na wybrany dzień
   */
  private async getTasksForDate(date: Date): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks();
    const dateString = date.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      // Sprawdź, czy zadanie ma ustawiony czas rozpoczęcia
      if (task.startTime) {
        const taskCreatedDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskCreatedDate === dateString;
      }
      return false;
    });
  }

  /**
   * Łączy rytuały i zadania na oś czasu
   */
  public async getTimelineWithRoutines(date: Date): Promise<CombinedBlock[]> {
    // Pobierz rytuały i zadania na wybrany dzień
    const routines = await this.routineRepository.getRoutinesForDay(date);
    const tasks = await this.getTasksForDate(date);
    
    const combinedBlocks: CombinedBlock[] = [];
    
    // Dodaj rytuały do osi czasu
    for (const routine of routines) {
      const [hours, minutes] = routine.time.split(':').map(Number);
      
      // Oblicz czas zakończenia
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + routine.duration);
      
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      combinedBlocks.push({
        id: routine.id,
        title: routine.name,
        icon: routine.icon,
        color: routine.color,
        duration: routine.duration,
        startTime: routine.time,
        endTime: endTime,
        type: 'routine',
        data: routine,
        isRoutine: true
      });
    }
    
    // Dodaj zadania do osi czasu
    for (const task of tasks) {
      if (task.startTime) {
        // Załóżmy domyślny czas trwania zadania na 30 minut, jeśli nie mamy lepszej informacji
        const defaultDuration = 30;
        
        const [hours, minutes] = task.startTime.split(':').map(Number);
        
        // Oblicz czas zakończenia
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + defaultDuration);
        
        const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
        
        combinedBlocks.push({
          id: task.id,
          title: task.title,
          duration: defaultDuration,
          startTime: task.startTime,
          endTime: endTime,
          type: 'task',
          data: task,
          isRoutine: false,
          color: task.focus ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'
        });
      }
    }
    
    // Sortuj bloki według czasu rozpoczęcia
    return combinedBlocks.sort((a, b) => {
      return this.compareTimeStrings(a.startTime, b.startTime);
    });
  }

  /**
   * Porównuje dwa stringi czasowe w formacie "HH:MM"
   */
  private compareTimeStrings(time1: string, time2: string): number {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    
    if (hours1 !== hours2) {
      return hours1 - hours2;
    }
    
    return minutes1 - minutes2;
  }

  /**
   * Analizuje wzorce zachowań użytkownika i sugeruje nowe rytuały
   */
  public async suggestRoutineFromPattern(): Promise<DailyRoutine[]> {
    const tasks = await this.taskRepository.getTasks();
    const suggestions: DailyRoutine[] = [];
    const timePatterns: Record<string, number> = {};
    
    // Analizuj czasy rozpoczęcia zadań, aby znaleźć powtarzające się wzorce
    for (const task of tasks) {
      if (task.startTime) {
        // Zaokrąglij czas do pełnej godziny dla lepszego grupowania
        const [hours] = task.startTime.split(':').map(Number);
        const roundedTime = `${hours.toString().padStart(2, '0')}:00`;
        
        if (!timePatterns[roundedTime]) {
          timePatterns[roundedTime] = 0;
        }
        
        timePatterns[roundedTime]++;
      }
    }
    
    // Znajdź powtarzające się wzorce (arbitralnie przyjęty próg: 3 powtórzenia)
    const threshold = 3;
    for (const [time, count] of Object.entries(timePatterns)) {
      if (count >= threshold) {
        // Sugeruj nowy rytuał na podstawie wzorca
        const routineName = `Zaplanowany czas na zadania`;
        const routineIcon = '📝';
        const [hours] = time.split(':').map(Number);
        
        // Sprawdź porę dnia, aby dostosować sugestię
        let routineNameWithTime = routineName;
        let routineColor = 'bg-purple-100 dark:bg-purple-900/30';
        
        if (hours >= 5 && hours < 12) {
          routineNameWithTime = `Poranny blok zadań`;
          routineColor = 'bg-yellow-100 dark:bg-yellow-900/30';
        } else if (hours >= 12 && hours < 17) {
          routineNameWithTime = `Popołudniowy blok zadań`;
          routineColor = 'bg-orange-100 dark:bg-orange-900/30';
        } else if (hours >= 17 && hours < 22) {
          routineNameWithTime = `Wieczorny blok zadań`;
          routineColor = 'bg-indigo-100 dark:bg-indigo-900/30';
        }
        
        suggestions.push({
          id: uuidv4(),
          name: routineNameWithTime,
          icon: routineIcon,
          time: time,
          duration: 60, // Domyślnie proponujemy 1 godzinę
          repeat: 'weekday', // Domyślnie proponujemy w dni robocze
          color: routineColor,
          notes: `Automatycznie zasugerowano na podstawie ${count} podobnych zadań`
        });
      }
    }
    
    return suggestions;
  }

  /**
   * Sprawdza, czy istnieją nakładające się bloki czasowe
   * Przydatne do sprawdzania konfliktu czasów
   */
  public checkTimeOverlap(blocks: CombinedBlock[]): { hasOverlap: boolean; overlappingBlocks: CombinedBlock[][] } {
    const result = {
      hasOverlap: false,
      overlappingBlocks: [] as CombinedBlock[][]
    };
    
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const block1 = blocks[i];
        const block2 = blocks[j];
        
        // Konwertuj czasy na minuty dla łatwiejszego porównania
        const block1Start = this.convertTimeToMinutes(block1.startTime);
        const block1End = this.convertTimeToMinutes(block1.endTime);
        const block2Start = this.convertTimeToMinutes(block2.startTime);
        const block2End = this.convertTimeToMinutes(block2.endTime);
        
        // Sprawdź, czy bloki czasowe nakładają się
        if (
          (block1Start <= block2Start && block2Start < block1End) ||
          (block2Start <= block1Start && block1Start < block2End)
        ) {
          result.hasOverlap = true;
          result.overlappingBlocks.push([block1, block2]);
        }
      }
    }
    
    return result;
  }

  /**
   * Konwertuje czas w formacie "HH:MM" na liczbę minut od północy
   */
  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
} 
export interface DailyRoutine {
  id: string;
  name: string; // "Poranna rutyna", "Lunch", "Sen"
  icon: string; // emoji lub ikona np. ☀️ 💤 🍽️
  time: string; // np. "07:30"
  duration: number; // w minutach
  repeat: 'daily' | 'weekday' | 'weekend';
  color?: string; // opcjonalny kolor tła (kod HEX lub klasa Tailwind)
  notes?: string; // opcjonalne notatki
}

// Typ reprezentujący połączone zadanie z planera lub rytuał
export interface TimeBlock {
  startTime: string; // format "HH:MM"
  endTime: string; // format "HH:MM"
  type: 'routine' | 'task';
  data: DailyRoutine | any; // dane rytuału lub zadania
}

// Typ reprezentujący blok czasowy dla osi czasu
export interface TimeSlot {
  time: string; // format "HH:MM"
  isHalfHour: boolean; // czy to pełna godzina czy połowa
}

// Typ reprezentujący połączone dane z zadań i rytuałów na oś czasu
export interface CombinedBlock extends TimeBlock {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  duration: number; // w minutach
  isRoutine: boolean;
} 
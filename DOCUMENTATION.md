# Dokumentacja techniczna Planner

## Spis treści
1. [Struktura projektu](#struktura-projektu)
2. [Technologie](#technologie)
3. [Architektura aplikacji](#architektura-aplikacji)
4. [Zasady tworzenia komponentów](#zasady-tworzenia-komponentów)
5. [System UI](#system-ui)
6. [Stan aplikacji](#stan-aplikacji)
7. [Rozszerzanie funkcjonalności](#rozszerzanie-funkcjonalności)

## Struktura projektu

```
src/
├── components/            # Komponenty UI (organizacja per-view)
│   ├── Common/           # Komponenty wspólne używane w wielu widokach
│   │   ├── Header.tsx         # Nagłówek aplikacji z przełącznikiem trybu ciemnego
│   │   ├── Navigation.tsx     # System nawigacji z desktopowym menu i dolnym paskiem na mobile
│   │   └── DeleteConfirmationModal.tsx  # Modal potwierdzenia usunięcia
│   ├── Planner/          # Komponenty specyficzne dla widoku Planner
│   │   ├── TaskCard.tsx       # Karta zadania
│   │   ├── TaskForm.tsx       # Formularz dodawania zadania
│   │   ├── TaskList.tsx       # Lista zadań z obsługą sortowania
│   │   ├── EditTaskModal.tsx  # Modal edycji zadania
│   │   └── DraggableTaskCard.tsx  # Wrapper dla TaskCard z obsługą drag & drop
│   ├── Progress/         # Komponenty dla widoku Progress
│   │   ├── ProgressChart.tsx  # Wykres postępów
│   │   └── StatsSummary.tsx   # Podsumowanie statystyk
│   ├── Pomodoro/         # Komponenty dla widoku Pomodoro
│   │   ├── PomodoroTimer.tsx  # Timer Pomodoro
│   │   ├── RewardCard.tsx     # Karta nagrody
│   │   └── AddRewardForm.tsx  # Formularz dodawania nagrody
│   ├── FocusMode/        # Komponenty dla trybu skupienia
│   │   ├── FocusTaskView.tsx  # Widok zadania w trybie skupienia
│   │   ├── SubtaskChecklist.tsx # Lista podzadań
│   │   └── FocusTimer.tsx     # Timer trybu skupienia
│   └── DailyView/        # Komponenty dla widoku dziennego
│       ├── DailyTimeline.tsx  # Oś czasu dnia
│       ├── RoutineForm.tsx    # Formularz rutyny
│       └── RoutineBlock.tsx   # Blok rutyny
├── pages/                 # Widoki/strony
│   ├── Planner.tsx        # Główny widok planera
│   ├── DailyView.tsx      # Widok zarządzania codziennymi zadaniami
│   ├── Pomodoro.tsx       # Widok zegara Pomodoro
│   ├── Progress.tsx       # Widok statystyk i postępów
│   └── FocusMode.tsx      # Widok trybu skupienia
├── services/              # Warstwa usług
│   ├── TaskService.ts     # Logika biznesowa dla zadań
│   └── ProgressService.ts # Usługa do śledzenia postępów
├── repositories/          # Dostęp do danych
│   └── TaskRepository.ts  # Operacje CRUD dla zadań
├── types/                 # Definicje typów
│   └── Task.ts            # Interfejsy Task i Subtask
├── utils/                 # Narzędzia pomocnicze
│   ├── dateUtils.ts       # Funkcje pomocnicze dla dat
│   └── ui/                # Logika UI
│       ├── useDragAndDrop.ts     # Hook dla funkcji drag & drop
│       └── DragAndDropContext.tsx # Kontekst do zarządzania stanem drag & drop
├── App.tsx                # Główny komponent aplikacji
└── index.tsx              # Punkt wejścia aplikacji
```

## Technologie

- **React** - biblioteka UI
- **TypeScript** - język programowania z typowaniem statycznym
- **TailwindCSS** - biblioteka utility-first CSS do stylizacji
- **localStorage** - do przechowywania danych
- **React Router** - do nawigacji

## Architektura aplikacji

Aplikacja została zaprojektowana zgodnie z wzorcami:

1. **Architektura warstwowa**:
   - **View UI** - prezentacja danych
   - **Services** - logika biznesowa
   - **Repositories** - dostęp do danych

2. **Singleton** - używany w serwisach do zapewnienia jednej instancji

3. **Flux-podobny przepływ danych** - jednokierunkowy przepływ danych od komponentów nadrzędnych do podrzędnych

## Zasady tworzenia komponentów

### 0. Organizacja per-view

Komponenty są organizowane według widoków (pages) w których są używane:

- **`components/Common/`** - komponenty używane w wielu widokach lub przez główny komponent aplikacji (App.tsx)
- **`components/[ViewName]/`** - komponenty specyficzne dla konkretnego widoku:
  - `Planner/` - komponenty dla głównego widoku planera
  - `Progress/` - komponenty dla widoku statystyk i postępów  
  - `Pomodoro/` - komponenty dla timera Pomodoro
  - `FocusMode/` - komponenty dla trybu skupienia
  - `DailyView/` - komponenty dla zarządzania rytmem dnia

**Importy**: Przy korzystaniu z komponentów używaj pełnych ścieżek:
```tsx
// Komponenty Common
import { Navigation } from '../components/Common/Navigation';

// Komponenty per-view  
import { TaskCard } from '../components/Planner/TaskCard';
import { ProgressChart } from '../components/Progress/ProgressChart';
```

### 1. Komponenty funkcyjne z TypeScript

Wszystkie komponenty należy tworzyć jako funkcyjne z typami TypeScript:

```tsx
interface MyComponentProps {
  property: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ property, onAction }) => {
  return (
    <div>
      {/* zawartość komponentu */}
    </div>
  );
};
```

### 2. Stylizacja z TailwindCSS

Używaj klas Tailwind dla stylizacji, zgodnie z iOS-like designem:

- Zaokrąglone narożniki (`rounded-xl`, `rounded-2xl`, `rounded-3xl`)
- Efekt szkła (`backdrop-blur-sm`, `bg-white/80`)
- Subtelne gradienty (`bg-gradient-to-r`)
- Kolory akcentujące: fiolet, zieleń, pomarańcz, niebieski
- Tryb ciemny z prefiksem `dark:`

Przykład:
```tsx
<div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/70 rounded-2xl shadow-sm transition-all duration-300">
  {/* zawartość komponentu */}
</div>
```

### 3. Responsywność

Używaj breakpointów Tailwind dla różnych rozmiarów ekranów:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  {/* zawartość */}
</div>
```

### 4. Dostępność

- Dodawaj atrybuty `aria-label` do przycisków ikon
- Używaj semantycznych elementów HTML
- Zapewniaj odpowiedni kontrast kolorów

```tsx
<button 
  onClick={onAction}
  aria-label="Delete task"
  className="text-gray-600 dark:text-gray-300 hover:text-red-500"
>
  <svg>...</svg>
</button>
```

### 5. Obsługa zdarzeń

Funkcje obsługi zdarzeń powinny być przekazywane przez props:

```tsx
interface TaskCardProps {
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}
```

## System UI

### Komponenty UI

#### Komponenty Planner

```tsx
// TaskCard z components/Planner/
<TaskCard
  task={task}
  onToggleSubtask={handleToggleSubtask}
  onMarkDone={handleMarkDone}
  onToggleFocus={handleToggleFocus}
  onEditTask={handleEditTask}
  onDeleteTask={handleDeleteTask}
/>

// DraggableTaskCard z components/Planner/
<DraggableTaskCard
  task={task}
  index={index}
  onToggleSubtask={onToggleSubtask}
  onMarkDone={onMarkDone}
  onToggleFocus={onToggleFocus}
  onEditTask={onEditTask}
  onDeleteTask={onDeleteTask}
  isDragging={isBeingDragged}
  isDraggedOver={isDraggedOver}
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
/>

// TaskList z components/Planner/
<TaskList
  tasks={tasks}
  onReorderTasks={handleReorderTasks}
  onToggleSubtask={handleToggleSubtask}
  onMarkDone={handleMarkDone}
  onToggleFocus={handleToggleFocus}
  onEditTask={handleEditTask}
  onDeleteTask={handleDeleteTask}
/>

// EditTaskModal z components/Planner/
<EditTaskModal
  task={editTask}
  onSave={handleUpdateTask}
  onCancel={() => setEditTask(null)}
  isOpen={!!editTask}
/>
```

#### Komponenty Common

```tsx
// DeleteConfirmationModal z components/Common/
<DeleteConfirmationModal
  task={deleteTask}
  onConfirm={handleConfirmDelete}
  onCancel={() => setDeleteTask(null)}
  isOpen={!!deleteTask}
/>
```

#### Komponenty Progress

```tsx
// ProgressChart z components/Progress/
<ProgressChart
  data={chartData}
  type={chartType}
  dataType={dataType}
  timeFrame={timeFrame}
/>

// StatsSummary z components/Progress/
<StatsSummary
  stats={stats}
  dateRange={dateRange}
/>
```

#### Header i Navigation

System nawigacji składa się z dwóch głównych komponentów:

##### Header

```tsx
<Header />
```

Header zawiera tytuł aplikacji oraz przełącznik trybu ciemnego/jasnego. Jest używany jako część głównego komponentu nawigacyjnego.

##### Navigation

```tsx
<Navigation />
```

Komponent Navigation implementuje responsywny system nawigacyjny:

1. **Nawigacja desktopowa** - poziome menu w stylu iOS z segmentowanymi kontrolkami:
   ```tsx
   <div className="hidden md:flex justify-center py-2 bg-white/80 dark:bg-black/10 backdrop-blur-md">
     <div className="flex gap-1 bg-white/10 dark:bg-white/5 p-1 rounded-full">
       {/* Przyciski nawigacyjne */}
     </div>
   </div>
   ```

2. **Dolny pasek zakładek na mobile** - w stylu iOS z ikonami i etykietami:
   ```tsx
   <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/80 dark:bg-black/50 backdrop-blur-lg">
     {/* Przyciski zakładek */}
   </div>
   ```

3. **Inteligentne zachowanie przy przewijaniu** - pasek nawigacji chowa się podczas przewijania w dół i pojawia przy przewijaniu w górę:
   ```tsx
   useEffect(() => {
     const handleScroll = () => {
       const currentScrollPos = window.pageYOffset;
       const isScrollingDown = prevScrollPos < currentScrollPos;
       
       if (isScrollingDown && currentScrollPos > 10) {
         setIsVisible(false);
       } else if (isScrollingUp || currentScrollPos < 10) {
         setIsVisible(true);
       }
       
       setPrevScrollPos(currentScrollPos);
     };

     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
   }, [prevScrollPos]);
   ```

Nawigacja wykorzystuje React Router do zarządzania routingiem aplikacji:

```tsx
const navigate = useNavigate();
const location = useLocation();
const currentPath = location.pathname;

// Określanie aktywnej zakładki
const isActive = (path: string) => {
  if (path === "/" && currentPath === "/") return true;
  if (path !== "/" && currentPath.includes(path.substring(1))) return true;
  return false;
};
```

### Animacje i efekty

1. **Transition i transform** - dla płynnych przejść
   ```css
   transition-all duration-300 hover:translate-y-[-2px]
   ```

2. **Animacje** - zdefiniowane w `index.css`
   ```css
   @keyframes fadeIn { /* ... */ }
   .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
   ```

3. **Hover i focus** - interaktywne stany
   ```css
   hover:bg-gray-200 dark:hover:bg-gray-600
   ```

#### Inspiracja designem iOS

System nawigacji został zaprojektowany zgodnie z estetyką iOS 17, obejmując:

1. **Minimalistyczny design** - czyste linie, zaokrąglone narożniki i subtelne cienie
2. **Efekt translucencji** - półprzezroczyste tła z efektem rozmycia tła (backdrop-blur)
3. **Segmentowane kontrolki** - w stylu iOS dla widoku desktopowego
4. **Dolny pasek zakładek** - zgodny z wytycznymi Human Interface Guidelines dla iOS
5. **Inteligentne chowanie UI** - zwiększenie przestrzeni użytkowej na urządzeniach mobilnych
6. **Wsparcie dla trybu ciemnego/jasnego** - automatyczna adaptacja kolorów i kontrastów
7. **Responsywność** - dostosowanie do różnych rozmiarów ekranów z zachowaniem spójnej estetyki

Te elementy zostały zaimplementowane przy użyciu TailwindCSS, co pozwala na zachowanie spójnego wyglądu w całej aplikacji.

## Stan aplikacji

### Zarządzanie stanem

Stan aplikacji jest zarządzany przez:

1. **TaskService** - zarządzanie danymi zadań
2. **Lokalny stan komponentów** - używany dla UI
3. **Context API** - dla współdzielonych stanów, np. drag & drop

### Przykłady wykorzystania

```tsx
// Lokalny stan
const [tasks, setTasks] = useState<Task[]>([]);

// Używanie serwisu
const taskService = TaskService.getInstance();
const loadTasks = async () => {
  const tasks = await taskService.getTasksForToday();
  setTasks(tasks);
};

// Context API
const { draggedItemId, setIsDragging } = useDragAndDropContext();
```

## Rozszerzanie funkcjonalności

### Dodawanie nowego komponentu

1. Utwórz nowy plik w `src/components/`
2. Zdefiniuj interfejs props
3. Zaimplementuj komponent zgodnie z zasadami
4. Eksportuj komponent

### Dodawanie nowej funkcjonalności

1. Rozszerz odpowiedni serwis o nowe metody
2. Dodaj obsługę w odpowiednich komponentach
3. Zaktualizuj typy, jeśli to konieczne

### Przykład: dodanie filtrowania zadań

```tsx
// 1. Dodaj metodę w TaskService
async getTasksByPriority(): Promise<Task[]> {
  const tasks = await this.repository.getTasks();
  return tasks.filter(task => task.focus);
}

// 2. Użyj w komponencie
const loadPriorityTasks = async () => {
  const priorityTasks = await taskService.getTasksByPriority();
  setTasks(priorityTasks);
};
```

### Tworzenie funkcjonalności Drag and Drop

Aby zaimplementować nową funkcjonalność drag and drop:

1. Użyj istniejącego hooka `useDragAndDrop`
2. Stwórz komponent opakowujący z atrybutem `draggable`
3. Podłącz handlery dla `onDragStart`, `onDragOver` i `onDrop`
4. Zaimplementuj logikę zmiany kolejności w odpowiednim serwisie

```tsx
const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(onDropCallback);

<div 
  draggable
  onDragStart={(e) => handleDragStart(e, { id, type, index })}
  onDragOver={handleDragOver}
  onDrop={(e) => handleDrop(e, index)}
>
  {/* zawartość */}
</div>
```

### Inspiracja designem iOS

System nawigacji został zaprojektowany zgodnie z estetyką iOS 17, obejmując:

1. **Minimalistyczny design** - czyste linie, zaokrąglone narożniki i subtelne cienie
2. **Efekt translucencji** - półprzezroczyste tła z efektem rozmycia tła (backdrop-blur)
3. **Segmentowane kontrolki** - w stylu iOS dla widoku desktopowego
4. **Dolny pasek zakładek** - zgodny z wytycznymi Human Interface Guidelines dla iOS
5. **Inteligentne chowanie UI** - zwiększenie przestrzeni użytkowej na urządzeniach mobilnych
6. **Wsparcie dla trybu ciemnego/jasnego** - automatyczna adaptacja kolorów i kontrastów
7. **Responsywność** - dostosowanie do różnych rozmiarów ekranów z zachowaniem spójnej estetyki

Te elementy zostały zaimplementowane przy użyciu TailwindCSS, co pozwala na zachowanie spójnego wyglądu w całej aplikacji.

### Animacje i efekty

1. **Transition i transform** - dla płynnych przejść
   ```css
   transition-all duration-300 hover:translate-y-[-2px]
   ```

2. **Animacje** - zdefiniowane w `index.css`
   ```css
   @keyframes fadeIn { /* ... */ }
   .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
   ```

3. **Hover i focus** - interaktywne stany
   ```css
   hover:bg-gray-200 dark:hover:bg-gray-600
   ``` 
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
├── components/            # Komponenty UI
│   ├── DraggableTaskCard.tsx  # Wrapper dla TaskCard z obsługą drag & drop
│   ├── TaskCard.tsx       # Karta zadania
│   ├── TaskForm.tsx       # Formularz dodawania zadania
│   ├── TaskList.tsx       # Lista zadań z obsługą sortowania
│   ├── EditTaskModal.tsx  # Modal edycji zadania
│   └── DeleteConfirmationModal.tsx  # Modal potwierdzenia usunięcia
├── pages/                 # Widoki/strony
│   ├── Planner.tsx        # Główny widok planera
│   ├── Focus.tsx          # Widok trybu skupienia
│   └── Stats.tsx          # Widok statystyk
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
   - **Komponenty UI** - prezentacja danych
   - **Usługi** - logika biznesowa
   - **Repozytoria** - dostęp do danych

2. **Singleton** - używany w serwisach do zapewnienia jednej instancji

3. **Flux-podobny przepływ danych** - jednokierunkowy przepływ danych od komponentów nadrzędnych do podrzędnych

## Zasady tworzenia komponentów

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

#### TaskCard

```tsx
<TaskCard
  task={task}
  onToggleSubtask={handleToggleSubtask}
  onMarkDone={handleMarkDone}
  onToggleFocus={handleToggleFocus}
  onEditTask={handleEditTask}
  onDeleteTask={handleDeleteTask}
/>
```

#### DraggableTaskCard

```tsx
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
```

#### TaskList

```tsx
<TaskList
  tasks={tasks}
  onReorderTasks={handleReorderTasks}
  onToggleSubtask={handleToggleSubtask}
  onMarkDone={handleMarkDone}
  onToggleFocus={handleToggleFocus}
  onEditTask={handleEditTask}
  onDeleteTask={handleDeleteTask}
/>
```

#### EditTaskModal

```tsx
<EditTaskModal
  task={editTask}
  onSave={handleUpdateTask}
  onCancel={() => setEditTask(null)}
  isOpen={!!editTask}
/>
```

#### DeleteConfirmationModal

```tsx
<DeleteConfirmationModal
  task={deleteTask}
  onConfirm={handleConfirmDelete}
  onCancel={() => setDeleteTask(null)}
  isOpen={!!deleteTask}
/>
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
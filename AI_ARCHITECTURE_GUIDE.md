# AI Architecture Guide - React TypeScript Apps

## Core Architecture Pattern

### 3-Layer Architecture
```
View (UI Components) → Services (Business Logic) → Repositories (Data Access)
```

- **Components**: Pure UI presentation with TypeScript interfaces
- **Services**: Singleton pattern for business logic
- **Repositories**: Data persistence (localStorage/API)
- **Types**: Centralized TypeScript interfaces

### Project Structure Template
```
src/
├── components/     # React components organized per-view
│   ├── Common/     # Shared components used across multiple views
│   ├── [ViewName]/ # View-specific components (e.g., Planner/, Progress/)
│   └── ...
├── pages/         # Route-based views  
├── services/      # Business logic (Singleton pattern)
├── repositories/  # Data access layer
├── types/         # TypeScript interfaces
├── utils/         # Helper functions
└── App.tsx        # Main component with routing
```

## Design Philosophy: iOS-Inspired

### Visual Language
- **Glassmorphism**: `backdrop-blur-sm bg-white/80 dark:bg-gray-800/70`
- **Rounded corners**: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- **Subtle shadows**: `shadow-sm`, `shadow-md`
- **Translucent layers**: Semi-transparent backgrounds with blur effects

### Color System
- **Primary Blue**: `blue-500`, `blue-600` for buttons and CTAs
  - Hover: `hover:bg-blue-600`, Dark: `dark:bg-blue-600`
- **Success Green**: `green-400`, `green-500`, `green-600` for success states
  - Backgrounds: `bg-green-50/bg-green-900`, Text: `text-green-600/text-green-400`
- **Warning Orange**: `orange-400` for warnings and highlights
  - Backgrounds: `bg-orange-100/bg-orange-900`, Borders: `border-orange-400`
- **Accent Purple**: `purple-400`, `purple-600` for special features
  - Backgrounds: `bg-purple-100/bg-purple-900`, Text: `text-purple-600/text-purple-300`
- **Danger Red**: `red-400`, `red-500`, `red-600` for destructive actions
  - Backgrounds: `bg-red-50/bg-red-900`, Text: `text-red-600/text-red-400`
- **Neutral base**: Gray scale with proper dark mode variants
  - Light: `gray-100`, `gray-200`, `gray-300`
  - Dark: `gray-600`, `gray-700`, `gray-800`, `gray-900`
- **Dark mode**: All components use `dark:` prefix classes

### Typography & Spacing
- Clean, readable fonts with proper hierarchy
- Consistent spacing using Tailwind scale (4, 6, 8, 12, 16, 24)
- Generous whitespace for breathing room

## Component Design Patterns

### Component Organization Per-View

**Rule**: Organize components by the view/page where they are primarily used:

- **`components/Common/`** - Components used in multiple views or by App.tsx
- **`components/[ViewName]/`** - Components specific to one view (e.g., `Planner/`, `Progress/`)

**Import Examples**:
```tsx
// Common components
import { Navigation } from '../components/Common/Navigation';
import { Header } from '../components/Common/Header';

// View-specific components  
import { TaskCard } from '../components/Planner/TaskCard';
import { ProgressChart } from '../components/Progress/ProgressChart';
```

### Functional Components Template
```tsx
interface ComponentProps {
  data: DataType;
  onAction: (id: string) => void;
}

export const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  return (
    <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/70 rounded-2xl shadow-sm transition-all duration-300">
      {/* Component content */}
    </div>
  );
};
```

### Responsive Design Rules
- Mobile-first approach with `md:` and `lg:` breakpoints
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Navigation: Desktop horizontal menu + mobile bottom tabs
- Auto-hiding navigation on mobile scroll

## Animation & Interaction System

### Core Animation Classes
```css
/* Add to index.css */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
```

### Transition Patterns
- **All transitions**: `transition-all duration-300`
- **Hover effects**: `hover:translate-y-[-2px] hover:shadow-md`
- **Focus states**: `focus:ring-2 focus:ring-blue-500`
- **Loading states**: Skeleton placeholders with pulse animation

### Interactive Feedback
- Subtle color changes on hover
- Micro-animations for user actions
- Smooth state transitions (300ms standard)

## Navigation System

### Desktop Navigation
```tsx
// Horizontal segmented control (iOS style)
<div className="hidden md:flex justify-center py-2 bg-white/80 dark:bg-black/10 backdrop-blur-md">
  <div className="flex gap-1 bg-white/10 dark:bg-white/5 p-1 rounded-full">
    {/* Navigation buttons */}
  </div>
</div>
```

### Mobile Navigation
```tsx
// Bottom tab bar with auto-hide on scroll
<div className="md:hidden fixed bottom-0 inset-x-0 bg-white/80 dark:bg-black/50 backdrop-blur-lg">
  {/* Tab buttons with icons and labels */}
</div>
```

## State Management Approach

### Service Layer Pattern
```tsx
// Singleton service
class DataService {
  private static instance: DataService;
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
  
  // Business logic methods
}
```

### Component State Rules
- Local state for UI-only data
- Service layer for business logic
- Props drilling for parent-child communication
- Context API only for complex shared state

## Technology Stack

- **React 18** with TypeScript
- **TailwindCSS** for styling
- **React Router** for navigation
- **localStorage** for persistence
- **No external state management** (unless complex needs)

## Development Principles

1. **Component Isolation**: Each component handles one responsibility
2. **Type Safety**: Strong TypeScript interfaces for all data
3. **Accessibility**: Semantic HTML + ARIA labels
4. **Performance**: Lazy loading, optimized re-renders
5. **Mobile-First**: Responsive design from smallest screen up

## Implementation Checklist

- [ ] Set up 3-layer architecture
- [ ] Create TypeScript interfaces first
- [ ] Organize components per-view (Common/ + ViewName/ folders)
- [ ] Implement glassmorphism design system
- [ ] Add responsive navigation (desktop + mobile)
- [ ] Set up dark mode support
- [ ] Add smooth animations and transitions
- [ ] Implement auto-hiding mobile navigation
- [ ] Test accessibility and keyboard navigation
- [ ] Optimize for performance and loading states

This guide provides the foundation for building modern, iOS-inspired React applications with clean architecture and smooth user experience. 
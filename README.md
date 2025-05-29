# ADHD Planner

A comprehensive productivity application designed specifically for people with ADHD, focusing on task management, time tracking, focus sessions, and progress visualization.

![ADHD Planner](https://img.shields.io/badge/ADHD%20Planner-v1.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.5-38B2AC?logo=tailwind-css)

## 📱 Application Modules

The ADHD Planner consists of five main modules that work together to provide a complete productivity system:

1. **📋 Task Planner** - Create, organize, and manage tasks with subtasks
2. **📅 Daily Structure & Routines** - Visual timeline with consistent daily routines and schedules
3. **⏱️ Pomodoro Timer** - Track work sessions using the Pomodoro technique with reward system
4. **🧠 Focus Mode** - Distraction-free environment for deep work on specific tasks
5. **📊 Progress & Insights** - Visualize productivity data and track progress over time

## 🏗️ Architecture

The application follows a consistent Repository → Service → View architecture across all modules:

```
Repository Layer → Service Layer → View Layer
(Data Storage)     (Business Logic)  (UI Components)
```

### Key Principles:

- **Repositories** handle data persistence (localStorage)
- **Services** contain business logic, processing, and state management
- **Views** render UI components and handle user interactions
- **Types** provide TypeScript interfaces for strong typing across the application

## 🧩 Module Details

### 📋 Task Planner Module

**Core Features:**
- Create and manage tasks with subtasks
- Set priorities and deadlines
- Schedule tasks with specific times
- Filter tasks by time (today, tomorrow, all)
- Mark tasks as complete
- Enter Focus Mode for specific tasks

**Implementation:**
- `TaskRepository` - Manages task data persistence
- `TaskService` - Handles task operations and business logic
- `Planner.tsx` - Main view component
- `TaskCard.tsx` - Task display component
- `TaskForm.tsx` - Task creation/editing form

### 📅 Daily Structure & Routines Module

**Core Features:**
- Visual timeline from 6:00 to 23:00
- Create and manage daily routines and rituals
- Integration with tasks from Planner
- Filter by day of week with different views
- Auto-suggestions based on usage patterns
- Current time indicator

**Implementation:**
- `DailyRoutineRepository` - Manages routine data persistence
- `DailyStructureService` - Integrates routines with tasks on timeline
- `DailyView.tsx` - Main timeline view component
- `DailyTimeline.tsx` - Visual timeline component
- `RoutineBlock.tsx` - Routine display component
- `RoutineForm.tsx` - Routine creation/editing form

### ⏱️ Pomodoro Timer Module

**Core Features:**
- Standard pomodoro timing (25min work, 5min break, 15min long break)
- Track completed pomodoro sessions
- Reward system to motivate consistent work
- Task association with pomodoro sessions

**Implementation:**
- `PomodoroRepository` - Stores session data
- `RewardRepository` - Manages reward data
- `PomodoroService` - Controls timer logic and session management
- `RewardService` - Handles reward unlocking and progress
- `Pomodoro.tsx` - Main timer view
- `PomodoroTimer.tsx` - Timer component
- `RewardCard.tsx` - Reward display component

### 🧠 Focus Mode Module

**Core Features:**
- Distraction-free environment
- Task-specific focus sessions
- Countdown timer
- Subtask progress tracking
- Dark mode interface for reduced visual stimulation

**Implementation:**
- `FocusRepository` - Manages focus session data
- `FocusService` - Handles focus session logic
- `FocusMode.tsx` - Main focus interface
- `FocusTimer.tsx` - Timer component
- `FocusTaskView.tsx` - Task display for focus mode
- `SubtaskChecklist.tsx` - Interactive subtask list

### 📊 Progress & Insights Module

**Core Features:**
- Visualize productivity metrics
- Track completed tasks, pomodoro sessions, and focus time
- View daily and weekly statistics
- Monitor current and longest streaks
- Filter data by time range
- Customizable chart visualizations

**Implementation:**
- `ProgressRepository` - Stores productivity statistics
- `ProgressService` - Calculates metrics and processes data
- `Progress.tsx` - Main statistics view
- `ProgressChart.tsx` - Data visualization component
- `StatsSummary.tsx` - Key metrics display
- `dateUtils.ts` - Helper functions for date processing

## 🧭 Navigation System

The application uses React Router for navigation between modules:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/focus/:taskId" element={<FocusMode />} />
    <Route path="/focus" element={<FocusMode />} />
    <Route path="/pomodoro" element={<LayoutWithNav><Pomodoro /></LayoutWithNav>} />
    <Route path="/daily" element={<LayoutWithNav><DailyView /></LayoutWithNav>} />
    <Route path="/progress" element={<LayoutWithNav><Progress /></LayoutWithNav>} />
    <Route path="/*" element={<LayoutWithNav><Planner /></LayoutWithNav>} />
  </Routes>
</BrowserRouter>
```

**Navigation Component:**
- Persistent top navigation bar
- Visual indicators for current section
- Direct links to main modules
- Special handling for Focus Mode (full-screen, no navigation)

## 🖥️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Access the application at `http://localhost:3000`

## 💾 Data Persistence

All data is stored locally using localStorage with the following keys:
- `adhd_planner_tasks` - Task data
- `adhd_planner_pomodoro_sessions` - Pomodoro session data
- `adhd_planner_rewards` - Reward data
- `adhd_planner_focus_sessions` - Focus session data
- `adhd_planner_progress_data` - Progress statistics
- `adhd_planner_streak_data` - Streak tracking data
- `adhd_planner_daily_routines` - Daily routines data

## 🚀 Future Enhancements

- User authentication and profiles
- Cloud synchronization across devices
- Recurring tasks and templates
- Advanced analytics and insights
- Integration with calendar systems
- Mobile application version
- Desktop notifications
- Customizable themes and interface options 
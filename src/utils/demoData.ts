import { v4 as uuidv4 } from "uuid";
import { Task } from "../types/Task";
import { Reward } from "../types/Reward";

// Create today's and tomorrow's dates for demo data
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayISO = today.toISOString();
const tomorrowISO = tomorrow.toISOString();

// Sample demo tasks
export const demoTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Complete React project",
    description: "Finish the ADHD Planner application with all core features",
    subtasks: [
      { id: uuidv4(), title: "Implement TaskRepository", done: true },
      { id: uuidv4(), title: "Create TaskService", done: true },
      { id: uuidv4(), title: "Design UI components", done: false },
      { id: uuidv4(), title: "Add localStorage persistence", done: false },
    ],
    startTime: "09:00",
    status: "in-progress",
    focus: true,
    createdAt: todayISO
  },
  {
    id: uuidv4(),
    title: "Grocery shopping",
    description: "Buy items for the week",
    subtasks: [
      { id: uuidv4(), title: "Fruits and vegetables", done: false },
      { id: uuidv4(), title: "Dairy products", done: false },
      { id: uuidv4(), title: "Bread and cereal", done: false },
    ],
    startTime: "14:30",
    status: "todo",
    focus: false,
    createdAt: todayISO
  },
  {
    id: uuidv4(),
    title: "Exercise routine",
    description: "30 minutes of cardio and strength training",
    status: "todo",
    focus: true,
    createdAt: todayISO
  },
  {
    id: uuidv4(),
    title: "Read book chapter",
    description: "Read at least one chapter of current book",
    status: "todo",
    focus: false,
    createdAt: tomorrowISO
  },
  {
    id: uuidv4(),
    title: "Doctor appointment",
    description: "Annual check-up",
    startTime: "11:15",
    status: "todo",
    focus: true,
    createdAt: tomorrowISO
  }
];

// Sample demo rewards
export const demoRewards: Reward[] = [
  {
    id: uuidv4(),
    name: "Coffee Break",
    description: "Take a 15-minute coffee break with your favorite drink",
    unlocked: false,
    requiredSessions: 3
  },
  {
    id: uuidv4(),
    name: "Social Media Time",
    description: "Spend 10 minutes checking social media",
    unlocked: false,
    requiredSessions: 5
  },
  {
    id: uuidv4(),
    name: "Video Game Session",
    description: "Play your favorite game for 30 minutes",
    unlocked: false,
    requiredSessions: 10
  },
  {
    id: uuidv4(),
    name: "Movie Night",
    description: "Watch a movie of your choice",
    unlocked: false,
    requiredSessions: 15
  },
  {
    id: uuidv4(),
    name: "Day Off",
    description: "Take a full day off to do whatever you want",
    unlocked: false,
    requiredSessions: 25
  }
];

// Function to initialize demo data in localStorage
export const initializeDemoData = (): void => {
  const tasksStorageKey = "adhd_planner_tasks";
  const rewardsStorageKey = "adhd_planner_rewards";
  
  // Initialize tasks if none exist
  const existingTasks = localStorage.getItem(tasksStorageKey);
  if (!existingTasks) {
    localStorage.setItem(tasksStorageKey, JSON.stringify(demoTasks));
    console.log("Demo tasks initialized successfully");
  }
  
  // Initialize rewards if none exist
  const existingRewards = localStorage.getItem(rewardsStorageKey);
  if (!existingRewards) {
    localStorage.setItem(rewardsStorageKey, JSON.stringify(demoRewards));
    console.log("Demo rewards initialized successfully");
  }
};
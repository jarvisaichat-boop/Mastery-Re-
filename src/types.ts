// src/types.ts

export interface Category {
  main: string;
  sub?: string; // CHANGE: Made 'sub' optional
}

export interface Habit {
  id: number;
  name: string;
  description: string;
  color: string;
  type: string;
  categories: Array<{ main: string; sub?: string; }>; // CHANGE: Made 'sub' optional here too
  frequencyType: string;
  selectedDays: string[];
  timesPerPeriod: number;
  periodUnit: string;
  repeatDays: number;
  completed: Record<string, boolean | null>;
  order: number;
  createdAt: number;
  scheduledTime?: string; // Optional notification time (HH:MM format)
  miniAppType?: 'breath' | 'journal' | 'vision' | null; // Mini-app experience type
}

export interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHabit: (habitData: {
    id?: number;
    name: string;
    description: string;
    color: string;
    type: string;
    categories: Category[];
    frequencyType: string;
    selectedDays: string[];
    timesPerPeriod: number;
    periodUnit: string;
    repeatDays: number;
    scheduledTime?: string;
    miniAppType?: 'breath' | 'journal' | 'vision' | null;
  }) => void;
  onDeleteHabit?: (habitId: number) => void;
  habitToEdit?: Habit | null;
  habitMuscleCount: number;
  lifeGoalsCount: number;
}

// NEW DASHBOARD TYPES
export interface DashboardData {
  weeklyCompletionRate: {
    basic: number;
    hard: number;
    mode: 'basic' | 'hard';
  };
  streaks: {
    easyCurrent: number;
    easyLongest: number;
    hardCurrent: number;
    hardLongest: number;
    mode: 'easy' | 'hard';
  };
  habitTypeBreakdown: Record<string, number>;
  heatmapData: { date: string; completionCount: number; missedCount: number; }[];
}

export interface DashboardOverviewProps {
    dashboardData: DashboardData;
    onToggleRateMode: () => void;
    onToggleStreakMode: () => void;
}
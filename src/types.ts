// src/types.ts

export interface Category {
  main: string;
  sub?: string; // CHANGE: Made 'sub' optional
}

export interface MicroWin {
  id: string;
  level: number; // 1 = Main, 2 = Micro Win, 3 = Fallback, 4 = Bare Minimum
  description: string;
  effortLevel: 'high' | 'medium' | 'low' | 'minimal';
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
  sourceProgramId?: string; // Optional tracking of which program this habit came from
  microWins?: MicroWin[]; // Optional difficulty levels for the habit
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

// PROGRAM LIBRARY TYPES
export interface HabitTemplate {
  name: string;
  description: string;
  color: string;
  type: string; // 'habit_muscle' | 'life_goal' | 'regular'
  categories: Category[];
  frequencyType: string;
  selectedDays: string[];
  timesPerPeriod: number;
  periodUnit: string;
  repeatDays: number;
  scheduledTime?: string;
  miniAppType?: 'breath' | 'journal' | 'vision' | null;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  category: 'morning' | 'focus' | 'evening' | 'wellness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string; // Emoji or icon identifier
  habits: HabitTemplate[];
}

// MOMENTUM GENERATOR TYPES
export interface ContentLibraryItem {
  id: string;
  title: string;
  youtubeUrl: string;
  duration: number; // in minutes
  question: string;
  category: 'discipline' | 'psychology' | 'strategy' | 'mindset';
  dayOfWeek?: number; // 0-6, for specific day scheduling (0 = Sunday)
}

export interface MomentumGeneratorState {
  lastCompletedDate: string | null; // YYYY-MM-DD
  reflectionAnswers: Record<string, string>; // key = date, value = user's answer to question
  selectedHabits: number[]; // IDs of habits selected in last session
}
// src/types.ts

export interface Category {
  main: string;
  sub: string;
}

export interface Habit {
  id: number;
  name: string;
  description: string;
  color: string;
  type: string;
  categories: Array<{ main: string; sub: string; }>;
  frequencyType: string;
  selectedDays: string[];
  timesPerPeriod: number;
  periodUnit: string;
  repeatDays: number;
  completed: Record<string, boolean | null>;
  order: number;
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
  }) => void;
  onDeleteHabit?: (habitId: number) => void;
  habitToEdit?: Habit | null;
  habitMuscleCount: number;
  lifeGoalsCount: number;
}
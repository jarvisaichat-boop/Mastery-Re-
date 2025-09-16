// src/utils.ts

import { Habit, DashboardData } from './types';

// NEW DASHBOARD CALCULATION STUB (Performance Critical Function)
export const calculateDashboardData = (habits: Habit[]): DashboardData => {
  // NOTE: This is a placeholder implementation for memoization. 
  // Actual complex calculation logic will be built in a later step.

  const totalAnchor = habits.filter(h => h.type === 'Anchor Habit').length;
  const totalGoal = habits.filter(h => h.type === 'Life Goal Habit').length;
  const totalRegular = habits.filter(h => h.type === 'Habit').length;
  const totalHabits = totalAnchor + totalGoal + totalRegular;
  
  // Calculate placeholder percentages based on existing habit counts
  // Fallback to initial design placeholders if no habits exist.
  let goalPercentage = totalHabits > 0 ? Math.round((totalGoal / totalHabits) * 100) : 50;
  let anchorPercentage = totalHabits > 0 ? Math.round((totalAnchor / totalHabits) * 100) : 30;

  // Ensure 100% total after rounding
  goalPercentage = Math.min(goalPercentage, 100);
  anchorPercentage = Math.min(anchorPercentage, 100 - goalPercentage);
  const regularPercentage = 100 - goalPercentage - anchorPercentage;

  return {
    weeklyCompletionRate: 82, 
    currentStreak: 14, 
    longestStreak: 32, 
    categoryBreakdown: { 
        'Goal Habit': goalPercentage, 
        'Anchor Habit': anchorPercentage, 
        'Regular': regularPercentage
    },
    // Placeholder heatmap data (7 days * 5 rows = 35 squares)
    heatmapData: Array.from({ length: 35 }, (_, i) => ({ 
        date: `2025-09-${i + 1}`, // Placeholder date
        completionCount: (i % 7 === 0) ? 0 : (i % 5 === 0) ? 3 : 1 // Varying shades
    })),
  };
};

// --- Helper Functions for Dates ---
export const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const formatDate = (date: Date, formatStr: string): string => {
    if (formatStr === 'MM / yyyy') {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month} / ${year}`;
    }
    if (formatStr === 'EEE') {
        return date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    }
    if (formatStr === 'd') {
        return date.getDate().toString();
    }
    if (formatStr === 'yyyy-MM-dd') {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }
    return date.toDateString();
};

const getDaysDifference = (date1: Date, date2: Date): number => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
};

export const isHabitScheduledOnDay = (habit: Habit, date: Date): boolean => {
    switch (habit.frequencyType) {
        case 'Everyday':
        case 'Anytime':
        case 'Numbers of times per period':
            return true;
        
        case 'Some days of the week':
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            return habit.selectedDays.includes(dayName);
        
        case 'Repeats':
            if (habit.repeatDays <= 1) return true;
            const startDate = new Date(habit.id);
            const daysDiff = getDaysDifference(startDate, date);
            return daysDiff % habit.repeatDays === 0;
        
        default:
            return true;
    }
};

const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getMonthCalendarDays = (date: Date): Date[] => {
    const firstDay = getFirstDayOfMonth(date);
    const lastDay = getLastDayOfMonth(date);
    const startDate = getStartOfWeek(firstDay);
    const endDate = addDays(getStartOfWeek(lastDay), 6);
    const totalDays = getDaysDifference(startDate, endDate) + 1;
    
    const days: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
        days.push(addDays(startDate, i));
    }
    return days;
};

// Map color names to Tailwind classes
export const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string }> = {
        red: { bg: 'bg-red-500', border: 'border-red-400' },
        orange: { bg: 'bg-orange-500', border: 'border-orange-400' },
        yellow: { bg: 'bg-yellow-500', border: 'border-yellow-400' },
        green: { bg: 'bg-green-500', border: 'border-green-400' },
        blue: { bg: 'bg-blue-500', border: 'border-blue-400' },
        indigo: { bg: 'bg-indigo-500', border: 'border-indigo-400' },
        purple: { bg: 'bg-purple-500', border: 'border-purple-400' },
    };
    return colorMap[color] || { bg: 'bg-green-500', border: 'border-green-400' };
};

export const getTextColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
        red: 'text-red-400',
        orange: 'text-orange-400',
        yellow: 'text-yellow-400',
        green: 'text-green-400',
        blue: 'text-blue-400',
        indigo: 'text-indigo-400',
        purple: 'text-purple-400',
    };
    return colorMap[color] || 'text-white';
};
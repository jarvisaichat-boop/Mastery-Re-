// src/utils.ts

import { Habit, DashboardData } from './types';

// NEW DASHBOARD CALCULATION FUNCTION (Final Logic)
export const calculateDashboardData = (habits: Habit[], mode: 'basic' | 'hard'): DashboardData => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. HABIT TYPE BREAKDOWN (Retaining the fix from the previous step)
  const totalAnchor = habits.filter(h => h.type === 'Anchor Habit').length;
  const totalGoal = habits.filter(h => h.type === 'Life Goal Habit').length;
  const totalRegular = habits.filter(h => h.type === 'Habit').length;
  const totalHabits = totalAnchor + totalGoal + totalRegular;
  
  let goalPercentage = 0;
  let anchorPercentage = 0;
  let regularPercentage = 0;

  if (totalHabits > 0) {
    goalPercentage = Math.round((totalGoal / totalHabits) * 100);
    anchorPercentage = Math.round((totalAnchor / totalHabits) * 100);
    regularPercentage = Math.round((totalRegular / totalHabits) * 100);

    // Adjust for rounding errors (ensuring sum is exactly 100)
    const currentTotal = goalPercentage + anchorPercentage + regularPercentage;
    const diff = 100 - currentTotal;
    if (diff !== 0) {
      // Add the difference to the largest group
      if (goalPercentage >= anchorPercentage && goalPercentage >= regularPercentage) {
        goalPercentage += diff;
      } else if (anchorPercentage >= regularPercentage) {
        anchorPercentage += diff;
      } else {
        regularPercentage += diff;
      }
    }
  }

  const categoryBreakdown = { 
    'Goal Habit': goalPercentage, 
    'Habit Muscle 💪': anchorPercentage,
    'Regular': regularPercentage 
  };


  // 2. WEEKLY COMPLETION RATE (Implementing dual logic)
  const WEEK_LENGTH = 7;
  let totalScheduledHardMode = 0;
  let totalScheduledBasicMode = 0; // Tracks only instances with true/false (i.e. 'not null')
  let totalCompleted = 0;

  // Iterate over the last 7 *full* days (start from yesterday)
  for (let i = 0; i < WEEK_LENGTH; i++) {
      const dateToProcess = addDays(today, -(i + 1));
      const dateString = formatDate(dateToProcess, 'yyyy-MM-dd');

      habits.forEach(h => {
          if (isHabitScheduledOnDay(h, dateToProcess)) {
              // HARD MODE: Considers all scheduled instances as the total possible
              totalScheduledHardMode++;
              if (h.completed[dateString] === true) {
                  totalCompleted++;
              }
          } else if (h.completed[dateString] === false) {
              // BASIC MODE: Only counts confirmed misses/completions in its denominator
              totalScheduledBasicMode++; 
          }
          // If null/undefined, Hard Mode counts it as a miss; Basic Mode ignores it.
      });
  }
  
  const basicRate = totalScheduledBasicMode > 0 
      ? Math.round((totalCompleted / totalScheduledBasicMode) * 100) 
      : 0;

  const hardRate = totalScheduledHardMode > 0 
      ? Math.round((totalCompleted / totalScheduledHardMode) * 100) 
      : 0;

  const weeklyCompletionRate = {
    basic: basicRate,
    hard: hardRate,
    mode: mode
  };
  
  // 3. GLOBAL STREAKS
  let currentStreakValue = 0;
  let longestStreakValue = 0;
  let tempLongestStreak = 0;
  let tempCurrentStreak = 0;
  
  const MAX_DAYS_TO_CHECK = 365 * 3; 

  for (let i = 0; i < MAX_DAYS_TO_CHECK; i++) {
      const currentIterationDay = addDays(today, -i);
      const dateString = formatDate(currentIterationDay, 'yyyy-MM-dd');
      
      let scheduledCount = 0;
      let completedCount = 0;

      habits.forEach(h => {
          if (isHabitScheduledOnDay(h, currentIterationDay)) {
              scheduledCount++;
              if (h.completed[dateString] === true) {
                  completedCount++;
              }
          }
      });
      
      const isDayPerfect = scheduledCount > 0 && completedCount === scheduledCount;
      
      if (isDayPerfect) {
          tempLongestStreak++;
          longestStreakValue = Math.max(longestStreakValue, tempLongestStreak);

          // Calculate current streak (which must end on the most recent perfect day)
          if (i === 0) {
              // This should only happen if today is a perfect day, streaks typically end yesterday.
              // For safety and simplicity, we base the streak on the previous day. 
              // We'll calculate current streak backward from yesterday (i=1)
          } else if (i === 1) { 
              tempCurrentStreak = 1;
              currentStreakValue = 1;
          } else if (i > 1 && tempCurrentStreak === i - 1) {
              tempCurrentStreak++;
              currentStreakValue = tempCurrentStreak;
          }

      } else {
          tempLongestStreak = 0;
          if (i <= currentStreakValue) {
              // If the break occurs within the currently calculated streak, reset currentStreakValue
              currentStreakValue = 0;
          }
      }
  }

  // Final check for Current Streak: start from yesterday (i=1) and ensure it's consecutive back to the perfect days.
  let finalCurrentStreak = 0;
  for (let i = 1; i < MAX_DAYS_TO_CHECK; i++) {
    const checkDay = addDays(today, -i);
    const dateString = formatDate(checkDay, 'yyyy-MM-dd');
    
    let scheduledCount = 0;
    let completedCount = 0;
    habits.forEach(h => {
        if (isHabitScheduledOnDay(h, checkDay)) {
            scheduledCount++;
            if (h.completed[dateString] === true) {
                completedCount++;
            }
        }
    });

    const isDayPerfect = scheduledCount > 0 && completedCount === scheduledCount;
    
    if (isDayPerfect) {
        finalCurrentStreak++;
    } else if (scheduledCount === 0) {
        // Skips the day, streak continues if the day before was perfect
        // In this MVP, we simplify: ANY scheduled day that is imperfect breaks the current streak.
    } else {
        break; // Streak broken
    }
  }
  
  currentStreakValue = finalCurrentStreak;


  // 4. CONSISTENCY HEATMAP DATA (35 days)
  const heatmapData = [];
  let day = addDays(today, -35);

  for (let i = 0; i < 35; i++) {
    const dateToProcess = day;
    const dateString = formatDate(dateToProcess, 'yyyy-MM-dd');
    
    // Find scheduled habits and count completed ones for the date
    let completedCount = 0;
    habits.forEach(h => {
      if (isHabitScheduledOnDay(h, dateToProcess)) {
        if (h.completed[dateString] === true) {
          completedCount++;
        }
      }
    });

    heatmapData.push({
      date: dateString,
      completionCount: completedCount,
    });
    
    day = addDays(day, 1); // Move to the next day
  }

  return {
    weeklyCompletionRate: weeklyCompletionRate, 
    currentStreak: currentStreakValue, 
    longestStreak: longestStreakValue, 
    categoryBreakdown: categoryBreakdown,
    heatmapData: heatmapData,
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
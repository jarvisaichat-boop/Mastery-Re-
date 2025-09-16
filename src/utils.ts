// src/utils.ts

import { Habit, DashboardData } from './types';

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

// NEW DASHBOARD CALCULATION FUNCTION (Final Logic)
export const calculateDashboardData = (habits: Habit[], rateMode: 'basic' | 'hard', streakMode: 'easy' | 'hard'): DashboardData => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MAX_LOOKBACK = 365 * 3; 

  // 1. HABIT TYPE BREAKDOWN (Based on Completed Actions - The new metric)
  const completedCounts = { 'Life Goal': 0, 'Habit Muscle 💪': 0, 'Habit': 0 }; // Final Display Keys
  let totalCompletedActions = 0;
  
  habits.forEach(h => {
    let key: 'Life Goal' | 'Habit Muscle 💪' | 'Habit';
    if (h.type === 'Life Goal Habit') key = 'Life Goal';
    else if (h.type === 'Anchor Habit') key = 'Habit Muscle 💪';
    else if (h.type === 'Habit') key = 'Habit';
    else return; // Skip unknown types

    // Sum completed actions for this habit's lifetime
    Object.values(h.completed).forEach(isCompleted => {
        if (isCompleted === true) {
            completedCounts[key]++;
            totalCompletedActions++;
        }
    });
  });
  
  let goalPercentage = 0;
  let anchorPercentage = 0;
  let regularPercentage = 0;

  if (totalCompletedActions > 0) {
      // Calculate and round percentages
      goalPercentage = Math.round((completedCounts['Life Goal'] / totalCompletedActions) * 100);
      anchorPercentage = Math.round((completedCounts['Habit Muscle 💪'] / totalCompletedActions) * 100);
      regularPercentage = Math.round((completedCounts['Habit'] / totalCompletedActions) * 100);

      // Perform rounding adjustment
      const currentTotal = goalPercentage + anchorPercentage + regularPercentage;
      const diff = 100 - currentTotal;

      if (diff !== 0) {
          // Apply correction to the group with the highest raw count of completed actions
          const largestKey = Object.keys(completedCounts).reduce((a, b) => completedCounts[a] > completedCounts[b] ? a : b) as 'Life Goal' | 'Habit Muscle 💪' | 'Habit';

          if (largestKey === 'Life Goal') goalPercentage += diff;
          else if (largestKey === 'Habit Muscle 💪') anchorPercentage += diff;
          else regularPercentage += diff;
      }
  }

  const categoryBreakdown = { 
    'Life Goal': goalPercentage, 
    'Habit Muscle 💪': anchorPercentage,
    'Habit': regularPercentage 
  };
  
  // 2. WEEKLY COMPLETION RATE (Dual Logic & Guardrail Fix)
  const WEEK_LENGTH = 7;
  let totalScheduledHardMode = 0;
  let totalAcknowledgedBasicMode = 0; // Tracks only instances with true/false (i.e. 'not null')
  let totalCompleted = 0;

  // Iterate over the last 7 *full* days (start from yesterday, i=1)
  for (let i = 1; i <= WEEK_LENGTH; i++) {
      const dateToProcess = addDays(today, -i);
      const dateString = formatDate(dateToProcess, 'yyyy-MM-dd');

      habits.forEach(h => {
          if (isHabitScheduledOnDay(h, dateToProcess)) {
              // HARD MODE: Considers all scheduled instances as the total possible
              totalScheduledHardMode++; 
              
              if (h.completed[dateString] === true) {
                  totalCompleted++;
                  totalAcknowledgedBasicMode++; 
              } else if (h.completed[dateString] === false) {
                  // BASIC MODE: Only counts confirmed misses/completions in its denominator
                  totalAcknowledgedBasicMode++; 
              }
          }
      });
  }
  
  // BASIC MODE GUARDRAIL FIX (The motivational 100% fix)
  let basicRate = 0;
  if (totalCompleted === 0 && totalAcknowledgedBasicMode === 0) {
    basicRate = 100;
  } else if (totalAcknowledgedBasicMode > 0) {
    basicRate = Math.round((totalCompleted / totalAcknowledgedBasicMode) * 100);
  }

  const hardRate = totalScheduledHardMode > 0 
      ? Math.round((totalCompleted / totalScheduledHardMode) * 100) 
      : 0;

  const weeklyCompletionRate = {
    basic: basicRate,
    hard: hardRate,
    mode: rateMode
  };
  
  // --- 3. GLOBAL STREAKS (Fixed to calculate streak including today) ---
  let hardCurrentStreak = 0;
  let hardLongestStreak = 0;
  let easyCurrentStreak = 0;
  let easyLongestStreak = 0;

  let tempHardStreak = 0;
  let tempEasyStreak = 0;

  // Iterate backwards starting from today (i=0)
  for (let i = 0; i < MAX_LOOKBACK; i++) {
      const checkDay = addDays(today, -i);
      const dateString = formatDate(checkDay, 'yyyy-MM-dd');
      
      let scheduledCount = 0;
      let completedCount = 0;
      habits.forEach(h => {
          if (isHabitScheduledOnDay(h, checkDay)) {
              scheduledCount++;
              if (h.completed[dateString] === true) completedCount++;
          }
      });

      // CRITERIA
      const isDayScheduled = scheduledCount > 0;
      const isDayPerfect = isDayScheduled && completedCount === scheduledCount;
      const isDayCompletedAtLeastOne = completedCount > 0;
      
      
      // HARD STREAK
      if (isDayPerfect) {
          tempHardStreak++;
          hardLongestStreak = Math.max(hardLongestStreak, tempHardStreak);
          // hardCurrentStreak is updated only if the streak is not broken
          if (i === hardCurrentStreak) hardCurrentStreak++;
      } else {
          tempHardStreak = 0;
          // If the break occurred today (i=0), the streak is 0. 
          if (i === 0) hardCurrentStreak = 0;
          // Optimization: if a day is missed, we stop tracking the current streak.
          hardCurrentStreak = hardCurrentStreak; 
      }
      
      // EASY STREAK
      if (isDayCompletedAtLeastOne) {
          tempEasyStreak++;
          easyLongestStreak = Math.max(easyLongestStreak, tempEasyStreak);
          // easyCurrentStreak is updated only if the streak is not broken
          if (i === easyCurrentStreak) easyCurrentStreak++;
      } else {
          tempEasyStreak = 0;
          // If the break occurred today (i=0), the streak is 0.
          if (i === 0) easyCurrentStreak = 0;
          // Optimization: if a day is missed, we stop tracking the current streak.
          easyCurrentStreak = easyCurrentStreak;
      }
      
      // If both streaks are 0 and we've checked more than 30 days, we can break early.
      if (hardCurrentStreak === 0 && easyCurrentStreak === 0 && i > 30) break;
  }


  // --- 4. CONSISTENCY HEATMAP DATA (35 days) ---
  const heatmapData = [];
  let day = addDays(today, -35);

  for (let i = 0; i < 35; i++) {
    const dateToProcess = day;
    const dateString = formatDate(dateToProcess, 'yyyy-MM-dd');
    
    let completedCount = 0;
    habits.forEach(h => {
      if (isHabitScheduledOnDay(h, dateToProcess) && h.completed[dateString] === true) {
          completedCount++;
      }
    });

    heatmapData.push({
      date: dateString,
      completionCount: completedCount,
    });
    
    day = addDays(day, 1);
  }

  return {
    weeklyCompletionRate: weeklyCompletionRate, 
    streaks: {
      easyCurrent: easyCurrentStreak,
      easyLongest: easyLongestStreak,
      hardCurrent: hardCurrentStreak,
      hardLongest: hardLongestStreak,
      mode: streakMode
    },
    categoryBreakdown: categoryBreakdown,
    heatmapData: heatmapData,
  };
};
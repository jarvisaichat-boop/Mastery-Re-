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
            return true;
        
        // FIX: 'Anytime' and 'Numbers of times per period' do not enforce a specific daily streak.
        case 'Anytime':
        case 'Numbers of times per period':
            return false;
            
        case 'Some days of the week':
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            return habit.selectedDays.includes(dayName);
        
        case 'Repeats':
            if (habit.repeatDays <= 1) return true;
            const startDate = new Date(habit.id);
            const daysDiff = getDaysDifference(startDate, date);
            return daysDiff % habit.repeatDays === 0;
        
        // FIX: Ensure no unexpected frequency types default to counting as scheduled.
        default:
            return false;
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

// New function to calculate an individual habit's current and longest streaks.
// This is now used to drive the Dashboard's BASIC MODE (Easy Streak) tile.
export const calculateSingleHabitStreaks = (habit: Habit, today: Date) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const MAX_LOOKBACK = 365 * 3;
    
    // Longest and Temporary Streak Calculation (Iterate backwards to find longest)
    for (let i = 0; i < MAX_LOOKBACK; i++) {
        const checkDay = addDays(today, -i);
        const dateString = formatDate(checkDay, 'yyyy-MM-dd');
        
        // Determine if this day is relevant for *this single habit's* streak.
        let isScheduled = isHabitScheduledOnDay(habit, checkDay);
        
        // For 'Anytime' and 'Numbers of times per period', we must count them as "available" every day
        // for their *individual* streak, matching the habit row behavior.
        if (habit.frequencyType === 'Anytime' || habit.frequencyType === 'Numbers of times per period') {
             isScheduled = true;
        }

        const isCompleted = habit.completed[dateString] === true;

        if (isScheduled) {
            if (isCompleted) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                // Streak is broken on this scheduled day (missed or unacknowledged)
                tempStreak = 0;
            }
        } 
        // If not scheduled, the streak holds its value (tempStreak doesn't reset).
        
        // Optimization: stop searching for old streaks if the current temp streak is 0 and we've gone back far.
        if (tempStreak === 0 && i > 30) {
            break;
        }
    }
    
    // Current Streak Calculation (Iterate backwards and break on first failure)
    let currentStreakCheck = 0;
    for (let i = 0; i < MAX_LOOKBACK; i++) {
        const checkDay = addDays(today, -i);
        const dateString = formatDate(checkDay, 'yyyy-MM-dd');
        
        let isScheduled = isHabitScheduledOnDay(habit, checkDay);
        if (habit.frequencyType === 'Anytime' || habit.frequencyType === 'Numbers of times per period') {
             isScheduled = true;
        }
        
        const isCompleted = habit.completed[dateString] === true;
        
        if (isScheduled) {
            if (isCompleted) {
                currentStreakCheck++;
            } else {
                break; // Streak broken on scheduled day
            }
        }
        // If not scheduled, continue to previous day without breaking.
    }
    currentStreak = currentStreakCheck;
    
    return { current: currentStreak, longest: longestStreak };
};

// NEW DASHBOARD CALCULATION FUNCTION (Final Logic)
export const calculateDashboardData = (habits: Habit[], rateMode: 'basic' | 'hard', streakMode: 'easy' | 'hard'): DashboardData => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MAX_LOOKBACK = 365 * 3; 

  // 1. HABIT TYPE BREAKDOWN (Based on Completion Rate in ELAPSED WEEK)
  const scheduledCounts = { 'Life Goal': 0, 'Habit Muscle 💪': 0, 'Habit': 0 };
  const completedCountsByType = { 'Life Goal': 0, 'Habit Muscle 💪': 0, 'Habit': 0 };
  
  // Determine elapsed days for this week
  const startOfThisWeekForFocus = getStartOfWeek(today); 
  const todayTimestampForFocus = today.getTime(); 

  const dateStringsToConsider: string[] = [];
  for (let i = 0; i < 7; i++) {
    const dateToProcess = addDays(startOfThisWeekForFocus, i); 
    if (dateToProcess.getTime() <= todayTimestampForFocus) {
      dateStringsToConsider.push(formatDate(dateToProcess, 'yyyy-MM-dd'));
    }
  }

  habits.forEach(h => {
    let key: 'Life Goal' | 'Habit Muscle 💪' | 'Habit';
    if (h.type === 'Life Goal Habit') key = 'Life Goal';
    else if (h.type === 'Anchor Habit') key = 'Habit Muscle 💪';
    else if (h.type === 'Habit') key = 'Habit';
    else return; // Skip unknown types

    // Count scheduled and completed actions for ELAPSED days in the current week
    dateStringsToConsider.forEach(dateString => {
        const date = new Date(dateString);
        if (isHabitScheduledOnDay(h, date)) {
            scheduledCounts[key]++;
            
            if (h.completed[dateString] === true) {
                completedCountsByType[key]++;
            }
        }
    });
  });
  
  // Calculate completion rate percentages for each habit type
  const habitTypeBreakdown = {
    'Life Goal': scheduledCounts['Life Goal'] > 0 
      ? Math.round((completedCountsByType['Life Goal'] / scheduledCounts['Life Goal']) * 100) 
      : 0,
    'Habit Muscle 💪': scheduledCounts['Habit Muscle 💪'] > 0 
      ? Math.round((completedCountsByType['Habit Muscle 💪'] / scheduledCounts['Habit Muscle 💪']) * 100) 
      : 0,
    'Habit': scheduledCounts['Habit'] > 0 
      ? Math.round((completedCountsByType['Habit'] / scheduledCounts['Habit']) * 100) 
      : 0
  };
  
  // 2. WEEKLY COMPLETION RATE (Start on Monday fix & Elapsed Days Denominator Fix for both modes)
  const WEEK_LENGTH = 7;
  const startOfThisWeek = getStartOfWeek(today); 
  const todayTimestamp = today.getTime(); 

  let totalScheduledHardMode = 0; // DENOMINATOR (HARD): Scheduled instances on ELAPSED days
  let totalAcknowledgedBasicMode = 0; // DENOMINATOR (BASIC): Acknowledged instances (true/false) on ELAPSED days
  let totalCompleted = 0; // NUMERATOR: Completed instances (true) on ELAPSED days

  // Iterate over the current 7 days (Monday to Sunday)
  for (let i = 0; i < WEEK_LENGTH; i++) {
      const dateToProcess = addDays(startOfThisWeek, i); 
      const dateString = formatDate(dateToProcess, 'yyyy-MM-dd');
      
      // Check 1: Is this day in the future? If so, skip it.
      if (dateToProcess.getTime() > todayTimestamp) {
        continue;
      }

      habits.forEach(h => {
          if (isHabitScheduledOnDay(h, dateToProcess)) {
              
              // HARD MODE DENOMINATOR: Count every scheduled task up to today.
              totalScheduledHardMode++; 
              
              // NUMERATOR & BASIC MODE DENOMINATOR: Count completed/acknowledged tasks up to today.
              if (h.completed[dateString] === true) {
                  totalCompleted++;
                  totalAcknowledgedBasicMode++; 
              } else if (h.completed[dateString] === false) {
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

  // Hard Rate now uses the total scheduled ONLY up to the current day.
  const hardRate = totalScheduledHardMode > 0 
      ? Math.round((totalCompleted / totalScheduledHardMode) * 100) 
      : 0;

  const weeklyCompletionRate = {
    basic: basicRate,
    hard: hardRate,
    mode: rateMode
  };
  
  // --- 3. GLOBAL STREAKS (FIXED to show MAX SINGLE HABIT STREAK for Easy/Basic Mode) ---
  let hardCurrentStreak = 0;
  let hardLongestStreak = 0;
  let easyCurrentStreak = 0;
  let easyLongestStreak = 0;

  // Easy Mode (BASIC): Maximum of all Individual Habit Streaks
  habits.forEach(h => {
      const { current, longest } = calculateSingleHabitStreaks(h, today);
      easyCurrentStreak = Math.max(easyCurrentStreak, current);
      easyLongestStreak = Math.max(easyLongestStreak, longest);
  });
  
  // Hard Mode (HARD): Perfect Day Streak (Global Metric) - Logic remains complex but correct
  let tempHardStreak = 0;
  let tempHardLongestStreak = 0;
  
  // Hard Streak (Perfect Day) Calculation - Calculates longest streak
  for (let i = 0; i < MAX_LOOKBACK; i++) {
      const checkDay = addDays(today, -i);
      const dateString = formatDate(checkDay, 'yyyy-MM-dd');
      
      let scheduledCount = 0;
      let completedCount = 0;
      
      habits.forEach(h => {
          // Use the strict global schedule check here (where Anytime/TimesPerPeriod return false)
          if (isHabitScheduledOnDay(h, checkDay)) {
              scheduledCount++;
              if (h.completed[dateString] === true) completedCount++;
          }
      });

      const isDayScheduled = scheduledCount > 0;
      const isDayPerfect = isDayScheduled && completedCount === scheduledCount;

      if (isDayScheduled) {
          if (isDayPerfect) {
              tempHardStreak++;
              tempHardLongestStreak = Math.max(tempHardLongestStreak, tempHardStreak);
          } else {
              tempHardStreak = 0;
          }
      } 

      if (tempHardStreak === 0 && i > 30) break;
  }
  
  // Current Hard Streak - Calculates current streak
  hardCurrentStreak = 0;
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

    const isDayScheduled = scheduledCount > 0;
    const isDayPerfect = isDayScheduled && completedCount === scheduledCount;
    
    if (isDayScheduled) {
        if (isDayPerfect) {
            hardCurrentStreak++;
        } else {
            break;
        }
    }
  }

  hardLongestStreak = tempHardLongestStreak;

  // --- 4. CONSISTENCY HEATMAP DATA (35 days, tracking completed and missed) ---
  const heatmapData = [];
  // Start date is 34 days before today (to ensure 35 total days, ending today)
  let startDate = addDays(today, -34); 

  for (let i = 0; i < 35; i++) {
    const dateToProcess = addDays(startDate, i); 
    const dateString = formatDate(dateToProcess, 'yyyy-MM-dd');
    
    let completedCount = 0;
    let missedCount = 0;
    
    habits.forEach(h => {
      if (isHabitScheduledOnDay(h, dateToProcess)) {
          if (h.completed[dateString] === true) {
              completedCount++;
          } else if (h.completed[dateString] === false) {
              missedCount++; 
          }
      }
    });

    heatmapData.push({
      date: dateString,
      completionCount: completedCount,
      missedCount: missedCount, 
    });
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
    habitTypeBreakdown: habitTypeBreakdown,
    heatmapData: heatmapData,
  };
};
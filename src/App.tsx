import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, List, Calendar, BarChart3, Sparkles, Home, Target, Zap, BookOpen, FileCheck, Shield, Rocket } from 'lucide-react';
import AddHabitModal from './components/AddHabitModal';
import MasteryOnboarding from './components/MasteryOnboarding';
import AppTour from './components/AppTour';
import MicroWinProtocol from './components/MicroWinProtocol';
import EmergencyHabitAction from './components/EmergencyHabitAction';
import StreakRepair from './components/StreakRepair';
import AICoachWidget from './components/AICoachWidget';
import StreakCelebration from './components/StreakCelebration';
import ChatDailyCheckIn from './components/ChatDailyCheckIn';
import StatsOverview from './components/StatsOverview';
import HoldToIgnite from './components/HoldToIgnite';
import BreathPacer from './components/BreathPacer';
import JournalModule from './components/JournalModule';
import { ProgramLibraryModal } from './components/ProgramLibraryModal';
import { MomentumGeneratorModal } from './components/MomentumGeneratorModal';
import { ContentLibraryManager } from './components/ContentLibraryManager';
import { Toast } from './components/Toast';
import { Habit, HabitTemplate, ContentLibraryItem } from './types';
import { getStartOfWeek, addDays, calculateDashboardData, formatDate, isHabitScheduledOnDay, isHabitLoggable, getHabitStrictness } from './utils';
import { NotificationService } from './services/NotificationService';
import { loadContentLibrary, saveContentLibrary, getTodayContent } from './data/contentLibrary';
import { recommendVideo } from './utils/videoRecommendation';
import { WeekHeader, MonthView, YearView, CalendarHeader, HabitRow } from './components/DashboardComponents';

const LOCAL_STORAGE_HABITS_KEY = 'mastery-dashboard-habits-v1';
const LOCAL_STORAGE_RATE_MODE_KEY = 'mastery-dashboard-rate-mode-v1';
const LOCAL_STORAGE_STREAK_MODE_KEY = 'mastery-dashboard-streak-mode-v1';
const LOCAL_STORAGE_ONBOARDING_KEY = 'mastery-dashboard-onboarding-complete';
const LOCAL_STORAGE_APP_TOUR_KEY = 'mastery-dashboard-app-tour-complete';
const LOCAL_STORAGE_MICRO_WIN_KEY = 'mastery-dashboard-micro-win-complete';
const LOCAL_STORAGE_CELEBRATED_STREAKS_KEY = 'mastery-dashboard-celebrated-streaks';
const LOCAL_STORAGE_LAST_DAILY_SUMMARY_KEY = 'mastery-dashboard-last-daily-summary';
const LOCAL_STORAGE_DAILY_REASONS_KEY = 'mastery-dashboard-daily-reasons';
const LOCAL_STORAGE_GOAL_KEY = 'mastery-dashboard-goal';
const LOCAL_STORAGE_ASPIRATIONS_KEY = 'mastery-dashboard-aspirations';
const LOCAL_STORAGE_CHAT_ENTRIES_KEY = 'mastery-dashboard-chat-entries';
const LOCAL_STORAGE_EMERGENCY_MODE_KEY = 'mastery-dashboard-emergency-mode';
const LOCAL_STORAGE_STREAK_REPAIR_CHECK_KEY = 'mastery-dashboard-last-streak-repair-check';
const LOCAL_STORAGE_MOMENTUM_LAST_COMPLETED_KEY = 'mastery-momentum-last-completed';

function loadRateMode(): 'basic' | 'hard' {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_RATE_MODE_KEY);
    // Default to 'basic' if not found
    return stored === 'hard' ? 'hard' : 'basic'; 
  } catch (e) {
    return 'basic';
  }
}

function loadStreakMode(): 'easy' | 'hard' {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_STREAK_MODE_KEY);
    // Default to 'easy' (Basic Mode) if not found
    return stored === 'hard' ? 'hard' : 'easy'; 
  } catch (e) {
    return 'easy';
  }
}

function loadHabitsFromStorage(): Habit[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_HABITS_KEY);
    if (stored) {
      let habits = JSON.parse(stored);
      
      // Migration: Add "Ignite" habit if it doesn't exist (for existing users)
      const hasIgnite = habits.some((h: any) => h.id === 9999994);
      if (!hasIgnite) {
        const igniteHabit = {
          id: 9999994,
          name: 'Ignite',
          description: 'Complete the daily Momentum Generator ritual',
          color: '#f59e0b',
          type: 'Anchor Habit',
          categories: [{ main: 'Mindset', sub: 'Daily Ritual' }],
          frequencyType: 'daily',
          selectedDays: [],
          timesPerPeriod: 1,
          periodUnit: 'day',
          repeatDays: 1,
          completed: {},
          order: -1,
          createdAt: 1700000000000,
          microWins: [
            { id: 'mw10', level: 1, description: 'Open Launch Pad', effortLevel: 'minimal' },
            { id: 'mw11', level: 2, description: 'Watch today\'s lesson', effortLevel: 'low' },
            { id: 'mw12', level: 3, description: 'Complete the countdown', effortLevel: 'medium' }
          ]
        };
        habits = [igniteHabit, ...habits];
      }
      
      // Always normalize order values: Ignite gets -1, everything else gets sequential numbers
      let nextOrder = 0;
      habits = habits.map((h: any) => {
        if (h.id === 9999994) {
          return { ...h, order: -1 };
        }
        if (h.order === undefined || h.order === null || typeof h.order !== 'number') {
          const currentOrder = nextOrder;
          nextOrder++;
          return { ...h, order: currentOrder };
        }
        return h;
      });
      
      return habits.map((h: any) => {
        if (h.createdAt) {
          return { ...h, createdAt: typeof h.createdAt === 'number' ? h.createdAt : Date.now() };
        }
        
        if (typeof h.id === 'number' && h.id > 1000000000000) {
          return { ...h, createdAt: h.id };
        }
        
        const completionDates = Object.keys(h.completed || {})
          .filter(dateStr => h.completed[dateStr] === true)
          .map(dateStr => new Date(dateStr).getTime())
          .filter(ts => !isNaN(ts));
        
        if (completionDates.length > 0) {
          return { ...h, createdAt: Math.min(...completionDates) };
        }
        
        return { ...h, createdAt: Date.now() };
      });
    }
  } catch (e) { console.error("Failed to load habits", e); }
  
  return [
    {
      id: 9999991,
      name: 'Morning Movement',
      description: 'Start your day with intentional motion',
      color: '#3b82f6',
      type: 'Life Goal Habit',
      categories: [{ main: 'Health', sub: 'Movement' }],
      frequencyType: 'daily',
      selectedDays: [],
      timesPerPeriod: 1,
      periodUnit: 'day',
      repeatDays: 1,
      completed: {},
      order: 0,
      createdAt: 1700000000000,
      scheduledTime: '07:00',
      microWins: [
        { id: 'mw1', level: 2, description: '5 jumping jacks', effortLevel: 'low' },
        { id: 'mw2', level: 3, description: '2-minute walk outside', effortLevel: 'medium' },
        { id: 'mw3', level: 4, description: 'Stretch arms overhead', effortLevel: 'minimal' }
      ]
    },
    {
      id: 9999992,
      name: 'Deep Work Session',
      description: 'Build focus muscle through deliberate practice',
      color: '#8b5cf6',
      type: 'Life Goal Habit',
      categories: [{ main: 'Productivity', sub: 'Focus' }],
      frequencyType: 'daily',
      selectedDays: [],
      timesPerPeriod: 1,
      periodUnit: 'day',
      repeatDays: 1,
      completed: {},
      order: 1,
      createdAt: 1700000000001,
      scheduledTime: '09:00',
      microWins: [
        { id: 'mw4', level: 2, description: 'Open work file', effortLevel: 'minimal' },
        { id: 'mw5', level: 3, description: 'Write one sentence', effortLevel: 'low' },
        { id: 'mw6', level: 4, description: 'Set 5-minute timer', effortLevel: 'low' }
      ]
    },
    {
      id: 9999993,
      name: 'Evening Reflection',
      description: 'Close the day with gratitude and presence',
      color: '#10b981',
      type: 'Life Goal Habit',
      categories: [{ main: 'Mindfulness', sub: 'Gratitude' }],
      frequencyType: 'daily',
      selectedDays: [],
      timesPerPeriod: 1,
      periodUnit: 'day',
      repeatDays: 1,
      completed: {},
      order: 2,
      createdAt: 1700000000002,
      scheduledTime: '21:00',
      microWins: [
        { id: 'mw7', level: 2, description: 'Take 3 deep breaths', effortLevel: 'minimal' },
        { id: 'mw8', level: 3, description: 'Write 1 gratitude', effortLevel: 'low' },
        { id: 'mw9', level: 4, description: 'Close eyes for 60 seconds', effortLevel: 'minimal' }
      ]
    },
    {
      id: 9999994,
      name: 'Ignite',
      description: 'Complete the daily Momentum Generator ritual',
      color: '#f59e0b',
      type: 'Anchor Habit',
      categories: [{ main: 'Mindset', sub: 'Daily Ritual' }],
      frequencyType: 'daily',
      selectedDays: [],
      timesPerPeriod: 1,
      periodUnit: 'day',
      repeatDays: 1,
      completed: {},
      order: -1,
      createdAt: 1700000000000,
      microWins: [
        { id: 'mw10', level: 1, description: 'Open Launch Pad', effortLevel: 'minimal' },
        { id: 'mw11', level: 2, description: 'Watch today\'s lesson', effortLevel: 'low' },
        { id: 'mw12', level: 3, description: 'Complete the countdown', effortLevel: 'medium' }
      ]
    }
  ];
}

function isOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_ONBOARDING_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function isAppTourComplete(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_APP_TOUR_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function isMicroWinComplete(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_MICRO_WIN_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function isEmergencyModeActive(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_EMERGENCY_MODE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function App() {
    // TESTING: Auto-complete onboarding for screenshots and testing  
    // TODO: Remove this before production - this is for development testing only
    const AUTO_SKIP_ONBOARDING = true; // Set to false to enable normal onboarding flow
    
    const urlParams = new URLSearchParams(window.location.search);
    const shouldSkipOnboarding = AUTO_SKIP_ONBOARDING || urlParams.get('skipOnboarding') === 'true' || urlParams.get('test') === 'true';
    
    const [onboardingComplete, setOnboardingComplete] = useState(() => {
        if (shouldSkipOnboarding) {
            localStorage.setItem(LOCAL_STORAGE_ONBOARDING_KEY, 'true');
            localStorage.setItem(LOCAL_STORAGE_APP_TOUR_KEY, 'true');
            localStorage.setItem(LOCAL_STORAGE_MICRO_WIN_KEY, 'true');
            return true;
        }
        return isOnboardingComplete();
    });
    const [appTourComplete, setAppTourComplete] = useState(() => shouldSkipOnboarding || isAppTourComplete());
    const [microWinComplete, setMicroWinComplete] = useState(() => shouldSkipOnboarding || isMicroWinComplete());
    const [emergencyMode, setEmergencyMode] = useState(isEmergencyModeActive);
    const [previewOnboarding, setPreviewOnboarding] = useState(false);
    const [previewAppTour, setPreviewAppTour] = useState(false);
    const [previewMicroWin, setPreviewMicroWin] = useState(false);
    const [jumpToPhase, setJumpToPhase] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');
    
    const [showDailyTrackingView, setShowDailyTrackingView] = useState(true);
    const [showStatsView, setShowStatsView] = useState(false);
    
    const [weeklyRateMode, setWeeklyRateMode] = useState(loadRateMode);
    const [streakMode, setStreakMode] = useState(loadStreakMode);

    const [habits, setHabits] = useState<Habit[]>(loadHabitsFromStorage);
    const [goal, setGoal] = useState(() => localStorage.getItem(LOCAL_STORAGE_GOAL_KEY) || 'Set your #1 priority');
    const [aspirations, setAspirations] = useState(() => localStorage.getItem(LOCAL_STORAGE_ASPIRATIONS_KEY) || '');
    const [showAddHabitModal, setShowAddHabitModal] = useState(false);
    const [showProgramLibrary, setShowProgramLibrary] = useState(false);
    const [selectedHabitToEdit, setSelectedHabitToEdit] = useState<Habit | null>(null);
    const [draggedHabitId, setDraggedHabitId] = useState<number | null>(null);
    
    // Momentum Generator state
    const [showMomentumConfirmation, setShowMomentumConfirmation] = useState(false);
    const [showMomentumGenerator, setShowMomentumGenerator] = useState(false);
    const [showContentLibraryManager, setShowContentLibraryManager] = useState(false);
    const [showFloatingGoPopup, setShowFloatingGoPopup] = useState(false);
    const [contentLibrary, setContentLibrary] = useState<ContentLibraryItem[]>(() => loadContentLibrary());
    const [momentumLastCompleted, setMomentumLastCompleted] = useState<string | null>(() => {
        try {
            return localStorage.getItem(LOCAL_STORAGE_MOMENTUM_LAST_COMPLETED_KEY);
        } catch { return null; }
    });

    // CRITICAL: Immediately purge any videos > 8 minutes on mount
    useEffect(() => {
        const validVideos = contentLibrary.filter(item => item.duration <= 8);
        if (validVideos.length !== contentLibrary.length) {
            console.warn(`🧹 Purging ${contentLibrary.length - validVideos.length} videos that are > 8 minutes`);
            setContentLibrary(validVideos);
            saveContentLibrary(validVideos);
        }
    }, []); // Run once on mount
    
    // Pre-select today's video using smart recommendation engine (guarantees <= 8 min)
    const todaysContent = useMemo(() => {
        try {
            return recommendVideo(contentLibrary, habits);
        } catch (error) {
            console.warn('Recommendation engine failed, falling back to getTodayContent:', error);
            return getTodayContent(contentLibrary);
        }
    }, [contentLibrary, habits]);
    
    const isMomentumCompletedToday = momentumLastCompleted === formatDate(new Date(), 'yyyy-MM-dd');

    const [aiCoachMessage, setAiCoachMessage] = useState('');
    const [showAiCoach, setShowAiCoach] = useState(false);
    const [streakCelebration, setStreakCelebration] = useState<{ habitName: string; days: number } | null>(null);
    const [showChatCheckIn, setShowChatCheckIn] = useState(false);
    const [emergencyHabitAction, setEmergencyHabitAction] = useState<{ habit: Habit; date: string } | null>(null);
    const [brokenStreaks, setBrokenStreaks] = useState<Array<{ habit: Habit; dateString: string }>>([]);
    const [celebratedStreaks, setCelebratedStreaks] = useState<Set<string>>(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_CELEBRATED_STREAKS_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch { return new Set(); }
    });
    const [dailyReasons, setDailyReasons] = useState<Record<string, Record<number, string>>>(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_DAILY_REASONS_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch { return {}; }
    });
    const [chatEntries, setChatEntries] = useState<Record<string, any>>(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_CHAT_ENTRIES_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch { return {}; }
    });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [igniteHabit, setIgniteHabit] = useState<Habit | null>(null);
    const [activeMiniApp, setActiveMiniApp] = useState<{ habit: Habit; date: string; type: 'breath' | 'journal' | 'vision' } | null>(null);

    const handleOnboardingComplete = (newHabits: Omit<Habit, 'id' | 'createdAt'>[], userGoal: string, userAspirations: string, profile?: any) => {
        console.log('🎊 App.tsx handleOnboardingComplete called');
        console.log('📦 Received habits:', newHabits);
        console.log('🎯 Received goal:', userGoal);
        
        try {
            const now = Date.now();
            
            // Preserve starter habits (IDs 9999991-9999994) and merge with new habits
            const starterHabits = habits.filter(h => h.id >= 9999990 && h.id <= 9999999);
            
            const habitsWithIds = newHabits.map((h, index) => ({
                ...h,
                id: now + index,
                createdAt: now,
                order: starterHabits.length + index, // Dynamic order based on number of starters
            }));
            
            console.log('✅ Habits with IDs:', habitsWithIds);
            
            const mergedHabits = [...starterHabits, ...habitsWithIds];
            
            setHabits(mergedHabits);
            console.log('✅ setHabits called with merged habits (starters + new)');
            
            setGoal(userGoal);
            console.log('✅ setGoal called');
            
            setAspirations(userAspirations);
            console.log('✅ setAspirations called');
            
            localStorage.setItem(LOCAL_STORAGE_ONBOARDING_KEY, 'true');
            localStorage.setItem(LOCAL_STORAGE_GOAL_KEY, userGoal);
            localStorage.setItem(LOCAL_STORAGE_ASPIRATIONS_KEY, userAspirations);
            console.log('✅ localStorage flags set');
            
            // Clear onboarding-specific storage
            localStorage.removeItem('mastery-onboarding-profile');
            localStorage.removeItem('mastery-onboarding-phase');
            console.log('🧹 Cleared onboarding localStorage');
            
            // Reset App Tour and Micro-Win flags to ensure proper flow
            localStorage.removeItem(LOCAL_STORAGE_APP_TOUR_KEY);
            localStorage.removeItem(LOCAL_STORAGE_MICRO_WIN_KEY);
            setAppTourComplete(false);
            setMicroWinComplete(false);
            console.log('🔄 Reset App Tour and Micro-Win flags for fresh flow');
            
            setOnboardingComplete(true);
            console.log('✅ setOnboardingComplete(true) called - should trigger dashboard render');
            
            // Reset preview mode to ensure dashboard actually shows
            setPreviewOnboarding(false);
            setJumpToPhase(null);
            console.log('✅ Reset preview states');
            
            console.log('🎉 App.tsx handleOnboardingComplete finished successfully!');
        } catch (error) {
            console.error('❌ Error in App.tsx handleOnboardingComplete:', error);
            alert(`Error completing onboarding in App: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    useEffect(() => {
        try { 
            localStorage.setItem(LOCAL_STORAGE_HABITS_KEY, JSON.stringify(habits)); 
            localStorage.setItem(LOCAL_STORAGE_RATE_MODE_KEY, weeklyRateMode);
            localStorage.setItem(LOCAL_STORAGE_STREAK_MODE_KEY, streakMode);
            localStorage.setItem(LOCAL_STORAGE_GOAL_KEY, goal);
            localStorage.setItem(LOCAL_STORAGE_ASPIRATIONS_KEY, aspirations);
            localStorage.setItem(LOCAL_STORAGE_EMERGENCY_MODE_KEY, String(emergencyMode));
            localStorage.setItem(LOCAL_STORAGE_MOMENTUM_LAST_COMPLETED_KEY, momentumLastCompleted || '');
        }
        catch (e) { console.error("Failed to save habits", e); }
    }, [habits, weeklyRateMode, streakMode, goal, aspirations, emergencyMode, momentumLastCompleted]);

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_CELEBRATED_STREAKS_KEY, JSON.stringify(Array.from(celebratedStreaks)));
            localStorage.setItem(LOCAL_STORAGE_DAILY_REASONS_KEY, JSON.stringify(dailyReasons));
            localStorage.setItem(LOCAL_STORAGE_CHAT_ENTRIES_KEY, JSON.stringify(chatEntries));
        } catch (e) { console.error("Failed to save motivation data", e); }
    }, [celebratedStreaks, dailyReasons, chatEntries]);

    // Initialize Notification Service
    useEffect(() => {
        // Set up notification click handler
        NotificationService.setClickHandler((habitId) => {
            const habit = habits.find(h => h.id === habitId);
            if (habit) {
                setIgniteHabit(habit);
            }
        });

        // Schedule notifications for all habits with scheduledTime
        console.log('📱 [App] Scheduling notifications on mount...');
        habits.forEach(habit => {
            if (habit.scheduledTime) {
                console.log(`📅 [App] Found habit "${habit.name}" with scheduled time: ${habit.scheduledTime}`);
                NotificationService.scheduleHabit(habit.id, habit.name, habit.scheduledTime);
            }
        });
        
        // Expose debug helper to window for testing
        (window as any).debugNotifications = () => NotificationService.logDebugInfo();

        return () => {
            NotificationService.clearAll();
        };
    }, [habits]);

    // Streak Repair: Detect broken streaks on app load (respects three-tier system)
    useEffect(() => {
        if (!onboardingComplete || habits.length === 0) return;
        
        const today = formatDate(new Date(), 'yyyy-MM-dd');
        const lastCheck = localStorage.getItem(LOCAL_STORAGE_STREAK_REPAIR_CHECK_KEY);
        
        // Only check once per day
        if (lastCheck === today) return;
        
        const now = new Date();
        const broken: Array<{ habit: Habit; dateString: string }> = [];
        
        habits.forEach(habit => {
            const strictness = getHabitStrictness(habit);
            
            // Skip regular habits - they can backfill anytime
            if (strictness === 'anytime') return;
            
            // Check if habit has at least one completion (has an active streak)
            const hasAnyCompletion = Object.values(habit.completed).some(v => v === true);
            if (!hasAnyCompletion) return;
            
            if (strictness === 'same-day') {
                // Anchor Habit: Check yesterday only
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = formatDate(yesterday, 'yyyy-MM-dd');
                
                if (isHabitScheduledOnDay(habit, yesterday) && !habit.completed[yesterdayString]) {
                    broken.push({ habit, dateString: yesterdayString });
                }
            } else if (strictness === '48-hour') {
                // Life Goal Habit: Check dates beyond 2-day window (scheduled day + next day)
                // Check up to 2 days back to catch all expired windows
                for (let i = 1; i <= 2; i++) {
                    const checkDate = new Date(now);
                    checkDate.setDate(checkDate.getDate() - i);
                    const checkDateString = formatDate(checkDate, 'yyyy-MM-dd');
                    
                    if (isHabitScheduledOnDay(habit, checkDate) && 
                        !habit.completed[checkDateString] &&
                        !isHabitLoggable(habit, checkDate, now)) {
                        broken.push({ habit, dateString: checkDateString });
                        break; // Only add once per habit
                    }
                }
            }
        });
        
        if (broken.length > 0) {
            setBrokenStreaks(broken);
        }
        
        localStorage.setItem(LOCAL_STORAGE_STREAK_REPAIR_CHECK_KEY, today);
    }, [onboardingComplete, habits]);

    // Removed automatic popup - Daily Check-In now only opens when user clicks Sparkles icon

    const startOfWeek = getStartOfWeek(currentDate);
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));

    const handleNavigation = (direction: 'prev' | 'next') => {
        const d = direction === 'prev' ? -1 : 1;
        if (viewMode === 'week') setCurrentDate(addDays(currentDate, d * 7));
        else if (viewMode === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + d, 1));
        else setCurrentDate(new Date(currentDate.getFullYear() + d, currentDate.getMonth(), 1));
    };

    const handleTitleClick = () => setViewMode(v => v === 'week' ? 'month' : v === 'month' ? 'year' : 'week');
    const handleDateClick = (date: Date) => { setCurrentDate(date); setViewMode('week'); };
    const handleAddNewHabit = () => { setSelectedHabitToEdit(null); setShowAddHabitModal(true); };
    const handleEditHabit = (habit: Habit) => { setSelectedHabitToEdit(habit); setShowAddHabitModal(true); };
    
    const handleOpenProgramLibrary = () => {
        setShowAddHabitModal(false);
        setShowProgramLibrary(true);
    };
    
    const handleMomentumComplete = () => {
        const today = formatDate(new Date(), 'yyyy-MM-dd');
        setMomentumLastCompleted(today);
        localStorage.setItem(LOCAL_STORAGE_MOMENTUM_LAST_COMPLETED_KEY, today);
        
        console.log('🚀 [Momentum] handleMomentumComplete called');
        console.log('📅 [Momentum] Today date:', today);
        
        // Auto-complete the "Ignite" habit (ID 9999994) and persist immediately
        setHabits(prevHabits => {
            const igniteHabit = prevHabits.find(h => h.id === 9999994);
            console.log('🔍 [Momentum] Found Ignite habit:', igniteHabit ? `Yes (${igniteHabit.name})` : 'NO - NOT FOUND!');
            console.log('📋 [Momentum] Current habits:', prevHabits.map(h => ({ id: h.id, name: h.name })));
            
            if (!igniteHabit) {
                console.error('❌ [Momentum] Could not find Ignite habit (ID 9999994)!');
                return prevHabits;
            }
            
            const updatedHabits = prevHabits.map(h => 
                h.id === 9999994 
                    ? { ...h, completed: { ...h.completed, [today]: true } }
                    : h
            );
            
            // Immediately persist to localStorage to ensure data is saved before modal closes
            try {
                localStorage.setItem(LOCAL_STORAGE_HABITS_KEY, JSON.stringify(updatedHabits));
                console.log('💾 [Momentum] Ignite habit persisted to localStorage for', today);
            } catch (e) {
                console.error('❌ [Momentum] Failed to persist habits:', e);
            }
            
            console.log('✅ [Momentum] Ignite habit marked complete for', today);
            return updatedHabits;
        });
    };
    
    const handleSaveContentLibrary = (items: ContentLibraryItem[]) => {
        setContentLibrary(items);
        saveContentLibrary(items);
        setShowContentLibraryManager(false);
    };
    
    const handleSelectProgramHabits = async (habitTemplates: HabitTemplate[], programId: string) => {
        const now = Date.now();
        const currentMaxOrder = Math.max(...habits.map(h => h.order), -1);
        
        const newHabits: Habit[] = habitTemplates.map((template, index) => ({
            ...template,
            id: now + index,
            order: currentMaxOrder + index + 1,
            completed: {},
            createdAt: now,
            sourceProgramId: programId
        }));
        
        // Request notification permission if any habit has scheduledTime
        const hasScheduledTime = newHabits.some(h => h.scheduledTime);
        if (hasScheduledTime) {
            const granted = await NotificationService.requestPermission();
            if (!granted) {
                alert('Notifications are blocked. Some habits have scheduled reminders that won\'t work until you enable notifications in your browser settings.');
            }
        }
        
        setHabits(prev => [...prev, ...newHabits]);
        setToastMessage(`Added ${newHabits.length} habit${newHabits.length !== 1 ? 's' : ''} from program!`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSaveHabit = async (habitData: any) => {
        // Request notification permission if habit has scheduledTime
        if (habitData.scheduledTime) {
            const granted = await NotificationService.requestPermission();
            if (!granted) {
                alert('Notifications are blocked. Please enable them in your browser settings to receive habit reminders.');
            }
        }

        setHabits(prev => {
            if (habitData.id) {
                // Editing existing habit
                return prev.map(h => h.id === habitData.id ? { 
                    ...h, 
                    ...habitData,
                    miniAppType: habitData.miniAppType !== undefined ? habitData.miniAppType : h.miniAppType
                } : h);
            } else {
                // Creating new habit
                const newHabit: Habit = {
                    ...habitData,
                    id: Date.now(),
                    order: Math.max(...prev.map(h => h.order), -1) + 1,
                    completed: {},
                    createdAt: Date.now(),
                    miniAppType: habitData.miniAppType || null
                };
                return [...prev, newHabit];
            }
        });
    };

    const handleDeleteHabit = (habitId: number) => {
        NotificationService.unscheduleHabit(habitId);
        setHabits(p => p.filter(h => h.id !== habitId));
    };
    
    const handleToggleHabit = useCallback((habitId: number, dateString: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;
        
        // Check if habit has a mini-app experience - open it instead of toggling
        if (habit.miniAppType && !habit.completed[dateString]) {
            setActiveMiniApp({ habit, date: dateString, type: habit.miniAppType });
            return;
        }
        
        // Check if habit is loggable based on three-tier system
        const habitDate = new Date(dateString);
        const currentDate = new Date();
        const strictness = getHabitStrictness(habit);
        
        // Only enforce loggability check for strict habits (Anchor/Life Goal)
        if (strictness !== 'anytime') {
            const loggable = isHabitLoggable(habit, habitDate, currentDate);
            if (!loggable && !habit.completed[dateString]) {
                // Show a message or prevent action - for now just return
                return;
            }
        }
        
        // Emergency Mode: Open micro-win action instead of direct toggle (only for Anchor/Life Goal)
        if (emergencyMode && strictness !== 'anytime') {
            if (habit && !habit.completed[dateString]) {
                setEmergencyHabitAction({ habit, date: dateString });
                return;
            }
        }
        
        setHabits(p => {
            const updatedHabits = p.map(h => {
                if (h.id === habitId) {
                    const currentValue = h.completed[dateString];
                    const newValue = currentValue === null || currentValue === undefined ? true : currentValue === true ? false : null;
                    
                    if (newValue === true) {
                        const habit = p.find(hb => hb.id === habitId);
                        if (habit) {
                            let streak = 1;
                            let checkDate = new Date(dateString);
                            checkDate.setDate(checkDate.getDate() - 1);
                            
                            while (streak < 30) {
                                const checkDateStr = formatDate(checkDate, 'yyyy-MM-dd');
                                if (habit.completed[checkDateStr] === true) {
                                    streak++;
                                    checkDate.setDate(checkDate.getDate() - 1);
                                } else {
                                    break;
                                }
                            }
                            
                            const celebrationKey = `${habitId}-${streak}`;
                            if ([3, 7, 14, 30].includes(streak) && !celebratedStreaks.has(celebrationKey)) {
                                setStreakCelebration({ habitName: habit.name, days: streak });
                                setCelebratedStreaks(prev => new Set(prev).add(celebrationKey));
                            }
                            
                            const messages = [
                                "Hell yeah! 🔥",
                                "Keep crushing it! 💪",
                                "That's what I'm talking about! 🎯",
                                "You're building momentum! 🚀",
                                "Consistency is key! ⭐"
                            ];
                            setAiCoachMessage(messages[Math.floor(Math.random() * messages.length)]);
                            setShowAiCoach(true);
                        }
                    }
                    
                    return { ...h, completed: { ...h.completed, [dateString]: newValue } };
                }
                return h;
            });
            return updatedHabits;
        });
    }, [celebratedStreaks, emergencyMode, habits]);

    const handleUnloggableClick = useCallback((habitType: string) => {
        if (habitType === 'Life Goal Habit') {
            setToastMessage('Goal habit is loggable today or yesterday');
        } else if (habitType === 'Anchor Habit') {
            setToastMessage('Habit Muscle is loggable today only');
        }
    }, []);

    const handleChatCheckInSubmit = (entry: { wins: string; challenges: string; messages: any[] }) => {
        const today = formatDate(new Date(), 'yyyy-MM-dd');
        setChatEntries(prev => ({ ...prev, [today]: entry }));
        localStorage.setItem(LOCAL_STORAGE_LAST_DAILY_SUMMARY_KEY, today);
        setShowChatCheckIn(false);
    };

    const handleEmergencyHabitComplete = () => {
        if (!emergencyHabitAction) return;
        
        const { habit, date } = emergencyHabitAction;
        
        // Directly mark habit as complete (bypass emergency mode check)
        setHabits(p => {
            const updatedHabits = p.map(h => {
                if (h.id === habit.id) {
                    const streak = 1; // Calculate streak for celebration
                    let checkDate = new Date(date);
                    checkDate.setDate(checkDate.getDate() - 1);
                    
                    const celebrationKey = `${habit.id}-${streak}`;
                    if ([3, 7, 14, 30].includes(streak) && !celebratedStreaks.has(celebrationKey)) {
                        setStreakCelebration({ habitName: habit.name, days: streak });
                        setCelebratedStreaks(prev => new Set(prev).add(celebrationKey));
                    }
                    
                    const messages = [
                        "Hell yeah! 🔥",
                        "Keep crushing it! 💪",
                        "That's what I'm talking about! 🎯",
                        "You're building momentum! 🚀",
                        "Consistency is key! ⭐"
                    ];
                    setAiCoachMessage(messages[Math.floor(Math.random() * messages.length)]);
                    setShowAiCoach(true);
                    
                    return { ...h, completed: { ...h.completed, [date]: true } };
                }
                return h;
            });
            return updatedHabits;
        });
        
        setEmergencyHabitAction(null);
    };

    const handleEmergencyHabitCancel = () => {
        setEmergencyHabitAction(null);
    };

    const handleStreakRepairComplete = (habitId: number, dateString: string) => {
        // Mark the habit as complete for the given date (usually yesterday)
        setHabits(p => p.map(h => 
            h.id === habitId 
                ? { ...h, completed: { ...h.completed, [dateString]: true } }
                : h
        ));
    };

    const handleStreakRepairDismiss = () => {
        setBrokenStreaks([]);
    };

    const handleIgniteComplete = () => {
        if (!igniteHabit) return;
        
        // Mark habit as complete for today
        const today = formatDate(new Date(), 'yyyy-MM-dd');
        handleToggleHabit(igniteHabit.id, today);
        setIgniteHabit(null);
    };

    const handleIgniteCancel = () => {
        setIgniteHabit(null);
    };

    const handleDragStart = (e: React.DragEvent, habitId: number) => { setDraggedHabitId(habitId); e.dataTransfer.effectAllowed = 'move'; };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
    const handleDrop = (e: React.DragEvent, targetHabitId: number) => {
        e.preventDefault();
        if (draggedHabitId === null || draggedHabitId === targetHabitId) { setDraggedHabitId(null); return; }
        setHabits(prev => {
            const sorted = [...prev].sort((a,b) => a.order - b.order);
            const draggedIndex = sorted.findIndex(h => h.id === draggedHabitId);
            const targetIndex = sorted.findIndex(h => h.id === targetHabitId);
            const [draggedItem] = sorted.splice(draggedIndex, 1);
            sorted.splice(targetIndex, 0, draggedItem);
            return sorted.map((h, i) => ({ ...h, order: i }));
        });
        setDraggedHabitId(null);
    };
    
    const sortedHabits = [...habits].sort((a, b) => a.order - b.order);
    const habitMuscleCount = habits.filter(h => h.type === 'Anchor Habit').length;
    const lifeGoalsCount = habits.filter(h => h.type === 'Life Goal Habit').length;
    
    // CRITICAL PERFORMANCE FIX: Memoized Dashboard Data Calculation 
    const dashboardData = useMemo(() => {
        // Pass both mode states for the full calculation
        return calculateDashboardData(habits, weeklyRateMode, streakMode); 
    }, [habits, weeklyRateMode, streakMode]); 

    // Setter function for rate mode
    const handleToggleRateMode = useCallback(() => {
        setWeeklyRateMode(p => p === 'basic' ? 'hard' : 'basic');
    }, []);
    
    const handleToggleStreakMode = useCallback(() => {
        setStreakMode(p => p === 'hard' ? 'easy' : 'hard');
    }, []);


    const handleMicroWinComplete = () => {
        console.log('🎯 Micro-Win Protocol completed');
        setMicroWinComplete(true);
        setPreviewMicroWin(false);
        localStorage.setItem(LOCAL_STORAGE_MICRO_WIN_KEY, 'true');
    };

    // Auto-skip micro-win if no Life Goal habit exists (MUST be before returns!)
    useEffect(() => {
        if (onboardingComplete && appTourComplete && !microWinComplete && !previewMicroWin && habits.length > 0) {
            const coreHabit = habits.find(h => h.type === 'Life Goal Habit');
            if (!coreHabit) {
                console.log('⚠️ No Life Goal habit found, skipping Micro-Win Protocol');
                handleMicroWinComplete();
            }
        }
    }, [onboardingComplete, appTourComplete, microWinComplete, previewMicroWin, habits]);

    // Determine if we should show Micro-Win (either first time or preview)
    const shouldShowMicroWin = (onboardingComplete && appTourComplete && !microWinComplete) || previewMicroWin;
    const coreHabit = habits.find(h => h.type === 'Life Goal Habit');

    // Show onboarding if not complete or in preview mode
    if (!onboardingComplete || previewOnboarding) {
        // When jumping to Phase 7, pre-populate with mock data to test full flow
        const mockProfileForPhase7 = jumpToPhase === 7 ? {
            name: 'Test User',
            context: 'Testing the flow',
            mentalState: 'STUCK' as const,
            archetype: 'Warrior' as const,
            fuel: 'Glory' as const,
            saboteur: 'Perfectionist' as const,
            goldenHour: 'Morning' as const,
            aiPersona: 'Drill Sergeant' as const,
            northStar: 'Build a successful habit tracking app',
            northStarTimeline: '3 Months' as const,
            logicTreeRoot: 'Build a successful habit tracking app',
            logicTreeBranch: 'Complete MVP with core features',
            logicTreeLeaf: 'Code for 30 minutes daily',
            existingHabits: [],
            canEnvisionPath: true,
            proposedHabit: {
                name: 'Code for 30 minutes daily',
                description: 'Your daily action to achieve "Build a successful habit tracking app" - optimized for your morning golden hour',
                duration: 30,
                difficulty: 'challenging' as const
            },
            acceptedHabit: true,
            finalHabitDuration: 30
        } : undefined;

        return <MasteryOnboarding 
            onComplete={handleOnboardingComplete} 
            isPreview={previewOnboarding}
            onExitPreview={() => {
                setPreviewOnboarding(false);
                setJumpToPhase(null);
            }}
            initialPhase={jumpToPhase}
            initialProfile={mockProfileForPhase7}
        />;
    }

    // Determine if we should show App Tour overlay
    const shouldShowAppTour = (onboardingComplete && !appTourComplete) || previewAppTour;

    return (
        <div className="min-h-screen bg-[#1C1C1E] font-sans text-white p-4">
            {/* Quick Access Icons */}
            <div className="fixed top-4 left-4 z-50 flex gap-2">
                <button
                    onClick={() => {
                        setJumpToPhase(0);
                        setPreviewOnboarding(true);
                    }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg border border-gray-700 transition-colors"
                    title="Jump to Phase 0 (Start of Onboarding)"
                >
                    <Home className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        setJumpToPhase(4);
                        setPreviewOnboarding(true);
                    }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg border border-gray-700 transition-colors"
                    title="Jump to Phase 4 (Logic Tree)"
                >
                    <Target className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        setJumpToPhase(7);
                        setPreviewOnboarding(true);
                    }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300 rounded-lg border border-gray-700 transition-colors"
                    title="Jump to Phase 7 (Contract - Test Full Flow)"
                >
                    <FileCheck className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setPreviewAppTour(true)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 rounded-lg border border-gray-700 transition-colors"
                    title="Preview App Tour"
                >
                    <BookOpen className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setPreviewMicroWin(true)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300 rounded-lg border border-gray-700 transition-colors"
                    title="Preview Micro-Win Protocol"
                >
                    <Zap className="w-4 h-4" />
                </button>
            </div>
            <div className="flex justify-between items-center max-w-2xl mx-auto mb-8">
                <div className="flex-1">
                    {/* Emergency Latch Toggle */}
                    <button
                        onClick={() => setEmergencyMode(!emergencyMode)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            emergencyMode 
                                ? 'bg-red-600 text-white hover:bg-red-500' 
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                        }`}
                        title={emergencyMode ? "Emergency Mode Active - All habits are 60-second micro-wins" : "Activate Emergency Mode - Shrink all habits to 60 seconds"}
                    >
                        <Shield className="w-4 h-4 inline-block mr-2" />
                        {emergencyMode ? "Emergency ON" : "I'm Overwhelmed"}
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    {/* BUTTON 1: Daily Check-In (Reflection + Chat) */}
                    <button 
                        onClick={() => setShowChatCheckIn(true)} 
                        className="p-2 rounded-lg text-purple-400 hover:bg-gray-700 hover:text-purple-300"
                        title="Daily Check-In"
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                    
                    {/* BUTTON 2: Habit Tracker View - Always visible, highlighted when active */}
                    <button 
                        onClick={() => setShowStatsView(false)} 
                        className={`p-2 rounded-lg hover:bg-gray-700 ${!showStatsView ? 'text-blue-400' : 'text-gray-400'}`}
                        title="Habit Tracker"
                    >
                        <List className="w-5 h-5" />
                    </button>
                    
                    {/* BUTTON 3: Stats View Toggle */}
                    <button 
                        onClick={() => setShowStatsView(p => !p)} 
                        className={`p-2 rounded-lg hover:bg-gray-700 ${showStatsView ? 'text-blue-400' : 'text-gray-400'}`}
                        title="Stats Dashboard"
                    >
                        <BarChart3 className="w-5 h-5" />
                    </button>
                    
                    {/* BUTTON 4: Add New Habit */}
                    <button onClick={handleAddNewHabit} className="p-2 rounded-full hover:bg-gray-700"><Plus className="w-6 h-6" /></button>
                </div>
            </div>
            <div className="max-w-2xl mx-auto">
                {/* Emergency Mode Banner */}
                {emergencyMode && (
                    <div className="mb-6 p-4 bg-red-600/20 border border-red-500 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-red-400" />
                                <div>
                                    <h3 className="font-bold text-red-400">Emergency Mode Active</h3>
                                    <p className="text-sm text-gray-300">All habits are now 60-second micro-wins. Just show up.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmergencyMode(false)}
                                className="text-sm px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                            >
                                Deactivate
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="text-center mb-8 relative">
                    <h1 className="text-4xl font-bold mb-2">Mastery Dashboard</h1>
                    <p className="text-gray-400 mb-4">Track your habits and build a better you, one day at a time.</p>
                    
                    {/* Developer: Manage Videos Button - Top Right */}
                    <button
                        onClick={() => setShowContentLibraryManager(true)}
                        className="absolute top-0 right-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                        title="Manage video library"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Manage Videos
                    </button>
                    
                    {/* View Mode Toggle - Only show on Habit Tracker page */}
                    {!showStatsView && (
                        <div className="flex justify-center">
                            <div className="inline-flex items-center rounded-lg bg-gray-800 p-1 gap-1">
                                <button 
                                    onClick={() => setShowDailyTrackingView(false)} 
                                    className={`p-2 rounded transition-colors ${!showDailyTrackingView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                                    title="Simple View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setShowDailyTrackingView(true)} 
                                    className={`p-2 rounded transition-colors ${showDailyTrackingView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                                    title="Weekly View"
                                >
                                    <Calendar className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* STATS OVERVIEW */}
                {showStatsView && (
                    <div className="stats-dashboard-area">
                        <StatsOverview 
                            dashboardData={dashboardData}
                            onToggleRateMode={handleToggleRateMode}
                            onToggleStreakMode={handleToggleStreakMode}
                            goal={goal}
                            onGoalUpdate={setGoal}
                            habits={habits}
                        />
                    </div>
                )}

                {/* Calendar Header shown for all calendar views (week/month/year) when showDailyTrackingView is true */}
                {!showStatsView && showDailyTrackingView && <CalendarHeader currentDate={currentDate} viewMode={viewMode} onPrevWeek={() => handleNavigation('prev')} onNextWeek={() => handleNavigation('next')} onTitleClick={handleTitleClick}/>}
                {!showStatsView && viewMode === 'week' && showDailyTrackingView && <WeekHeader weekDates={weekDates} />}
                
                {/* Month and Year Views are shown when showDailyTrackingView is true (calendar mode) */}
                {!showStatsView && viewMode === 'month' && showDailyTrackingView && <MonthView currentDate={currentDate} habits={habits} onDateClick={handleDateClick}/>}
                {!showStatsView && viewMode === 'year' && showDailyTrackingView && <YearView currentDate={currentDate} onMonthClick={handleDateClick}/>}

                {/* Habit rows only show in week view (calendar mode) or simple list mode */}
                {!showStatsView && (viewMode === 'week' || !showDailyTrackingView) && (
                    <div className="habit-tracker-area space-y-2 pb-28">
                        {sortedHabits.map(habit => (
                            <HabitRow 
                                key={habit.id} 
                                habit={habit} 
                                weekDates={weekDates} 
                                onToggle={handleToggleHabit} 
                                onEditHabit={handleEditHabit} 
                                showCircles={viewMode === 'week' && showDailyTrackingView} 
                                onDragStart={handleDragStart} 
                                onDragOver={handleDragOver} 
                                onDrop={handleDrop} 
                                isDragging={draggedHabitId === habit.id}
                                onUnloggableClick={handleUnloggableClick}
                            />
                        ))}
                    </div>
                )}
                
                {/* Launch Pad Button - Premium Half-circle at bottom-center */}
                {onboardingComplete && !showStatsView && (
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 group">
                        <button
                            onClick={() => setShowMomentumConfirmation(true)}
                            disabled={isMomentumCompletedToday}
                            className="relative w-40 h-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-t-full hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 transition-all duration-500 shadow-2xl flex flex-col items-center justify-center gap-1 font-bold text-black hover:scale-110 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 animate-pulse"
                            style={{
                              boxShadow: '0 -10px 40px rgba(251, 191, 36, 0.5), 0 -5px 20px rgba(251, 191, 36, 0.3)'
                            }}
                            title={isMomentumCompletedToday ? "Come back tomorrow for the launch ritual" : "Launch the daily ignition sequence"}
                        >
                            <Rocket size={32} className="group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-sm font-black uppercase tracking-wider opacity-90 group-hover:opacity-100 transition-opacity">
                                Ignite
                            </span>
                        </button>
                        
                        {/* Dev Reset Button - Only shows when completed */}
                        {isMomentumCompletedToday && (
                            <button
                                onClick={() => {
                                    const today = formatDate(new Date(), 'yyyy-MM-dd');
                                    
                                    // Clear momentum completion timestamp
                                    setMomentumLastCompleted(null);
                                    localStorage.removeItem(LOCAL_STORAGE_MOMENTUM_LAST_COMPLETED_KEY);
                                    
                                    // Clear Ignite habit completion for today
                                    setHabits(prevHabits => {
                                        return prevHabits.map(h => {
                                            if (h.id === 9999994) {
                                                const updatedCompleted = { ...h.completed };
                                                delete updatedCompleted[today];
                                                return { ...h, completed: updatedCompleted };
                                            }
                                            return h;
                                        });
                                    });
                                    
                                    console.log('🔄 Reset: Cleared momentum completion and Ignite habit for', today);
                                }}
                                className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg border border-gray-500 transition-all duration-200"
                                title="Reset for testing"
                            >
                                🔧 Reset
                            </button>
                        )}
                    </div>
                )}

            </div>
            
            {/* MOTIVATION COMPONENTS */}
            <AICoachWidget 
                message={aiCoachMessage} 
                visible={showAiCoach} 
                onDismiss={() => setShowAiCoach(false)}
            />
            
            {streakCelebration && (
                <StreakCelebration 
                    habitName={streakCelebration.habitName}
                    streakDays={streakCelebration.days}
                    onClose={() => setStreakCelebration(null)}
                />
            )}
            
            {showChatCheckIn && (
                <ChatDailyCheckIn 
                    onDismiss={() => setShowChatCheckIn(false)}
                />
            )}
            
            {emergencyHabitAction && (
                <EmergencyHabitAction
                    habitName={emergencyHabitAction.habit.name}
                    onComplete={handleEmergencyHabitComplete}
                    onCancel={handleEmergencyHabitCancel}
                />
            )}
            
            {brokenStreaks.length > 0 && (
                <StreakRepair
                    brokenHabits={brokenStreaks}
                    onRepairComplete={handleStreakRepairComplete}
                    onDismiss={handleStreakRepairDismiss}
                />
            )}

            {igniteHabit && (
                <HoldToIgnite
                    habitName={igniteHabit.name}
                    habitColor={igniteHabit.color || '#22c55e'}
                    onComplete={handleIgniteComplete}
                    onCancel={handleIgniteCancel}
                />
            )}

            {activeMiniApp && activeMiniApp.type === 'breath' && (
                <BreathPacer
                    habitName={activeMiniApp.habit.name}
                    onComplete={() => {
                        // Mark habit as complete for the date
                        const habitId = activeMiniApp.habit.id;
                        const dateString = activeMiniApp.date;
                        
                        setHabits(p => p.map(h => {
                            if (h.id === habitId) {
                                return { ...h, completed: { ...h.completed, [dateString]: true } };
                            }
                            return h;
                        }));
                        
                        setActiveMiniApp(null);
                        
                        // Show AI coach message
                        const messages = [
                            "Beautiful practice! 🌟",
                            "Your breath is your power! 💨",
                            "Centered and focused! 🎯",
                            "That's mindfulness! 🧘",
                        ];
                        setAiCoachMessage(messages[Math.floor(Math.random() * messages.length)]);
                        setShowAiCoach(true);
                    }}
                    onCancel={() => setActiveMiniApp(null)}
                />
            )}

            {activeMiniApp && activeMiniApp.type === 'journal' && (
                <JournalModule
                    habitName={activeMiniApp.habit.name}
                    habitId={activeMiniApp.habit.id}
                    onComplete={() => {
                        // Mark habit as complete for the date
                        const habitId = activeMiniApp.habit.id;
                        const dateString = activeMiniApp.date;
                        
                        setHabits(p => p.map(h => {
                            if (h.id === habitId) {
                                return { ...h, completed: { ...h.completed, [dateString]: true } };
                            }
                            return h;
                        }));
                        
                        setActiveMiniApp(null);
                        
                        // Show AI coach message
                        const messages = [
                            "Gratitude unlocks abundance! ✨",
                            "Your heart is full! 💖",
                            "Beautiful reflections! 📝",
                            "That's the spirit! 🌟",
                        ];
                        setAiCoachMessage(messages[Math.floor(Math.random() * messages.length)]);
                        setShowAiCoach(true);
                    }}
                    onCancel={() => setActiveMiniApp(null)}
                />
            )}
            
            {shouldShowMicroWin && coreHabit && (
                <MicroWinProtocol 
                    habit={{
                        name: coreHabit.name,
                        description: coreHabit.description || ''
                    }}
                    onComplete={handleMicroWinComplete}
                    isPreview={previewMicroWin}
                    onDismiss={() => setPreviewMicroWin(false)}
                />
            )}
            
            {shouldShowAppTour && (
                <AppTour
                    onComplete={() => {
                        setAppTourComplete(true);
                        setPreviewAppTour(false);
                    }}
                    onToggleStatsView={setShowStatsView}
                />
            )}
            
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
            
            <AddHabitModal 
                isOpen={showAddHabitModal} 
                onClose={() => { setShowAddHabitModal(false); setSelectedHabitToEdit(null); }} 
                onSaveHabit={handleSaveHabit} 
                onDeleteHabit={handleDeleteHabit} 
                habitToEdit={selectedHabitToEdit} 
                habitMuscleCount={habitMuscleCount} 
                lifeGoalsCount={lifeGoalsCount}
                onOpenProgramLibrary={handleOpenProgramLibrary}
            />
            
            <ProgramLibraryModal
                isOpen={showProgramLibrary}
                onClose={() => setShowProgramLibrary(false)}
                onSelectHabits={handleSelectProgramHabits}
            />
            
            {/* Momentum Generator - Daily Ignition Flow */}
            {/* Pre-Launch Confirmation Popup */}
            {showMomentumConfirmation && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-10 shadow-2xl max-w-lg mx-auto text-center animate-scaleIn"
                         style={{boxShadow: '0 0 60px rgba(251, 191, 36, 0.4)'}}>
                        <div className="text-8xl mb-6 animate-bounce">🚀</div>
                        <h3 className="text-3xl font-black text-yellow-400 mb-6" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.5)'}}>
                            Ready to Launch?
                        </h3>
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                            Are you ready to launch your rocket<br/>and kickstart your habits today?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setShowMomentumConfirmation(false);
                                    setShowMomentumGenerator(true);
                                }}
                                className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-lg rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50"
                            >
                                Yes, Let's Go! 🔥
                            </button>
                            <button
                                onClick={() => setShowMomentumConfirmation(false)}
                                className="px-10 py-4 bg-gray-800 border border-gray-700 text-gray-300 font-semibold text-lg rounded-2xl hover:bg-gray-700 hover:text-white transition-all duration-300"
                            >
                                Not Yet
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Momentum Generator - Daily Ignition Flow */}
            <MomentumGeneratorModal
                isOpen={showMomentumGenerator}
                onClose={() => setShowMomentumGenerator(false)}
                onComplete={handleMomentumComplete}
                onShowFloatingGo={() => {
                    setShowMomentumGenerator(false);
                    setShowFloatingGoPopup(true);
                }}
                habits={habits}
                goal={goal}
                aspirations={aspirations}
                todaysContent={todaysContent}
                onAddContentLibrary={() => setShowContentLibraryManager(true)}
                isCompletedToday={isMomentumCompletedToday}
            />
            
            {/* Floating "Now GO!" Popup - Appears over dashboard after countdown */}
            {showFloatingGoPopup && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setShowFloatingGoPopup(false)}
                >
                    <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 max-w-lg shadow-2xl shadow-yellow-500/30 animate-scaleIn cursor-pointer">
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 mb-6 animate-pulse" 
                                     style={{textShadow: '0 0 100px rgba(251, 191, 36, 0.9)'}}>
                                    🔥
                                </div>
                            </div>
                            <h2 className="text-7xl font-black text-white mb-6 tracking-tight" style={{textShadow: '0 0 60px rgba(251, 191, 36, 0.7)'}}>
                                Now GO!
                            </h2>
                            <p className="text-3xl text-yellow-400 font-light mb-4">
                                Your first action awaits
                            </p>
                            <p className="text-lg text-gray-400 italic">
                                Click to start your journey
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Content Library Manager - Admin Panel */}
            <ContentLibraryManager
                isOpen={showContentLibraryManager}
                onClose={() => setShowContentLibraryManager(false)}
                contentLibrary={contentLibrary}
                onSave={handleSaveContentLibrary}
            />
        </div>
    );
}

export default App;
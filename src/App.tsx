import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, List, Calendar, BarChart3, Sparkles, RotateCcw } from 'lucide-react';
import AddHabitModal from './components/AddHabitModal';
import MasteryOnboarding from './components/MasteryOnboarding';
import AICoachWidget from './components/AICoachWidget';
import StreakCelebration from './components/StreakCelebration';
import ChatDailyCheckIn from './components/ChatDailyCheckIn';
import StatsOverview from './components/StatsOverview';
import { Habit } from './types';
import { getStartOfWeek, addDays, calculateDashboardData, formatDate } from './utils';
import { WeekHeader, MonthView, YearView, CalendarHeader, HabitRow } from './components/DashboardComponents';

const LOCAL_STORAGE_HABITS_KEY = 'mastery-dashboard-habits-v1';
const LOCAL_STORAGE_RATE_MODE_KEY = 'mastery-dashboard-rate-mode-v1';
const LOCAL_STORAGE_STREAK_MODE_KEY = 'mastery-dashboard-streak-mode-v1';
const LOCAL_STORAGE_ONBOARDING_KEY = 'mastery-dashboard-onboarding-complete';
const LOCAL_STORAGE_CELEBRATED_STREAKS_KEY = 'mastery-dashboard-celebrated-streaks';
const LOCAL_STORAGE_LAST_DAILY_SUMMARY_KEY = 'mastery-dashboard-last-daily-summary';
const LOCAL_STORAGE_DAILY_REASONS_KEY = 'mastery-dashboard-daily-reasons';
const LOCAL_STORAGE_GOAL_KEY = 'mastery-dashboard-goal';
const LOCAL_STORAGE_ASPIRATIONS_KEY = 'mastery-dashboard-aspirations';
const LOCAL_STORAGE_CHAT_ENTRIES_KEY = 'mastery-dashboard-chat-entries';

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
      const habits = JSON.parse(stored);
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
  
  return [];
}

function isOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_ONBOARDING_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function App() {
    const [onboardingComplete, setOnboardingComplete] = useState(isOnboardingComplete);
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
    const [selectedHabitToEdit, setSelectedHabitToEdit] = useState<Habit | null>(null);
    const [draggedHabitId, setDraggedHabitId] = useState<number | null>(null);

    const [aiCoachMessage, setAiCoachMessage] = useState('');
    const [showAiCoach, setShowAiCoach] = useState(false);
    const [streakCelebration, setStreakCelebration] = useState<{ habitName: string; days: number } | null>(null);
    const [showChatCheckIn, setShowChatCheckIn] = useState(false);
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

    const handleOnboardingComplete = (newHabits: Omit<Habit, 'id' | 'createdAt'>[], userGoal: string, userAspirations: string, profile?: any) => {
        const now = Date.now();
        const habitsWithIds = newHabits.map((h, index) => ({
            ...h,
            id: now + index,
            createdAt: now,
            order: index,
        }));
        
        setHabits(habitsWithIds);
        setGoal(userGoal);
        setAspirations(userAspirations);
        setOnboardingComplete(true);
        localStorage.setItem(LOCAL_STORAGE_ONBOARDING_KEY, 'true');
        localStorage.setItem(LOCAL_STORAGE_GOAL_KEY, userGoal);
        localStorage.setItem(LOCAL_STORAGE_ASPIRATIONS_KEY, userAspirations);
    };

    useEffect(() => {
        try { 
            localStorage.setItem(LOCAL_STORAGE_HABITS_KEY, JSON.stringify(habits)); 
            localStorage.setItem(LOCAL_STORAGE_RATE_MODE_KEY, weeklyRateMode);
            localStorage.setItem(LOCAL_STORAGE_STREAK_MODE_KEY, streakMode);
            localStorage.setItem(LOCAL_STORAGE_GOAL_KEY, goal);
            localStorage.setItem(LOCAL_STORAGE_ASPIRATIONS_KEY, aspirations);
        }
        catch (e) { console.error("Failed to save habits", e); }
    }, [habits, weeklyRateMode, streakMode, goal, aspirations]);

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_CELEBRATED_STREAKS_KEY, JSON.stringify(Array.from(celebratedStreaks)));
            localStorage.setItem(LOCAL_STORAGE_DAILY_REASONS_KEY, JSON.stringify(dailyReasons));
            localStorage.setItem(LOCAL_STORAGE_CHAT_ENTRIES_KEY, JSON.stringify(chatEntries));
        } catch (e) { console.error("Failed to save motivation data", e); }
    }, [celebratedStreaks, dailyReasons, chatEntries]);

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

    const handleSaveHabit = (habitData: any) => {
        setHabits(prev => habitData.id
            ? prev.map(h => h.id === habitData.id ? { ...h, ...habitData } : h)
            : [...prev, { ...habitData, id: Date.now(), order: Math.max(...prev.map(h => h.order), -1) + 1, completed: {}, createdAt: Date.now() }]
        );
    };

    const handleDeleteHabit = (habitId: number) => setHabits(p => p.filter(h => h.id !== habitId));
    
    const handleToggleHabit = useCallback((habitId: number, dateString: string) => {
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
    }, [celebratedStreaks]);

    const handleChatCheckInSubmit = (entry: { wins: string; challenges: string; messages: any[] }) => {
        const today = formatDate(new Date(), 'yyyy-MM-dd');
        setChatEntries(prev => ({ ...prev, [today]: entry }));
        localStorage.setItem(LOCAL_STORAGE_LAST_DAILY_SUMMARY_KEY, today);
        setShowChatCheckIn(false);
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


    if (!onboardingComplete) {
        return <MasteryOnboarding onComplete={handleOnboardingComplete} />;
    }

    const resetToOnboarding = () => {
        if (confirm('Reset to onboarding? This will clear all current habits and data.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-[#1C1C1E] font-sans text-white p-4">
            {/* Dev Testing: Reset to Onboarding */}
            <button
                onClick={resetToOnboarding}
                className="fixed top-4 left-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Reset to Onboarding (Dev Testing)"
            >
                <RotateCcw className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex justify-between items-center max-w-2xl mx-auto mb-8">
                <div className="flex-1"></div>
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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Mastery Dashboard</h1>
                    <p className="text-gray-400 mb-4">Track your habits and build a better you, one day at a time.</p>
                    
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
                    <StatsOverview 
                        dashboardData={dashboardData}
                        onToggleRateMode={handleToggleRateMode}
                        onToggleStreakMode={handleToggleStreakMode}
                        goal={goal}
                        onGoalUpdate={setGoal}
                        habits={habits}
                    />
                )}

                {/* Calendar Header shown for all calendar views (week/month/year) when showDailyTrackingView is true */}
                {!showStatsView && showDailyTrackingView && <CalendarHeader currentDate={currentDate} viewMode={viewMode} onPrevWeek={() => handleNavigation('prev')} onNextWeek={() => handleNavigation('next')} onTitleClick={handleTitleClick}/>}
                {!showStatsView && viewMode === 'week' && showDailyTrackingView && <WeekHeader weekDates={weekDates} />}
                
                {/* Month and Year Views are shown when showDailyTrackingView is true (calendar mode) */}
                {!showStatsView && viewMode === 'month' && showDailyTrackingView && <MonthView currentDate={currentDate} habits={habits} onDateClick={handleDateClick}/>}
                {!showStatsView && viewMode === 'year' && showDailyTrackingView && <YearView currentDate={currentDate} onMonthClick={handleDateClick}/>}

                {/* Habit rows only show in week view (calendar mode) or simple list mode */}
                {!showStatsView && (viewMode === 'week' || !showDailyTrackingView) && (
                    <div className="space-y-2">
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
                            />
                        ))}
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
            
            <AddHabitModal isOpen={showAddHabitModal} onClose={() => { setShowAddHabitModal(false); setSelectedHabitToEdit(null); }} onSaveHabit={handleSaveHabit} onDeleteHabit={handleDeleteHabit} habitToEdit={selectedHabitToEdit} habitMuscleCount={habitMuscleCount} lifeGoalsCount={lifeGoalsCount}/>
        </div>
    );
}

export default App;
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, MoreHorizontal, List, Calendar, LayoutDashboard } from 'lucide-react';
import AddHabitModal from './components/AddHabitModal';
import DashboardOverview from './components/DashboardOverview';
import Onboarding from './components/Onboarding';
import { Habit } from './types';
import { getStartOfWeek, addDays, calculateDashboardData } from './utils';
import { WeekHeader, MonthView, YearView, CalendarHeader, HabitRow } from './components/DashboardComponents';

const LOCAL_STORAGE_HABITS_KEY = 'mastery-dashboard-habits-v1';
const LOCAL_STORAGE_RATE_MODE_KEY = 'mastery-dashboard-rate-mode-v1';
const LOCAL_STORAGE_STREAK_MODE_KEY = 'mastery-dashboard-streak-mode-v1';
const LOCAL_STORAGE_ONBOARDING_KEY = 'mastery-dashboard-onboarding-complete';

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

    const [currentScreen, setCurrentScreen] = useState<'habits' | 'dashboard'>('habits');
    
    const [weeklyRateMode, setWeeklyRateMode] = useState(loadRateMode);
    const [streakMode, setStreakMode] = useState(loadStreakMode);

    const [habits, setHabits] = useState<Habit[]>(loadHabitsFromStorage);
    const [showAddHabitModal, setShowAddHabitModal] = useState(false);
    const [selectedHabitToEdit, setSelectedHabitToEdit] = useState<Habit | null>(null);
    const [draggedHabitId, setDraggedHabitId] = useState<number | null>(null);

    const handleOnboardingComplete = (newHabits: Omit<Habit, 'id' | 'createdAt'>[]) => {
        const now = Date.now();
        const habitsWithIds = newHabits.map((h, index) => ({
            ...h,
            id: now + index,
            createdAt: now,
            order: index,
        }));
        
        setHabits(habitsWithIds);
        setOnboardingComplete(true);
        localStorage.setItem(LOCAL_STORAGE_ONBOARDING_KEY, 'true');
    };

    useEffect(() => {
        try { 
            localStorage.setItem(LOCAL_STORAGE_HABITS_KEY, JSON.stringify(habits)); 
            
            // Save modes
            localStorage.setItem(LOCAL_STORAGE_RATE_MODE_KEY, weeklyRateMode);
            localStorage.setItem(LOCAL_STORAGE_STREAK_MODE_KEY, streakMode);
        }
        catch (e) { console.error("Failed to save habits", e); }
    }, [habits, weeklyRateMode, streakMode]);

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
        setHabits(p => p.map(h => h.id === habitId ? { ...h, completed: { ...h.completed, [dateString]: h.completed[dateString] === null || h.completed[dateString] === undefined ? true : h.completed[dateString] === true ? false : null } } : h));
    }, []);

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
    // Setter function for streak mode
    const handleToggleStreakMode = useCallback(() => {
        setStreakMode(p => p === 'hard' ? 'easy' : 'hard');
    }, []);

    if (!onboardingComplete) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    return (
        <div className="min-h-screen bg-[#1C1C1E] font-sans text-white p-4">
            <div className="flex justify-between items-center max-w-2xl mx-auto mb-8">
                <div className="flex-1"></div>
                <div className="flex items-center space-x-2">
                    {/* BUTTON 1: Dashboard/Habits Screen Switch */}
                    <button onClick={() => setCurrentScreen(p => p === 'habits' ? 'dashboard' : 'habits')} className="p-2 rounded-lg text-gray-400 hover:bg-gray-700">
                        {currentScreen === 'habits' ? <LayoutDashboard className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </button>

                    {/* BUTTON 2: Detailed/Simple List View Toggle (ONLY visible on habits screen) */}
                    {currentScreen === 'habits' && (
                        <button onClick={() => setShowDailyTrackingView(p => !p)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-700">
                            {showDailyTrackingView ? <List className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                        </button>
                    )}
                    
                    {/* BUTTON 3: Add New Habit */}
                    <button onClick={handleAddNewHabit} className="p-2 rounded-full hover:bg-gray-700"><Plus className="w-6 h-6" /></button>
                    
                    {/* BUTTON 4: More Options (Remains placeholder) */}
                    <button className="p-2 rounded-full hover:bg-gray-700"><MoreHorizontal className="w-6 h-6" /></button>
                </div>
            </div>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Mastery Dashboard</h1>
                    <p className="text-gray-400">Track your habits and build a better you, one day at a time.</p>
                </div>

                {/* CONDITIONAL RENDERING OF VIEWS */}
                {currentScreen === 'habits' ? (
                    <>
                        {/* Calendar Header shown for all calendar views (week/month/year) when showDailyTrackingView is true */}
                        {showDailyTrackingView && <CalendarHeader currentDate={currentDate} viewMode={viewMode} onPrevWeek={() => handleNavigation('prev')} onNextWeek={() => handleNavigation('next')} onTitleClick={handleTitleClick}/>}
                        {viewMode === 'week' && showDailyTrackingView && <WeekHeader weekDates={weekDates} />}
                        
                        {/* Month and Year Views are shown when showDailyTrackingView is true (calendar mode) */}
                        {viewMode === 'month' && showDailyTrackingView && <MonthView currentDate={currentDate} habits={habits} onDateClick={handleDateClick}/>}
                        {viewMode === 'year' && showDailyTrackingView && <YearView currentDate={currentDate} onMonthClick={handleDateClick}/>}

                        {/* Habit rows only show in week view (calendar mode) or simple list mode */}
                        {(viewMode === 'week' || !showDailyTrackingView) && (
                            <div className="space-y-2">
                                {sortedHabits.map(habit => (
                                    <HabitRow 
                                        key={habit.id} 
                                        habit={habit} 
                                        weekDates={weekDates} 
                                        onToggle={handleToggleHabit} 
                                        onEditHabit={handleEditHabit} 
                                        // showCircles is based on the new toggle state AND if we are in the week view
                                        showCircles={viewMode === 'week' && showDailyTrackingView} 
                                        onDragStart={handleDragStart} 
                                        onDragOver={handleDragOver} 
                                        onDrop={handleDrop} 
                                        isDragging={draggedHabitId === habit.id}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    // Dashboard View - Pass data AND the toggle functions
                    <DashboardOverview 
                        dashboardData={dashboardData} 
                        onToggleRateMode={handleToggleRateMode} 
                        onToggleStreakMode={handleToggleStreakMode}
                    />
                )}

            </div>
            <AddHabitModal isOpen={showAddHabitModal} onClose={() => { setShowAddHabitModal(false); setSelectedHabitToEdit(null); }} onSaveHabit={handleSaveHabit} onDeleteHabit={handleDeleteHabit} habitToEdit={selectedHabitToEdit} habitMuscleCount={habitMuscleCount} lifeGoalsCount={lifeGoalsCount}/>
        </div>
    );
}

export default App;
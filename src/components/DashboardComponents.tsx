// src/components/DashboardComponents.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Habit } from '../types';
import { formatDate, getMonthCalendarDays, isHabitScheduledOnDay, getStartOfWeek, addDays, getColorClasses, getTextColorClass, isHabitLoggable, getHabitStrictness } from '../utils';

// Header item for a single day (e.g., MON 25)
export const DayHeader: React.FC<{ date: Date }> = ({ date }) => (
    <div className="flex flex-col items-center flex-1">
        <p className="text-xs font-semibold text-gray-400">{formatDate(date, 'EEE')}</p>
        <p className="mt-1 text-sm font-bold text-white">{formatDate(date, 'd')}</p>
    </div>
);

// The header that displays all 7 days of the week
export const WeekHeader: React.FC<{ weekDates: Date[] }> = ({ weekDates }) => (
    <div className="flex flex-row justify-around pb-4 border-b border-gray-700">
        {weekDates.map(date => (
            <DayHeader key={date.toString()} date={date} />
        ))}
    </div>
);

// Monthly calendar view component
export const MonthView: React.FC<{
    currentDate: Date;
    habits: Habit[];
    onDateClick: (date: Date) => void;
}> = ({ currentDate, habits, onDateClick }) => {
    const monthDays = getMonthCalendarDays(currentDate);
    const currentMonth = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
        <div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center py-2">
                        <span className="text-xs font-semibold text-gray-400">{day}</span>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {monthDays.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const isToday = date.getTime() === today.getTime();
                    const dateString = formatDate(date, 'yyyy-MM-dd');
                    
                    const completedHabits = habits.filter(h => isHabitScheduledOnDay(h, date) && h.completed[dateString]);
                    const scheduledHabits = habits.filter(h => isHabitScheduledOnDay(h, date));
                    const completionRate = scheduledHabits.length > 0 ? completedHabits.length / scheduledHabits.length : 0;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => onDateClick(date)}
                            className={`aspect-square p-2 rounded-lg transition-all ${
                                isCurrentMonth ? (isToday ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white') : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                            }`}
                        >
                            <div className="text-center">
                                <div className="text-sm font-medium">{formatDate(date, 'd')}</div>
                                {scheduledHabits.length > 0 && (
                                    <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                                        completionRate === 1 ? 'bg-green-400' : completionRate > 0 ? 'bg-yellow-400' : 'bg-gray-500'
                                    }`} />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// The header for the month and navigation arrows
export const CalendarHeader: React.FC<{
    currentDate: Date;
    viewMode: 'week' | 'month' | 'year';
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onTitleClick: () => void;
}> = ({ currentDate, viewMode, onPrevWeek, onNextWeek, onTitleClick }) => {
    const getDisplayText = () => {
        if (viewMode === 'year') return currentDate.getFullYear().toString();
        return formatDate(currentDate, 'MM / yyyy');
    };
    
    return (
        <div className="flex flex-row items-center justify-between px-2 mb-5">
            <button onClick={onPrevWeek} className="text-2xl text-white">{'<'}</button>
            <button onClick={onTitleClick} className="text-base font-bold text-white hover:text-gray-300 transition-colors cursor-pointer">{getDisplayText()}</button>
            <button onClick={onNextWeek} className="text-2xl text-white">{'>'}</button>
        </div>
    );
};

// Yearly view component showing all 12 months
export const YearView: React.FC<{
    currentDate: Date;
    onMonthClick: (date: Date) => void;
}> = ({ currentDate, onMonthClick }) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = new Date().getMonth();
    const currentYearIsThisYear = currentYear === new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => new Date(currentYear, index, 1));
    
    return (
        <div className="grid grid-cols-3 gap-4">
            {months.map((monthDate, index) => {
                const isCurrentMonth = currentYearIsThisYear && index === currentMonth;
                return (
                    <button
                        key={index}
                        onClick={() => onMonthClick(monthDate)}
                        className={`p-4 rounded-xl transition-all ${isCurrentMonth ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        <div className="text-center"><h3 className="text-2xl font-bold text-white">{index + 1}</h3></div>
                    </button>
                );
            })}
        </div>
    );
};

// A single tappable circle for a day's check-in
const DayCircle: React.FC<{
    completionStatus: boolean | null;
    isScheduled: boolean;
    onPress: () => void;
    habitColor: string;
    habit: Habit;
    date: Date;
    onUnloggableClick?: (habitType: string) => void;
    isInCurrentWeek: boolean;
}> = ({ completionStatus, isScheduled, onPress, habitColor, habit, date, onUnloggableClick, isInCurrentWeek }) => {
    const colors = getColorClasses(habitColor);
    const strictness = getHabitStrictness(habit);
    const isLoggable = strictness === 'anytime' ? true : isHabitLoggable(habit, date, new Date());
    
    // Check if this is a past expired date (not loggable and before today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    const isPastExpired = !isLoggable && dateToCheck < today && strictness !== 'anytime';
    
    // NEVER dim current week - only dim past weeks that have expired
    // This keeps all circles in current week at full brightness for visibility
    const shouldDim = isPastExpired && !isInCurrentWeek;
    
    let circleClasses = `w-9 h-9 rounded-full border transition-colors flex items-center justify-center text-sm font-medium `;
    let circleContent = null;

    const handleClick = () => {
        if (isScheduled && isLoggable) {
            onPress();
        } else if (isScheduled && !isLoggable && strictness !== 'anytime' && onUnloggableClick) {
            onUnloggableClick(habit.type);
        }
    };

    if (!isScheduled) {
        circleClasses += 'bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed';
    } else if (completionStatus === true) {
        circleClasses += `${colors.bg} ${colors.border} text-white cursor-pointer`;
    } else if (completionStatus === false) {
        circleClasses += 'bg-red-900/30 border-red-800/50 text-red-400 cursor-pointer';
        circleContent = <X className="w-4 h-4" />;
    } else if (shouldDim) {
        // Past expired from PREVIOUS week: dimmed to 15% opacity for history context
        circleClasses += 'bg-gray-700 border-gray-600 text-gray-300 cursor-pointer opacity-[0.15]';
    } else if (!isLoggable && strictness !== 'anytime') {
        // Current week expired or future unloggable: normal styling, clickable for info
        circleClasses += 'bg-gray-700 border-gray-600 text-gray-300 cursor-pointer';
    } else {
        circleClasses += 'bg-gray-700 border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-600';
    }
    
    return <button onClick={handleClick} className={circleClasses}>{circleContent}</button>;
};

// A row for a single habit
export const HabitRow: React.FC<{
    habit: Habit;
    weekDates: Date[];
    onToggle: (habitId: number, dateString: string) => void;
    onEditHabit: (habit: Habit) => void;
    showCircles: boolean;
    onDragStart: (e: React.DragEvent, habitId: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, targetHabitId: number) => void;
    isDragging: boolean;
    onUnloggableClick?: (habitType: string) => void;
}> = ({ habit, weekDates, onToggle, onEditHabit, showCircles, onDragStart, onDragOver, onDrop, isDragging, onUnloggableClick }) => {
    const getHabitBackgroundColor = (habitType: string): string => {
        if (habitType === 'Anchor Habit') return 'bg-blue-500/10 rounded-lg';
        if (habitType === 'Life Goal Habit') return 'bg-red-500/10 rounded-lg';
        return '';
    };

    const calculateStreak = (): number => {
        let streak = 0;
        let currentDay = new Date();
        currentDay.setHours(0, 0, 0, 0);
        const habitCreationDate = new Date(habit.createdAt);
        habitCreationDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365 && currentDay >= habitCreationDate; i++) {
            const dateString = formatDate(currentDay, 'yyyy-MM-dd');
            if (isHabitScheduledOnDay(habit, currentDay)) {
                if (habit.completed[dateString]) streak++;
                else break;
            }
            currentDay = addDays(currentDay, -1);
        }
        return streak;
    };
    
    const currentStreak = calculateStreak();
    
    // Check if the week being displayed is the current week (contains today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCurrentWeek = weekDates.some(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    
    return (
        <div 
            className={`mt-3 ${isDragging ? 'opacity-50' : ''} transition-opacity cursor-move`}
            draggable onDragStart={(e) => onDragStart(e, habit.id)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, habit.id)}
        >
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => onEditHabit(habit)} className={`text-base font-medium ${getTextColorClass(habit.color)} hover:opacity-75 transition-opacity text-left flex-1`}>
                    <span className={`${getHabitBackgroundColor(habit.type)} px-2 py-1 rounded-lg`}>{habit.name}</span>
                </button>
                <div className="flex items-center space-x-3">
                    {currentStreak > 0 && <span className="text-sm text-gray-400 font-medium">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>}
                    {!showCircles && (
                        <button 
                            onClick={() => isHabitScheduledOnDay(habit, new Date()) && onToggle(habit.id, formatDate(new Date(), 'yyyy-MM-dd'))}
                            disabled={!isHabitScheduledOnDay(habit, new Date())}
                            className={`w-6 h-6 rounded-full border transition-colors flex items-center justify-center text-xs ${
                                !isHabitScheduledOnDay(habit, new Date()) ? 'bg-gray-800 border-gray-700 opacity-50' : 
                                habit.completed[formatDate(new Date(), 'yyyy-MM-dd')] === true ? `${getColorClasses(habit.color).bg} ${getColorClasses(habit.color).border}` : 
                                habit.completed[formatDate(new Date(), 'yyyy-MM-dd')] === false ? 'bg-red-900/30 border-red-800/50' : 'bg-gray-700 border-gray-600'
                            }`}
                        >
                            {habit.completed[formatDate(new Date(), 'yyyy-MM-dd')] === false && <X className="w-3 h-3" />}
                        </button>
                    )}
                </div>
            </div>
            {showCircles && (
                <div className="flex items-center w-full">
                    {weekDates.map((date, index) => {
                        const dateString = formatDate(date, 'yyyy-MM-dd');
                        const isScheduled = isHabitScheduledOnDay(habit, date);
                        let showConnectingLine = index > 0 && habit.completed[dateString] && isHabitScheduledOnDay(habit, date) && habit.completed[formatDate(weekDates[index-1], 'yyyy-MM-dd')] && isHabitScheduledOnDay(habit, weekDates[index-1]);
                        return (
                            <React.Fragment key={dateString}>
                                {index > 0 && <div className={`h-1 flex-grow mx-1 ${showConnectingLine ? getColorClasses(habit.color).bg : 'bg-transparent'}`} />}
                                <DayCircle completionStatus={habit.completed[dateString]} isScheduled={isScheduled} onPress={() => onToggle(habit.id, dateString)} habitColor={habit.color} habit={habit} date={date} onUnloggableClick={onUnloggableClick} isInCurrentWeek={isCurrentWeek}/>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
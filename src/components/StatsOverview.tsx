import { useState } from 'react';
import { Edit2, Check, X, TrendingUp, Target, Zap } from 'lucide-react';
import { DashboardData } from '../types';
import { formatDate, getStartOfWeek, addDays } from '../utils';
import { Habit } from '../types';

interface StatsOverviewProps {
    dashboardData: DashboardData;
    onToggleRateMode: () => void;
    onToggleStreakMode: () => void;
    goal: string;
    onGoalUpdate: (newGoal: string) => void;
    habits: Habit[];
}

export default function StatsOverview({ dashboardData, onToggleRateMode, onToggleStreakMode, goal, onGoalUpdate, habits }: StatsOverviewProps) {
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [editedGoal, setEditedGoal] = useState(goal);

    const handleSaveGoal = () => {
        if (editedGoal.trim()) {
            onGoalUpdate(editedGoal.trim());
            setIsEditingGoal(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedGoal(goal);
        setIsEditingGoal(false);
    };

    // Calculate weekly analysis
    const getWeeklyAnalysis = () => {
        const today = new Date();
        const startOfWeek = getStartOfWeek(today);
        const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
        
        // Count completions by day
        const dailyCompletions: Record<string, number> = {};
        const dailyTotal: Record<string, number> = {};
        
        weekDates.forEach(date => {
            if (date <= today) {
                const dateStr = formatDate(date, 'yyyy-MM-dd');
                dailyCompletions[dateStr] = 0;
                dailyTotal[dateStr] = 0;
            }
        });

        habits.forEach(habit => {
            Object.keys(dailyCompletions).forEach(dateStr => {
                dailyTotal[dateStr]++;
                if (habit.completed[dateStr] === true) {
                    dailyCompletions[dateStr]++;
                }
            });
        });

        // Find best and worst days
        const dayStats = Object.entries(dailyCompletions).map(([dateStr, count]) => ({
            date: new Date(dateStr),
            dateStr,
            count,
            total: dailyTotal[dateStr],
            rate: dailyTotal[dateStr] > 0 ? (count / dailyTotal[dateStr]) * 100 : 0
        }));

        const sortedByRate = [...dayStats].sort((a, b) => b.rate - a.rate);
        const bestDay = sortedByRate[0];
        const worstDay = sortedByRate[sortedByRate.length - 1];

        return {
            bestDay,
            worstDay,
            dailyStats: dayStats
        };
    };

    const weeklyAnalysis = getWeeklyAnalysis();
    const { weeklyCompletionRate, streaks, habitTypeBreakdown } = dashboardData;

    const getDayName = (date: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Goal Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-blue-400">Your #1 Priority</h3>
                        </div>
                        
                        {!isEditingGoal ? (
                            <div className="flex items-start gap-3">
                                <p className="text-2xl font-bold text-white flex-1">{goal || 'No goal set'}</p>
                                <button
                                    onClick={() => {
                                        setEditedGoal(goal);
                                        setIsEditingGoal(true);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Edit goal"
                                >
                                    <Edit2 className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editedGoal}
                                    onChange={(e) => setEditedGoal(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your #1 priority..."
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveGoal}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Weekly Progress Analysis */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold">This Week's Progress</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Completion Rate */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Completion Rate</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-green-400">
                                {Math.round(weeklyCompletionRate[weeklyCompletionRate.mode])}%
                            </span>
                            <button
                                onClick={onToggleRateMode}
                                className="text-xs text-gray-500 hover:text-gray-400"
                            >
                                ({weeklyCompletionRate.mode})
                            </button>
                        </div>
                    </div>

                    {/* Current Streak */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Current Streak</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-orange-400">
                                {streaks.mode === 'easy' ? streaks.easyCurrent : streaks.hardCurrent}
                            </span>
                            <span className="text-sm text-gray-500">days</span>
                            <button
                                onClick={onToggleStreakMode}
                                className="text-xs text-gray-500 hover:text-gray-400 ml-1"
                            >
                                ({streaks.mode})
                            </button>
                        </div>
                    </div>

                    {/* Longest Streak */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Best Streak</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-400">
                                {streaks.mode === 'easy' ? streaks.easyLongest : streaks.hardLongest}
                            </span>
                            <span className="text-sm text-gray-500">days</span>
                        </div>
                    </div>

                    {/* Best Day */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Best Day</div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-blue-400">{getDayName(weeklyAnalysis.bestDay.date)}</span>
                            <span className="text-sm text-gray-500">{Math.round(weeklyAnalysis.bestDay.rate)}% completed</span>
                        </div>
                    </div>

                    {/* Most Challenging Day */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Most Challenging</div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-yellow-400">{getDayName(weeklyAnalysis.worstDay.date)}</span>
                            <span className="text-sm text-gray-500">{Math.round(weeklyAnalysis.worstDay.rate)}% completed</span>
                        </div>
                    </div>

                    {/* Total Habits */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Active Habits</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-cyan-400">{habits.length}</span>
                            <Zap className="w-5 h-5 text-cyan-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Habit Type Breakdown */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Habit Categories</h3>
                <div className="space-y-3">
                    {Object.entries(habitTypeBreakdown).map(([type, percentage]) => (
                        <div key={type}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">{type}</span>
                                <span className="text-gray-400">{percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${
                                        type === 'Life Goal' ? 'bg-green-500' :
                                        type === 'Habit Muscle 💪' ? 'bg-blue-500' :
                                        'bg-purple-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Heatmap */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
                <div className="grid grid-cols-7 gap-2">
                    {weeklyAnalysis.dailyStats.map((day) => (
                        <div key={day.dateStr} className="flex flex-col items-center gap-1">
                            <div className="text-xs text-gray-400">{getDayName(day.date).slice(0, 3)}</div>
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm ${
                                    day.rate >= 80 ? 'bg-green-500/30 text-green-400' :
                                    day.rate >= 50 ? 'bg-yellow-500/30 text-yellow-400' :
                                    day.rate > 0 ? 'bg-orange-500/30 text-orange-400' :
                                    'bg-gray-700 text-gray-500'
                                }`}
                            >
                                {Math.round(day.rate)}%
                            </div>
                            <div className="text-xs text-gray-500">{day.count}/{day.total}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

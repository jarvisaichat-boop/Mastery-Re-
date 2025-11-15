import { useState, useEffect } from 'react';
import { Habit } from '../../types';
import { formatDate } from '../../utils';

interface KPTAnalysisProps {
    habits: Habit[];
    onNext: (adjustedHabits: Habit[]) => void;
    onSkip: () => void;
}

interface HabitAnalysis {
    habit: Habit;
    completionRate: number;
    totalDays: number;
    completedDays: number;
    status: 'keep' | 'problem' | 'neutral';
}

export default function KPTAnalysis({ habits, onNext, onSkip }: KPTAnalysisProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [analysis, setAnalysis] = useState<HabitAnalysis[]>([]);
    const [adjustedHabits, setAdjustedHabits] = useState<Habit[]>(habits);
    const [habitsToRemove, setHabitsToRemove] = useState<Set<number>>(new Set());

    useEffect(() => {
        const timer = setTimeout(() => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const analyzed = habits.map(habit => {
                let completedDays = 0;
                let totalDays = 0;
                
                for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateString = formatDate(date, 'yyyy-MM-dd');
                    
                    totalDays++;
                    if (habit.completed[dateString] === true) {
                        completedDays++;
                    }
                }
                
                const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
                
                let status: 'keep' | 'problem' | 'neutral' = 'neutral';
                if (completionRate >= 80) status = 'keep';
                else if (completionRate < 50) status = 'problem';
                
                return {
                    habit,
                    completionRate,
                    totalDays,
                    completedDays,
                    status,
                };
            });
            
            setAnalysis(analyzed);
            setIsAnalyzing(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [habits]);

    const getKPTMessage = (item: HabitAnalysis): string => {
        if (item.status === 'keep') {
            return `Great job! Streak increased. You nailed "${item.habit.name}" (${item.completedDays}/${item.totalDays}).`;
        } else if (item.status === 'problem') {
            return `You missed "${item.habit.name}" (${item.completedDays}/${item.totalDays}). No judgment—what happened?`;
        }
        return `You're making progress on "${item.habit.name}" (${item.completedDays}/${item.totalDays}). Keep going.`;
    };

    const handleRemoveHabit = (habitId: number) => {
        setHabitsToRemove(prev => new Set(prev).add(habitId));
        setAdjustedHabits(prev => prev.filter(h => h.id !== habitId));
    };

    const handleKeepHabit = (habitId: number) => {
        setHabitsToRemove(prev => {
            const newSet = new Set(prev);
            newSet.delete(habitId);
            return newSet;
        });
        setAdjustedHabits(prev => {
            const existing = prev.find(h => h.id === habitId);
            if (!existing) {
                const original = habits.find(h => h.id === habitId);
                if (original) return [...prev, original];
            }
            return prev;
        });
    };

    const handleContinue = () => {
        onNext(adjustedHabits);
    };

    if (isAnalyzing) {
        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="text-center space-y-4">
                    <div className="text-5xl mb-4">📊</div>
                    <h2 className="text-3xl font-bold">Weekly Review</h2>
                    <p className="text-xl text-gray-400">Analyzing your performance...</p>
                </div>

                <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex gap-1">
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '0ms' }}>●</span>
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '150ms' }}>●</span>
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '300ms' }}>●</span>
                        </div>
                        <span className="text-gray-400">AI is reviewing your week...</span>
                    </div>
                </div>
            </div>
        );
    }

    const keeps = analysis.filter(a => a.status === 'keep');
    const problems = analysis.filter(a => a.status === 'problem');
    const neutrals = analysis.filter(a => a.status === 'neutral');

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-3xl font-bold">Your Weekly Review</h2>
                <p className="text-xl text-gray-400">Keep, Problem, Try</p>
            </div>

            <div className="space-y-6">
                {/* KEEP - What's Working */}
                {keeps.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                            <span>✅</span> KEEP - What's Working
                        </h3>
                        {keeps.map((item, idx) => (
                            <div key={idx} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-white">{getKPTMessage(item)}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* PROBLEM - What's Not Working */}
                {problems.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                            <span>⚠️</span> PROBLEM - What Needs Attention
                        </h3>
                        {problems.map((item, idx) => {
                            const isRemoved = habitsToRemove.has(item.habit.id);
                            return (
                                <div key={idx} className={`p-4 border rounded-lg space-y-3 transition-all ${
                                    isRemoved 
                                        ? 'bg-red-500/10 border-red-500/30 opacity-50' 
                                        : 'bg-yellow-500/10 border-yellow-500/30'
                                }`}>
                                    <p className="text-white">{getKPTMessage(item)}</p>
                                    <p className="text-gray-400 text-sm italic">
                                        Let's adjust. You can remove this habit or keep trying.
                                    </p>
                                    <div className="flex gap-3 mt-3">
                                        {!isRemoved ? (
                                            <>
                                                <button
                                                    onClick={() => handleRemoveHabit(item.habit.id)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded transition-all"
                                                >
                                                    Remove Habit
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded transition-all"
                                                >
                                                    Keep Trying
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleKeepHabit(item.habit.id)}
                                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded transition-all"
                                            >
                                                ↩ Undo Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* NEUTRAL - Keep Going */}
                {neutrals.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                            <span>📈</span> PROGRESS - Keep Building
                        </h3>
                        {neutrals.map((item, idx) => (
                            <div key={idx} className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-white">{getKPTMessage(item)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {habitsToRemove.size > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-white text-sm">
                        ⚠️ You're removing {habitsToRemove.size} habit{habitsToRemove.size > 1 ? 's' : ''}. 
                        Your plan will be lighter next week.
                    </p>
                </div>
            )}

            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-center text-gray-300">
                    <span className="font-semibold text-white">
                        {adjustedHabits.length === habits.length 
                            ? 'Your plan is locked for next week.' 
                            : 'Your adjusted plan is ready.'}
                    </span>
                    <br />
                    Now let's make it real with accountability.
                </p>
            </div>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={onSkip}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                >
                    Skip Review
                </button>
                <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                >
                    Continue to Accountability
                </button>
            </div>
        </div>
    );
}

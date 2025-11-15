import { useState } from 'react';
import { Habit } from '../types';
import { formatDate } from '../utils';

interface DailySummaryProps {
    habits: Habit[];
    date: Date;
    onSubmit: (reasons: Record<number, string>) => void;
    onDismiss: () => void;
}

export default function DailySummary({ habits, date, onSubmit, onDismiss }: DailySummaryProps) {
    const [reasons, setReasons] = useState<Record<number, string>>({});
    
    const dateString = formatDate(date, 'yyyy-MM-dd');
    const completedCount = habits.filter(h => h.completed[dateString] === true).length;
    const missedHabits = habits.filter(h => h.completed[dateString] === false);
    const totalCount = habits.length;

    const handleSubmit = () => {
        onSubmit(reasons);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fadeIn">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">📊</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Daily Check-In</h2>
                    <p className="text-gray-400">
                        You crushed <span className="text-green-400 font-bold">{completedCount}/{totalCount}</span> today!
                    </p>
                </div>

                {missedHabits.length > 0 ? (
                    <div className="space-y-4 mb-6">
                        <p className="text-gray-300 text-sm">
                            What happened with these habits?
                        </p>
                        {missedHabits.map((habit) => (
                            <div key={habit.id} className="space-y-2">
                                <label className="text-white text-sm font-medium">
                                    {habit.name}
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Too tired after work"
                                    value={reasons[habit.id] || ''}
                                    onChange={(e) => setReasons(prev => ({
                                        ...prev,
                                        [habit.id]: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 mb-6">
                        <p className="text-green-400 font-bold text-lg">Perfect day! 🔥</p>
                        <p className="text-gray-400 text-sm mt-2">You completed all your habits!</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onDismiss}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                    >
                        {missedHabits.length > 0 ? 'Submit' : 'Got it!'}
                    </button>
                </div>
            </div>
        </div>
    );
}

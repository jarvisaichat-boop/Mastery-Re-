import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { formatDate } from '../utils';

interface InlineWeeklyReviewProps {
    habits: Habit[];
    dailyReasons: Record<string, Record<number, string>>;
    onAdjust: (adjustedHabits: Habit[]) => void;
    onShare: () => void;
}

interface HabitAnalysis {
    habit: Habit;
    completionRate: number;
    completedDays: number;
    totalDays: number;
    status: 'keep' | 'challenged' | 'progress';
}

export default function InlineWeeklyReview({ habits, dailyReasons, onAdjust, onShare }: InlineWeeklyReviewProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [analysis, setAnalysis] = useState<HabitAnalysis[]>([]);
    const [missedReasons, setMissedReasons] = useState<Record<number, string>>(() => {
        const aggregated: Record<number, string> = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = formatDate(date, 'yyyy-MM-dd');
            const dayReasons = dailyReasons[dateString] || {};
            Object.entries(dayReasons).forEach(([habitId, reason]) => {
                const id = Number(habitId);
                if (reason && !aggregated[id]) {
                    aggregated[id] = reason;
                }
            });
        }
        return aggregated;
    });
    const [suggestions, setSuggestions] = useState<Record<number, string>>({});
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [adjustedHabits, setAdjustedHabits] = useState<Habit[]>(habits);
    const [showAccountability, setShowAccountability] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateSuggestions = (analysisData: HabitAnalysis[]): Record<number, string> => {
        const newSuggestions: Record<number, string> = {};

        analysisData.filter(a => a.status === 'challenged').forEach(item => {
            const reason = missedReasons[item.habit.id]?.toLowerCase() || '';
            
            if (reason.includes('early') || reason.includes('morning') || reason.includes('snooze')) {
                newSuggestions[item.habit.id] = "💡 Try moving this to the afternoon or evening instead.";
            } else if (reason.includes('tired') || reason.includes('exhausted') || reason.includes('energy')) {
                newSuggestions[item.habit.id] = "💡 Reduce the duration by half, or shift to when you have more energy.";
            } else if (reason.includes('forgot') || reason.includes('remember')) {
                newSuggestions[item.habit.id] = "💡 Link this to another habit you already do consistently.";
            } else if (reason.includes('time') || reason.includes('busy') || reason.includes('work')) {
                newSuggestions[item.habit.id] = "💡 Try doing this every other day instead of daily.";
            } else if (reason.includes('hard') || reason.includes('difficult') || reason.includes('too much')) {
                newSuggestions[item.habit.id] = "💡 Lower the difficulty - aim for something you can do even on bad days.";
            } else {
                newSuggestions[item.habit.id] = "💡 Consider adjusting the frequency or making it easier.";
            }
        });

        return newSuggestions;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
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

                let status: 'keep' | 'challenged' | 'progress' = 'progress';
                if (completionRate >= 80) status = 'keep';
                else if (completionRate < 50) status = 'challenged';

                return {
                    habit,
                    completionRate,
                    completedDays,
                    totalDays,
                    status,
                };
            });

            setAnalysis(analyzed);
            setIsAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [habits]);

    useEffect(() => {
        if (analysis.length === 0 || isAnalyzing) return;
        
        const challengedHabits = analysis.filter(a => a.status === 'challenged');
        const hasAllReasons = challengedHabits.every(p => missedReasons[p.habit.id]);
        
        if (hasAllReasons && challengedHabits.length > 0) {
            const autoSuggestions = generateSuggestions(analysis);
            setSuggestions(autoSuggestions);
            setShowSuggestions(true);
        }
    }, [analysis, missedReasons, isAnalyzing]);

    const handleAnalyzeReasons = () => {
        const newSuggestions = generateSuggestions(analysis);
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
    };

    const handleContinueToAccountability = () => {
        onAdjust(adjustedHabits);
        setShowAccountability(true);
    };

    const generateCommitmentMessage = (): string => {
        const activeHabits = adjustedHabits.slice(0, 3);
        const habitList = activeHabits.map(h => h.name).join(', ');
        return `I'm committing to ${habitList} this week. I will update you on Sunday. Hold me to it.`;
    };

    const handleWhatsApp = () => {
        const message = generateCommitmentMessage();
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    const handleSMS = () => {
        const message = generateCommitmentMessage();
        const encodedMessage = encodeURIComponent(message);
        window.location.href = `sms://?&body=${encodedMessage}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateCommitmentMessage()).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleComplete = () => {
        onShare();
    };

    if (isAnalyzing) {
        return (
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-6">
                <div className="text-center space-y-4">
                    <div className="text-4xl">📊</div>
                    <h3 className="text-xl font-bold">Analyzing your week...</h3>
                    <div className="flex items-center justify-center gap-2">
                        <span className="animate-bounce text-blue-400" style={{ animationDelay: '0ms' }}>●</span>
                        <span className="animate-bounce text-blue-400" style={{ animationDelay: '150ms' }}>●</span>
                        <span className="animate-bounce text-blue-400" style={{ animationDelay: '300ms' }}>●</span>
                    </div>
                </div>
            </div>
        );
    }

    const keeps = analysis.filter(a => a.status === 'keep');
    const challenged = analysis.filter(a => a.status === 'challenged');
    const progressing = analysis.filter(a => a.status === 'progress');

    if (showAccountability) {
        return (
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-6 space-y-6">
                <div className="text-center">
                    <div className="text-4xl mb-3">🤝</div>
                    <h3 className="text-2xl font-bold mb-2">Make it Real</h3>
                    <p className="text-gray-400">Share your commitment with someone who won't let you off easy.</p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Your commitment:</p>
                    <p className="text-white italic">"{generateCommitmentMessage()}"</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={handleWhatsApp}
                        className="p-4 bg-green-600 hover:bg-green-500 rounded-lg transition-all text-center"
                    >
                        <div className="text-2xl mb-1">💬</div>
                        <div className="text-xs text-white font-medium">WhatsApp</div>
                    </button>
                    <button
                        onClick={handleSMS}
                        className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all text-center"
                    >
                        <div className="text-2xl mb-1">📱</div>
                        <div className="text-xs text-white font-medium">SMS</div>
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`p-4 ${copied ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600 rounded-lg transition-all text-center`}
                    >
                        <div className="text-2xl mb-1">{copied ? '✅' : '📋'}</div>
                        <div className="text-xs text-white font-medium">{copied ? 'Copied!' : 'Copy'}</div>
                    </button>
                </div>

                <button
                    onClick={handleComplete}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                >
                    I've Shared It →
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-6 space-y-6">
            <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-2xl font-bold mb-2">Weekly Progress</h3>
                <p className="text-gray-400">Wins, Challenges, Growth</p>
            </div>

            {/* KEEP */}
            {keeps.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-green-400 font-bold flex items-center gap-2">
                        <span>✅</span> KEEP - What's Working
                    </h4>
                    {keeps.map((item, idx) => (
                        <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-white text-sm">
                                Great job! You nailed <span className="font-bold">{item.habit.name}</span> ({item.completedDays}/{item.totalDays})
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* CHALLENGED */}
            {challenged.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-yellow-400 font-bold flex items-center gap-2">
                        <span>💪</span> CHALLENGED - What Needs Attention
                    </h4>
                    {challenged.map((item, idx) => (
                        <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg space-y-3">
                            <p className="text-white text-sm">
                                You missed <span className="font-bold">{item.habit.name}</span> ({item.completedDays}/{item.totalDays}). {missedReasons[item.habit.id] ? 'You mentioned:' : 'No judgment—what happened?'}
                            </p>
                            <input
                                type="text"
                                placeholder="e.g., Too early, kept snoozing my alarm"
                                value={missedReasons[item.habit.id] || ''}
                                onChange={(e) => {
                                    setMissedReasons(prev => ({
                                        ...prev,
                                        [item.habit.id]: e.target.value
                                    }));
                                    setShowSuggestions(false);
                                }}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                            />
                            {showSuggestions && suggestions[item.habit.id] && (
                                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-blue-300 text-sm">{suggestions[item.habit.id]}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* PROGRESS */}
            {progressing.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-blue-400 font-bold flex items-center gap-2">
                        <span>📈</span> PROGRESS - Keep Building
                    </h4>
                    {progressing.map((item, idx) => (
                        <div key={idx} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-white text-sm">
                                You're making progress on <span className="font-bold">{item.habit.name}</span> ({item.completedDays}/{item.totalDays})
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {!showSuggestions && challenged.length > 0 && (
                <button
                    onClick={handleAnalyzeReasons}
                    disabled={challenged.some(p => !missedReasons[p.habit.id])}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                >
                    Get AI Suggestions
                </button>
            )}

            {showSuggestions && (
                <button
                    onClick={handleContinueToAccountability}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                >
                    Continue to Accountability
                </button>
            )}
        </div>
    );
}

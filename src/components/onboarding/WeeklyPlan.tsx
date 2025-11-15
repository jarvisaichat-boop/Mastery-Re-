import { useEffect, useState } from 'react';

interface WeeklyPlanProps {
    data: {
        goal: string;
        distractions: string[];
    };
    onComplete: (habits: Array<{
        name: string;
        description: string;
        frequency: 'daily' | 'weekly';
        type: 'Anchor Habit' | 'Life Goal Habit' | 'Habit';
    }>) => void;
}

const generateHabits = (goal: string, distractions: string[]) => {
    const lowerGoal = goal.toLowerCase();
    const hasTimeDistraction = distractions.includes('social') || 
                               distractions.includes('netflix') || 
                               distractions.includes('news');
    
    const habits = [];

    if (hasTimeDistraction) {
        habits.push({
            name: 'Morning Focus Block',
            description: '30 minutes of focused work before checking phone',
            frequency: 'daily' as const,
            type: 'Anchor Habit' as const,
        });
    } else {
        habits.push({
            name: 'Morning Routine',
            description: 'Start your day with intention',
            frequency: 'daily' as const,
            type: 'Anchor Habit' as const,
        });
    }

    if (lowerGoal.includes('business') || lowerGoal.includes('launch') || lowerGoal.includes('startup')) {
        habits.push({
            name: 'Work on Business',
            description: '1 hour dedicated to building your business',
            frequency: 'daily' as const,
            type: 'Life Goal Habit' as const,
        });
    } else if (lowerGoal.includes('lose') || lowerGoal.includes('weight') || lowerGoal.includes('fit') || lowerGoal.includes('kg')) {
        habits.push({
            name: 'Exercise',
            description: '30 minutes of physical activity',
            frequency: 'daily' as const,
            type: 'Life Goal Habit' as const,
        });
    } else if (lowerGoal.includes('learn') || lowerGoal.includes('code') || lowerGoal.includes('study')) {
        habits.push({
            name: 'Learning Session',
            description: '45 minutes of focused learning',
            frequency: 'daily' as const,
            type: 'Life Goal Habit' as const,
        });
    } else {
        habits.push({
            name: 'Goal Work',
            description: `Make progress on: ${goal}`,
            frequency: 'daily' as const,
            type: 'Life Goal Habit' as const,
        });
    }

    habits.push({
        name: 'Evening Review',
        description: 'Reflect on the day and plan tomorrow',
        frequency: 'daily' as const,
        type: 'Habit' as const,
    });

    return habits;
};

export default function WeeklyPlan({ data, onComplete }: WeeklyPlanProps) {
    const [isGenerating, setIsGenerating] = useState(true);
    const [habits, setHabits] = useState<Array<{
        name: string;
        description: string;
        frequency: 'daily' | 'weekly';
        type: 'Anchor Habit' | 'Life Goal Habit' | 'Habit';
    }>>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const generatedHabits = generateHabits(data.goal, data.distractions);
            setHabits(generatedHabits);
            setIsGenerating(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [data.goal, data.distractions]);

    const handleAccept = () => {
        onComplete(habits);
    };

    if (isGenerating) {
        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="text-center space-y-4">
                    <div className="text-5xl mb-4">📋</div>
                    <h2 className="text-3xl font-bold">Creating Your Plan</h2>
                    <p className="text-xl text-gray-400">Analyzing your goal and generating habits...</p>
                </div>

                <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex gap-1">
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '0ms' }}>●</span>
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '150ms' }}>●</span>
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '300ms' }}>●</span>
                        </div>
                        <span className="text-gray-400">AI is crafting your personalized habits...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold">Your Weekly Plan</h2>
                <p className="text-xl text-gray-400">
                    To achieve: <span className="text-white font-semibold">"{data.goal}"</span>
                </p>
            </div>

            <div className="space-y-4">
                {habits.map((habit, index) => (
                    <div
                        key={index}
                        className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                                        habit.type === 'Anchor Habit' 
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : habit.type === 'Life Goal Habit'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-purple-500/20 text-purple-400'
                                    }`}>
                                        {habit.type}
                                    </span>
                                    <span className="text-xs text-gray-500 uppercase">{habit.frequency}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{habit.name}</h3>
                                <p className="text-gray-400">{habit.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-center text-gray-300">
                    <span className="font-semibold text-white">Commit to these {habits.length} habits</span> for the next 7 days. 
                    We'll check in at the end of the week to see how you did.
                </p>
            </div>

            <div className="text-center">
                <button
                    onClick={handleAccept}
                    className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105"
                >
                    Let's Do This
                </button>
            </div>
        </div>
    );
}

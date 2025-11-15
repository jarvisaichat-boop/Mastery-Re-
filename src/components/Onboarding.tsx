import { useState } from 'react';
import Welcome from './onboarding/Welcome';
import AIInterview from './onboarding/AIInterview';
import Reflection from './onboarding/Reflection';
import GoalContract from './onboarding/GoalContract';
import WeeklyPlan from './onboarding/WeeklyPlan';
import { Habit } from '../types';

interface OnboardingData {
    distractions: string[];
    aspirations: string;
    goal: string;
    suggestedHabits: Array<{
        name: string;
        description: string;
        frequency: 'daily' | 'weekly';
        type: 'Anchor Habit' | 'Life Goal Habit' | 'Habit';
    }>;
}

interface OnboardingProps {
    onComplete: (habits: Omit<Habit, 'id' | 'createdAt'>[], goal: string, aspirations: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        distractions: [],
        aspirations: '',
        goal: '',
        suggestedHabits: [],
    });

    const handleWelcomeComplete = () => {
        setStep(2);
    };

    const handleInterviewComplete = (distractions: string[], aspirations: string) => {
        setData(prev => ({ ...prev, distractions, aspirations }));
        setStep(3);
    };

    const handleReflectionComplete = () => {
        setStep(4);
    };

    const handleGoalComplete = (goal: string) => {
        setData(prev => ({ ...prev, goal }));
        setStep(5);
    };

    const handlePlanComplete = (acceptedHabits: typeof data.suggestedHabits) => {
        const habits: Omit<Habit, 'id' | 'createdAt'>[] = acceptedHabits.map(h => ({
            name: h.name,
            description: h.description,
            color: h.type === 'Anchor Habit' ? 'blue' : h.type === 'Life Goal Habit' ? 'green' : 'purple',
            type: h.type,
            categories: [{ main: 'Personal Development', sub: 'Onboarding' }],
            frequencyType: 'Everyday',
            selectedDays: [],
            timesPerPeriod: 1,
            periodUnit: 'Week',
            repeatDays: 1,
            completed: {},
            order: 0,
        }));
        
        onComplete(habits, data.goal, data.aspirations);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Welcome onNext={handleWelcomeComplete} />;
            case 2:
                return <AIInterview onNext={handleInterviewComplete} />;
            case 3:
                return <Reflection data={data} onNext={handleReflectionComplete} />;
            case 4:
                return <GoalContract data={data} onNext={handleGoalComplete} />;
            case 5:
                return <WeeklyPlan data={data} onComplete={handlePlanComplete} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Progress indicator */}
                <div className="mb-8 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all ${
                                i <= step ? 'bg-blue-500 w-12' : 'bg-gray-700 w-8'
                            }`}
                        />
                    ))}
                </div>

                {renderStep()}
            </div>
        </div>
    );
}

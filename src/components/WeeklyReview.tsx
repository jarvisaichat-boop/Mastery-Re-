import { useState } from 'react';
import { Habit } from '../types';
import KPTAnalysis from './review/KPTAnalysis';
import AccountabilityCheckIn from './review/AccountabilityCheckIn';

interface WeeklyReviewProps {
    habits: Habit[];
    onComplete: (adjustedHabits: Habit[]) => void;
    onClose: () => void;
}

export default function WeeklyReview({ habits, onComplete, onClose }: WeeklyReviewProps) {
    const [step, setStep] = useState<'analysis' | 'accountability'>('analysis');
    const [adjustedHabits, setAdjustedHabits] = useState<Habit[]>(habits);

    const handleAnalysisComplete = (updatedHabits: Habit[]) => {
        setAdjustedHabits(updatedHabits);
        setStep('accountability');
    };

    const handleShareComplete = () => {
        onComplete(adjustedHabits);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-3xl w-full">
                {step === 'analysis' ? (
                    <KPTAnalysis 
                        habits={habits} 
                        onNext={handleAnalysisComplete}
                        onSkip={() => setStep('accountability')}
                    />
                ) : (
                    <AccountabilityCheckIn 
                        habits={adjustedHabits}
                        onComplete={handleShareComplete}
                        onSkip={handleShareComplete}
                    />
                )}
            </div>
        </div>
    );
}

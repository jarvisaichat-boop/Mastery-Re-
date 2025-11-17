import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Target } from 'lucide-react';

interface Phase5NegotiationProps {
  profile: MasteryProfile;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase5Negotiation({ profile, onComplete }: Phase5NegotiationProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  
  // Generate initial habit based on profile
  const generateProposedHabit = () => {
    const goal = profile.northStar || 'your goal';
    const goldenHour = profile.goldenHour || 'morning';
    
    return {
      name: `Deep Work: 45 mins`,
      description: `Focused work session aligned with "${goal}" during your ${goldenHour} golden hour`,
      duration: 45,
      difficulty: 'challenging' as const,
    };
  };

  const [proposedHabit] = useState(generateProposedHabit());
  const [finalDuration, setFinalDuration] = useState(proposedHabit.duration);
  const [accepted, setAccepted] = useState<boolean | null>(null);

  const handleAccept = () => {
    setAccepted(true);
    setCurrentScreen(2);
  };

  const handleTooHard = () => {
    const newDuration = 15;
    setFinalDuration(newDuration);
    setAccepted(true);
    setCurrentScreen(2);
  };

  const handleComplete = () => {
    onComplete({
      proposedHabit: {
        ...proposedHabit,
        duration: finalDuration,
      },
      acceptedHabit: accepted || false,
      finalHabitDuration: finalDuration,
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">The Gap (New Habit Proposal)</h2>
              <p className="text-gray-400">Based on your Goal and Baseline, I propose one new Core Habit</p>
            </div>

            <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{proposedHabit.name}</h3>
                  <p className="text-gray-300">{proposedHabit.description}</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                  {proposedHabit.duration} minutes
                </span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                  Challenging
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTooHard}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium border border-gray-700"
              >
                Too Hard
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-xl"
              >
                Accept
              </button>
            </div>

            {finalDuration < proposedHabit.duration && (
              <div className="p-4 bg-blue-500/20 border border-blue-500/40 rounded-xl text-center">
                <p className="text-blue-300">Downgraded to {finalDuration} mins</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💧</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">The Habit Muscle (Non-Negotiable)</h2>
              <p className="text-gray-400">We need one win that is impossible to fail</p>
            </div>

            <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">💧</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Drink 1 Glass of Water</h3>
                  <p className="text-gray-300 text-sm">The easy win - this is your anchor habit</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                <p className="text-xs text-blue-300 text-center">
                  Fixed | Read-Only | Cannot be removed
                </p>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl"
            >
              Lock These Habits
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Phase 5: The Negotiation</span>
            <span>Screen {currentScreen} of 2</span>
          </div>
        </div>

        {renderScreen()}
      </div>
    </div>
  );
}

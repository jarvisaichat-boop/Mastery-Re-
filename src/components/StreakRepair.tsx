import { useState, useEffect } from 'react';
import { Shield, X, Flame } from 'lucide-react';
import { Habit } from '../types';

interface StreakRepairProps {
  brokenHabits: Array<{ habit: Habit; dateString: string }>;
  onRepairComplete: (habitId: number, dateString: string) => void;
  onDismiss: () => void;
}

export default function StreakRepair({ brokenHabits, onRepairComplete, onDismiss }: StreakRepairProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<'offer' | 'countdown' | 'victory'>('offer');
  const [timeRemaining, setTimeRemaining] = useState(60);

  const currentBroken = brokenHabits[currentIndex];

  useEffect(() => {
    if (step === 'countdown' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'countdown' && timeRemaining === 0) {
      setStep('victory');
    }
  }, [step, timeRemaining]);

  const handleComplete = () => {
    onRepairComplete(currentBroken.habit.id, currentBroken.dateString);
    
    // Move to next broken habit or dismiss
    if (currentIndex < brokenHabits.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStep('offer');
      setTimeRemaining(60);
    } else {
      onDismiss();
    }
  };

  if (step === 'offer') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg max-w-md w-full p-8 relative border border-orange-500">
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <Flame className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-orange-400">Streak Repair</h2>
            <h3 className="text-xl font-semibold mb-2">{currentBroken.habit.name}</h3>
            <p className="text-gray-300 mb-4">
              You missed yesterday. Do a 60-second action RIGHT NOW to save your streak.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Habit #{currentIndex + 1} of {brokenHabits.length}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onDismiss}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => setStep('countdown')}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors"
              >
                Repair Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'countdown') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-orange-400 mb-4">
            {timeRemaining}
          </div>
          <p className="text-2xl text-gray-400">Saving your streak...</p>
        </div>
      </div>
    );
  }

  if (step === 'victory') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-900 to-orange-600 z-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6">🔥</div>
          <h2 className="text-4xl font-bold text-white mb-4">STREAK SAVED!</h2>
          <p className="text-xl text-orange-100 mb-8">
            You showed up when it mattered. That's discipline.
          </p>
          
          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-white text-orange-700 font-bold text-lg rounded-lg hover:bg-orange-50 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}

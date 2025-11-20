import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

interface EmergencyHabitActionProps {
  habitName: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function EmergencyHabitAction({ habitName, onComplete, onCancel }: EmergencyHabitActionProps) {
  const [step, setStep] = useState<'ready' | 'countdown' | 'victory'>('ready');
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    if (step === 'countdown' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'countdown' && timeRemaining === 0) {
      setStep('victory');
    }
  }, [step, timeRemaining]);

  if (step === 'ready') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg max-w-md w-full p-8 relative border border-red-500">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-400">Emergency Mode</h2>
            <h3 className="text-xl font-semibold mb-4">{habitName}</h3>
            <p className="text-gray-300 mb-6">
              Just 60 seconds. Don't overthink it. Action beats perfection.
            </p>
            
            <button
              onClick={() => setStep('countdown')}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-lg transition-colors"
            >
              Start 60s Action
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'countdown') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-red-400 mb-4">
            {timeRemaining}
          </div>
          <p className="text-2xl text-gray-400">Keep going...</p>
        </div>
      </div>
    );
  }

  if (step === 'victory') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-900 to-green-600 z-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4">YOU SHOWED UP!</h2>
          <p className="text-xl text-green-100 mb-8">
            That's all that matters. Every action counts.
          </p>
          
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-white text-green-700 font-bold text-lg rounded-lg hover:bg-green-50 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    );
  }

  return null;
}

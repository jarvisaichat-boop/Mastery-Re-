import { useState, useEffect } from 'react';
import { Sparkles, Timer, CheckCircle, Rocket, X } from 'lucide-react';

interface MicroWinProtocolProps {
  habit: {
    name: string;
    description: string;
  };
  aiPersona?: string;
  onComplete: () => void;
  isPreview?: boolean;
  onDismiss?: () => void;
}

export default function MicroWinProtocol({ habit, aiPersona, onComplete, isPreview = false, onDismiss }: MicroWinProtocolProps) {
  const [step, setStep] = useState(1);
  const [microAction, setMicroAction] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [missionCompleted, setMissionCompleted] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimerCompleted(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timeRemaining]);

  // Auto-advance to victory screen when timer expires
  useEffect(() => {
    if (timerCompleted && step === 5) {
      setStep(6);
    }
  }, [timerCompleted, step]);

  const handleMissionComplete = () => {
    setMissionCompleted(true);
    setTimerActive(false);
    setStep(6);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        // Education: The Micro-Win
        return (
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
              <h1 className="text-4xl font-bold text-white">The Micro-Win</h1>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">1. Definition</h2>
                  <p className="text-gray-300 text-lg">
                    A version of your habit so small, it is impossible to fail.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-2">2. The Benefit</h2>
                  <p className="text-gray-300 text-lg">
                    It tricks your brain into starting. Once you start, the friction is gone. Action creates dopamine, not the other way around.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold rounded-xl transition-all transform hover:scale-105"
            >
              Define My Micro-Win
            </button>
          </div>
        );

      case 2:
        // Instruction: Shrink the habit
        return (
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">Shrink It Down</h1>
              <p className="text-gray-400 text-lg">
                I want you to shrink this habit until it fits into exactly 60 Seconds.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Your Core Habit</p>
                <p className="text-xl text-white font-bold">{habit.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Example:</p>
                <p className="text-gray-300">"Go to Gym" → "Put on shoes"</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-400">Your 60-Second Micro-Action</label>
              <input
                type="text"
                value={microAction}
                onChange={(e) => setMicroAction(e.target.value)}
                placeholder="e.g., Put on shoes"
                className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white text-lg placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!microAction.trim()}
              className={`w-full px-8 py-4 rounded-xl text-xl font-bold transition-all ${
                microAction.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transform hover:scale-105'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        );

      case 3:
        // Consensus: Commitment
        return (
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">Your Micro-Win</h1>
            </div>

            <div className="bg-gray-900/50 border-2 border-purple-500/50 rounded-2xl p-8">
              <p className="text-2xl text-center text-white font-bold">
                "{microAction}"
              </p>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-2xl font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              I am gonna do it!
            </button>
          </div>
        );

      case 4:
        // Trigger: Start Timer
        return (
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-4">
              <Timer className="w-20 h-20 text-blue-400 mx-auto" />
              <h1 className="text-3xl font-bold text-white">Great.</h1>
              <p className="text-xl text-gray-300">
                Set the clock for 60 seconds. Start when you are ready.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
              <p className="text-center text-gray-400">
                Your Micro-Win: <span className="text-white font-bold">"{microAction}"</span>
              </p>
            </div>

            <button
              onClick={() => {
                setTimerActive(true);
                setStep(5);
              }}
              className="w-full px-12 py-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white text-3xl font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
            >
              START TIMER
            </button>
          </div>
        );

      case 5:
        // Execution: Timer Running (Full-Screen)
        return (
          <div className="fixed inset-0 z-[60] bg-gradient-to-br from-red-950 via-black to-red-950 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8 animate-fadeIn">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="text-9xl font-bold text-red-400 animate-pulse">
                    {timeRemaining}
                  </div>
                  <p className="text-gray-400 text-xl mt-4">seconds remaining</p>
                </div>

                <div className="bg-black/50 border-2 border-red-500/50 rounded-2xl p-6">
                  <p className="text-white text-xl">
                    <span className="text-red-400 font-bold">NOW:</span> {microAction}
                  </p>
                </div>
              </div>

              <button
                onClick={handleMissionComplete}
                className="w-full px-12 py-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-3xl font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl animate-pulse"
              >
                MISSION COMPLETE!
              </button>
            </div>
          </div>
        );

      case 6:
        // Victory: Success Screen
        const isTimerExpired = timerCompleted && !missionCompleted;
        
        return (
          <div className="bg-gradient-to-br from-green-950 via-emerald-900 to-green-950 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-6">
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
              
              {isTimerExpired ? (
                <>
                  <h1 className="text-4xl font-bold text-white">Time is up! And You still win!!</h1>
                  <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-8 space-y-4">
                    <p className="text-xl text-gray-200">
                      This is the principle of the Micro-Win: Success is measured by Action, not Duration.
                    </p>
                    <p className="text-xl text-gray-200">
                      You defeated the inertia. You successfully tricked your brain into starting. The habit is now alive. Great work.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-white">Mission Complete!</h1>
                  <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-8">
                    <p className="text-xl text-gray-200">
                      You proved you can execute. Momentum secured. The habit is alive.
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setStep(7)}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xl font-bold rounded-xl transition-all transform hover:scale-105"
            >
              {isTimerExpired ? 'Enter The Dojo' : 'Continue'}
            </button>
          </div>
        );

      case 7:
        // Momentum Push
        return (
          <div className="bg-gradient-to-br from-gray-950 via-purple-900 to-gray-950 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-6">
              <Rocket className="w-20 h-20 text-purple-400 mx-auto" />
              <h1 className="text-3xl font-bold text-white">
                Hey, you already started your action!
              </h1>
              <p className="text-2xl text-gray-300">
                So why not continue or go do some more!
              </p>
            </div>

            <div className="bg-purple-900/30 border border-purple-500/50 rounded-2xl p-6">
              <p className="text-center text-gray-300 text-lg">
                You've broken through the inertia. The hardest part is done. Momentum is on your side now.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-2xl font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Enter The Dojo
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Step 5 (timer execution) is full-screen, others are modal overlays
  const isFullScreen = step === 5;

  if (isFullScreen) {
    return renderStep();
  }

  // Modal overlay for steps 1-4, 6-7
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button for preview mode */}
        {isPreview && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
}

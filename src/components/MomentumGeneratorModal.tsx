import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Habit, ContentLibraryItem } from '../types';
import { formatDate } from '../utils';

interface MomentumGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  goal: string;
  contentLibrary: ContentLibraryItem[];
  onAddContentLibrary?: () => void;
  isCompletedToday: boolean;
}

type Step = 'streak' | 'vision' | 'content' | 'question' | 'habits' | 'pledge' | 'launch';

export const MomentumGeneratorModal: React.FC<MomentumGeneratorModalProps> = ({
  isOpen,
  onClose,
  habits,
  goal,
  contentLibrary,
  onAddContentLibrary,
  isCompletedToday,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('streak');
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(new Set());
  const [pledgeProgress, setPledgeProgress] = useState(0);
  const [launchCountdown, setLaunchCountdown] = useState(60);
  const [launchActive, setLaunchActive] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  const lifeGoals = habits.filter(h => h.type === 'Life Goal Habit');
  const currentStreak = calculateStreak();
  const content = contentLibrary.length > 0 ? contentLibrary[Math.floor(Math.random() * contentLibrary.length)] : null;

  function calculateStreak(): number {
    if (habits.length === 0) return 0;
    const sorted = [...habits].sort((a, b) => {
      const aCompletions = Object.values(a.completed).filter(v => v === true).length;
      const bCompletions = Object.values(b.completed).filter(v => v === true).length;
      return bCompletions - aCompletions;
    });
    
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = formatDate(checkDate, 'yyyy-MM-dd');
      const hasCompletion = sorted.some(h => h.completed[dateStr] === true);
      if (!hasCompletion) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  }

  // Pledge interaction handler
  useEffect(() => {
    if (currentStep !== 'pledge') return;

    const handleMouseDown = () => {
      setPledgeProgress(0);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / 3000) * 100, 100);
        setPledgeProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          // Vibration + screen flash
          if (navigator.vibrate) {
            navigator.vibrate([50, 30, 100, 30, 200]);
          }
          setShakeScreen(true);
          setTimeout(() => {
            setShakeScreen(false);
            setCurrentStep('launch');
          }, 800);
        }
      }, 10);

      const handleMouseUp = () => {
        clearInterval(interval);
      };

      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        clearInterval(interval);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [currentStep]);

  // Launch countdown
  useEffect(() => {
    if (currentStep !== 'launch' || !launchActive) return;

    const interval = setInterval(() => {
      setLaunchCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-close after countdown
          setTimeout(() => {
            onClose();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, launchActive, onClose]);

  // Auto-advance through steps
  const handleNextStep = () => {
    const steps: Step[] = ['streak', 'vision', 'content', 'question', 'habits', 'pledge', 'launch'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  if (!isOpen) return null;

  // Step 1: Streak Card
  if (currentStep === 'streak') {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="text-8xl font-black text-yellow-400 mb-4">
              {currentStreak}
            </div>
            <div className="text-4xl font-bold text-white mb-4">DAYS</div>
            <div className="text-2xl text-gray-300 mb-8">The chain is unbroken.</div>
          </div>
          <button
            onClick={handleNextStep}
            className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 flex items-center justify-center mx-auto gap-2"
          >
            Continue <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Grand Vision
  if (currentStep === 'vision') {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="text-3xl font-bold text-white mb-4">Your North Star</div>
            <div className="text-5xl font-black text-blue-400">{goal}</div>
            <div className="text-lg text-gray-300 mt-6">This is where today takes you.</div>
          </div>
          <button
            onClick={handleNextStep}
            className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 flex items-center justify-center mx-auto gap-2"
          >
            Continue <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Motivational Content
  if (currentStep === 'content') {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 w-full">
          {content ? (
            <>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src={`${content.youtubeUrl}?autoplay=1`}
                  title={content.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="text-white mb-6">
                <h3 className="text-2xl font-bold mb-2">{content.title}</h3>
                <p className="text-gray-400">{content.duration} min watch</p>
              </div>
              <button
                onClick={handleNextStep}
                className="px-8 py-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={24} />
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-white mb-4">No content in library yet</p>
              <button
                onClick={onAddContentLibrary}
                className="px-8 py-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600"
              >
                Add Content
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 4: Question
  if (currentStep === 'question') {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              {content?.question || 'How will you apply this lesson today?'}
            </h3>
            <textarea
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Your answer..."
              className="w-full h-32 bg-gray-800 text-white rounded-lg p-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-gray-400 text-sm mt-2">Minimum 1 sentence</p>
          </div>
          <button
            onClick={handleNextStep}
            disabled={userQuestion.trim().length === 0}
            className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Habit Selection
  if (currentStep === 'habits') {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto w-full">
          <h3 className="text-2xl font-bold text-white mb-6">Select Your Habits</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {lifeGoals.map(habit => (
              <div key={habit.id} className="bg-gray-800 rounded-lg p-4">
                <button
                  onClick={() => {
                    const newSet = new Set(selectedHabits);
                    if (newSet.has(habit.id)) {
                      newSet.delete(habit.id);
                    } else {
                      newSet.add(habit.id);
                    }
                    setSelectedHabits(newSet);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedHabits.has(habit.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-600'
                      }`}
                    >
                      {selectedHabits.has(habit.id) && <span className="text-white">✓</span>}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{habit.name}</p>
                      <p className="text-gray-400 text-sm">{habit.description}</p>
                      {habit.microWins && habit.microWins.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {habit.microWins.slice(0, 2).map(mw => (
                            <p key={mw.id} className="text-xs text-gray-500">
                              • {mw.description}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleNextStep}
            disabled={selectedHabits.size === 0}
            className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Step 6: Pledge
  if (currentStep === 'pledge') {
    return (
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center transition-transform ${
          shakeScreen ? 'animate-pulse' : ''
        }`}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">The Pledge</h3>
          <div className="text-6xl mb-12 cursor-pointer select-none">👇</div>
          <p className="text-white mb-4">Hold down for 3 seconds to lock in</p>
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${pledgeProgress}%` }}
            />
          </div>
          {pledgeProgress < 100 && (
            <p className="text-gray-400 text-sm">{Math.round(pledgeProgress)}%</p>
          )}
          {pledgeProgress === 100 && <p className="text-green-400 text-lg font-bold">LOCKED ✓</p>}
        </div>
      </div>
    );
  }

  // Step 7: Launch
  if (currentStep === 'launch') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {!launchActive ? (
          <div className="text-center px-4">
            <div className="text-8xl mb-8">🚀</div>
            <h3 className="text-4xl font-black text-white mb-8">INITIATE SEQUENCE</h3>
            <p className="text-xl text-gray-400 mb-12 max-w-md mx-auto">
              You have 60 seconds to change your state. Break the stasis. Bathroom. Water. Shoes. Move...
            </p>
            <button
              onClick={() => setLaunchActive(true)}
              className="px-12 py-6 bg-red-600 text-white font-black text-2xl rounded-lg hover:bg-red-700"
            >
              START COUNTDOWN
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-9xl font-black text-red-500 font-mono mb-12">
              {launchCountdown}
            </div>
            <p className="text-2xl text-white">GET READY...</p>
          </div>
        )}
      </div>
    );
  }

  // Come back tomorrow modal
  if (isCompletedToday) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-3xl font-bold text-white mb-4">Already Launched Today</h3>
          <p className="text-gray-400 mb-8">Consistency is sacred. Come back tomorrow to ignite again.</p>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
};

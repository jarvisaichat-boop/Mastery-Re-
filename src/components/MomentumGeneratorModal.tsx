import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Target, Zap } from 'lucide-react';
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
  const [stepVisible, setStepVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentLibraryItem | null>(null);

  const lifeGoals = habits.filter(h => h.type === 'Life Goal Habit');
  const currentStreak = calculateStreak();
  
  // Lock in content selection when modal opens
  useEffect(() => {
    if (isOpen && contentLibrary.length > 0 && !selectedContent) {
      const randomContent = contentLibrary[Math.floor(Math.random() * contentLibrary.length)];
      setSelectedContent(randomContent);
    } else if (!isOpen) {
      // Reset when modal closes
      setSelectedContent(null);
      setCurrentStep('streak');
      setUserQuestion('');
      setSelectedHabits(new Set());
      setPledgeProgress(0);
      setLaunchCountdown(60);
      setLaunchActive(false);
    }
  }, [isOpen, contentLibrary, selectedContent]);
  
  const content = selectedContent;

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

  // Fade in animation on step change
  useEffect(() => {
    setStepVisible(false);
    const timer = setTimeout(() => setStepVisible(true), 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

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

  const handleNextStep = () => {
    const steps: Step[] = ['streak', 'vision', 'content', 'question', 'habits', 'pledge', 'launch'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  if (!isOpen) return null;

  // "Come back tomorrow" screen
  if (isCompletedToday) {
    return (
      <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="mb-8 animate-scaleIn">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50">
              <Sparkles size={64} className="text-white" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-white mb-4 tracking-tight" style={{textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'}}>
            Mission Complete
          </h3>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            You've already ignited today. <br/>
            Consistency is sacred. Return tomorrow to launch again.
          </p>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Streak Card
  if (currentStep === 'streak') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className={`text-center max-w-3xl mx-auto px-6 transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="mb-12">
            <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 mb-6 animate-pulse" 
                 style={{textShadow: '0 0 80px rgba(251, 191, 36, 0.6)'}}>
              {currentStreak}
            </div>
            <div className="text-5xl font-bold text-white mb-6 tracking-wider" style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'}}>
              DAYS
            </div>
            <div className="text-2xl text-gray-400 font-light tracking-wide">
              The chain is unbroken
            </div>
          </div>
          <button
            onClick={handleNextStep}
            className="group px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-2xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Continue
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Grand Vision
  if (currentStep === 'vision') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center">
        <div className={`text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="mb-12">
            <div className="mb-8 flex justify-center">
              <Target size={64} className="text-blue-400 animate-pulse" style={{filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))'}} />
            </div>
            <h3 className="text-3xl font-bold text-blue-400 mb-8 tracking-wide uppercase">Your North Star</h3>
            <div className="text-6xl font-black text-white leading-tight tracking-tight" style={{textShadow: '0 0 40px rgba(59, 130, 246, 0.4)'}}>
              {goal}
            </div>
            <div className="text-xl text-gray-400 mt-10 font-light">
              This is where today takes you.
            </div>
          </div>
          <button
            onClick={handleNextStep}
            className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Continue
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Motivational Content
  if (currentStep === 'content') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center p-6">
        <div className={`max-w-5xl mx-auto w-full transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {content ? (
            <>
              <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-purple-500/30 border border-gray-800" style={{boxShadow: '0 0 80px rgba(168, 85, 247, 0.3)'}}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`${content.youtubeUrl}?autoplay=1&controls=1&modestbranding=1`}
                  title={content.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-3">{content.title}</h3>
                <p className="text-gray-400 text-lg">{content.duration} min • Daily Intel</p>
              </div>
              <button
                onClick={handleNextStep}
                className="group px-10 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/50 flex items-center justify-center mx-auto gap-3"
              >
                Continue
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-white text-xl mb-6">No content in library yet</p>
              <button
                onClick={onAddContentLibrary}
                className="px-10 py-5 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all"
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
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-6">
        <div className={`max-w-3xl mx-auto w-full transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-white mb-8 text-center leading-relaxed">
              {content?.question || 'How will you apply this lesson today?'}
            </h3>
            <textarea
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Type your answer..."
              className="w-full h-48 bg-gray-900/50 border-2 border-gray-700 focus:border-green-500 text-white text-lg rounded-2xl p-6 placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none"
              style={{boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'}}
            />
            <p className="text-gray-500 text-sm mt-3 text-center">Minimum 1 sentence required</p>
          </div>
          <button
            onClick={handleNextStep}
            disabled={userQuestion.trim().length === 0}
            className="group px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-green-600 hover:to-green-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-green-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Continue
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Habit Selection
  if (currentStep === 'habits') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-cyan-950 to-black flex items-center justify-center p-6">
        <div className={`max-w-4xl mx-auto w-full transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-4xl font-bold text-white mb-10 text-center tracking-tight">Choose Your Path</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-10 pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-gray-900">
            {lifeGoals.map(habit => (
              <button
                key={habit.id}
                onClick={() => {
                  const newSet = new Set(selectedHabits);
                  if (newSet.has(habit.id)) {
                    newSet.delete(habit.id);
                  } else {
                    newSet.add(habit.id);
                  }
                  setSelectedHabits(newSet);
                }}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-102 ${
                  selectedHabits.has(habit.id)
                    ? 'bg-cyan-900/30 border-cyan-500 shadow-xl shadow-cyan-500/30'
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center mt-1 transition-all ${
                    selectedHabits.has(habit.id)
                      ? 'bg-cyan-500 border-cyan-500'
                      : 'border-gray-600'
                  }`}>
                    {selectedHabits.has(habit.id) && <span className="text-white font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-xl mb-2">{habit.name}</p>
                    <p className="text-gray-400 text-sm mb-3">{habit.description}</p>
                    {habit.microWins && habit.microWins.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {habit.microWins.slice(0, 2).map(mw => (
                          <p key={mw.id} className="text-xs text-cyan-400 flex items-center gap-2">
                            <Zap size={12} />
                            {mw.description}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleNextStep}
            disabled={selectedHabits.size === 0}
            className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-lg rounded-2xl hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Lock In Selection
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 6: Pledge
  if (currentStep === 'pledge') {
    return (
      <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-all duration-300 ${shakeScreen ? 'animate-pulse' : ''}`}>
        <div className={`text-center transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-4xl font-black text-white mb-16 tracking-wide uppercase" style={{textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'}}>
            The Pledge
          </h3>
          <div className="mb-16 cursor-pointer select-none">
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative shadow-2xl"
                 style={{boxShadow: `0 0 ${pledgeProgress}px rgba(168, 85, 247, 0.8)`}}>
              <div className="text-8xl animate-pulse">👇</div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - pledgeProgress / 100)}`}
                  className="transition-all duration-100"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <p className="text-white text-xl mb-6 font-light">Hold down for 3 seconds to lock in</p>
          <div className="text-3xl font-bold">
            {pledgeProgress < 100 ? (
              <span className="text-gray-400">{Math.round(pledgeProgress)}%</span>
            ) : (
              <span className="text-green-400 animate-pulse" style={{textShadow: '0 0 20px rgba(34, 197, 94, 0.8)'}}>LOCKED ✓</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 7: Launch
  if (currentStep === 'launch') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {!launchActive ? (
          <div className={`text-center px-6 transition-all duration-1000 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-9xl mb-12 animate-bounce">🚀</div>
            <h3 className="text-6xl font-black text-white mb-10 tracking-tight uppercase" style={{textShadow: '0 0 40px rgba(255, 255, 255, 0.4)'}}>
              Initiate Sequence
            </h3>
            <p className="text-2xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              You have 60 seconds to change your state.<br/>
              Break the stasis. Bathroom. Water. Shoes. Move.
            </p>
            <button
              onClick={() => setLaunchActive(true)}
              className="px-16 py-8 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-3xl rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 shadow-2xl shadow-red-600/50 uppercase tracking-wider"
            >
              Start Countdown
            </button>
          </div>
        ) : (
          <div className="text-center animate-pulse">
            <div className={`text-[12rem] font-black font-mono mb-16 transition-all duration-300 ${
              launchCountdown <= 10 ? 'text-red-500' : 'text-red-400'
            }`} style={{textShadow: `0 0 ${launchCountdown <= 10 ? '100px' : '60px'} rgba(239, 68, 68, 0.8)`}}>
              {launchCountdown}
            </div>
            <p className={`text-3xl font-bold transition-all ${
              launchCountdown <= 10 ? 'text-white animate-bounce' : 'text-gray-400'
            }`}>
              {launchCountdown <= 10 ? 'GO NOW!' : 'GET READY...'}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Target } from 'lucide-react';
import { Habit, ContentLibraryItem } from '../types';
import { formatDate } from '../utils';

interface MomentumGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  habits: Habit[];
  goal: string;
  aspirations: string;
  contentLibrary: ContentLibraryItem[];
  onAddContentLibrary?: () => void;
  isCompletedToday: boolean;
}

type Step = 'streak' | 'vision' | 'content' | 'question' | 'habits' | 'pledge' | 'launch';

export const MomentumGeneratorModal: React.FC<MomentumGeneratorModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  habits,
  goal,
  aspirations,
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
  const [videoRating, setVideoRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');

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

  // Slow fade in animation on step change (500-800ms for gravity)
  useEffect(() => {
    setStepVisible(false);
    const timer = setTimeout(() => setStepVisible(true), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Pledge interaction handler
  useEffect(() => {
    if (currentStep !== 'pledge') {
      setPledgeProgress(0);
      return;
    }

    let interval: number | null = null;

    const handleMouseDown = () => {
      setPledgeProgress(0);
      const startTime = Date.now();
      
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / 3000) * 100, 100);
        setPledgeProgress(progress);

        if (progress >= 100 && interval) {
          clearInterval(interval);
          interval = null;
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
    };

    const handleMouseUp = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      // Don't reset progress here - let it show LOCKED ✓ before transitioning
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentStep]);

  // Launch countdown
  useEffect(() => {
    if (currentStep !== 'launch' || !launchActive) return;

    const interval = setInterval(() => {
      setLaunchCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          setTimeout(() => {
            onClose();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, launchActive, onClose, onComplete]);

  const handleNextStep = () => {
    const steps: Step[] = ['streak', 'vision', 'content', 'question', 'habits', 'pledge', 'launch'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      // Use setTimeout to avoid setState during render
      requestAnimationFrame(() => {
        setStepVisible(false);
        setTimeout(() => {
          setCurrentStep(steps[currentIndex + 1]);
        }, 400);
      });
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

  // Step 1: Streak Card with Confetti
  if (currentStep === 'streak') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                width: '10px',
                height: '10px',
                backgroundColor: ['#FDE047', '#FB923C', '#FBBF24', '#F59E0B'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
        
        {/* Premium 3D Card */}
        <div className={`relative transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl max-w-2xl mx-6"
               style={{
                 boxShadow: '0 0 60px rgba(251, 191, 36, 0.4), inset 0 2px 20px rgba(0, 0, 0, 0.5)',
                 transform: 'perspective(1000px) rotateX(2deg)',
               }}>
            <div className="text-center">
              <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 mb-4 animate-pulse" 
                   style={{textShadow: '0 0 80px rgba(251, 191, 36, 0.8)'}}>
                {currentStreak}
              </div>
              <div className="text-6xl font-bold text-yellow-400 mb-4 tracking-wider">
                DAY STREAK!! 🔥
              </div>
              <div className="text-2xl text-yellow-200/80 font-light tracking-wide">
                The chain is unbroken
              </div>
            </div>
          </div>
          
          {/* Continue Button Below Card */}
          <button
            onClick={handleNextStep}
            className="group mt-8 px-12 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Continue
            <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Your North Star with Aspirations
  if (currentStep === 'vision') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className={`max-w-4xl mx-auto px-6 transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl"
               style={{boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 2px 20px rgba(0, 0, 0, 0.5)'}}>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Target size={56} className="text-yellow-400 animate-pulse" style={{filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))'}} />
              </div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-8 tracking-wide uppercase">Your North Star</h3>
              
              {/* Goal Section with Label */}
              <div className="mb-8">
                <div className="text-lg text-yellow-400/80 font-semibold mb-3 uppercase tracking-wider">Goal:</div>
                <div className="text-5xl font-black text-white leading-tight tracking-tight" style={{textShadow: '0 0 40px rgba(251, 191, 36, 0.3)'}}>
                  {goal}
                </div>
              </div>
              
              {/* Grand Vision Section */}
              {aspirations && (
                <div className="mt-10 p-8 bg-gradient-to-br from-yellow-500/15 to-orange-500/10 border-2 border-yellow-500/40 rounded-2xl">
                  <div className="text-xl text-yellow-300 font-bold mb-4 uppercase tracking-wide">Your Vision</div>
                  <p className="text-2xl text-yellow-50 leading-relaxed font-light">
                    {aspirations}
                  </p>
                </div>
              )}
              
              <div className="text-xl text-gray-400 mt-10 font-light italic">
                This is where today takes you.
              </div>
            </div>
          </div>
          
          <button
            onClick={handleNextStep}
            className="group mt-8 px-12 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Continue
            <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Motivational Content
  if (currentStep === 'content') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className={`max-w-5xl mx-auto w-full transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          {content ? (
            <>
              <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-8 shadow-2xl border-2 border-yellow-500/30" style={{boxShadow: '0 0 80px rgba(251, 191, 36, 0.2)'}}>
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
                className="group px-12 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center mx-auto gap-3"
              >
                Continue
                <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-white text-xl mb-6">No content in library yet</p>
              <button
                onClick={onAddContentLibrary}
                className="px-10 py-5 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-600 transition-all"
              >
                Add Content
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 4: Question with Video Rating
  if (currentStep === 'question') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className={`max-w-3xl mx-auto w-full transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          {/* Video Rating Section */}
          <div className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/30 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-yellow-400 mb-4 text-center">Rate this video</h4>
            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setVideoRating(star);
                    setShowFeedback(star <= 2);
                  }}
                  className="text-5xl hover:scale-125 transition-transform duration-200"
                >
                  {star <= videoRating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            {/* Feedback Form for Low Ratings */}
            {showFeedback && videoRating <= 2 && (
              <div className="mt-6 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                <p className="text-white font-semibold mb-4">Help us improve - what went wrong?</p>
                <div className="space-y-2 mb-4">
                  {['Not my kind of video', 'Too long', 'Not relevant', 'Poor quality'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setFeedbackReason(reason)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        feedbackReason === reason
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Additional comments (optional)"
                  className="w-full h-24 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-3 placeholder-gray-500 resize-none"
                />
              </div>
            )}
          </div>
          
          {/* Question Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center leading-relaxed">
              How will you apply this lesson today to your goals and habits?
            </h3>
            <textarea
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Type your answer..."
              className="w-full h-40 bg-gray-900/50 border-2 border-gray-700 focus:border-yellow-500 text-white text-lg rounded-2xl p-6 placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none"
              style={{boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'}}
            />
            <p className="text-gray-500 text-sm mt-3 text-center">Minimum 1 sentence required</p>
          </div>
          <button
            onClick={handleNextStep}
            disabled={userQuestion.trim().length === 0}
            className="group px-12 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Continue
            <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Life Goal Habit Cards
  if (currentStep === 'habits') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className={`max-w-5xl mx-auto w-full transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <h3 className="text-4xl font-bold text-yellow-400 mb-10 text-center tracking-tight">Which habits will you do now?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
                className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedHabits.has(habit.id)
                    ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500 shadow-2xl'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-yellow-500/50'
                }`}
                style={{
                  boxShadow: selectedHabits.has(habit.id) 
                    ? '0 0 40px rgba(251, 191, 36, 0.4)' 
                    : 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedHabits.has(habit.id)
                    ? 'bg-yellow-500 border-yellow-500 scale-110'
                    : 'border-gray-600'
                }`}>
                  {selectedHabits.has(habit.id) && <span className="text-black font-black text-lg">✓</span>}
                </div>
                
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-2xl"
                       style={{backgroundColor: habit.color}}>
                    ⚡
                  </div>
                  <p className="text-white font-bold text-lg mb-2">{habit.name}</p>
                  <p className="text-gray-400 text-sm">{habit.description}</p>
                </div>
                
                {/* Micro Wins - Expandable */}
                {habit.microWins && habit.microWins.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-yellow-400 font-semibold text-xs mb-2">Micro-Wins:</p>
                    <div className="space-y-1">
                      {habit.microWins.slice(0, 3).map(mw => (
                        <div key={mw.id} className="flex items-start gap-2">
                          <Sparkles size={10} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-300">{mw.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextStep}
            disabled={selectedHabits.size === 0}
            className="group px-12 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center mx-auto gap-3"
          >
            Lock In Selection
            <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Step 6: Mission Briefing Card
  if (currentStep === 'pledge') {
    return (
      <div className={`fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center transition-all duration-300 ${shakeScreen ? 'animate-pulse' : ''}`}>
        <div className={`max-w-2xl mx-6 transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl"
               style={{boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 2px 20px rgba(0, 0, 0, 0.5)'}}>
            <h3 className="text-4xl font-black text-yellow-400 mb-12 text-center tracking-wide uppercase" style={{textShadow: '0 0 30px rgba(251, 191, 36, 0.5)'}}>
              Mission Briefing
            </h3>
            <div className="mb-12 cursor-pointer select-none">
              <div className="w-52 h-52 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center relative shadow-2xl"
                   style={{boxShadow: `0 0 ${Math.max(40, pledgeProgress)}px rgba(251, 191, 36, ${0.4 + pledgeProgress / 200})`}}>
                <div className="text-9xl animate-pulse">👇</div>
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="104"
                    cy="104"
                    r="96"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="104"
                    cy="104"
                    r="96"
                    stroke="url(#pledgeGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 96}`}
                    strokeDashoffset={`${2 * Math.PI * 96 * (1 - pledgeProgress / 100)}`}
                    className="transition-all duration-100"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="pledgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-white text-2xl mb-4 font-light text-center">Hold down for 3 seconds</p>
            <p className="text-yellow-400 text-lg mb-8 text-center italic">Lock in your commitment</p>
            <div className="text-4xl font-bold text-center">
              {pledgeProgress < 100 ? (
                <span className="text-yellow-400">{Math.round(pledgeProgress)}%</span>
              ) : (
                <span className="text-yellow-400 animate-pulse" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'}}>LOCKED ✓</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 7: Launch with Rocket Animation
  if (currentStep === 'launch') {
    const rocketProgress = launchActive ? ((60 - launchCountdown) / 60) * 100 : 0;
    
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        {!launchActive ? (
          <div className={`max-w-2xl mx-6 transition-all duration-1200 ${stepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl text-center"
                 style={{boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 2px 20px rgba(0, 0, 0, 0.5)'}}>
              <div className="text-9xl mb-8 animate-bounce">🚀</div>
              <h3 className="text-5xl font-black text-yellow-400 mb-8 tracking-tight uppercase" style={{textShadow: '0 0 40px rgba(251, 191, 36, 0.5)'}}>
                Initiate Sequence
              </h3>
              <p className="text-xl text-gray-300 mb-12 max-w-xl mx-auto leading-relaxed font-light">
                You have 60 seconds to change your state.<br/>
                Break the stasis. Bathroom. Water. Shoes. Move.
              </p>
              <button
                onClick={() => setLaunchActive(true)}
                className="px-16 py-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-black text-3xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 uppercase tracking-wider"
              >
                Start Countdown
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Rocket Animation - Rises vertically */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-linear text-8xl"
              style={{
                bottom: `${rocketProgress}%`,
                filter: `drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))`,
              }}
            >
              🚀
            </div>
            
            {/* Smoke Trail */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-full pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 transform -translate-x-1/2 rounded-full bg-gray-500/30 blur-xl animate-smoke"
                  style={{
                    bottom: `${(i * 10)}%`,
                    width: `${40 + i * 8}px`,
                    height: `${40 + i * 8}px`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: Math.max(0, 1 - i * 0.1),
                  }}
                />
              ))}
            </div>
            
            {/* Countdown Display */}
            <div className="relative z-10 text-center">
              <div className="animate-pulse">
                <div className={`text-[12rem] font-black font-mono mb-8 transition-all duration-300 ${
                  launchCountdown <= 10 ? 'text-yellow-400' : 'text-yellow-500'
                }`} style={{textShadow: `0 0 ${launchCountdown <= 10 ? '100px' : '60px'} rgba(251, 191, 36, 0.8)`}}>
                  {launchCountdown}
                </div>
                <p className={`text-5xl font-black transition-all mb-4 ${
                  launchCountdown <= 10 ? 'text-white animate-bounce' : 'text-yellow-400'
                }`} style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'}}>
                  LAUNCH!!
                </p>
                <p className={`text-2xl font-semibold ${launchCountdown <= 10 ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}>
                  Break the stasis NOW!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (navigator.vibrate) {
                  navigator.vibrate(200);
                }
                onComplete();
                setTimeout(onClose, 500);
              }}
              className="absolute bottom-12 px-8 py-3 bg-gray-800/80 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-700/80 hover:text-white transition-all duration-300 text-sm z-20"
            >
              Skip / I'm Ready Now
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

import { logger } from "../utils/logger";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Sparkles, Target } from 'lucide-react';
import { Habit, ContentLibraryItem } from '../types';
import { formatDate } from '../utils';
import { addToWatchHistory } from '../utils/videoRecommendation';

// YouTube Player TypeScript declaration
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MomentumGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onShowFloatingGo: () => void;
  habits: Habit[];
  goal: string;
  aspirations: string;
  todaysContent: ContentLibraryItem;
  onAddContentLibrary?: () => void;
  isCompletedToday: boolean;
  showSeizeTheDayPopup?: boolean;
}

type Step = 'streak' | 'vision' | 'content' | 'goal-selection' | 'habits' | 'starter-action' | 'pledge' | 'launch';

export const MomentumGeneratorModal: React.FC<MomentumGeneratorModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onShowFloatingGo,
  habits,
  goal,
  aspirations,
  todaysContent,
  onAddContentLibrary,
  isCompletedToday,
  showSeizeTheDayPopup = false,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('streak');
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(new Set());
  const [pledgeProgress, setPledgeProgress] = useState(0);
  const [launchCountdown, setLaunchCountdown] = useState(60);
  const [launchActive, setLaunchActive] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentLibraryItem | null>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number }[]>([]);
  const [youtubeMetadata, setYoutubeMetadata] = useState<{ title: string; author: string } | null>(null);
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [preCountdown, setPreCountdown] = useState<number | null>(null);
  const [randomVisionContent, setRandomVisionContent] = useState<string>('');
  const [selectedStarterAction, setSelectedStarterAction] = useState<string | null>(null);
  const [goalSelected, setGoalSelected] = useState(false);
  const [pledgeCardFlipped, setPledgeCardFlipped] = useState(false);
  
  // Refs for YouTube player and timeout management
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoTimeoutRef = useRef<number | null>(null);
  const countdownCompletedRef = useRef(false); // Persist popup state across re-renders
  const launchIntervalRef = useRef<number | null>(null); // Store interval ID for manual clearing

  // Get user's life goal habits
  // If user has defined life goal habits, use them. Otherwise fallback to starters.
  const userLifeGoals = habits.filter(h => h.type === 'Life Goal Habit');

  const starterHabits = [
    {
      id: 9999991,
      name: 'Morning Movement',
      description: 'Start your day with intentional motion',
      color: '#3b82f6',
      type: 'Life Goal Habit',
      microWins: [
        { id: 'mw1', description: '5 jumping jacks' },
        { id: 'mw2', description: '2-minute walk outside' },
        { id: 'mw3', description: 'Stretch arms overhead' }
      ]
    },
    {
      id: 9999992,
      name: 'Deep Work Session',
      description: 'Build focus muscle through deliberate practice',
      color: '#8b5cf6',
      type: 'Life Goal Habit',
      microWins: [
        { id: 'mw4', description: 'Open work file' },
        { id: 'mw5', description: 'Write one sentence' },
        { id: 'mw6', description: 'Set 5-minute timer' }
      ]
    },
    {
      id: 9999993,
      name: 'Evening Reflection',
      description: 'Close the day with gratitude and presence',
      color: '#10b981',
      type: 'Life Goal Habit',
      microWins: [
        { id: 'mw7', description: 'Write 3 things you\'re grateful for' },
        { id: 'mw8', description: 'Take 3 deep breaths' },
        { id: 'mw9', description: 'Review tomorrow\'s top priority' }
      ]
    }
  ];

  // PRIORITIZE user habits. Only use starters if NO user habits exist.
  // This ensures that if a user edits/creates a life goal habit, they see THAT one.
  const lifeGoals = userLifeGoals.length > 0 ? userLifeGoals : starterHabits;
  const currentStreak = calculateStreak();
  
  // Shared launch completion logic - called by both natural countdown and skip button
  const triggerLaunchCompletion = useCallback(() => {
    // Clear interval immediately to prevent duplicate execution
    if (launchIntervalRef.current !== null) {
      clearInterval(launchIntervalRef.current);
      launchIntervalRef.current = null;
    }
    
    // Mark completion exactly once
    if (!countdownCompletedRef.current) {
      onComplete();
      countdownCompletedRef.current = true;
      // Close modal immediately, then show floating popup on dashboard
      onClose();
      onShowFloatingGo();
    }
  }, [onComplete, onClose, onShowFloatingGo]);
  
  // Load YouTube iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Set up callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        logger.log('YouTube iframe API ready');
      };
    }
  }, []);

  // Lock in content selection when modal opens
  useEffect(() => {
    if (isOpen && todaysContent && !selectedContent) {
      // Use pre-selected today's content (already filtered <5 min by getTodayContent)
      setSelectedContent(todaysContent);
      setVideoCompleted(false); // Reset video completion
      setVideoStarted(false); // Reset video started state for new session
      setVideoError(false); // Reset error state
    } else if (!isOpen) {
      // Reset when modal closes
      setCurrentStep('streak');
      setUserQuestion('');
      setSelectedHabits(new Set());
      setSelectedStarterAction(null);
      setGoalSelected(false);
      setPledgeCardFlipped(false);
      setPledgeProgress(0);
      setLaunchCountdown(60);
      setLaunchActive(false);
      setVideoCompleted(false);
      setVideoStarted(false);
      setVideoError(false);
      setConfetti([]); // Reset confetti
      setYoutubeMetadata(null); // Reset YouTube metadata
      countdownCompletedRef.current = false; // Always reset ref for new session
      setShowVideoIntro(true); // Reset video intro
      setPreCountdown(null); // Reset pre-countdown
      setRandomVisionContent(''); // Reset random vision content
      if (player) {
        try {
          // Destroy player and remove placeholder child
          if (player.destroy) {
            player.destroy();
          }
          // Remove all child nodes from container
          if (playerContainerRef.current) {
            while (playerContainerRef.current.firstChild) {
              playerContainerRef.current.removeChild(playerContainerRef.current.firstChild);
            }
          }
        } catch (e) {
          logger.log('Error cleaning up player on close:', e);
        }
        
        setPlayer(null);
      }
    }
  }, [isOpen, todaysContent, selectedContent, player]);

  // Initialize confetti when streak step is active - stagger delays for continuous falling
  useEffect(() => {
    if (currentStep === 'streak' && confetti.length === 0) {
      const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: (i * 0.1), // Staggered delays for continuous falling effect
      }));
      setConfetti(pieces);
    }
  }, [currentStep, confetti.length]);

  // Random vision content now generated synchronously in handleNextStep to prevent card size glitch
  
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

  // Initialize YouTube player when content step loads
  useEffect(() => {
    const getVideoId = (url: string) => {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return match ? match[1] : null;
    };

    // Cleanup old player if navigating away from content step
    if (currentStep !== 'content' && player) {
      try {
        // Destroy player and remove placeholder child
        if (player.destroy) {
          player.destroy();
        }
        // Remove all child nodes from container
        if (playerContainerRef.current) {
          while (playerContainerRef.current.firstChild) {
            playerContainerRef.current.removeChild(playerContainerRef.current.firstChild);
          }
        }
      } catch (e) {
        logger.log('Error cleaning up player:', e);
      }
      
      setPlayer(null);
      return;
    }

    // Initialize new player when entering content step AND video intro is dismissed
    if (currentStep === 'content' && content && !player && !showVideoIntro) {
      const videoId = getVideoId(content.youtubeUrl);
      if (!videoId) return;

      // Wait for YouTube API to be ready (with 10 second timeout)
      let retries = 0;
      const maxRetries = 100; // 10 seconds total (100ms * 100)
      
      const initPlayer = () => {
        retries++;
        
        if (retries > maxRetries) {
          console.error('YouTube API failed to load after 10 seconds');
          setVideoError(true); // Show error message and enable manual override
          return;
        }
        
        if (!window.YT || !window.YT.Player) {
          // API not loaded yet, try again in 100ms
          setTimeout(initPlayer, 100);
          return;
        }

        const onPlayerReady = (event: any) => {
          // Fetch real YouTube metadata
          try {
            const videoData = event.target.getVideoData();
            if (videoData) {
              setYoutubeMetadata({
                title: videoData.title || 'Video',
                author: videoData.author || 'Unknown Channel',
              });
            }
          } catch (e) {
            logger.log('Could not fetch video metadata:', e);
          }
        };

        const onPlayerStateChange = (event: any) => {
          // YT.PlayerState: PLAYING === 1, ENDED === 0
          if (event.data === 1) {
            // Video started playing - clear the failsafe timeout
            setVideoStarted(true);
            if (videoTimeoutRef.current) {
              clearTimeout(videoTimeoutRef.current);
              videoTimeoutRef.current = null;
            }
          } else if (event.data === 0) {
            // Video ended - track watch history for recommendation engine
            setVideoCompleted(true);
            if (selectedContent) {
              addToWatchHistory(selectedContent.id);
              logger.log('📹 Added video to watch history:', selectedContent.title);
            }
            if (videoTimeoutRef.current) {
              clearTimeout(videoTimeoutRef.current);
              videoTimeoutRef.current = null;
            }
          }
        };
        
        const onPlayerError = (event: any) => {
          // YouTube error codes: 150/101 = embedding not allowed, 2 = invalid ID
          console.error('YouTube player error:', event.data);
          setVideoError(true); // Enable "Continue Anyway" button
          if (videoTimeoutRef.current) {
            clearTimeout(videoTimeoutRef.current);
            videoTimeoutRef.current = null;
          }
        };

        try {
          if (!playerContainerRef.current) {
            console.error('Player container ref not available');
            return;
          }
          
          // Create placeholder child element for YouTube player
          // This prevents YouTube API from replacing the React-managed container
          const placeholder = document.createElement('div');
          placeholder.style.width = '100%';
          placeholder.style.height = '100%';
          playerContainerRef.current.appendChild(placeholder);
          
          // Mount YouTube player on the placeholder, not the React container
          const newPlayer = new window.YT.Player(placeholder, {
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0,
            },
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange,
              onError: onPlayerError,
            },
          });
          
          setPlayer(newPlayer);
          
          // Fallback timeout: if video doesn't START playing within 15 seconds, enable skip
          // This only fires if playback never begins (onStateChange never fires with PLAYING)
          videoTimeoutRef.current = window.setTimeout(() => {
            if (!videoStarted && !videoError) {
              logger.log('Video timeout: playback never started after 15 seconds');
              setVideoError(true);
            }
            videoTimeoutRef.current = null;
          }, 15000);
        } catch (e) {
          console.error('Error creating YouTube player:', e);
          setVideoError(true);
          if (videoTimeoutRef.current) {
            clearTimeout(videoTimeoutRef.current);
            videoTimeoutRef.current = null;
          }
        }
      };

      initPlayer();
    }
    
    // Cleanup timeout when component unmounts or step changes
    return () => {
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
        videoTimeoutRef.current = null;
      }
    };
  }, [currentStep, content, player, showVideoIntro, videoStarted, videoError]);

  // Pledge interaction handler - stores interval in ref to work with both mouse and touch
  const pledgeIntervalRef = useRef<number | null>(null);

  const handlePledgeStart = () => {
    setPledgeProgress(0);
    const startTime = Date.now();
    
    pledgeIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setPledgeProgress(progress);

      if (progress >= 100 && pledgeIntervalRef.current) {
        clearInterval(pledgeIntervalRef.current);
        pledgeIntervalRef.current = null;
        // Haptic feedback on completion (check API availability first)
        try {
          if ('vibrate' in navigator && navigator.vibrate) {
            navigator.vibrate([50, 30, 100, 30, 200]);
          }
        } catch (e) {
          // Ignore vibration errors - continue flow regardless
        }
        // Direct transition without intermediate state changes to prevent fade-out glitch
        setTimeout(() => {
          setCurrentStep('launch');
        }, 300); // Brief pause to show "LOCKED ✓" state
      }
    }, 10);
  };

  const handlePledgeEnd = () => {
    if (pledgeIntervalRef.current) {
      clearInterval(pledgeIntervalRef.current);
      pledgeIntervalRef.current = null;
    }
  };

  // Cleanup pledge interval when leaving pledge step
  useEffect(() => {
    if (currentStep !== 'pledge') {
      setPledgeProgress(0);
      if (pledgeIntervalRef.current) {
        clearInterval(pledgeIntervalRef.current);
        pledgeIntervalRef.current = null;
      }
    }
  }, [currentStep]);

  // 3-2-1 Pre-countdown with slow vibration
  useEffect(() => {
    if (preCountdown === null || preCountdown <= 0) return;

    const timer = setTimeout(() => {
      // Slow-paced vibration on each countdown tick (check API availability first)
      try {
        if ('vibrate' in navigator && navigator.vibrate) {
          navigator.vibrate(300);
        }
      } catch (e) {
        // Ignore vibration errors - continue countdown regardless
      }
      
      if (preCountdown === 1) {
        setPreCountdown(null); // Trigger 60-second countdown
      } else {
        setPreCountdown(preCountdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [preCountdown]);

  // 60-second Launch countdown with fast vibration
  useEffect(() => {
    if (currentStep !== 'launch' || !launchActive || preCountdown !== null) return;
    if (countdownCompletedRef.current) return; // Prevent re-triggering onComplete after first completion

    const interval = setInterval(() => {
      setLaunchCountdown(prev => {
        // Bail out immediately if already completed (prevents duplicate execution)
        if (countdownCompletedRef.current) return 0;
        
        // Fast-paced vibration every second (only if countdown is active, check API availability)
        if (prev > 1) {
          try {
            if ('vibrate' in navigator && navigator.vibrate) {
              navigator.vibrate(100);
            }
          } catch (e) {
            // Ignore vibration errors - continue countdown regardless
          }
        }
        
        if (prev <= 1) {
          // Use shared completion helper to mark complete and show popup
          triggerLaunchCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Store interval ID in ref for manual clearing
    launchIntervalRef.current = interval;

    return () => {
      clearInterval(interval);
      launchIntervalRef.current = null;
    };
  }, [currentStep, launchActive, preCountdown, triggerLaunchCompletion]);

  const handleNextStep = () => {
    const steps: Step[] = ['streak', 'vision', 'content', 'goal-selection', 'habits', 'starter-action', 'pledge', 'launch'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      
      // Generate random vision content BEFORE rendering vision step to prevent card size glitch
      if (nextStep === 'vision' && !randomVisionContent) {
        const randomWhys = [
          "To prove to yourself that you're capable of anything you commit to",
          "To build unshakeable discipline that transforms your entire life",
          "To become the person your future self will thank you for being",
          "To break free from limitation and step into your full potential"
        ];
        
        const randomRoutines = [
          "Morning: Mindful movement, focused work, energized action",
          "Ideal Day: Deep focus, intentional breaks, powerful completion",
          "Daily Flow: Present in the moment, building unstoppable momentum",
          "Your Rhythm: Wake with purpose, execute with precision, rest with gratitude",
          "Perfect Day: Aligned actions, consistent progress, compound results"
        ];
        
        const newVision = `${randomWhys[Math.floor(Math.random() * randomWhys.length)]}\n\n${randomRoutines[Math.floor(Math.random() * randomRoutines.length)]}`;
        setRandomVisionContent(newVision);
      }
      
      // Instant step change - persistent backdrop prevents flashing
      setCurrentStep(nextStep);
    }
  };

  // Render step content based on current step (persistent backdrop pattern)
  const renderStepContent = () => {
    // "Come back tomorrow" screen (but not if popup is showing OR countdown just completed)
    if (isCompletedToday && !showSeizeTheDayPopup && !countdownCompletedRef.current) {
      return (
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
      );
    }

    // Step 1: Streak Card with Side Fireworks
    if (currentStep === 'streak') {
      // Generate left firework particles bursting outward from left side
      const leftFireworkParticles = [...Array(15)].map((_, i) => {
        const angle = -60 + (i / 15) * 120; // Spread from left side
        const distance = 150 + Math.random() * 100;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance;
        return { tx, ty, delay: Math.random() * 0.3 };
      });
      
      // Generate right firework particles bursting outward from right side
      const rightFireworkParticles = [...Array(15)].map((_, i) => {
        const angle = 60 + (i / 15) * 120; // Spread from right side
        const distance = 150 + Math.random() * 100;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance;
        return { tx, ty, delay: Math.random() * 0.3 };
      });

      return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleNextStep}>
        {/* Falling Confetti Animation - Infinite Loop */}
        {confetti.map((piece) => (
          <div
            key={`confetti-${piece.id}`}
            className="absolute top-0 w-3 h-3 animate-confetti-infinite"
            style={{
              left: `${piece.left}%`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77'][piece.id % 4],
              animationDelay: `${piece.delay}s`,
              zIndex: 60,
            }}
          />
        ))}

        {/* Left Firework Burst Animation */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{zIndex: 61}}>
          {leftFireworkParticles.map((particle, i) => (
            <div
              key={`left-firework-${i}`}
              className="absolute animate-firework"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: ['#FDE047', '#FB923C', '#FBBF24', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`,
                animationDelay: `${particle.delay}s`,
                boxShadow: '0 0 15px currentColor',
              } as React.CSSProperties}
            />
          ))}
        </div>
        
        {/* Right Firework Burst Animation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{zIndex: 61}}>
          {rightFireworkParticles.map((particle, i) => (
            <div
              key={`right-firework-${i}`}
              className="absolute animate-firework"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: ['#FDE047', '#FB923C', '#FBBF24', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`,
                animationDelay: `${particle.delay}s`,
                boxShadow: '0 0 15px currentColor',
              } as React.CSSProperties}
            />
          ))}
        </div>
        
        {/* Premium 3D Card */}
        <div className="relative" style={{zIndex: 55}}>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl max-w-2xl mx-4 sm:mx-6"
               style={{
                 boxShadow: '0 0 60px rgba(251, 191, 36, 0.4), inset 0 2px 20px rgba(0, 0, 0, 0.5)',
                 transform: 'perspective(1000px) rotateX(2deg)',
               }}>
            <div className="text-center">
              <div className="text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 mb-3 sm:mb-4 animate-pulse" 
                   style={{textShadow: '0 0 80px rgba(251, 191, 36, 0.8)'}}>
                {currentStreak}
              </div>
              <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-yellow-400 mb-3 sm:mb-4 tracking-wider">
                DAY STREAK!! 🔥
              </div>
              <div className="text-lg sm:text-xl md:text-2xl text-yellow-200/80 font-light tracking-wide">
                The chain is unbroken
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 italic">Click anywhere to continue</div>
            </div>
          </div>
        </div>

        {/* Confetti CSS Animation - Infinite Loop */}
        <style>{`
          @keyframes confetti-infinite {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti-infinite {
            animation: confetti-infinite 4s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // Step 2: Vision Board
  if (currentStep === 'vision') {
    const displayVision = aspirations || randomVisionContent;
    
    return (
      <div className="w-full h-full flex items-center justify-center cursor-pointer overflow-y-auto" onClick={handleNextStep}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl"
               style={{boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 2px 20px rgba(0, 0, 0, 0.5)'}}>
            <div className="text-center">
              {/* Vision Board Title - Inside the card */}
              <div className="text-xl sm:text-2xl text-yellow-400/90 font-bold mb-4 uppercase tracking-wider">Vision Board</div>
              
              {/* Combined Box - Grander Vision on top, Goal below - Expanded to fill outer box */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-yellow-500/10 border-2 border-yellow-400/30 rounded-2xl">
                {/* Grander Vision - On top */}
                <div className="mb-8 pb-6 border-b border-yellow-400/20">
                  <div className="text-lg sm:text-xl text-yellow-300 font-black mb-3 sm:mb-4 uppercase tracking-wide" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.5)'}}>
                    Your Grander Vision
                  </div>
                  <p className="text-xl sm:text-2xl text-yellow-50 leading-relaxed font-light whitespace-pre-line">
                    {displayVision}
                  </p>
                </div>
                
                {/* Goal - Below */}
                <div>
                  <div className="text-lg sm:text-xl text-yellow-300 font-black mb-3 sm:mb-4 uppercase tracking-wide" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.5)'}}>
                    Goal
                  </div>
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight" style={{textShadow: '0 0 50px rgba(251, 191, 36, 0.4)'}}>
                    {goal}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Motivational Content with Full-Screen Intro then YouTube Player
  if (currentStep === 'content') {
    // Show full-screen intro first
    if (showVideoIntro && content) {
      return (
        <div className="w-full h-full flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center" style={{boxShadow: '0 0 60px rgba(251, 191, 36, 0.4), inset 0 2px 20px rgba(0, 0, 0, 0.5)'}}>
              <div className="mb-10 sm:mb-12 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-400/30 flex items-center justify-center">
                  <Target size={48} className="sm:w-14 sm:h-14 text-yellow-300" />
                </div>
              </div>
              
              <div className="text-yellow-400 text-2xl sm:text-3xl font-bold mb-6 uppercase tracking-wide">Today's Lesson</div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {content.title}
              </h3>
              <p className="text-gray-400 text-xl sm:text-2xl mb-12">
                {content.channelName} • {content.duration} min
              </p>
              
              <p className="text-2xl sm:text-3xl text-yellow-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                Watch with full attention
              </p>
              
              <button
                onClick={() => setShowVideoIntro(false)}
                className="w-full px-10 py-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-2xl sm:text-3xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center gap-3"
              >
                Begin Lesson
                <ChevronRight size={36} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Then show the actual video with question overlay
    return (
      <div className="w-full h-full overflow-y-auto p-4 sm:p-6">
        <div className="max-w-5xl mx-auto w-full py-4">
          {content ? (
            <>
              <div className="aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-2xl border-2 border-yellow-500/30" style={{boxShadow: '0 0 80px rgba(251, 191, 36, 0.2)'}}>
                <div ref={playerContainerRef} style={{width: '100%', height: '100%'}}></div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-yellow-400 text-xl sm:text-2xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">Today's Lesson</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {youtubeMetadata?.title || content.title}
                </h3>
                <p className="text-gray-400 text-base sm:text-lg">
                  {youtubeMetadata?.author || content.channelName} • {content.duration} min
                </p>
                {videoError ? (
                  <p className="text-red-400 text-sm mt-3">Video failed to load. You may continue anyway.</p>
                ) : !videoCompleted && (
                  <p className="text-yellow-400/80 text-sm mt-3 italic">Watch the video and answer the question below</p>
                )}
              </div>
              
              {/* Question Overlay - Always visible */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center leading-relaxed">
                  How will you apply this lesson today to your goals and habits?
                </h3>
                <textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder={videoError ? "Question is optional since video didn't load..." : "Type your answer while watching..."}
                  className="w-full h-32 sm:h-40 bg-gray-900/50 border-2 border-gray-700 focus:border-yellow-500 text-white text-base sm:text-lg rounded-2xl p-4 sm:p-6 placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none"
                  style={{boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'}}
                />
                <p className="text-gray-500 text-xs sm:text-sm mt-2 text-center">
                  {videoError
                    ? 'Video skipped - question is optional, continue when ready'
                    : videoCompleted && userQuestion.trim().length > 0 
                    ? '✓ Video completed and answer provided - ready to continue!' 
                    : !videoCompleted && userQuestion.trim().length > 0
                    ? 'Keep watching the video...'
                    : !videoCompleted
                    ? 'Watch the video and type your answer...'
                    : 'Please answer the question to continue'
                  }
                </p>
                
                {/* Subtle skip option - bottom of textarea area */}
                {!videoCompleted && (
                  <p className="text-center mt-3">
                    <button
                      onClick={() => {
                        setVideoError(true);
                        setVideoCompleted(true);
                      }}
                      className="text-gray-600 hover:text-gray-400 text-xs underline transition-colors"
                    >
                      Video not loading? Skip
                    </button>
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 sm:gap-4 items-center justify-center">
                <button
                  onClick={handleNextStep}
                  disabled={(!videoCompleted && !videoError) || (!videoError && userQuestion.trim().length === 0)}
                  className="group px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-bold text-lg sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center justify-center gap-2 sm:gap-3"
                >
                  {!videoCompleted && !videoError 
                    ? 'Finish Video First' 
                    : videoError 
                    ? 'Continue' 
                    : userQuestion.trim().length === 0 
                    ? 'Answer Question' 
                    : 'Continue'}
                  <ChevronRight size={24} className="sm:w-7 sm:h-7 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-white text-lg sm:text-xl mb-6">No content in library yet</p>
              <button
                onClick={onAddContentLibrary}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-600 transition-all"
              >
                Add Content
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 4: Question step removed - now integrated into content step

    // Step 4.5: Goal Focus (Confirming the User's #1 Priority)
    if (currentStep === 'goal-selection') {
      return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 pb-24">
          <div className="flex-1 flex flex-col items-center justify-start pt-8">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-8 sm:mb-10 text-center tracking-tight">
              Select Your Goal
            </h3>

            <div className="flex justify-center w-full">
              <button
                onClick={() => setGoalSelected(true)}
                className={`relative text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 w-full max-w-[280px] ${
                  goalSelected
                    ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500 shadow-2xl scale-105'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-yellow-500/50 hover:scale-105'
                }`}
                style={{ boxShadow: goalSelected ? '0 0 40px rgba(251, 191, 36, 0.5)' : 'inset 0 2px 10px rgba(0, 0, 0, 0.5)' }}
              >
                <div className={`absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  goalSelected
                    ? 'bg-yellow-500 border-yellow-500 scale-125'
                    : 'border-gray-600'
                }`}>
                  {goalSelected && (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-black"></div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-3 flex items-center justify-center ${goalSelected ? 'bg-yellow-500/30 text-yellow-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    <Target size={24} />
                  </div>
                  <p className="text-white font-bold text-lg sm:text-xl pr-8">
                    {goal || "No Goal Set"}
                  </p>
                </div>

                {aspirations && (
                  <p className={`text-sm italic ${goalSelected ? 'text-gray-300' : 'text-gray-400'}`}>"{aspirations}"</p>
                )}
              </button>
            </div>
          </div>

          <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <button
              onClick={handleNextStep}
              disabled={!goalSelected}
              className={`w-14 h-14 rounded-full transition-transform ${
                goalSelected 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 cursor-pointer hover:scale-110 animate-pulse'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
              style={{ boxShadow: goalSelected ? '0 0 30px rgba(251, 191, 36, 0.6)' : 'none' }}
            />
          </div>
        </div>
      );
    }

  // Step 5: Life Goal Habit Cards - Single Select
  if (currentStep === 'habits') {
    return (
      <div className="w-full h-full overflow-y-auto p-4 sm:p-6 pb-24">
        <div className="max-w-5xl mx-auto w-full py-4">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-8 sm:mb-10 text-center tracking-tight">Select Your Habit</h3>
          <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 ${lifeGoals.length === 1 ? 'items-center min-h-[200px]' : ''}`}>
            {lifeGoals.map(habit => {
              const isSelected = selectedHabits.has(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => {
                    // Single-select behavior: replace selection with this habit
                    setSelectedHabits(new Set([habit.id]));
                  }}
                  className={`group relative text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-[280px] ${
                    isSelected
                      ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500 shadow-2xl scale-105 animate-popOut'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-yellow-500/50 hover:scale-105'
                  }`}
                  style={{
                    boxShadow: isSelected 
                      ? '0 0 40px rgba(251, 191, 36, 0.5)' 
                      : 'inset 0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {/* Radio Button Selection Indicator */}
                  <div className={`absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-yellow-500 border-yellow-500 scale-125'
                      : 'border-gray-600'
                  }`}>
                    {isSelected && (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-black"></div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-3 flex items-center justify-center text-2xl sm:text-3xl"
                         style={{backgroundColor: habit.color}}>
                      ⚡
                    </div>
                    <p className="text-white font-bold text-lg sm:text-xl">{habit.name}</p>
                  </div>
                  
                  {/* Micro Wins - Always show if available */}
                  {habit.microWins && habit.microWins.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <p className="text-yellow-400 font-semibold text-xs mb-2">Micro-Wins:</p>
                      <div className="space-y-1">
                        {habit.microWins.slice(0, 3).map((mw: any) => (
                          <div key={mw.id} className="flex items-start gap-2">
                            <Sparkles size={10} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-300">{mw.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <button
            onClick={handleNextStep}
            disabled={selectedHabits.size === 0}
            className={`w-14 h-14 rounded-full transition-transform ${
              selectedHabits.size > 0 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 cursor-pointer hover:scale-110 animate-pulse'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
            style={{ boxShadow: selectedHabits.size > 0 ? '0 0 30px rgba(251, 191, 36, 0.6)' : 'none' }}
          />
        </div>
      </div>
    );
  }

    // Step 5.5: Starter Action (New - 5 Tiers)
    if (currentStep === 'starter-action') {
      // Generate mock tiers based on selected habit name (if available)
      // In a real app, these would come from the habit object in DB
      const habitName = habits.find(h => selectedHabits.has(h.id))?.name || 'Habit';

      const tiers = [
        { id: 'trap', label: 'Trap for later', icon: '🕸️', title: 'Set a Trap', desc: 'Make it impossible to ignore later.' },
        { id: 'prep', label: 'Prep for the Habit', icon: '🚶', title: 'Prepare Environment', desc: 'Reduce friction for when you start.' },
        { id: 'direct', label: 'Direct steps', icon: '🏃', title: 'Direct Action', desc: 'Take the very first physical step.' },
        { id: 'micro', label: 'Micro Win', icon: '⚡', title: 'Micro Win', desc: 'A 60-second version of the habit.' },
        { id: 'start', label: 'Start the Habit', icon: '🔥', title: 'Start Now', desc: 'Just do the thing right now.' },
      ];

      // Specific examples for demo purposes
      const getExample = (tierId: string) => {
        if (habitName.includes('Movement') || habitName.includes('Exercise')) {
          if (tierId === 'trap') return 'Put running shoes by the front door';
          if (tierId === 'prep') return 'Fill water bottle & set out clothes';
          if (tierId === 'direct') return 'Put on your running shoes';
          if (tierId === 'start') return 'Start jogging in place';
          if (tierId === 'micro') return 'Do 10 jumping jacks';
        }
        if (habitName.includes('Work') || habitName.includes('Focus')) {
          if (tierId === 'trap') return 'Leave notebook open on desk';
          if (tierId === 'prep') return 'Clear desk & close tabs';
          if (tierId === 'direct') return 'Open the specific document';
          if (tierId === 'start') return 'Write the first sentence';
          if (tierId === 'micro') return 'Write the title only';
        }
        // Generic fallbacks
        if (tierId === 'trap') return 'Set a phone alarm for 5 mins';
        if (tierId === 'prep') return 'Get materials ready';
        if (tierId === 'direct') return 'Go to the location';
        if (tierId === 'start') return 'Begin the activity';
        if (tierId === 'micro') return 'Do it for 1 minute';
        return '';
      };

      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2 text-center">
            Select Your Starter Action
          </h3>
          <p className="text-gray-400 mb-8 text-center max-w-xl">
            Choose your point of entry. How will you engage with <span className="text-yellow-400 font-bold">{habitName}</span> right now?
          </p>

          <div className="w-full max-w-4xl grid gap-4">
            {tiers.map(tier => (
              <button
                key={tier.id}
                onClick={() => setSelectedStarterAction(tier.id)}
                className={`w-full p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-center gap-4 group text-left ${selectedStarterAction === tier.id
                  ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/10'
                  : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                  }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${selectedStarterAction === tier.id ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'
                  }`}>
                  {tier.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${selectedStarterAction === tier.id ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700 text-gray-400'
                      }`}>
                      Level {tiers.indexOf(tier) + 1}
                    </span>
                    <h4 className={`font-bold ${selectedStarterAction === tier.id ? 'text-white' : 'text-gray-300'}`}>
                      {tier.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{tier.desc}</p>
                  <p className={`text-sm font-medium ${selectedStarterAction === tier.id ? 'text-yellow-400' : 'text-gray-500'}`}>
                    Example: "{getExample(tier.id)}"
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedStarterAction === tier.id ? 'border-yellow-500 bg-yellow-500' : 'border-gray-600'
                  }`}>
                  {selectedStarterAction === tier.id && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleNextStep}
              disabled={!selectedStarterAction}
              className={`w-14 h-14 rounded-full transition-transform ${
                selectedStarterAction 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 cursor-pointer hover:scale-110 animate-pulse'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
              style={{ boxShadow: selectedStarterAction ? '0 0 30px rgba(251, 191, 36, 0.6)' : 'none' }}
            />
          </div>
        </div>
      );
    }

    // Step 6: Pledge Card (Updated with flip card showing selections)
  if (currentStep === 'pledge') {
    const selectedHabit = habits.find(h => selectedHabits.has(h.id));
    const starterActionLabels: Record<string, string> = {
      'trap': 'Set a Trap',
      'prep': 'Prepare Environment', 
      'direct': 'Direct Action',
      'micro': 'Micro Win',
      'start': 'Start Now'
    };
    const starterActionIcons: Record<string, string> = {
      'trap': '🕸️',
      'prep': '🚶',
      'direct': '🏃',
      'micro': '⚡',
      'start': '🔥'
    };

    return (
      <div className="w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
        <div className="max-w-[34rem] mx-6 w-full">
          <div 
            className="relative w-full transition-transform duration-700 cursor-pointer"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: pledgeCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              height: '588px'
            }}
            onClick={() => !pledgeCardFlipped && setPledgeCardFlipped(true)}
          >
            {/* Front of card - Summary */}
            <div 
              className="absolute inset-0 w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl flex flex-col justify-center"
              style={{
                boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 2px 20px rgba(0, 0, 0, 0.5)',
                backfaceVisibility: 'hidden'
              }}
            >
              <h3 className="text-4xl font-black text-yellow-400 mb-8 text-center tracking-wide uppercase" style={{textShadow: '0 0 30px rgba(251, 191, 36, 0.5)'}}>
                Your Commitment
              </h3>
              
              <div className="space-y-6">
                {/* Goal */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Target size={20} className="text-yellow-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Goal</span>
                  </div>
                  <p className="text-xl font-bold text-white pl-13">{goal || 'No Goal Set'}</p>
                </div>

                {/* Habit */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl">
                      🏋️
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Habit</span>
                  </div>
                  <p className="text-xl font-bold text-white pl-13">{selectedHabit?.name || 'No Habit Selected'}</p>
                </div>

                {/* Starter Action */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl">
                      {selectedStarterAction ? starterActionIcons[selectedStarterAction] : '🎯'}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Starter Action</span>
                  </div>
                  <p className="text-xl font-bold text-white pl-13">
                    {selectedStarterAction ? starterActionLabels[selectedStarterAction] : 'No Action Selected'}
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <div 
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 cursor-pointer hover:scale-110 transition-transform animate-pulse"
                  style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)' }}
                />
              </div>
            </div>

            {/* Back of card - Commit button */}
            <div 
              className="absolute inset-0 w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 2px 20px rgba(0, 0, 0, 0.5)',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <h3 className="text-4xl font-black text-yellow-400 mb-12 text-center tracking-wide uppercase" style={{textShadow: '0 0 30px rgba(251, 191, 36, 0.5)'}}>
                Make a commitment
              </h3>
              <div className="mb-12 cursor-pointer select-none">
                <div 
                  className="w-52 h-52 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center relative shadow-2xl"
                  style={{boxShadow: `0 0 ${Math.max(40, pledgeProgress)}px rgba(251, 191, 36, ${0.4 + pledgeProgress / 200})`}}
                  onMouseDown={handlePledgeStart}
                  onMouseUp={handlePledgeEnd}
                  onMouseLeave={handlePledgeEnd}
                  onTouchStart={handlePledgeStart}
                  onTouchEnd={handlePledgeEnd}
                  onTouchCancel={handlePledgeEnd}
                  onClick={(e) => e.stopPropagation()}
                >
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
      </div>
    );
  }

  // Step 7: Launch with 3-2-1 Pre-Countdown then 60-second Timer
  if (currentStep === 'launch') {
    const rocketProgress = launchActive && preCountdown === null ? ((60 - launchCountdown) / 60) * 100 : 0;
    
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        {!launchActive ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 mb-8 sm:mb-12 text-center tracking-tight uppercase" style={{textShadow: '0 0 40px rgba(251, 191, 36, 0.5)'}}>
              Get ready for an action
            </h3>
            <button
              onClick={() => {
                // Slow-paced vibration for Start Countdown button (slower than 3,2,1 countdown)
                try {
                  if ('vibrate' in navigator && navigator.vibrate) {
                    navigator.vibrate(500);
                  }
                } catch (e) {
                  // Ignore vibration errors
                }
                setLaunchActive(true);
                setPreCountdown(3);
              }}
              className="mx-auto px-12 sm:px-16 md:px-20 py-6 sm:py-8 md:py-10 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-black text-2xl sm:text-3xl md:text-4xl rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/50 uppercase tracking-wider"
            >
              Start Countdown
            </button>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-8 sm:mt-12 max-w-2xl mx-auto leading-relaxed font-light text-center">
              You got 60 seconds to sprint into motion.<br/>
              Do whatever you need to do to get to your habit as soon as possible -<br/>
              get out of bed, get your shoes on, turn on your laptop, just gooo!
            </p>
          </div>
        ) : preCountdown !== null && preCountdown > 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[20rem] font-black text-yellow-400 animate-pulse" style={{textShadow: '0 0 100px rgba(251, 191, 36, 0.9)'}}>
              {preCountdown}
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
                  Break into Action NOW!!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                try {
                  if ('vibrate' in navigator && navigator.vibrate) {
                    navigator.vibrate(200);
                  }
                } catch (e) {
                  // Ignore vibration errors
                }
                // Stop countdown state
                setLaunchActive(false);
                setLaunchCountdown(0);
                // Use shared completion helper - clears interval and triggers popup
                triggerLaunchCompletion();
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

  if (!isOpen) return null;

  // Force show launch countdown if countdown completed (even if isCompletedToday is true)
  const shouldShowContent = !isCompletedToday || countdownCompletedRef.current;

  return (
    <div className={`fixed inset-0 z-50 ${isCompletedToday && !countdownCompletedRef.current ? 'bg-black/98 backdrop-blur-sm' : 'bg-gradient-to-b from-gray-900 via-black to-gray-900'} flex items-center justify-center`}>
      <div className="w-full h-full flex items-center justify-center">
        {shouldShowContent ? renderStepContent() : null}
      </div>
    </div>
  );
};

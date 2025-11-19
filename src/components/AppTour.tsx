import { useState, useEffect } from 'react';
import { ChevronRight, X, Sparkles } from 'lucide-react';

interface AppTourProps {
  onComplete: () => void;
  onToggleStatsView?: (show: boolean) => void;
  onToggleDailyCheckIn?: (show: boolean) => void;
}

export default function AppTour({ onComplete, onToggleStatsView, onToggleDailyCheckIn }: AppTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementReady, setElementReady] = useState(false);

  const tourStops = [
    {
      title: 'Habit Tracker',
      description: 'Your mission control. Track daily habits, build streaks, and watch your consistency grow with visual feedback.',
      spotlightSelector: '.habit-tracker-area',
      position: 'bottom' as const,
    },
    {
      title: 'Daily Check-In Chat',
      description: 'Click the sparkles button to open your AI coach chat. Reflect on your day, share wins and challenges, and get personalized encouragement tailored to your coaching style.',
      spotlightSelector: 'button[title="Daily Check-In"]',
      position: 'bottom' as const,
    },
    {
      title: 'Mastery Dashboard',
      description: 'See your transformation unfold. Weekly stats, completion rates, streak breakdowns, and heatmaps show exactly how far you\'ve come.',
      spotlightSelector: '.stats-dashboard-area',
      position: 'top' as const,
      requireStatsView: true,
    },
  ];

  const currentStop = tourStops[currentStep];

  useEffect(() => {
    // Auto-switch to stats view for step 3
    if (currentStop.requireStatsView && onToggleStatsView) {
      onToggleStatsView(true);
    } else if (!currentStop.requireStatsView && onToggleStatsView && currentStep > 0) {
      onToggleStatsView(false);
    }
  }, [currentStep, currentStop.requireStatsView, onToggleStatsView]);

  // Wait for DOM element to be ready
  useEffect(() => {
    setElementReady(false);
    const checkElement = () => {
      const element = document.querySelector(currentStop.spotlightSelector);
      if (element) {
        setElementReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  }, [currentStop.spotlightSelector]);

  const handleNext = () => {
    if (currentStep < tourStops.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    // Reset to habit tracker view
    if (onToggleStatsView) {
      onToggleStatsView(false);
    }
    localStorage.setItem('mastery-dashboard-app-tour-complete', 'true');
    onComplete();
  };

  // Get spotlight element position
  const getSpotlightStyle = () => {
    const element = document.querySelector(currentStop.spotlightSelector);
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    return {
      top: `${rect.top - 8}px`,
      left: `${rect.left - 8}px`,
      width: `${rect.width + 16}px`,
      height: `${rect.height + 16}px`,
    };
  };

  // Get tooltip position
  const getTooltipStyle = () => {
    const element = document.querySelector(currentStop.spotlightSelector);
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    
    if (currentStop.position === 'bottom') {
      return {
        top: `${rect.bottom + 24}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      };
    } else {
      return {
        bottom: `${window.innerHeight - rect.top + 24}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      };
    }
  };

  const spotlightStyle = getSpotlightStyle();
  const tooltipStyle = getTooltipStyle();

  // Don't render until element is ready
  if (!elementReady) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/15 flex items-center justify-center">
        <div className="text-white text-xl">Loading tour...</div>
      </div>
    );
  }

  return (
    <>
      {/* Dimmed backdrop with spotlight cutout */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Full dark overlay */}
        <div className="absolute inset-0 bg-black/15"></div>
        
        {/* Spotlight cutout - lighter area */}
        <div
          className="absolute rounded-xl border-4 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)] transition-all duration-500 pointer-events-auto"
          style={spotlightStyle}
        ></div>
      </div>

      {/* Floating tooltip */}
      <div
        className="fixed z-[101] max-w-md animate-fadeIn pointer-events-auto"
        style={tooltipStyle}
      >
        <div className="bg-gray-900 border-2 border-blue-500 rounded-2xl p-6 shadow-2xl">
          {/* Arrow pointer */}
          {currentStop.position === 'bottom' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 border-t-2 border-l-2 border-blue-500 rotate-45"></div>
          )}
          {currentStop.position === 'top' && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 border-b-2 border-r-2 border-blue-500 rotate-45"></div>
          )}

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">{currentStop.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{currentStop.description}</p>
              </div>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                title="Skip Tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress and Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="flex gap-1.5">
                {tourStops.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-blue-500 w-8'
                        : index < currentStep
                        ? 'bg-green-500 w-4'
                        : 'bg-gray-600 w-4'
                    }`}
                  ></div>
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all"
              >
                {currentStep < tourStops.length - 1 ? 'Next' : 'Got it!'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

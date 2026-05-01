import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronRight, X, Sparkles } from 'lucide-react';
import DailyCheckInPreview from './DailyCheckInPreview';

interface AppTourProps {
  onComplete: () => void;
  onToggleStatsView?: (show: boolean) => void;
  onOpenHabitModal?: () => void;
  onCloseHabitModal?: () => void;
}

const TOOLTIP_MARGIN = 12;
const TOOLTIP_EST_WIDTH = 448;
const TOOLTIP_EST_HEIGHT = 200;
const PREVIEW_EST_WIDTH = 380;
const PREVIEW_EST_HEIGHT = 400;
const BOTTOM_NAV_HEIGHT = 80;
const ARROW_SIZE = 12;
const SPOTLIGHT_GAP = 24;
const PREVIEW_GAP = 32;

const MOBILE_PREVIEW_BREAKPOINT = 480;
const MOBILE_HEIGHT_BREAKPOINT = 500;

export default function AppTour({ onComplete, onToggleStatsView, onOpenHabitModal, onCloseHabitModal }: AppTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementReady, setElementReady] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(TOOLTIP_EST_HEIGHT);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tourStops = [
    {
      title: 'Mastery Tracker',
      description: 'Your mission control. Track daily habits, build streaks, and watch your consistency grow with visual feedback.',
      spotlightSelector: '.habit-tracker-area',
      position: 'top' as const,
    },
    {
      title: 'Daily Check-In Chat',
      description: 'Click the sparkles button to open your AI coach chat. Reflect on your day, share wins and challenges, and get personalized encouragement tailored to your coaching style.',
      spotlightSelector: 'button[title="Daily Check-In"]',
      position: 'top' as const,
      showPreview: true,
    },
    {
      title: 'Mastery Dashboard',
      description: "See your transformation unfold. Weekly stats, completion rates, streak breakdowns, and heatmaps show exactly how far you've come.",
      spotlightSelector: '.stats-dashboard-area',
      position: 'bottom' as const,
      requireStatsView: true,
      reserveBottom: true,
    },
    {
      title: 'Add a Habit',
      description: 'Tap the + button to start creating your first habit. Every great routine begins with a single step.',
      spotlightSelector: '.add-habit-tour-target',
      position: 'top' as const,
    },
    {
      title: 'Name Your Habit',
      description: 'Give your habit a clear, specific name. The more concrete it is, the easier it is to stay consistent.',
      spotlightSelector: '#habitName',
      position: 'bottom' as const,
      requireHabitModal: true,
    },
    {
      title: 'Choose a Habit Type',
      description: 'Select the type that best fits your habit. Each type unlocks different tracking and coaching features.',
      spotlightSelector: '.habit-type-selector-tour-target',
      position: 'bottom' as const,
      requireHabitModal: true,
    },
    {
      title: 'Habit Type Explained',
      description: 'Read the description to understand what each type means for your journey. Pick the one that matches your goal.',
      spotlightSelector: '.habit-type-description-tour-target',
      position: 'bottom' as const,
      requireHabitModal: true,
      isLastStep: true,
    },
  ];

  const currentStop = tourStops[currentStep];

  useEffect(() => {
    if (currentStop.requireStatsView && onToggleStatsView) {
      onToggleStatsView(true);
    } else if (!currentStop.requireStatsView && onToggleStatsView && currentStep > 0) {
      onToggleStatsView(false);
    }
  }, [currentStep, currentStop.requireStatsView, onToggleStatsView]);

  useEffect(() => {
    if (currentStop.requireHabitModal && onOpenHabitModal) {
      onOpenHabitModal();
    } else if (!currentStop.requireHabitModal && onCloseHabitModal && currentStep > 0) {
      onCloseHabitModal();
    }
  }, [currentStep, currentStop.requireHabitModal, onOpenHabitModal, onCloseHabitModal]);

  useEffect(() => {
    setElementReady(false);
    setTooltipHeight(TOOLTIP_EST_HEIGHT);
    const checkElement = () => {
      const element = document.querySelector(currentStop.spotlightSelector);
      if (element) {
        setElementReady(true);
      } else {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  }, [currentStop.spotlightSelector]);

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    const measured = tooltipRef.current.offsetHeight;
    if (measured > 0 && measured !== tooltipHeight) {
      setTooltipHeight(measured);
    }
  });

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
    if (onToggleStatsView) {
      onToggleStatsView(false);
    }
    if (onCloseHabitModal) {
      onCloseHabitModal();
    }
    localStorage.setItem('mastery-dashboard-app-tour-complete', 'true');
    onComplete();
  };

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

  const getTooltipPlacement = (): { style: React.CSSProperties; side: 'top' | 'bottom' } => {
    const element = document.querySelector(currentStop.spotlightSelector);
    if (!element) return { style: {}, side: currentStop.position };

    const rect = element.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const reservedBottom = currentStop.reserveBottom ? BOTTOM_NAV_HEIGHT : 0;

    const tooltipW = Math.min(TOOLTIP_EST_WIDTH, vw - TOOLTIP_MARGIN * 2);
    const tooltipH = tooltipHeight;

    const spaceAbove = rect.top - SPOTLIGHT_GAP - TOOLTIP_MARGIN;
    const spaceBelow = vh - reservedBottom - rect.bottom - SPOTLIGHT_GAP - TOOLTIP_MARGIN;

    let side: 'top' | 'bottom' = currentStop.position;

    if (side === 'top' && spaceAbove < tooltipH && spaceBelow >= tooltipH) {
      side = 'bottom';
    } else if (side === 'bottom' && spaceBelow < tooltipH && spaceAbove >= tooltipH) {
      side = 'top';
    } else if (spaceAbove < tooltipH && spaceBelow < tooltipH) {
      side = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    }

    const centerX = rect.left + rect.width / 2;
    let left = centerX - tooltipW / 2;
    left = Math.max(TOOLTIP_MARGIN, Math.min(left, vw - tooltipW - TOOLTIP_MARGIN));

    const style: React.CSSProperties = {
      left: `${left}px`,
      width: `${tooltipW}px`,
      maxWidth: `calc(100vw - ${TOOLTIP_MARGIN * 2}px)`,
    };

    const maxBottom = vh - reservedBottom - TOOLTIP_MARGIN;

    if (side === 'bottom') {
      let top = rect.bottom + SPOTLIGHT_GAP;
      top = Math.min(top, maxBottom - tooltipH);
      top = Math.max(TOOLTIP_MARGIN, top);
      style.top = `${top}px`;
    } else {
      let top = rect.top - SPOTLIGHT_GAP - tooltipH;
      top = Math.max(TOOLTIP_MARGIN, top);
      top = Math.min(top, maxBottom - tooltipH);
      style.top = `${top}px`;
    }

    return { style, side };
  };

  const getPreviewStyle = (): React.CSSProperties => {
    const element = document.querySelector(currentStop.spotlightSelector);
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const previewW = Math.min(PREVIEW_EST_WIDTH, vw - TOOLTIP_MARGIN * 2);
    const previewH = PREVIEW_EST_HEIGHT;

    const clampTop = (rawTop: number) =>
      Math.max(TOOLTIP_MARGIN, Math.min(rawTop, vh - previewH - TOOLTIP_MARGIN));
    const clampBottom = (rawBottom: number) =>
      Math.max(TOOLTIP_MARGIN, Math.min(rawBottom, vh - previewH - TOOLTIP_MARGIN));

    const spaceRight = vw - rect.right - PREVIEW_GAP;
    const spaceLeft = rect.left - PREVIEW_GAP;

    if (spaceRight >= previewW) {
      const isBottomHalf = rect.top > vh / 2;
      const rawTop = isBottomHalf ? vh - rect.bottom : rect.top;
      return isBottomHalf
        ? { bottom: `${clampBottom(rawTop)}px`, left: `${rect.right + PREVIEW_GAP}px`, width: `${previewW}px` }
        : { top: `${clampTop(rawTop)}px`, left: `${rect.right + PREVIEW_GAP}px`, width: `${previewW}px` };
    }

    if (spaceLeft >= previewW) {
      const isBottomHalf = rect.top > vh / 2;
      const rawLeft = vw - rect.left + PREVIEW_GAP;
      const rawTop = isBottomHalf ? vh - rect.bottom : rect.top;
      return isBottomHalf
        ? { bottom: `${clampBottom(rawTop)}px`, right: `${rawLeft}px`, width: `${previewW}px` }
        : { top: `${clampTop(rawTop)}px`, right: `${rawLeft}px`, width: `${previewW}px` };
    }

    const centeredLeft = Math.max(TOOLTIP_MARGIN, (vw - previewW) / 2);
    const spaceBelow = vh - rect.bottom - PREVIEW_GAP;
    const spaceAbove = rect.top - PREVIEW_GAP;

    if (spaceBelow >= spaceAbove) {
      const rawTop = rect.bottom + PREVIEW_GAP;
      return {
        top: `${clampTop(rawTop)}px`,
        left: `${centeredLeft}px`,
        width: `${previewW}px`,
      };
    }

    const rawTop = rect.top - PREVIEW_GAP - previewH;
    return {
      top: `${clampTop(rawTop)}px`,
      left: `${centeredLeft}px`,
      width: `${previewW}px`,
    };
  };

  const spotlightStyle = getSpotlightStyle();
  const { style: tooltipStyle, side: tooltipSide } = getTooltipPlacement();
  const previewStyle = getPreviewStyle();

  const previewWouldOverlapTooltip = (): boolean => {
    const element = document.querySelector(currentStop.spotlightSelector);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const vw = window.innerWidth;
    const previewW = Math.min(PREVIEW_EST_WIDTH, vw - TOOLTIP_MARGIN * 2);
    const spaceRight = vw - rect.right - PREVIEW_GAP;
    const spaceLeft = rect.left - PREVIEW_GAP;
    if (spaceRight >= previewW || spaceLeft >= previewW) {
      return false;
    }
    const parseTop = (style: React.CSSProperties, estHeight: number, vh: number): number | null => {
      if (typeof style.top === 'string') return parseFloat(style.top);
      if (typeof style.bottom === 'string') return vh - parseFloat(style.bottom) - estHeight;
      return null;
    };
    const parseLeft = (style: React.CSSProperties, estWidth: number, outerVw: number): number | null => {
      if (typeof style.left === 'string') return parseFloat(style.left);
      if (typeof style.right === 'string') return outerVw - parseFloat(style.right) - estWidth;
      return null;
    };
    const vh = window.innerHeight;
    const tooltipW = typeof tooltipStyle.width === 'string' ? parseFloat(tooltipStyle.width) : TOOLTIP_EST_WIDTH;
    const tTop = parseTop(tooltipStyle, tooltipHeight, vh);
    const tLeft = parseLeft(tooltipStyle, tooltipW, vw);
    const pTop = parseTop(previewStyle, PREVIEW_EST_HEIGHT, vh);
    const pLeft = parseLeft(previewStyle, previewW, vw);
    if (tTop === null || tLeft === null || pTop === null || pLeft === null) return false;
    const hOverlap = tLeft < pLeft + previewW && tLeft + tooltipW > pLeft;
    const vOverlap = tTop < pTop + PREVIEW_EST_HEIGHT && tTop + tooltipHeight > pTop;
    return hOverlap && vOverlap;
  };

  const shouldHidePreview =
    windowWidth < MOBILE_PREVIEW_BREAKPOINT ||
    windowHeight < MOBILE_HEIGHT_BREAKPOINT ||
    previewWouldOverlapTooltip();

  if (!elementReady) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/15 flex items-center justify-center">
        <div className="text-white text-xl">Loading tour...</div>
      </div>
    );
  }

  return (
    <>
      {/* Dimmed backdrop */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <div className="absolute inset-0 bg-black/15"></div>
      </div>

      {/* Spotlight border — sits above any modal (z-[102]) opened during tour steps */}
      <div
        className="fixed z-[103] rounded-xl border-4 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)] transition-all duration-500 pointer-events-none"
        style={spotlightStyle}
      ></div>

      {/* Daily Check-in Preview (Step 2 only, hidden when space is insufficient to prevent tooltip overlap) */}
      {currentStop.showPreview && !shouldHidePreview && (
        <div
          className="fixed z-[101] animate-fadeIn pointer-events-none"
          style={previewStyle}
          aria-hidden="true"
        >
          <DailyCheckInPreview />
        </div>
      )}

      {/* Floating tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[104] animate-fadeIn pointer-events-auto"
        style={tooltipStyle}
      >
        <div className="relative bg-gray-900 border-2 border-blue-500 rounded-2xl p-6 shadow-2xl">
          {/* Arrow pointer — direction tracks actual placement side */}
          {tooltipSide === 'bottom' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 border-t-2 border-l-2 border-blue-500 rotate-45"
              style={{ top: `-${ARROW_SIZE}px` }}
            ></div>
          )}
          {tooltipSide === 'top' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 border-b-2 border-r-2 border-blue-500 rotate-45"
              style={{ bottom: `-${ARROW_SIZE}px` }}
            ></div>
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
                {currentStep < tourStops.length - 1 ? 'Next' : 'Finish Tour'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

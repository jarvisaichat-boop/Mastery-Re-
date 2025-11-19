import { useState } from 'react';
import { ChevronLeft, ChevronRight, Target, MessageSquare, BarChart3, X } from 'lucide-react';

interface AppTourProps {
  onComplete: () => void;
}

export default function AppTour({ onComplete }: AppTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleSkip = () => {
    localStorage.setItem('appTourCompleted', 'true');
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('appTourCompleted', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const tourSteps = [
    {
      icon: Target,
      title: 'Habit Tracker',
      description: 'Your mission control. Track daily habits, build streaks, and watch your consistency grow. Each check-in strengthens your momentum.',
      gradient: 'from-blue-600 to-purple-600',
      preview: (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500"></div>
              <span className="text-white">Write for 20 minutes</span>
            </div>
            <div className="text-blue-400 text-sm">🔥 7 day streak</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white">Drink 1 Glass of Water</span>
            </div>
            <div className="text-green-400 text-sm">✓ Done today</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-purple-500"></div>
              <span className="text-white">10 pushups</span>
            </div>
            <div className="text-gray-500 text-sm">Not started</div>
          </div>
        </div>
      ),
    },
    {
      icon: MessageSquare,
      title: 'Daily Check-In Chat',
      description: 'Your AI coach is here to support you. Share your wins, challenges, and reflections. Get personalized encouragement when you need it most.',
      gradient: 'from-green-600 to-emerald-600',
      preview: (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">AI</span>
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 flex-1">
              <p className="text-gray-200 text-sm">
                Great work today! You completed 2 out of 3 habits. What made today successful?
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="bg-blue-600 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
              <p className="text-white text-sm">
                I started early and had my water bottle ready!
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">Me</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: 'Mastery Dashboard',
      description: 'See your transformation unfold. Weekly completion rates, streak breakdowns, and heatmaps show you exactly how far you\'ve come.',
      gradient: 'from-purple-600 to-pink-600',
      preview: (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">85%</div>
              <div className="text-xs text-gray-400 mt-1">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">12</div>
              <div className="text-xs text-gray-400 mt-1">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">47</div>
              <div className="text-xs text-gray-400 mt-1">Total Wins</div>
            </div>
          </div>
          <div className="flex gap-1 justify-center">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded ${
                  i < 5 ? 'bg-green-500' : i === 5 ? 'bg-yellow-500' : 'bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Tour</h2>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-bold text-white">{step.title}</h3>
            <p className="text-xl text-gray-300">{step.description}</p>
          </div>

          {/* Preview */}
          <div className="py-4">
            {step.preview}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-500 w-8'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentStep === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Skip Tour
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all"
          >
            {currentStep < 2 ? 'Next' : 'Get Started'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

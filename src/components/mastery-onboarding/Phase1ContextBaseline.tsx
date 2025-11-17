import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Brain } from 'lucide-react';

interface Phase1ContextBaselineProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase1ContextBaseline({ profile, onComplete }: Phase1ContextBaselineProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    context: profile.context || '',
    mentalState: profile.mentalState || '',
    name: profile.name || '',
    location: profile.location || '',
    occupation: profile.occupation || '',
    interests: profile.interests || '',
  });

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 3) {
      setCurrentScreen(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 1) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.context && data.context.length > 0;
      case 2: return data.mentalState !== '';
      case 3: return data.name !== '';
      default: return false;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <ScreenContainer
            icon={<Brain className="w-12 h-12 text-blue-400" />}
            goldenHeader="Don't start from zero."
            header="Context Injection (Brain Dump)"
            subtext="Paste your journals, goals, or AI chats."
          >
            <textarea
              value={data.context}
              onChange={(e) => updateData({ context: e.target.value })}
              placeholder="Paste any existing journal entries, goal lists, or chat transcripts here..."
              className="w-full h-64 px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              autoFocus
            />
            {data.context && data.context.length > 50 && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-200">
                ✓ Analyzing... ({data.context.length} characters)
              </div>
            )}
          </ScreenContainer>
        );

      case 2:
        return (
          <ScreenContainer
            icon={<span className="text-5xl">⚡</span>}
            goldenHeader="What brought you here?"
            header="The Spark"
            subtext="Choose the one that resonates"
          >
            <div className="space-y-3">
              {[
                { value: 'STUCK' as const, emoji: '🧱', label: 'STUCK', sub: 'I need to break through' },
                { value: 'GOAL' as const, emoji: '🎯', label: 'Specific GOAL', sub: 'I know what I want' },
                { value: 'CURIOUS' as const, emoji: '🧐', label: 'Just CURIOUS', sub: 'Show me what this is' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData({ mentalState: option.value })}
                  className={`w-full p-5 rounded-lg border-2 transition-all text-left flex items-center gap-4 ${
                    data.mentalState === option.value
                      ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-900/30 border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">{option.label}</p>
                    <p className="text-sm text-gray-300">{option.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScreenContainer>
        );

      case 3:
        return (
          <ScreenContainer
            icon={<span className="text-5xl">👤</span>}
            goldenHeader="Who are you?"
            header="Your Profile"
            subtext="Tell me about yourself"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
                placeholder="Location (Optional)"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={data.occupation}
                onChange={(e) => updateData({ occupation: e.target.value })}
                placeholder="Occupation"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={data.interests}
                onChange={(e) => updateData({ interests: e.target.value })}
                placeholder="Interests (Business, Fitness, Creative, etc.)"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </ScreenContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span className="font-medium">Phase 1: The Download</span>
            <span>Screen {currentScreen} of 3</span>
          </div>
          <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderScreen()}

        <div className="flex gap-3 mt-10">
          <button
            onClick={prevScreen}
            disabled={currentScreen === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentScreen === 1
                ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800/50 text-white hover:bg-gray-700/50 border border-gray-700/50'
            }`}
          >
            Back
          </button>
          <button
            onClick={nextScreen}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 3 ? 'Complete Phase 1' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScreenContainerProps {
  icon: React.ReactNode;
  goldenHeader?: string;
  header: string;
  subtext: string;
  children: React.ReactNode;
}

function ScreenContainer({ icon, goldenHeader, header, subtext, children }: ScreenContainerProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">{icon}</div>
        {goldenHeader && (
          <p className="text-xs text-yellow-400/80 uppercase tracking-widest font-medium">{goldenHeader}</p>
        )}
        <h2 className="text-3xl font-bold text-white leading-tight">{header}</h2>
        <p className="text-lg text-gray-300">{subtext}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

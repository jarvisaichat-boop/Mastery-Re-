import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Brain, Target, ListChecks } from 'lucide-react';
import AIFeedback from './AIFeedback';

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
    northStar: profile.northStar || '',
    northStarTimeline: profile.northStarTimeline || '',
    deepDive: profile.deepDive || '',
    existingHabits: profile.existingHabits || [],
  });

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 6) {
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
      case 4: return data.northStar && data.northStar.length > 0;
      case 5: return data.deepDive && data.deepDive.length > 0;
      case 6: return true; // Existing habits are optional
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
              className="w-full h-64 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              autoFocus
            />
            {data.context && data.context.length > 50 && (
              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg text-sm text-blue-300">
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
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                    data.mentalState === option.value
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white">{option.label}</p>
                    <p className="text-sm text-gray-400">{option.sub}</p>
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
            <div className="space-y-3">
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
                placeholder="Location (Optional)"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={data.occupation}
                onChange={(e) => updateData({ occupation: e.target.value })}
                placeholder="Occupation"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={data.interests}
                onChange={(e) => updateData({ interests: e.target.value })}
                placeholder="Interests (Business, Fitness, Creative, etc.)"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </ScreenContainer>
        );

      case 4:
        return (
          <ScreenContainer
            icon={<Target className="w-12 h-12 text-green-400" />}
            goldenHeader="Who is the version of you that wins?"
            header="The North Star (Goal)"
            subtext="What is your ONE main goal?"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={data.northStar}
                onChange={(e) => updateData({ northStar: e.target.value })}
                placeholder="e.g., Launch my business, Get fit, Learn piano"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-lg"
                autoFocus
              />
              <div>
                <p className="text-sm text-gray-400 mb-2">Timeline:</p>
                <div className="flex gap-3">
                  {(['1 Month', '3 Months'] as const).map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => updateData({ northStarTimeline: timeline })}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        data.northStarTimeline === timeline
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
              
              {data.northStar && data.northStarTimeline && (
                <AIFeedback 
                  message={
                    data.northStarTimeline === '1 Month'
                      ? `A 1-month timeline for "${data.northStar}" is ambitious! This creates urgency and focus. We'll design micro-habits that compound fast to hit this goal.`
                      : `3 months for "${data.northStar}" gives us room to build sustainable systems. You're thinking long-term - that's the path to mastery.`
                  }
                  type="insight"
                />
              )}
            </div>
          </ScreenContainer>
        );

      case 5:
        return (
          <ScreenContainer
            icon={<span className="text-5xl">🔍</span>}
            goldenHeader="Why does this matter?"
            header="Deep Dive Reasoning"
            subtext="What happens if you DON'T achieve this?"
          >
            <textarea
              value={data.deepDive}
              onChange={(e) => updateData({ deepDive: e.target.value })}
              placeholder="Describe what's at stake... What does success look like? What happens if you fail?"
              className="w-full h-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              autoFocus
            />
          </ScreenContainer>
        );

      case 6:
        return (
          <ScreenContainer
            icon={<ListChecks className="w-12 h-12 text-cyan-400" />}
            goldenHeader="What do you do even on your worst days?"
            header="The Baseline"
            subtext="List your current habits (Safe list)."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                {data.existingHabits && data.existingHabits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <span className="flex-1 text-white">{habit.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                      Safe
                    </span>
                    <button
                      onClick={() => {
                        const updated = data.existingHabits!.filter((_, i) => i !== index);
                        updateData({ existingHabits: updated });
                      }}
                      className="text-red-400 hover:text-red-300 text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="new-habit-input"
                  placeholder="Type a habit and press Enter"
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const newHabit = { name: e.currentTarget.value.trim(), isSafe: true };
                      updateData({ existingHabits: [...(data.existingHabits || []), newHabit] });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                These habits are marked as "Safe" and won't be changed
              </p>
            </div>
          </ScreenContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Phase 1: The Download</span>
            <span>Screen {currentScreen} of 6</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 6) * 100}%` }}
            />
          </div>
        </div>

        {renderScreen()}

        <div className="flex gap-3 mt-8">
          <button
            onClick={prevScreen}
            disabled={currentScreen === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentScreen === 1
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Back
          </button>
          <button
            onClick={nextScreen}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 6 ? 'Complete Phase 1' : 'Next'}
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
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        {goldenHeader && (
          <p className="text-sm text-yellow-500 mb-2 uppercase tracking-wider">{goldenHeader}</p>
        )}
        <h2 className="text-2xl font-bold text-white mb-2">{header}</h2>
        <p className="text-gray-400">{subtext}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

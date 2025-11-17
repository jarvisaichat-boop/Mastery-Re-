import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Target, ListChecks, Sparkles } from 'lucide-react';
import ConversationalArchitect from './ConversationalArchitect';

interface Phase4ArchitectProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase4Architect({ profile, onComplete }: Phase4ArchitectProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    northStar: profile.northStar || '',
    northStarTimeline: profile.northStarTimeline || '3 Months',
    existingHabits: profile.existingHabits || [],
    logicTreeRoot: profile.logicTreeRoot || '',
    logicTreeBranch: profile.logicTreeBranch || '',
    logicTreeLeaf: profile.logicTreeLeaf || '',
    canEnvisionPath: profile.canEnvisionPath || false,
  });

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 4) {
      setCurrentScreen(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevScreen = () => {
    setCurrentScreen(prev => prev - 1);
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.northStar && data.northStar.length > 0;
      case 2: return true; // Existing habits are optional
      case 3: return data.logicTreeBranch && data.logicTreeLeaf && 
                     data.logicTreeBranch.length > 0 && data.logicTreeLeaf.length > 0;
      case 4: return data.canEnvisionPath;
      default: return false;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <ScreenContainer
            icon={<Target className="w-12 h-12 text-blue-400" />}
            goldenHeader="Let's get clear on your destination."
            header="What do you want to achieve?"
            subtext="Your north star goal"
          >
            <div className="space-y-4">
              <textarea
                value={data.northStar}
                onChange={(e) => {
                  const goal = e.target.value;
                  updateData({ 
                    northStar: goal,
                    logicTreeRoot: goal // Goal becomes the root
                  });
                }}
                placeholder="e.g., Launch my business, Get fit, Learn a new skill, Make $100K"
                className="w-full h-32 px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-lg placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                autoFocus
              />
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Timeline:</p>
                <div className="flex gap-3">
                  {(['1 Month', '3 Months', '6 Months', '1 Year'] as const).map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => updateData({ northStarTimeline: timeline })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        data.northStarTimeline === timeline
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                          : 'bg-gray-900/30 border-gray-700/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScreenContainer>
        );

      case 2:
        return (
          <ScreenContainer
            icon={<ListChecks className="w-12 h-12 text-cyan-400" />}
            goldenHeader="What's already working?"
            header="Your Current Habits"
            subtext="List what you're already doing that could support this goal"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                {data.existingHabits && data.existingHabits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg border-2 border-gray-700/50">
                    <span className="flex-1 text-white text-base">{habit.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 font-medium">
                      ✓ Active
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
                {(!data.existingHabits || data.existingHabits.length === 0) && (
                  <div className="p-6 bg-gray-900/20 border-2 border-dashed border-gray-700/50 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">No habits added yet</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="new-habit-input"
                  placeholder="Type a habit and press Enter (e.g., Morning workout, Daily reading)"
                  className="flex-1 px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const newHabit = { name: e.currentTarget.value.trim(), isSafe: true };
                      updateData({ existingHabits: [...(data.existingHabits || []), newHabit] });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <p className="text-sm text-gray-400">
                💡 These help me understand what's already part of your routine
              </p>
            </div>
          </ScreenContainer>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <ConversationalArchitect
              goal={data.northStar || ''}
              existingHabits={data.existingHabits || []}
              aiPersona={profile.aiPersona || 'Drill Sergeant'}
              onLogicComplete={(logicTree) => {
                updateData({
                  logicTreeBranch: logicTree.milestone,
                  logicTreeLeaf: logicTree.action,
                });
                // Auto-advance after logic tree is complete
                setTimeout(() => nextScreen(), 1000);
              }}
            />
          </div>
        );

      case 4:
        return (
          <ScreenContainer
            icon={<Sparkles className="w-12 h-12 text-purple-400" />}
            goldenHeader="Let's visualize the path."
            header="Can you envision this?"
            subtext="Your roadmap to success"
          >
            <div className="space-y-6">
              <div className="p-6 bg-gray-900 border border-gray-700 rounded-2xl space-y-4">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Your Daily Action</p>
                    <p className="text-xl text-orange-400 font-bold">
                      {data.logicTreeLeaf}
                    </p>
                  </div>
                  
                  <div className="text-2xl text-gray-500">↓</div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Leads to Milestone</p>
                    <p className="text-xl text-blue-400 font-bold">
                      {data.logicTreeBranch}
                    </p>
                  </div>
                  
                  <div className="text-2xl text-gray-500">↓</div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Achieves Goal</p>
                    <p className="text-xl text-green-400 font-bold">
                      {data.northStar}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-lg text-gray-300">
                  Can you see yourself walking this path?
                </p>
                <p className="text-sm text-gray-400">
                  Close your eyes for a moment. Imagine doing "{data.logicTreeLeaf}" consistently. 
                  Can you envision how this leads to "{data.logicTreeBranch}" and ultimately "{data.northStar}"?
                </p>
              </div>

              <button
                onClick={() => updateData({ canEnvisionPath: true })}
                className={`w-full px-8 py-6 rounded-xl font-bold text-xl transition-all ${
                  data.canEnvisionPath
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 text-white transform hover:scale-[1.02]'
                }`}
              >
                {data.canEnvisionPath ? '✓ Yes, I can see it clearly' : 'Yes, I can envision this path'}
              </button>

              {data.canEnvisionPath && (
                <div className="p-4 bg-purple-500/20 border border-purple-500/40 rounded-xl text-center">
                  <p className="text-purple-300 text-sm">
                    🎯 Perfect. This mental clarity is your competitive advantage.
                  </p>
                </div>
              )}
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
            <span className="font-medium">Phase 4: The Architect</span>
            <span>Screen {currentScreen} of 4</span>
          </div>
          <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 4) * 100}%` }}
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
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 4 ? 'Complete Phase 4' : 'Next'}
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

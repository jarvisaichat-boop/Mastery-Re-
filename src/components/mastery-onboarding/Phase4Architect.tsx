import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Target, GitBranch } from 'lucide-react';
import AIFeedback from './AIFeedback';

interface Phase4ArchitectProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase4Architect({ profile, onComplete }: Phase4ArchitectProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    specificMetric: profile.specificMetric || '',
    logicTreeRoot: profile.logicTreeRoot || '',
    logicTreeBranch: profile.logicTreeBranch || '',
    logicTreeLeaf: profile.logicTreeLeaf || '',
    agreedToLogic: profile.agreedToLogic || false,
  });
  const [showMilestoneSuggestions, setShowMilestoneSuggestions] = useState(false);
  const [showActionSuggestions, setShowActionSuggestions] = useState(false);
  const [milestoneEntered, setMilestoneEntered] = useState(false);
  const [actionEntered, setActionEntered] = useState(false);
  
  const generateMilestoneSuggestions = () => {
    const goal = profile.northStar || '';
    if (goal.toLowerCase().includes('business') || goal.toLowerCase().includes('freelance') || goal.toLowerCase().includes('revenue')) {
      return ['8 clients paying $100 each', '2 clients at $400 each', '40 sales of $20 product'];
    } else if (goal.toLowerCase().includes('fit') || goal.toLowerCase().includes('weight') || goal.toLowerCase().includes('body')) {
      return ['Lose 15 lbs', 'Hit 15% body fat', 'Run 5K without stopping'];
    } else if (goal.toLowerCase().includes('learn') || goal.toLowerCase().includes('skill')) {
      return ['Complete 30-day course', 'Build 3 real projects', 'Practice 100 hours'];
    }
    return ['Define clear milestone', 'Set measurable checkpoint', 'Create progress target'];
  };
  
  const generateActionSuggestions = () => {
    const milestone = data.logicTreeBranch || '';
    const archetype = profile.archetype || '';
    if (milestone.toLowerCase().includes('client')) {
      return ['Reach out to 5 potential clients daily', 'Post valuable content 3x/week', 'Network for 30 min daily'];
    } else if (milestone.toLowerCase().includes('weight') || milestone.toLowerCase().includes('fat')) {
      return ['Track calories for every meal', 'Walk 10k steps daily', 'Workout 20 min daily'];
    } else if (milestone.toLowerCase().includes('course') || milestone.toLowerCase().includes('project')) {
      return ['Study for 25 min daily', 'Code for 1 hour daily', 'Practice skills for 30 min daily'];
    }
    
    if (archetype === 'Commander') {
      return ['Create daily system', 'Track metrics daily', 'Optimize process daily'];
    } else if (archetype === 'Warrior') {
      return ['Push through resistance daily', 'Show up no matter what', 'Complete daily challenge'];
    }
    return ['Take consistent action daily', 'Build momentum daily', 'Make progress daily'];
  };

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
    setCurrentScreen(prev => prev - 1);
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.specificMetric && data.specificMetric.length > 0 && data.logicTreeRoot && data.logicTreeRoot.length > 0;
      case 2: return data.logicTreeRoot && data.logicTreeBranch && data.logicTreeLeaf && data.logicTreeRoot.length > 0 && data.logicTreeBranch.length > 0 && data.logicTreeLeaf.length > 0;
      case 3: return data.agreedToLogic;
      default: return false;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <ScreenContainer
            icon={<Target className="w-12 h-12 text-green-400" />}
            goldenHeader="Let's make it concrete."
            header="The Reality Check"
            subtext="Define the specific metric"
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-900 border border-gray-700 rounded-xl">
                <p className="text-gray-300 mb-3">
                  Your Goal: <span className="text-white font-bold">{profile.northStar}</span>
                </p>
                <p className="text-sm text-gray-400">What's the measurable outcome?</p>
              </div>
              <input
                type="text"
                value={data.specificMetric}
                onChange={(e) => updateData({ 
                  specificMetric: e.target.value,
                  logicTreeRoot: e.target.value 
                })}
                placeholder="e.g., $10k/mo, 10% Body Fat, 5 Clients"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none text-lg"
                autoFocus
              />
              <p className="text-xs text-gray-500">
                This creates a target that removes the "blank canvas" paralysis
              </p>
            </div>
          </ScreenContainer>
        );

      case 2:
        return (
          <ScreenContainer
            icon={<GitBranch className="w-12 h-12 text-blue-400" />}
            goldenHeader="Visual Breakdown"
            header="The Logic Tree"
            subtext="Breaking down your goal into logical steps"
          >
            <div className="space-y-6">
              {/* Root */}
              <div className="p-4 bg-gradient-to-r from-green-900/30 to-green-800/20 border-2 border-green-500/40 rounded-xl">
                <div className="text-xs text-green-400 uppercase mb-1">🌳 Root (Goal)</div>
                <p className="text-white font-bold">{data.logicTreeRoot}</p>
              </div>

              {/* Milestone Section */}
              <div className="pl-8 space-y-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="w-8 h-px bg-gray-600"></div>
                  <span>To get this goal, you need...</span>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-2 border-blue-500/40 rounded-xl space-y-3">
                  <div className="text-xs text-blue-400 uppercase">🌿 Branch (Milestone)</div>
                  
                  <div className="p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">
                      Let's talk about your <span className="text-blue-400 font-bold">milestone</span> - the intermediate step to {data.specificMetric}.
                    </p>
                    <p className="text-sm text-gray-400">
                      A milestone is a goal defining what needs to come to reality for your main goal to be achieved. 
                      For example: <span className="text-blue-300 italic">8 clients paying $100 each</span>.
                    </p>
                  </div>
                  
                  {!milestoneEntered && (
                    <>
                      <p className="text-sm text-gray-300">
                        What do you think it should be? Do you already have something in mind?
                      </p>
                      <input
                        type="text"
                        value={data.logicTreeBranch}
                        onChange={(e) => {
                          updateData({ logicTreeBranch: e.target.value });
                          if (e.target.value.length > 3) {
                            setMilestoneEntered(true);
                          }
                        }}
                        placeholder="Type your milestone here..."
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                      
                      {!showMilestoneSuggestions && (
                        <button
                          onClick={() => setShowMilestoneSuggestions(true)}
                          className="text-sm text-blue-400 hover:text-blue-300 underline"
                        >
                          Not sure? I can suggest options you can edit.
                        </button>
                      )}
                      
                      {showMilestoneSuggestions && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400">Tap to use (you can edit after):</p>
                          {generateMilestoneSuggestions().map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                updateData({ logicTreeBranch: suggestion });
                                setMilestoneEntered(true);
                                setShowMilestoneSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 transition-all"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  {milestoneEntered && data.logicTreeBranch && (
                    <>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-white font-medium mb-1">{data.logicTreeBranch}</p>
                        <button
                          onClick={() => setMilestoneEntered(false)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                      </div>
                      <AIFeedback
                        message={`"${data.logicTreeBranch}" - I like this because it's specific and measurable. This milestone breaks down ${data.specificMetric} into a concrete checkpoint you can track and celebrate.`}
                        type="success"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Action Section - Only show after milestone is entered */}
              {milestoneEntered && data.logicTreeBranch && (
                <div className="pl-16 space-y-3">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <div className="w-8 h-px bg-gray-600"></div>
                    <span>To get that milestone, you must...</span>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-2 border-orange-500/40 rounded-xl space-y-3">
                    <div className="text-xs text-orange-400 uppercase">🍃 Leaf (Action)</div>
                    
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">
                        Now let's define your <span className="text-orange-400 font-bold">action</span> - the daily habit that makes the milestone happen.
                      </p>
                      <p className="text-sm text-gray-400">
                        An action is what you'll do consistently to reach your milestone. 
                        For example: <span className="text-orange-300 italic">reach out to 5 potential clients daily</span>.
                      </p>
                    </div>
                    
                    {!actionEntered && (
                      <>
                        <p className="text-sm text-gray-300">
                          What do you think your daily action should be?
                        </p>
                        <input
                          type="text"
                          value={data.logicTreeLeaf}
                          onChange={(e) => {
                            updateData({ logicTreeLeaf: e.target.value });
                            if (e.target.value.length > 3) {
                              setActionEntered(true);
                            }
                          }}
                          placeholder="Type your action here..."
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                        />
                        
                        {!showActionSuggestions && (
                          <button
                            onClick={() => setShowActionSuggestions(true)}
                            className="text-sm text-orange-400 hover:text-orange-300 underline"
                          >
                            Not sure? I can suggest options you can edit.
                          </button>
                        )}
                        
                        {showActionSuggestions && (
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400">Tap to use (you can edit after):</p>
                            {generateActionSuggestions().map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  updateData({ logicTreeLeaf: suggestion });
                                  setActionEntered(true);
                                  setShowActionSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 transition-all"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    
                    {actionEntered && data.logicTreeLeaf && (
                      <>
                        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                          <p className="text-white font-medium mb-1">{data.logicTreeLeaf}</p>
                          <button
                            onClick={() => setActionEntered(false)}
                            className="text-xs text-orange-400 hover:text-orange-300"
                          >
                            Edit
                          </button>
                        </div>
                        <AIFeedback
                          message={`Perfect. Here's the logic chain: "${data.logicTreeLeaf}" (daily action) → "${data.logicTreeBranch}" (milestone) → "${data.logicTreeRoot}" (goal). This is your roadmap. Simple, measurable, achievable.`}
                          type="success"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScreenContainer>
        );

      case 3:
        return (
          <ScreenContainer
            icon={<span className="text-5xl">🤝</span>}
            goldenHeader="Does this logic hold up?"
            header="The Agreement"
            subtext="Psychological contract"
          >
            <div className="space-y-6">
              <div className="p-6 bg-gray-900 border border-gray-700 rounded-2xl space-y-4">
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-4">
                    Do you agree that consistent <span className="text-orange-400 font-bold">{data.logicTreeLeaf}</span>
                  </p>
                  <p className="text-lg text-gray-300 mb-4">
                    will lead to <span className="text-blue-400 font-bold">{data.logicTreeBranch}</span>
                  </p>
                  <p className="text-lg text-gray-300">
                    which makes <span className="text-green-400 font-bold">{data.logicTreeRoot}</span> realistic?
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateData({ agreedToLogic: true })}
                className={`w-full px-8 py-6 rounded-xl font-bold text-xl transition-all ${
                  data.agreedToLogic
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-green-700 to-blue-700 hover:from-green-600 hover:to-blue-600 text-white transform hover:scale-[1.02]'
                }`}
              >
                {data.agreedToLogic ? '✓ I Agree (Logic Accepted)' : 'I Agree'}
              </button>

              {data.agreedToLogic && (
                <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-center">
                  <p className="text-green-300 text-sm">
                    🎯 Commitment recorded. This system is now smarter than willpower alone.
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Phase 4: The Architect</span>
            <span>Screen {currentScreen} of 3</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 3) * 100}%` }}
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
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 3 ? 'Complete Phase 4' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScreenContainerProps {
  icon?: React.ReactNode;
  goldenHeader?: string;
  header: string;
  subtext: string;
  children: React.ReactNode;
}

function ScreenContainer({ icon, goldenHeader, header, subtext, children }: ScreenContainerProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
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

import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Brain, Target, Copy, AlertTriangle } from 'lucide-react';

interface Phase1ContextBaselineProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase1ContextBaseline({ profile, onComplete }: Phase1ContextBaselineProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState({
    // Screen 1: Motivation
    goals: profile.goals || [] as string[],
    baselineStats: profile.baselineStats || {
      motivation: 5,
      discipline: 5,
      consistency: 5,
      clarity: 5,
      satisfaction: 5
    },

    // Screen 2: Distractions
    obstacles: profile.obstacles || [] as Array<{ name: string, category: 'digital' | 'mental' | 'environmental', impact: number }>,

  // Screen 3: Identity
    context: profile.context || '',
    name: profile.name || '',
    age: profile.age || '',
    occupation: profile.occupation || '',
    location: profile.location || '',
  });

  const GOAL_OPTIONS = [
    'Build a routine',
    'Stop procrastinating',
    'Break a bad habit',
    'Achieve a massive goal',
    'Other'
  ];

  const OBSTACLE_TAGS = [
    { name: 'TikTok/Reels', category: 'digital' as const },
    { name: 'Porn', category: 'digital' as const },
    { name: 'Video Games', category: 'digital' as const },
    { name: 'News/Politics', category: 'digital' as const },
    { name: 'Procrastination', category: 'mental' as const },
    { name: 'Anxiety', category: 'mental' as const },
    { name: 'Brain Fog', category: 'mental' as const },
    { name: 'Perfectionism', category: 'mental' as const },
    { name: 'Work Stress', category: 'environmental' as const },
    { name: 'Family Obligations', category: 'environmental' as const },
    { name: 'Money', category: 'environmental' as const },
    { name: 'Partner', category: 'environmental' as const },
  ];

  const toggleGoal = (goal: string) => {
    const current = data.goals;
    if (current.includes(goal)) {
      setData(prev => ({ ...prev, goals: current.filter(g => g !== goal) }));
    } else {
      setData(prev => ({ ...prev, goals: [...current, goal] }));
    }
  };

  const updateStat = (key: keyof typeof data.baselineStats, value: number) => {
    setData(prev => ({
      ...prev,
      baselineStats: { ...prev.baselineStats, [key]: value }
    }));
  };

  const toggleObstacle = (tag: typeof OBSTACLE_TAGS[0]) => {
    const exists = data.obstacles.find(o => o.name === tag.name);
    if (exists) {
      setData(prev => ({ ...prev, obstacles: prev.obstacles.filter(o => o.name !== tag.name) }));
    } else {
      setData(prev => ({
        ...prev,
        obstacles: [...prev.obstacles, { name: tag.name, category: tag.category, impact: 50 }]
      }));
    }
  };

  const updateObstacleImpact = (name: string, impact: number) => {
    setData(prev => ({
      ...prev,
      obstacles: prev.obstacles.map(o => o.name === name ? { ...o, impact } : o)
    }));
  };

  const handleCopyPrompt = () => {
    const prompt = "Analyze our chat history. Summarize my core values, goals, and distractions so I can paste them into my Action OS program.";
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied to clipboard!");
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.goals.length > 0;
      case 2: return data.obstacles.length > 0; // At least one obstacle? Or optional? Let's say optional but encouraged.
      case 3: return data.name !== '' && data.age !== '';
      default: return false;
    }
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

  const renderScreen = () => {
    switch (currentScreen) {
      // SCREEN 1: MOTIVATION
      case 1:
        return (
          <ScreenContainer
            icon={<Target className="w-12 h-12 text-blue-500" />}
            goldenHeader="STEP 1 OF 3"
            header="Why are you here?"
            subtext="Be honest. This sets your baseline."
          >
            {/* Goal Selection */}
            <div className="space-y-4 mb-10">
              <label className="text-gray-400 text-sm uppercase tracking-wider font-bold">I need to...</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-xl border transition-all text-left ${data.goals.includes(goal)
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Calibration Sliders */}
            <div className="space-y-6">
              <label className="text-gray-400 text-sm uppercase tracking-wider font-bold">Rate yourself (0-10)</label>

              <SliderRow label="Motivation" value={data.baselineStats.motivation} onChange={v => updateStat('motivation', v)} />
              <SliderRow label="Discipline" value={data.baselineStats.discipline} onChange={v => updateStat('discipline', v)} />
              <SliderRow label="Consistency" value={data.baselineStats.consistency} onChange={v => updateStat('consistency', v)} />
              <SliderRow label="Clarity (Do you know what to do?)" value={data.baselineStats.clarity} onChange={v => updateStat('clarity', v)} />
              <SliderRow label="Satisfaction (How is life going?)" value={data.baselineStats.satisfaction} onChange={v => updateStat('satisfaction', v)} />
            </div>
          </ScreenContainer>
        );

      // SCREEN 2: DISTRACTIONS
      case 2:
        return (
          <ScreenContainer
            icon={<AlertTriangle className="w-12 h-12 text-yellow-500" />}
            goldenHeader="STEP 2 OF 3"
            header="What is stopping you?"
            subtext="Select what steals your attention, then rate the impact."
          >
            {/* Tag Cloud */}
            <div className="mb-10">
              <div className="flex flex-wrap gap-3">
                {OBSTACLE_TAGS.map(tag => {
                  const isSelected = data.obstacles.some(o => o.name === tag.name);
                  return (
                    <button
                      key={tag.name}
                      onClick={() => toggleObstacle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected
                        ? 'bg-yellow-500 text-black border-yellow-500'
                        : 'bg-black/40 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Impact Meter */}
            {data.obstacles.length > 0 && (
              <div className="space-y-6 animate-fadeIn">
                <label className="text-gray-400 text-sm uppercase tracking-wider font-bold">Rate the Impact Level</label>
                {data.obstacles.map(obs => (
                  <div key={obs.name} className="bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{obs.name}</span>
                      <span className="text-yellow-500 font-bold">{obs.impact}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={obs.impact}
                      onChange={(e) => updateObstacleImpact(obs.name, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {data.obstacles.length === 0 && (
              <p className="text-center text-gray-500 italic">Select clear obstacles to continue...</p>
            )}
          </ScreenContainer>
        );

      // SCREEN 3: IDENTITY
      case 3:
        return (
          <ScreenContainer
            icon={<Brain className="w-12 h-12 text-purple-500" />}
            goldenHeader="STEP 3 OF 3"
            header="Profile"
            subtext="Initialize your identity."
          >
            {/* AI Context Injection */}
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 text-sm uppercase tracking-wider font-bold">AI Context Injection</label>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  <Copy size={12} /> Copy Prompt
                </button>
              </div>

              <textarea
                value={data.context}
                onChange={(e) => setData({ ...data, context: e.target.value })}
                placeholder="Paste the AI summary here..."
                className="w-full h-32 px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase font-bold">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase font-bold">Age <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  placeholder="Age"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase font-bold">Occupation</label>
                <input
                  type="text"
                  value={data.occupation}
                  onChange={(e) => setData({ ...data, occupation: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase font-bold">Location</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 outline-none"
                />
              </div>
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
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span className="font-medium">Phase 1: Baseline</span>
            <span>Screen {currentScreen} of 3</span>
          </div>
          <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${currentScreen === 1 ? 'bg-blue-500' :
                currentScreen === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                }`}
              style={{ width: `${(currentScreen / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderScreen()}

        {/* Navigation Buttons */}
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
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg'
                : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 3 ? 'Complete Baseline' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ScreenContainer({ icon, goldenHeader, header, subtext, children }: any) {
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

function SliderRow({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-blue-400 font-bold">{value}/10</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
      />
    </div>
  );
}

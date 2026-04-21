import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Eye, Brain, Plus, X, Check } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase4PathProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  profile?: Partial<MasteryProfile>;
  onBack?: () => void;
}

type Step = 'goaldump' | 'goalpick' | 'lifegoals' | 'habit' | 'microwin' | 'vision' | 'confirm';
const STEPS: Step[] = ['goaldump', 'goalpick', 'lifegoals', 'habit', 'microwin', 'vision', 'confirm'];

export default function Phase4Path({ onComplete, profile, onBack }: Phase4PathProps) {
  const { data, updatePath } = useVisionBoard();
  const { path } = data;

  const [step, setStep] = useState<Step>('goaldump');

  // Step 1a — Goal dump list
  const [goalList, setGoalList] = useState<string[]>([]);
  const [draftGoal, setDraftGoal] = useState('');
  const draftInputRef = useRef<HTMLInputElement>(null);

  // Step 1b — Selected primary goal
  const [rawGoal, setRawGoal] = useState(profile?.rawGoal || '');

  // Step 3 — Life Goals
  const [currentProject, setCurrentProject] = useState(path.projects?.[0]?.text || '');
  const [quarterlyGoal, setQuarterlyGoal] = useState(path.quarterlyGoals?.[0]?.text || '');

  // Step 4 — Habit
  const [habitData, setHabitData] = useState({
    name: '',
    microMethod: '',
    frequency: 'daily' as 'daily' | 'weekly'
  });

  // Step 6 — Vision (synthesis)
  const [visionInputs, setVisionInputs] = useState({ do: '', feel: '', give: '' });
  const [synthesizedVision, setSynthesizedVision] = useState(path.vision);

  useEffect(() => {
    if (visionInputs.do || visionInputs.feel || visionInputs.give) {
      const sentence = `To ${visionInputs.do} feeling ${visionInputs.feel}, giving me ${visionInputs.give}.`;
      setSynthesizedVision(sentence);
    }
  }, [visionInputs.do, visionInputs.feel, visionInputs.give]);

  const addGoal = () => {
    const trimmed = draftGoal.trim();
    if (!trimmed) return;
    setGoalList(prev => [...prev, trimmed]);
    setDraftGoal('');
    draftInputRef.current?.focus();
  };

  const removeGoal = (index: number) => {
    setGoalList(prev => prev.filter((_, i) => i !== index));
    if (rawGoal === goalList[index]) setRawGoal('');
  };

  const toNextStep = () => {
    switch (step) {
      case 'goaldump':
        // Add any unsaved draft before continuing
        if (draftGoal.trim()) {
          setGoalList(prev => [...prev, draftGoal.trim()]);
          setDraftGoal('');
        }
        setStep('goalpick');
        break;
      case 'goalpick':
        setStep('lifegoals');
        break;
      case 'lifegoals':
        if (currentProject) updatePath({ projects: [{ text: currentProject, hidden: false }] });
        if (quarterlyGoal) updatePath({ quarterlyGoals: [{ text: quarterlyGoal, hidden: false }] });
        setStep('habit');
        break;
      case 'habit':
        setStep('microwin');
        break;
      case 'microwin':
        setStep('vision');
        break;
      case 'vision':
        if (synthesizedVision) updatePath({ vision: synthesizedVision });
        setStep('confirm');
        break;
    }
  };

  const toPrevStep = () => {
    switch (step) {
      case 'goaldump':  onBack?.(); break;
      case 'goalpick':  setStep('goaldump'); break;
      case 'lifegoals': setStep('goalpick'); break;
      case 'habit':     setStep('lifegoals'); break;
      case 'microwin':  setStep('habit'); break;
      case 'vision':    setStep('microwin'); break;
      case 'confirm':   setStep('vision'); break;
    }
  };

  const handleFinish = () => {
    updatePath({
      vision: synthesizedVision,
      projects: [{ text: currentProject, hidden: false }],
      quarterlyGoals: [{ text: quarterlyGoal, hidden: false }]
    });

    onComplete({
      rawGoal,
      proposedHabit: {
        name: habitData.name,
        description: `Micro Win: ${habitData.microMethod}`,
        duration: 15,
        difficulty: 'moderate'
      },
      acceptedHabit: true,
      finalHabitDuration: 15,
    });
  };

  // Continue button is disabled on goalpick until one is selected
  const canContinue = step !== 'goalpick' || !!rawGoal;

  const currentIndex = STEPS.indexOf(step);

  const renderStepContent = () => {
    switch (step) {

      case 'goaldump':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 1 of {STEPS.length}</p>
              <h3 className="text-3xl font-bold text-white leading-tight">What do you want?</h3>
              <p className="text-gray-300 text-sm">Add everything on your mind — goals, dreams, things you've been thinking about. Don't sort it, don't filter it.</p>
              <p className="text-gray-600 text-xs">We'll help you find the most important one next.</p>
            </div>

            {/* Input + Add */}
            <div className="flex gap-2">
              <input
                ref={draftInputRef}
                type="text"
                value={draftGoal}
                onChange={e => setDraftGoal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addGoal()}
                placeholder="Type a goal and press Add..."
                className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
              />
              <button
                onClick={addGoal}
                disabled={!draftGoal.trim()}
                className="flex items-center gap-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold rounded-xl transition-all"
              >
                <Plus size={18} /> Add
              </button>
            </div>

            {/* Goal List */}
            {goalList.length > 0 && (
              <div className="space-y-2">
                {goalList.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3"
                  >
                    <span className="text-white text-sm">{goal}</span>
                    <button
                      onClick={() => removeGoal(i)}
                      className="text-gray-600 hover:text-red-400 transition-colors ml-3 shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {goalList.length === 0 && (
              <p className="text-gray-700 text-xs text-center pt-2">Your goals will appear here as you add them.</p>
            )}
          </div>
        );

      case 'goalpick':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 2 of {STEPS.length}</p>
              <h3 className="text-3xl font-bold text-white leading-tight">Now — which one matters most?</h3>
              <p className="text-gray-300 text-sm font-medium">Choose the one thing you want to achieve the most — the goal that would have the greatest meaning for your life.</p>
              <p className="text-gray-500 text-xs">Tap to select. Everything else builds from this.</p>
            </div>

            <div className="space-y-3">
              {goalList.length > 0 ? goalList.map((goal, i) => {
                const selected = rawGoal === goal;
                return (
                  <button
                    key={i}
                    onClick={() => setRawGoal(goal)}
                    className={`w-full flex items-center justify-between text-left px-5 py-4 rounded-2xl border transition-all duration-200 ${
                      selected
                        ? 'bg-yellow-500/15 border-yellow-500 text-white'
                        : 'bg-gray-900/50 border-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{goal}</span>
                    {selected && (
                      <span className="shrink-0 ml-3 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Check size={14} className="text-black" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              }) : (
                <div className="text-center py-8 space-y-2">
                  <p className="text-gray-500 text-sm">No goals added yet.</p>
                  <button onClick={() => setStep('goaldump')} className="text-yellow-500 text-xs underline">Go back and add some</button>
                </div>
              )}
            </div>

            {rawGoal && (
              <p className="text-yellow-500/60 text-xs text-center pt-2">
                Selected: "{rawGoal}"
              </p>
            )}
          </div>
        );

      case 'lifegoals':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 3 of {STEPS.length}</p>
              <h3 className="text-2xl font-bold text-yellow-500">Life Goals</h3>
              {rawGoal ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-yellow-500/70 mb-1">Your most meaningful goal:</p>
                  <p className="text-white text-sm font-medium italic">"{rawGoal}"</p>
                  <p className="text-gray-500 text-xs mt-2">Now let's break that down by time. Don't worry if you're not sure — you can change these any time.</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Let's break your goal down by time frame. You can change these any time.</p>
              )}
            </div>

            {/* Long Term Goal */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Long Term Goal</p>
                <p className="text-lg font-bold text-yellow-500/70">The Project / Season (1 year+)</p>
              </div>
              <p className="text-gray-400 text-sm">
                What is the big <strong className="text-white">project or season</strong> you are currently building toward?
              </p>
              <input
                type="text"
                value={currentProject}
                onChange={e => setCurrentProject(e.target.value)}
                placeholder="e.g. Launch the App, Buy a House, Move abroad..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
              <p className="text-xs text-gray-700">Not sure yet? Add something for now — you can update it later.</p>
            </div>

            {/* Short Term Goal */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Short Term Goal</p>
                <p className="text-lg font-bold text-yellow-500/70">The Target (under 3 months)</p>
              </div>
              <p className="text-gray-400 text-sm">
                What is one <strong className="text-white">specific, measurable target</strong> you can hit in the next 3 months that proves you are moving?
              </p>
              <input
                type="text"
                value={quarterlyGoal}
                onChange={e => setQuarterlyGoal(e.target.value)}
                placeholder="e.g. Finish MVP Code, Run 10km, Land first job..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
              <p className="text-xs text-gray-700">Not sure yet? Add something for now — you can update it later.</p>
            </div>
          </div>
        );

      case 'habit':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 4 of {STEPS.length}</p>
              <h3 className="text-2xl font-bold text-yellow-500">The Daily Habit</h3>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                To hit that goal, what is the one specific action you must do regularly and turn into a habit?
              </p>
              <input
                type="text"
                value={habitData.name}
                onChange={e => setHabitData({ ...habitData, name: e.target.value })}
                placeholder="e.g. Write Code, Run, Meditate..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        );

      case 'microwin':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-widest">Step 5 of {STEPS.length}</p>
              <div className="flex items-center gap-3">
                <Brain className="text-purple-400" size={24} />
                <h3 className="text-2xl font-bold text-purple-400">The Micro Win</h3>
              </div>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4 text-sm">
                Human beings are weak. On days when you are sick or tired, what is the <strong>ridiculously easy version</strong> of this habit?
              </p>
              <input
                type="text"
                value={habitData.microMethod}
                onChange={e => setHabitData({ ...habitData, microMethod: e.target.value })}
                placeholder="e.g. Write 1 line of code, Put on running shoes..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 6 of {STEPS.length}</p>
              <h3 className="text-2xl font-bold text-yellow-500">Vision — Your Ideal Life</h3>
              <p className="text-gray-400 text-sm">You've named what you want and how you'll get there. Now let's capture the direction behind all of it.</p>
              <p className="text-gray-500 text-xs">This is your lifestyle orientation — not a goal, not a finish line. A direction.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">1. The Action (DO)</label>
                <p className="text-xs text-gray-500 mb-2">The core daily activity that defines how you want to spend your time — use a verb.</p>
                <input
                  type="text"
                  value={visionInputs.do}
                  onChange={e => setVisionInputs({ ...visionInputs, do: e.target.value })}
                  placeholder="e.g. Build software, Travel the world..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">2. The Feeling (FEEL)</label>
                <p className="text-xs text-gray-500 mb-2">The emotional state you're optimizing for — how you want to feel doing it every day.</p>
                <input
                  type="text"
                  value={visionInputs.feel}
                  onChange={e => setVisionInputs({ ...visionInputs, feel: e.target.value })}
                  placeholder="e.g. Alive, Confident, Peaceful..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">3. The Result (GIVE)</label>
                <p className="text-xs text-gray-500 mb-2">The outcome that makes it all worth it — what this lifestyle gives you.</p>
                <input
                  type="text"
                  value={visionInputs.give}
                  onChange={e => setVisionInputs({ ...visionInputs, give: e.target.value })}
                  placeholder="e.g. Financial Freedom, A seaside home..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                />
              </div>
            </div>

            {/* Live Vision Preview */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-yellow-500/80 uppercase tracking-widest">Your Vision</p>
              <div className="bg-black/40 p-5 rounded-xl border border-white/10 min-h-[80px]">
                {(visionInputs.do || visionInputs.feel || visionInputs.give) ? (
                  <textarea
                    value={synthesizedVision}
                    onChange={e => setSynthesizedVision(e.target.value)}
                    className="w-full bg-transparent text-lg font-light leading-relaxed text-white outline-none resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-600 text-base italic">Your vision will appear here as you type...</p>
                )}
              </div>
              <p className="text-xs text-gray-600">Feel free to edit it to make it flow better. Your goals will change — this shouldn't.</p>
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fadeIn text-center h-[50vh]">
            <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <Eye className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">Visualize It</h3>
            <p className="text-xl text-gray-300 max-w-md leading-relaxed">
              Close your eyes. Picture your worst day — tired, raining, no motivation.
              <br /><br />
              Can you see yourself doing this <strong>Micro Win</strong> ({habitData.microMethod || 'your micro win'})?
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              step === s ? 'w-8 bg-yellow-500' :
              currentIndex > i ? 'w-8 bg-yellow-500/50' : 'w-2 bg-gray-800'
            }`}
          />
        ))}
      </div>

      {renderStepContent()}

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={toPrevStep}
            className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          {step !== 'confirm' ? (
            <button
              onClick={toNextStep}
              disabled={!canContinue}
              className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
            >
              CONTINUE <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 py-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xl rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center"
            >
              Yes, I can see it.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

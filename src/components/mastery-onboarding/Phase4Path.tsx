import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, ArrowLeft, Eye, Brain } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase4PathProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  profile?: Partial<MasteryProfile>;
  onBack?: () => void;
}

export default function Phase4Path({ onComplete, profile, onBack }: Phase4PathProps) {
  const { data, updatePath } = useVisionBoard();
  const { path } = data;

  const [step, setStep] = useState<'vision' | 'lifegoals' | 'habit' | 'microwin' | 'confirm'>('vision');
  
  // Vision Inputs
  const [visionInputs, setVisionInputs] = useState({
    do: '',
    feel: '',
    give: ''
  });
  
  // Synthesized Vision
  const [synthesizedVision, setSynthesizedVision] = useState(path.vision);

  // Project (Short Term Vision)
  const [currentProject, setCurrentProject] = useState(path.projects?.[0]?.text || '');

  // Goals (Quarterly)
  const [quarterlyGoal, setQuarterlyGoal] = useState(path.quarterlyGoals?.[0]?.text || '');

  // Habit
  const [habitData, setHabitData] = useState({
    name: '', // Standard Habit
    microMethod: '', // Easy version
    frequency: 'daily' as 'daily' | 'weekly'
  });

  // Auto-generate vision sentence whenever inputs change
  useEffect(() => {
    if (visionInputs.do || visionInputs.feel || visionInputs.give) {
      const sentence = `To ${visionInputs.do} feeling ${visionInputs.feel}, giving me ${visionInputs.give}.`;
      setSynthesizedVision(sentence);
    }
  }, [visionInputs.do, visionInputs.feel, visionInputs.give]);

  const toNextStep = () => {
    switch (step) {
      case 'vision':
        if (synthesizedVision) updatePath({ vision: synthesizedVision });
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
        setStep('confirm');
        break;
    }
  };

  const toPrevStep = () => {
    switch (step) {
      case 'vision':    onBack?.(); break;
      case 'lifegoals': setStep('vision'); break;
      case 'habit':     setStep('lifegoals'); break;
      case 'microwin':  setStep('habit'); break;
      case 'confirm':   setStep('microwin'); break;
    }
  };

  const handleFinish = () => {
    // Save everything and proceed
    updatePath({
      vision: synthesizedVision,
      projects: [{ text: currentProject, hidden: false }],
      quarterlyGoals: [{ text: quarterlyGoal, hidden: false }]
    });

    // Pass habit data to MasteryProfile
    onComplete({
      proposedHabit: {
        name: habitData.name, 
        description: `Micro Win: ${habitData.microMethod}`, // Storing micro win in description or we can pass custom field
        duration: 15,
        difficulty: 'moderate'
      },
      acceptedHabit: true,
      finalHabitDuration: 15,
      // We can also store the specific micro win if we update the profile type, 
      // but description is a safe place for now or we rely on 'description' field of the habit
    });
  };

  // Render sub-screens
  const renderStepContent = () => {
    switch (step) {
      case 'vision':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-yellow-500">Vision — Your Ideal Life</h3>

            {/* How To Note — always visible */}
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-4 space-y-4 text-xs text-gray-400">
              <p className="text-xs font-semibold text-yellow-500/80 uppercase tracking-widest">How to think about this</p>
              <div className="space-y-2">
                <p>Most people have never structured their goals by time frame — and that's normal. Goals tend to live as a mix of vague wants, urgent to-dos, and big life ambitions all jumbled together.</p>
                <p>This app helps you sort them. Here's how the layers work:</p>
              </div>
              <div className="space-y-2">
                <div className="flex gap-3 items-start">
                  <span className="text-yellow-500 font-bold shrink-0">Vision</span>
                  <span>The lifestyle you want — not a finish line, just a direction. <span className="text-gray-500 italic">"Build things that give me freedom."</span></span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-yellow-500/70 font-bold shrink-0 whitespace-nowrap">Long Term</span>
                  <span>The big project or season you are in right now. <span className="text-gray-500 italic">"Move to a new city and build a career there."</span></span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-yellow-500/50 font-bold shrink-0 whitespace-nowrap">Short Term</span>
                  <span>One specific win you can hit in the next 3 months. <span className="text-gray-500 italic">"Land my first job in the new city."</span></span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-yellow-500/30 font-bold shrink-0">Habit</span>
                  <span>The daily action that moves all of the above forward. <span className="text-gray-500 italic">"Apply to 2 jobs every morning."</span></span>
                </div>
              </div>
              <p className="text-gray-600">Don't overthink it — just answer what feels true right now. You can update any of this later.</p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-300 text-sm font-medium italic">"This is your direction, not a destination. Most people set goals. You're designing a life."</p>
              <p className="text-gray-500 text-xs">Define the lifestyle you are moving toward. This is intentionally open-ended — your goals will change, your vision shouldn't.</p>
              <p className="text-gray-600 text-xs italic">Ex. I want to work on my business that makes me feel fulfilled and give me financial freedom</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">1. The Action (DO)</label>
                <p className="text-xs text-gray-500 mb-2">The core daily activity that defines how you spend your time — use a verb.</p>
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
              <p className="text-sm font-medium text-yellow-500/80 uppercase tracking-widest">Does this vision sound about right?</p>
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
              <p className="text-xs text-gray-600">Feel free to edit it to make it flow better.</p>
            </div>
          </div>
        );

      case 'lifegoals':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-yellow-500">Life Goals</h3>

            {/* Long Term Goal */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Long Term Goal</p>
                <p className="text-lg font-bold text-yellow-500/70">The Project / Season (1 year+)</p>
              </div>
              <p className="text-gray-400 text-sm">
                What is the big <strong className="text-white">project or season</strong> you are currently building toward? The concrete thing your Vision is pushing you to create.
              </p>
              <input
                type="text"
                value={currentProject}
                onChange={e => setCurrentProject(e.target.value)}
                placeholder="e.g. Launch the App, Buy a House..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
            </div>

            {/* Short Term Goal */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Short Term Goal</p>
                <p className="text-lg font-bold text-yellow-500/70">The Target (under 3 months)</p>
              </div>
              <p className="text-gray-400 text-sm">
                What is one <strong className="text-white">specific, measurable target</strong> achievable in the next 3 months that proves you are making progress?
              </p>
              <input
                type="text"
                value={quarterlyGoal}
                onChange={e => setQuarterlyGoal(e.target.value)}
                placeholder="e.g. Finish MVP Code, Run 10km..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        );

      case 'habit':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-yellow-500">Life Goals Habit</h3>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                To hit that Goal, what is the one specific action you must do regularly and make it into your habit?
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
            <div className="flex items-center gap-3">
              <Brain className="text-purple-400" size={24} />
              <h3 className="text-2xl font-bold text-purple-400">The Micro Win</h3>
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

      case 'confirm':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fadeIn text-center h-[50vh]">
            <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <Eye className="w-12 h-12 text-purple-400" />
            </div>
            
            <h3 className="text-3xl font-bold text-white">Visualize It</h3>
            
            <p className="text-xl text-gray-300 max-w-md leading-relaxed">
              Close your eyes. Picture your worst day—tired, raining, no motivation. 
              <br /><br />
              Can you see yourself doing this <strong>Micro Win</strong> ({habitData.microMethod})?
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {['vision', 'lifegoals', 'habit', 'microwin', 'confirm'].map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              step === s ? 'w-8 bg-yellow-500' : 
              ['vision', 'lifegoals', 'habit', 'microwin', 'confirm'].indexOf(step) > i ? 'w-8 bg-yellow-500/50' : 'w-2 bg-gray-800'
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
              className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
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

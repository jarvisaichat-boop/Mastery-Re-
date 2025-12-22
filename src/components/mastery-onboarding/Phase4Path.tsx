import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Eye, Brain } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase4PathProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  profile?: Partial<MasteryProfile>;
}

export default function Phase4Path({ onComplete, profile }: Phase4PathProps) {
  const { data, updatePath } = useVisionBoard();
  const { path } = data;

  const [step, setStep] = useState<'vision' | 'synthesis' | 'project' | 'goals' | 'habit' | 'confirm'>('vision');
  
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

  const generateVision = () => {
    if (visionInputs.do && visionInputs.feel && visionInputs.give) {
      const sentence = `To ${visionInputs.do} feeling ${visionInputs.feel}, giving me ${visionInputs.give}.`;
      setSynthesizedVision(sentence);
      updatePath({ vision: sentence });
    }
  };

  const toNextStep = () => {
    switch (step) {
      case 'vision':
        generateVision();
        setStep('synthesis');
        break;
      case 'synthesis':
        setStep('project');
        break;
      case 'project':
        if (currentProject) updatePath({ projects: [{ text: currentProject, hidden: false }] });
        setStep('goals');
        break;
      case 'goals':
        if (quarterlyGoal) updatePath({ quarterlyGoals: [{ text: quarterlyGoal, hidden: false }] });
        setStep('habit');
        break;
      case 'habit':
        setStep('confirm');
        break;
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
            <h3 className="text-2xl font-bold text-yellow-500">The Vision inputs</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">1. The Action (DO)</label>
                <p className="text-xs text-gray-500 mb-2">What is the one core activity you want to DO as your daily lifestyle? (Start with a verb)</p>
                <input
                  type="text"
                  value={visionInputs.do}
                  onChange={e => setVisionInputs({ ...visionInputs, do: e.target.value })}
                  placeholder="e.g. Build software, Travel the world..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">2. The Feeling (FEEL)</label>
                <p className="text-xs text-gray-500 mb-2">When you do that, how does it make you FEEL inside?</p>
                <input
                  type="text"
                  value={visionInputs.feel}
                  onChange={e => setVisionInputs({ ...visionInputs, feel: e.target.value })}
                  placeholder="e.g. Alive, Confident, Peaceful..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">3. The Result (GIVE)</label>
                <p className="text-xs text-gray-500 mb-2">What tangible result does this lifestyle GIVE you?</p>
                <input
                  type="text"
                  value={visionInputs.give}
                  onChange={e => setVisionInputs({ ...visionInputs, give: e.target.value })}
                  placeholder="e.g. Financial Freedom, A seaside home..."
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 'synthesis':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-yellow-500">Does this sound right?</h3>
            <div className="bg-black/40 p-6 rounded-xl border border-white/10">
              <textarea
                value={synthesizedVision}
                onChange={e => setSynthesizedVision(e.target.value)}
                className="w-full h-32 bg-transparent text-xl font-light leading-relaxed text-white outline-none resize-none"
              />
            </div>
            <p className="text-sm text-gray-400">Feel free to edit it to make it flow better.</p>
          </div>
        );

      case 'project':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-yellow-500">Short Term Vision</h3>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                What is the massive <strong>'Project'</strong> or Season you are building right now (6 months - 2 years)?
              </p>
              <input
                type="text"
                value={currentProject}
                onChange={e => setCurrentProject(e.target.value)}
                placeholder="e.g. Launch the App, Buy a House..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-yellow-500">Quarterly Goals</h3>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                What specific Goal is achievable in the next <strong>3 months</strong> to prove you are winning? (Must be Yes/No)
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
            <h3 className="text-2xl font-bold text-yellow-500">The Standard Habit</h3>
            
            {/* Standard Habit */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4">
                To hit that Goal, what is the one specific action you must do regularly?
              </p>
              <input
                type="text"
                value={habitData.name}
                onChange={e => setHabitData({ ...habitData, name: e.target.value })}
                placeholder="e.g. Write Code, Run, Meditate..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none mb-4"
              />
              <div className="flex gap-2">
                {(['daily', 'weekly'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setHabitData({ ...habitData, frequency: f })}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                      habitData.frequency === f
                        ? 'bg-yellow-500 text-black border-yellow-500'
                        : 'border-gray-700 text-gray-400'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Win - User Adjustment 2 */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-purple-400" size={20} />
                <h4 className="text-lg font-bold text-purple-400">The Micro Win</h4>
              </div>
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

            <button
              onClick={handleFinish}
              className="px-12 py-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xl rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-all"
            >
              Yes, I can see it.
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32">
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {['vision', 'synthesis', 'project', 'goals', 'habit', 'confirm'].map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              step === s ? 'w-8 bg-yellow-500' : 
              ['vision', 'synthesis', 'project', 'goals', 'habit', 'confirm'].indexOf(step) > i ? 'w-8 bg-yellow-500/50' : 'w-2 bg-gray-800'
            }`}
          />
        ))}
      </div>

      {renderStepContent()}

      {/* Navigation (Hidden on Confirm step as it has its own button) */}
      {step !== 'confirm' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
          <div className="max-w-xl mx-auto">
            <button
              onClick={toNextStep}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
            >
              CONTINUE <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

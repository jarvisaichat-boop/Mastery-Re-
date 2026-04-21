import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Eye, Brain, Plus, X, GripVertical, ChevronUp, ChevronDown, Route } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase4PathProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  profile?: Partial<MasteryProfile>;
  onBack?: () => void;
}

type Step = 'rawgoal' | 'steps' | 'habit' | 'microwin' | 'confirm';
const STEPS: Step[] = ['rawgoal', 'steps', 'habit', 'microwin', 'confirm'];

export default function Phase4Path({ onComplete, profile, onBack }: Phase4PathProps) {
  const { data, updatePath } = useVisionBoard();

  const [step, setStep] = useState<Step>('rawgoal');

  // Step 1 — Life Goal
  const [rawGoal, setRawGoal] = useState(profile?.rawGoal || '');

  // Step 2 — Steps (ordered path to the goal)
  const [stepsList, setStepsList] = useState<string[]>([]);
  const [draftStep, setDraftStep] = useState('');
  const draftInputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Step 3 — Habit
  const [habitName, setHabitName] = useState('');

  // Step 4 — Micro Win
  const [microMethod, setMicroMethod] = useState('');

  // Steps list helpers
  const addStep = () => {
    const trimmed = draftStep.trim();
    if (!trimmed) return;
    setStepsList(prev => [...prev, trimmed]);
    setDraftStep('');
    draftInputRef.current?.focus();
  };

  const removeStep = (i: number) => setStepsList(prev => prev.filter((_, idx) => idx !== i));

  const moveStep = (i: number, dir: -1 | 1) => {
    const next = i + dir;
    if (next < 0 || next >= stepsList.length) return;
    const arr = [...stepsList];
    [arr[i], arr[next]] = [arr[next], arr[i]];
    setStepsList(arr);
  };

  // Drag-to-reorder (desktop)
  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDragIndex(i);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIndex(i);
  };

  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const arr = [...stepsList];
    const [removed] = arr.splice(dragIndex, 1);
    arr.splice(i, 0, removed);
    setStepsList(arr);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const toNextStep = () => {
    switch (step) {
      case 'rawgoal':
        setStep('steps');
        break;
      case 'steps': {
        const finalSteps = draftStep.trim()
          ? [...stepsList, draftStep.trim()]
          : [...stepsList];
        setStepsList(finalSteps);
        setDraftStep('');
        const ordered = finalSteps.map((text, idx) => ({
          text,
          hidden: false,
          order: idx,
        }));
        updatePath({ projects: ordered });
        setStep('habit');
        break;
      }
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
      case 'rawgoal':   onBack?.(); break;
      case 'steps':     setStep('rawgoal'); break;
      case 'habit':     setStep('steps'); break;
      case 'microwin':  setStep('habit'); break;
      case 'confirm':   setStep('microwin'); break;
    }
  };

  const handleFinish = () => {
    onComplete({
      rawGoal,
      proposedHabit: {
        name: habitName,
        description: `Micro Win: ${microMethod}`,
        duration: 15,
        difficulty: 'moderate',
      },
      acceptedHabit: true,
      finalHabitDuration: 15,
    });
  };

  const canContinue = (() => {
    if (step === 'rawgoal') return rawGoal.trim().length > 0;
    if (step === 'steps') return stepsList.length > 0 || draftStep.trim().length > 0;
    return true;
  })();

  const currentIndex = STEPS.indexOf(step);

  const renderStepContent = () => {
    switch (step) {

      case 'rawgoal':
        return (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-6">
                <Route className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Life Goal</h2>
              <p className="text-xl text-gray-400">
                What do you want most right now?
              </p>
            </div>
            {data.path?.vision && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-yellow-500/70 mb-2">Vision</p>
                <p className="text-white text-sm font-medium italic">"{data.path.vision}"</p>
              </div>
            )}
            <div className="space-y-6">
              <p className="text-gray-400 text-sm">The one thing that, if you achieved it, would have the greatest meaning for your life.</p>
              <textarea
                value={rawGoal}
                onChange={e => setRawGoal(e.target.value)}
                placeholder="e.g. Be rich, Level up my physique, Move abroad..."
                rows={4}
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white text-lg focus:border-yellow-500 outline-none resize-none leading-relaxed"
                autoFocus
              />
              <p className="text-gray-600 text-xs">Don't over-think it. You'll break it down in the next step.</p>
            </div>
          </div>
        );

      case 'steps':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 2 of {STEPS.length} — The Steps</p>
              <h3 className="text-2xl font-bold text-white leading-tight">What needs to happen to get there?</h3>
              {rawGoal && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-yellow-500/70 mb-1">Life Goal</p>
                  <p className="text-white text-sm font-medium italic">"{rawGoal}"</p>
                </div>
              )}
              <p className="text-gray-500 text-xs">Add the steps that need to happen — then drag or use the arrows to order them. Furthest step at the top, nearest at the bottom.</p>
            </div>

            {/* Input + Add */}
            <div className="flex gap-2">
              <input
                ref={draftInputRef}
                type="text"
                value={draftStep}
                onChange={e => setDraftStep(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addStep()}
                placeholder="e.g. Build the app, Launch, Get customers..."
                className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
              />
              <button
                onClick={addStep}
                disabled={!draftStep.trim()}
                className="flex items-center gap-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold rounded-xl transition-all"
              >
                <Plus size={18} /> Add
              </button>
            </div>

            {/* Ordered Steps List */}
            {stepsList.length > 0 ? (
              <div className="space-y-2">
                {stepsList.map((s, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={e => handleDragStart(e, i)}
                    onDragOver={e => handleDragOver(e, i)}
                    onDrop={e => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 bg-gray-900/60 border rounded-xl px-3 py-3 transition-all ${
                      dragOverIndex === i && dragIndex !== i
                        ? 'border-yellow-500/60 bg-yellow-500/5'
                        : 'border-gray-800'
                    } ${dragIndex === i ? 'opacity-40' : 'opacity-100'}`}
                  >
                    {/* Drag handle */}
                    <span className="text-gray-600 cursor-grab active:cursor-grabbing shrink-0">
                      <GripVertical size={16} />
                    </span>

                    {/* Step number + text */}
                    <span className="text-xs text-gray-600 font-mono w-4 shrink-0">{i + 1}</span>
                    <span className="text-white text-sm flex-1 min-w-0 break-words">{s}</span>

                    {/* Up/Down + Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveStep(i, -1)}
                        disabled={i === 0}
                        className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveStep(i, 1)}
                        disabled={i === stepsList.length - 1}
                        className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        onClick={() => removeStep(i)}
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <p className="text-gray-700 text-xs text-center pt-1">
                  ↑ Far away &nbsp;&nbsp;·&nbsp;&nbsp; ↓ Where you are now
                </p>
              </div>
            ) : (
              <p className="text-gray-700 text-xs text-center py-4">Your steps will appear here as you add them.</p>
            )}
          </div>
        );

      case 'habit':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 3 of {STEPS.length} — Daily Habit</p>
              <h3 className="text-2xl font-bold text-yellow-500">The Daily Habit</h3>
            </div>

            {stepsList.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-yellow-500/70 mb-1">Your nearest step:</p>
                <p className="text-white text-sm font-medium italic">"{stepsList[stepsList.length - 1]}"</p>
              </div>
            )}

            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4 text-sm">
                What is the one daily action that moves that step forward?
              </p>
              <input
                type="text"
                value={habitName}
                onChange={e => setHabitName(e.target.value)}
                placeholder="e.g. Code for 2 hours, Run, Write..."
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        );

      case 'microwin':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-widest">Step 4 of {STEPS.length} — Micro Win</p>
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
                value={microMethod}
                onChange={e => setMicroMethod(e.target.value)}
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
              Close your eyes. Picture your worst day — tired, raining, no motivation.
              <br /><br />
              Can you see yourself doing this <strong>Micro Win</strong> ({microMethod || 'your micro win'})?
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

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Eye, Brain, Plus, X, GripVertical, ChevronUp, ChevronDown, Route, Pencil, Check } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase4PathProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  onPartialUpdate?: (data: Partial<MasteryProfile>) => void;
  profile?: Partial<MasteryProfile>;
  onBack?: () => void;
}

type Step = 'rawgoal' | 'steps' | 'habit' | 'microwin' | 'confirm';
const STEPS: Step[] = ['rawgoal', 'steps', 'habit', 'microwin', 'confirm'];
const STEPS_DRAFT_KEY = 'mastery-onboarding-steps-draft';
const RANGES_DRAFT_KEY = 'mastery-onboarding-ranges-draft';
const HABIT_DRAFT_KEY = 'mastery-onboarding-habit-draft';
const MICRO_DRAFT_KEY = 'mastery-onboarding-micro-draft';
export const RAWGOAL_DRAFT_KEY = 'mastery-onboarding-rawgoal-draft';
export const PROJECTS_BACKUP_KEY = 'mastery-onboarding-projects-backup';
const SEED_KEY = 'mastery-onboarding-seed';

type OnboardingSeed = { rawGoal?: string; steps?: string[]; habitName?: string; microMethod?: string };
function readSeed(): OnboardingSeed {
  try { const raw = localStorage.getItem(SEED_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

export default function Phase4Path({ onComplete, onPartialUpdate, profile, onBack }: Phase4PathProps) {
  const { data, updatePath } = useVisionBoard();

  const [step, setStep] = useState<Step>('rawgoal');

  const seed = readSeed();

  // Step 1 — Life Goal: draft > profile > seed (last run)
  const [rawGoal, setRawGoal] = useState(() => {
    try { const draft = localStorage.getItem(RAWGOAL_DRAFT_KEY); if (draft) return draft; } catch {}
    if (profile?.rawGoal) return profile.rawGoal;
    return seed.rawGoal || '';
  });

  // Step 2 — Steps: draft > profile > seed (last run)
  const [stepsList, setStepsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STEPS_DRAFT_KEY);
      if (saved) { const parsed = JSON.parse(saved); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
    } catch {}
    if (profile?.steps && profile.steps.length > 0) return profile.steps;
    return (Array.isArray(seed.steps) && seed.steps.length > 0) ? seed.steps : [];
  });
  const [draftStep, setDraftStep] = useState('');
  const draftInputRef = useRef<HTMLInputElement>(null);

  // Inline editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Time ranges sub-phase (boundaries persisted to localStorage)
  const [showTimeRanges, setShowTimeRanges] = useState(false);
  const [longMidBoundary, setLongMidBoundary] = useState(() => {
    try {
      const saved = localStorage.getItem(RANGES_DRAFT_KEY);
      return saved ? JSON.parse(saved).longMid ?? 0 : 0;
    } catch { return 0; }
  });
  const [midShortBoundary, setMidShortBoundary] = useState(() => {
    try {
      const saved = localStorage.getItem(RANGES_DRAFT_KEY);
      return saved ? JSON.parse(saved).midShort ?? 0 : 0;
    } catch { return 0; }
  });

  // Refs for divider drag (avoid stale closures)
  const dividerDragging = useRef<'longMid' | 'midShort' | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const longMidRef = useRef(longMidBoundary);
  const midShortRef = useRef(midShortBoundary);
  const stepsLenRef = useRef(stepsList.length);
  longMidRef.current = longMidBoundary;
  midShortRef.current = midShortBoundary;
  stepsLenRef.current = stepsList.length;

  // Auto-save rawGoal draft so it survives page reload mid-onboarding
  useEffect(() => {
    try {
      if (rawGoal) { localStorage.setItem(RAWGOAL_DRAFT_KEY, rawGoal); }
      else { localStorage.removeItem(RAWGOAL_DRAFT_KEY); }
    } catch {}
  }, [rawGoal]);

  // Auto-save steps draft + sync to profile so they survive the full flow
  useEffect(() => {
    try { localStorage.setItem(STEPS_DRAFT_KEY, JSON.stringify(stepsList)); } catch {}
    onPartialUpdate?.({ steps: stepsList });
  }, [stepsList]);

  // Auto-save time range boundaries
  useEffect(() => {
    try { localStorage.setItem(RANGES_DRAFT_KEY, JSON.stringify({ longMid: longMidBoundary, midShort: midShortBoundary })); } catch {}
  }, [longMidBoundary, midShortBoundary]);

  // Drag-to-reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Step 3 — Habit: draft > profile > seed (last run)
  const [habitName, setHabitName] = useState(() => {
    try { const draft = localStorage.getItem(HABIT_DRAFT_KEY); if (draft) return draft; } catch {}
    if (profile?.proposedHabit?.name) return profile.proposedHabit.name;
    return seed.habitName || '';
  });

  // Step 4 — Micro Win: draft > profile > seed (last run)
  const [microMethod, setMicroMethod] = useState(() => {
    try { const draft = localStorage.getItem(MICRO_DRAFT_KEY); if (draft) return draft; } catch {}
    const desc = profile?.proposedHabit?.description || '';
    if (desc) return desc.startsWith('Micro Win: ') ? desc.slice('Micro Win: '.length) : desc;
    return seed.microMethod || '';
  });

  // Auto-save habit and micro win drafts (remove key when empty so an absent key
  // never masks a valid profile value on the next mount — mirrors rawGoal pattern)
  useEffect(() => {
    try {
      if (habitName) { localStorage.setItem(HABIT_DRAFT_KEY, habitName); }
      else { localStorage.removeItem(HABIT_DRAFT_KEY); }
    } catch {}
  }, [habitName]);
  useEffect(() => {
    try {
      if (microMethod) { localStorage.setItem(MICRO_DRAFT_KEY, microMethod); }
      else { localStorage.removeItem(MICRO_DRAFT_KEY); }
    } catch {}
  }, [microMethod]);

  // ── Inline edit helpers ─────────────────────────────────────────────────────

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditingText(stepsList[i]);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editingText.trim();
    if (trimmed) {
      setStepsList(prev => prev.map((s, i) => (i === editingIndex ? trimmed : s)));
    }
    setEditingIndex(null);
    setEditingText('');
  };

  // ── Steps list helpers ──────────────────────────────────────────────────────

  const addStep = () => {
    const trimmed = draftStep.trim();
    if (!trimmed) return;
    setStepsList(prev => [...prev, trimmed]);
    setDraftStep('');
    draftInputRef.current?.focus();
  };

  const removeStep = (i: number) => {
    if (editingIndex === i) setEditingIndex(null);
    setStepsList(prev => prev.filter((_, idx) => idx !== i));
  };

  const moveStep = (i: number, dir: -1 | 1) => {
    const next = i + dir;
    if (next < 0 || next >= stepsList.length) return;
    const arr = [...stepsList];
    [arr[i], arr[next]] = [arr[next], arr[i]];
    setStepsList(arr);
  };

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

  // ── Time ranges helpers ─────────────────────────────────────────────────────

  const openTimeRanges = (list = stepsList) => {
    const n = list.length;
    // Only apply defaults if no saved boundaries exist yet
    const hasSaved = !!localStorage.getItem(RANGES_DRAFT_KEY);
    if (!hasSaved) {
      setLongMidBoundary(Math.floor(n / 3));
      setMidShortBoundary(Math.floor((2 * n) / 3));
    }
    setShowTimeRanges(true);
  };

  const handleDividerMouseDown = (which: 'longMid' | 'midShort') => {
    dividerDragging.current = which;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dividerDragging.current) return;
      const n = stepsLenRef.current;
      const rects = rowRefs.current.slice(0, n).map(r => r?.getBoundingClientRect() ?? null);

      // Find which gap (0..n) is nearest to the cursor
      let bestGap = 0;
      let bestDist = Infinity;
      for (let i = 0; i <= n; i++) {
        let gapY: number;
        if (i === 0) gapY = rects[0]?.top ?? 0;
        else if (i === n) gapY = rects[n - 1]?.bottom ?? 0;
        else gapY = ((rects[i - 1]?.bottom ?? 0) + (rects[i]?.top ?? 0)) / 2;
        const dist = Math.abs(e.clientY - gapY);
        if (dist < bestDist) { bestDist = dist; bestGap = i; }
      }

      if (dividerDragging.current === 'longMid') {
        setLongMidBoundary(Math.max(0, Math.min(bestGap, midShortRef.current)));
      } else {
        setMidShortBoundary(Math.max(longMidRef.current, Math.min(bestGap, n)));
      }
    };

    const onMouseUp = () => { dividerDragging.current = null; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const toNextStep = () => {
    switch (step) {
      case 'rawgoal':
        setStep('steps');
        break;
      case 'steps': {
        if (!showTimeRanges) {
          // Commit any pending draft, then open time ranges (mandatory)
          const finalSteps = draftStep.trim()
            ? [...stepsList, draftStep.trim()]
            : [...stepsList];
          setStepsList(finalSteps);
          setDraftStep('');
          openTimeRanges(finalSteps);
        } else {
          // Save steps + proceed to habit
          const ordered = stepsList.map((text, idx) => ({ text, hidden: false, order: idx }));
          updatePath({ projects: ordered });
          try { localStorage.setItem(PROJECTS_BACKUP_KEY, JSON.stringify(ordered)); } catch {}
          setShowTimeRanges(false);
          setStep('habit');
        }
        break;
      }
      case 'habit':    setStep('microwin'); break;
      case 'microwin': setStep('confirm'); break;
    }
  };

  const toPrevStep = () => {
    switch (step) {
      case 'rawgoal':  onBack?.(); break;
      case 'steps':
        if (showTimeRanges) { setShowTimeRanges(false); }
        else { setStep('rawgoal'); }
        break;
      case 'habit':    setStep('steps'); break;
      case 'microwin': setStep('habit'); break;
      case 'confirm':  setStep('microwin'); break;
    }
  };

  const handleFinish = () => {
    try { localStorage.removeItem(STEPS_DRAFT_KEY); } catch {}
    try { localStorage.removeItem(RANGES_DRAFT_KEY); } catch {}
    try { localStorage.removeItem(HABIT_DRAFT_KEY); } catch {}
    try { localStorage.removeItem(MICRO_DRAFT_KEY); } catch {}
    // RAWGOAL_DRAFT_KEY is intentionally NOT cleared here — it stays until
    // App.handleOnboardingComplete successfully reads it and clears it there.
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

  // ── Render helpers ──────────────────────────────────────────────────────────

  const renderStepRow = (s: string, i: number, inZone = false) => (
    <div
      key={i}
      ref={el => { rowRefs.current[i] = el; }}
      draggable={!inZone && editingIndex !== i}
      onDragStart={!inZone ? e => handleDragStart(e, i) : undefined}
      onDragOver={!inZone ? e => handleDragOver(e, i) : undefined}
      onDrop={!inZone ? e => handleDrop(e, i) : undefined}
      onDragEnd={!inZone ? handleDragEnd : undefined}
      className={`flex items-center gap-2 rounded-xl px-3 py-3 transition-all ${
        inZone ? 'bg-black/30' : 'bg-gray-900/60 border'
      } ${
        !inZone && dragOverIndex === i && dragIndex !== i
          ? 'border-yellow-500/60 bg-yellow-500/5'
          : !inZone ? 'border-gray-800' : ''
      } ${!inZone && dragIndex === i ? 'opacity-40' : 'opacity-100'}`}
    >
      {!inZone && (
        <span className="text-gray-600 cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical size={16} />
        </span>
      )}

      <span className="text-xs text-gray-600 font-mono w-4 shrink-0">{i + 1}</span>

      {/* Editable text */}
      {editingIndex === i ? (
        <input
          ref={editInputRef}
          value={editingText}
          onChange={e => setEditingText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingIndex(null); }}
          onBlur={commitEdit}
          className="flex-1 bg-black/50 border border-yellow-500/50 rounded-lg px-2 py-1 text-white text-sm outline-none min-w-0"
        />
      ) : (
        <span
          className="text-white text-sm flex-1 min-w-0 break-words cursor-text"
          onClick={() => startEdit(i)}
        >
          {s}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {editingIndex === i ? (
          <button onClick={commitEdit} className="p-1 text-yellow-500 hover:text-yellow-400 transition-colors">
            <Check size={14} />
          </button>
        ) : (
          <>
            {!inZone && (
              <>
                <button onClick={() => startEdit(i)} className="p-1 text-gray-600 hover:text-yellow-400 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors">
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => moveStep(i, 1)} disabled={i === stepsList.length - 1} className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors">
                  <ChevronDown size={14} />
                </button>
              </>
            )}
            {inZone && (
              <button onClick={() => startEdit(i)} className="p-1 text-gray-600 hover:text-yellow-400 transition-colors">
                <Pencil size={13} />
              </button>
            )}
            <button onClick={() => removeStep(i)} className="p-1 text-gray-600 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderTimeRangesView = () => {
    const zones = [
      {
        key: 'long',
        label: 'Long Term',
        range: '3+ years',
        start: 0,
        end: longMidBoundary,
        bg: 'bg-red-950/50',
        border: 'border-red-700/40',
        text: 'text-red-400',
        dividerKey: 'longMid' as const,
      },
      {
        key: 'mid',
        label: 'Mid Term',
        range: '4 months – 3 years',
        start: longMidBoundary,
        end: midShortBoundary,
        bg: 'bg-green-950/50',
        border: 'border-green-700/40',
        text: 'text-green-400',
        dividerKey: 'midShort' as const,
      },
      {
        key: 'short',
        label: 'Short Term',
        range: '1 week – 3 months',
        start: midShortBoundary,
        end: stepsList.length,
        bg: 'bg-blue-950/50',
        border: 'border-blue-700/40',
        text: 'text-blue-400',
        dividerKey: null,
      },
    ];

    return (
      <div className="space-y-1">
        {zones.map((zone, zi) => (
          <React.Fragment key={zone.key}>
            {/* Zone block */}
            <div className={`rounded-xl border ${zone.border} ${zone.bg} overflow-hidden`}>
              <div className={`px-3 py-2 flex items-center justify-between border-b ${zone.border}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${zone.text}`}>{zone.label}</span>
                <span className={`text-xs opacity-60 ${zone.text}`}>{zone.range}</span>
              </div>
              <div className="px-2 py-2 space-y-1">
                {zone.start < zone.end
                  ? stepsList.slice(zone.start, zone.end).map((s, li) =>
                      renderStepRow(s, zone.start + li, true)
                    )
                  : <p className="text-gray-600 text-xs text-center py-2 italic">Drag the divider to include goals here</p>
                }
              </div>
            </div>

            {/* Draggable divider between zones */}
            {zone.dividerKey && (
              <div
                className="flex items-center justify-center py-0.5 cursor-ns-resize select-none group"
                onMouseDown={() => handleDividerMouseDown(zone.dividerKey!)}
              >
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800/80 border border-gray-600 group-hover:border-yellow-500/60 group-active:border-yellow-500 transition-colors">
                  <GripVertical size={13} className="text-gray-500 rotate-90" />
                  <span className="text-gray-500 text-[11px] group-hover:text-gray-300 transition-colors">drag to adjust</span>
                  <GripVertical size={13} className="text-gray-500 rotate-90" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // ── Screen renders ──────────────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step) {

      case 'rawgoal':
        return (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-6">
                <Route className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Goal</h2>
              <p className="text-xl text-gray-400">What do you want most right now?</p>
            </div>
            {data.path?.vision && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-yellow-500/70 mb-2">Vision</p>
                <p className="text-white text-sm font-medium italic">"{data.path.vision}"</p>
              </div>
            )}
            <div className="space-y-6">
              <p className="text-gray-400 text-sm">What do you want the most right now? What is driving you? What do you want to achieve? What comes to your mind? We all want a million things in life — but what do you desire the most? You can add more goals later in the app, but you can only have one main goal active at a time. Throughout the app, this will be referred to as your <span className="text-yellow-500 font-medium">Life Goal</span>.</p>
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
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">
                Step 2 of {STEPS.length} — {showTimeRanges ? 'Time Ranges' : 'The Goals'}
              </p>
              <h3 className="text-2xl font-bold text-yellow-500">
                {showTimeRanges ? 'Set Time Ranges' : 'The Goals'}
              </h3>
              {rawGoal && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-yellow-500/70 mb-1">Life Goal</p>
                  <p className="text-white text-sm font-medium italic">"{rawGoal}"</p>
                </div>
              )}
              <p className="text-gray-500 text-xs">
                {showTimeRanges
                  ? 'Drag the dividers to group your goals by time horizon.'
                  : 'Add the goals — then drag or use arrows to order them. Furthest at the top, nearest at the bottom.'}
              </p>
            </div>

            {!showTimeRanges ? (
              <>
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

                {/* Hints — always visible below input */}
                <div className="space-y-1">
                  <p className="text-white text-xs text-center">
                    ↑ Far away &nbsp;·&nbsp; ↓ Closer to where you are now
                  </p>
                  <p className="text-white text-xs text-center">
                    Your nearest goal should be achievable in 1 week – 3 months.
                  </p>
                </div>

                {/* Order list */}
                {stepsList.length > 0 ? (
                  <div className="space-y-2">
                    {stepsList.map((s, i) => renderStepRow(s, i, false))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs text-center py-4">Your goals will appear here as you add them.</p>
                )}
              </>
            ) : (
              renderTimeRangesView()
            )}
          </div>
        );

      case 'habit':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Step 3 of {STEPS.length} — Daily Habit</p>
              <h3 className="text-2xl font-bold text-yellow-500">Habit — Life Goal Habit</h3>
              <p className="text-gray-400 text-sm">What is the one daily habit / action you must make everyday to achieve your life goal?</p>
            </div>
            <div className="space-y-2">
              {rawGoal && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-yellow-500/70 mb-1">Life Goal</p>
                  <p className="text-white text-sm font-medium">{rawGoal}</p>
                </div>
              )}
              {stepsList.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-yellow-500/70 mb-1">Your nearest goal:</p>
                  <p className="text-white text-sm font-medium">{stepsList[stepsList.length - 1]}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-300 mb-4 text-sm">What is the one daily habit / action that moves you towards that goal?</p>
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
                <h3 className="text-2xl font-bold text-purple-400">Micro Win</h3>
              </div>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <p className="text-white font-semibold text-base mb-2">Human beings are weak.</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                On days when you are tired, lazy, procrastinating and out of motivation, what is one <span className="text-white font-bold">ridiculously easy version</span> of this habit that you can accomplish in 60 seconds?? <span className="text-gray-400 italic">It should feel stupid to do it but also stupid not to do it.</span>
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
            </p>
            <p className="text-xl text-gray-300 max-w-md leading-relaxed">
              Can you see yourself achieving <span className="text-purple-400 font-bold">Micro Win</span>
              <br />
              <span className="text-yellow-500 font-semibold">{microMethod || 'your micro win'}</span>
              <br />?
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
              {step === 'steps' && !showTimeRanges ? 'Set Time Ranges' : 'CONTINUE'} <ArrowRight size={20} />
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

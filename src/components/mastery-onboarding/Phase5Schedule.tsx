import React, { useState, useMemo } from 'react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { VisualTimelineEditor } from '../VisionBoard/VisualTimelineEditor';
import { MasteryProfile } from '../../types/onboarding';
import { ArrowRight, ArrowLeft, Clock, Plus, Trash2, Zap, Eye, BookOpen, Rocket } from 'lucide-react';
import { RoutineItem, TimeBlock } from '../../types/visionBoard';

interface Phase5ScheduleProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  onBack?: () => void;
}

type SubStep = 'wow' | 'coreSchedule' | 'commitment' | 'gm' | 'gd' | 'gn' | 'busy';

const SUB_STEPS: SubStep[] = ['wow', 'coreSchedule', 'commitment', 'gm', 'gd', 'gn', 'busy'];

const WOW_SAMPLE_BLOCKS: TimeBlock[] = [
  { time: '23:00', endTime: '07:00', label: 'Sleep', color: 'bg-purple-400', hidden: false, isProtected: true },
  { time: '07:00', endTime: '08:00', label: 'Morning Routine', color: 'bg-yellow-400', hidden: false },
  { time: '09:00', endTime: '17:00', label: 'Work / School', color: 'bg-blue-400', hidden: false, isProtected: true },
  { time: '18:00', endTime: '19:00', label: 'Goal Habits', color: 'bg-orange-400', hidden: false },
  { time: '21:00', endTime: '22:00', label: 'Evening Wind-down', color: 'bg-indigo-400', hidden: false },
];

const DEFAULT_SLEEP: TimeBlock = { time: '23:00', endTime: '07:00', label: 'Sleep', color: 'bg-purple-400', hidden: false, isProtected: true };
const DEFAULT_WORK: TimeBlock = { time: '09:00', endTime: '17:00', label: 'Work / School', color: 'bg-blue-400', hidden: false, isProtected: true };
const DEFAULT_HABIT: TimeBlock = { time: '07:00', endTime: '08:00', label: 'Habit Time', color: 'bg-orange-400', hidden: false };
const DEFAULT_MOMENTUM: TimeBlock = { time: '06:00', endTime: '06:30', label: 'Momentum Generator', color: 'bg-yellow-400', hidden: false };

const LABEL_IS_SLEEP = (l: string) => /sleep/i.test(l);
const LABEL_IS_WORK = (l: string) => /work|school/i.test(l);
const LABEL_IS_HABIT = (l: string) => /habit/i.test(l);
const LABEL_IS_MOMENTUM = (l: string) => /momentum/i.test(l);

function extractCoreBlock(timeline: TimeBlock[], matcher: (l: string) => boolean, fallback: TimeBlock): TimeBlock {
  const found = timeline.find(b => b.endTime && matcher(b.label));
  return found ? { ...found } : { ...fallback };
}

export default function Phase5Schedule({ onComplete, onBack }: Phase5ScheduleProps) {
  const { data, updateSchedule } = useVisionBoard();
  const { schedule } = data;

  const [step, setStep] = useState<SubStep>('wow');

  const [sleepBlock, setSleepBlock] = useState<TimeBlock>(() =>
    extractCoreBlock(schedule.timeline, LABEL_IS_SLEEP, DEFAULT_SLEEP)
  );
  const [workBlock, setWorkBlock] = useState<TimeBlock>(() =>
    extractCoreBlock(schedule.timeline, LABEL_IS_WORK, DEFAULT_WORK)
  );
  const [habitBlock, setHabitBlock] = useState<TimeBlock>(() =>
    extractCoreBlock(schedule.timeline, LABEL_IS_HABIT, DEFAULT_HABIT)
  );
  const [momentumBlock, setMomentumBlock] = useState<TimeBlock>(() =>
    extractCoreBlock(schedule.timeline, LABEL_IS_MOMENTUM, DEFAULT_MOMENTUM)
  );

  const [currentRoutineItems, setCurrentRoutineItems] = useState<RoutineItem[]>([]);

  React.useEffect(() => {
    if (step === 'gm') setCurrentRoutineItems(schedule.gmRoutine || []);
    if (step === 'gd') setCurrentRoutineItems(schedule.gdRoutine || []);
    if (step === 'gn') setCurrentRoutineItems(schedule.gnRoutine || []);
  }, [step, schedule.gmRoutine, schedule.gdRoutine, schedule.gnRoutine]);

  const coreScheduleTimeline = useMemo(() => [sleepBlock, workBlock, habitBlock], [sleepBlock, workBlock, habitBlock]);

  const commitmentTimeline = useMemo(() => [sleepBlock, workBlock, habitBlock, momentumBlock], [sleepBlock, workBlock, habitBlock, momentumBlock]);

  const saveCoreBlocksToSchedule = (sleep: TimeBlock, work: TimeBlock, habit: TimeBlock) => {
    const otherBlocks = schedule.timeline.filter(b =>
      !LABEL_IS_SLEEP(b.label) && !LABEL_IS_WORK(b.label) && !LABEL_IS_HABIT(b.label) && !LABEL_IS_MOMENTUM(b.label)
    );
    updateSchedule({ timeline: [...otherBlocks, sleep, work, habit, momentumBlock] });
  };

  const saveAllBlocksToSchedule = (sleep: TimeBlock, work: TimeBlock, habit: TimeBlock, momentum: TimeBlock) => {
    const otherBlocks = schedule.timeline.filter(b =>
      !LABEL_IS_SLEEP(b.label) && !LABEL_IS_WORK(b.label) && !LABEL_IS_HABIT(b.label) && !LABEL_IS_MOMENTUM(b.label)
    );
    updateSchedule({ timeline: [...otherBlocks, sleep, work, habit, momentum] });
  };

  const handleCoreScheduleUpdate = (newTimeline: TimeBlock[]) => {
    const newSleep = newTimeline.find(b => LABEL_IS_SLEEP(b.label)) || sleepBlock;
    const newWork = newTimeline.find(b => LABEL_IS_WORK(b.label)) || workBlock;
    const newHabit = newTimeline.find(b => LABEL_IS_HABIT(b.label)) || habitBlock;
    setSleepBlock(newSleep);
    setWorkBlock(newWork);
    setHabitBlock(newHabit);
    saveCoreBlocksToSchedule(newSleep, newWork, newHabit);
  };

  const handleCommitmentUpdate = (newTimeline: TimeBlock[]) => {
    const newSleep = newTimeline.find(b => LABEL_IS_SLEEP(b.label)) || sleepBlock;
    const newWork = newTimeline.find(b => LABEL_IS_WORK(b.label)) || workBlock;
    const newHabit = newTimeline.find(b => LABEL_IS_HABIT(b.label)) || habitBlock;
    const newMomentum = newTimeline.find(b => LABEL_IS_MOMENTUM(b.label)) || momentumBlock;
    setSleepBlock(newSleep);
    setWorkBlock(newWork);
    setHabitBlock(newHabit);
    setMomentumBlock(newMomentum);
    saveAllBlocksToSchedule(newSleep, newWork, newHabit, newMomentum);
  };

  const handleUpdateRoutine = (newItems: RoutineItem[]) => {
    setCurrentRoutineItems(newItems);
    if (step === 'gm') updateSchedule({ gmRoutine: newItems });
    if (step === 'gd') updateSchedule({ gdRoutine: newItems });
    if (step === 'gn') updateSchedule({ gnRoutine: newItems });
  };

  const addRoutineItem = () => handleUpdateRoutine([...currentRoutineItems, { text: '', hidden: false }]);
  const updateRoutineItem = (idx: number, text: string) => {
    const newItems = [...currentRoutineItems];
    newItems[idx] = { ...newItems[idx], text };
    handleUpdateRoutine(newItems);
  };
  const removeRoutineItem = (idx: number) => handleUpdateRoutine(currentRoutineItems.filter((_, i) => i !== idx));

  const nextStep = () => {
    switch (step) {
      case 'wow': setStep('coreSchedule'); break;
      case 'coreSchedule':
        saveCoreBlocksToSchedule(sleepBlock, workBlock, habitBlock);
        setStep('commitment');
        break;
      case 'commitment':
        saveAllBlocksToSchedule(sleepBlock, workBlock, habitBlock, momentumBlock);
        setStep('gm');
        break;
      case 'gm': setStep('gd'); break;
      case 'gd': setStep('gn'); break;
      case 'gn': setStep('busy'); break;
      case 'busy': onComplete({}); break;
    }
  };

  const prevStep = () => {
    switch (step) {
      case 'wow': onBack?.(); break;
      case 'coreSchedule': setStep('wow'); break;
      case 'commitment': setStep('coreSchedule'); break;
      case 'gm': setStep('commitment'); break;
      case 'gd': setStep('gm'); break;
      case 'gn': setStep('gd'); break;
      case 'busy': setStep('gn'); break;
    }
  };

  const currentStepIndex = SUB_STEPS.indexOf(step);

  const renderContent = () => {
    switch (step) {
      case 'wow':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10 mb-4">
                <Zap className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold text-white leading-tight">Your Daily Blueprint</h3>
              <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
                This is your daily structure — the architecture that makes your goals inevitable, not optional.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/60 z-10 rounded-xl pointer-events-none" />
              <div
                className="bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto custom-scrollbar"
                style={{ height: '420px' }}
              >
                <div className="pointer-events-none select-none">
                  <VisualTimelineEditor
                    timeline={WOW_SAMPLE_BLOCKS}
                    onUpdate={() => {}}
                    hideAddBlock={true}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">What you're building</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />Sleep
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />Work / School
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />Goal Habits
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />Momentum Time
                </div>
              </div>
            </div>
          </div>
        );

      case 'coreSchedule':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white">Set Your Core Schedule</h3>
              <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                Drag the edges to match your real day. No need to be exact — this is a rough structure, not a prison.
              </p>
            </div>

            <div className="flex gap-3 justify-center flex-wrap text-xs">
              <span className="flex items-center gap-1.5 bg-purple-400/10 text-purple-300 px-3 py-1.5 rounded-full border border-purple-400/20">
                <span className="w-2 h-2 rounded-full bg-purple-400" />Sleep Hours
              </span>
              <span className="flex items-center gap-1.5 bg-blue-400/10 text-blue-300 px-3 py-1.5 rounded-full border border-blue-400/20">
                <span className="w-2 h-2 rounded-full bg-blue-400" />Work / School
              </span>
              <span className="flex items-center gap-1.5 bg-orange-400/10 text-orange-300 px-3 py-1.5 rounded-full border border-orange-400/20">
                <span className="w-2 h-2 rounded-full bg-orange-400" />Habit Time
              </span>
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto custom-scrollbar" style={{ height: '460px' }}>
              <VisualTimelineEditor
                timeline={coreScheduleTimeline}
                onUpdate={handleCoreScheduleUpdate}
                hideAddBlock={true}
              />
            </div>
          </div>
        );

      case 'commitment':
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-3">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight">The Most Important Part</h3>
              <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                Opening this app daily is your single most powerful habit. Here's why:
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Reconnect with your vision</p>
                  <p className="text-gray-500 text-xs mt-0.5">Daily exposure to your goals rewires your brain to see opportunities others miss.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Learn and grow your habits</p>
                  <p className="text-gray-500 text-xs mt-0.5">Understanding the "why" behind your habits transforms willpower into automatic behavior.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Rocket className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Take a real leap toward action</p>
                  <p className="text-gray-500 text-xs mt-0.5">A single intentional check-in creates the momentum that carries you through the entire day.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3.5">
              <p className="text-yellow-300 text-sm font-semibold text-center">
                We recommend first thing in the morning, within an hour of waking up.
              </p>
            </div>

            <p className="text-gray-400 text-sm text-center">
              Drag the <span className="text-yellow-400 font-semibold">Momentum Generator</span> block to your preferred daily app-open time.
            </p>

            <div className="bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto custom-scrollbar" style={{ height: '400px' }}>
              <VisualTimelineEditor
                timeline={commitmentTimeline}
                onUpdate={handleCommitmentUpdate}
                hideAddBlock={true}
              />
            </div>
          </div>
        );

      case 'gm':
      case 'gd':
      case 'gn': {
        const title = step === 'gm' ? 'Good Morning (GM)' : step === 'gd' ? 'Good Day (GD)' : 'Good Night (GN)';
        const desc = step === 'gm'
          ? 'What specific steps happen inside your Morning Routine?'
          : step === 'gd'
          ? 'What defines your Work/Day flow?'
          : 'How do you wind down?';

        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="text-gray-400 text-sm mt-2">{desc}</p>
            </div>

            <div className="space-y-3">
              {currentRoutineItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateRoutineItem(idx, e.target.value)}
                    placeholder="e.g. Drink water, Meditate..."
                    className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                    autoFocus={idx === currentRoutineItems.length - 1}
                  />
                  <button
                    onClick={() => removeRoutineItem(idx)}
                    className="p-3 text-gray-500 hover:text-red-400 bg-gray-900/30 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                onClick={addRoutineItem}
                className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>
        );
      }

      case 'busy':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-red-400">The Busy Day Plan</h3>
              <p className="text-gray-400 text-sm mt-2">
                When you are sluggish or short on time, what is the absolute <strong>bare minimum</strong> routine to keep the momentum?
              </p>
            </div>

            <textarea
              value={schedule.busyDayPlan}
              onChange={(e) => updateSchedule({ busyDayPlan: e.target.value })}
              placeholder="e.g. 10m Walk + 10m Headspace + 10m Goal Work..."
              className="w-full h-40 bg-black/40 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:border-red-400 outline-none resize-none"
            />
          </div>
        );
    }
  };

  const getNextLabel = () => {
    switch (step) {
      case 'wow': return 'Build Mine';
      case 'coreSchedule': return 'Looks Good';
      case 'commitment': return 'Set My Time';
      case 'busy': return 'FINISH SCHEDULE';
      default: return 'CONTINUE';
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32">
      <div className="flex justify-center gap-2 mb-8">
        {SUB_STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              step === s
                ? 'w-8 bg-yellow-500'
                : currentStepIndex > i
                ? 'w-8 bg-yellow-500/40'
                : 'w-2 bg-gray-800'
            }`}
          />
        ))}
      </div>

      {renderContent()}

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={prevStep}
            className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            {getNextLabel()} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

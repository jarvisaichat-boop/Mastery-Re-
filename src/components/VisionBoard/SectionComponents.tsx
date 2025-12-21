import React, { useRef, useState } from 'react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { Habit } from '../../types';
import { DailySchedule, CustomEntry, RoutineItem, TimeBlock } from '../../types/visionBoard';
import { Plus, X, Compass, Target, Clock, Sparkles, Image, ToggleLeft, ToggleRight, EyeOff } from 'lucide-react';
import { ActionMenu } from './ActionMenu';
import { VisualTimelineEditor } from './VisualTimelineEditor';

interface SectionProps {
  mode: 'edit' | 'view';
  habits?: Habit[];
}

// --- Section A: Core Values ---
export const CoreValuesSection: React.FC<SectionProps> = ({ mode }) => {
  const { data, updateCoreValues } = useVisionBoard();
  const { coreValues, path } = data;

  const InlineField = ({ label, value, field }: { label: string, value: string, field: 'priority' | 'why' | 'purpose' | 'motto' }) => (
    <div className="mb-4">
      {mode === 'edit' ? (
        <div>
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-1 font-semibold">{label}</div>
          <input
            type="text"
            value={value}
            onChange={(e) => updateCoreValues({ [field]: e.target.value })}
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/40 transition-all"
          />
        </div>
      ) : (
        <p className="text-lg leading-relaxed">
          <span className="text-yellow-500 uppercase tracking-[0.15em] font-medium">{label}</span>{' '}
          <span className="text-white font-light">{value || <span className="text-gray-600 italic">Not set</span>}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full p-6 sm:p-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-3">
          <Compass className="w-6 h-6 text-yellow-500" />
        </div>
        <h2
          className="text-xl font-bold text-yellow-500 tracking-[0.15em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          CORE VALUES
        </h2>
        <p className="text-gray-500 text-xs mt-1">Your guiding principles</p>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto space-y-1">
        <InlineField label="PRIORITY" value={coreValues.priority} field="priority" />
        <InlineField label="WHY" value={coreValues.why} field="why" />
        <InlineField label="PURPOSE" value={coreValues.purpose} field="purpose" />
        <InlineField label="MOTTO" value={coreValues.motto} field="motto" />

        <div className="pt-4">
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-3 font-semibold">PERSONAL VALUES</div>
          {mode === 'edit' ? (
            <div className="space-y-4">
              {coreValues.values.map((val, idx) => (
                <div key={idx} className={`bg-black/20 rounded-lg p-3 border border-white/5 ${val.hidden ? 'opacity-50' : ''}`}>
                  <div className="flex gap-2 mb-2 items-center">
                    {val.hidden && <EyeOff size={14} className="text-gray-500 flex-shrink-0" />}
                    <input
                      type="text"
                      value={val.title}
                      placeholder="Value title"
                      onChange={(e) => {
                        const newValues = [...coreValues.values];
                        newValues[idx] = { ...newValues[idx], title: e.target.value };
                        updateCoreValues({ values: newValues });
                      }}
                      className={`flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-yellow-500 text-sm font-medium ${val.hidden ? 'line-through' : ''}`}
                    />
                    <ActionMenu
                      index={idx}
                      totalItems={coreValues.values.length}
                      isHidden={val.hidden}
                      onMoveUp={() => {
                        if (idx > 0) {
                          const newValues = [...coreValues.values];
                          [newValues[idx - 1], newValues[idx]] = [newValues[idx], newValues[idx - 1]];
                          updateCoreValues({ values: newValues });
                        }
                      }}
                      onMoveDown={() => {
                        if (idx < coreValues.values.length - 1) {
                          const newValues = [...coreValues.values];
                          [newValues[idx], newValues[idx + 1]] = [newValues[idx + 1], newValues[idx]];
                          updateCoreValues({ values: newValues });
                        }
                      }}
                      onToggleHide={() => {
                        const newValues = [...coreValues.values];
                        newValues[idx] = { ...newValues[idx], hidden: !newValues[idx].hidden };
                        updateCoreValues({ values: newValues });
                      }}
                      onDelete={() => {
                        const newValues = coreValues.values.filter((_, i) => i !== idx);
                        updateCoreValues({ values: newValues });
                      }}
                    />
                  </div>
                  <textarea
                    value={val.description}
                    placeholder="Description..."
                    onChange={(e) => {
                      const newValues = [...coreValues.values];
                      newValues[idx] = { ...newValues[idx], description: e.target.value };
                      updateCoreValues({ values: newValues });
                    }}
                    className={`w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm h-16 resize-none ${val.hidden ? 'line-through' : ''}`}
                  />
                </div>
              ))}
              <button
                onClick={() => updateCoreValues({ values: [...coreValues.values, { title: '', description: '', hidden: false }] })}
                className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 mt-2"
              >
                <Plus size={14} /> ADD VALUE
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {coreValues.values.filter(v => v.title && !v.hidden).map((val, idx) => (
                <p key={idx} className="text-lg leading-relaxed">
                  <span className="text-yellow-500 font-medium uppercase tracking-wide inline-block max-w-[50%] truncate align-bottom">{val.title}</span>{' '}
                  <span className="text-white font-light">{val.description}</span>
                </p>
              ))}
              {/* Vision */}
              <p className="text-lg leading-relaxed">
                <span className="text-yellow-500 font-medium uppercase tracking-wide">VISION</span>{' '}
                <span className="text-white font-light">
                  {path.vision || 'Not set'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Section B: Path ---
export const PathSection: React.FC<SectionProps> = ({ mode, habits = [] }) => {
  const { data, updatePath } = useVisionBoard();
  const { path } = data;

  const lifeGoalHabits = habits.filter(h => h.type === 'Life Goal Habit');

  return (
    <div className="w-full p-6 sm:p-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-3">
          <Target className="w-6 h-6 text-yellow-500" />
        </div>
        <h2
          className="text-xl font-bold text-yellow-500 tracking-[0.15em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          PATH
        </h2>
        <p className="text-gray-500 text-xs mt-1">Your destination & journey</p>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto space-y-6">
        {/* Vision */}
        <div>
          <p className="text-lg leading-relaxed mb-3">
            <span className="text-yellow-500 font-medium uppercase tracking-wide">VISION</span>
          </p>
          <div className="bg-black/20 rounded-xl p-5 border border-white/5">
            {mode === 'edit' ? (
              <div className="space-y-3">
                <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
                  Think about: What do you want to <span className="text-yellow-500/80">feel</span>? What will you be <span className="text-yellow-500/80">doing</span>? What will it <span className="text-yellow-500/80">give you</span>?
                </p>
                <textarea
                  value={path.vision}
                  onChange={(e) => updatePath({ vision: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-white text-sm focus:border-yellow-500/50 transition-colors resize-none h-24"
                  placeholder="e.g. Do one exciting thing in life that makes me grow. Monetize that experience."
                />
              </div>
            ) : (
              <div className="text-lg text-white font-light leading-relaxed">
                {path.vision || <span className="text-gray-600 italic">Not set</span>}
              </div>
            )}
          </div>
        </div>

        {/* Short Term Vision (Projects) */}
        <div>
          <p className="text-lg leading-relaxed mb-2">
            <span className="text-yellow-500 font-medium uppercase tracking-wide">SHORT TERM VISION (PROJECTS)</span>
          </p>
          {mode === 'edit' ? (
            <div className="space-y-2">
              {path.projects.map((project, idx) => (
                <div key={idx} className={`flex gap-2 items-center ${project.hidden ? 'opacity-50' : ''}`}>
                  {project.hidden && <EyeOff size={14} className="text-gray-500 flex-shrink-0" />}
                  <input
                    value={project.text}
                    onChange={(e) => {
                      const newProjects = [...path.projects];
                      newProjects[idx] = { ...newProjects[idx], text: e.target.value };
                      updatePath({ projects: newProjects });
                    }}
                    className={`flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm ${project.hidden ? 'line-through' : ''}`}
                    placeholder="Project name..."
                  />
                  <ActionMenu
                    index={idx}
                    totalItems={path.projects.length}
                    isHidden={project.hidden}
                    onMoveUp={() => {
                      if (idx > 0) {
                        const newProjects = [...path.projects];
                        [newProjects[idx - 1], newProjects[idx]] = [newProjects[idx], newProjects[idx - 1]];
                        updatePath({ projects: newProjects });
                      }
                    }}
                    onMoveDown={() => {
                      if (idx < path.projects.length - 1) {
                        const newProjects = [...path.projects];
                        [newProjects[idx], newProjects[idx + 1]] = [newProjects[idx + 1], newProjects[idx]];
                        updatePath({ projects: newProjects });
                      }
                    }}
                    onToggleHide={() => {
                      const newProjects = [...path.projects];
                      newProjects[idx] = { ...newProjects[idx], hidden: !newProjects[idx].hidden };
                      updatePath({ projects: newProjects });
                    }}
                    onDelete={() => {
                      const newProjects = path.projects.filter((_, i) => i !== idx);
                      updatePath({ projects: newProjects });
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => updatePath({ projects: [...path.projects, { text: "", hidden: false }] })}
                className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
              >
                <Plus size={14} /> ADD PROJECT
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {path.projects.filter(p => p.text && !p.hidden).length > 0 ? (
                path.projects.filter(p => p.text && !p.hidden).map((project, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full bg-yellow-400"
                      style={{ boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)' }}
                    />
                    <span className="text-lg text-white font-light">{project.text}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-600 italic text-lg font-light">No projects set</li>
              )}
            </ul>
          )}
        </div>

        {/* Goals */}
        <div>
          <p className="text-lg leading-relaxed mb-2">
            <span className="text-yellow-500 font-medium uppercase tracking-wide">GOALS</span>
          </p>
          {mode === 'edit' ? (
            <div className="space-y-2">
              {path.quarterlyGoals.map((goal, idx) => (
                <div key={idx} className={`flex gap-2 items-center ${goal.hidden ? 'opacity-50' : ''}`}>
                  {goal.hidden && <EyeOff size={14} className="text-gray-500 flex-shrink-0" />}
                  <input
                    value={goal.text}
                    onChange={(e) => {
                      const newGoals = [...path.quarterlyGoals];
                      newGoals[idx] = { ...newGoals[idx], text: e.target.value };
                      updatePath({ quarterlyGoals: newGoals });
                    }}
                    className={`flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm ${goal.hidden ? 'line-through' : ''}`}
                  />
                  <ActionMenu
                    index={idx}
                    totalItems={path.quarterlyGoals.length}
                    isHidden={goal.hidden}
                    onMoveUp={() => {
                      if (idx > 0) {
                        const newGoals = [...path.quarterlyGoals];
                        [newGoals[idx - 1], newGoals[idx]] = [newGoals[idx], newGoals[idx - 1]];
                        updatePath({ quarterlyGoals: newGoals });
                      }
                    }}
                    onMoveDown={() => {
                      if (idx < path.quarterlyGoals.length - 1) {
                        const newGoals = [...path.quarterlyGoals];
                        [newGoals[idx], newGoals[idx + 1]] = [newGoals[idx + 1], newGoals[idx]];
                        updatePath({ quarterlyGoals: newGoals });
                      }
                    }}
                    onToggleHide={() => {
                      const newGoals = [...path.quarterlyGoals];
                      newGoals[idx] = { ...newGoals[idx], hidden: !newGoals[idx].hidden };
                      updatePath({ quarterlyGoals: newGoals });
                    }}
                    onDelete={() => {
                      const newGoals = path.quarterlyGoals.filter((_, i) => i !== idx);
                      updatePath({ quarterlyGoals: newGoals });
                    }}
                  />
                </div>
              ))}
              <button onClick={() => updatePath({ quarterlyGoals: [...path.quarterlyGoals, { text: "", hidden: false }] })} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
                <Plus size={14} /> ADD GOAL
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {path.quarterlyGoals.filter(g => g.text && !g.hidden).map((goal, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400"
                    style={{ boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)' }}
                  />
                  <span className="text-lg text-white font-light">{goal.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Habits */}
        <div>
          <p className="text-lg leading-relaxed mb-2">
            <span className="text-yellow-500 font-medium uppercase tracking-wide">HABITS</span>
          </p>
          <ul className="space-y-2">
            {lifeGoalHabits.length > 0 ? lifeGoalHabits.map((h) => (
              <li key={h.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full bg-green-400"
                  style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}
                />
                <span className="text-lg text-white font-light">{h.name}</span>
              </li>
            )) : (
              <li className="text-gray-600 italic text-lg font-light">No Life Goal Habits set</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Section C: Schedule ---
const ROUTINE_KEY_MAP: Record<'gmRoutine' | 'gdRoutine' | 'gnRoutine', 'gm' | 'gd' | 'gn'> = {
  gmRoutine: 'gm',
  gdRoutine: 'gd',
  gnRoutine: 'gn'
};

export const ScheduleSection = ({ schedule, updateSchedule, mode, habits = [] }: { schedule: DailySchedule; updateSchedule: (updates: Partial<DailySchedule>) => void; mode: 'view' | 'edit'; habits?: Habit[] }) => {
  const [habitDropdownOpen, setHabitDropdownOpen] = useState<'gm' | 'gd' | 'gn' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHabitDropdownOpen(null);
      }
    };
    if (habitDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [habitDropdownOpen]);

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const ProportionalTimeline = () => {
    const userTimeline = (schedule.timeline || []).filter(b => !b.hidden);
    const HOUR_HEIGHT = 20;
    const POINT_HEIGHT = 24;

    const sleepBlock = userTimeline.find(b => b.label.toLowerCase() === 'sleep' && !!b.endTime);
    const autoGeneratedPoints: TimeBlock[] = [];

    if (sleepBlock) {
      // Only generate Wake Up if it doesn't already exist at the end time
      const wakeUpExists = userTimeline.some(b =>
        b.time === sleepBlock.endTime &&
        b.label.toLowerCase().includes('wake')
      );

      if (!wakeUpExists && sleepBlock.endTime) {
        autoGeneratedPoints.push({
          time: sleepBlock.endTime,
          label: 'Wake Up',
          color: 'bg-yellow-400',
          hidden: false,
          isAutoGenerated: true
        });
      }

      // Only generate Sleep point if it doesn't already exist at the start time
      // And arguably, if we have a Sleep BLOCK, we might not need a Sleep POINT at the exact same time unless users want it.
      // But for consistency with the user's request, let's just de-dupe.
      const sleepPointExists = userTimeline.some(b =>
        b.time === sleepBlock.time &&
        b.label.toLowerCase() === 'sleep' &&
        !b.endTime // It's a point, not the block itself
      );

      if (!sleepPointExists) {
        // actually, if we have the block, do we even need the point? 
        // The block is labeled "Sleep". Having a point "Sleep" at the start is redundant.
        // I will SKIP adding the Sleep point if the block exists, to reduce clutter.
        // The user complained about "2 wake ups" (duplication). 
        // Removing the redundant Sleep point is also a UI improvement.
      }
    }

    const timeline = [...userTimeline, ...autoGeneratedPoints];

    type Segment = { type: 'gap' | 'block' | 'point'; startMinutes: number; endMinutes: number; block?: TimeBlock };

    // Handle wrapping blocks (e.g. 23:00 - 07:00) by splitting them
    const processedTimeline: TimeBlock[] = [];
    timeline.forEach(block => {
      const startMinutes = timeToMinutes(block.time);
      if (block.endTime) {
        const endMinutes = timeToMinutes(block.endTime);
        if (endMinutes < startMinutes) {
          // Block wraps around midnight
          // Part 1: Start to Midnight
          processedTimeline.push({
            ...block,
            endTime: '24:00'
          });
          // Part 2: Midnight to End
          processedTimeline.push({
            ...block,
            time: '00:00',
            endTime: block.endTime,
            // Optional: Mark as continuation?
          });
        } else {
          processedTimeline.push(block);
        }
      } else {
        processedTimeline.push(block);
      }
    });

    const sortedBlocks = processedTimeline.sort((a, b) => {
      const timeDiff = timeToMinutes(a.time) - timeToMinutes(b.time);
      if (timeDiff !== 0) return timeDiff;
      // Tie-breaker: Wake Up comes first
      if (a.label === 'Wake Up') return -1;
      if (b.label === 'Wake Up') return 1;
      return 0;
    });

    const segments: Segment[] = [];

    // Determine start time (00:00 or Wake Up time if in view mode)
    let startOfDayMinutes = 0;
    if (mode === 'view') {
      const wakeUpBlock = timeline.find(b => b.label === 'Wake Up');
      if (wakeUpBlock) {
        startOfDayMinutes = timeToMinutes(wakeUpBlock.time);
      }
    }

    let currentMinute = startOfDayMinutes;

    for (const block of sortedBlocks) {
      let startMinutes = timeToMinutes(block.time);
      let endMinutes = startMinutes;

      const isBlock = !!block.endTime;
      if (isBlock) {
        endMinutes = timeToMinutes(block.endTime!);
        if (endMinutes < startMinutes) endMinutes += 24 * 60;
      }

      // Skip blocks that happen entirely before the start time
      // Exception: Explicitly keep 'Wake Up' even if it matches start time exact
      const isWakeUp = block.label === 'Wake Up';
      if (endMinutes <= startOfDayMinutes && !isWakeUp) continue;

      // Clamp start time for blocks that span across the start time
      if (startMinutes < startOfDayMinutes) {
        startMinutes = startOfDayMinutes;
      }

      if (startMinutes > currentMinute) {
        segments.push({ type: 'gap', startMinutes: currentMinute, endMinutes: startMinutes });
      }

      if (!isBlock) {
        segments.push({ type: 'point', startMinutes, endMinutes: startMinutes, block });
        currentMinute = Math.max(currentMinute, startMinutes);
      } else {
        segments.push({ type: 'block', startMinutes, endMinutes, block });
        currentMinute = Math.max(currentMinute, endMinutes);
      }
    }

    if (currentMinute < 24 * 60) {
      segments.push({ type: 'gap', startMinutes: currentMinute, endMinutes: 24 * 60 });
    }

    const getHeight = (seg: Segment): number => {
      if (seg.type === 'point') return POINT_HEIGHT;
      const duration = seg.endMinutes - seg.startMinutes;
      return Math.max(4, (duration / 60) * HOUR_HEIGHT);
    };

    const formatTime = (minutes: number): string => {
      const h = Math.floor(minutes / 60) % 24;
      const m = minutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return (
      <div className="flex flex-col">
        {segments.map((seg, i) => {
          const height = getHeight(seg);
          const prevSeg = i > 0 ? segments[i - 1] : null;
          // Hide time if same as previous segment's START time
          // (Note: gaps also have start/end. If we have Gap end at X, Next start at X.
          // Gap displays start time. Next displays start time X.
          // We usually want to show time for new blocks/points.
          // But if we have Point 7:00, Block 7:00.
          // Point shows 7:00. Block shows 7:00 -> Hide Block's 7:00.
          const isCheckable = seg.type === 'point' || seg.type === 'block';
          const prevIsCheckable = prevSeg && (prevSeg.type === 'point' || prevSeg.type === 'block');

          const hideTime = prevIsCheckable && isCheckable && prevSeg!.startMinutes === seg.startMinutes;

          const timeDisplay = hideTime ? '' : formatTime(seg.startMinutes);

          if (seg.type === 'gap') {
            if (height < 8) return null;
            return (
              <div key={i} className="flex items-center gap-2 opacity-30" style={{ height: `${height}px` }}>
                <div className="text-[9px] text-gray-600 font-mono w-10">{timeDisplay}</div>
                <div className="flex-1 border-l border-dashed border-white/10 h-full ml-1" />
              </div>
            );
          }

          if (seg.type === 'point' && seg.block) {
            const block = seg.block;
            return (
              <div key={i} className="flex items-center gap-2 py-1" style={{ minHeight: `${POINT_HEIGHT}px` }}>
                <div className="text-[9px] text-gray-500 font-mono w-10">{timeDisplay}</div>
                <div className={`w-3 h-3 rounded-full ${block.color} flex-shrink-0`} style={{ boxShadow: '0 0 8px currentColor' }} />
                <span className="text-sm text-gray-200">{block.label}</span>
              </div>
            );
          }

          if (seg.type === 'block' && seg.block) {
            const block = seg.block;
            // Helper to get hex from tailwind class if needed, or use color directly
            // For now, assuming block.color is a tailwind class like "bg-blue-500" or hex.
            // But VisualTimelineEditor has a robust getHexColor.
            // unique helper here to be safe:
            const getColorStyle = (color: string, opacity: number) => {
              // Map common tailwind classes to hex for transparency
              const colors: Record<string, string> = {
                'bg-red-400': '#ef4444', 'bg-orange-400': '#f97316', 'bg-amber-400': '#f59e0b',
                'bg-yellow-400': '#facc15', 'bg-lime-400': '#a3e635', 'bg-green-400': '#4ade80',
                'bg-emerald-400': '#34d399', 'bg-teal-400': '#2dd4bf', 'bg-cyan-400': '#22d3ee',
                'bg-sky-400': '#38bdf8', 'bg-blue-400': '#60a5fa', 'bg-indigo-400': '#818cf8',
                'bg-violet-400': '#a78bfa', 'bg-purple-400': '#c084fc', 'bg-fuchsia-400': '#e879f9',
                'bg-pink-400': '#f472b6', 'bg-rose-400': '#fb7185', 'bg-slate-400': '#94a3b8',
                'bg-gray-400': '#9ca3af', 'bg-zinc-400': '#a1a1aa', 'bg-neutral-400': '#a3a3a3',
                'bg-stone-400': '#a8a29e',
              };
              const hex = colors[color] || '#60a5fa'; // fallback
              return `${hex}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            };

            return (
              <div key={i} className="flex gap-2" style={{ minHeight: `${Math.max(32, height)}px` }}>
                <div className="text-[9px] text-gray-500 font-mono w-10 pt-1">{timeDisplay}</div>
                <div
                  className="flex-1 rounded-lg border border-white/10 flex flex-col justify-center px-2 py-1"
                  style={{ backgroundColor: getColorStyle(block.color, 0.2), borderColor: getColorStyle(block.color, 0.4) }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ backgroundColor: getColorStyle(block.color, 1) }} />
                    <span className="text-sm text-gray-200 font-medium truncate">{block.label}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 ml-4">{block.time} - {block.endTime}</div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  const RoutineList = ({ title, items, field, color }: { title: string, items: RoutineItem[], field: 'gmRoutine' | 'gdRoutine' | 'gnRoutine', color: string }) => (
    <div className="mb-5">
      <div className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold ${color}`}>{title}</div>
      {mode === 'edit' ? (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className={`flex gap-2 items-center ${item.hidden ? 'opacity-50' : ''}`}>
              {item.hidden && <EyeOff size={14} className="text-gray-500 flex-shrink-0" />}
              <input
                value={item.text}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[idx] = { ...newItems[idx], text: e.target.value };
                  updateSchedule({ [field]: newItems });
                }}
                className={`flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm ${item.hidden ? 'line-through' : ''}`}
              />
              <ActionMenu
                index={idx}
                totalItems={items.length}
                isHidden={item.hidden}
                onMoveUp={() => {
                  if (idx > 0) {
                    const newItems = [...items];
                    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
                    updateSchedule({ [field]: newItems });
                  }
                }}
                onMoveDown={() => {
                  if (idx < items.length - 1) {
                    const newItems = [...items];
                    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
                    updateSchedule({ [field]: newItems });
                  }
                }}
                onToggleHide={() => {
                  const newItems = [...items];
                  newItems[idx] = { ...newItems[idx], hidden: !newItems[idx].hidden };
                  updateSchedule({ [field]: newItems });
                }}
                onDelete={() => {
                  const newItems = items.filter((_, i) => i !== idx);
                  updateSchedule({ [field]: newItems });
                }}
              />
            </div>
          ))}
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => {
              updateSchedule({ [field]: [...items, { text: "", hidden: false }] })
            }} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
              <Plus size={14} /> ADD ITEM
            </button>
            <div className="relative" ref={habitDropdownOpen === ROUTINE_KEY_MAP[field] ? dropdownRef : null}>
              <button
                onClick={() => {
                  const key = ROUTINE_KEY_MAP[field];
                  setHabitDropdownOpen(habitDropdownOpen === key ? null : key);
                }}
                className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1"
              >
                <Plus size={14} /> ADD HABIT
              </button>
              {habitDropdownOpen === ROUTINE_KEY_MAP[field] && habits.length > 0 && (
                <div className="absolute top-6 left-0 z-50 bg-gray-800 border border-white/10 rounded-lg shadow-xl py-1 min-w-[180px] max-h-48 overflow-y-auto">
                  {habits.map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => {
                        updateSchedule({ [field]: [...items, { text: habit.name, hidden: false }] });
                        setHabitDropdownOpen(null);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      {habit.name}
                    </button>
                  ))}
                </div>
              )}
              {habitDropdownOpen === ROUTINE_KEY_MAP[field] && habits.length === 0 && (
                <div className="absolute top-6 left-0 z-50 bg-gray-800 border border-white/10 rounded-lg shadow-xl py-2 px-3 min-w-[180px]">
                  <span className="text-xs text-gray-400">No habits available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.filter(i => i.text && !i.hidden).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-lg text-gray-300 font-light">
              <span className="text-gray-600">•</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="w-full p-6 sm:p-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-3">
          <Clock className="w-6 h-6 text-yellow-500" />
        </div>
        <h2
          className="text-xl font-bold text-yellow-500 tracking-[0.15em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          SCHEDULE
        </h2>
        <p className="text-gray-500 text-xs mt-1">Your daily rhythm</p>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto">
        {/* Timeline */}
        <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-6">
          {mode === 'edit' ? (
            <VisualTimelineEditor
              timeline={schedule.timeline || []}
              onUpdate={(newTimeline) => updateSchedule({ timeline: newTimeline })}
            />
          ) : (
            <ProportionalTimeline />
          )}
        </div>

        {/* Routines */}
        <RoutineList title="GM ROUTINE" items={schedule.gmRoutine} field="gmRoutine" color="text-yellow-500/70" />
        <RoutineList title="GD ROUTINE" items={schedule.gdRoutine} field="gdRoutine" color="text-blue-400/70" />
        <RoutineList title="GN ROUTINE" items={schedule.gnRoutine} field="gnRoutine" color="text-purple-400/70" />

        {/* Busy Day Plan */}
        {(mode === 'edit' || schedule.busyDayPlan) && (
          <div className="mt-6 bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 font-semibold">BUSY DAY PLAN</div>
            {mode === 'edit' ? (
              <textarea
                value={schedule.busyDayPlan}
                onChange={(e) => updateSchedule({ busyDayPlan: e.target.value })}
                placeholder="What's your fallback plan for busy days?"
                className="w-full bg-black/30 border border-white/10 rounded p-3 text-white text-sm h-24 placeholder-gray-600"
              />
            ) : (
              <div className="text-gray-300 font-light italic text-lg">"{schedule.busyDayPlan}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Section D: Custom ---
export const CustomSectionComponent: React.FC<SectionProps> = ({ mode }) => {
  const { data, updateCustom } = useVisionBoard();
  const { custom } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateCustom({ images: [...custom.images, base64] });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (idx: number) => {
    updateCustom({ images: custom.images.filter((_, i) => i !== idx) });
  };

  const addEntry = () => {
    updateCustom({ entries: [...custom.entries, { title: '', items: [{ text: '', hidden: false }], hidden: false }] });
  };

  const updateEntry = (idx: number, updates: Partial<CustomEntry>) => {
    const newEntries = [...custom.entries];
    newEntries[idx] = { ...newEntries[idx], ...updates };
    updateCustom({ entries: newEntries });
  };

  const removeEntry = (idx: number) => {
    updateCustom({ entries: custom.entries.filter((_, i) => i !== idx) });
  };

  const moveEntry = (idx: number, direction: 'up' | 'down') => {
    const newEntries = [...custom.entries];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < newEntries.length) {
      [newEntries[idx], newEntries[targetIdx]] = [newEntries[targetIdx], newEntries[idx]];
      updateCustom({ entries: newEntries });
    }
  };

  const toggleEntryHidden = (idx: number) => {
    const newEntries = [...custom.entries];
    newEntries[idx] = { ...newEntries[idx], hidden: !newEntries[idx].hidden };
    updateCustom({ entries: newEntries });
  };

  const addItemToEntry = (entryIdx: number) => {
    const newEntries = [...custom.entries];
    newEntries[entryIdx] = { ...newEntries[entryIdx], items: [...newEntries[entryIdx].items, { text: '', hidden: false }] };
    updateCustom({ entries: newEntries });
  };

  const updateItemInEntry = (entryIdx: number, itemIdx: number, value: string) => {
    const newEntries = [...custom.entries];
    const newItems = [...newEntries[entryIdx].items];
    newItems[itemIdx] = { ...newItems[itemIdx], text: value };
    newEntries[entryIdx] = { ...newEntries[entryIdx], items: newItems };
    updateCustom({ entries: newEntries });
  };

  const removeItemFromEntry = (entryIdx: number, itemIdx: number) => {
    const newEntries = [...custom.entries];
    newEntries[entryIdx] = {
      ...newEntries[entryIdx],
      items: newEntries[entryIdx].items.filter((_, i) => i !== itemIdx)
    };
    updateCustom({ entries: newEntries });
  };

  const moveItemInEntry = (entryIdx: number, itemIdx: number, direction: 'up' | 'down') => {
    const newEntries = [...custom.entries];
    const items = [...newEntries[entryIdx].items];
    const targetIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
    if (targetIdx >= 0 && targetIdx < items.length) {
      [items[itemIdx], items[targetIdx]] = [items[targetIdx], items[itemIdx]];
      newEntries[entryIdx] = { ...newEntries[entryIdx], items };
      updateCustom({ entries: newEntries });
    }
  };

  const toggleItemHidden = (entryIdx: number, itemIdx: number) => {
    const newEntries = [...custom.entries];
    const items = [...newEntries[entryIdx].items];
    items[itemIdx] = { ...items[itemIdx], hidden: !items[itemIdx].hidden };
    newEntries[entryIdx] = { ...newEntries[entryIdx], items };
    updateCustom({ entries: newEntries });
  };

  return (
    <div className="w-full p-6 sm:p-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-3">
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <h2
          className="text-xl font-bold text-yellow-500 tracking-[0.15em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          CUSTOM
        </h2>
        <p className="text-gray-500 text-xs mt-1">Your personalized section</p>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto space-y-6">
        {/* Opt-in Toggle (Edit mode only) */}
        {mode === 'edit' && (
          <div className="flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5">
            <div>
              <div className="text-sm text-white font-medium">Show in Vision Board</div>
              <div className="text-[10px] text-gray-500">Display this section during GM sequence</div>
            </div>
            <button
              onClick={() => updateCustom({ enabled: !custom.enabled })}
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              {custom.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-500" />}
            </button>
          </div>
        )}

        {/* Custom Entries */}
        {custom.entries.map((entry, entryIdx) => (
          mode === 'edit' || (!entry.hidden && entry.items.some(i => i.text && !i.hidden)) ? (
            <div key={entryIdx} className={`${mode === 'edit' ? 'bg-black/20 rounded-xl p-4 border border-white/5' : ''} ${entry.hidden ? 'opacity-50' : ''}`}>
              {mode === 'edit' ? (
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    {entry.hidden && <EyeOff size={14} className="text-gray-500 flex-shrink-0" />}
                    <input
                      type="text"
                      value={entry.title}
                      onChange={(e) => updateEntry(entryIdx, { title: e.target.value })}
                      placeholder="Section title (e.g., Goals, Affirmations)"
                      className={`flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-yellow-500 text-sm font-medium uppercase ${entry.hidden ? 'line-through' : ''}`}
                    />
                    <ActionMenu
                      index={entryIdx}
                      totalItems={custom.entries.length}
                      isHidden={entry.hidden}
                      onMoveUp={() => moveEntry(entryIdx, 'up')}
                      onMoveDown={() => moveEntry(entryIdx, 'down')}
                      onToggleHide={() => toggleEntryHidden(entryIdx)}
                      onDelete={() => removeEntry(entryIdx)}
                    />
                  </div>
                  <div className="space-y-2">
                    {entry.items.map((item, itemIdx) => (
                      <div key={itemIdx} className={`flex gap-2 items-center ${item.hidden ? 'opacity-50' : ''}`}>
                        {item.hidden && <EyeOff size={14} className="text-gray-500 flex-shrink-0" />}
                        <input
                          value={item.text}
                          onChange={(e) => updateItemInEntry(entryIdx, itemIdx, e.target.value)}
                          className={`flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm ${item.hidden ? 'line-through' : ''}`}
                          placeholder="Entry..."
                        />
                        <ActionMenu
                          index={itemIdx}
                          totalItems={entry.items.length}
                          isHidden={item.hidden}
                          onMoveUp={() => moveItemInEntry(entryIdx, itemIdx, 'up')}
                          onMoveDown={() => moveItemInEntry(entryIdx, itemIdx, 'down')}
                          onToggleHide={() => toggleItemHidden(entryIdx, itemIdx)}
                          onDelete={() => removeItemFromEntry(entryIdx, itemIdx)}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addItemToEntry(entryIdx)}
                      className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
                    >
                      <Plus size={14} /> ADD ITEM
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {entry.title && (
                    <p className="text-lg leading-relaxed mb-3">
                      <span className="text-yellow-500 font-medium uppercase tracking-wide">{entry.title}</span>
                    </p>
                  )}
                  <ul className="space-y-2">
                    {entry.items.filter(i => i.text && !i.hidden).map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full bg-yellow-400"
                          style={{ boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)' }}
                        />
                        <span className="text-lg text-white font-light">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null
        ))}

        {/* Add Entry Button (Edit mode only) */}
        {mode === 'edit' && (
          <button
            onClick={addEntry}
            className="w-full flex items-center justify-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 py-3 border border-dashed border-yellow-500/30 rounded-xl hover:border-yellow-500/50 transition-colors"
          >
            <Plus size={14} /> ADD CUSTOM SECTION
          </button>
        )}

        {/* Images */}
        {(custom.images.length > 0 || mode === 'edit') && (
          <div className="space-y-3">
            <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] font-semibold">IMAGES</div>
            <div className="grid grid-cols-2 gap-3">
              {custom.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Custom ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-white/10"
                  />
                  {mode === 'edit' && (
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {mode === 'edit' && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 py-3 border border-dashed border-yellow-500/30 rounded-xl hover:border-yellow-500/50 transition-colors"
                >
                  <Image size={14} /> ADD IMAGE
                </button>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {mode === 'view' && custom.entries.length === 0 && custom.images.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-lg italic">No custom content yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

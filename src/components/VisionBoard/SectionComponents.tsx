import React from 'react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { Habit } from '../../types';
import { DailySchedule } from '../../types/visionBoard';
import { Plus, X, Compass, Target, Clock } from 'lucide-react';

interface SectionProps {
  mode: 'edit' | 'view';
  habits?: Habit[];
}

// --- Section A: Core Values ---
export const CoreValuesSection: React.FC<SectionProps> = ({ mode }) => {
  const { data, updateCoreValues } = useVisionBoard();
  const { coreValues } = data;

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
        <div className="flex items-baseline gap-3">
          <span className="text-lg text-yellow-500 uppercase tracking-[0.15em] font-medium min-w-[90px]">{label}</span>
          <span className="text-lg text-white font-light">{value || <span className="text-gray-600 italic">Not set</span>}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full p-6 sm:p-8">
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
                <div key={idx} className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={val.title}
                      placeholder="Value title"
                      onChange={(e) => {
                        const newValues = [...coreValues.values];
                        newValues[idx] = { ...newValues[idx], title: e.target.value };
                        updateCoreValues({ values: newValues });
                      }}
                      className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-yellow-500 text-sm font-medium"
                    />
                    <button
                      onClick={() => {
                        const newValues = coreValues.values.filter((_, i) => i !== idx);
                        updateCoreValues({ values: newValues });
                      }}
                      className="p-2 text-gray-500 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <textarea
                    value={val.description}
                    placeholder="Description..."
                    onChange={(e) => {
                      const newValues = [...coreValues.values];
                      newValues[idx] = { ...newValues[idx], description: e.target.value };
                      updateCoreValues({ values: newValues });
                    }}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm h-16 resize-none"
                  />
                </div>
              ))}
              <button
                onClick={() => updateCoreValues({ values: [...coreValues.values, { title: '', description: '' }] })}
                className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 mt-2"
              >
                <Plus size={14} /> ADD VALUE
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {coreValues.values.filter(v => v.title).map((val, idx) => (
                <li key={idx}>
                  <div className="text-yellow-500 font-medium">{val.title}</div>
                  {val.description && (
                    <div className="text-gray-300 text-sm font-light mt-0.5">{val.description}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Section B: Path ---
export const PathSection: React.FC<SectionProps> = ({ mode, habits = [] }) => {
  const { data, updatePath, updateGrandVision } = useVisionBoard();
  const { path } = data;

  const lifeGoalHabits = habits.filter(h => h.type === 'Life Goal Habit');

  return (
    <div className="h-full p-6 sm:p-8">
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
        {/* Grand Vision */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-3 font-semibold">GRAND VISION</div>
          {mode === 'edit' ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Feeling...</label>
                <input
                  type="text"
                  value={path.grandVision.feel}
                  onChange={(e) => updateGrandVision({ feel: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:border-yellow-500/50 transition-colors"
                  placeholder="e.g. Excited and Fascinated"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">While...</label>
                <input
                  type="text"
                  value={path.grandVision.how}
                  onChange={(e) => updateGrandVision({ how: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:border-yellow-500/50 transition-colors"
                  placeholder="e.g. Building my own things"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Giving me...</label>
                <input
                  type="text"
                  value={path.grandVision.what}
                  onChange={(e) => updateGrandVision({ what: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:border-yellow-500/50 transition-colors"
                  placeholder="e.g. Freedom and Growth"
                />
              </div>
            </div>
          ) : (
            <div className="text-base text-gray-100 leading-relaxed">
              "Feeling <span className="text-yellow-400 font-medium">{path.grandVision.feel || '...'}</span> while{' '}
              <span className="text-yellow-400 font-medium">{path.grandVision.how || '...'}</span> giving me{' '}
              <span className="text-yellow-400 font-medium">{path.grandVision.what || '...'}</span>."
            </div>
          )}
        </div>

        {/* Project */}
        <div>
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-2 font-semibold">PROJECT</div>
          {mode === 'edit' ? (
            <input
              type="text"
              value={path.currentProject}
              onChange={(e) => updatePath({ currentProject: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500/50 transition-colors"
            />
          ) : (
            <div className="text-lg text-white font-light">{path.currentProject || <span className="text-gray-600 italic">Not set</span>}</div>
          )}
        </div>

        {/* Goals */}
        <div>
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-3 font-semibold">GOALS</div>
          {mode === 'edit' ? (
            <div className="space-y-2">
              {path.quarterlyGoals.map((g, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={g}
                    onChange={(e) => {
                      const newGoals = [...path.quarterlyGoals];
                      newGoals[idx] = e.target.value;
                      updatePath({ quarterlyGoals: newGoals });
                    }}
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm"
                  />
                  <button onClick={() => {
                    const newGoals = path.quarterlyGoals.filter((_, i) => i !== idx);
                    updatePath({ quarterlyGoals: newGoals });
                  }} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
                </div>
              ))}
              <button onClick={() => updatePath({ quarterlyGoals: [...path.quarterlyGoals, ""] })} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
                <Plus size={14} /> ADD GOAL
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {path.quarterlyGoals.filter(g => g).map((g, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div 
                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                    style={{ boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)' }}
                  />
                  <span className="text-gray-200 font-light">{g}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Habits */}
        <div>
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-3 font-semibold">HABITS</div>
          <ul className="space-y-2">
            {lifeGoalHabits.length > 0 ? lifeGoalHabits.map((h) => (
              <li key={h.id} className="flex items-center gap-3">
                <div 
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}
                />
                <span className="text-gray-200 font-light">{h.name}</span>
              </li>
            )) : (
              <li className="text-gray-600 italic text-sm">No Life Goal Habits set</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Section C: Schedule ---
export const ScheduleSection = ({ schedule, updateSchedule, mode, habits }: { schedule: DailySchedule; updateSchedule: (updates: Partial<DailySchedule>) => void; mode: 'view' | 'edit'; habits: Habit[] }) => {
  const lifeGoalHabits = habits.filter(h => h.type === 'Life Goal Habit');

  const TimeBlock = ({ time, label, color }: { time: string, label: string, color: string }) => (
    <div className="flex items-center gap-3 py-2">
      <div className="text-[10px] text-gray-500 font-mono w-12">{time}</div>
      <div 
        className={`w-2 h-2 rounded-full ${color}`}
        style={{ boxShadow: `0 0 8px currentColor` }}
      />
      <div className="text-sm text-gray-200 font-light">{label}</div>
    </div>
  );

  const RoutineList = ({ title, items, field, color }: { title: string, items: string[], field: keyof DailySchedule, color: string }) => (
    <div className="mb-5">
      <div className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold ${color}`}>{title}</div>
      {mode === 'edit' ? (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  if (!Array.isArray(schedule[field])) return;
                  const newItems = [...(schedule[field] as string[])];
                  newItems[idx] = e.target.value;
                  updateSchedule({ [field]: newItems });
                }}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm"
              />
              <button onClick={() => {
                if (!Array.isArray(schedule[field])) return;
                const newItems = (schedule[field] as string[]).filter((_, i) => i !== idx);
                updateSchedule({ [field]: newItems });
              }} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
            </div>
          ))}
          <button onClick={() => {
            if (!Array.isArray(schedule[field])) return;
            updateSchedule({ [field]: [...(schedule[field] as string[]), ""] })
          }} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
            <Plus size={14} /> ADD ITEM
          </button>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.filter(i => i).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300 font-light">
              <span className="text-gray-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="h-full p-6 sm:p-8">
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
          <TimeBlock time="06:00" label="Wake Up" color="bg-gray-400" />
          <TimeBlock time="07:00" label="GM Routine" color="bg-yellow-400" />
          <TimeBlock time="10:00" label="Deep Work" color="bg-blue-400" />
          <TimeBlock time="17:00" label="No Cheap Dopamine" color="bg-red-400" />
          <TimeBlock time="21:00" label="Wind Down" color="bg-green-400" />
          <TimeBlock time="23:00" label="Sleep" color="bg-purple-400" />
        </div>

        {/* Routines */}
        <RoutineList title="GM ROUTINE" items={schedule.gmRoutine} field="gmRoutine" color="text-yellow-500/70" />
        <RoutineList title="GD ROUTINE" items={schedule.gdRoutine} field="gdRoutine" color="text-blue-400/70" />
        <RoutineList title="GN ROUTINE" items={schedule.gnRoutine} field="gnRoutine" color="text-purple-400/70" />

        {/* Daily Habits */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-[0.2em] mb-3 font-semibold">DAILY HABIT STACK</div>
          <div className="space-y-2">
            {lifeGoalHabits.length > 0 ? lifeGoalHabits.map(h => (
              <div key={h.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                <div 
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}
                />
                <span className="text-sm text-gray-200 font-light">{h.name}</span>
              </div>
            )) : (
              <div className="text-gray-600 text-sm italic">No habits linked yet</div>
            )}
          </div>
        </div>

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
              <div className="text-gray-300 font-light italic text-sm">"{schedule.busyDayPlan}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

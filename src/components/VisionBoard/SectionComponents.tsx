import React from 'react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { Habit } from '../../types';
import { DailySchedule } from '../../types/visionBoard';
import { ChevronRight, Plus, X } from 'lucide-react';

interface SectionProps {
  mode: 'edit' | 'view';
  habits?: Habit[]; // Only needed for PathSection
}

// --- Section A: Core Values ---
export const CoreValuesSection: React.FC<SectionProps> = ({ mode }) => {
  const { data, updateCoreValues } = useVisionBoard();
  const { coreValues } = data;

  const InputOrText = ({ label, value, field }: { label: string, value: string, field: keyof typeof coreValues }) => (
    <div className="mb-6">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-semibold">{label}</div>
      {mode === 'edit' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => updateCoreValues({ [field]: e.target.value })}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all font-light"
        />
      ) : (
        <div className="text-xl sm:text-2xl text-white font-light">{value}</div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 no-scrollbar">
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-black text-yellow-500 mb-2 tracking-[0.2em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          CORE VALUES
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full opacity-50"></div>
      </div>

      <div className="max-w-md mx-auto">
        <InputOrText label="PRIORITY" value={coreValues.priority} field="priority" />
        <InputOrText label="WHY" value={coreValues.why} field="why" />
        <InputOrText label="PURPOSE" value={coreValues.purpose} field="purpose" />
        <InputOrText label="MOTTO" value={coreValues.motto} field="motto" />

        <div className="mb-6">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">PERSONAL VALUES</div>
          {mode === 'edit' ? (
            <div className="space-y-2">
              {coreValues.values.map((val, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const newValues = [...coreValues.values];
                      newValues[idx] = e.target.value;
                      updateCoreValues({ values: newValues });
                    }}
                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-2 text-white text-sm"
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
              ))}
              <button
                onClick={() => updateCoreValues({ values: [...coreValues.values, ""] })}
                className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 mt-2"
              >
                <Plus size={14} /> ADD VALUE
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {coreValues.values.map((val, idx) => (
                <li key={idx} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] group-hover:scale-125 transition-transform" />
                  <span className="text-xl text-gray-100 font-normal tracking-wide">{val}</span>
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
    <div className="h-full overflow-y-auto p-6 sm:p-8 no-scrollbar">
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-black text-yellow-500 mb-2 tracking-[0.2em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          PATH
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full opacity-50"></div>
      </div>

      <div className="max-w-md mx-auto space-y-10">
        {/* Grand Vision */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="text-xs text-yellow-500/80 uppercase tracking-[0.2em] mb-4 font-bold">GRAND VISION</div>
          {mode === 'edit' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Feeling...</label>
                <input
                  type="text"
                  value={path.grandVision.feel}
                  onChange={(e) => updateGrandVision({ feel: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:border-yellow-500/50 transition-colors"
                  placeholder="e.g. Excited and Fascinated"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">While...</label>
                <input
                  type="text"
                  value={path.grandVision.how}
                  onChange={(e) => updateGrandVision({ how: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:border-yellow-500/50 transition-colors"
                  placeholder="e.g. Building my own things"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Giving me...</label>
                <input
                  type="text"
                  value={path.grandVision.what}
                  onChange={(e) => updateGrandVision({ what: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:border-yellow-500/50 transition-colors"
                  placeholder="e.g. Freedom and Growth"
                />
              </div>
              <div className="text-xs text-gray-500 italic mt-2">
                Preview: "Feeling {path.grandVision.feel} while {path.grandVision.how} giving me {path.grandVision.what}."
              </div>
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl text-white font-light leading-relaxed drop-shadow-md">
              "Feeling <span className="text-yellow-400 font-bold" style={{ textShadow: '0 0 15px rgba(250,204,21,0.3)' }}>{path.grandVision.feel}</span> while <span className="text-yellow-400 font-bold" style={{ textShadow: '0 0 15px rgba(250,204,21,0.3)' }}>{path.grandVision.how}</span> giving me <span className="text-yellow-400 font-bold" style={{ textShadow: '0 0 15px rgba(250,204,21,0.3)' }}>{path.grandVision.what}</span>."
            </div>
          )}
        </div>

        {/* Project */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="text-xs text-yellow-500/80 uppercase tracking-[0.2em] mb-4 font-bold">PROJECT</div>
          {mode === 'edit' ? (
            <input
              type="text"
              value={path.currentProject}
              onChange={(e) => updatePath({ currentProject: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500/50 transition-colors"
            />
          ) : (
            <div className="text-xl text-white font-light tracking-wide">{path.currentProject}</div>
          )}
        </div>

        {/* Goals */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="text-xs text-yellow-500/80 uppercase tracking-[0.2em] mb-4 font-bold">GOALS</div>
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
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm"
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
            <ul className="space-y-4">
              {path.quarterlyGoals.map((g, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                  <span className="text-lg text-gray-200 font-light tracking-wide">{g}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Habits (Standards) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="text-xs text-yellow-500/80 uppercase tracking-[0.2em] mb-4 font-bold">HABITS</div>
          <ul className="space-y-4">
            {lifeGoalHabits.length > 0 ? lifeGoalHabits.map((h) => (
              <li key={h.id} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-lg text-gray-200 font-light tracking-wide">{h.name}</span>
              </li>
            )) : (
              <li className="text-gray-500 italic text-sm">No Life Goal Habits set in Tracker.</li>
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

  const RoutineList = ({ title, items, field }: { title: string, items: string[], field: keyof DailySchedule }) => (
    <div className="mb-8">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">{title}</div>
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
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-2 text-white text-sm"
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
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="text-gray-200 font-light">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 no-scrollbar">
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-black text-yellow-500 mb-2 tracking-[0.2em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
        >
          SCHEDULE
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full opacity-50"></div>
      </div>

      {/* Timeline Visual - Block Calendar Style */}
      <div className="relative border-l border-white/10 ml-4 pb-10 space-y-6">
        {/* Helper to render a block */}
        {renderTimeBlock("06:00", "Wake Up", "bg-gray-800", "h-12")}
        {renderTimeBlock("07:00", "GM ROUTINE", "bg-yellow-500/20 border-l-2 border-yellow-500", "h-24", [
          "Morning Acts (Pee, Weight, Sunlight)",
          "Mental (Headspace, Gratitude)",
          "Physical (Protein, Abs, Chest)"
        ])}
        {renderTimeBlock("10:00", "GD ROUTINE", "bg-blue-500/20 border-l-2 border-blue-500", "h-32", [
          "Work on my goals",
          "Code for 1 hour (Make sure this is included)"
        ])}
        {renderTimeBlock("17:00", "No Entertainment", "bg-red-500/20 border-l-2 border-red-500", "h-16", [
          "No cheap dopamine until 5 PM"
        ])}
        {renderTimeBlock("21:00", "Work Done", "bg-green-500/20 border-l-2 border-green-500", "h-16", [
          "Wind down starts"
        ])}
        {renderTimeBlock("23:00", "Sleep", "bg-purple-500/20 border-l-2 border-purple-500", "h-12")}

        {/* Integrated Habits Section in Schedule */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">DAILY HABIT STACK</h4>
          <div className="space-y-3">
            {lifeGoalHabits.length > 0 ? lifeGoalHabits.map(h => (
              <div key={h.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-sm text-gray-200">{h.name}</span>
              </div>
            )) : (
              <div className="text-gray-500 text-sm italic">No habits linked yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <RoutineList title="GM ROUTINE" items={schedule.gmRoutine} field="gmRoutine" />
        <RoutineList title="GD ROUTINE" items={schedule.gdRoutine} field="gdRoutine" />
        <RoutineList title="GN ROUTINE" items={schedule.gnRoutine} field="gnRoutine" />

        <div className="mt-12 bg-gray-800/30 border border-gray-700 rounded-xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">THE BUSY DAY PLAN</div>
          {mode === 'edit' ? (
            <textarea
              value={schedule.busyDayPlan}
              onChange={(e) => updateSchedule({ busyDayPlan: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white text-sm h-24"
            />
          ) : (
            <div className="text-white font-light leading-relaxed italic opacity-80">
              "{schedule.busyDayPlan}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for Time Blocks
function renderTimeBlock(time: string, title: string, colorClass: string, heightClass: string, items?: string[]) {
  return (
    <div className={`relative pl-8 ${heightClass}`}>
      <div className="absolute -left-[21px] top-0 bg-black border border-white/20 text-[10px] text-gray-400 px-1 py-0.5 rounded font-mono">
        {time}
      </div>
      <div className={`w-full h-full rounded-lg p-3 ${colorClass} overflow-hidden hover:overflow-visible group relative z-10 transition-all hover:z-20`}>
        <div className="font-bold text-white text-sm mb-1">{title}</div>
        {items && (
          <ul className="space-y-1">
            {items.map((item, idx) => (
              <li key={idx} className="text-xs text-white/70 truncate group-hover:whitespace-normal">• {item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

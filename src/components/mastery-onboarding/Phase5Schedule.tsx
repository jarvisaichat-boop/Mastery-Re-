import React, { useState } from 'react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { VisualTimelineEditor } from '../VisionBoard/VisualTimelineEditor';
import { MasteryProfile } from '../../types/onboarding';
import { ArrowRight, Clock, Plus, Trash2 } from 'lucide-react';
import { RoutineItem } from '../../types/visionBoard';

interface Phase5ScheduleProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase5Schedule({ onComplete }: Phase5ScheduleProps) {
  const { data, updateSchedule } = useVisionBoard();
  const { schedule } = data;

  const [step, setStep] = useState<'timeline' | 'gm' | 'gd' | 'gn' | 'busy' | 'finish'>('timeline');

  // Routine editing state
  const [currentRoutineItems, setCurrentRoutineItems] = useState<RoutineItem[]>([]);

  // Init routine items when switching steps
  React.useEffect(() => {
    if (step === 'gm') setCurrentRoutineItems(schedule.gmRoutine || []);
    if (step === 'gd') setCurrentRoutineItems(schedule.gdRoutine || []);
    if (step === 'gn') setCurrentRoutineItems(schedule.gnRoutine || []);
  }, [step, schedule.gmRoutine, schedule.gdRoutine, schedule.gnRoutine]);

  const handleUpdateRoutine = (newItems: RoutineItem[]) => {
    setCurrentRoutineItems(newItems);
    if (step === 'gm') updateSchedule({ gmRoutine: newItems });
    if (step === 'gd') updateSchedule({ gdRoutine: newItems });
    if (step === 'gn') updateSchedule({ gnRoutine: newItems });
  };

  const addRoutineItem = () => {
    handleUpdateRoutine([...currentRoutineItems, { text: '', hidden: false }]);
  };

  const updateRoutineItem = (idx: number, text: string) => {
    const newItems = [...currentRoutineItems];
    newItems[idx] = { ...newItems[idx], text };
    handleUpdateRoutine(newItems);
  };

  const removeRoutineItem = (idx: number) => {
    const newItems = currentRoutineItems.filter((_, i) => i !== idx);
    handleUpdateRoutine(newItems);
  };

  const nextStep = () => {
    switch (step) {
      case 'timeline': setStep('gm'); break;
      case 'gm': setStep('gd'); break;
      case 'gd': setStep('gn'); break;
      case 'gn': setStep('busy'); break;
      case 'busy': onComplete({}); break; // Done
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'timeline':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-yellow-500">The Timeline Canvas</h3>
              <p className="text-gray-400 text-sm mt-2">
                Drag your core blocks (Wake Up/Morning, Work, Night) to your ideal times.<br/>
                Don't stress about exact minutes.
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 h-[500px] overflow-y-auto custom-scrollbar">
              <VisualTimelineEditor
                timeline={schedule.timeline || []}
                onUpdate={(newTimeline) => updateSchedule({ timeline: newTimeline })}
              />
            </div>
          </div>
        );

      case 'gm':
      case 'gd':
      case 'gn':
        const title = step === 'gm' ? 'Good Morning (GM)' : step === 'gd' ? 'Good Day (GD)' : 'Good Night (GN)';
        const desc = step === 'gm' ? 'What specific steps happen inside your Morning Routine?' :
                     step === 'gd' ? 'What defines your Work/Day flow?' :
                     'How do you wind down?';
        
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
                    autoFocus={idx === currentRoutineItems.length - 1} // Auto focus new items
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
      
      case 'finish': 
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32">
      {/* Progress Dots for Sub-steps */}
      <div className="flex justify-center gap-2 mb-8">
        {['timeline', 'gm', 'gd', 'gn', 'busy'].map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              step === s ? 'w-8 bg-blue-500' : 
              ['timeline', 'gm', 'gd', 'gn', 'busy'].indexOf(step) > i ? 'w-8 bg-blue-500/50' : 'w-2 bg-gray-800'
            }`}
          />
        ))}
      </div>

      {renderContent()}

       <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={nextStep}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            {step === 'busy' ? 'FINISH SCHEDULE' : 'CONTINUE'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

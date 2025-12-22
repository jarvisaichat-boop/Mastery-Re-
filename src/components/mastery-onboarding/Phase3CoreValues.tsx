import React, { useState } from 'react';
import { Target, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase3CoreValuesProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase3CoreValues({ onComplete }: Phase3CoreValuesProps) {
  const { data, updateCoreValues } = useVisionBoard();
  const { coreValues } = data;

  const [localValues, setLocalValues] = useState(coreValues);

  const priorities = [
    { value: 'Self', label: 'Self (Mental & Physical Health)' },
    { value: 'Family', label: 'Family (Blood / Parents)' },
    { value: 'Love', label: 'Love (Partner / Romance)' },
    { value: 'Work', label: 'Work (Career / Mission / School)' },
    { value: 'Friends', label: 'Friends (Social Circle / Community)' }
  ];

  const updateField = (field: keyof typeof coreValues, value: any) => {
    const updated = { ...localValues, [field]: value };
    setLocalValues(updated);
    updateCoreValues({ [field]: value });
  };

  const addPersonalValue = () => {
    const newValues = [...(localValues.values || []), { title: '', description: '', hidden: false }];
    updateField('values', newValues);
  };

  const updatePersonalValue = (index: number, field: 'title' | 'description', text: string) => {
    const newValues = [...(localValues.values || [])];
    newValues[index] = { ...newValues[index], [field]: text };
    updateField('values', newValues);
  };

  const removePersonalValue = (index: number) => {
    const newValues = localValues.values.filter((_, i) => i !== index);
    updateField('values', newValues);
  };

  const handleContinue = () => {
    // Basic validation
    if (!localValues.priority || !localValues.why || !localValues.purpose) {
      alert("Please fill in the core fields to continue.");
      return;
    }
    onComplete({
      // Mapping to profile if needed, or just relying on Context
      context: `Priority: ${localValues.priority}, Why: ${localValues.why}`
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 pb-32 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-6">
          <Target className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Core Values</h2>
        <p className="text-xl text-gray-400">
          Who are you before we define what you want?
        </p>
      </div>

      <div className="space-y-12">
        {/* 1. Priority */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
            1. The Planetary System (Your Center)
          </label>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-300 mb-4 text-sm">
              You are the Sun. Which planet currently has the <span className="text-yellow-500">strongest gravitational pull</span> on you?
            </p>
            <div className="grid gap-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateField('priority', p.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${localValues.priority === p.value
                    ? 'bg-yellow-500/20 border-yellow-500 text-white'
                    : 'bg-black/20 border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Your Why */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
            2. Your "Why" (Survival Engine)
          </label>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-300 mb-4 text-sm">
              What is the internal need you must satisfy to avoid suffering or feeling empty?
            </p>
            <input
              type="text"
              value={localValues.why}
              onChange={(e) => updateField('why', e.target.value)}
              placeholder="e.g. Financial Security, Freedom, Acknowledgement..."
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* 3. Purpose */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
            3. Purpose (The Trajectory)
          </label>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-300 mb-4 text-sm">
              If you fulfill your 'Why' every single day, who do you become at the end of the path?
            </p>
            <input
              type="text"
              value={localValues.purpose}
              onChange={(e) => updateField('purpose', e.target.value)}
              placeholder="e.g. A focused entrepreneur, A dedicated parent..."
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* 4. Motto */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
            4. Motto (The Attitude)
          </label>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-300 mb-4 text-sm">
              What quote or philosophy fits your mindset right now?
            </p>
            <input
              type="text"
              value={localValues.motto}
              onChange={(e) => updateField('motto', e.target.value)}
              placeholder="e.g. Just Do It, Discipline equals Freedom..."
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* 5. Personal Values (List) - User Adjustment 1 */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
            5. Personal Values (Glossary)
          </label>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
            <p className="text-gray-300 text-sm mb-4">
              Define your own personal values or glossary.
              <span className="block text-gray-500 mt-1 italic">e.g. The Omen: Face the Fear of Uncertainty.</span>
            </p>

            {/* Removed AnimatePresence for stability without framer-motion */}
            <div className="space-y-3">
              {localValues.values.map((val, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-3 items-start p-3 bg-black/20 rounded-xl border border-white/5"
                >
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => updatePersonalValue(idx, 'title', e.target.value)}
                    placeholder="Title (e.g. The Omen)"
                    className="w-full bg-transparent border-b border-gray-700 p-2 text-yellow-500 font-medium placeholder-gray-700 focus:border-yellow-500 outline-none"
                  />
                  <input
                    type="text"
                    value={val.description}
                    onChange={(e) => updatePersonalValue(idx, 'description', e.target.value)}
                    placeholder="Description (e.g. Face the Fear...)"
                    className="w-full bg-transparent border-b border-gray-700 p-2 text-white placeholder-gray-700 focus:border-white outline-none"
                  />
                  <button
                    onClick={() => removePersonalValue(idx)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addPersonalValue}
              className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} /> Add Personal Value
            </button>
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            CONFIRM & CONTINUE <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

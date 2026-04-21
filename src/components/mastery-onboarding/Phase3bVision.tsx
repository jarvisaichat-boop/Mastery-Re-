import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase3bVisionProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  onBack?: () => void;
}

export default function Phase3bVision({ onComplete, onBack }: Phase3bVisionProps) {
  const { data, updatePath } = useVisionBoard();
  const [vision, setVision] = useState(data.path.vision || '');

  const handleContinue = () => {
    if (vision.trim()) {
      updatePath({ vision: vision.trim() });
    }
    onComplete({});
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32">
      <div className="flex justify-center mb-8">
        <div className="h-1 w-8 rounded-full bg-yellow-500" />
      </div>

      <div className="space-y-8 animate-fadeIn">
        <div className="space-y-4">
          <p className="text-xs font-semibold text-yellow-500/70 uppercase tracking-widest">Vision</p>
          <h3 className="text-3xl font-bold text-white leading-tight">What is your ideal life?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Imagine everything is set. Things are going well. You wake up and feel great, and everything is exactly as it should be.
          </p>
          <p className="text-gray-400 text-sm">
            What would you be doing? And what would that give you?
          </p>
        </div>

        <textarea
          value={vision}
          onChange={e => setVision(e.target.value)}
          placeholder="e.g. I want to live freely and be happy..."
          rows={6}
          className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white text-base focus:border-yellow-500 outline-none resize-none leading-relaxed"
          autoFocus
        />

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Guidance</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Try to capture three things: what you'd be{' '}
            <span className="text-yellow-500/80 font-medium">DOING</span>, how you'd{' '}
            <span className="text-yellow-500/80 font-medium">FEEL</span>, and what it would{' '}
            <span className="text-yellow-500/80 font-medium">GIVE you</span>.
          </p>
          <p className="text-gray-600 text-xs">
            Write naturally — you don't need to use those words. This is a direction, not a destination. It doesn't need to be specific.
          </p>
        </div>

        {vision.trim() && (
          <p className="text-gray-600 text-xs text-center">
            Your goals will change. This shouldn't.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            CONTINUE <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

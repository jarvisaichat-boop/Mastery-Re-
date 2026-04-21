import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { useVisionBoard } from '../../contexts/VisionBoardContext';
import { MasteryProfile } from '../../types/onboarding';

interface Phase3bVisionProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  onBack?: () => void;
}

export default function Phase3bVision({ onComplete, onBack }: Phase3bVisionProps) {
  const { data, updatePath } = useVisionBoard();
  const [vision, setVision] = useState(data.path.vision || '');

  const cv = data.coreValues;
  const hasCoreValues = cv?.priority || cv?.why;

  const handleContinue = () => {
    updatePath({ vision: vision.trim() });
    onComplete({});
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 pb-32 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-6">
          <Eye className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Vision</h2>
        <p className="text-xl text-gray-400">
          What is your ideal life?
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-gray-300 text-sm font-medium">Not a goal. Not a plan.</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Vision is the feeling behind all your goals. Think about everything you're chasing — money, health, connection, freedom. Strip away the specifics and ask: what does all of that actually give me, at the deepest level?
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            That feeling is your Vision. It sits above your goals and doesn't change when your goals do.
          </p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Guidance</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Aim to capture three things: what you'd be{' '}
            <span className="text-yellow-500/80 font-medium">DOING</span> day to day, how you'd{' '}
            <span className="text-yellow-500/80 font-medium">FEEL</span> waking up, and what it would{' '}
            <span className="text-yellow-500/80 font-medium">GIVE you</span> at the soul level.
          </p>
          <p className="text-gray-600 text-xs">
            Write freely. If it sounds vague, you're probably getting it right.
          </p>
        </div>

        <textarea
          value={vision}
          onChange={e => setVision(e.target.value)}
          placeholder="e.g. I want to live on my own terms, feel proud of what I've built, and have the freedom to go anywhere..."
          rows={6}
          className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white text-base focus:border-yellow-500 outline-none resize-none leading-relaxed"
          autoFocus
        />

        {hasCoreValues && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
            <p className="text-xs text-yellow-500/70 mb-2">Core Value</p>
            {cv.priority && (
              <p className="text-white text-sm font-medium">{cv.priority}</p>
            )}
            {cv.why && (
              <p className="text-gray-400 text-xs italic mt-1">"{cv.why}"</p>
            )}
          </div>
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

import { useState, useRef, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { logger } from '../../utils/logger';

interface Phase7ContractProps {
  onComplete: () => void;
}

export default function Phase7Contract({ onComplete }: Phase7ContractProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [locked, setLocked] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);

  // Same mechanism as MomentumGenerator pledge hold
  const handleHoldStart = () => {
    if (locked) return;
    if (holdIntervalRef.current) return; // already running — ignore duplicate start
    setHoldProgress(0);
    const startTime = Date.now();

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100 && holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setLocked(true);
        try {
          if ('vibrate' in navigator && navigator.vibrate) {
            navigator.vibrate([50, 30, 100, 30, 200]);
          }
        } catch {
        }
        logger.log('🔵 Contract hold complete — entering Dojo');
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 10);
  };

  const handleHoldEnd = () => {
    if (locked) return;
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const radius = 96;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <CheckCircle className="w-16 h-16 text-blue-400" />
            </div>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">The Contract</h1>
            <p className="text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
              "I commit to this protocol. No excuses."
            </p>
          </div>

          {/* Commitment Box */}
          <div className="bg-gray-900/50 border-2 border-blue-500/50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">I understand this is a commitment, not just a checklist</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">I will show up daily, even when motivation fades</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">I will track my progress and reflect honestly</p>
              </div>
            </div>
          </div>

          {/* Hold-to-Sign button — same mechanism as MomentumGenerator pledge */}
          <div className="flex flex-col items-center gap-3 select-none">
            <div
              className="w-44 h-44 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative shadow-2xl cursor-pointer animate-floatHover"
              style={{
                boxShadow: `0 0 ${Math.max(40, holdProgress)}px rgba(99, 102, 241, ${0.35 + holdProgress / 250})`,
                touchAction: 'none',
                animationPlayState: holdProgress > 0 || locked ? 'paused' : 'running',
              }}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              onTouchCancel={handleHoldEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white text-2xl font-bold tracking-widest z-10" style={{ userSelect: 'none' }}>
                {locked ? 'LOCKED ✓' : 'Hold'}
              </span>

              {/* Circular progress ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 208 208"
              >
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="url(#contractGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - holdProgress / 100)}
                  className="transition-all duration-100"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="contractGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="h-8 flex items-center justify-center">
              {!locked && holdProgress > 0 && (
                <span className="text-2xl font-bold text-blue-400">
                  {Math.round(holdProgress)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

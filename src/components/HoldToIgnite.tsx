import React, { useState, useRef, useEffect } from 'react';
import { Flame, X } from 'lucide-react';

interface HoldToIgniteProps {
  habitName: string;
  habitColor: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function HoldToIgnite({ habitName, habitColor, onComplete, onCancel }: HoldToIgniteProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const holdTimerRef = useRef<number>();
  const progressIntervalRef = useRef<number>();

  const HOLD_DURATION = 2000; // 2 seconds to ignite

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleStart = () => {
    setIsHolding(true);
    setProgress(0);

    // Start progress animation
    const startTime = Date.now();
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(newProgress);
    }, 16); // ~60fps

    // Complete after hold duration
    holdTimerRef.current = window.setTimeout(() => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsHolding(false);
      setShowVictory(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, HOLD_DURATION);
  };

  const handleStop = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setIsHolding(false);
    setProgress(0);
  };

  if (showVictory) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-900 to-green-600 z-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6">🔥</div>
          <h2 className="text-4xl font-bold text-white mb-4">IGNITED!</h2>
          <p className="text-xl text-green-100 mb-8">
            {habitName} - Let's go!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{habitName}</h2>
          <p className="text-gray-400">Hold the button to ignite</p>
        </div>

        <div className="relative">
          {/* Progress ring background */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke={habitColor}
              strokeWidth="16"
              strokeDasharray={`${(progress / 100) * 578} 578`}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>

          {/* Hold button */}
          <button
            onMouseDown={handleStart}
            onMouseUp={handleStop}
            onMouseLeave={handleStop}
            onTouchStart={handleStart}
            onTouchEnd={handleStop}
            className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center transition-all ${
              isHolding ? 'scale-95 shadow-2xl' : 'scale-100 shadow-xl'
            }`}
            style={{
              background: isHolding
                ? `linear-gradient(135deg, ${habitColor}, #ff6b00)`
                : habitColor,
            }}
          >
            <Flame className={`w-24 h-24 text-white ${isHolding ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          {isHolding ? 'Keep holding...' : 'Press and hold to ignite your habit'}
        </p>
      </div>
    </div>
  );
}

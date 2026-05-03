import React, { useState } from 'react';
import { List, Calendar, Sun, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const modes = [
  { id: 'list', name: 'Simple List', icon: List },
  { id: 'calendar', name: 'Calendar Week', icon: Calendar },
  { id: 'routine', name: 'By Routine', icon: Sun },
  { id: 'importance', name: 'By Importance', icon: Star },
  { id: 'chronological', name: 'Chronological', icon: Clock },
];

export function Cycle() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeMode = modes[activeIdx];
  const Icon = activeMode.icon;

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % modes.length);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans text-white p-4">
      {/* Context Container */}
      <div className="w-full max-w-sm flex flex-col gap-6">
        
        {/* Placeholder: Streak Header */}
        <div className="flex items-center justify-center py-2 px-4 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium w-max mx-auto">
          1 day streak <span className="ml-2">🔥</span>
        </div>

        {/* Focus: The Control */}
        <div className="flex justify-center items-center py-4">
          <button
            onClick={handleNext}
            className="group flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl p-2 transition-colors hover:bg-white/[0.02]"
            aria-label={`Current view: ${activeMode.name}. Click to change.`}
          >
            {/* The Icon Button */}
            <div className="relative w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 group-hover:border-white/20 transition-all duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 30 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon size={18} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The Label */}
            <div className="h-4 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] text-zinc-500 font-medium tracking-wide"
                >
                  {activeMode.name}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-1 mt-1">
              {modes.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    idx === activeIdx 
                      ? "w-3 bg-zinc-400" 
                      : "w-1 bg-zinc-800 group-hover:bg-zinc-700"
                  )}
                />
              ))}
            </div>
          </button>
        </div>

        {/* Placeholder: Weekly Grid Header */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-zinc-600 tracking-tighter sm:tracking-normal px-2 py-4 border-t border-white/5">
          <span>MON 27</span>
          <span>|</span>
          <span>TUE 28</span>
          <span>|</span>
          <span>WED 29</span>
          <span>|</span>
          <span>THU 30</span>
          <span>|</span>
          <span>FRI 1</span>
          <span>|</span>
          <span>SAT 2</span>
          <span>|</span>
          <span>SUN 3</span>
        </div>

      </div>
    </div>
  );
}

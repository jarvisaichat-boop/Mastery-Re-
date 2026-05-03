import React, { useState } from 'react';
import { List, Calendar, Sun, Star, Clock, SlidersHorizontal } from 'lucide-react';

const modes = [
  { id: 'list', label: 'Simple List', icon: List },
  { id: 'calendar', label: 'Calendar Week', icon: Calendar },
  { id: 'routine', label: 'By Routine', icon: Sun },
  { id: 'importance', label: 'By Importance', icon: Star },
  { id: 'chrono', label: 'Chronological', icon: Clock },
];

export function IconPopover() {
  const [activeModeClosed, setActiveModeClosed] = useState('list');
  const [activeModeOpen, setActiveModeOpen] = useState('list');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 space-y-32 font-sans">
      
      {/* State 1: Closed */}
      <div className="w-full max-w-md flex flex-col gap-6 relative">
        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold text-center absolute -top-12 left-0 right-0">State 1: Closed (Idle)</div>
        
        {/* Streak Header Placeholder */}
        <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-950/20 to-transparent border border-orange-900/20 flex items-center justify-between shadow-[0_0_15px_rgba(234,88,12,0.05)]">
          <span className="text-orange-500 font-medium text-sm tracking-wide">1 day streak</span>
          <span className="text-lg">🔥</span>
        </div>

        {/* The Control - Closed */}
        <div className="flex justify-end w-full relative z-10 px-1 -my-2">
          <button className="h-9 w-9 rounded-full bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80 transition-all shadow-sm">
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Grid Header Placeholder */}
        <div className="w-full flex justify-between text-[11px] sm:text-xs text-zinc-600 border-b border-zinc-900 pb-3 font-medium px-2">
          <span>MON 27</span>
          <span>TUE 28</span>
          <span>WED 29</span>
          <span className="text-zinc-300">THU 30</span>
          <span>FRI 1</span>
          <span>SAT 2</span>
          <span>SUN 3</span>
        </div>
      </div>


      {/* State 2: Open */}
      <div className="w-full max-w-md flex flex-col gap-6 relative mt-12">
        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold text-center absolute -top-12 left-0 right-0">State 2: Open (Active)</div>
        
        {/* Streak Header Placeholder */}
        <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-950/20 to-transparent border border-orange-900/20 flex items-center justify-between shadow-[0_0_15px_rgba(234,88,12,0.05)]">
          <span className="text-orange-500 font-medium text-sm tracking-wide">1 day streak</span>
          <span className="text-lg">🔥</span>
        </div>

        {/* The Control - Open */}
        <div className="flex justify-end w-full relative z-50 px-1 -my-2">
          <button className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white transition-all shadow-md relative z-50">
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
          
          {/* Popover */}
          <div className="absolute top-11 right-1 w-56 bg-[#141414] border border-zinc-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] p-1.5 flex flex-col z-50 origin-top-right overflow-hidden">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeModeOpen === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveModeOpen(mode.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left group ${
                    isActive 
                      ? 'bg-zinc-800/60 text-zinc-100 font-medium' 
                      : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] transition-colors ${
                    isActive 
                      ? 'text-indigo-400' 
                      : 'text-zinc-500 group-hover:text-zinc-400'
                  }`} />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Header Placeholder */}
        <div className="w-full flex justify-between text-[11px] sm:text-xs text-zinc-600 border-b border-zinc-900 pb-3 font-medium px-2 relative z-10 opacity-30">
          <span>MON 27</span>
          <span>TUE 28</span>
          <span>WED 29</span>
          <span className="text-zinc-300">THU 30</span>
          <span>FRI 1</span>
          <span>SAT 2</span>
          <span>SUN 3</span>
        </div>
      </div>

    </div>
  );
}

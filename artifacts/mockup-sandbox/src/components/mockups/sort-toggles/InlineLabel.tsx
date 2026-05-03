import React, { useState } from "react";
import { List, Calendar, Sun, Star, Clock, ChevronDown, Check } from "lucide-react";

export function InlineLabel() {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Simple List");

  const modes = [
    { name: "Simple List", icon: List },
    { name: "Calendar Week", icon: Calendar },
    { name: "By Routine", icon: Sun },
    { name: "By Importance", icon: Star },
    { name: "Chronological", icon: Clock },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-8">
      {/* Mockup Container */}
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Placeholder: Streak Hero Header */}
        <div className="w-full flex justify-center">
          <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium tracking-wide flex items-center gap-2">
            1 day streak <span className="text-sm">🔥</span>
          </div>
        </div>

        {/* The Control - Closed State (Interactive) */}
        <div className="w-full flex flex-col items-center relative z-20 mt-4">
          <button 
            onClick={() => setOpen(!open)}
            className="group flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
          >
            <span>Sorted by</span>
            <span className="text-neutral-300 font-medium border-b border-transparent group-hover:border-neutral-500 transition-colors flex items-center gap-1">
              {activeMode}
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </span>
          </button>

          {/* Popover / Dropdown */}
          {open && (
            <div className="absolute top-full mt-2 w-48 bg-[#111] border border-neutral-800 rounded-lg shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
              {modes.map((mode) => (
                <button
                  key={mode.name}
                  onClick={() => {
                    setActiveMode(mode.name);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <mode.icon className="w-4 h-4" />
                    <span>{mode.name}</span>
                  </div>
                  {activeMode === mode.name && (
                    <Check className="w-3.5 h-3.5 text-neutral-300" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Placeholder: Weekly Grid Header */}
        <div className="w-full flex justify-between items-center text-[10px] font-medium text-neutral-600 uppercase tracking-widest px-2 border-b border-neutral-800 pb-2 mt-2">
          <div className="text-center w-full">Mon <span className="text-neutral-500">27</span></div>
          <div className="text-center w-full">Tue <span className="text-neutral-500">28</span></div>
          <div className="text-center w-full">Wed <span className="text-neutral-500">29</span></div>
          <div className="text-center w-full">Thu <span className="text-neutral-500">30</span></div>
          <div className="text-center w-full">Fri <span className="text-neutral-500">1</span></div>
          <div className="text-center w-full">Sat <span className="text-neutral-500">2</span></div>
          <div className="text-center w-full">Sun <span className="text-neutral-500">3</span></div>
        </div>
        
        {/* Placeholder Grid Area */}
        <div className="w-full h-32 rounded-lg border border-neutral-800/50 bg-[#0f0f0f] border-dashed flex items-center justify-center">
          <span className="text-neutral-700 text-xs">Habit Grid Area</span>
        </div>

      </div>
      
      {/* Expanded State Illustration (Static) */}
      <div className="w-full max-w-md mt-24 opacity-60 pointer-events-none">
        <p className="text-center text-xs text-neutral-600 mb-6 uppercase tracking-wider">Expanded State Reference</p>
        <div className="w-full flex flex-col items-center relative">
          <button className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Sorted by</span>
            <span className="text-neutral-300 font-medium flex items-center gap-1">
              Simple List
              <ChevronDown className="w-3 h-3 rotate-180" />
            </span>
          </button>

          <div className="absolute top-full mt-2 w-48 bg-[#111] border border-neutral-800 rounded-lg shadow-xl overflow-hidden py-1">
            {modes.map((mode) => (
              <div
                key={mode.name}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-400 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <mode.icon className="w-4 h-4" />
                  <span className={mode.name === "Simple List" ? "text-neutral-200" : ""}>{mode.name}</span>
                </div>
                {mode.name === "Simple List" && (
                  <Check className="w-3.5 h-3.5 text-neutral-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

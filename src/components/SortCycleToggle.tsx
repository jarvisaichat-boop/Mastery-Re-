import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export type SortCycleMode = {
    id: string;
    label: string;
    enabled: boolean;
};

interface SortCycleToggleProps {
    modes: SortCycleMode[];
    activeId: string;
    onAdvance: (nextId: string) => void;
}

export const SortCycleToggle: React.FC<SortCycleToggleProps> = ({ modes, activeId, onAdvance }) => {
    const activeIdx = Math.max(0, modes.findIndex(m => m.id === activeId));
    const activeMode = modes[activeIdx] ?? modes[0];

    const handleClick = () => {
        const next = modes[(activeIdx + 1) % modes.length];
        onAdvance(next.id);
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={handleClick}
                className="group flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl p-1 transition-colors hover:bg-white/[0.02]"
                aria-label={`Current view: ${activeMode.label}. Tap to change.`}
                title={activeMode.label}
            >
                <div className="relative w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 group-hover:border-white/20 transition-all duration-200">
                    <SlidersHorizontal className="w-[16px] h-[16px]" />
                </div>

                <div className="h-4 flex items-center justify-center">
                    <span
                        key={activeMode.id}
                        className={`text-[11px] font-medium tracking-wide transition-opacity duration-150 ${activeMode.enabled ? 'text-zinc-500' : 'text-zinc-600 italic'}`}
                    >
                        {activeMode.label}
                        {!activeMode.enabled && <span className="ml-1 text-[10px] text-zinc-700">· soon</span>}
                    </span>
                </div>

                <div className="flex gap-1">
                    {modes.map((m, idx) => (
                        <div
                            key={m.id}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                idx === activeIdx
                                    ? 'w-3 bg-zinc-400'
                                    : 'w-1 bg-zinc-800 group-hover:bg-zinc-700'
                            }`}
                        />
                    ))}
                </div>
            </button>
        </div>
    );
};

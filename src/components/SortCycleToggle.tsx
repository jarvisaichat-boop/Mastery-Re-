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
        if (modes.length <= 1) return;
        const next = modes[(activeIdx + 1) % modes.length];
        onAdvance(next.id);
    };

    return (
        <div className="relative flex items-center px-2 mb-2 h-9">
            <button
                onClick={handleClick}
                className="relative w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-white/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                aria-label={`Current view: ${activeMode?.label ?? ''}. Tap to change.`}
                title={activeMode?.label}
            >
                <SlidersHorizontal className="w-[16px] h-[16px]" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                    key={activeMode?.id}
                    className="text-[11px] font-medium tracking-wide text-zinc-500"
                >
                    {activeMode?.label}
                </span>
            </div>
        </div>
    );
};

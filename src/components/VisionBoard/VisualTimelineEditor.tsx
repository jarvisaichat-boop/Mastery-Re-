import React, { useState, useRef, useCallback } from 'react';
import { TimeBlock } from '../../types/visionBoard';
import { Plus, Trash2 } from 'lucide-react';

interface VisualTimelineEditorProps {
  timeline: TimeBlock[];
  onUpdate: (timeline: TimeBlock[]) => void;
}

const HOUR_HEIGHT = 48;
const TOTAL_HOURS = 24;
const SNAP_MINUTES = 15;

const COLOR_OPTIONS = [
  { value: 'bg-purple-400', label: 'Purple' },
  { value: 'bg-gray-400', label: 'Gray' },
  { value: 'bg-yellow-400', label: 'Yellow' },
  { value: 'bg-blue-400', label: 'Blue' },
  { value: 'bg-green-400', label: 'Green' },
  { value: 'bg-orange-400', label: 'Orange' },
  { value: 'bg-indigo-400', label: 'Indigo' },
  { value: 'bg-red-400', label: 'Red' },
  { value: 'bg-pink-400', label: 'Pink' },
  { value: 'bg-cyan-400', label: 'Cyan' }
];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const snapToGrid = (minutes: number): number => {
  return Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;
};

const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 || 12;
  return minutes === 0 ? `${displayHour}${period}` : `${displayHour}:${minutes.toString().padStart(2, '0')}${period}`;
};

export const VisualTimelineEditor: React.FC<VisualTimelineEditorProps> = ({ timeline, onUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    blockIndex: number;
    edge: 'top' | 'bottom' | 'move';
    startY: number;
    startMinutes: number;
    endMinutes: number;
  } | null>(null);
  const [editingBlock, setEditingBlock] = useState<number | null>(null);
  const [colorPickerBlock, setColorPickerBlock] = useState<number | null>(null);

  const blocks = timeline.filter(b => !!b.endTime && !b.hidden);
  const points = timeline.filter(b => !b.endTime && !b.hidden);

  const minutesToPixels = (minutes: number) => (minutes / 60) * HOUR_HEIGHT;
  const pixelsToMinutes = (pixels: number) => (pixels / HOUR_HEIGHT) * 60;

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, blockIndex: number, edge: 'top' | 'bottom' | 'move') => {
    e.preventDefault();
    e.stopPropagation();
    const block = blocks[blockIndex];
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    let startMins = timeToMinutes(block.time);
    let endMins = timeToMinutes(block.endTime!);
    if (endMins < startMins) endMins += 24 * 60;
    
    setDragState({
      blockIndex,
      edge,
      startY: clientY,
      startMinutes: startMins,
      endMinutes: endMins
    });
  }, [blocks]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState || !containerRef.current) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragState.startY;
    const deltaMinutes = snapToGrid(pixelsToMinutes(deltaY));
    
    const newTimeline = [...timeline];
    const actualIndex = timeline.findIndex(b => b === blocks[dragState.blockIndex]);
    if (actualIndex === -1) return;
    
    let newStart = dragState.startMinutes;
    let newEnd = dragState.endMinutes;
    
    if (dragState.edge === 'top') {
      newStart = Math.max(0, Math.min(dragState.startMinutes + deltaMinutes, newEnd - 15));
    } else if (dragState.edge === 'bottom') {
      newEnd = Math.max(newStart + 15, Math.min(dragState.endMinutes + deltaMinutes, 24 * 60));
    } else if (dragState.edge === 'move') {
      const duration = newEnd - newStart;
      newStart = Math.max(0, Math.min(dragState.startMinutes + deltaMinutes, 24 * 60 - duration));
      newEnd = newStart + duration;
    }
    
    newTimeline[actualIndex] = {
      ...newTimeline[actualIndex],
      time: minutesToTime(newStart % (24 * 60)),
      endTime: minutesToTime(newEnd % (24 * 60))
    };
    
    onUpdate(newTimeline);
  }, [dragState, timeline, blocks, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  React.useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  const updateBlockLabel = (blockIndex: number, label: string) => {
    const actualIndex = timeline.findIndex(b => b === blocks[blockIndex]);
    if (actualIndex === -1) return;
    const newTimeline = [...timeline];
    newTimeline[actualIndex] = { ...newTimeline[actualIndex], label };
    onUpdate(newTimeline);
  };

  const updateBlockColor = (blockIndex: number, color: string) => {
    const actualIndex = timeline.findIndex(b => b === blocks[blockIndex]);
    if (actualIndex === -1) return;
    const newTimeline = [...timeline];
    newTimeline[actualIndex] = { ...newTimeline[actualIndex], color };
    onUpdate(newTimeline);
    setColorPickerBlock(null);
  };

  const deleteBlock = (blockIndex: number) => {
    const actualIndex = timeline.findIndex(b => b === blocks[blockIndex]);
    if (actualIndex === -1) return;
    const block = timeline[actualIndex];
    if (block.isProtected || block.isRoutine) return;
    const newTimeline = timeline.filter((_, i) => i !== actualIndex);
    onUpdate(newTimeline);
  };

  const addNewBlock = () => {
    const newBlock: TimeBlock = {
      time: '12:00',
      endTime: '13:00',
      label: 'New Block',
      color: 'bg-gray-400',
      hidden: false
    };
    onUpdate([...timeline, newBlock]);
  };

  const hourMarkers = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i);

  return (
    <div className="relative select-none">
      <div 
        ref={containerRef}
        className="relative bg-black/20 rounded-lg overflow-hidden"
        style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}
      >
        {hourMarkers.map(hour => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-white/5 flex items-start"
            style={{ top: `${hour * HOUR_HEIGHT}px` }}
          >
            <div className="text-[10px] text-gray-600 w-10 -mt-2 text-right pr-2">
              {hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
            </div>
          </div>
        ))}

        <div className="absolute left-10 right-2 top-0 bottom-0">
          {blocks.map((block, idx) => {
            let startMins = timeToMinutes(block.time);
            let endMins = timeToMinutes(block.endTime!);
            if (endMins < startMins) endMins += 24 * 60;
            
            const top = minutesToPixels(startMins);
            const height = Math.max(30, minutesToPixels(endMins - startMins));
            const isEditing = editingBlock === idx;
            const isProtected = block.isProtected || block.isRoutine;
            
            return (
              <div
                key={idx}
                className={`absolute left-0 right-0 rounded-lg overflow-hidden cursor-move transition-shadow ${dragState?.blockIndex === idx ? 'shadow-lg ring-2 ring-yellow-500/50' : ''}`}
                style={{ 
                  top: `${top}px`, 
                  height: `${height}px`,
                  zIndex: dragState?.blockIndex === idx ? 20 : 10
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-3 cursor-n-resize hover:bg-white/20 z-10"
                  onMouseDown={(e) => handleMouseDown(e, idx, 'top')}
                  onTouchStart={(e) => handleMouseDown(e, idx, 'top')}
                />
                
                <div 
                  className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize hover:bg-white/20 z-10"
                  onMouseDown={(e) => handleMouseDown(e, idx, 'bottom')}
                  onTouchStart={(e) => handleMouseDown(e, idx, 'bottom')}
                />

                <div
                  className={`h-full flex ${block.color.replace('400', '400/30')} border-l-4 ${block.color.replace('bg-', 'border-')}`}
                  onMouseDown={(e) => handleMouseDown(e, idx, 'move')}
                  onTouchStart={(e) => handleMouseDown(e, idx, 'move')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBlock(isEditing ? null : idx);
                    setColorPickerBlock(null);
                  }}
                >
                  <div className="flex-1 p-2 flex flex-col justify-center min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={block.label}
                        onChange={(e) => updateBlockLabel(idx, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => setEditingBlock(null)}
                        autoFocus
                        className="bg-transparent text-white text-sm font-medium border-b border-white/30 outline-none w-full"
                      />
                    ) : (
                      <div className="text-white text-sm font-medium truncate">{block.label}</div>
                    )}
                    <div className="text-white/60 text-[10px]">
                      {formatTimeDisplay(block.time)} - {formatTimeDisplay(block.endTime!)}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-1 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setColorPickerBlock(colorPickerBlock === idx ? null : idx);
                        setEditingBlock(null);
                      }}
                      className={`w-5 h-5 rounded-full ${block.color} border border-white/30`}
                    />
                    {!isProtected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(idx);
                        }}
                        className="text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {colorPickerBlock === idx && (
                    <div 
                      className="absolute right-10 top-1/2 -translate-y-1/2 bg-gray-900 border border-white/20 rounded-lg p-2 grid grid-cols-5 gap-1 z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {COLOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateBlockColor(idx, opt.value)}
                          className={`w-5 h-5 rounded-full ${opt.value} border border-white/20 hover:scale-110 transition-transform`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {points.map((point, idx) => {
            const top = minutesToPixels(timeToMinutes(point.time));
            return (
              <div
                key={`point-${idx}`}
                className="absolute left-0 right-0 flex items-center gap-2 pointer-events-none"
                style={{ top: `${top - 8}px`, zIndex: 5 }}
              >
                <div className={`w-3 h-3 rounded-full ${point.color} flex-shrink-0`} style={{ boxShadow: '0 0 8px currentColor' }} />
                <span className="text-xs text-gray-300">{point.label}</span>
                <span className="text-[10px] text-gray-500">{formatTimeDisplay(point.time)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={addNewBlock}
        className="mt-3 flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400"
      >
        <Plus size={16} /> Add Block
      </button>
    </div>
  );
};

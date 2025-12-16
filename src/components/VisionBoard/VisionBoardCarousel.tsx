import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CoreValuesSection, PathSection, ScheduleSection } from './SectionComponents';
import { Habit } from '../../types';

import { useVisionBoard } from '../../contexts/VisionBoardContext';

interface VisionBoardCarouselProps {
  habits: Habit[];
  onComplete?: () => void;
}

export const VisionBoardCarousel: React.FC<VisionBoardCarouselProps> = ({ habits }) => {
  const { data, updateSchedule } = useVisionBoard();
  const { schedule } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
    preventScrollOnSwipe: true
  });

  const handleNext = () => {
    if (currentIndex < 2) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
      {...handlers}
    >
      {/* Header */}
      <div className="flex-shrink-0 pt-6 pb-4 text-center">
        <h1 
          className="text-sm font-bold text-yellow-500 tracking-[0.3em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}
        >
          VISION BOARD
        </h1>
      </div>

      {/* Main Card Container */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <div 
          className="h-full rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.95), rgba(15, 15, 20, 0.98))',
            boxShadow: '0 0 40px rgba(234, 179, 8, 0.15), 0 0 80px rgba(234, 179, 8, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(234, 179, 8, 0.3)'
          }}
          onClick={(e) => {
            const width = e.currentTarget.offsetWidth;
            const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
            if (x > width * 0.7) {
              handleNext();
            } else if (x < width * 0.3) {
              handlePrev();
            }
          }}
        >
          {/* Golden glow accent at top */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-b-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.6), transparent)',
              boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)'
            }}
          />

          {/* Slides Container */}
          <div className="h-full relative overflow-hidden">
            <div
              className="absolute inset-0 flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {/* Slide 1: Core Values */}
              <div className="w-full h-full flex-shrink-0 overflow-y-auto no-scrollbar">
                <CoreValuesSection mode="view" />
              </div>
              {/* Slide 2: Path */}
              <div className="w-full h-full flex-shrink-0 overflow-y-auto no-scrollbar">
                <PathSection mode="view" habits={habits} />
              </div>
              {/* Slide 3: Schedule */}
              <div className="w-full h-full flex-shrink-0 overflow-y-auto no-scrollbar">
                <ScheduleSection mode="view" habits={habits} schedule={schedule} updateSchedule={updateSchedule} />
              </div>
            </div>
          </div>

          {/* Navigation Arrows inside card */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 transition-all ${
              currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-60 hover:opacity-100 hover:border-yellow-500/30'
            }`}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 transition-all ${
              currentIndex === 2 ? 'opacity-0 pointer-events-none' : 'opacity-60 hover:opacity-100 hover:border-yellow-500/30'
            }`}
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Footer Navigation Dots */}
      <div className="flex-shrink-0 py-4 flex justify-center items-center gap-3">
        {[0, 1, 2].map(idx => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx 
                ? 'w-8 h-2 bg-yellow-500' 
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
            }`}
            style={currentIndex === idx ? { boxShadow: '0 0 12px rgba(234, 179, 8, 0.6)' } : {}}
          />
        ))}
      </div>
    </div>
  );
};

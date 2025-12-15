import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CoreValuesSection, PathSection, ScheduleSection } from './SectionComponents';
import { Habit } from '../../types';

import { useVisionBoard } from '../../contexts/VisionBoardContext';

interface VisionBoardCarouselProps {
  habits: Habit[];
  onComplete?: () => void; // Optional completion callback if part of flow
}

export const VisionBoardCarousel: React.FC<VisionBoardCarouselProps> = ({ habits }) => {
  const { data, updateSchedule } = useVisionBoard();
  const { schedule } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
    preventScrollOnSwipe: true // Prevent scrolling while swiping slides
  });

  const handleNext = () => {
    if (currentIndex < 2) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white"
      {...handlers}
      onClick={(e) => {
        // Simple tap navigation: Right 70% = Next, Left 30% = Prev
        const width = e.currentTarget.offsetWidth;
        const x = e.clientX;
        if (x > width * 0.3) {
          handleNext();
        } else {
          handlePrev();
        }
      }}
    >
      {/* Header - Fixed with Glassmorphism */}
      <div className="flex-shrink-0 pt-4 pb-2 text-center border-b border-white/10 mx-6 backdrop-blur-md bg-black/20 z-10 rounded-b-xl mb-2">
        <h1 className="text-xs font-bold text-yellow-500/80 tracking-[0.3em] uppercase drop-shadow-sm">VISION BOARD</h1>
      </div>

      {/* Main Content Area - Scrollable Slides */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Slide 1 */}
          <div className="w-full h-full flex-shrink-0 overflow-y-auto">
            <CoreValuesSection mode="view" />
          </div>
          {/* Slide 2 */}
          <div className="w-full h-full flex-shrink-0 overflow-y-auto">
            <PathSection mode="view" habits={habits} />
          </div>
          {/* Slide 3 */}
          <div className="w-full h-full flex-shrink-0 overflow-y-auto">
            <ScheduleSection mode="view" habits={habits} schedule={schedule} updateSchedule={updateSchedule} />
          </div>
        </div>
      </div>

      {/* Footer Navigation - Fixed */}
      <div className="flex-shrink-0 py-4 px-6 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto ${currentIndex === 0 ? 'opacity-0' : 'text-gray-400'}`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          {[0, 1, 2].map(idx => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-yellow-500 w-6' : 'bg-gray-700'
                }`}
            />
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto ${currentIndex === 2 ? 'opacity-0' : 'text-gray-400'}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

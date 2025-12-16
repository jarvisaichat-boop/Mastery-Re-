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
      <div className="flex-shrink-0 pt-4 pb-3 text-center">
        <h1 
          className="text-sm font-bold text-yellow-500 tracking-[0.3em] uppercase"
          style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}
        >
          VISION BOARD
        </h1>
      </div>

      {/* Main Content Area with Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-2 min-h-0">
        <div className="relative flex items-center gap-2 w-full max-w-lg">
          {/* Left Arrow - Outside Card */}
          <button
            onClick={handlePrev}
            className={`flex-shrink-0 p-2 rounded-full transition-all ${
              currentIndex === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'opacity-50 hover:opacity-100 text-gray-400 hover:text-white'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Card Container */}
          <div 
            className="flex-1 rounded-2xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.95), rgba(15, 15, 20, 0.98))',
              boxShadow: '0 0 40px rgba(234, 179, 8, 0.12), 0 0 80px rgba(234, 179, 8, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              maxHeight: 'calc(100vh - 180px)',
              minHeight: '420px'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              if (x > width * 0.7) handleNext();
              else if (x < width * 0.3) handlePrev();
            }}
          >
            {/* Golden glow accent at top */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-b-full z-10"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.7), transparent)',
                boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)'
              }}
            />

            {/* Slides Container */}
            <div className="h-full overflow-hidden">
              <div
                className="h-full flex transition-transform duration-300 ease-out"
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
          </div>

          {/* Right Arrow - Outside Card */}
          <button
            onClick={handleNext}
            className={`flex-shrink-0 p-2 rounded-full transition-all ${
              currentIndex === 2 
                ? 'opacity-0 pointer-events-none' 
                : 'opacity-50 hover:opacity-100 text-gray-400 hover:text-white'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Footer Navigation Dots */}
      <div className="flex-shrink-0 py-3 flex justify-center items-center gap-2">
        {[0, 1, 2].map(idx => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx 
                ? 'w-6 h-1.5 bg-yellow-500' 
                : 'w-1.5 h-1.5 bg-gray-600 hover:bg-gray-500'
            }`}
            style={currentIndex === idx ? { boxShadow: '0 0 10px rgba(234, 179, 8, 0.6)' } : {}}
          />
        ))}
      </div>
    </div>
  );
};

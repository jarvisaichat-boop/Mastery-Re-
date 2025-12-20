import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CoreValuesSection, PathSection, ScheduleSection, CustomSectionComponent } from './SectionComponents';
import { Habit } from '../../types';

import { useVisionBoard } from '../../contexts/VisionBoardContext';

interface VisionBoardCarouselProps {
  habits: Habit[];
  onComplete?: () => void;
}

export const VisionBoardCarousel: React.FC<VisionBoardCarouselProps> = ({ habits }) => {
  const { data, updateSchedule } = useVisionBoard();
  const { schedule, custom } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate total slides: 3 base slides + 1 if custom is enabled
  const totalSlides = custom.enabled ? 4 : 3;
  const maxIndex = totalSlides - 1;

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
    preventScrollOnSwipe: false
  });

  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
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
          className="text-3xl font-bold text-yellow-500 tracking-[0.25em] uppercase"
          style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.5)' }}
        >
          VISION BOARD
        </h1>
      </div>

      {/* Main Content Area with Card */}
      <div className="flex-1 flex items-center justify-center px-2 lg:px-4 pb-2 min-h-0">
        <div className="relative flex items-center gap-0 lg:gap-2 w-full lg:max-w-lg">
          {/* Left Arrow - Outside Card (Desktop only) */}
          <button
            onClick={handlePrev}
            className={`hidden lg:flex flex-shrink-0 p-2 rounded-full transition-all ${
              currentIndex === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'opacity-50 hover:opacity-100 text-gray-400 hover:text-white'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Card Container */}
          <div 
            className="flex-1 flex flex-col min-h-0 rounded-2xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.95), rgba(15, 15, 20, 0.98))',
              boxShadow: '0 0 40px rgba(234, 179, 8, 0.12), 0 0 80px rgba(234, 179, 8, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              maxHeight: 'calc(100vh - 140px)',
              minHeight: '520px'
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

            {/* Mobile Navigation Arrows - Inside Card */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className={`lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all ${
                currentIndex === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'opacity-60 active:opacity-100 text-white'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className={`lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all ${
                currentIndex === maxIndex 
                  ? 'opacity-0 pointer-events-none' 
                  : 'opacity-60 active:opacity-100 text-white'
              }`}
            >
              <ChevronRight size={20} />
            </button>

            {/* Slides Container */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <div
                className="h-full flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {/* Slide 1: Core Values */}
                <div className="w-full h-full min-h-0 flex-shrink-0 overflow-y-auto pb-6">
                  <CoreValuesSection mode="view" />
                </div>
                {/* Slide 2: Path */}
                <div className="w-full h-full min-h-0 flex-shrink-0 overflow-y-auto pb-6">
                  <PathSection mode="view" habits={habits} />
                </div>
                {/* Slide 3: Schedule */}
                <div className="w-full h-full min-h-0 flex-shrink-0 overflow-y-auto pb-6">
                  <ScheduleSection mode="view" schedule={schedule} updateSchedule={updateSchedule} habits={habits} />
                </div>
                {/* Slide 4: Custom (only if enabled) */}
                {custom.enabled && (
                  <div className="w-full h-full min-h-0 flex-shrink-0 overflow-y-auto pb-6">
                    <CustomSectionComponent mode="view" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Arrow - Outside Card (Desktop only) */}
          <button
            onClick={handleNext}
            className={`hidden lg:flex flex-shrink-0 p-2 rounded-full transition-all ${
              currentIndex === maxIndex 
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
        {Array.from({ length: totalSlides }).map((_, idx) => (
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

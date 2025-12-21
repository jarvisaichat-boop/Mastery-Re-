import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CoreValuesSection, PathSection, ScheduleSection, CustomSectionComponent } from './SectionComponents';
import { Habit } from '../../types';

import { useVisionBoard } from '../../contexts/VisionBoardContext';

interface VisionBoardCarouselProps {
  habits: Habit[];
  onComplete?: () => void;
}

const MIN_CARD_HEIGHT = 100;

export const VisionBoardCarousel: React.FC<VisionBoardCarouselProps> = ({ habits, onComplete }) => {
  const { data, updateSchedule } = useVisionBoard();
  const { schedule, custom } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(MIN_CARD_HEIGHT);
  
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = custom.enabled ? 4 : 3;
  const maxIndex = totalSlides - 1;

  const measureActiveSlide = useCallback(() => {
    const activeSlide = slideRefs.current[currentIndex];
    if (activeSlide) {
      let height = activeSlide.scrollHeight;
      // Add footer height if we're on the last slide
      if (currentIndex === maxIndex && footerRef.current) {
        height += footerRef.current.scrollHeight;
      }
      setCardHeight(Math.max(MIN_CARD_HEIGHT, height));
    }
  }, [currentIndex, maxIndex]);

  useEffect(() => {
    measureActiveSlide();
    
    const resizeObserver = new ResizeObserver(() => {
      measureActiveSlide();
    });
    
    const activeSlide = slideRefs.current[currentIndex];
    if (activeSlide) {
      resizeObserver.observe(activeSlide);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [currentIndex, measureActiveSlide, data]);

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

  const setSlideRef = (index: number) => (el: HTMLDivElement | null) => {
    slideRefs.current[index] = el;
  };

  return (
    <div
      className="flex flex-col w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
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
      <div className="flex flex-col items-center justify-center px-2 lg:px-4 pb-10">
        <div className="relative flex items-start gap-0 lg:gap-2 w-full lg:max-w-lg">
          {/* Left Arrow - Outside Card (Desktop only) */}
          <button
            onClick={handlePrev}
            className={`hidden lg:flex flex-shrink-0 p-2 rounded-full transition-all mt-64 ${currentIndex === 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-50 hover:opacity-100 text-gray-400 hover:text-white'
              }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Card Container */}
          <div
            className="w-full flex flex-col rounded-2xl overflow-hidden relative transition-[height] duration-300 ease-out"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.95), rgba(15, 15, 20, 0.98))',
              boxShadow: '0 0 40px rgba(234, 179, 8, 0.12), 0 0 80px rgba(234, 179, 8, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              height: `${cardHeight}px`
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
              className={`lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all ${currentIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'opacity-60 active:opacity-100 text-white'
                }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className={`lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all ${currentIndex === maxIndex
                ? 'opacity-0 pointer-events-none'
                : 'opacity-60 active:opacity-100 text-white'
                }`}
            >
              <ChevronRight size={20} />
            </button>

            {/* Slides Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out items-start"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {/* Slide 1: Core Values */}
                <div ref={setSlideRef(0)} className="w-full flex-shrink-0 pb-6">
                  <CoreValuesSection mode="view" />
                </div>
                {/* Slide 2: Path */}
                <div ref={setSlideRef(1)} className="w-full flex-shrink-0 pb-6">
                  <PathSection mode="view" habits={habits} readOnly={true} />
                </div>
                {/* Slide 3: Schedule */}
                <div ref={setSlideRef(2)} className="w-full flex-shrink-0 pb-6">
                  <ScheduleSection mode="view" schedule={schedule} updateSchedule={updateSchedule} habits={habits} />
                </div>
                {/* Slide 4: Custom (only if enabled) */}
                {custom.enabled && (
                  <div ref={setSlideRef(3)} className="w-full flex-shrink-0 pb-6">
                    <CustomSectionComponent mode="view" />
                  </div>
                )}
              </div>
            </div>

            {/* Continue Button - Only on Last Slide */}
            {(currentIndex === maxIndex) && (
              <div ref={footerRef} className="w-full flex justify-center pb-8 pt-4">
                <button
                  onClick={onComplete}
                  className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-full shadow-lg hover:bg-yellow-400 transition-all flex items-center gap-2 animate-pulse"
                  style={{ boxShadow: '0 0 20px rgba(234, 179, 8, 0.5)' }}
                >
                  CONTINUE <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Right Arrow - Outside Card (Desktop only) */}
          <button
            onClick={handleNext}
            className={`hidden lg:flex flex-shrink-0 p-2 rounded-full transition-all mt-64 ${currentIndex === maxIndex
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
            className={`transition-all duration-300 rounded-full ${currentIndex === idx
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

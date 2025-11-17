import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Phase0ManifestoProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    title: 'Stop Blaming Your Willpower',
    subtitle: 'Tools are passive. Mastery is Active.',
    visual: '⚡',
    description: 'Most habit apps treat you like a checklist. We treat you like an athlete. This isn\'t about tracking—it\'s about transformation.',
  },
  {
    title: 'The Science',
    subtitle: 'Dopamine Stacking & Game Theory',
    visual: '🧠',
    description: 'We use behavioral psychology to automate discipline. Your brain craves wins. We engineer micro-victories that compound into unstoppable momentum.',
  },
  {
    title: 'The Promise',
    subtitle: 'Turn Your Life Goals Into An Addictive Game',
    visual: '🎯',
    description: 'In the next 7 phases, we\'ll calibrate your psychology, audit your logistics, and build a custom protocol. No fluff. No theory. Pure execution.',
  },
];

export default function Phase0Manifesto({ onComplete }: Phase0ManifestoProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-2xl w-full">
        {/* Slide Content */}
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Visual */}
          <div className="text-8xl mb-8">
            {slide.visual}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {slide.title}
            </h1>
            <p className="text-xl text-gray-400 font-medium">
              {slide.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
            {slide.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-12">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-3 rounded-xl transition-all ${
                currentSlide === 0
                  ? 'text-gray-700 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {SLIDES.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-blue-500 w-8'
                      : 'bg-gray-700 w-2'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={currentSlide === SLIDES.length - 1 ? undefined : nextSlide}
              className={`p-3 rounded-xl transition-all ${
                currentSlide === SLIDES.length - 1
                  ? 'invisible'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Begin Button (only on last slide) */}
          {currentSlide === SLIDES.length - 1 && (
            <div className="pt-8 animate-fadeIn">
              <button
                onClick={onComplete}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                Begin Initiation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles, X } from 'lucide-react';
import { CompletedGoalInfo } from '../types/visionBoard';

interface GoalCompletionCelebrationProps {
  goalInfo: CompletedGoalInfo;
  onClose: () => void;
}

export const GoalCompletionCelebration: React.FC<GoalCompletionCelebrationProps> = ({ goalInfo, onClose }) => {
  const [showContent, setShowContent] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB'][Math.floor(Math.random() * 6)]
    }));
    setConfetti(pieces);
    
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const formatDuration = (days: number): string => {
    if (days === 0) return 'Less than a day';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 week' : `${weeks} weeks`;
    }
    if (days < 365) {
      const months = Math.floor(days / 30);
      return months === 1 ? '1 month' : `${months} months`;
    }
    const years = Math.floor(days / 365);
    const remainingMonths = Math.floor((days % 365) / 30);
    if (remainingMonths === 0) {
      return years === 1 ? '1 year' : `${years} years`;
    }
    return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}

      <div 
        className={`relative max-w-lg w-full mx-4 transition-all duration-700 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-yellow-900/40 via-orange-900/30 to-amber-900/40 rounded-3xl border-2 border-yellow-500/50 p-8 text-center overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), 0 0 120px rgba(251, 191, 36, 0.1)' }}
        >
          <div className="absolute top-4 left-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-yellow-400/60" />
          </div>
          <div className="absolute top-4 right-12 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Star className="w-5 h-5 text-yellow-400/60" />
          </div>
          <div className="absolute bottom-4 left-8 animate-pulse" style={{ animationDelay: '1s' }}>
            <Star className="w-4 h-4 text-yellow-400/60" />
          </div>

          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce-slow"
              style={{ boxShadow: '0 0 40px rgba(251, 191, 36, 0.6)' }}
            >
              <Trophy className="w-12 h-12 text-black" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-yellow-400 mb-2 tracking-wide">
            ACHIEVEMENT UNLOCKED!
          </h2>
          
          <p className="text-lg text-gray-300 mb-6">
            You completed a {goalInfo.type === 'project' ? 'project' : 'goal'}!
          </p>

          <div className="bg-black/30 rounded-2xl p-6 mb-6">
            <p className="text-2xl font-bold text-white mb-4">
              "{goalInfo.text}"
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-gray-400 mb-1">
                  {goalInfo.isApproximateDuration ? 'Time Since Tracking' : 'Journey Duration'}
                </div>
                <div className="text-xl font-bold text-yellow-400">
                  {formatDuration(goalInfo.durationDays)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-gray-400 mb-1">Completed On</div>
                <div className="text-lg font-bold text-green-400">
                  {formatDate(goalInfo.completedAt)}
                </div>
              </div>
            </div>

            {goalInfo.createdAt && (
              <div className="mt-4 text-sm text-gray-400">
                {goalInfo.isApproximateDuration ? 'Tracked since' : 'Started on'} {formatDate(goalInfo.createdAt)}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all hover:scale-105"
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)' }}
          >
            Continue My Journey
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 4s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

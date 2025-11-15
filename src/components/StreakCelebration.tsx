import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface StreakCelebrationProps {
    habitName: string;
    streakDays: number;
    onClose: () => void;
}

export default function StreakCelebration({ habitName, streakDays, onClose }: StreakCelebrationProps) {
    const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number }[]>([]);

    useEffect(() => {
        const pieces = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
        }));
        setConfetti(pieces);
    }, []);

    const getMessage = () => {
        if (streakDays >= 30) return "🔥 LEGENDARY! 30-Day Streak!";
        if (streakDays >= 14) return "💪 TWO WEEKS STRONG!";
        if (streakDays >= 7) return "🎉 WEEK STREAK! Hell Yeah!";
        return "🔥 3-Day Streak! You're Building Momentum!";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn">
            {/* Confetti */}
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute top-0 w-3 h-3 animate-confetti"
                    style={{
                        left: `${piece.left}%`,
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77'][piece.id % 4],
                        animationDelay: `${piece.delay}s`,
                    }}
                />
            ))}

            {/* Modal */}
            <div className="relative bg-gray-900 border-4 border-yellow-400 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                    {getMessage()}
                </h2>
                <p className="text-xl text-white mb-4">
                    {habitName}
                </p>
                <p className="text-gray-400">
                    You're building the habit muscle. Keep crushing it!
                </p>

                <button
                    onClick={onClose}
                    className="mt-6 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg transition-all transform hover:scale-105"
                >
                    Let's Go! 🚀
                </button>
            </div>

            <style>{`
                @keyframes confetti {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti 3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

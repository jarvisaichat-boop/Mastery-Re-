import { useEffect, useState } from 'react';

interface ReflectionProps {
    data: {
        distractions: string[];
        aspirations: string;
    };
    onNext: () => void;
}

const DISTRACTION_LABELS: Record<string, string> = {
    social: 'social media',
    netflix: 'streaming services',
    dating: 'dating apps',
    games: 'video games',
    news: 'news and doom-scrolling',
    procrastination: 'procrastination',
};

export default function Reflection({ data, onNext }: ReflectionProps) {
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const distractionsText = data.distractions
        .map(d => DISTRACTION_LABELS[d] || d)
        .join(', ')
        .replace(/, ([^,]*)$/, ' and $1');

    const reflection = `I hear you. You want to ${data.aspirations.toLowerCase().replace(/\.$/, '')}, but you're losing hours to ${distractionsText}.

You're not lazy. You're distracted. And distraction is a habit you've trained yourself into.

The good news? Habits can be retrained.

Let's begin.`;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">The Reflection</h2>
                <p className="text-xl text-gray-400">Here's what I'm hearing...</p>
            </div>

            <div className="my-12 p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                {isTyping ? (
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="flex gap-1">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                        </div>
                        <span>AI is reflecting on your responses...</span>
                    </div>
                ) : (
                    <p className="text-lg leading-relaxed whitespace-pre-line">{reflection}</p>
                )}
            </div>

            {!isTyping && (
                <div className="text-center">
                    <button
                        onClick={onNext}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                        I'm Ready
                    </button>
                </div>
            )}
        </div>
    );
}

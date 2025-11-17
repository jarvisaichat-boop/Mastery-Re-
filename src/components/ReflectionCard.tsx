import { useState } from 'react';
import { formatDate } from '../utils';

export interface ReflectionAnswer {
    value: string;
    percentage: string;
    emoji: string;
}

export const REFLECTION_ANSWERS: ReflectionAnswer[] = [
    { value: 'very-great', percentage: '100% ~ 80%', emoji: '😎' },
    { value: 'great', percentage: '80% ~ 50%', emoji: '😊' },
    { value: 'okay', percentage: '50% ~ 30%', emoji: '😐' },
    { value: 'not-great', percentage: '30% ~ 0%', emoji: '😔' }
];

export const DAILY_REFLECTION_QUESTION = "How much progress did you feel towards your goal?";

export function getAnswerLabel(value: string): string {
    const labels: Record<string, string> = {
        'very-great': 'Very Great',
        'great': 'Great',
        'okay': 'Okay',
        'not-great': 'Not Great'
    };
    return labels[value] || value;
}

interface ReflectionCardProps {
    onComplete: (answer: ReflectionAnswer, reasoning: string) => void;
    initialAnswer?: ReflectionAnswer | null;
    initialReasoning?: string;
}

export default function ReflectionCard({ onComplete, initialAnswer = null, initialReasoning = '' }: ReflectionCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<ReflectionAnswer | null>(initialAnswer);
    const [reasoning, setReasoning] = useState(initialReasoning);
    const [hasTypedReasoning, setHasTypedReasoning] = useState(initialReasoning.length > 0);

    const handleSelectAnswer = (answer: ReflectionAnswer) => {
        setSelectedAnswer(answer);
        setHasTypedReasoning(false);
    };

    const handleReasoningChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReasoning(e.target.value);
        if (e.target.value.trim() && !hasTypedReasoning) {
            setHasTypedReasoning(true);
        }
    };

    const handleSave = () => {
        if (!selectedAnswer) return;
        onComplete(selectedAnswer, reasoning.trim());
    };

    const handleChangeAnswer = () => {
        setSelectedAnswer(null);
        // Keep reasoning - user might want to keep their reflection when changing answer
    };

    const handleBack = () => {
        setSelectedAnswer(null);
        setReasoning('');
        setHasTypedReasoning(false);
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden mb-4">
            {/* Hero Image Area */}
            <div className="relative h-40 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
                <div className="text-center z-10">
                    <div className="text-5xl mb-2">✨</div>
                    <h3 className="text-lg font-bold text-white mb-1">Daily Reflection</h3>
                    <p className="text-xs text-gray-300">
                        {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>
            </div>

            {/* Question Module */}
            <div className="p-6 space-y-4">
                <div className="flex items-start gap-2 mb-4">
                    <div className="text-xl">📝</div>
                    <h2 className="text-base font-bold text-white flex-1">
                        {DAILY_REFLECTION_QUESTION}
                    </h2>
                </div>

                {/* Answer Options */}
                {!selectedAnswer && (
                    <div className="space-y-2">
                        {REFLECTION_ANSWERS.map((answer) => (
                            <button
                                key={answer.value}
                                onClick={() => handleSelectAnswer(answer)}
                                className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 border-2 border-pink-500/30 hover:border-pink-500/60 rounded-xl transition-all transform hover:scale-[1.02] flex items-center gap-3"
                            >
                                <span className="text-2xl">{answer.emoji}</span>
                                <div className="text-left flex-1">
                                    <p className="text-white font-medium text-sm">
                                        {getAnswerLabel(answer.value)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {answer.percentage} Productivity
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 1 Celebration: Answer Selected */}
                {selectedAnswer && (
                    <div className="space-y-4 animate-fadeIn">
                        {/* Celebration after selecting answer */}
                        <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">✅</span>
                                <div className="flex-1">
                                    <p className="text-base font-bold text-white">Nice! You answered the question!</p>
                                    <p className="text-xs text-gray-300">That was easy, right?</p>
                                </div>
                                <button
                                    onClick={handleChangeAnswer}
                                    className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600 text-xs text-white font-medium rounded-lg transition-all"
                                >
                                    Change
                                </button>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                                <span className="text-xl">{selectedAnswer.emoji}</span>
                                <div>
                                    <p className="text-white font-bold text-sm">{getAnswerLabel(selectedAnswer.value)}</p>
                                    <p className="text-xs text-gray-400">{selectedAnswer.percentage} Productivity</p>
                                </div>
                            </div>
                        </div>

                        {/* Optional deeper reflection */}
                        <div className="space-y-2">
                            <label className="block text-white font-medium text-sm flex items-center gap-2">
                                <span className="text-xs text-gray-400">(Optional)</span>
                                Why did you select "{getAnswerLabel(selectedAnswer.value)}"?
                            </label>
                            <textarea
                                value={reasoning}
                                onChange={handleReasoningChange}
                                placeholder="Share what's on your mind... your feelings, thoughts, what happened today..."
                                className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                                autoFocus
                            />
                            
                            {/* Step 2 Celebration: Started typing reasoning */}
                            {hasTypedReasoning && reasoning.trim().length > 0 && (
                                <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded-lg flex items-center gap-2 animate-fadeIn">
                                    <span className="text-xl">✨</span>
                                    <p className="text-xs text-white font-medium">
                                        Amazing! You're going deeper. This builds real self-awareness.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition-all"
                            >
                                Save Reflection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

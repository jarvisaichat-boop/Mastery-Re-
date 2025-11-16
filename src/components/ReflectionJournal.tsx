import { useState } from 'react';
import { formatDate } from '../utils';

interface ReflectionAnswer {
    value: string;
    percentage: string;
    emoji: string;
}

interface ReflectionEntry {
    date: string;
    question: string;
    answer: ReflectionAnswer;
    reasoning: string;
    timestamp: number;
}

interface ReflectionJournalProps {
    onClose: () => void;
}

const REFLECTION_ANSWERS: ReflectionAnswer[] = [
    { value: 'very-great', percentage: '100% ~ 80%', emoji: '😎' },
    { value: 'great', percentage: '80% ~ 50%', emoji: '😊' },
    { value: 'okay', percentage: '50% ~ 30%', emoji: '😐' },
    { value: 'not-great', percentage: '30% ~ 0%', emoji: '😔' }
];

const REFLECTION_QUESTIONS = [
    "How much contribution did you feel you made towards your goal?",
    "How aligned did you feel with your purpose today?",
    "How strong was your internal drive and motivation?",
    "How clear and focused was your mind throughout the day?",
    "How much energy and vitality did you experience?",
    "How resilient did you feel when facing challenges?",
    "How present and intentional were you with your actions?",
    "How satisfied are you with your progress towards mastery?",
    "How connected did you feel to your deeper 'why'?",
    "How well did you honor your commitments to yourself?"
];

const LOCAL_STORAGE_REFLECTIONS_KEY = 'mastery-dashboard-reflections';
const LOCAL_STORAGE_QUESTION_INDEX_KEY = 'mastery-dashboard-question-index';

function loadReflections(): ReflectionEntry[] {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_REFLECTIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load reflections", e);
        return [];
    }
}

function saveReflections(reflections: ReflectionEntry[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_REFLECTIONS_KEY, JSON.stringify(reflections));
    } catch (e) {
        console.error("Failed to save reflections", e);
    }
}

function getNextQuestionIndex(): number {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_QUESTION_INDEX_KEY);
        return stored ? parseInt(stored, 10) : 0;
    } catch (e) {
        return 0;
    }
}

function incrementQuestionIndex(currentIndex: number) {
    const nextIndex = (currentIndex + 1) % REFLECTION_QUESTIONS.length;
    localStorage.setItem(LOCAL_STORAGE_QUESTION_INDEX_KEY, nextIndex.toString());
}

function getQuestionForToday(reflections: ReflectionEntry[], today: string): { question: string; index: number } {
    const todayReflection = reflections.find(r => r.date === today);
    if (todayReflection) {
        const index = REFLECTION_QUESTIONS.indexOf(todayReflection.question);
        return { question: todayReflection.question, index: index >= 0 ? index : 0 };
    }
    
    const index = getNextQuestionIndex();
    return { question: REFLECTION_QUESTIONS[index], index };
}

function getAnswerLabel(value: string): string {
    const labels: Record<string, string> = {
        'very-great': 'Very Great',
        'great': 'Great',
        'okay': 'Okay',
        'not-great': 'Not Great'
    };
    return labels[value] || value;
}

export default function ReflectionJournal({ onClose }: ReflectionJournalProps) {
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    const [reflections, setReflections] = useState<ReflectionEntry[]>(loadReflections());
    const { question: todayQuestion, index: questionIndex } = getQuestionForToday(reflections, today);
    
    const [selectedAnswer, setSelectedAnswer] = useState<ReflectionAnswer | null>(null);
    const [reasoning, setReasoning] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const todayReflection = reflections.find(r => r.date === today);
    const hasCompletedToday = !!todayReflection;

    const handleSelectAnswer = (answer: ReflectionAnswer) => {
        setSelectedAnswer(answer);
    };

    const handleSave = () => {
        if (!selectedAnswer || !reasoning.trim()) return;

        const newEntry: ReflectionEntry = {
            date: today,
            question: todayQuestion,
            answer: selectedAnswer,
            reasoning: reasoning.trim(),
            timestamp: Date.now()
        };

        const updatedReflections = reflections.filter(r => r.date !== today);
        updatedReflections.push(newEntry);
        
        setReflections(updatedReflections);
        saveReflections(updatedReflections);
        incrementQuestionIndex(questionIndex);
        setShowConfirmation(true);
    };

    const handleDone = () => {
        onClose();
    };

    if (showConfirmation) {
        return (
            <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
                <div className="min-h-screen p-6 flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl border-2 border-green-500/50 p-8 text-center space-y-6 animate-fadeIn">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold text-white">Greaaat Job!</h2>
                        <p className="text-lg text-gray-300">
                            Your reflection has been captured. Understanding your inner state is just as important as tracking habits.
                        </p>
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-white text-sm">
                                💡 <span className="font-bold">Don't forget</span> to log your amazing progress in the habit tracker!
                            </p>
                        </div>
                        <button
                            onClick={handleDone}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                        >
                            Back to Dashboard →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (hasCompletedToday && !selectedAnswer) {
        return (
            <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
                <div className="min-h-screen p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-white">Reflection Journal</h1>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <span className="text-2xl text-gray-400">×</span>
                            </button>
                        </div>

                        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 text-center space-y-4">
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-white">Already Reflected Today!</h3>
                            <p className="text-gray-400">Come back tomorrow for your next reflection.</p>
                            
                            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-left">
                                <p className="text-sm text-gray-400 mb-2">Your reflection:</p>
                                <p className="text-white font-medium mb-4">"{todayReflection.question}"</p>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{todayReflection.answer.emoji}</span>
                                    <div>
                                        <p className="text-white font-bold">{getAnswerLabel(todayReflection.answer.value)}</p>
                                        <p className="text-sm text-gray-400">{todayReflection.answer.percentage} Productivity</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{todayReflection.reasoning}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
            <div className="min-h-screen p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-white">Reflection Journal</h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <span className="text-2xl text-gray-400">×</span>
                        </button>
                    </div>

                    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                        {/* Hero Image Area */}
                        <div className="relative h-56 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
                            <div className="text-center z-10">
                                <div className="text-7xl mb-3">✨</div>
                                <h3 className="text-xl font-bold text-white mb-1">Daily Reflection</h3>
                                <p className="text-sm text-gray-300">
                                    {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
                                </p>
                            </div>
                        </div>

                        {/* Question Module */}
                        <div className="p-8 space-y-6">
                            <div className="flex items-start gap-3 mb-6">
                                <div className="text-2xl">📝</div>
                                <h2 className="text-xl font-bold text-white flex-1">
                                    {todayQuestion}
                                </h2>
                            </div>

                            {/* Answer Options */}
                            {!selectedAnswer && (
                                <div className="space-y-3">
                                    {REFLECTION_ANSWERS.map((answer) => (
                                        <button
                                            key={answer.value}
                                            onClick={() => handleSelectAnswer(answer)}
                                            className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 border-2 border-pink-500/30 hover:border-pink-500/60 rounded-2xl transition-all transform hover:scale-[1.02] flex items-center gap-4"
                                        >
                                            <span className="text-3xl">{answer.emoji}</span>
                                            <div className="text-left flex-1">
                                                <p className="text-white font-medium">
                                                    {getAnswerLabel(answer.value)}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {answer.percentage} Productivity
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Expanded Reasoning Section */}
                            {selectedAnswer && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3">
                                        <span className="text-3xl">{selectedAnswer.emoji}</span>
                                        <div>
                                            <p className="text-white font-bold">{getAnswerLabel(selectedAnswer.value)}</p>
                                            <p className="text-sm text-gray-400">{selectedAnswer.percentage} Productivity</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-white font-medium">
                                            Why did you select "{getAnswerLabel(selectedAnswer.value)}"?
                                        </label>
                                        <textarea
                                            value={reasoning}
                                            onChange={(e) => setReasoning(e.target.value)}
                                            placeholder="Share what's on your mind... your feelings, thoughts, what happened today..."
                                            className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedAnswer(null);
                                                setReasoning('');
                                            }}
                                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={!reasoning.trim()}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                                        >
                                            Save Reflection
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

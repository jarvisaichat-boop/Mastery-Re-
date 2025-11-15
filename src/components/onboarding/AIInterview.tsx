import { useState } from 'react';

interface AIInterviewProps {
    onNext: (distractions: string[], aspirations: string) => void;
}

const DISTRACTION_OPTIONS = [
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'netflix', label: 'Netflix/Streaming', icon: '📺' },
    { id: 'dating', label: 'Dating Apps', icon: '💬' },
    { id: 'games', label: 'Video Games', icon: '🎮' },
    { id: 'news', label: 'News/Doom-scrolling', icon: '📰' },
    { id: 'procrastination', label: 'General Procrastination', icon: '⏰' },
];

export default function AIInterview({ onNext }: AIInterviewProps) {
    const [selectedDistractions, setSelectedDistractions] = useState<string[]>([]);
    const [aspirations, setAspirations] = useState('');
    const [step, setStep] = useState<'distractions' | 'aspirations'>('distractions');

    const toggleDistraction = (id: string) => {
        setSelectedDistractions(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const handleDistractionsNext = () => {
        if (selectedDistractions.length > 0) {
            setStep('aspirations');
        }
    };

    const handleComplete = () => {
        if (aspirations.trim()) {
            onNext(selectedDistractions, aspirations);
        }
    };

    if (step === 'distractions') {
        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Let's understand your "Why."</h2>
                    <p className="text-xl text-gray-400">What's stealing your focus?</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    {DISTRACTION_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            onClick={() => toggleDistraction(option.id)}
                            className={`p-6 rounded-lg border-2 transition-all text-left ${
                                selectedDistractions.includes(option.id)
                                    ? 'border-blue-500 bg-blue-500/20'
                                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            }`}
                        >
                            <div className="text-3xl mb-2">{option.icon}</div>
                            <div className="font-semibold">{option.label}</div>
                        </button>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={handleDistractionsNext}
                        disabled={selectedDistractions.length === 0}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Who do you want to become?</h2>
                <p className="text-xl text-gray-400">Be specific about your aspirations.</p>
            </div>

            <div className="mt-8">
                <textarea
                    value={aspirations}
                    onChange={(e) => setAspirations(e.target.value)}
                    placeholder="Example: I want to build my own business and become financially independent..."
                    className="w-full h-48 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    autoFocus
                />
            </div>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => setStep('distractions')}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                >
                    Back
                </button>
                <button
                    onClick={handleComplete}
                    disabled={!aspirations.trim()}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

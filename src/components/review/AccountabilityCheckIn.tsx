import { useState } from 'react';
import { Habit } from '../../types';

interface AccountabilityCheckInProps {
    habits: Habit[];
    onComplete: () => void;
    onSkip: () => void;
}

export default function AccountabilityCheckIn({ habits, onComplete, onSkip }: AccountabilityCheckInProps) {
    const [copied, setCopied] = useState(false);

    const generateCommitmentMessage = (): string => {
        const activeHabits = habits.slice(0, 3);
        const habitList = activeHabits.map(h => h.name).join(', ');
        
        return `I'm committing to ${habitList} this week. I will update you on Sunday. Hold me to it.`;
    };

    const handleWhatsApp = () => {
        const message = generateCommitmentMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleSMS = () => {
        const message = generateCommitmentMessage();
        const encodedMessage = encodeURIComponent(message);
        const smsUrl = `sms:?&body=${encodedMessage}`;
        window.location.href = smsUrl;
    };

    const handleCopyToClipboard = () => {
        const message = generateCommitmentMessage();
        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
                <div className="text-5xl mb-4">🤝</div>
                <h2 className="text-3xl font-bold">Accountability Check-In</h2>
                <p className="text-xl text-gray-400">Make it real. Share your commitment.</p>
            </div>

            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-lg text-gray-300 mb-4">
                    Your plan for next week is locked. Now, make it real.
                </p>
                <p className="text-gray-400">
                    Share your commitment with a friend, family member, or accountability group. 
                    Social pressure is the best motivation.
                </p>
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-3">Your commitment message:</p>
                <p className="text-white italic">"{generateCommitmentMessage()}"</p>
            </div>

            <div className="space-y-3">
                <p className="text-center text-sm text-gray-400 font-semibold">Choose how to share:</p>
                
                <button
                    onClick={handleWhatsApp}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">💬</span>
                    Share via WhatsApp
                </button>
                
                <button
                    onClick={handleSMS}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">📱</span>
                    Share via SMS/iMessage
                </button>
                
                <button
                    onClick={handleCopyToClipboard}
                    className={`w-full py-4 ${copied ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3`}
                >
                    <span className="text-2xl">{copied ? '✅' : '📋'}</span>
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
            </div>

            <div className="flex flex-col gap-3 mt-6">
                <button
                    onClick={onComplete}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                >
                    I've Shared It →
                </button>
                
                <button
                    onClick={onSkip}
                    className="w-full py-2 text-gray-400 hover:text-white transition-all text-sm"
                >
                    Skip (Not Recommended)
                </button>
            </div>

            <div className="text-center text-sm text-gray-500">
                <p>Pro tip: Share with someone who won't let you off easy.</p>
            </div>
        </div>
    );
}

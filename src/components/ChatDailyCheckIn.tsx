import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { formatDate } from '../utils';

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: number;
}

interface ChatDailyCheckInProps {
    date: Date;
    onSubmit: (entry: { wins: string; challenges: string; messages: Message[] }) => void;
    onDismiss: () => void;
}

export default function ChatDailyCheckIn({ date, onSubmit, onDismiss }: ChatDailyCheckInProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: "Good morning! How did you do yesterday? 💪",
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [hasCollectedWins, setHasCollectedWins] = useState(false);
    const [hasCollectedChallenges, setHasCollectedChallenges] = useState(false);
    const [wins, setWins] = useState('');
    const [challenges, setChallenges] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const generateAIResponse = (userMessage: string): string => {
        const messageLower = userMessage.toLowerCase();

        if (!hasCollectedWins) {
            const positiveResponses = [
                "That's what I'm talking about! 🔥 Now, what challenges did you face?",
                "Solid work! You're building momentum. What got in your way yesterday?",
                "Hell yeah! Every win counts. What made things tough yesterday?",
                "Love it! You showed up. What obstacles did you run into?",
                "Crushing it! Keep that energy. What slowed you down yesterday?"
            ];
            setHasCollectedWins(true);
            setWins(userMessage);
            return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
        }

        if (!hasCollectedChallenges) {
            const encouragingResponses = [
                "I hear you. Life throws punches, but you're still standing. That's already a win. 💪",
                "The fact you're even reflecting on this? That's growth. Most people don't do that.",
                "Listen, challenges are just data points. You're learning what works and what doesn't. That's progress.",
                "Real talk: You showed up today to think about this. That takes courage. You're on the right path.",
                "Obstacles reveal character. The fact you're here analyzing them means you're serious about this. Respect.",
                "Every stumble teaches you something. You're building resilience right now, whether you realize it or not."
            ];
            setHasCollectedChallenges(true);
            setChallenges(userMessage);
            return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
        }

        if (messageLower.includes('better') || messageLower.includes('improve') || messageLower.includes('help')) {
            return "Here's the truth: You don't need to be perfect. You need to be consistent. Small wins compound. Focus on showing up, even when it's hard. That's how kings are made. 👑";
        }

        if (messageLower.includes('failed') || messageLower.includes('mess') || messageLower.includes('bad')) {
            return "Stop right there. Failing is feedback, not a verdict on who you are. You're learning. That's what matters. The path to mastery is paved with mistakes.";
        }

        if (messageLower.includes('motivated') || messageLower.includes('energy') || messageLower.includes('tired')) {
            return "Motivation is overrated. Discipline beats motivation every time. You don't wait to feel like it—you just do it. That's the secret.";
        }

        if (messageLower.includes('thanks') || messageLower.includes('thank')) {
            return "No need to thank me. Just keep showing up. That's all that matters. 🔥";
        }

        const genericPositive = [
            "You're on the right track. Trust the process. 🎯",
            "Keep that mindset. Consistency over perfection.",
            "Real progress happens in the small moments. You're doing the work.",
            "The fact you're here means you care. That's half the battle.",
            "You've got this. One day at a time, one habit at a time."
        ];
        
        return genericPositive[Math.floor(Math.random() * genericPositive.length)];
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: inputValue.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse = generateAIResponse(inputValue.trim());
            const aiMessage: Message = {
                role: 'ai',
                content: aiResponse,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 800);
    };

    const handleComplete = () => {
        if (wins || challenges) {
            onSubmit({ wins, challenges, messages });
        }
    };

    const canComplete = hasCollectedWins && hasCollectedChallenges;
    const yesterdayDate = new Date(date);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                        <div>
                            <h2 className="text-2xl font-bold">Daily Check-In</h2>
                            <p className="text-sm text-gray-400">{formatDate(yesterdayDate, 'MMMM d, yyyy')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-100 border border-gray-700'
                                }`}
                            >
                                {message.role === 'ai' && (
                                    <div className="text-xs text-gray-400 mb-1 font-semibold">Stoic Coach</div>
                                )}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                                <div className="text-xs text-gray-400 mb-1 font-semibold">Stoic Coach</div>
                                <div className="flex gap-1">
                                    <span className="animate-bounce text-gray-400" style={{ animationDelay: '0ms' }}>●</span>
                                    <span className="animate-bounce text-gray-400" style={{ animationDelay: '150ms' }}>●</span>
                                    <span className="animate-bounce text-gray-400" style={{ animationDelay: '300ms' }}>●</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-gray-700">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={
                                !hasCollectedWins
                                    ? "What went well yesterday?"
                                    : !hasCollectedChallenges
                                    ? "What challenges did you face?"
                                    : "Ask me anything..."
                            }
                            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    {canComplete && (
                        <button
                            onClick={handleComplete}
                            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
                        >
                            Complete Check-In ✓
                        </button>
                    )}

                    <p className="text-xs text-gray-500 mt-3 text-center">
                        {!hasCollectedWins && "Share what went well first"}
                        {hasCollectedWins && !hasCollectedChallenges && "Now share your challenges"}
                        {canComplete && "Chat complete! Click above to finish or ask more questions"}
                    </p>
                </div>
            </div>
        </div>
    );
}

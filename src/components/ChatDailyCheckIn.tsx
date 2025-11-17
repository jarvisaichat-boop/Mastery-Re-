import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { formatDate } from '../utils';
import ReflectionCard, { ReflectionAnswer } from './ReflectionCard';
import ReflectionSummaryCard from './ReflectionSummaryCard';

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: number;
}

interface ReflectionEntry {
    date: string;
    answer: ReflectionAnswer;
    reasoning: string;
    timestamp: number;
}

interface ChatDailyCheckInProps {
    onDismiss: () => void;
}

const LOCAL_STORAGE_REFLECTIONS_KEY = 'mastery-dashboard-reflections';

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

function generateMotivationalResponse(answer: ReflectionAnswer): string {
    const value = answer.value;
    
    if (value === 'very-great') {
        const responses = [
            "Hell yeah! 🔥 That's the kind of energy that builds empires. Keep this momentum going.",
            "Crushing it! The fact you're even tracking this shows you're serious. Most people don't do that.",
            "Love that you're feeling strong progress. This is how you build unstoppable momentum. 💪",
            "That's what I'm talking about! You're in the zone. Stay locked in."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (value === 'great') {
        const responses = [
            "Solid! Progress is progress. You showed up, and that's what counts. 🎯",
            "Nice work! Every step forward matters. You're building something real here.",
            "Good stuff! The fact you're reflecting means you're growing. Keep at it.",
            "You're on track. Consistency over perfection—that's the secret."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (value === 'okay') {
        const responses = [
            "I hear you. Some days are just about maintaining. That's okay. You're still in the game. 💪",
            "Listen, showing up even when it's tough? That's real strength. You're building resilience.",
            "The fact you're even reflecting on this? That's growth. Most people don't do that.",
            "You're honest with yourself. That takes courage. Tomorrow's a new shot at greatness."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // not-great
    const responses = [
        "Real talk: You showed up today to think about this. That takes courage. You're on the right path.",
        "I see you. Life throws punches, but you're still standing. That's already a win. 💪",
        "The fact you're reflecting instead of avoiding? That's how winners are built. Respect.",
        "Obstacles reveal character. You're here analyzing them, which means you're serious about growth."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

export default function ChatDailyCheckIn({ onDismiss }: ChatDailyCheckInProps) {
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    const [reflections, setReflections] = useState<ReflectionEntry[]>(loadReflections());
    const todayReflection = reflections.find(r => r.date === today);
    
    const [showReflectionCard, setShowReflectionCard] = useState(!todayReflection);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, showReflectionCard]);

    const handleReflectionComplete = (answer: ReflectionAnswer, reasoning: string) => {
        const newEntry: ReflectionEntry = {
            date: today,
            answer,
            reasoning,
            timestamp: Date.now()
        };

        const updatedReflections = reflections.filter(r => r.date !== today);
        updatedReflections.push(newEntry);
        
        setReflections(updatedReflections);
        saveReflections(updatedReflections);
        setShowReflectionCard(false);

        // AI sends motivational response
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const motivationalMessage: Message = {
                    role: 'ai',
                    content: generateMotivationalResponse(answer),
                    timestamp: Date.now()
                };
                setMessages([motivationalMessage]);
                setIsTyping(false);
            }, 800);
        }, 300);
    };

    const handleEditReflection = () => {
        // Delete today's reflection and show card again
        const updatedReflections = reflections.filter(r => r.date !== today);
        setReflections(updatedReflections);
        saveReflections(updatedReflections);
        setShowReflectionCard(true);
        setMessages([]);
    };

    const generateAIResponse = (userMessage: string): string => {
        const messageLower = userMessage.toLowerCase();

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

    const reflectionComplete = !!todayReflection || !showReflectionCard;

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
            <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl h-full flex flex-col border border-gray-700">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                        <div>
                            <h2 className="text-2xl font-bold">Daily Check-In</h2>
                            <p className="text-sm text-gray-400">{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</p>
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
                {/* Reflection Card or Summary */}
                {showReflectionCard ? (
                    <ReflectionCard onComplete={handleReflectionComplete} />
                ) : todayReflection ? (
                    <ReflectionSummaryCard 
                        answer={todayReflection.answer}
                        reasoning={todayReflection.reasoning}
                        onEdit={handleEditReflection}
                    />
                ) : null}

                {/* Chat Messages */}
                {reflectionComplete && messages.map((message, index) => (
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

                {reflectionComplete && isTyping && (
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

                {/* Chat Input - Only show after reflection is complete */}
                {reflectionComplete && (
                    <div className="p-6 border-t border-gray-700">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                autoFocus={messages.length > 0}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

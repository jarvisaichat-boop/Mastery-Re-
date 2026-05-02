import { useRef, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
// ReflectionCard and ReflectionSummaryCard are preserved for future use — not rendered here
// import ReflectionCard from './ReflectionCard';
// import ReflectionSummaryCard from './ReflectionSummaryCard';

interface ChatDailyCheckInProps {
    onDismiss: () => void;
}

export default function ChatDailyCheckIn({ onDismiss }: ChatDailyCheckInProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <div className="daily-checkin-modal fixed inset-0 bg-black z-50 flex items-center justify-center px-4 sm:px-6">
            <div className="bg-gray-900 shadow-2xl w-full h-full flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold">Chat</h2>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Daily Reflection card is hidden for MVP — preserved in ReflectionCard.tsx for future use */}
                    {/* Daily Reflection summary card is hidden for MVP — preserved in ReflectionSummaryCard.tsx for future use */}

                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700">
                            <div className="text-xs text-gray-400 mb-1 font-semibold">Path</div>
                            <p className="text-sm leading-relaxed">
                                Chat will provide you with useful information and insights to support your journey and keep you moving forward.
                            </p>
                        </div>
                    </div>

                    {/* User input is hidden for MVP */}

                    <div ref={messagesEndRef} />
                </div>

                {/* Chat input is hidden for MVP — will be re-enabled in future two-way chat feature */}
            </div>
        </div>
    );
}

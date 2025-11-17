import { Sparkles, User } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  sender: 'ai' | 'user';
  timestamp?: number;
}

export default function ChatBubble({ message, sender }: ChatBubbleProps) {
  const isAI = sender === 'ai';

  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isAI
            ? 'bg-gray-900/50 border border-gray-700/50 text-gray-100'
            : 'bg-blue-600 text-white'
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700/50 border border-gray-600/50 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-300" />
        </div>
      )}
    </div>
  );
}

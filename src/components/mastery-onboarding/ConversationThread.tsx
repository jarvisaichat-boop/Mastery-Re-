import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

export interface Message {
  id: string;
  message: string;
  sender: 'ai' | 'user';
  timestamp: number;
}

interface ConversationThreadProps {
  messages: Message[];
}

export default function ConversationThread({ messages }: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg.message}
          sender={msg.sender}
          timestamp={msg.timestamp}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

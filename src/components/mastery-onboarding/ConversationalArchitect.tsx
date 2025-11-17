import { useState } from 'react';
import { Send } from 'lucide-react';
import ConversationThread, { Message } from './ConversationThread';

interface ConversationalArchitectProps {
  goal: string;
  onLogicComplete: (data: { milestone: string; action: string }) => void;
}

export default function ConversationalArchitect({ goal, onLogicComplete }: ConversationalArchitectProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: `Alright, let's break down "${goal}" into a logical pathway. First, I need to understand what milestone would prove you're making progress.`,
      sender: 'ai',
      timestamp: Date.now(),
    },
    {
      id: '2',
      message: 'A milestone is a concrete checkpoint - something measurable you can track. For example, if your goal is $100K in revenue, a milestone might be "Sign 2 clients at $400 each" or "Hit $10K in monthly sales."',
      sender: 'ai',
      timestamp: Date.now() + 100,
    },
    {
      id: '3',
      message: 'What milestone makes sense for your goal?',
      sender: 'ai',
      timestamp: Date.now() + 200,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [milestone, setMilestone] = useState('');
  const [stage, setStage] = useState<'milestone' | 'action'>('milestone');

  const addMessage = (message: string, sender: 'ai' | 'user') => {
    setMessages(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        sender,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    addMessage(message, 'user');
    setInputValue('');

    if (stage === 'milestone') {
      setMilestone(message);

      // AI validates milestone
      setTimeout(() => {
        addMessage(
          `"${message}" - Great! That's specific and measurable. Now I need to understand what daily action will get you there.`,
          'ai'
        );

        setTimeout(() => {
          addMessage(
            'An action is something you can do consistently. For example: "Reach out to 5 potential clients daily" or "Post content 3 times per week."',
            'ai'
          );

          setTimeout(() => {
            addMessage('What action will you take to reach that milestone?', 'ai');
            setStage('action');
          }, 1000);
        }, 1000);
      }, 500);
    } else {
      // AI validates action and completes
      setTimeout(() => {
        addMessage(
          `Perfect! Here's your logic chain:\n\n"${message}" (daily action) → "${milestone}" (milestone) → "${goal}" (goal)\n\nThis is your roadmap. Simple, measurable, achievable.`,
          'ai'
        );

        setTimeout(() => {
          onLogicComplete({ milestone, action: message });
        }, 2000);
      }, 500);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AI Greeting Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">The Logic Tree</h2>
        <p className="text-lg text-gray-300">
          Let's build a clear pathway to your goal
        </p>
      </div>

      {/* Conversation Thread */}
      <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6 min-h-[350px] max-h-[450px] overflow-y-auto">
        <ConversationThread messages={messages} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            stage === 'milestone'
              ? 'e.g., Sign 2 clients at $400 each'
              : 'e.g., Reach out to 5 potential clients daily'
          }
          className="flex-1 px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-lg text-white text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            inputValue.trim()
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>

      {/* Helper Text */}
      <p className="text-sm text-gray-400 text-center">
        {stage === 'milestone'
          ? 'Think of a checkpoint that proves progress'
          : 'What will you do daily or weekly?'}
      </p>
    </div>
  );
}

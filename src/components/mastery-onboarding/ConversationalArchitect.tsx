import { useState } from 'react';
import { Send } from 'lucide-react';
import ConversationThread, { Message } from './ConversationThread';

interface ConversationalArchitectProps {
  goal: string;
  existingHabits?: Array<{name: string; isSafe: boolean}>;
  aiPersona?: string;
  onLogicComplete: (data: { milestone: string; action: string }) => void;
}

export default function ConversationalArchitect({ goal, existingHabits, aiPersona, onLogicComplete }: ConversationalArchitectProps) {
  // Personalize messages based on AI Persona
  const getPersonalizedGreeting = () => {
    const habitsContext = existingHabits && existingHabits.length > 0 
      ? ` I see you're already doing ${existingHabits.map(h => h.name).join(', ')} - that's a solid foundation.`
      : '';
    
    if (aiPersona === 'Drill Sergeant') {
      return `Listen up. We're breaking down "${goal}" into a battle plan. No fluff, just results.${habitsContext} First: what's your milestone?`;
    } else if (aiPersona === 'Hype Man') {
      return `Let's GO! We're about to build the roadmap to "${goal}" and it's going to be LEGENDARY!${habitsContext} First up: what's your milestone?`;
    } else if (aiPersona === 'Wise Mentor') {
      return `Let us reflect on "${goal}" and craft a wise pathway forward.${habitsContext} Tell me, what milestone would signal meaningful progress?`;
    }
    return `Alright, let's break down "${goal}" into a logical pathway.${habitsContext} First, I need to understand what milestone would prove you're making progress.`;
  };

  const getMilestoneExplanation = () => {
    if (aiPersona === 'Drill Sergeant') {
      return 'A milestone is a tactical checkpoint. Specific. Measurable. Trackable. Example: "2 clients at $400 each" or "$10K monthly sales." Got it?';
    } else if (aiPersona === 'Hype Man') {
      return 'A milestone is your PROOF OF PROGRESS! Something you can track and CELEBRATE! Like "2 clients at $400 each" or "$10K in monthly sales!" What\'s yours?';
    } else if (aiPersona === 'Wise Mentor') {
      return 'A milestone, young one, is a marker on your journey - concrete and measurable. Perhaps "securing 2 clients at $400 each" or "achieving $10K in monthly revenue." What feels right for you?';
    }
    return 'A milestone is a concrete checkpoint - something measurable you can track. For example: "Sign 2 clients at $400 each" or "Hit $10K in monthly sales."';
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: getPersonalizedGreeting(),
      sender: 'ai',
      timestamp: Date.now(),
    },
    {
      id: '2',
      message: getMilestoneExplanation(),
      sender: 'ai',
      timestamp: Date.now() + 100,
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

      // AI validates milestone with personalized response
      setTimeout(() => {
        const validation = aiPersona === 'Drill Sergeant' 
          ? `"${message}" - SOLID. Specific and measurable. Now: what's your daily action to get there?`
          : aiPersona === 'Hype Man'
          ? `"${message}" - YES! That's what I'm talking about! Now let's define the ACTION that makes it happen!`
          : aiPersona === 'Wise Mentor'
          ? `"${message}" - A worthy milestone. Now, what daily practice will guide you there?`
          : `"${message}" - Great! That's specific and measurable. Now I need to understand what daily action will get you there.`;
        
        addMessage(validation, 'ai');

        setTimeout(() => {
          const actionExplanation = aiPersona === 'Drill Sergeant'
            ? 'Your daily action is your discipline. Something you execute consistently. Examples: "5 client outreaches daily" or "3 content posts per week." What\'s yours?'
            : aiPersona === 'Hype Man'
            ? 'Your daily action is your SUPERPOWER! Something you do consistently to CRUSH IT! Like "Reach out to 5 potential clients daily" or "Post content 3x per week!" What\'s your move?'
            : aiPersona === 'Wise Mentor'
            ? 'A daily action is your practice - the ritual that builds mastery. Perhaps "reaching out to 5 clients daily" or "sharing your wisdom 3 times weekly." What calls to you?'
            : 'An action is something you can do consistently. For example: "Reach out to 5 potential clients daily" or "Post content 3 times per week."';
          
          addMessage(actionExplanation, 'ai');
          setStage('action');
        }, 1000);
      }, 500);
    } else {
      // AI validates action and completes with personalized summary
      setTimeout(() => {
        const summary = aiPersona === 'Drill Sergeant'
          ? `LOCKED IN. Here's your battle plan:\n\n"${message}" (execute daily) → "${milestone}" (tactical checkpoint) → "${goal}" (mission accomplished)\n\nThis is your operational roadmap. Follow it. No excuses.`
          : aiPersona === 'Hype Man'
          ? `YESSS! Here's your success formula:\n\n"${message}" (your daily grind) → "${milestone}" (PROOF you're winning) → "${goal}" (THE DREAM ACHIEVED!)\n\nThis is YOUR roadmap to greatness! Let's DO THIS!`
          : aiPersona === 'Wise Mentor'
          ? `Excellent. Your path is now clear:\n\n"${message}" (daily practice) → "${milestone}" (meaningful progress) → "${goal}" (your aspiration realized)\n\nThis is your journey. Walk it with intention and patience.`
          : `Perfect! Here's your logic chain:\n\n"${message}" (daily action) → "${milestone}" (milestone) → "${goal}" (goal)\n\nThis is your roadmap. Simple, measurable, achievable.`;
        
        addMessage(summary, 'ai');

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

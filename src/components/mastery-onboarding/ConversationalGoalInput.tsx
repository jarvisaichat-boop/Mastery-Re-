import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import ConversationThread from './ConversationThread';
import { useDialogueManager } from './DialogueManager';

interface ConversationalGoalInputProps {
  onGoalClarified: (goal: string, context: any) => void;
}

export default function ConversationalGoalInput({
  onGoalClarified,
}: ConversationalGoalInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [hasSubmittedInitial, setHasSubmittedInitial] = useState(false);
  const dialogue = useDialogueManager();

  // Show initial AI greeting
  useEffect(() => {
    if (dialogue.state.messages.length === 0) {
      dialogue.addMessage(
        "Let's talk about your goal. What's your north star - the one thing you want to achieve?",
        'ai'
      );
    }
  }, []);

  // Watch for clarified goal and trigger callback
  useEffect(() => {
    if (dialogue.state.context?.clarified && dialogue.state.context) {
      const goal = dialogue.state.context.specificMetric || dialogue.state.context.originalGoal;
      setTimeout(() => {
        onGoalClarified(goal, dialogue.state.context);
      }, 1500);
    }
  }, [dialogue.state.context?.clarified, dialogue.state.context, onGoalClarified]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');

    if (!hasSubmittedInitial) {
      // First submission - analyze the goal
      dialogue.addMessage(message, 'user');
      setHasSubmittedInitial(true);
      dialogue.processGoalInput(message);
      // Note: callback will be triggered by useEffect watching for clarified state
    } else {
      // Follow-up clarification
      dialogue.handleClarification(message);
      // Note: callback will be triggered by useEffect watching for clarified state
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AI Greeting Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Let's Define Your Goal</h2>
        <p className="text-lg text-gray-300">
          I need to understand exactly what you're working towards
        </p>
      </div>

      {/* Conversation Thread */}
      <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6 min-h-[300px] max-h-[400px] overflow-y-auto">
        <ConversationThread messages={dialogue.state.messages} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            dialogue.state.awaitingClarification
              ? 'Type your answer...'
              : 'e.g., 100K EOY, Launch my business, Get fit'
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
        Be as specific as you can. I'll ask questions if I need more clarity.
      </p>
    </div>
  );
}

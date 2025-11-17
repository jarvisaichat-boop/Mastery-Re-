import { Sparkles } from 'lucide-react';

interface AIFeedbackProps {
  message: string;
  type?: 'info' | 'insight' | 'warning' | 'success';
  isVisible?: boolean;
}

export default function AIFeedback({ message, type = 'insight', isVisible = true }: AIFeedbackProps) {
  if (!isVisible) return null;

  const colorClasses = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    insight: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    success: 'bg-green-500/10 border-green-500/30 text-green-300',
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[type]} animate-fadeIn mt-4`}>
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

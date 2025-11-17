import { ReflectionAnswer, getAnswerLabel, DAILY_REFLECTION_QUESTION } from './ReflectionCard';

interface ReflectionSummaryCardProps {
    answer: ReflectionAnswer;
    reasoning: string;
    onEdit: () => void;
}

export default function ReflectionSummaryCard({ answer, reasoning, onEdit }: ReflectionSummaryCardProps) {
    return (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-4">
            <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">✅</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Already Reflected Today!</h3>
                    <p className="text-sm text-gray-400">Come back tomorrow for your next reflection.</p>
                </div>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Your reflection:</p>
                <p className="text-white font-medium text-sm mb-3">"{DAILY_REFLECTION_QUESTION}"</p>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{answer.emoji}</span>
                    <div>
                        <p className="text-white font-bold text-sm">{getAnswerLabel(answer.value)}</p>
                        <p className="text-xs text-gray-400">{answer.percentage} Productivity</p>
                    </div>
                </div>
                {reasoning && (
                    <p className="text-xs text-gray-300 italic mt-2">"{reasoning}"</p>
                )}
            </div>

            <button
                onClick={onEdit}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all"
            >
                ✏️ Edit Reflection
            </button>
        </div>
    );
}

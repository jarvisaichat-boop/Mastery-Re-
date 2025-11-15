import { useState } from 'react';

interface GoalContractProps {
    data: {
        aspirations: string;
    };
    onNext: (goal: string) => void;
}

export default function GoalContract({ data, onNext }: GoalContractProps) {
    const [goal, setGoal] = useState('');
    const [validation, setValidation] = useState<'idle' | 'checking' | 'validated' | 'failed'>('idle');
    const [validationMessage, setValidationMessage] = useState('');
    const [signed, setSigned] = useState(false);

    const checkGoalAlignment = (userGoal: string, aspirations: string): boolean => {
        const goalLower = userGoal.toLowerCase();
        const aspirationsLower = aspirations.toLowerCase();
        
        const hasKeyword = (text: string, keywords: string[]): boolean => {
            return keywords.some(kw => {
                const regex = new RegExp(`\\b${kw}`, 'i');
                return regex.test(text);
            });
        };
        
        const businessKeywords = ['business', 'startup', 'launch', 'entrepreneur', 'company', 'revenue', 'financial', 'independent', 'founder', 'entrepreneurship', 'profit', 'income', 'sell', 'selling', 'customer', 'product', 'scale', 'scaling', 'client', 'sales', 'marketing', 'advertis', 'campaign', 'grow', 'growth', 'agency', 'freelance', 'service', 'brand', 'market', 'commerce', 'venture', 'monetize', 'earn', 'earning', 'acquisition', 'conversion', 'funnel', 'lead'];
        const fitnessKeywords = ['weight', 'lose', 'fit', 'fitness', 'exercise', 'gym', 'health', 'healthy', 'body', 'wellness', 'run', 'running', 'jog', 'jogging', 'workout', 'train', 'training', 'muscle', 'cardio', 'strength', 'athletic', 'pounds', 'lean', 'tone', 'physical', 'active', 'sport', 'yoga', 'diet', 'nutrition', 'eat', 'eating', 'food', 'meal', 'vegetable', 'fruit', 'hydrat', 'sleep', 'rest', 'recover', 'energy', 'stamina', 'endurance', 'strong', 'shape'];
        const learningKeywords = ['learn', 'learning', 'study', 'studying', 'code', 'coding', 'skill', 'master', 'mastering', 'course', 'degree', 'language', 'programming', 'develop', 'developing', 'practice', 'practicing', 'improve', 'improving', 'knowledge', 'education', 'certifi', 'training', 'teach', 'teaching', 'tutorial', 'reading', 'research', 'expertise'];
        const creativeKeywords = ['write', 'writing', 'art', 'artistic', 'create', 'creating', 'design', 'designing', 'music', 'musical', 'build', 'building', 'paint', 'painting', 'draw', 'drawing', 'craft', 'crafting', 'compose', 'composing', 'produce', 'producing', 'content', 'video', 'photo', 'photography', 'story', 'novel', 'blog', 'blogging', 'channel', 'portfolio', 'creative'];
        
        const hasBusinessGoal = hasKeyword(goalLower, businessKeywords);
        const hasBusinessAspiration = hasKeyword(aspirationsLower, businessKeywords);
        
        const hasFitnessGoal = hasKeyword(goalLower, fitnessKeywords);
        const hasFitnessAspiration = hasKeyword(aspirationsLower, fitnessKeywords);
        
        const hasLearningGoal = hasKeyword(goalLower, learningKeywords);
        const hasLearningAspiration = hasKeyword(aspirationsLower, learningKeywords);
        
        const hasCreativeGoal = hasKeyword(goalLower, creativeKeywords);
        const hasCreativeAspiration = hasKeyword(aspirationsLower, creativeKeywords);
        
        const goalHasAnyDomain = hasBusinessGoal || hasFitnessGoal || hasLearningGoal || hasCreativeGoal;
        const aspirationHasAnyDomain = hasBusinessAspiration || hasFitnessAspiration || hasLearningAspiration || hasCreativeAspiration;
        
        if (!goalHasAnyDomain && aspirationHasAnyDomain) {
            return false;
        }
        
        if (goalHasAnyDomain && !aspirationHasAnyDomain) {
            return true;
        }
        
        if (!goalHasAnyDomain && !aspirationHasAnyDomain) {
            return true;
        }
        
        return (
            (hasBusinessGoal && hasBusinessAspiration) ||
            (hasFitnessGoal && hasFitnessAspiration) ||
            (hasLearningGoal && hasLearningAspiration) ||
            (hasCreativeGoal && hasCreativeAspiration)
        );
    };

    const handleValidate = () => {
        if (!goal.trim()) return;
        
        setValidation('checking');
        setTimeout(() => {
            const isAligned = checkGoalAlignment(goal, data.aspirations);
            
            if (isAligned) {
                setValidation('validated');
                setValidationMessage(`"${goal}" aligns with your aspiration to ${data.aspirations.toLowerCase().split('.')[0]}.`);
            } else {
                setValidation('failed');
                setValidationMessage(`I don't see how "${goal}" connects to your aspiration. Your goal should directly support what you want to become. Try rephrasing it to align with your deeper aspirations.`);
            }
        }, 1500);
    };

    const handleSign = () => {
        setSigned(true);
        setTimeout(() => {
            onNext(goal);
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold">The Goal Contract</h2>
                <p className="text-xl text-gray-400">Focus on ONE major objective.</p>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                        What is your #1 priority right now?
                    </label>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => {
                            setGoal(e.target.value);
                            setValidation('idle');
                        }}
                        placeholder="Example: Launch my business, Lose 5kg, Learn to code..."
                        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        autoFocus
                    />
                </div>

                {validation === 'idle' && goal.trim() && (
                    <button
                        onClick={handleValidate}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                    >
                        Validate Goal
                    </button>
                )}

                {validation === 'checking' && (
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center gap-3">
                        <div className="flex gap-1">
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '0ms' }}>●</span>
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '150ms' }}>●</span>
                            <span className="animate-bounce text-blue-400" style={{ animationDelay: '300ms' }}>●</span>
                        </div>
                        <span className="text-gray-400">AI is checking if this aligns with your aspirations...</span>
                    </div>
                )}

                {validation === 'failed' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 font-semibold">✗ Goal doesn't align</p>
                            <p className="text-gray-400 mt-2">{validationMessage}</p>
                        </div>
                        <button
                            onClick={() => {
                                setValidation('idle');
                                setGoal('');
                            }}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {validation === 'validated' && !signed && (
                    <div className="space-y-6">
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-400 font-semibold">✓ Goal validated</p>
                            <p className="text-gray-400 mt-2">{validationMessage}</p>
                        </div>

                        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                            <h3 className="font-bold text-lg mb-4">The Commitment</h3>
                            <p className="text-gray-300 mb-6">
                                I commit to making "{goal}" my #1 priority for the next 7 days. 
                                I will build the habits necessary to make progress, and I will check in with accountability at the end of the week.
                            </p>
                            
                            <button
                                onClick={handleSign}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105"
                            >
                                I Commit
                            </button>
                        </div>
                    </div>
                )}

                {signed && (
                    <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                        <div className="text-4xl mb-3">✍️</div>
                        <p className="text-blue-400 font-bold text-xl">Contract Signed</p>
                        <p className="text-gray-400 mt-2">Generating your personalized plan...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

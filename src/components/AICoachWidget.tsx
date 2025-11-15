import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface AICoachWidgetProps {
    message: string;
    visible: boolean;
    onDismiss: () => void;
}

export default function AICoachWidget({ message, visible, onDismiss }: AICoachWidgetProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (visible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                onDismiss();
            }, 4000);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
        }
    }, [visible, onDismiss]);

    if (!visible) return null;

    return (
        <div 
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg shadow-2xl max-w-xs">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">{message}</p>
                    </div>
                    <button 
                        onClick={onDismiss}
                        className="text-white/70 hover:text-white text-xs"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

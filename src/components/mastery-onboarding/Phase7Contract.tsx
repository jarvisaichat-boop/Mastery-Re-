import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { logger } from '../../utils/logger';

interface Phase6ContractProps {
  onComplete: () => void;
}

export default function Phase6Contract({ onComplete }: Phase6ContractProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    if (isCompleting) return; // Prevent multiple clicks

    logger.log('🔵 Sign & Enter Dojo button clicked');
    setIsCompleting(true);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <CheckCircle className="w-16 h-16 text-blue-400" />
            </div>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">The Contract</h1>
            <p className="text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
              "I commit to this protocol. No excuses."
            </p>
          </div>

          {/* Commitment Box */}
          <div className="bg-gray-900/50 border-2 border-blue-500/50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">I understand this is a commitment, not just a checklist</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">I will show up daily, even when motivation fades</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">I will track my progress and reflect honestly</p>
              </div>
            </div>
          </div>

          {/* Action */}
          <div>
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className={`px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl transition-all shadow-lg ${isCompleting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-blue-500 hover:to-purple-500 transform hover:scale-105'
                }`}
            >
              {isCompleting ? 'Entering Dojo...' : 'Sign & Enter Dojo'}
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Saves entire profile to AsyncStorage and redirects to Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

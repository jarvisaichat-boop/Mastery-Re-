import React, { useState } from 'react';
import { Shield, ArrowRight, Zap, Bell, CheckCircle } from 'lucide-react';
import { MasteryProfile } from '../../types/onboarding';

interface Phase6EnforcerProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  profile: Partial<MasteryProfile>;
}

export default function Phase6Enforcer({ onComplete, profile }: Phase6EnforcerProps) {
  const [level, setLevel] = useState<'gentle' | 'tax' | 'camera'>('gentle');

  const options = [
    {
      id: 'gentle',
      title: 'Gentle',
      description: 'Standard notifications. No penalty for missing habits.',
      icon: Bell,
      color: 'text-blue-400',
      border: 'border-blue-400'
    },
    {
      id: 'tax',
      title: 'Snooze Tax',
      description: 'Pay $1.00 every time you snooze or miss your main habit.',
      icon: Zap,
      color: 'text-yellow-500',
      border: 'border-yellow-500'
    },
    {
      id: 'camera',
      title: 'Camera Proof',
      description: 'Must upload a photo to verify habit completion. No excuses.',
      icon: Shield,
      color: 'text-red-500',
      border: 'border-red-500'
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32 animate-fadeIn">
      {/* Header */}
       <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">The Enforcer</h2>
        <p className="text-xl text-gray-400">
          How strict should I be?
        </p>
      </div>

      <div className="grid gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setLevel(opt.id as any)}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left group ${
              level === opt.id 
                ? `${opt.border} bg-${opt.color.split('-')[1]}-500/10 shadow-lg shadow-${opt.color.split('-')[1]}-500/20` 
                : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <opt.icon className={`w-8 h-8 ${opt.color} flex-shrink-0 mt-1`} />
              <div>
                <h3 className={`text-xl font-bold mb-1 ${level === opt.id ? 'text-white' : 'text-gray-300'}`}>
                  {opt.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </div>
            {level === opt.id && (
              <div className="absolute top-6 right-6 text-white">
                <CheckCircle size={24} className={opt.color} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => onComplete({})} // Saving strictly local for now, or could save 'enforcementLevel' to profile
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            CONFIRM PROTOCOL <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

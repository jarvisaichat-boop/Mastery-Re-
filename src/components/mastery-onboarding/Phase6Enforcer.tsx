import React, { useState, useEffect, useRef } from 'react';
import { Shield, ArrowRight, Zap, Bell, CheckCircle, Users } from 'lucide-react';
import { MasteryProfile } from '../../types/onboarding';

interface Phase6EnforcerProps {
  onComplete: (data: Partial<MasteryProfile>) => void;
  profile: Partial<MasteryProfile>;
}

const INTEREST_KEY = 'mastery-dashboard-enforcer-interest';

function recordInterest(level: 'tax' | 'camera' | 'social') {
  try {
    const raw = localStorage.getItem(INTEREST_KEY);
    let counts: Record<string, number> = { tax: 0, camera: 0, social: 0 };
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') counts = { ...counts, ...parsed };
      } catch {
      }
    }
    counts[level] = (counts[level] ?? 0) + 1;
    localStorage.setItem(INTEREST_KEY, JSON.stringify(counts));
  } catch {
  }
}

export default function Phase6Enforcer({ onComplete, profile }: Phase6EnforcerProps) {
  const [level] = useState<'gentle'>('gentle');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(label: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(label);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const options = [
    {
      id: 'gentle' as const,
      title: 'Gentle',
      description: 'Standard notifications. No penalty for missing habits.',
      icon: Bell,
      color: 'text-blue-400',
      border: 'border-blue-400'
    },
    {
      id: 'tax' as const,
      title: 'Snooze Tax',
      description: 'Pay $1.00 every time you snooze or miss your main habit.',
      icon: Zap,
      color: 'text-yellow-500',
      border: 'border-yellow-500'
    },
    {
      id: 'camera' as const,
      title: 'Camera Proof',
      description: 'Must upload a photo to verify habit completion. No excuses.',
      icon: Shield,
      color: 'text-red-500',
      border: 'border-red-500'
    },
    {
      id: 'social' as const,
      title: 'Social Pressure',
      description: 'Post your progress to social space or have someone you know track your progress and get a notification when you are not completing your habit.',
      icon: Users,
      color: 'text-purple-400',
      border: 'border-purple-400'
    }
  ];

  function handleCardClick(id: typeof options[number]['id'], title: string) {
    if (id === 'gentle') return;
    recordInterest(id);
    showToast(title);
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32 animate-fadeIn">
      {/* Coming Soon Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="bg-gray-800 border border-yellow-500/40 rounded-2xl px-5 py-4 shadow-2xl shadow-black/60 flex items-center gap-3 max-w-xs">
          <span className="text-yellow-400 text-xl">🚧</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{toast} — Coming Soon</p>
            <p className="text-gray-400 text-xs mt-0.5">This mode isn't available yet. Stay tuned!</p>
          </div>
          <button
            onClick={() => { if (toastTimer.current) clearTimeout(toastTimer.current); setToast(null); }}
            className="text-gray-500 hover:text-gray-300 text-lg leading-none ml-1 flex-shrink-0"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

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
        {options.map((opt) => {
          const isSelected = level === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleCardClick(opt.id, opt.title)}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left group ${
                isSelected
                  ? `${opt.border} bg-${opt.color.split('-')[1]}-500/10 shadow-lg shadow-${opt.color.split('-')[1]}-500/20`
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <opt.icon className={`w-8 h-8 ${opt.color} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {opt.title}
                    </h3>
                    {opt.id !== 'gentle' && (
                      <span className="text-xs font-semibold text-yellow-500/80 border border-yellow-500/30 rounded-full px-2 py-0.5 mb-1">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-6 right-6 text-white">
                  <CheckCircle size={24} className={opt.color} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => onComplete({})}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            CONFIRM PROTOCOL <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

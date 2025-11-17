import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Users, Flame, Shield, AlertTriangle } from 'lucide-react';
import CoachFeedback from './CoachFeedback';

interface Phase2DeepDiscoveryProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase2DeepDiscovery({ profile, onComplete }: Phase2DeepDiscoveryProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    archetype: profile.archetype || '',
    mbti: profile.mbti || '',
    fuel: profile.fuel || '',
    saboteur: profile.saboteur || '',
    stakes: profile.stakes || '',
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 4) {
      setCurrentScreen(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 1) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.archetype !== '';
      case 2: return data.fuel !== '';
      case 3: return data.saboteur !== '';
      case 4: return data.stakes !== '';
      default: return false;
    }
  };

  const handleSaboteurSelect = (value: 'Perfectionist' | 'Distraction' | 'Exhaustion' | 'Time Scarcity') => {
    updateData({ saboteur: value });
    if (value === 'Perfectionist') {
      setFeedbackMessage("Perfectionism is fear. We'll fix this with 'Stupid Small' micro-habits.");
      setShowFeedback(true);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <ScreenContainer
            icon={<Users className="w-12 h-12 text-blue-400" />}
            goldenHeader="What is your Operating System?"
            header="The Archetype"
            subtext="Select the one that fits you best"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={data.mbti}
                onChange={(e) => updateData({ mbti: e.target.value })}
                placeholder="My MBTI is... (optional)"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <CardSelection
                options={[
                  { value: 'Commander' as const, label: 'The Commander', sub: 'Efficiency & Systems' },
                  { value: 'Monk' as const, label: 'The Monk', sub: 'Deep Focus' },
                  { value: 'Warrior' as const, label: 'The Warrior', sub: 'Grit & Discipline' },
                  { value: 'Explorer' as const, label: 'The Explorer', sub: 'Curiosity & Flow' },
                ]}
                selected={data.archetype || ''}
                onSelect={(value) => updateData({ archetype: value })}
              />
            </div>
          </ScreenContainer>
        );

      case 2:
        return (
          <ScreenContainer
            icon={<Flame className="w-12 h-12 text-orange-400" />}
            goldenHeader="What drives you?"
            header="The Fuel"
            subtext="Glory vs Fear"
          >
            <CardSelection
              options={[
                { value: 'Glory' as const, label: 'Glory', sub: 'Wins, streaks, achievement' },
                { value: 'Fear' as const, label: 'Fear', sub: 'Refusal to stagnate' },
              ]}
              selected={data.fuel || ''}
              onSelect={(value) => updateData({ fuel: value })}
            />
            <p className="text-xs text-gray-500 mt-4 text-center">
              This determines if AI is "Hype Man" (Glory) or "Drill Sergeant" (Fear)
            </p>
          </ScreenContainer>
        );

      case 3:
        return (
          <ScreenContainer
            icon={<Shield className="w-12 h-12 text-red-400" />}
            goldenHeader="Who is the enemy?"
            header="The Saboteur"
            subtext="What's your biggest habit killer?"
          >
            <CardSelection
              options={[
                { value: 'Perfectionist' as const, label: 'The Perfectionist', sub: 'Fear of starting' },
                { value: 'Distraction' as const, label: 'The Distraction', sub: 'Socials, scrolling' },
                { value: 'Exhaustion' as const, label: 'The Exhaustion', sub: 'Low energy' },
                { value: 'Time Scarcity' as const, label: 'The Time Scarcity', sub: 'Too busy' },
              ]}
              selected={data.saboteur || ''}
              onSelect={handleSaboteurSelect}
            />
          </ScreenContainer>
        );

      case 4:
        return (
          <div className="min-h-[70vh] bg-gradient-to-b from-red-950/30 to-gray-950 rounded-2xl p-8 border-2 border-red-900/50">
            <ScreenContainer
              icon={<AlertTriangle className="w-12 h-12 text-red-400" />}
              goldenHeader="Where are you in 1 year if nothing changes?"
              header="The Stakes (Heavy UI)"
              subtext="Be honest with yourself"
            >
              <CardSelection
                options={[
                  { value: 'Stagnant' as const, label: 'Stagnant', sub: 'Same place, no growth' },
                  { value: 'Regressing' as const, label: 'Regressing', sub: 'Getting worse' },
                  { value: 'No-Think' as const, label: 'Don\'t want to think about it', sub: 'Too painful' },
                ]}
                selected={data.stakes || ''}
                onSelect={(value) => updateData({ stakes: value })}
              />
            </ScreenContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Phase 2: Deep Discovery</span>
            <span>Screen {currentScreen} of 4</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 4) * 100}%` }}
            />
          </div>
        </div>

        {renderScreen()}

        <div className="flex gap-3 mt-8">
          <button
            onClick={prevScreen}
            disabled={currentScreen === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentScreen === 1
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Back
          </button>
          <button
            onClick={nextScreen}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-purple-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 4 ? 'Complete Phase 2' : 'Next'}
          </button>
        </div>
      </div>

      <CoachFeedback 
        message={feedbackMessage}
        isVisible={showFeedback}
        onDismiss={() => setShowFeedback(false)}
      />
    </div>
  );
}

interface ScreenContainerProps {
  icon?: React.ReactNode;
  goldenHeader?: string;
  header: string;
  subtext: string;
  children: React.ReactNode;
}

function ScreenContainer({ icon, goldenHeader, header, subtext, children }: ScreenContainerProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        {goldenHeader && (
          <p className="text-sm text-yellow-500 mb-2 uppercase tracking-wider">{goldenHeader}</p>
        )}
        <h2 className="text-2xl font-bold text-white mb-2">{header}</h2>
        <p className="text-gray-400">{subtext}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

interface CardSelectionProps {
  options: Array<{ value: string; label: string; sub: string }>;
  selected: string;
  onSelect: (value: any) => void;
}

function CardSelection({ options, selected, onSelect }: CardSelectionProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`p-4 rounded-xl border-2 transition-all text-center ${
            selected === option.value
              ? 'bg-purple-500/20 border-purple-500'
              : 'bg-gray-900 border-gray-700 hover:border-gray-600'
          }`}
        >
          <p className="font-bold text-white mb-1">{option.label}</p>
          <p className="text-sm text-gray-400">{option.sub}</p>
        </button>
      ))}
    </div>
  );
}

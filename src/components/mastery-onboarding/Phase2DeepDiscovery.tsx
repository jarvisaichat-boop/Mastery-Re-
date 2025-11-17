import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Users, Flame, Shield, AlertTriangle } from 'lucide-react';

interface Phase2DeepDiscoveryProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase2DeepDiscovery({ profile, onComplete }: Phase2DeepDiscoveryProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    archetype: profile.archetype || '',
    fuel: profile.fuel || '',
    saboteur: profile.saboteur || '',
    stakes: profile.stakes || '',
  });

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 5) {
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
      case 1: return true; // Primer screen - always can proceed
      case 2: return data.archetype !== '';
      case 3: return data.fuel !== '';
      case 4: return data.saboteur !== '';
      case 5: return data.stakes !== '';
      default: return false;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <ScreenContainer header="Discipline is an Ecosystem" subtext="Let's align your Personality, Environment, and Stressors.">
            <div className="text-center space-y-6">
              <p className="text-gray-300">This helps me calibrate your AI coach persona</p>
            </div>
          </ScreenContainer>
        );

      case 2:
        return (
          <ScreenContainer
            icon={<Users className="w-12 h-12 text-blue-400" />}
            header="The Archetype (MBTI-Lite)"
            subtext="Calibrate your model. Which Archetype fits you?"
          >
            <CardSelection
              options={[
                { value: 'Commander' as const, label: 'The Commander', sub: 'Efficiency' },
                { value: 'Monk' as const, label: 'The Monk', sub: 'Focus' },
                { value: 'Warrior' as const, label: 'The Warrior', sub: 'Grit' },
                { value: 'Explorer' as const, label: 'The Explorer', sub: 'Flow' },
              ]}
              selected={data.archetype || ''}
              onSelect={(value) => updateData({ archetype: value })}
            />
          </ScreenContainer>
        );

      case 3:
        return (
          <ScreenContainer
            icon={<Flame className="w-12 h-12 text-orange-400" />}
            header="The Fuel (Reward Sensitivity)"
            subtext="What drives you harder?"
          >
            <CardSelection
              options={[
                { value: 'Glory' as const, label: 'The Glory', sub: 'Winning/Streaks' },
                { value: 'Fear' as const, label: 'The Fear', sub: 'Refusal to Stagnate' },
              ]}
              selected={data.fuel || ''}
              onSelect={(value) => updateData({ fuel: value })}
            />
            <p className="text-xs text-gray-500 mt-4 text-center">
              This determines if AI Persona is "Hype Man" or "Drill Sergeant"
            </p>
          </ScreenContainer>
        );

      case 4:
        return (
          <ScreenContainer
            icon={<Shield className="w-12 h-12 text-red-400" />}
            header="The Saboteur (Fogg Behavior Model)"
            subtext="Who is the enemy?"
          >
            <CardSelection
              options={[
                { value: 'Perfectionist' as const, label: 'The Perfectionist', sub: 'Fear of starting' },
                { value: 'Distraction' as const, label: 'The Distraction', sub: 'Socials' },
                { value: 'Exhaustion' as const, label: 'The Exhaustion', sub: 'Low Energy' },
                { value: 'Time Scarcity' as const, label: 'The Time Scarcity', sub: 'Too busy' },
              ]}
              selected={data.saboteur || ''}
              onSelect={(value) => updateData({ saboteur: value })}
            />
          </ScreenContainer>
        );

      case 5:
        return (
          <ScreenContainer
            icon={<AlertTriangle className="w-12 h-12 text-yellow-400" />}
            header="The Stakes (Loss Aversion)"
            subtext="If you don't change today, where are you in 1 year?"
          >
            <CardSelection
              options={[
                { value: 'Stagnant' as const, label: 'Stagnant', sub: '' },
                { value: 'Regressing' as const, label: 'Regressing', sub: '' },
                { value: 'No-Think' as const, label: 'Don\'t want to think about it', sub: '' },
              ]}
              selected={data.stakes || ''}
              onSelect={(value) => updateData({ stakes: value })}
            />
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <p className="text-red-300 text-sm text-center font-medium">
                ⚠️ Heavy Question. Red accent. Darker background.
              </p>
            </div>
          </ScreenContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Phase 2: Deep Discovery</span>
            <span>Screen {currentScreen} of 5</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Screen Content */}
        {renderScreen()}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentScreen > 1 && (
            <button
              onClick={prevScreen}
              className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 rounded-xl font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={nextScreen}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-purple-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 1 ? 'Analyze Ecosystem' : currentScreen === 5 ? 'Complete Phase 2' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScreenContainerProps {
  icon?: React.ReactNode;
  header: string;
  subtext: string;
  children: React.ReactNode;
}

function ScreenContainer({ icon, header, subtext, children }: ScreenContainerProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
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
              ? 'bg-blue-500/20 border-blue-500'
              : 'bg-gray-900 border-gray-700 hover:border-gray-600'
          }`}
        >
          <p className="font-bold text-white mb-1">{option.label}</p>
          {option.sub && <p className="text-xs text-gray-400">{option.sub}</p>}
        </button>
      ))}
    </div>
  );
}

import { MasteryProfile } from '../../types/onboarding';
import { Sparkles } from 'lucide-react';

interface Phase4SynthesisProps {
  profile: MasteryProfile;
  onComplete: (persona: string) => void;
}

export default function Phase4Synthesis({ profile, onComplete }: Phase4SynthesisProps) {
  const generateSynthesis = (): string => {
    const name = profile.name || 'Friend';
    const archetype = profile.archetype || 'Explorer';
    const fuel = profile.fuel || 'Glory';
    const saboteur = profile.saboteur || 'Distraction';
    const weekendStructure = profile.weekendStructure || 'Total Rest';
    const goldenHour = profile.goldenHour || 'Morning';

    return `${name}, you are a **${archetype}** driven by **${fuel}**. However, **${saboteur}** is your risk factor. Your weekends are **${weekendStructure}**, so we need to protect that time. Use **${goldenHour}** to build your core habit.`;
  };

  const determinePersona = (): string => {
    return profile.fuel === 'Glory' ? 'Hype Man' : 'Drill Sergeant';
  };

  const persona = determinePersona();
  const synthesis = generateSynthesis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-purple-500/20 rounded-full">
              <Sparkles className="w-16 h-16 text-purple-400" />
            </div>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Synthesizing Protocol...</h1>
            <p className="text-gray-400">Your AI coach is being calibrated</p>
          </div>

          {/* Profile Display */}
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <ProfileRow label="Name" value={profile.name} />
              <ProfileRow label="Archetype" value={profile.archetype} />
              <ProfileRow label="Fuel" value={profile.fuel} />
              <ProfileRow label="Saboteur" value={profile.saboteur} />
              <ProfileRow label="North Star" value={profile.northStar} />
              <ProfileRow label="Golden Hour" value={profile.goldenHour} />
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-300 leading-relaxed">{synthesis}</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 rounded-xl">
              <p className="text-white font-bold text-center">
                AI Persona: <span className="text-purple-400">{persona}</span>
              </p>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => onComplete(persona)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold rounded-xl transition-all"
          >
            Generate Protocol
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}:</span>
      <span className="text-white font-medium">{value || '—'}</span>
    </div>
  );
}

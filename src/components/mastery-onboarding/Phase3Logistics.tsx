import { useState } from 'react';
import { MasteryProfile } from '../../types/onboarding';
import { Clock, Calendar, Sun } from 'lucide-react';

interface Phase3LogisticsProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

export default function Phase3Logistics({ profile, onComplete }: Phase3LogisticsProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    wakeTime: profile.wakeTime || '',
    sleepTime: profile.sleepTime || '',
    weekdayStructure: profile.weekdayStructure || '',
    weekendStructure: profile.weekendStructure || '',
    goldenHour: profile.goldenHour || '',
  });

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 3) {
      setCurrentScreen(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevScreen = () => {
    setCurrentScreen(prev => prev - 1);
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.wakeTime !== '' && data.sleepTime !== '';
      case 2: return data.weekdayStructure !== '' && data.weekendStructure !== '';
      case 3: return data.goldenHour !== '';
      default: return false;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <ScreenContainer
            icon={<Clock className="w-12 h-12 text-cyan-400" />}
            header="Bio-Clock (Wake/Sleep Times)"
            subtext="Discipline requires energy management"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Wake Up Time:</label>
                <input
                  type="time"
                  value={data.wakeTime}
                  onChange={(e) => updateData({ wakeTime: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Sleep Time:</label>
                <input
                  type="time"
                  value={data.sleepTime}
                  onChange={(e) => updateData({ sleepTime: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              {data.wakeTime && data.sleepTime && (
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-sm text-yellow-300">
                  {(() => {
                    const wake = parseInt(data.wakeTime.split(':')[0]);
                    const sleep = parseInt(data.sleepTime.split(':')[0]);
                    const sleepHours = sleep > wake ? sleep - wake : 24 - wake + sleep;
                    return sleepHours < 6 ? '⚠️ Low Battery Warning: Sleep < 6hrs' : '✓ Good energy window';
                  })()}
                </div>
              )}
            </div>
          </ScreenContainer>
        );

      case 2:
        return (
          <ScreenContainer
            icon={<Calendar className="w-12 h-12 text-purple-400" />}
            header="The Structure Scan"
            subtext="How structured is your life?"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Weekday:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Rigid 9-5', 'Flexible', 'Chaos'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ weekdayStructure: option })}
                      className={`py-2 px-3 text-sm rounded-lg border-2 transition-all ${
                        data.weekdayStructure === option
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Weekend:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Structured', 'Total Rest', 'Chaos'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ weekendStructure: option })}
                      className={`py-2 px-3 text-sm rounded-lg border-2 transition-all ${
                        data.weekendStructure === option
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Essential for avoiding weekend burnout
              </p>
            </div>
          </ScreenContainer>
        );

      case 3:
        return (
          <ScreenContainer
            icon={<Sun className="w-12 h-12 text-yellow-400" />}
            header="The Golden Hour"
            subtext="When do you have 30 minutes of pure freedom?"
          >
            <div className="grid grid-cols-2 gap-3">
              {(['Morning', 'Lunch', 'After Work', 'Late Night'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => updateData({ goldenHour: option })}
                  className={`py-4 px-4 rounded-xl border-2 transition-all ${
                    data.goldenHour === option
                      ? 'bg-yellow-500/20 border-yellow-500'
                      : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <p className="font-bold text-white">{option}</p>
                </button>
              ))}
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
            <span>Phase 3: Logistics</span>
            <span>Screen {currentScreen} of 3</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Screen Content */}
        {renderScreen()}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={prevScreen}
            className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 rounded-xl font-medium"
          >
            Back
          </button>
          <button
            onClick={nextScreen}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 3 ? 'Complete Phase 3' : 'Next'}
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

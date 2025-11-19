import { useState, useEffect } from 'react';
import { MasteryProfile, OnboardingPhase } from '../types/onboarding';
import { Habit } from '../types';
import { Home, Target } from 'lucide-react';
import Phase0Manifesto from './mastery-onboarding/Phase0Manifesto';
import Phase1ContextBaseline from './mastery-onboarding/Phase1ContextBaseline';
import Phase2DeepDiscovery from './mastery-onboarding/Phase2DeepDiscovery';
import Phase3Logistics from './mastery-onboarding/Phase3Logistics';
import Phase4Architect from './mastery-onboarding/Phase4Architect';
import Phase5Synthesis from './mastery-onboarding/Phase5Synthesis';
import Phase6Negotiation from './mastery-onboarding/Phase6Negotiation';
import Phase7Contract from './mastery-onboarding/Phase7Contract';

const STORAGE_KEY = 'mastery-onboarding-profile';
const PHASE_STORAGE_KEY = 'mastery-onboarding-phase';

interface MasteryOnboardingProps {
  onComplete: (habits: Omit<Habit, 'id' | 'createdAt'>[], goal: string, aspirations: string, profile: MasteryProfile) => void;
  isPreview?: boolean;
  onExitPreview?: () => void;
  initialPhase?: number | null;
  initialProfile?: Partial<MasteryProfile>;
}

export default function MasteryOnboarding({ onComplete, isPreview = false, onExitPreview, initialPhase, initialProfile }: MasteryOnboardingProps) {
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>(() => {
    // If initialPhase is provided (from quick access buttons), use it
    if (initialPhase !== null && initialPhase !== undefined) {
      return initialPhase as OnboardingPhase;
    }
    // Otherwise load saved phase on mount
    try {
      const saved = localStorage.getItem(PHASE_STORAGE_KEY);
      return saved ? parseInt(saved, 10) as OnboardingPhase : 0;
    } catch {
      return 0;
    }
  });
  const [profile, setProfile] = useState<Partial<MasteryProfile>>(() => {
    // If initialProfile is provided, use it (for testing/preview)
    if (initialProfile) {
      return initialProfile;
    }
    // Load saved profile on mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Auto-save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save onboarding progress', e);
    }
  }, [profile]);

  // Auto-save current phase to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PHASE_STORAGE_KEY, currentPhase.toString());
    } catch (e) {
      console.error('Failed to save onboarding phase', e);
    }
  }, [currentPhase]);

  const updateProfile = (updates: Partial<MasteryProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const nextPhase = () => {
    setCurrentPhase(prev => Math.min(prev + 1, 7) as OnboardingPhase);
  };

  const handlePhase0Complete = () => {
    nextPhase();
  };

  const handlePhase1Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    nextPhase();
  };

  const handlePhase2Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    nextPhase();
  };

  const handlePhase3Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    // After Phase 3, jump to Phase 5 (Synthesis) instead of Phase 4
    setCurrentPhase(5);
  };

  const handlePhase4Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    // After Phase 4 (Architect), go to Phase 6
    setCurrentPhase(6);
  };

  const handlePhase5Complete = (persona: string) => {
    updateProfile({ aiPersona: persona });
    // After Phase 5 (Synthesis), go to Phase 4 (Architect)
    setCurrentPhase(4);
  };

  const handlePhase6Complete = (habitData: Partial<MasteryProfile>) => {
    updateProfile(habitData);
    nextPhase();
  };

  const handlePhase7Complete = () => {
    console.log('🚀 Phase 7 Complete called');
    console.log('📊 Current profile:', profile);
    
    try {
      const completedProfile: MasteryProfile = {
        ...profile,
        committed: true,
        completedAt: Date.now(),
      } as MasteryProfile;

      console.log('✅ Completed profile:', completedProfile);

      // Create habits from the onboarding
      const habits: Omit<Habit, 'id' | 'createdAt'>[] = [];

      // Add the non-negotiable water habit
      habits.push({
        name: 'Drink 1 Glass of Water',
        description: 'The easy win - hydration for clarity',
        color: 'blue',
        type: 'Anchor Habit',
        categories: [{ main: 'Health', sub: 'Hydration' }],
        frequencyType: 'Everyday',
        selectedDays: [],
        timesPerPeriod: 1,
        periodUnit: 'Day',
        repeatDays: 1,
        completed: {},
        order: 0,
      });

      console.log('💧 Water habit added');

      // Add the proposed/negotiated habit if accepted
      if (completedProfile.acceptedHabit && completedProfile.proposedHabit) {
        console.log('🎯 Adding proposed habit:', completedProfile.proposedHabit);
        habits.push({
          name: completedProfile.proposedHabit.name,
          description: completedProfile.proposedHabit.description,
          color: 'purple',
          type: 'Life Goal Habit',
          categories: [{ main: 'Personal Growth', sub: 'Core Habit' }],
          frequencyType: 'Everyday',
          selectedDays: [],
          timesPerPeriod: 1,
          periodUnit: 'Day',
          repeatDays: 1,
          completed: {},
          order: 1,
        });
      } else {
        console.log('⚠️ Proposed habit NOT added. acceptedHabit:', completedProfile.acceptedHabit, 'proposedHabit:', completedProfile.proposedHabit);
      }

      console.log('📝 Total habits to create:', habits.length);

      // Pass data to parent FIRST before clearing storage
      console.log('🎉 Calling onComplete with:', {
        habitsCount: habits.length,
        goal: completedProfile.northStar || 'My Mastery Journey',
        deepDive: completedProfile.deepDive || '',
      });
      
      onComplete(
        habits,
        completedProfile.northStar || 'My Mastery Journey',
        completedProfile.deepDive || '',
        completedProfile
      );
      
      console.log('✨ onComplete called successfully');

      // NOTE: Don't clear localStorage here - let App.tsx handle cleanup
      // Clearing here causes React re-render issues
    } catch (error) {
      console.error('❌ Error in handlePhase7Complete:', error);
      alert(`Error completing onboarding: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 0:
        return <Phase0Manifesto onComplete={handlePhase0Complete} />;
      case 1:
        return <Phase1ContextBaseline profile={profile} onComplete={handlePhase1Complete} />;
      case 2:
        return <Phase2DeepDiscovery profile={profile} onComplete={handlePhase2Complete} />;
      case 3:
        return <Phase3Logistics profile={profile} onComplete={handlePhase3Complete} />;
      case 4:
        return <Phase4Architect profile={profile} onComplete={handlePhase4Complete} />;
      case 5:
        return <Phase5Synthesis profile={profile as MasteryProfile} onComplete={handlePhase5Complete} />;
      case 6:
        return <Phase6Negotiation profile={profile as MasteryProfile} onComplete={handlePhase6Complete} />;
      case 7:
        return <Phase7Contract onComplete={handlePhase7Complete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Exit Preview Button - Only show when in preview mode */}
      {isPreview && onExitPreview && (
        <button
          onClick={onExitPreview}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          Exit to Dashboard
        </button>
      )}
      
      {/* Quick Access Buttons - Jump to Phase 0 or Phase 4 */}
      {!isPreview && (
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <button
            onClick={() => setCurrentPhase(0)}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg border border-gray-700 transition-colors"
            title="Jump to Start (Phase 0 - Manifesto)"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPhase(4)}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg border border-gray-700 transition-colors"
            title="Jump to Phase 4 (Logic Tree)"
          >
            <Target className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {renderPhase()}
    </div>
  );
}

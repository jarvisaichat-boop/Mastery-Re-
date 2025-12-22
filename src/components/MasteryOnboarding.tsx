import { logger } from "../utils/logger";
import { useState, useEffect } from 'react';
import { MasteryProfile, OnboardingPhase } from '../types/onboarding';
import { Habit } from '../types';
import { Home, Target } from 'lucide-react';
import Phase0Manifesto from './mastery-onboarding/Phase0Manifesto';
import Phase1ContextBaseline from './mastery-onboarding/Phase1ContextBaseline';

// Phase 3, 4, 5, 6 old components replaced by new imports below
import Phase7Contract from './mastery-onboarding/Phase7Contract';

import Phase3CoreValues from './mastery-onboarding/Phase3CoreValues';
import Phase4Path from './mastery-onboarding/Phase4Path';
import Phase5Schedule from './mastery-onboarding/Phase5Schedule';
import Phase6Enforcer from './mastery-onboarding/Phase6Enforcer';

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

  const handlePhase7Complete = () => {
    logger.log('🚀 Phase 7 Complete called');
    logger.log('📊 Current profile:', profile);
    
    try {
      const completedProfile: MasteryProfile = {
        ...profile,
        committed: true,
        completedAt: Date.now(),
      } as MasteryProfile;

      logger.log('✅ Completed profile:', completedProfile);

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

      logger.log('💧 Water habit added');

      // Add the proposed/negotiated habit if accepted
      if (completedProfile.acceptedHabit && completedProfile.proposedHabit) {
        logger.log('🎯 Adding proposed habit:', completedProfile.proposedHabit);
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
        logger.log('⚠️ Proposed habit NOT added. acceptedHabit:', completedProfile.acceptedHabit, 'proposedHabit:', completedProfile.proposedHabit);
      }

      logger.log('📝 Total habits to create:', habits.length);

      // Pass data to parent FIRST before clearing storage
      logger.log('🎉 Calling onComplete with:', {
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
      
      logger.log('✨ onComplete called successfully');

      // NOTE: Don't clear localStorage here - let App.tsx handle cleanup
      // Clearing here causes React re-render issues
    } catch (error) {
      console.error('❌ Error in handlePhase7Complete:', error);
      alert(`Error completing onboarding: ${error instanceof Error ? error.message : String(error)}`);
    }
  };



  // ... (existing code top) ...

  // Handlers for new phases
  const handlePhase3Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    nextPhase();
  };

  const handlePhase4Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    nextPhase();
  };

  const handlePhase5Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    nextPhase();
  };

  const handlePhase6Complete = (data: Partial<MasteryProfile>) => {
    updateProfile(data);
    nextPhase();
  };

  // ... (existing code mid) ...

  const renderPhase = () => {
    switch (currentPhase) {
      case 0:
        return <Phase0Manifesto onComplete={handlePhase0Complete} />;
      case 1:
        return <Phase1ContextBaseline profile={profile} onComplete={handlePhase1Complete} />;
      case 2:
        return <Phase3CoreValues onComplete={handlePhase2Complete} />;
      case 3:
        return <Phase4Path profile={profile} onComplete={handlePhase3Complete} />;
      case 4:
        return <Phase5Schedule onComplete={handlePhase4Complete} />;
      case 5:
        return <Phase6Enforcer profile={profile} onComplete={handlePhase5Complete} />;
      case 6:
        // Skip phase 6 if needed or just use Enforcer again/placeholder -> Actually we should just jump to 7?
        // If we want Enforcer to be Phase 5, then handlePhase5Complete calls nextPhase -> 6.
        // If 6 is empty/skipped, we should auto-forward or just render Contract at 6?
        // Let's just map Enforcer to 5, and if we are at 6, go to 7 immediately?
        // Or better: Let's make Enforcer Phase 5, and then next phase is 7 (Contract).
        // But nextPhase() increments by 1. 5->6.
        // So at 6 we need something.
        // Let's Put Contract at 6 and 7? Or just auto-skip 6?
        // Simplest: Enforcer is Phase 5. Contract is Phase 6.
        // But existing code uses 7 phases (0-7).
        // Let's make Phase 6 a "Pre-Launch" or just Contract part 1?
        // Valid Fix: Change Phase 7 Contract to be Phase 6?
        // Or just render Contract at 6 too?
        return <Phase7Contract onComplete={handlePhase7Complete} />; 
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

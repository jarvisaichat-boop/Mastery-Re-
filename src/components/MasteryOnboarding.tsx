import { useState, useEffect } from 'react';
import { MasteryProfile, OnboardingPhase } from '../types/onboarding';
import { Habit } from '../types';
import Phase0Manifesto from './mastery-onboarding/Phase0Manifesto';
import Phase1ContextBaseline from './mastery-onboarding/Phase1ContextBaseline';
import Phase2DeepDiscovery from './mastery-onboarding/Phase2DeepDiscovery';
import Phase3Logistics from './mastery-onboarding/Phase3Logistics';
import Phase4Synthesis from './mastery-onboarding/Phase4Synthesis';
import Phase5Negotiation from './mastery-onboarding/Phase5Negotiation';
import Phase6Contract from './mastery-onboarding/Phase6Contract';

const STORAGE_KEY = 'mastery-onboarding-profile';
const PHASE_STORAGE_KEY = 'mastery-onboarding-phase';

interface MasteryOnboardingProps {
  onComplete: (habits: Omit<Habit, 'id' | 'createdAt'>[], goal: string, aspirations: string, profile: MasteryProfile) => void;
}

export default function MasteryOnboarding({ onComplete }: MasteryOnboardingProps) {
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>(() => {
    // Load saved phase on mount
    try {
      const saved = localStorage.getItem(PHASE_STORAGE_KEY);
      return saved ? parseInt(saved, 10) as OnboardingPhase : 0;
    } catch {
      return 0;
    }
  });
  const [profile, setProfile] = useState<Partial<MasteryProfile>>(() => {
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
    setCurrentPhase(prev => Math.min(prev + 1, 6) as OnboardingPhase);
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
    nextPhase();
  };

  const handlePhase4Complete = (persona: string) => {
    updateProfile({ aiPersona: persona });
    nextPhase();
  };

  const handlePhase5Complete = (habitData: Partial<MasteryProfile>) => {
    updateProfile(habitData);
    nextPhase();
  };

  const handlePhase6Complete = () => {
    const completedProfile: MasteryProfile = {
      ...profile,
      committed: true,
      completedAt: Date.now(),
    } as MasteryProfile;

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

    // Add the proposed/negotiated habit if accepted
    if (completedProfile.acceptedHabit && completedProfile.proposedHabit) {
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
    }

    // Clear onboarding data from storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHASE_STORAGE_KEY);

    // Pass data to parent
    onComplete(
      habits,
      completedProfile.northStar || 'My Mastery Journey',
      completedProfile.deepDive || '',
      completedProfile
    );
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
        return <Phase4Synthesis profile={profile as MasteryProfile} onComplete={handlePhase4Complete} />;
      case 5:
        return <Phase5Negotiation profile={profile as MasteryProfile} onComplete={handlePhase5Complete} />;
      case 6:
        return <Phase6Contract onComplete={handlePhase6Complete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {renderPhase()}
    </div>
  );
}

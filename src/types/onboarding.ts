// Comprehensive Onboarding Profile Types

export interface MasteryProfile {
  // Phase 1: Context & Baseline
  context: string;
  mentalState: 'SPARK' | 'STUCK' | 'CURIOUS' | 'GOAL' | '';
  name: string;
  age: number | string; // New: Required for AI calibration
  location: string;
  occupation: string;
  interests: string;

  // Phase 1: Action OS Updates
  goals: string[]; // Multi-select goals
  baselineStats: {
    motivation: number;
    discipline: number;
    consistency: number;
    clarity: number;
    satisfaction: number;
  };
  obstacles: Array<{
    name: string;
    category: 'digital' | 'mental' | 'environmental';
    impact: number;
  }>;

  // Phase 2: Deep Discovery (Psychology)
  archetype: 'Commander' | 'Monk' | 'Warrior' | 'Explorer' | '';
  mbti: string;
  fuel: 'Glory' | 'Fear' | '';
  saboteur: 'Perfectionist' | 'Distraction' | 'Exhaustion' | 'Time Scarcity' | '';
  stakes: 'Stagnant' | 'Regressing' | 'No-Think' | '';
  
  // Phase 3: Logistics (Time Audit)
  wakeTime: string;
  sleepTime: string;
  weekdayStructure: 'Rigid 9-5' | 'Flexible' | 'Chaos' | '';
  weekendStructure: 'Structured' | 'Total Rest' | 'Chaos' | '';
  goldenHour: 'Morning' | 'Lunch' | 'After Work' | 'Late Night' | '';
  
  // Phase 4: The Architect (Logic Tree)
  specificMetric: string;
  logicTreeRoot: string;
  logicTreeBranch: string;
  logicTreeLeaf: string;
  agreedToLogic: boolean;
  canEnvisionPath: boolean;
  
  // Phase 5: Synthesis
  aiPersona: string; // "Hype Man" or "Drill Sergeant"
  
  // Phase 6: Enforcer
  enforcementTier: 'gentle' | 'standard' | 'nuclear';

  // Phase 6: Negotiation (Legacy / kept for compatibility)
  proposedHabit: {
    name: string;
    description: string;
    duration: number; // in minutes
    difficulty: 'challenging' | 'moderate';
  } | null;
  acceptedHabit: boolean;
  finalHabitDuration: number;
  
  // Phase 7: Contract
  committed: boolean;
  completedAt: number;
}

export type OnboardingPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OnboardingState {
  currentPhase: OnboardingPhase;
  currentScreen: number;
  profile: Partial<MasteryProfile>;
  canResume: boolean;
}

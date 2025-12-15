export interface CoreValues {
  priority: string;
  why: string;
  purpose: string;
  motto: string;
  values: string[];
}

export interface GrandVision {
  feel: string;
  how: string;
  what: string;
}

export interface VisionPath {
  grandVision: GrandVision;
  // Habits are derived from the main Habit[] state, so we don't store them here
  // But we might want to store specific "Projects" or "Goals" text if they aren't habits
  currentProject: string;
  quarterlyGoals: string[];
}

export interface DailySchedule {
  gmRoutine: string[];
  gdRoutine: string[];
  gnRoutine: string[];
  busyDayPlan: string;
}

export interface VisionBoardData {
  coreValues: CoreValues;
  path: VisionPath;
  schedule: DailySchedule;
}

export interface VisionBoardContextType {
  data: VisionBoardData;
  updateCoreValues: (updates: Partial<CoreValues>) => void;
  updatePath: (updates: Partial<VisionPath>) => void;
  updateGrandVision: (updates: Partial<GrandVision>) => void;
  updateSchedule: (updates: Partial<DailySchedule>) => void;
}

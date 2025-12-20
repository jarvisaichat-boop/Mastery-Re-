export interface PersonalValue {
  title: string;
  description: string;
}

export interface CoreValues {
  priority: string;
  why: string;
  purpose: string;
  motto: string;
  values: PersonalValue[];
}

export interface VisionItem {
  text: string;
  hidden: boolean;
}

export interface VisionPath {
  vision: string;
  // Habits are derived from the main Habit[] state, so we don't store them here
  // But we might want to store specific "Projects" or "Goals" text if they aren't habits
  projects: VisionItem[];
  quarterlyGoals: VisionItem[];
}

export interface DailySchedule {
  gmRoutine: string[];
  gdRoutine: string[];
  gnRoutine: string[];
  busyDayPlan: string;
}

export interface CustomEntry {
  title: string;
  items: string[];
}

export interface CustomSection {
  enabled: boolean;
  entries: CustomEntry[];
  images: string[];
}

export interface VisionBoardData {
  coreValues: CoreValues;
  path: VisionPath;
  schedule: DailySchedule;
  custom: CustomSection;
}

export interface VisionBoardContextType {
  data: VisionBoardData;
  updateCoreValues: (updates: Partial<CoreValues>) => void;
  updatePath: (updates: Partial<VisionPath>) => void;
  updateSchedule: (updates: Partial<DailySchedule>) => void;
  updateCustom: (updates: Partial<CustomSection>) => void;
}

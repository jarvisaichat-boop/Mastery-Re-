export interface PersonalValue {
  title: string;
  description: string;
  hidden: boolean;
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

export interface RoutineItem {
  text: string;
  hidden: boolean;
}

export interface TimeBlock {
  time: string;
  label: string;
  color: string;
  hidden: boolean;
}

export interface VisionPath {
  vision: string;
  projects: VisionItem[];
  quarterlyGoals: VisionItem[];
}

export interface DailySchedule {
  timeline: TimeBlock[];
  gmRoutine: RoutineItem[];
  gdRoutine: RoutineItem[];
  gnRoutine: RoutineItem[];
  busyDayPlan: string;
}

export interface CustomEntry {
  title: string;
  items: VisionItem[];
  hidden: boolean;
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

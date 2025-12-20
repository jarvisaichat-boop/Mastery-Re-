import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionBoardData, VisionBoardContextType, CoreValues, VisionPath, DailySchedule, CustomSection, TimeBlock } from '../types/visionBoard';
import { logger } from '../utils/logger';

const LOCAL_STORAGE_KEY = 'mastery-vision-board-v2';

const DEFAULT_DATA: VisionBoardData = {
  coreValues: {
    priority: "Self",
    why: "Growth",
    purpose: "Master of My Self",
    motto: "Live Life More",
    values: [
      { title: "The Omen", description: "Face the Fear of Uncertainty", hidden: false },
      { title: "The Great Work", description: "Why→How→What", hidden: false },
      { title: "Just Do It", description: "The need to relentlessly \"just do it\" in order to have the brain mirror my conscious actions subconsciously.", hidden: false }
    ]
  },
  path: {
    vision: "Do One Exciting thing in Life that makes me Grow / Glow. Monetize that experience.",
    projects: [
      { text: "Finish defensive strategy - RE (Renovation & Airbnb ready)", hidden: false },
      { text: "Quit job or transfer - Q1 2026 Fixed!!", hidden: false },
      { text: "Move out of the country - NYC (WIP)", hidden: false },
      { text: "Do my own thing - App x AI or YouTube - AI App (VC?) and Shift to Lifestyle YouTube", hidden: false },
      { text: "Live my life for exciting things - Passion, Project", hidden: false },
      { text: "Improve myself til I fucking die - Grow physically / mentally & Life Goals", hidden: false }
    ],
    quarterlyGoals: [
      { text: "Build MVP", hidden: false }
    ]
  },
  schedule: {
    timeline: [
      { time: "23:00", endTime: "06:00", label: "Sleep", color: "bg-purple-400", hidden: false, isProtected: true },
      { time: "06:30", endTime: "07:30", label: "GM Routine", color: "bg-yellow-400", hidden: false, isRoutine: true },
      { time: "09:00", endTime: "17:00", label: "Work/School", color: "bg-blue-400", hidden: false, isProtected: true },
      { time: "12:00", endTime: "13:00", label: "Break", color: "bg-green-400", hidden: false },
      { time: "17:30", endTime: "18:30", label: "GD Routine", color: "bg-orange-400", hidden: false, isRoutine: true },
      { time: "21:00", endTime: "22:00", label: "GN Routine", color: "bg-indigo-400", hidden: false, isRoutine: true }
    ],
    gmRoutine: [
      { text: "Morning Acts (Pee, Weight, Sunlight)", hidden: false },
      { text: "Mental (Headspace, Gratitude)", hidden: false },
      { text: "Physical (Protein, Abs, Chest)", hidden: false }
    ],
    gdRoutine: [
      { text: "Work on my goals", hidden: false },
      { text: "Code for 1 hour (Make sure this is included)", hidden: false }
    ],
    gnRoutine: [
      { text: "No Entertainment (5 PM)", hidden: false },
      { text: "Work Done (9 PM)", hidden: false },
      { text: "Sleep (11 PM)", hidden: false }
    ],
    busyDayPlan: "10min Walk, 10min Headspace, 10min Vision Board, 10min GD."
  },
  custom: {
    enabled: false,
    entries: [],
    images: []
  }
};

const VisionBoardContext = createContext<VisionBoardContextType | undefined>(undefined);

export const VisionBoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<VisionBoardData>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        // Merge stored data with default structure to ensure new fields (like GrandVision parts) exist
        const parsed = JSON.parse(stored);

        // Data migration/safety check
        // Migrate old 3-part grandVision object to single vision string
        let vision = parsed.path?.vision;
        if (vision === undefined) {
          const oldGrandVision = parsed.path?.grandVision;
          if (oldGrandVision && typeof oldGrandVision === 'object') {
            // Convert old format to single string
            vision = `Feeling ${oldGrandVision.feel || '...'} while ${oldGrandVision.how || '...'} giving me ${oldGrandVision.what || '...'}`;
          } else {
            vision = DEFAULT_DATA.path.vision;
          }
        }
        // Clean up legacy grandVision property
        if (parsed.path?.grandVision) {
          delete parsed.path.grandVision;
        }

        // Migrate old single currentProject string to projects array
        let projects = parsed.path?.projects;
        if (!Array.isArray(projects)) {
          const oldProject = parsed.path?.currentProject;
          if (oldProject !== undefined) {
            // Preserve empty string as empty array, non-empty string as single-item array
            projects = oldProject ? [{ text: oldProject, hidden: false }] : [];
          } else {
            projects = DEFAULT_DATA.path.projects;
          }
        } else {
          // Migrate string array to VisionItem array
          projects = projects.map((p: string | { text: string; hidden: boolean }) => 
            typeof p === 'string' ? { text: p, hidden: false } : p
          );
        }
        // Clean up legacy currentProject property
        if (parsed.path?.currentProject !== undefined) {
          delete parsed.path.currentProject;
        }

        // Migrate quarterlyGoals from string array to VisionItem array
        let quarterlyGoals = parsed.path?.quarterlyGoals;
        if (Array.isArray(quarterlyGoals)) {
          quarterlyGoals = quarterlyGoals.map((g: string | { text: string; hidden: boolean }) => 
            typeof g === 'string' ? { text: g, hidden: false } : g
          );
        } else {
          quarterlyGoals = DEFAULT_DATA.path.quarterlyGoals;
        }

        // Migrate old string-based values to new object format and add missing descriptions/hidden
        let values = parsed.coreValues?.values;
        if (Array.isArray(values) && values.length > 0 && typeof values[0] === 'string') {
          values = values.map((v: string) => ({ title: v, description: '', hidden: false }));
        } else if (!values) {
          values = DEFAULT_DATA.coreValues.values;
        }
        
        // Auto-populate descriptions for known default values if they're empty, and add hidden property
        const defaultDescriptions: Record<string, string> = {
          "The Omen": "Face the Fear of Uncertainty",
          "The Great Work": "Why→How→What",
          "Just Do It": "The need to relentlessly \"just do it\" in order to have the brain mirror my conscious actions subconsciously."
        };
        
        if (Array.isArray(values)) {
          values = values.map((v: { title: string; description: string; hidden?: boolean }) => {
            const updated = { ...v, hidden: v.hidden ?? false };
            if (!v.description && defaultDescriptions[v.title]) {
              return { ...updated, description: defaultDescriptions[v.title] };
            }
            return updated;
          });
        }

        // Migrate schedule routines from string arrays to RoutineItem arrays
        const migrateRoutine = (routine: (string | { text: string; hidden: boolean })[] | undefined, defaultRoutine: { text: string; hidden: boolean }[]) => {
          if (!Array.isArray(routine)) return defaultRoutine;
          return routine.map((item) => 
            typeof item === 'string' ? { text: item, hidden: false } : { ...item, hidden: item.hidden ?? false }
          );
        };
        
        const gmRoutine = migrateRoutine(parsed.schedule?.gmRoutine, DEFAULT_DATA.schedule.gmRoutine);
        const gdRoutine = migrateRoutine(parsed.schedule?.gdRoutine, DEFAULT_DATA.schedule.gdRoutine);
        const gnRoutine = migrateRoutine(parsed.schedule?.gnRoutine, DEFAULT_DATA.schedule.gnRoutine);

        // Migrate timeline - normalize to new simplified format
        let timeline: TimeBlock[] = parsed.schedule?.timeline;
        if (!Array.isArray(timeline)) {
          timeline = DEFAULT_DATA.schedule.timeline;
        } else {
          // Migrate: preserve isRoutine from old routineKey field or existing isRoutine flag
          // Also set isProtected for Sleep and Work/School blocks
          timeline = timeline.map((block: Partial<TimeBlock> & { type?: string; routineKey?: string }) => {
            const wasRoutine = block.isRoutine || !!block.routineKey;
            const label = (block.label as string || '').toLowerCase();
            const isProtected = block.isProtected || label === 'sleep' || label === 'work/school';
            const { type: _type, routineKey: _routineKey, ...rest } = block as Record<string, unknown>;
            return {
              time: rest.time as string || '',
              label: rest.label as string || '',
              color: rest.color as string || 'bg-gray-400',
              hidden: (rest.hidden as boolean) ?? false,
              endTime: rest.endTime as string | undefined,
              isRoutine: wasRoutine,
              isProtected: isProtected || undefined
            };
          });
          
          // Only add default routines if timeline has NO routine entries at all
          // (prevents duplicate routines from being added on subsequent migrations)
          const hasAnyRoutines = timeline.some(b => b.isRoutine);
          if (!hasAnyRoutines) {
            const defaults = [
              { time: "06:30", endTime: "07:30", label: "GM Routine", color: "bg-yellow-400", hidden: false, isRoutine: true },
              { time: "17:30", endTime: "18:30", label: "GD Routine", color: "bg-orange-400", hidden: false, isRoutine: true },
              { time: "21:00", endTime: "22:00", label: "GN Routine", color: "bg-indigo-400", hidden: false, isRoutine: true }
            ];
            timeline.push(...defaults);
          }
        }

        // Safely merge custom section for legacy data without custom field
        const parsedCustom = parsed.custom && typeof parsed.custom === 'object' ? parsed.custom : {};
        
        // Migrate custom entries to include hidden property
        let customEntries = Array.isArray(parsedCustom.entries) ? parsedCustom.entries : [];
        customEntries = customEntries.map((entry: { title: string; items: (string | { text: string; hidden: boolean })[]; hidden?: boolean }) => ({
          ...entry,
          hidden: entry.hidden ?? false,
          items: Array.isArray(entry.items) 
            ? entry.items.map((item) => 
                typeof item === 'string' ? { text: item, hidden: false } : { ...item, hidden: item.hidden ?? false }
              )
            : []
        }));
        
        const custom = {
          ...DEFAULT_DATA.custom,
          ...parsedCustom,
          entries: customEntries,
          images: Array.isArray(parsedCustom.images) ? parsedCustom.images : []
        };

        return {
          ...DEFAULT_DATA,
          ...parsed,
          coreValues: { ...DEFAULT_DATA.coreValues, ...parsed.coreValues, values },
          path: { ...DEFAULT_DATA.path, ...parsed.path, vision, projects, quarterlyGoals },
          schedule: { ...DEFAULT_DATA.schedule, ...parsed.schedule, timeline, gmRoutine, gdRoutine, gnRoutine },
          custom
        };
      }
    } catch (e) {
      logger.error('Failed to load Vision Board data', e);
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      logger.error('Failed to save Vision Board data', e);
    }
  }, [data]);

  const updateCoreValues = (updates: Partial<CoreValues>) => {
    setData(prev => ({
      ...prev,
      coreValues: { ...prev.coreValues, ...updates }
    }));
  };

  const updatePath = (updates: Partial<VisionPath>) => {
    setData(prev => ({
      ...prev,
      path: { ...prev.path, ...updates }
    }));
  };

  const updateSchedule = (updates: Partial<DailySchedule>) => {
    setData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, ...updates }
    }));
  };

  const updateCustom = (updates: Partial<CustomSection>) => {
    setData(prev => ({
      ...prev,
      custom: { ...prev.custom, ...updates }
    }));
  };

  return (
    <VisionBoardContext.Provider value={{
      data,
      updateCoreValues,
      updatePath,
      updateSchedule,
      updateCustom
    }}>
      {children}
    </VisionBoardContext.Provider>
  );
};

export const useVisionBoard = () => {
  const context = useContext(VisionBoardContext);
  if (context === undefined) {
    throw new Error('useVisionBoard must be used within a VisionBoardProvider');
  }
  return context;
};

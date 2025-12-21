import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionBoardData, VisionBoardContextType, CoreValues, VisionPath, DailySchedule, CustomSection, TimeBlock, CompletedGoalInfo } from '../types/visionBoard';
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
        const migrationTime = Date.now();
        let projects = parsed.path?.projects;
        if (!Array.isArray(projects)) {
          const oldProject = parsed.path?.currentProject;
          if (oldProject !== undefined) {
            // Preserve empty string as empty array, non-empty string as single-item array
            projects = oldProject ? [{ text: oldProject, hidden: false, migratedAt: migrationTime }] : [];
          } else {
            projects = DEFAULT_DATA.path.projects.map(p => ({ ...p, migratedAt: migrationTime }));
          }
        } else {
          // Migrate string array to VisionItem array (add migratedAt for items without createdAt)
          projects = projects.map((p: string | { text: string; hidden?: boolean; createdAt?: number; migratedAt?: number }) => {
            if (typeof p === 'string') {
              return { text: p, hidden: false, migratedAt: migrationTime };
            }
            // Only add migratedAt if item doesn't have createdAt (legacy item)
            if (!p.createdAt && !p.migratedAt) {
              return { ...p, hidden: p.hidden ?? false, migratedAt: migrationTime };
            }
            return { ...p, hidden: p.hidden ?? false };
          });
        }
        // Clean up legacy currentProject property
        if (parsed.path?.currentProject !== undefined) {
          delete parsed.path.currentProject;
        }

        // Migrate quarterlyGoals from string array to VisionItem array (add migratedAt for items without createdAt)
        let quarterlyGoals = parsed.path?.quarterlyGoals;
        if (Array.isArray(quarterlyGoals)) {
          quarterlyGoals = quarterlyGoals.map((g: string | { text: string; hidden?: boolean; createdAt?: number; migratedAt?: number }) => {
            if (typeof g === 'string') {
              return { text: g, hidden: false, migratedAt: migrationTime };
            }
            // Only add migratedAt if item doesn't have createdAt (legacy item)
            if (!g.createdAt && !g.migratedAt) {
              return { ...g, hidden: g.hidden ?? false, migratedAt: migrationTime };
            }
            return { ...g, hidden: g.hidden ?? false };
          });
        } else {
          quarterlyGoals = DEFAULT_DATA.path.quarterlyGoals.map(g => ({ ...g, migratedAt: migrationTime }));
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

        // Helper to infer canonical routineType from block data
        // Uses "closest canonical anchor" strategy - every routine gets classified
        const inferRoutineType = (block: Partial<TimeBlock> & { routineKey?: string }): 'gm' | 'gd' | 'gn' => {
          // 1. Check legacy routineKey field
          if (block.routineKey) {
            const key = block.routineKey.toLowerCase();
            if (key.includes('gm') || key.includes('morning')) return 'gm';
            if (key.includes('gd') || key.includes('day')) return 'gd';
            if (key.includes('gn') || key.includes('night')) return 'gn';
          }
          // 2. Check existing routineType
          if (block.routineType) return block.routineType;
          // 3. Check label patterns (broad keywords)
          const label = (block.label || '').toLowerCase();
          if (label.includes('gm') || label.includes('morning') || label.includes('wake') || label.includes('sunrise') || label.includes('am routine')) return 'gm';
          if (label.includes('gd') || label.includes('midday') || label.includes('afternoon') || label.includes('lunch') || label.includes('growth') || label.includes('mid-day')) return 'gd';
          if (label.includes('gn') || label.includes('night') || label.includes('evening') || label.includes('bed') || label.includes('wind') || label.includes('pm routine')) return 'gn';
          // 4. Closest canonical anchor strategy - ALWAYS classify based on nearest anchor
          // Canonical anchors: GM=06:30 (390min), GD=17:30 (1050min), GN=21:00 (1260min)
          const time = block.time || '06:30';
          const [h, m] = time.split(':').map(Number);
          const totalMinutes = (!isNaN(h) ? h * 60 : 0) + (!isNaN(m) ? m : 0);
          const distances = {
            gm: Math.abs(totalMinutes - 390),   // 06:30
            gd: Math.abs(totalMinutes - 1050),  // 17:30
            gn: Math.abs(totalMinutes - 1260)   // 21:00
          };
          // Return the type with smallest distance
          if (distances.gm <= distances.gd && distances.gm <= distances.gn) return 'gm';
          if (distances.gd <= distances.gn) return 'gd';
          return 'gn';
        };

        // Helper to check if a routine block differs from defaults (customized by user)
        const isCustomized = (block: TimeBlock): boolean => {
          const defaults = {
            gm: { label: 'gm routine', time: '06:30', endTime: '07:30', color: 'bg-yellow-400' },
            gd: { label: 'gd routine', time: '17:30', endTime: '18:30', color: 'bg-orange-400' },
            gn: { label: 'gn routine', time: '21:00', endTime: '22:00', color: 'bg-indigo-400' }
          };
          const type = block.routineType;
          if (!type || !defaults[type]) return true; // Assume customized if unknown type
          const def = defaults[type];
          const labelDiff = (block.label || '').toLowerCase().trim() !== def.label;
          const timeDiff = block.time !== def.time || block.endTime !== def.endTime;
          const colorDiff = block.color !== def.color;
          return labelDiff || timeDiff || colorDiff;
        };

        // Migrate timeline - normalize to new simplified format
        let timeline: TimeBlock[] = parsed.schedule?.timeline;
        if (!Array.isArray(timeline)) {
          timeline = DEFAULT_DATA.schedule.timeline;
        } else {
          // Migrate: preserve isRoutine from old routineKey field or existing isRoutine flag
          // Also set isProtected for Sleep and Work/School blocks
          // Infer and assign routineType for routine blocks
          timeline = timeline.map((block: Partial<TimeBlock> & { type?: string; routineKey?: string }) => {
            const wasRoutine = block.isRoutine || !!block.routineKey;
            const label = (block.label as string || '').toLowerCase();
            const isProtected = block.isProtected || label === 'sleep' || label === 'work/school';
            const routineType = wasRoutine ? inferRoutineType(block) : undefined;
            const { type: _type, routineKey: _routineKey, ...rest } = block as Record<string, unknown>;
            return {
              time: rest.time as string || '',
              label: rest.label as string || '',
              color: rest.color as string || 'bg-gray-400',
              hidden: (rest.hidden as boolean) ?? false,
              endTime: rest.endTime as string | undefined,
              isRoutine: wasRoutine,
              isProtected: isProtected || undefined,
              routineType
            };
          });
          
          // Cleanup: Remove duplicate routine blocks using routineType for robust deduplication
          // Strategy: First pass - identify the BEST block per type (prefer customized over default)
          // Second pass - filter timeline keeping only the best block per type, preserving order
          const routinesByType = new Map<string, TimeBlock[]>();
          
          // First pass: group routines by type
          timeline.forEach(b => {
            if (!b.isRoutine) return;
            const typeKey = b.routineType || 'unknown';
            if (!routinesByType.has(typeKey)) {
              routinesByType.set(typeKey, []);
            }
            routinesByType.get(typeKey)!.push(b);
          });
          
          // Determine which block to keep per type (prefer customized, including hidden flag changes)
          const bestBlockPerType = new Map<string, TimeBlock>();
          routinesByType.forEach((blocks, typeKey) => {
            if (blocks.length === 1) {
              bestBlockPerType.set(typeKey, blocks[0]);
            } else {
              // Prefer customized blocks (label/time/color/hidden differs from default)
              const customized = blocks.find(b => isCustomized(b) || b.hidden);
              bestBlockPerType.set(typeKey, customized || blocks[0]);
            }
          });
          
          // Second pass: filter timeline keeping best blocks, preserving original order
          const seenTypes = new Set<string>();
          timeline = timeline.filter(b => {
            if (!b.isRoutine) return true;
            const typeKey = b.routineType || 'unknown';
            const bestBlock = bestBlockPerType.get(typeKey);
            // Keep this block only if it's the best one and we haven't seen this type yet
            if (b === bestBlock && !seenTypes.has(typeKey)) {
              seenTypes.add(typeKey);
              return true;
            }
            return false;
          });
          
          // Only add default routines if timeline has NO routine entries at all
          // (prevents duplicate routines from being added on subsequent migrations)
          const hasAnyRoutines = timeline.some(b => b.isRoutine);
          if (!hasAnyRoutines) {
            const defaults: TimeBlock[] = [
              { time: "06:30", endTime: "07:30", label: "GM Routine", color: "bg-yellow-400", hidden: false, isRoutine: true, routineType: 'gm' },
              { time: "17:30", endTime: "18:30", label: "GD Routine", color: "bg-orange-400", hidden: false, isRoutine: true, routineType: 'gd' },
              { time: "21:00", endTime: "22:00", label: "GN Routine", color: "bg-indigo-400", hidden: false, isRoutine: true, routineType: 'gn' }
            ];
            timeline.push(...defaults);
          }
          
          // Remove only auto-generated Wake Up POINTS (not blocks) from persisted data
          // These are generated dynamically at render time in SectionComponents.tsx
          // A Wake Up block with endTime is a user-created block and should be preserved
          timeline = timeline.filter(b => {
            // Only remove if it's marked auto-generated AND is a point (no endTime)
            if (b.isAutoGenerated && !b.endTime) return false;
            // Also remove legacy Wake Up points (no endTime) that match exactly "Wake Up"
            const label = (b.label || '').toLowerCase();
            if (label === 'wake up' && !b.endTime) return false;
            return true;
          });
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
    // Return DEFAULT_DATA with migratedAt added to path items
    const initTime = Date.now();
    return {
      ...DEFAULT_DATA,
      path: {
        ...DEFAULT_DATA.path,
        projects: DEFAULT_DATA.path.projects.map(p => ({ ...p, migratedAt: initTime })),
        quarterlyGoals: DEFAULT_DATA.path.quarterlyGoals.map(g => ({ ...g, migratedAt: initTime }))
      }
    };
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

  const completePathItem = (type: 'project' | 'goal', index: number): CompletedGoalInfo | null => {
    const items = type === 'project' ? data.path.projects : data.path.quarterlyGoals;
    if (index < 0 || index >= items.length) return null;
    
    const item = items[index];
    const now = Date.now();
    const hasOriginalCreatedAt = !!item.createdAt;
    const hasMigratedAt = !!item.migratedAt;
    
    // Defensive: if item has neither createdAt nor migratedAt, treat as migrated now
    // This handles any edge cases where timestamps weren't properly set
    const startTime = item.createdAt || item.migratedAt || now;
    const durationDays = Math.floor((now - startTime) / (24 * 60 * 60 * 1000));
    const isApproximate = !hasOriginalCreatedAt;
    
    const completedInfo: CompletedGoalInfo = {
      text: item.text,
      type,
      createdAt: item.createdAt || item.migratedAt || now,
      completedAt: now,
      durationDays,
      isApproximateDuration: isApproximate
    };

    const updatedItems = [...items];
    updatedItems[index] = {
      ...item,
      isCompleted: true,
      completedAt: now
    };

    if (type === 'project') {
      updatePath({ projects: updatedItems });
    } else {
      updatePath({ quarterlyGoals: updatedItems });
    }

    return completedInfo;
  };

  return (
    <VisionBoardContext.Provider value={{
      data,
      updateCoreValues,
      updatePath,
      updateSchedule,
      updateCustom,
      completePathItem
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

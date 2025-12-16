import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionBoardData, VisionBoardContextType, CoreValues, VisionPath, GrandVision, DailySchedule } from '../types/visionBoard';
import { logger } from '../utils/logger';

const LOCAL_STORAGE_KEY = 'mastery-vision-board-v2';

const DEFAULT_DATA: VisionBoardData = {
  coreValues: {
    priority: "Self",
    why: "Growth",
    purpose: "Master of My Self",
    motto: "Live Life More",
    values: [
      { title: "The Omen", description: "Face the Fear of Uncertainty" },
      { title: "The Great Work", description: "Why→How→What" },
      { title: "Just Do It", description: "The need to relentlessly \"just do it\" in order to have the brain mirror my conscious actions subconsciously." }
    ]
  },
  path: {
    grandVision: {
      feel: "Excited and Glowing",
      how: "Doing one exciting thing in life",
      what: "Growth, Monetization, and Experience"
    },
    currentProject: "Launch the Mastery App",
    quarterlyGoals: [
      "Build MVP"
    ]
  },
  schedule: {
    gmRoutine: [
      "Morning Acts (Pee, Weight, Sunlight)",
      "Mental (Headspace, Gratitude)",
      "Physical (Protein, Abs, Chest)"
    ],
    gdRoutine: [
      "Work on my goals",
      "Code for 1 hour (Make sure this is included)"
    ],
    gnRoutine: [
      "No Entertainment (5 PM)",
      "Work Done (9 PM)",
      "Sleep (11 PM)"
    ],
    busyDayPlan: "10min Walk, 10min Headspace, 10min Vision Board, 10min GD."
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
        // If grandVision is a string (legacy/broken), reset it to default object
        let grandVision = parsed.path?.grandVision;
        if (typeof grandVision === 'string' || !grandVision) {
          grandVision = DEFAULT_DATA.path.grandVision;
        }

        // Migrate old string-based values to new object format and add missing descriptions
        let values = parsed.coreValues?.values;
        if (Array.isArray(values) && values.length > 0 && typeof values[0] === 'string') {
          values = values.map((v: string) => ({ title: v, description: '' }));
        } else if (!values) {
          values = DEFAULT_DATA.coreValues.values;
        }
        
        // Auto-populate descriptions for known default values if they're empty
        const defaultDescriptions: Record<string, string> = {
          "The Omen": "Face the Fear of Uncertainty",
          "The Great Work": "Why→How→What",
          "Just Do It": "The need to relentlessly \"just do it\" in order to have the brain mirror my conscious actions subconsciously."
        };
        
        if (Array.isArray(values)) {
          values = values.map((v: { title: string; description: string }) => {
            if (!v.description && defaultDescriptions[v.title]) {
              return { ...v, description: defaultDescriptions[v.title] };
            }
            return v;
          });
        }

        return {
          ...DEFAULT_DATA,
          ...parsed,
          coreValues: { ...DEFAULT_DATA.coreValues, ...parsed.coreValues, values },
          path: { ...DEFAULT_DATA.path, ...parsed.path, grandVision },
          schedule: { ...DEFAULT_DATA.schedule, ...parsed.schedule }
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

  const updateGrandVision = (updates: Partial<GrandVision>) => {
    setData(prev => ({
      ...prev,
      path: {
        ...prev.path,
        grandVision: { ...prev.path.grandVision, ...updates }
      }
    }));
  };

  const updateSchedule = (updates: Partial<DailySchedule>) => {
    setData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, ...updates }
    }));
  };

  return (
    <VisionBoardContext.Provider value={{
      data,
      updateCoreValues,
      updatePath,
      updateGrandVision,
      updateSchedule
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

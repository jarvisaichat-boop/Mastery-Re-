import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionBoardData, VisionBoardContextType, CoreValues, VisionPath, GrandVision, DailySchedule } from '../types/visionBoard';
import { logger } from '../utils/logger';

const LOCAL_STORAGE_KEY = 'mastery-vision-board-v1';

const DEFAULT_DATA: VisionBoardData = {
  coreValues: {
    priority: "Self",
    why: "Growth",
    purpose: "Master of My Self",
    motto: "Live Life More",
    values: [
      "The Omen",
      "The Great Work",
      "Just Do It"
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

        return {
          ...DEFAULT_DATA,
          ...parsed,
          coreValues: { ...DEFAULT_DATA.coreValues, ...parsed.coreValues },
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

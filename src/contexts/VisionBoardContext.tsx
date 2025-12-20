import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionBoardData, VisionBoardContextType, CoreValues, VisionPath, DailySchedule, CustomSection } from '../types/visionBoard';
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
    vision: "Do One Exciting thing in Life that makes me Grow / Glow. Monetize that experience.",
    projects: [
      "Finish defensive strategy - RE (Renovation & Airbnb ready)",
      "Quit job or transfer - Q1 2026 Fixed!!",
      "Move out of the country - NYC (WIP)",
      "Do my own thing - App x AI or YouTube - AI App (VC?) and Shift to Lifestyle YouTube",
      "Live my life for exciting things - Passion, Project",
      "Improve myself til I fucking die - Grow physically / mentally & Life Goals"
    ],
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
  },
  custom: {
    enabled: false,
    entries: [
      {
        title: "The Process - Alchemy",
        items: [
          "One Focus & Consistency + Coherent Effort - One Focus and Coherent Effort on One Action daily for a period of time is crucial for feeling alive",
          "Coherent Effort - Focusing on one high-priority focus and action daily is crucial for a set period of time for fulfilment (week, month, or 6 months).",
          "Consistency - Consistency of effort and focus, do not let the continuum die, improve the routine and keep the momentum alive forever.",
          "One Focus - I want to quit or transfer to focus entirely on one aspect of my life, rejecting all others. Do Just That! Put focus on the one thing to grow myself and devote all my attention on it. This singular focus is crucial for growth and momentum for me and, in reverse, spreading my focus too thin kills my drive. What is that one crucial daily focus or action, now and forever? That is the most important thing, engrossing my whole being."
        ]
      }
    ],
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
            projects = oldProject ? [oldProject] : [];
          } else {
            projects = DEFAULT_DATA.path.projects;
          }
        }
        // Clean up legacy currentProject property
        if (parsed.path?.currentProject !== undefined) {
          delete parsed.path.currentProject;
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

        // Safely merge custom section for legacy data without custom field
        const parsedCustom = parsed.custom && typeof parsed.custom === 'object' ? parsed.custom : {};
        const custom = {
          ...DEFAULT_DATA.custom,
          ...parsedCustom,
          entries: Array.isArray(parsedCustom.entries) ? parsedCustom.entries : [],
          images: Array.isArray(parsedCustom.images) ? parsedCustom.images : []
        };

        return {
          ...DEFAULT_DATA,
          ...parsed,
          coreValues: { ...DEFAULT_DATA.coreValues, ...parsed.coreValues, values },
          path: { ...DEFAULT_DATA.path, ...parsed.path, vision, projects },
          schedule: { ...DEFAULT_DATA.schedule, ...parsed.schedule },
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

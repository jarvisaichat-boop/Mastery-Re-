import { ContentLibraryItem } from '../types';

// EDUCATIONAL CONTENT LIBRARY - VERIFIED DURATIONS via YouTube API
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// All videos teach how to START new habits and build routines that stick
// STRICT: Maximum 8.00 minutes (480 seconds) - ALL DURATIONS VERIFIED via YouTube Data API v3
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'The Science of Productivity',
    youtubeUrl: 'https://www.youtube.com/watch?v=lHfjvYzr-3g',
    channelName: 'AsapSCIENCE',
    duration: 3,
    question: 'What ONE productivity technique will you apply today to start a new habit?',
    category: 'strategy',
    tags: {
      contentType: ['education', 'tutorial'],
      lifeDomain: ['productivity', 'mental'],
      difficulty: 'beginner',
      emotion: ['energizing'],
      technique: ['science-based', 'time management'],
    },
  },
  {
    id: '2',
    title: 'How to Create a Habit: The 2 Minute Rule',
    youtubeUrl: 'https://www.youtube.com/watch?v=ueXdK1wI0tA',
    channelName: 'Peter Attia MD',
    duration: 6,
    question: 'What is the 2-minute version of the habit you want to build?',
    category: 'discipline',
    tags: {
      contentType: ['tutorial', 'education'],
      lifeDomain: ['physical', 'productivity'],
      difficulty: 'beginner',
      emotion: ['empowering'],
      technique: ['2-minute rule', 'atomic habits'],
    },
  },
  {
    id: '3',
    title: 'Habit Stacking - Create Your Perfect Routine',
    youtubeUrl: 'https://www.youtube.com/watch?v=zjBhC4C-9KU',
    channelName: 'Better Than Yesterday',
    duration: 8,
    question: 'Which existing daily habit will you stack your new habit onto?',
    category: 'strategy',
    tags: {
      contentType: ['tutorial', 'education'],
      lifeDomain: ['productivity', 'mental'],
      difficulty: 'intermediate',
      emotion: ['empowering'],
      technique: ['habit stacking', 'routine building'],
    },
  },
  {
    id: '4',
    title: 'Emotions Create Habits BJ Fogg',
    youtubeUrl: 'https://www.youtube.com/watch?v=iCt8Ngdsu2g',
    channelName: 'Bariatric Advantage',
    duration: 5,
    question: 'How will you celebrate and feel positive emotions after doing your tiny habit?',
    category: 'psychology',
    tags: {
      contentType: ['education', 'tutorial'],
      lifeDomain: ['mental', 'productivity'],
      difficulty: 'beginner',
      emotion: ['empowering', 'energizing'],
      technique: ['tiny habits', 'celebration', 'positive reinforcement'],
    },
  },
  {
    id: '5',
    title: 'How to Develop a Habit in 7 Steps',
    youtubeUrl: 'https://www.youtube.com/watch?v=FJ8f73e10l8',
    channelName: 'Brian Tracy',
    duration: 7,
    question: 'Which of the 7 steps will you focus on first to build your new habit?',
    category: 'discipline',
    tags: {
      contentType: ['education', 'tutorial'],
      lifeDomain: ['productivity', 'business', 'mental'],
      difficulty: 'beginner',
      emotion: ['empowering', 'energizing'],
      technique: ['step-by-step system', 'discipline'],
    },
  },
  {
    id: '6',
    title: 'How to Build Good Habits: Atomic Habits Author James Clear Explains',
    youtubeUrl: 'https://www.youtube.com/watch?v=B9j6hcv7Cvs',
    channelName: 'Tim Ferriss',
    duration: 5,
    question: 'What environment change will you make today to support your new habit?',
    category: 'strategy',
    tags: {
      contentType: ['education', 'tutorial'],
      lifeDomain: ['productivity', 'mental', 'physical'],
      difficulty: 'beginner',
      emotion: ['empowering'],
      technique: ['atomic habits', 'environment design', 'identity-based habits'],
    },
  },
];

const CONTENT_LIBRARY_VERSION = 20; // Curated action-oriented videos only: Removed book summaries, kept HOW-TO tutorials (6 videos, 3-8 min)

export function saveContentLibrary(items: ContentLibraryItem[]): void {
  try {
    localStorage.setItem('mastery-content-library', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save content library', e);
  }
}

export function loadContentLibrary(): ContentLibraryItem[] {
  try {
    const storedVersion = localStorage.getItem('mastery-content-library-version');
    const currentVersion = storedVersion ? parseInt(storedVersion) : 1;
    
    // MIGRATION: If version changed, reset to new verified short videos
    if (currentVersion < CONTENT_LIBRARY_VERSION) {
      localStorage.setItem('mastery-content-library-version', CONTENT_LIBRARY_VERSION.toString());
      saveContentLibrary(DEFAULT_CONTENT_LIBRARY);
      return DEFAULT_CONTENT_LIBRARY;
    }
    
    const stored = localStorage.getItem('mastery-content-library');
    if (stored) {
      const parsedLibrary = JSON.parse(stored);
      // Additional safety: filter out any videos > 8 minutes
      const validVideos = parsedLibrary.filter((item: ContentLibraryItem) => item.duration <= 8);
      
      // If we filtered out videos, save the cleaned library
      if (validVideos.length !== parsedLibrary.length) {
        saveContentLibrary(validVideos);
      }
      
      // If all videos were invalid or no videos left, use defaults
      return validVideos.length > 0 ? validVideos : DEFAULT_CONTENT_LIBRARY;
    }
    return DEFAULT_CONTENT_LIBRARY;
  } catch {
    return DEFAULT_CONTENT_LIBRARY;
  }
}

export function getTodayContent(contentLibrary: ContentLibraryItem[]): ContentLibraryItem {
  // LEGACY FUNCTION: Use recommendVideo() from videoRecommendation.ts for intelligent selection
  // This function kept for backward compatibility but should be deprecated
  
  // STRICT FILTER: Only videos 8 minutes or less
  const validVideos = contentLibrary.filter(item => item.duration <= 8);
  
  // If no valid videos available, use first default video (all defaults are <=8min)
  if (validVideos.length === 0) {
    return DEFAULT_CONTENT_LIBRARY[0];
  }
  
  const today = new Date().getDay();
  
  // First priority: Check if there's a video scheduled specifically for today
  const todayContent = validVideos.find(item => item.dayOfWeek === today);
  if (todayContent) return todayContent;
  
  // Second priority: Only select from videos WITHOUT dayOfWeek (general rotation)
  // This prevents weekend-only content from appearing on weekdays
  const generalVideos = validVideos.filter(item => item.dayOfWeek === undefined);
  
  if (generalVideos.length > 0) {
    // Random selection from general rotation only
    return generalVideos[Math.floor(Math.random() * generalVideos.length)];
  }
  
  // Fallback: If only day-specific videos exist, use first default
  return DEFAULT_CONTENT_LIBRARY[0];
}

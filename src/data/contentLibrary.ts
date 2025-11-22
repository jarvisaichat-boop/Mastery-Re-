import { ContentLibraryItem } from '../types';

// EDUCATIONAL CONTENT LIBRARY - Mixed Length: Quick Wins + Deep Dives
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// All videos teach how to START new habits and build routines that stick
// Duration limit: 8 minutes maximum (mix of 3-5 min quick content + 6-8 min deep education)
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  // QUICK ACTIONABLE CONTENT (3-5 minutes) - Fast daily ignition
  {
    id: '1',
    title: 'The Science of Making & Breaking Habits',
    youtubeUrl: 'https://www.youtube.com/watch?v=Wcs2PFz5q6g',
    channelName: 'Andrew Huberman',
    duration: 4,
    question: 'What ONE small habit will you start today using the science you just learned?',
    category: 'mindset',
  },
  {
    id: '2',
    title: 'How to Achieve Your Most Ambitious Goals',
    youtubeUrl: 'https://www.youtube.com/watch?v=TQMbvJNRpLE',
    channelName: 'TEDx Talks',
    duration: 5,
    question: 'What tiny marginal gain can you make today toward your big goal?',
    category: 'strategy',
  },
  {
    id: '3',
    title: '1% Better Every Day - James Clear',
    youtubeUrl: 'https://www.youtube.com/watch?v=mNeXuCYiE0U',
    channelName: 'Kit (ConvertKit)',
    duration: 6,
    question: 'Which 1% improvement will you commit to for the next 30 days?',
    category: 'discipline',
  },
  
  // DEEPER EDUCATION (6-8 minutes) - Weekend deep dives
  {
    id: '4',
    title: 'How to become 37.78 times better | Atomic Habits Summary',
    youtubeUrl: 'https://www.youtube.com/watch?v=PZ7lDrwYdZc',
    channelName: 'Escaping Ordinary (B.C Marx)',
    duration: 8,
    question: 'Using the 4 Laws of Behavior Change, how will you make your habit obvious today?',
    category: 'mindset',
    dayOfWeek: 6, // Saturday - longer content for weekends
  },
  {
    id: '5',
    title: 'Tiny Changes, Remarkable Results - Atomic Habits',
    youtubeUrl: 'https://www.youtube.com/watch?v=YT7tQzmGRLA',
    channelName: 'Ali Abdaal',
    duration: 7,
    question: 'What identity do you want to build, and what small action proves it today?',
    category: 'discipline',
    dayOfWeek: 0, // Sunday - longer content for weekends
  },
];

const CONTENT_LIBRARY_VERSION = 16; // Mixed library: 4-8 min range, quick wins + deep dives

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

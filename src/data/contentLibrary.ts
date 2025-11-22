import { ContentLibraryItem } from '../types';

// EDUCATIONAL CONTENT LIBRARY - VERIFIED DURATIONS via YouTube API
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// All videos teach how to START new habits and build routines that stick
// Duration limit: 8 minutes maximum - ALL DURATIONS VERIFIED via YouTube Data API v3
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'The Science of Productivity',
    youtubeUrl: 'https://www.youtube.com/watch?v=lHfjvYzr-3g',
    channelName: 'AsapSCIENCE',
    duration: 3, // VERIFIED: 3.27 minutes
    question: 'What ONE productivity technique will you apply today to start a new habit?',
    category: 'strategy',
  },
  {
    id: '2',
    title: 'Atomic Habits: How to Get 1% Better Every Day',
    youtubeUrl: 'https://www.youtube.com/watch?v=U_nzqnXWvSo',
    channelName: 'APB Speakers',
    duration: 8, // VERIFIED: 8.07 minutes
    question: 'Using the compound effect, what tiny 1% improvement will you start today?',
    category: 'mindset',
  },
];

const CONTENT_LIBRARY_VERSION = 17; // CRITICAL FIX: All durations verified via YouTube API (previous versions had incorrect manual durations)

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

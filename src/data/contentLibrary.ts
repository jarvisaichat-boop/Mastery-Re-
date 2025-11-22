import { ContentLibraryItem } from '../types';

// EDUCATIONAL CONTENT LIBRARY - Starting Habits & Atomic Habits Focus
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// All videos teach how to START new habits and build routines that stick
// Duration limit: 10 minutes maximum
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'How to become 37.78 times better | Atomic Habits Summary',
    youtubeUrl: 'https://www.youtube.com/watch?v=PZ7lDrwYdZc',
    channelName: 'Escaping Ordinary (B.C Marx)',
    duration: 8,
    question: 'Which 1% improvement will you start with today to compound your growth?',
    category: 'mindset',
  },
  {
    id: '2',
    title: 'TINY HABITS by BJ Fogg | Core Message',
    youtubeUrl: 'https://www.youtube.com/watch?v=S_8e-6ZHKLs',
    channelName: 'Productivity Game',
    duration: 9,
    question: 'What existing routine will you anchor your new tiny habit to today?',
    category: 'strategy',
  },
  {
    id: '3',
    title: 'Tiny Changes, Remarkable Results - Atomic Habits',
    youtubeUrl: 'https://www.youtube.com/watch?v=YT7tQzmGRLA',
    channelName: 'Ali Abdaal',
    duration: 10,
    question: 'What identity do you want to build, and what small action proves it today?',
    category: 'discipline',
  },
];

const CONTENT_LIBRARY_VERSION = 15; // Updated to starter-focused content: Atomic Habits & Tiny Habits methodology

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
      // Additional safety: filter out any videos > 10 minutes
      const validVideos = parsedLibrary.filter((item: ContentLibraryItem) => item.duration <= 10);
      
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
  // STRICT FILTER: Only videos 10 minutes or less
  const validVideos = contentLibrary.filter(item => item.duration <= 10);
  
  // If no valid videos available, use first default video (all defaults are <=10min)
  if (validVideos.length === 0) {
    return DEFAULT_CONTENT_LIBRARY[0];
  }
  
  const today = new Date().getDay();
  const todayContent = validVideos.find(item => item.dayOfWeek === today);
  if (todayContent) return todayContent;
  
  // Random selection from valid videos only
  return validVideos[Math.floor(Math.random() * validVideos.length)];
}

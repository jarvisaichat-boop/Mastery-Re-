import { ContentLibraryItem } from '../types';

// EDUCATIONAL CONTENT LIBRARY - Habit Formation Focus
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// All videos teach concepts about habit formation, not just motivation
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  // Library currently empty - to be populated with educational habit content
];

const CONTENT_LIBRARY_VERSION = 13; // Removed motivational videos, preparing for educational content

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
      // Additional safety: filter out any videos >= 5 minutes
      const validVideos = parsedLibrary.filter((item: ContentLibraryItem) => item.duration < 5);
      
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
  // STRICT FILTER: Only videos under 5 minutes
  const shortVideos = contentLibrary.filter(item => item.duration < 5);
  
  // If no short videos available, use first default video (all defaults are <5min)
  if (shortVideos.length === 0) {
    return DEFAULT_CONTENT_LIBRARY[0];
  }
  
  const today = new Date().getDay();
  const todayContent = shortVideos.find(item => item.dayOfWeek === today);
  if (todayContent) return todayContent;
  
  // Random selection from short videos only
  return shortVideos[Math.floor(Math.random() * shortVideos.length)];
}

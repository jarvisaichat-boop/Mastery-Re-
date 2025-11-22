import { ContentLibraryItem } from '../types';

// MOTIVATIONAL CONTENT LIBRARY
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// Using direct video IDs for compatibility
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'The Power of Small Wins',
    youtubeUrl: 'https://www.youtube.com/watch?v=pN34FNbOKXc',
    channelName: 'Motivation',
    duration: 3,
    question: 'What small win will you create today to build momentum?',
    category: 'mindset',
  },
  {
    id: '2',
    title: 'Why We Do What We Do',
    youtubeUrl: 'https://www.youtube.com/watch?v=_X0mgOOSpLU',
    channelName: 'TEDx Talks',
    duration: 4,
    question: 'What motivates you to keep showing up for your habits?',
    category: 'discipline',
  },
  {
    id: '3',
    title: 'The Secret to Success',
    youtubeUrl: 'https://www.youtube.com/watch?v=5MgBikgcWnY',
    channelName: 'Motivation',
    duration: 3,
    question: 'Which success principle will you apply to your journey today?',
    category: 'strategy',
  },
  {
    id: '4',
    title: 'One Day or Day One',
    youtubeUrl: 'https://www.youtube.com/watch?v=FU3GRNCh_lk',
    channelName: 'Motivation',
    duration: 2,
    question: 'What action will you take TODAY instead of waiting for "one day"?',
    category: 'discipline',
    dayOfWeek: 1, // Monday focus
  },
];

const CONTENT_LIBRARY_VERSION = 11; // Force reset to remove any 5+ minute videos

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

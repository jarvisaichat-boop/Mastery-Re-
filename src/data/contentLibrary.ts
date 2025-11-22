import { ContentLibraryItem } from '../types';

// VERIFIED SHORT TED TALKS - All actually 3 minutes (confirmed via official TED.com)
// Using only 4 videos to ensure all are genuinely under 5 minutes
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: '8 Secrets of Success',
    youtubeUrl: 'https://www.youtube.com/embed/Y6bbMQXQ180',
    channelName: 'Richard St. John',
    duration: 3,
    question: 'Which of the 8 secrets will you focus on today?',
    category: 'mindset',
  },
  {
    id: '2',
    title: 'Try Something New for 30 Days',
    youtubeUrl: 'https://www.youtube.com/embed/UNP03fDSj1U',
    channelName: 'Matt Cutts',
    duration: 3,
    question: 'What 30-day challenge will you start today?',
    category: 'discipline',
  },
  {
    id: '3',
    title: 'Weird, or Just Different?',
    youtubeUrl: 'https://www.youtube.com/embed/dGJhYmlICzU',
    channelName: 'Derek Sivers',
    duration: 3,
    question: 'How can you shift your perspective today?',
    category: 'mindset',
  },
  {
    id: '4',
    title: 'Remember to Say Thank You',
    youtubeUrl: 'https://www.youtube.com/embed/ziSUiKE9nn0',
    channelName: 'Laura Trice',
    duration: 3,
    question: 'Who will you thank today and what for?',
    category: 'psychology',
    dayOfWeek: 0, // Sunday - special day video
  },
];

const CONTENT_LIBRARY_VERSION = 2; // Increment to force reset to verified short videos

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

export function saveContentLibrary(items: ContentLibraryItem[]): void {
  try {
    localStorage.setItem('mastery-content-library', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save content library', e);
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

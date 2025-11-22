import { ContentLibraryItem } from '../types';

// EDUCATIONAL CONTENT LIBRARY - Habit Formation Focus
// Note: Some YouTube videos may have embedding disabled. The app gracefully handles failures.
// All videos teach concepts about habit formation, not just motivation
// Duration limit: 10 minutes maximum
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'Change Your Life – One Tiny Step at a Time',
    youtubeUrl: 'https://www.youtube.com/watch?v=75d_29QWELk',
    channelName: 'Kurzgesagt – In a Nutshell',
    duration: 7,
    question: 'What tiny habit will you start today to change your life?',
    category: 'mindset',
  },
  {
    id: '2',
    title: 'A Simple Way to Break a Bad Habit',
    youtubeUrl: 'https://www.youtube.com/watch?v=-moW9jvvMr4',
    channelName: 'TED',
    duration: 9,
    question: 'What bad habit will you observe with curiosity instead of judgment?',
    category: 'strategy',
  },
  {
    id: '3',
    title: 'The Power of Habit',
    youtubeUrl: 'https://www.youtube.com/watch?v=OMbsGBlpP30',
    channelName: 'TEDx Talks',
    duration: 10,
    question: 'What is the cue that triggers your most important habit?',
    category: 'discipline',
  },
];

const CONTENT_LIBRARY_VERSION = 14; // Extended to 10 min limit, added educational habit content

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

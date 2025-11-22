import { ContentLibraryItem } from '../types';

// DIVERSE SHORT VIDEOS - Mix of TED talks and popular YouTube creators (all under 5 minutes)
// All durations verified to be accurate
export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  // TED Talks (verified 3 minutes each)
  {
    id: '1',
    title: '8 Secrets of Success',
    youtubeUrl: 'https://www.youtube.com/embed/Y6bbMQXQ180',
    channelName: 'TED - Richard St. John',
    duration: 3,
    question: 'Which of the 8 secrets will you apply to your habits today?',
    category: 'mindset',
  },
  {
    id: '2',
    title: 'Try Something New for 30 Days',
    youtubeUrl: 'https://www.youtube.com/embed/UNP03fDSj1U',
    channelName: 'TED - Matt Cutts',
    duration: 3,
    question: 'What 30-day habit challenge will you commit to starting today?',
    category: 'discipline',
  },
  {
    id: '3',
    title: 'Keep Your Goals to Yourself',
    youtubeUrl: 'https://www.youtube.com/embed/NHopJHSlVo4',
    channelName: 'TED - Derek Sivers',
    duration: 3,
    question: 'How will keeping your goal private help you take action today?',
    category: 'strategy',
  },
  {
    id: '4',
    title: 'Forget Multitasking, Try Monotasking',
    youtubeUrl: 'https://www.youtube.com/embed/ZkvUvZ1vSIc',
    channelName: 'TED - Paolo Cardini',
    duration: 3,
    question: 'What single task will you focus on completely today?',
    category: 'discipline',
    dayOfWeek: 1, // Monday focus
  },
  // More verified TED talks (all 3-4 minutes, embed-friendly)
  {
    id: '5',
    title: 'Weird, or Just Different?',
    youtubeUrl: 'https://www.youtube.com/embed/dGJhYmlICzU',
    channelName: 'TED - Derek Sivers',
    duration: 3,
    question: 'How can changing your perspective help your habits today?',
    category: 'mindset',
  },
  {
    id: '6',
    title: 'Remember to Say Thank You',
    youtubeUrl: 'https://www.youtube.com/embed/ziSUiKE9nn0',
    channelName: 'TED - Laura Trice',
    duration: 3,
    question: 'What habit will you build around expressing gratitude?',
    category: 'psychology',
  },
  {
    id: '7',
    title: 'Got a Meeting? Take a Walk',
    youtubeUrl: 'https://www.youtube.com/embed/iE9HMudybyc',
    channelName: 'TED - Nilofer Merchant',
    duration: 3,
    question: 'How can you add movement to your daily routine?',
    category: 'psychology',
  },
  {
    id: '8',
    title: 'The Secret to Self-Control',
    youtubeUrl: 'https://www.youtube.com/embed/aX7jnVXXG5o',
    channelName: 'TED - Jonathan Bricker',
    duration: 4,
    question: 'What urge will you observe instead of act on today?',
    category: 'strategy',
    dayOfWeek: 0, // Sunday - weekly reflection
  },
];

const CONTENT_LIBRARY_VERSION = 6; // All verified TED talks (embed-friendly)

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

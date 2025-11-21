import { ContentLibraryItem } from '../types';

export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'The Power of Consistency Over Intensity',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 3,
    question: 'How will you apply this lesson today?',
    category: 'discipline',
  },
  {
    id: '2',
    title: 'Breaking Through the Planning Trap',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 3,
    question: 'What action can you take right now to move forward?',
    category: 'psychology',
  },
  {
    id: '3',
    title: 'Identity-Based Habits: Becoming vs Doing',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 3,
    question: 'What identity are you building today?',
    category: 'mindset',
  },
  {
    id: '4',
    title: 'The 2-Minute Rule: Start Small, Build Big',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 3,
    question: 'What's the smallest version of your goal you can commit to?',
    category: 'strategy',
  },
  {
    id: '5',
    title: 'Dopamine Priming: The Science of Motivation',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 3,
    question: 'How can you prime your nervous system for success?',
    category: 'psychology',
  },
  {
    id: '6',
    title: 'The Streak: Why One Day Matters',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 3,
    question: 'What streak are you protecting today?',
    category: 'discipline',
    dayOfWeek: 0, // Sunday
  },
];

export function loadContentLibrary(): ContentLibraryItem[] {
  try {
    const stored = localStorage.getItem('mastery-content-library');
    return stored ? JSON.parse(stored) : DEFAULT_CONTENT_LIBRARY;
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
  const today = new Date().getDay();
  const todayContent = contentLibrary.find(item => item.dayOfWeek === today);
  if (todayContent) return todayContent;
  
  // Fallback to random if no specific content for this day
  return contentLibrary[Math.floor(Math.random() * contentLibrary.length)];
}

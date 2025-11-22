import { ContentLibraryItem } from '../types';

export const DEFAULT_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: '1',
    title: 'The Power of Tiny Habits',
    youtubeUrl: 'https://www.youtube.com/embed/AdKUJxjn-R8',
    channelName: 'BJ Fogg',
    duration: 3,
    question: 'What tiny habit will you start today?',
    category: 'discipline',
  },
  {
    id: '2',
    title: 'How to Stop Screwing Yourself Over',
    youtubeUrl: 'https://www.youtube.com/embed/Lp7E973zozc',
    channelName: 'Mel Robbins',
    duration: 3,
    question: 'What action can you take right now to move forward?',
    category: 'psychology',
  },
  {
    id: '3',
    title: 'Atomic Habits: How to Build Good Habits',
    youtubeUrl: 'https://www.youtube.com/embed/U_nzqnXWvSo',
    channelName: 'James Clear',
    duration: 3,
    question: 'What identity are you building today?',
    category: 'mindset',
  },
  {
    id: '4',
    title: 'The Science of Making & Breaking Habits',
    youtubeUrl: 'https://www.youtube.com/embed/Wcs2PFz5q6g',
    channelName: 'Andrew Huberman',
    duration: 3,
    question: 'What is the smallest version of your goal you can commit to?',
    category: 'strategy',
  },
  {
    id: '5',
    title: 'Why Motivation is a Myth',
    youtubeUrl: 'https://www.youtube.com/embed/H14bBuluwB8',
    channelName: 'Mel Robbins',
    duration: 3,
    question: 'How can you take action without waiting for motivation?',
    category: 'psychology',
  },
  {
    id: '6',
    title: 'The 5 Second Rule for Morning Routine',
    youtubeUrl: 'https://www.youtube.com/embed/JrGc94BXLgs',
    channelName: 'Mel Robbins',
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

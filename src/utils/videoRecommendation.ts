import { logger } from "./logger";
import { ContentLibraryItem, Habit } from '../types';

interface WatchHistory {
  videoId: string;
  watchedAt: number;
}

const WATCH_HISTORY_KEY = 'mastery-video-watch-history';
const REPETITION_WINDOW_DAYS = 30;

export function getWatchHistory(): WatchHistory[] {
  try {
    const stored = localStorage.getItem(WATCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToWatchHistory(videoId: string): void {
  const history = getWatchHistory();
  const now = Date.now();
  
  const updatedHistory = [
    { videoId, watchedAt: now },
    ...history.filter(h => h.videoId !== videoId)
  ].slice(0, 50);
  
  try {
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save watch history', e);
  }
}

function wasWatchedRecently(videoId: string, history: WatchHistory[]): boolean {
  const cutoffTime = Date.now() - (REPETITION_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return history.some(h => h.videoId === videoId && h.watchedAt > cutoffTime);
}

function analyzeUserHabits(habits: Habit[]): {
  lifeDomains: Set<string>;
  journeyStage: 'beginner' | 'intermediate' | 'advanced';
  totalHabits: number;
} {
  const lifeDomains = new Set<string>();
  
  habits.forEach(habit => {
    habit.categories.forEach(cat => {
      const domain = mapCategoryToDomain(cat.main);
      if (domain) lifeDomains.add(domain);
    });
  });
  
  const totalHabits = habits.length;
  const avgCompletionRate = calculateAvgCompletionRate(habits);
  
  let journeyStage: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (totalHabits >= 10 && avgCompletionRate > 0.7) {
    journeyStage = 'advanced';
  } else if (totalHabits >= 5 && avgCompletionRate > 0.5) {
    journeyStage = 'intermediate';
  }
  
  return { lifeDomains, journeyStage, totalHabits };
}

function mapCategoryToDomain(category: string): string | null {
  const mapping: Record<string, string> = {
    'Exercise & Movement': 'physical',
    'Health & Wellness': 'physical',
    'Mental Health': 'mental',
    'Mindfulness & Meditation': 'mental',
    'Work & Career': 'productivity',
    'Business & Entrepreneurship': 'business',
    'Finance & Money': 'finance',
    'Relationships & Social': 'relationships',
    'Creativity & Arts': 'creativity',
    'Learning & Education': 'productivity',
    'Personal Development': 'mental',
  };
  
  return mapping[category] || null;
}

function calculateAvgCompletionRate(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });
  
  let totalDays = 0;
  let completedDays = 0;
  
  habits.forEach(habit => {
    last30Days.forEach(dateStr => {
      if (habit.completed[dateStr] !== undefined) {
        totalDays++;
        if (habit.completed[dateStr]) {
          completedDays++;
        }
      }
    });
  });
  
  return totalDays > 0 ? completedDays / totalDays : 0;
}

function scoreVideo(
  video: ContentLibraryItem,
  userProfile: {
    lifeDomains: Set<string>;
    journeyStage: 'beginner' | 'intermediate' | 'advanced';
    totalHabits: number;
  },
  watchHistory: WatchHistory[]
): number {
  let score = 0;
  
  if (wasWatchedRecently(video.id, watchHistory)) {
    return -1000;
  }
  
  if (video.tags?.difficulty === userProfile.journeyStage) {
    score += 50;
  } else if (
    (userProfile.journeyStage === 'beginner' && video.tags?.difficulty === 'intermediate') ||
    (userProfile.journeyStage === 'intermediate' && (video.tags?.difficulty === 'beginner' || video.tags?.difficulty === 'advanced'))
  ) {
    score += 20;
  }
  
  const domainMatches = video.tags?.lifeDomain?.filter(domain => 
    userProfile.lifeDomains.has(domain)
  ).length || 0;
  score += domainMatches * 30;
  
  if (userProfile.totalHabits === 0) {
    if (video.tags?.technique?.includes('2-minute rule') || 
        video.tags?.technique?.includes('tiny habits')) {
      score += 40;
    }
  }
  
  const today = new Date().getDay();
  if (today === 0 || today === 6) {
    if (video.duration >= 7) score += 15;
  } else {
    if (video.duration <= 6) score += 15;
  }
  
  if (video.tags?.contentType?.includes('tutorial')) score += 10;
  if (video.tags?.contentType?.includes('education')) score += 5;
  
  return score;
}

export function recommendVideo(
  contentLibrary: ContentLibraryItem[],
  habits: Habit[]
): ContentLibraryItem {
  const validVideos = contentLibrary.filter(item => item.duration <= 8);
  
  if (validVideos.length === 0) {
    throw new Error('No valid videos in library');
  }
  
  const watchHistory = getWatchHistory();
  const userProfile = analyzeUserHabits(habits);
  
  const today = new Date().getDay();
  const todaySpecific = validVideos.find(v => v.dayOfWeek === today);
  if (todaySpecific && !wasWatchedRecently(todaySpecific.id, watchHistory)) {
    return todaySpecific;
  }
  
  const generalVideos = validVideos.filter(v => v.dayOfWeek === undefined);
  
  const scoredVideos = generalVideos.map(video => ({
    video,
    score: scoreVideo(video, userProfile, watchHistory)
  }));
  
  scoredVideos.sort((a, b) => b.score - a.score);
  
  // Filter out recently watched videos (score < -100 means watched in last 30 days)
  const unwatchedVideos = scoredVideos.filter(sv => sv.score > -100);
  
  if (unwatchedVideos.length > 0) {
    // Select from top 3 unwatched videos for diversity
    const topVideos = unwatchedVideos.slice(0, 3);
    const selectedIndex = Math.floor(Math.random() * topVideos.length);
    return topVideos[selectedIndex].video;
  }
  
  // If ALL general videos have been watched recently, pick the LEAST recently watched
  // Sort by actual watch timestamp (oldest first) to honor 30-day avoidance as much as possible
  const recentlyWatchedVideos = scoredVideos.filter(sv => sv.score <= -100);
  
  if (recentlyWatchedVideos.length > 0) {
    // Map videos to their watch timestamps
    const videosWithTimestamps = recentlyWatchedVideos.map(sv => {
      const historyEntry = watchHistory.find(h => h.videoId === sv.video.id);
      return {
        video: sv.video,
        watchedAt: historyEntry?.watchedAt || 0
      };
    });
    
    // Sort by timestamp (oldest first)
    videosWithTimestamps.sort((a, b) => a.watchedAt - b.watchedAt);
    
    const oldestWatched = videosWithTimestamps[0];
    logger.log('⚠️ All videos watched within 30 days - selecting least recent:', oldestWatched.video.title);
    return oldestWatched.video;
  }
  
  // Ultimate fallback: if somehow no videos exist, return first valid video
  return validVideos[0];
}

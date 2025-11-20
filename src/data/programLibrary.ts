import { Program } from '../types';

export const PROGRAM_LIBRARY: Program[] = [
  {
    id: 'morning-starter',
    name: 'Morning Starter',
    description: 'Simple morning routine to start your day with clarity and gratitude. Perfect for beginners.',
    category: 'morning',
    difficulty: 'beginner',
    icon: '🌅',
    habits: [
      {
        name: 'Box Breathing',
        description: 'Calm morning breathing practice',
        color: '#3b82f6',
        type: 'regular',
        categories: [{ main: 'Mindfulness' }],
        frequencyType: 'daily',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timesPerPeriod: 7,
        periodUnit: 'week',
        repeatDays: 1,
        miniAppType: 'breath'
      },
      {
        name: 'Gratitude Journal',
        description: 'Write 2 things you\'re grateful for',
        color: '#10b981',
        type: 'regular',
        categories: [{ main: 'Mindfulness' }],
        frequencyType: 'daily',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timesPerPeriod: 7,
        periodUnit: 'week',
        repeatDays: 1,
        miniAppType: 'journal'
      }
    ]
  },
  {
    id: 'deep-morning',
    name: 'Deep Morning',
    description: 'Comprehensive morning practice for serious habit builders. Extended breathing and gratitude.',
    category: 'morning',
    difficulty: 'intermediate',
    icon: '🌄',
    habits: [
      {
        name: 'Deep Breath Practice',
        description: 'Extended morning breathing session',
        color: '#8b5cf6',
        type: 'life_goal',
        categories: [{ main: 'Mindfulness' }],
        frequencyType: 'daily',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timesPerPeriod: 7,
        periodUnit: 'week',
        repeatDays: 1,
        scheduledTime: '06:00',
        miniAppType: 'breath'
      },
      {
        name: 'Morning Gratitude',
        description: 'Deep gratitude reflection to start your day',
        color: '#059669',
        type: 'life_goal',
        categories: [{ main: 'Mindfulness' }],
        frequencyType: 'daily',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timesPerPeriod: 7,
        periodUnit: 'week',
        repeatDays: 1,
        scheduledTime: '06:10',
        miniAppType: 'journal'
      }
    ]
  },
  {
    id: 'quick-reset',
    name: 'Quick Reset',
    description: 'Fast breathing break to reset your mind. Perfect for busy days or afternoon slumps.',
    category: 'wellness',
    difficulty: 'beginner',
    icon: '🌬️',
    habits: [
      {
        name: 'Reset Breathing',
        description: 'Quick breathing exercise to reset and refocus',
        color: '#06b6d4',
        type: 'regular',
        categories: [{ main: 'Mindfulness' }],
        frequencyType: 'daily',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timesPerPeriod: 5,
        periodUnit: 'week',
        repeatDays: 1,
        miniAppType: 'breath'
      }
    ]
  },
  {
    id: 'gratitude-practice',
    name: 'Gratitude Practice',
    description: 'Daily gratitude journaling to cultivate appreciation and positive mindset.',
    category: 'wellness',
    difficulty: 'beginner',
    icon: '🙏',
    habits: [
      {
        name: 'Daily Gratitude',
        description: 'Reflect on what you\'re grateful for',
        color: '#f59e0b',
        type: 'regular',
        categories: [{ main: 'Mindfulness' }],
        frequencyType: 'daily',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timesPerPeriod: 7,
        periodUnit: 'week',
        repeatDays: 1,
        miniAppType: 'journal'
      }
    ]
  }
];

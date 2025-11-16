# Mastery Dashboard

## Overview
**Path - Self Mastery** is a gamified AI-powered habit coaching program following a "Duolingo for Habit Forming" model. The app guides users through a complete 7-phase coaching cycle: Intake → Goal Contract → Plan → Do → Review → Accountability → Loop. Built with React, TypeScript, and Vite with dark mode "Focus Dojo" aesthetic and localStorage persistence.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks with localStorage persistence

## Project Structure
- `src/` - Main source code directory
  - `components/` - React components
    - `onboarding/` - Onboarding flow sub-components (Welcome, AI Interview, Reflection, Goal Contract, Weekly Plan)
    - `AddHabitModal.tsx` - Modal for adding/editing habits
    - `DashboardComponents.tsx` - Calendar, habit rows, and view components
    - `Onboarding.tsx` - Main onboarding orchestrator
    - `InlineWeeklyReview.tsx` - Embedded weekly progress review with positive language (Keep/Challenged/Progress)
    - `AICoachWidget.tsx` - Floating toast for real-time habit completion reactions
    - `StreakCelebration.tsx` - Full-screen celebration modal for streak milestones
    - `ChatDailyCheckIn.tsx` - Conversational AI daily check-in with free-form text chat interface
    - `StatsOverview.tsx` - Comprehensive stats dashboard with completion rates, trends, and editable goal
    - `ReflectionJournal.tsx` - Daily reflection module with quantitative + qualitative tracking
    - `DailySummary.tsx` - Legacy component (replaced by ChatDailyCheckIn)
  - `App.tsx` - Main application component
  - `types.ts` - TypeScript type definitions
  - `utils.ts` - Utility functions
  - `index.css` - Global styles
  - `main.tsx` - Application entry point

## Key Features

### 7-Phase Coaching Cycle
1. **Phase 1 - The Intake**: Welcome screen, AI interview (distractions + aspirations), Stoic Coach reflection
2. **Phase 2 - Goal Contract**: User inputs ONE goal, AI validates alignment (130+ keywords across 4 domains), digital commitment
3. **Phase 3 - Weekly Plan**: AI generates 2-3 context-aware habits based on validated goal
4. **Phase 4 - The "Do" Week**: Main dashboard with habit tracking, daily chat check-ins, stats overview, streak monitoring
5. **Phase 5 - Weekly Progress**: Positive language review (Keep, Challenged, Progress) based on 7-day performance
6. **Phase 6 - Accountability**: Share commitment feature (WhatsApp/iMessage/SMS) with social pressure
7. **Phase 7 - The Loop**: Cycle back to Phase 4 with optimized plan for next week

### Motivation & Tracking Features
- **Habit Tracking**: Track daily, weekly, and custom frequency habits
- **Multiple View Modes**: Week, month, and year calendar views
- **Stats Dashboard**: Comprehensive weekly analysis with completion rates, best/worst days, streak breakdowns, and heatmaps
- **Editable Goal**: User can update their life goal as priorities change
- **Drag & Drop**: Reorder habits by priority
- **Habit Categories**: Anchor Habits, Life Goal Habits, and regular Habits
- **Streak Tracking**: Easy and hard mode streak calculations
- **AI Coach Reactions**: Real-time encouraging messages when habits are checked off
- **Streak Celebrations**: Full-screen confetti modals for 3/7/14/30-day milestones
- **Conversational Daily Check-In**: Chat-style interface where users freely type about wins and challenges
- **Interactive AI Chat**: Ask follow-up questions and receive super positive Stoic coach responses
- **Reflection Journal**: Daily module-based interface asking "How much progress did you feel towards your goal?" with quantitative percentage ranges (100-80%, 80-50%, 50-30%, 30-0%) + qualitative "why" reasoning for consistent tracking over time
- **Inline Weekly Progress**: Positive language review (Keep/Challenged/Progress) with AI suggestions
- **Auto-Suggestions**: AI analyzes reasons and suggests timing, frequency, or difficulty adjustments
- **Accountability Sharing**: One-click sharing to WhatsApp, SMS, or copy to clipboard
- **Push Notification Templates**: Designed intriguing messages for future 2-3 day notification cadence
- **Data Persistence**: All data saved to localStorage including chat entries, goal, celebrated streaks, reasons, and daily reflections

## Development Setup
This project is configured to run in the Replit environment:
- Frontend runs on port 5000
- Vite dev server configured with HMR support
- Host set to 0.0.0.0 for Replit proxy compatibility

## Running the App
The workflow is automatically configured. The app starts via `npm run dev` and is accessible through the Replit webview.

## Recent Changes
- **2025-11-16**: Reflection Journal feature
  - **ReflectionJournal Component**: Module-based daily reflection system separate from habit tracking
  - **Consistent Daily Question**: "How much progress did you feel towards your goal?" asked every day for trend tracking
  - **Quantitative Metrics**: 4 percentage-range options (Very Great 100-80%, Great 80-50%, Okay 50-30%, Not Great 30-0%) with emojis
  - **Qualitative Depth**: Two-step flow - select percentage → explain "why" in free text field
  - **Question Focus**: Progress towards goal - aligns with core app purpose, separate from habit completion tracking
  - **Visual Design**: Hero gradient header with grid pattern, card-based modules matching reference UI
  - **Confirmation Flow**: Motivational "Greaaat job!" screen with reminder to log habits
  - **Navigation**: Sparkles icon (purple) in header toggles journal view
  - **localStorage Schema**: Reflections stored with date, question, answer object (value/percentage/emoji), reasoning text, timestamp
  - **Daily Limit**: One reflection per day, shows "Already Reflected Today" state with previous entry

- **2025-11-15**: Conversational AI and stats dashboard enhancement
  - **StatsOverview Component**: Comprehensive stats dashboard showing weekly completion rates, best/worst performance days, streak breakdowns by category, visual heatmaps, and habit category analysis
  - **Editable Goal**: Prominent goal display with edit functionality - users can adjust their goal as life priorities change
  - **ChatDailyCheckIn**: Conversational AI check-in replacing form-based DailySummary - users chat freely about wins/challenges
  - **Interactive Chat Flow**: Sequential wins-then-challenges data collection with follow-up question capability ("what can I do better?")
  - **Super Positive AI Responses**: Stoic coach tone with celebration for wins, supportive encouragement for challenges
  - **Positive Language Updates**: Replaced all "PROBLEM" terminology with "CHALLENGED" and "PROGRESS" throughout app
  - **Weekly Progress Reframe**: "Weekly Review" → "Weekly Progress" with "Wins, Challenges, Growth" framing
  - **Navigation Enhancement**: BarChart3 icon toggles stats dashboard view, TrendingUp icon toggles weekly progress
  - **Push Notification Design**: Created comprehensive templates for future 2-3 day notification system (see NOTIFICATION_TEMPLATES.md)
  - **localStorage Schema**: Added chatEntries storage, goal/aspirations persistence, and notification preferences structure
  - **Motivational Philosophy**: Emphasis on celebrating every win, making it addictive, softer approach to challenges

- **2025-11-15**: Major refactor - Active AI Coach motivation system
  - **Removed Redundant Screens**: Eliminated standalone WeeklyReview page and DashboardOverview screen for cleaner UX
  - **Inline Weekly Review**: Embedded KPT analysis directly in main dashboard, toggleable via TrendingUp icon
  - **AI Coach Widget**: Floating toast with real-time reactions when habits are checked/unchecked ("Hell yeah! 🔥", "Keep crushing it! 💪")
  - **Streak Celebrations**: Full-screen confetti modals for 3/7/14/30-day milestones (only shown once per milestone)
  - **Daily Summary**: End-of-day modal that collects reasons for missed habits (appears after 9pm or next day)
  - **Integrated Data Flow**: Daily reasons automatically pre-populate in weekly review, eliminating duplicate entry
  - **Auto-Suggestions**: AI analyzes reasons and generates suggestions automatically when all problem habits have explanations
  - **Smart Reason Analysis**: Detects patterns (timing issues, energy levels, forgetting, busyness, difficulty) and suggests specific adjustments
  - **Inline Accountability**: Share commitment directly within review flow (WhatsApp/SMS/Copy)
  - **Complete Loop**: Daily tracking → AI reactions → Daily summary → Weekly review → AI suggestions → Accountability → Loop back
  - **State Management**: Added localStorage persistence for celebrated streaks, daily reasons, and last daily summary date
  - **Navigation Improvement**: TrendingUp icon now toggles inline review (shows blue when active) instead of navigating away
  
- **2025-11-15**: Completed full 7-phase coaching cycle implementation (initial version)
  - **Phase 5 - Weekly Review**: KPT analysis (Keep/Problem/Try) with AI-generated feedback based on 7-day habit completion rates
  - **Phase 6 - Accountability**: Share commitment feature generates shareable messages for WhatsApp/iMessage/SMS
  - **Phase 7 - The Loop**: Automatic cycle back to dashboard after review completion
  - **Navigation**: TrendingUp icon in header opens Weekly Review flow from anywhere
  - **Smart Analysis**: Categorizes habits as "keep" (≥80%), "problem" (<50%), or "neutral" based on performance

- **2025-11-15**: Added complete onboarding flow (Phases 1-3 from PRD)
  - **Phase 1 - The Intake**: Welcome screen, AI Interview (distractions + aspirations), AI Reflection
  - **Phase 2 - Goal Contract**: User inputs ONE goal, AI validates alignment with aspirations, digital commitment
  - **Phase 3 - Weekly Plan**: AI generates 2-3 context-aware habits based on goal, user accepts
  - **Validation Logic**: Word-boundary keyword matching across 4 domains (business, fitness, learning, creative)
  - **Smart Transitions**: First-time users see onboarding, returning users go straight to dashboard
  - **Data Flow**: Onboarding creates initial habits and saves to localStorage
  - **Simulated AI**: Keyword-based validation and habit generation (real AI integration ready for future)

- **2025-11-15**: Fixed calendar navigation flow
  - **Fixed View Cycling**: Restored correct behavior when clicking month/year header
  - **Correct Flow**: Week → Month → Year → Week (click date to return)
  - **Separated Modes**: Calendar views (with dates) vs Simple list (habit names + streaks)
  - **List Toggle**: List icon properly toggles between detailed and simple views

- **2025-11-15**: Critical performance bug fixes and architecture improvements
  - **Fixed Major Bug**: Resolved 20,000+ iteration performance issue caused by using `habit.id` as creation timestamp
  - **Added `createdAt` field**: Habits now have explicit creation timestamps separate from their IDs
  - **Smart Migration**: Existing habits automatically migrated using timestamp IDs, earliest completion date, or current time
  - **Optimized Calculations**: Streak and stat calculations now limited to 3-year lookback window instead of iterating from 1970
  - **Fixed Scheduling**: "Repeats every X days" now works correctly with proper creation dates
  - **Preserved Data**: All existing completion history and streaks maintained through migration

- **2025-11-15**: Initial import and Replit environment configuration
  - Configured Vite for port 5000 with proper host settings
  - Set up workflow for automatic dev server startup
  - Updated .gitignore for React/Vite best practices

## Technical Notes

### `createdAt` Field Contract
- **Type**: `number` (Unix timestamp in milliseconds)
- **Purpose**: Tracks when a habit was created, separate from the habit ID
- **Used for**: Repeat scheduling calculations, streak history bounds, stats computation
- **Migration**: Legacy habits without `createdAt` are automatically assigned dates based on:
  1. Existing `createdAt` if present
  2. Habit ID if it's a valid timestamp (> 1000000000000)
  3. Earliest completion date from history
  4. Current time as fallback for new habits with no history

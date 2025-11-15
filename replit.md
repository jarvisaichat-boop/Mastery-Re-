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
    - `InlineWeeklyReview.tsx` - Embedded weekly review with KPT analysis and AI suggestions
    - `AICoachWidget.tsx` - Floating toast for real-time habit completion reactions
    - `StreakCelebration.tsx` - Full-screen celebration modal for streak milestones
    - `DailySummary.tsx` - End-of-day check-in for collecting missed habit reasons
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
4. **Phase 4 - The "Do" Week**: Main dashboard with habit tracking, streak monitoring, visual heatmaps
5. **Phase 5 - Weekly Review**: KPT analysis (Keep, Problem, Try) based on 7-day performance data
6. **Phase 6 - Accountability**: Share commitment feature (WhatsApp/iMessage/SMS) with social pressure
7. **Phase 7 - The Loop**: Cycle back to Phase 4 with optimized plan for next week

### Motivation & Tracking Features
- **Habit Tracking**: Track daily, weekly, and custom frequency habits
- **Multiple View Modes**: Week, month, and year calendar views
- **Drag & Drop**: Reorder habits by priority
- **Habit Categories**: Anchor Habits, Life Goal Habits, and regular Habits
- **Streak Tracking**: Easy and hard mode streak calculations
- **AI Coach Reactions**: Real-time encouraging messages when habits are checked off
- **Streak Celebrations**: Full-screen confetti modals for 3/7/14/30-day milestones
- **Daily Summary**: End-of-day check-in that collects reasons for missed habits
- **Inline Weekly Review**: KPT analysis with AI-generated suggestions based on user-provided reasons
- **Auto-Suggestions**: AI automatically analyzes missed habit reasons and suggests adjustments
- **Accountability Sharing**: One-click sharing to WhatsApp, SMS, or copy to clipboard
- **Data Persistence**: All data saved to localStorage including reasons, celebrated streaks, and daily summaries

## Development Setup
This project is configured to run in the Replit environment:
- Frontend runs on port 5000
- Vite dev server configured with HMR support
- Host set to 0.0.0.0 for Replit proxy compatibility

## Running the App
The workflow is automatically configured. The app starts via `npm run dev` and is accessible through the Replit webview.

## Recent Changes
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

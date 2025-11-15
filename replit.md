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
    - `AddHabitModal.tsx` - Modal for adding/editing habits
    - `DashboardComponents.tsx` - UI components for the dashboard
    - `DashboardOverview.tsx` - Main dashboard view
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

### Dashboard Features
- **Habit Tracking**: Track daily, weekly, and custom frequency habits
- **Dashboard View**: Visual overview with completion rates and streaks
- **Multiple View Modes**: Week, month, and year views
- **Drag & Drop**: Reorder habits by priority
- **Habit Categories**: Anchor Habits, Life Goal Habits, and regular Habits
- **Streak Tracking**: Easy and hard mode streak calculations
- **Data Persistence**: All data saved to localStorage

## Development Setup
This project is configured to run in the Replit environment:
- Frontend runs on port 5000
- Vite dev server configured with HMR support
- Host set to 0.0.0.0 for Replit proxy compatibility

## Running the App
The workflow is automatically configured. The app starts via `npm run dev` and is accessible through the Replit webview.

## Recent Changes
- **2025-11-15**: Completed full 7-phase coaching cycle implementation
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

# Mastery Dashboard

## Overview
A React-based habit tracking application that helps users build consistency and track their progress. The app features a dashboard with weekly completion rates, streak tracking, and a visual heatmap for habit monitoring.

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

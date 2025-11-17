# Mastery Dashboard

## Overview
**Path - Self Mastery** is a gamified AI-powered habit coaching program, modeled after "Duolingo for Habit Forming." It guides users through a 7-phase coaching cycle: Intake, Goal Contract, Plan, Do, Review, Accountability, and Loop. The application is built with React, TypeScript, and Vite, featuring a dark mode "Focus Dojo" aesthetic and leveraging localStorage for data persistence. The project aims to provide an engaging and effective platform for habit formation.

## User Preferences
I want to enable the AI to make changes to my codebase. I prefer detailed explanations. I want iterative development. I prefer simple language. I prefer that you ask me before making major changes. I like functional programming.

## System Architecture
The application is a single-page application (SPA) built with React 18 and TypeScript, using Vite 5 as the build tool. Tailwind CSS is used for styling, and Lucide React for icons. State management is handled via React Hooks with data persistence managed through localStorage.

The core of the system is a 7-phase coaching cycle:
1.  **Phase 1 - The Intake**: Includes a welcome screen, an AI-driven interview to understand distractions and aspirations, and a Stoic Coach reflection.
2.  **Phase 2 - Goal Contract**: Users define a single goal, which the AI validates for alignment with aspirations using keyword analysis across four domains (business, fitness, learning, creative), followed by a digital commitment.
3.  **Phase 3 - Weekly Plan**: The AI generates 2-3 context-aware habits based on the validated goal.
4.  **Phase 4 - The "Do" Week**: The main dashboard for habit tracking, daily check-ins, stats, and streak monitoring.
5.  **Phase 5 - Weekly Progress**: A review mechanism using positive language (Keep, Challenged, Progress) based on weekly performance, with AI suggestions for adjustments.
6.  **Phase 6 - Accountability**: Features for sharing commitments via social channels (WhatsApp/iMessage/SMS).
7.  **Phase 7 - The Loop**: Users cycle back to Phase 4 with an optimized plan.

**UI/UX Decisions:**
-   **Aesthetic**: Dark mode "Focus Dojo" theme.
-   **Interaction**: Intuitive habit tracking, drag-and-drop reordering, multiple calendar views (week, month, year).
-   **Gamification**: AI Coach reactions, streak celebrations (confetti modals for milestones), unified daily check-ins with reflection and AI chat.
-   **Positive Reinforcement**: Emphasis on celebrating wins, supportive language for challenges, and positive framing (e.g., "Challenged" instead of "Problem").

**Technical Implementations:**
-   **Habit Tracking**: Supports daily, weekly, and custom frequency habits.
-   **Stats Dashboard**: Provides comprehensive weekly analysis, completion rates, streak breakdowns, and heatmaps.
-   **AI Integration**: Simulated AI for goal validation, habit generation, real-time motivational reactions, and tailored responses based on user reflections.
-   **Data Persistence**: All user data, including habits, goals, chat entries, reflections, and streak progress, is saved in localStorage.
-   **`createdAt` Field Contract**: Habits include a `createdAt` Unix timestamp (milliseconds) for accurate scheduling, streak history, and stats computation. This field is critical for correct "repeats every X days" scheduling and efficient historical data lookups.

## External Dependencies
-   **Frontend Framework**: React 18
-   **Build Tool**: Vite 5
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Replit environment (configured for port 5000 and `0.0.0.0` host)

## Recent Changes
- **2025-11-17**: UI Navigation and Toggle Improvements
  - **View Toggle Redesign**: Changed Simple/Weekly toggle to icon-only dual-button design (both icons always visible, active one highlighted in blue)
  - **Page Indicators**: Blue-highlighted List icon appears on top right when on Habit Tracker page
  - **Stats Dashboard Icon**: BarChart icon highlights in blue when viewing Stats Dashboard
  - **Conditional Toggle Display**: View mode toggle only appears on Habit Tracker page (hidden when viewing Stats)
  - **Toggle Positioning**: View toggle centered below "Mastery Dashboard" description
  - **Removed Weekly Review**: Removed InlineWeeklyReview component and TrendingUp icon

- **2025-11-17**: Unified Daily Check-In
  - Merged Reflection Journal into Chat interface for single daily touchpoint
  - Full-page rounded-corner container design (removed centered modal)
  - Embedded ReflectionCard component with gradient design
  - AI motivational responses tailored to reflection answers
  - User-controlled access via Sparkles icon (no automatic popups)
  - **Bug Fix**: Edit Reflection now pre-populates form with existing answer and reasoning instead of starting fresh
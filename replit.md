# Mastery Dashboard

## Overview
**Path - Self Mastery** is a gamified, AI-powered habit coaching program designed to guide users through a 7-phase coaching cycle: Intake, Goal Contract, Plan, Do, Review, Accountability, and Loop. The application aims to provide an engaging and effective platform for habit formation, leveraging a "Duolingo for Habit Forming" model with a dark mode "Focus Dojo" aesthetic. It emphasizes positive reinforcement and a comprehensive onboarding process to combat common pitfalls in habit formation.

## User Preferences
I want to enable the AI to make changes to my codebase. I prefer detailed explanations. I want iterative development. I prefer simple language. I prefer that you ask me before making major changes. I like functional programming.

## System Architecture
The application is a single-page application (SPA) built with React 18 and TypeScript, using Vite 5 as the build tool. Tailwind CSS is used for styling, and Lucide React for icons. State management is handled via React Hooks with data persistence managed through localStorage.

**Backend API Server:**
-   Express server on port 3001 for YouTube metadata validation
-   YouTube Data API v3 integration for fetching real video metadata (title, channel, duration)
-   Strict 480-second (8-minute) enforcement at API level to prevent incorrect durations
-   API key stored securely in Replit Secrets (never exposed to browser)
-   Vite proxy configuration routes `/api/*` to backend in dev mode

The core system follows a 7-phase coaching cycle: Intake, Goal Contract, Weekly Plan, The "Do" Week, Weekly Progress, Accountability, and The Loop.

**UI/UX Decisions:**
-   **Aesthetic**: Dark mode "Focus Dojo" theme with improved readability.
-   **Interaction**: Intuitive habit tracking, drag-and-drop reordering, multiple calendar views, floating "Now GO!" completion popup.
-   **Gamification**: AI Coach reactions, streak celebrations, unified daily check-ins with reflection and AI chat.
-   **Onboarding**: Multi-phase onboarding with conversational AI, a logic tree builder ("The Architect"), interstitial wisdom screens, and coach feedback. Includes a mandatory 60-second "Micro-Win Protocol" and an interactive app tour.
-   **Daily Check-in**: Unified within a chat interface with AI motivational responses.
-   **Vision Check**: Users visualize the complete pathway (action → milestone → goal).
-   **Discipline Engine Visuals**: Path-focused UI with past dates dimmed, and information toasts for unloggable habits.

**Technical Implementations:**
-   **Default Starter Habits**: 4 pre-configured habits including an "Ignite" anchor habit that auto-completes with the Momentum Generator.
-   **Habit Tracking**: Supports daily, weekly, and custom frequency habits.
-   **AI Integration**: Simulated AI for goal validation, habit generation, real-time motivational reactions, tailored responses, and conversational goal understanding with customizable persona calibration (Drill Sergeant, Hype Man, Wise Mentor).
-   **Conversational Logic Tree**: Chat interface for building milestone and daily action pathways.
-   **Discipline Engine - Urgency System**: Implements tiered logging windows for Anchor (same-day), Life Goal (2-day), and Regular habits (backfill anytime).
-   **Emergency Latch**: "I'm Overwhelmed" toggle to reduce strict habits to 60-second micro-wins.
-   **Streak Repair**: Auto-detection of broken streaks with an instant redemption flow.
-   **Enhanced Dark Timer**: Blind execution mode for countdown timers with minimal UI for focus.
-   **Smart Notification System**: Per-habit time picker, browser notifications with escalation logic, and "Hold-to-Ignite" modal for direct-to-action.
-   **Engine A Mini-Apps (Mental Exercise System)**: Immersive full-screen mini-app experiences like BreathPacer and JournalModule, linkable to habits.
-   **Program Library**: Pre-packaged habit programs for batch creation, browsable via a dedicated interface, with initial programs like Morning Starter, Deep Morning, Quick Reset, and Gratitude Practice.
-   **Momentum Generator**: A 7-step daily ritual including:
    -   **Streak**: Radial firework celebration.
    -   **Vision**: Goal display.
    -   **Video**: Mixed-length educational content library (4-8 minutes max) teaching how to START habits using Atomic Habits and Tiny Habits methodology. Smart weekend scheduling: shorter clips (4-6 min) Monday-Friday for quick wins, longer deep dives (7-8 min) Saturday-Sunday for comprehensive learning. YouTube iframe API integration with failsafe error handling.
    -   **Reflection**: Daily question tailored to each video's content.
    -   **Habits**: Pre-generated and user's life goal habits.
    -   **Pledge**: Interactive hold-to-commit button.
    -   **Launch**: 60-second countdown in dark timer mode.
    -   Automatically marks the "Ignite" anchor habit as complete.
-   **Data Persistence**: All user data (habits, goals, chat entries, reflections, streak progress, onboarding phase, logic tree, micro-win, app tour completion, emergency mode, notification schedules, mini-app types, journal entries, program library selections, momentum generator content) is saved in localStorage.
-   **`createdAt` Field Contract**: Habits include a `createdAt` Unix timestamp.
-   **Quick Navigation**: Home and Target icons for quick access to key phases.

## External Dependencies
-   **Frontend Framework**: React 18
-   **Build Tool**: Vite 5
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Replit environment
-   **Video Embedding**: YouTube oEmbed API / YouTube iframe API
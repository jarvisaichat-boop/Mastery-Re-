# Mastery Dashboard

## Overview
**Path - Self Mastery** is a gamified, AI-powered habit coaching program designed to guide users through a 7-phase coaching cycle: Intake, Goal Contract, Plan, Do, Review, Accountability, and Loop. The application aims to provide an engaging and effective platform for habit formation, leveraging a "Duolingo for Habit Forming" model with a dark mode "Focus Dojo" aesthetic.

## Recent Changes (November 22, 2025)
-   **CRITICAL FIX - "Seize the Day" Popup Flash**: Fixed bug where completion popup would flash briefly and disappear, showing "Mission Complete" instead. Root cause: `onComplete()` set `isCompletedToday=true`, immediately switching modal to completion screen. Fix: (1) Used ref (`countdownCompletedRef`) to persist popup state across re-renders, (2) Prevented "Mission Complete" screen from rendering while popup is visible.
-   **CRITICAL FIX - Ignite Habit Scheduling**: Fixed root cause where Ignite habit with `frequencyType: 'daily'` wasn't recognized by `isHabitScheduledOnDay` (which only checked for 'Everyday'). This single fix resolved THREE user-reported issues:
    1. ✅ Ignite checkmarks now display when auto-completed after Momentum Generator
    2. ✅ Week circles show proper dimming (current week stays bright, only past weeks dim if incomplete)
    3. ✅ Discipline Engine properly recognizes Ignite as scheduled for all strictness rules
-   **Subtle Video Skip UI**: Moved skip button to bottom with small gray text to discourage skipping while maintaining failsafe for genuine loading errors.
-   **Optional Reflection Question**: When video is skipped or fails to load, the reflection question becomes optional - users can continue without answering since there's no content to reflect on.
-   **Momentum Generator Video Library**: Reduced to 4 verified TED talks (all exactly 3 minutes) from official "TED in 3 Minutes" playlist to ensure all videos are under 5 minutes and embeddable.
-   **Ignite Habit Persistence**: Fixed critical bug where momentum completion wasn't persisting to localStorage - now includes immediate localStorage write for both momentum timestamp and Ignite habit completion.
-   **Vision Card Sizing**: Fixed visual glitch where vision card would jump from empty to full size by generating random content synchronously before step transition.
-   **YouTube Error Handling**: Complete failsafe system to prevent users from getting blocked:
    -   Always-visible skip button with prominent styling in highlighted yellow box
    -   Smart 15-second timeout that only triggers if playback never starts (not during normal viewing)
    -   Proper state resets on every modal open/close to ensure failsafe works on every session
    -   Manual skip and automatic timeout both enable Continue button after answering reflection question
-   **Content Library Migration**: Version 9 with improved function ordering (saveContentLibrary before loadContentLibrary) to prevent runtime hoisting errors.

## User Preferences
I want to enable the AI to make changes to my codebase. I prefer detailed explanations. I want iterative development. I prefer simple language. I prefer that you ask me before making major changes. I like functional programming.

## System Architecture
The application is a single-page application (SPA) built with React 18 and TypeScript, using Vite 5 as the build tool. Tailwind CSS is used for styling, and Lucide React for icons. State management is handled via React Hooks with data persistence managed through localStorage.

The core system follows a 7-phase coaching cycle: Intake, Goal Contract, Weekly Plan, The "Do" Week, Weekly Progress, Accountability, and The Loop.

**UI/UX Decisions:**
-   **Aesthetic**: Dark mode "Focus Dojo" theme with improved readability.
-   **Interaction**: Intuitive habit tracking, drag-and-drop reordering, multiple calendar views.
-   **Gamification**: AI Coach reactions, streak celebrations, unified daily check-ins with reflection and AI chat.
-   **Positive Reinforcement**: Emphasis on celebrating wins and supportive language.
-   **Onboarding**: Comprehensive multi-phase onboarding with conversational AI for goal understanding, a logic tree builder ("The Architect" phase), interstitial wisdom screens, and coach feedback.
-   **Daily Check-in**: Unified daily check-in within a chat interface, with AI motivational responses.
-   **Vision Check**: Users visualize the complete pathway (action → milestone → goal) before proceeding.
-   **Micro-Win Protocol**: A mandatory 60-second action immediately after onboarding to combat "Planning Trap".
-   **App Tour**: Interactive overlay system with spotlights and tooltips guiding users through key dashboard features.
-   **Discipline Engine Visuals**: Subtle, path-focused UI with past dates at 15% opacity, current and future dates at normal brightness. Information toasts provide friendly explanations for unloggable habits.

**Technical Implementations:**
-   **Default Starter Habits**: 4 pre-configured habits for all users: Morning Movement, Deep Work Session, Evening Reflection (Life Goal Habits), and **Ignite** (Anchor Habit - auto-completes when Momentum Generator finishes).
-   **Habit Tracking**: Supports daily, weekly, and custom frequency habits.
-   **AI Integration**: Simulated AI for goal validation, habit generation, real-time motivational reactions, tailored responses, and conversational goal understanding, with persona calibration (Drill Sergeant, Hype Man, Wise Mentor).
-   **Conversational Logic Tree**: A chat interface for building milestone and daily action pathways, with AI tone adapting to selected persona.
-   **Discipline Engine - Urgency System**:
    -   **Anchor Habit**: Same-day logging only (24-hour window).
    -   **Life Goal Habit**: 2-day logging window (scheduled day + next day).
    -   **Regular Habit**: Backfill anytime.
-   **Emergency Latch**: An "I'm Overwhelmed" toggle to shrink strict habits to 60-second micro-wins, triggered by a button in the dashboard header.
-   **Streak Repair**: Auto-detection of broken streaks with an instant redemption flow (60-second action) respecting the three-tier urgency system.
-   **Enhanced Dark Timer**: Blind execution mode for countdown timers with a black background and minimal UI to encourage focus on action. Includes an "I'm Doing It!" button for immediate commitment.
-   **Smart Notification System**:
    -   Optional per-habit notification time picker.
    -   Browser notification management with escalation logic (Gentle, Urgent, Buzzing).
    -   "Hold-to-Ignite" modal for direct-to-action flow triggered by notification clicks.
    -   Clean architecture for potential React Native migration.
-   **Engine A Mini-Apps (Mental Exercise System)**: Habits can be linked to immersive full-screen mini-app experiences.
    -   **BreathPacer**: Immersive 4-second box breathing with animation, audio, and vocal cues.
    -   **JournalModule**: Typewriter-style gratitude journaling with prompts and word count tracking.
    -   Mini-app selection integrated into the Add Habit Modal.
-   **Program Library**: Pre-packaged habit programs for instant habit creation.
    -   **Browse Button**: "Browse Program Library" CTA in Add Habit Modal opens full-screen program browser.
    -   **Program Grid**: Visual cards showing program name, description, difficulty, category, and habit count.
    -   **Program Detail**: Clicking program reveals all included habits with descriptions and mini-app badges.
    -   **Multi-Select**: Users can select all habits or cherry-pick specific ones via checkboxes.
    -   **Batch Creation**: Selected habits instantly added to dashboard with mini-apps pre-configured.
    -   **Initial Programs**: Morning Starter, Deep Morning, Quick Reset, Gratitude Practice (4 programs with 1-2 habits each).
    -   **Habit Tracking**: sourceProgramId field tracks which program habits came from for future analytics.
    -   **Success Feedback**: Toast notification confirms habit additions ("Added 2 habits from program!").
-   **Momentum Generator**: 7-step daily ritual transforming passive tracking into active execution.
    -   **Streak**: Radial firework burst celebration effect (30 particles bursting outward in all directions).
    -   **Vision**: Goal display with "Your Everyday Reminder" section showing grand vision/aspirations.
    -   **Video**: "Today's Lesson" with YouTube iframe API integration, channel name display, completion tracking, 10-second timeout with manual "Continue Anyway" override.
    -   **Reflection**: Daily question with text input.
    -   **Habits**: 3 pre-generated starter habits (Morning Movement, Deep Work, Evening Reflection) with micro-wins + user's life goal habits merged.
    -   **Pledge**: Hold-to-commit interactive button with mouse and touch support, progress ring animation, haptic feedback.
    -   **Launch**: 60-second countdown with dark timer mode, 3-2-1 pre-countdown.
    -   **Transitions**: Smooth 700ms synchronized transitions between all steps.
    -   **Auto-Tracking**: Completing the Launch Pad automatically marks the "Ignite" anchor habit as complete for the day.
-   **Data Persistence**: All user data (habits, goals, chat entries, reflections, streak progress, onboarding phase, logic tree, micro-win, app tour completion, emergency mode, notification schedules, mini-app types, journal entries, program library selections, momentum generator content) is saved in localStorage.
-   **`createdAt` Field Contract**: Habits include a `createdAt` Unix timestamp.
-   **Quick Navigation**: Home and Target icons for quick access to key phases.

## External Dependencies
-   **Frontend Framework**: React 18
-   **Build Tool**: Vite 5
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Replit environment
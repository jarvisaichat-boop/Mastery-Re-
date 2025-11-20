# Mastery Dashboard

## Overview
**Path - Self Mastery** is a gamified, AI-powered habit coaching program designed to guide users through a 7-phase coaching cycle: Intake, Goal Contract, Plan, Do, Review, Accountability, and Loop. The application aims to provide an engaging and effective platform for habit formation, leveraging a "Duolingo for Habit Forming" model. It features a dark mode "Focus Dojo" aesthetic.

## User Preferences
I want to enable the AI to make changes to my codebase. I prefer detailed explanations. I want iterative development. I prefer simple language. I prefer that you ask me before making major changes. I like functional programming.

## System Architecture
The application is a single-page application (SPA) built with React 18 and TypeScript, using Vite 5 as the build tool. Tailwind CSS is used for styling, and Lucide React for icons. State management is handled via React Hooks with data persistence managed through localStorage.

The core system follows a 7-phase coaching cycle:
1.  **The Intake**: AI-driven interview for aspirations and distractions, includes a Stoic Coach reflection.
2.  **Goal Contract**: AI-validated goal definition using keyword analysis across four domains (business, fitness, learning, creative).
3.  **Weekly Plan**: AI generates 2-3 context-aware habits based on the validated goal.
4.  **The "Do" Week**: Main dashboard for habit tracking, daily check-ins, stats, and streak monitoring.
5.  **Weekly Progress**: Review mechanism using positive language (Keep, Challenged, Progress) with AI suggestions.
6.  **Accountability**: Features for sharing commitments via social channels.
7.  **The Loop**: Users cycle back to Phase 4 with an optimized plan.

**UI/UX Decisions:**
-   **Aesthetic**: Dark mode "Focus Dojo" theme with improved readability through larger text, better contrast, and cleaner backgrounds.
-   **Interaction**: Intuitive habit tracking, drag-and-drop reordering, multiple calendar views.
-   **Gamification**: AI Coach reactions, streak celebrations (confetti modals), unified daily check-ins with reflection and AI chat.
-   **Positive Reinforcement**: Emphasis on celebrating wins and supportive language for challenges.
-   **Onboarding**: Comprehensive multi-phase onboarding with conversational AI for goal understanding, logic tree builder ("The Architect" phase), interstitial wisdom screens, and coach feedback.
-   **Daily Check-in**: Unified daily check-in within a chat interface, with AI motivational responses.

**Technical Implementations:**
-   **Habit Tracking**: Supports daily, weekly, and custom frequency habits.
-   **Stats Dashboard**: Provides comprehensive weekly analysis, completion rates, streak breakdowns, and heatmaps.
-   **AI Integration**: Simulated AI for goal validation, habit generation, real-time motivational reactions, tailored responses, and conversational goal understanding.
-   **Onboarding Flow** (Restructured November 17, 2025):
    -   **Phase 1 - Context Baseline**: 3 screens (Context, Spark, Profile) - simplified from 6 screens
    -   **Phase 2 - Deep Discovery**: Collects archetype, fuel, saboteur
    -   **Phase 3 - Logistics**: Collects golden hour preference
    -   **Phase 5 - Synthesis**: AI persona calibration (Drill Sergeant/Hype Man/Wise Mentor) based on collected profile data
    -   **Phase 4 - The Architect**: 4 screens including goal input, existing habits, conversational logic tree builder, and vision check
    -   **Phase 6 - Negotiation**: Habit suggestions based on logic tree daily action
    -   **Phase 7 - Contract**: Final commitment
-   **Conversational Logic Tree** (November 2025):
    -   **ConversationalArchitect Component**: Consultant-style chat interface in Phase 4 Screen 3 that builds milestone + daily action pathway
    -   **Persona Integration**: AI tone adapts based on Phase 5 selection (Drill Sergeant: tactical/direct, Hype Man: energetic/motivational, Wise Mentor: reflective/patient)
    -   **Context Awareness**: References existing habits in conversation opener
    -   **Slot Tracking**: Validates milestone (measurable checkpoint) and action (daily practice) through multi-turn dialogue
    -   **Data Flow**: Logic tree outputs (logicTreeBranch/Leaf) feed directly into Phase 6 habit suggestions
-   **Vision Check**: Phase 4 Screen 4 asks users to visualize the complete pathway (action → milestone → goal) before proceeding
-   **Micro-Win Protocol** (November 18, 2025):
    -   **7-Step Cold Start Solution**: Mandatory 60-second action immediately after onboarding to combat "Planning Trap"
    -   **Flow**: Education → Instruction (shrink to 60s) → Consensus ("I am gonna do it!") → Trigger → Execution (countdown timer) → Victory → Momentum Push
    -   **Dual Victory Paths**: Success measured by action, not duration - both timer completion AND expiry show green victory screen
    -   **Psychology**: "Effort = Win" - celebrates showing up regardless of whether user completes within 60 seconds
    -   **Integration**: Fires between onboarding completion and dashboard access, uses Life Goal habit as anchor action
    -   **Auto-Advance**: Timer expiry automatically transitions to victory screen via useEffect
    -   **UI Pattern**: Steps 1-4, 6-7 render as floating modal overlays on top of dashboard; Step 5 (timer) remains full-screen for urgency
    -   **Preview Mode**: Zap icon (⚡) in top-left corner allows manual preview of protocol; preview mode includes X button to dismiss
    -   **First-Time Flow**: During automatic post-onboarding trigger, modal cannot be dismissed to ensure completion
-   **App Tour** (November 19, 2025):
    -   **Interactive Overlay System**: Spotlights real UI elements on actual dashboard instead of showing mockups
    -   **3 Tour Stops**: Habit Tracker list → Daily Check-in button (Sparkles) → Stats Dashboard view
    -   **Spotlight Effect**: Dimmed backdrop with blue border cutout highlighting active element
    -   **Floating Tooltips**: Text bubbles with arrows pointing to real features, positioned above/below spotlighted elements
    -   **Auto-View Switching**: Tour automatically toggles to Stats view for stop 3, resets to Habit Tracker on completion
    -   **Navigation**: Next button, skip button (X), progress dots showing current/completed steps
    -   **Integration**: Renders as overlay on top of dashboard, receives dashboard state controls via props
    -   **Preview Access**: Blue book icon (📖) in top-left corner allows manual tour preview anytime
-   **Discipline Engine: Phase 1 - Foundation Enhancements** (November 20, 2025):
    -   **Three-Tier Urgency System**: Different logging windows based on habit type
        -   **Anchor Habit** (Habit Muscle 💪): Same-day only (24-hour window)
            -   Can ONLY be logged on the calendar day it was scheduled
            -   Locks at midnight - no backfilling allowed
            -   Shows "TODAY ONLY" badge when uncompleted
            -   Designed to build strict discipline muscle
        -   **Life Goal Habit** (Life Goals ⭐): 72-hour window (scheduled day + 48 hours)
            -   Can be logged for the entire scheduled day plus 48 more hours
            -   Monday habit loggable until Wednesday 11:59pm
            -   Shows countdown timer ("Xh left") when uncompleted
            -   Balances urgency with realistic grace period
        -   **Regular Habit**: Backfill anytime
            -   No time restrictions - can log any past date
            -   Perfect for casual tracking and experimentation
            -   No urgency pressure, just stats collection
    -   **Emergency Latch**: "I'm Overwhelmed" toggle that shrinks strict habits to 60-second micro-wins
        -   **UI**: Prominent button in dashboard header with Shield icon, red when active
        -   **Behavior**: When active, clicking any uncompleted Anchor/Life Goal habit opens Emergency Habit Action modal with 60s countdown
        -   **Scope**: Only affects strict habits (Anchor/Life Goal), Regular habits unaffected
        -   **Visual Indicator**: Red banner displays when Emergency Mode is active
        -   **Persistence**: Emergency Mode state saved in localStorage
    -   **Streak Repair**: Auto-detection of broken streaks with instant redemption flow (respects three-tier system)
        -   **Anchor Habits**: Triggers next morning if yesterday's habit was missed
        -   **Life Goal Habits**: Triggers after 72-hour window expires (checks up to 4 days back)
        -   **Regular Habits**: Never triggers (can backfill anytime)
        -   **Offer**: Modal prompts user to do 60-second action RIGHT NOW to save streak
        -   **Multi-Habit**: Iterates through all broken streaks sequentially
        -   **Once-Daily Check**: Uses localStorage flag to prevent repeated prompts on same day
    -   **Enhanced Dark Timer**: Blind execution mode for countdown timers
        -   **Implementation**: Micro-Win Protocol Step 5 now uses completely black background
        -   **Minimal UI**: Only shows subtle pulsing circle indicator, no visible countdown numbers
        -   **Psychology**: Removes clock-watching anxiety, encourages focus on action over time
    -   **Visual Indicators**: Subtle, path-focused UI that shows journey without blocking
        -   **Past Expired Dates**: Rendered at 15% opacity - barely visible but still part of the path
        -   **Future Dates**: Normal brightness - the path ahead remains clear and inviting
        -   **No Lock Icons**: System enforces rules silently without visual barriers
        -   **No Time Badges**: Clean interface without countdown pressure
        -   **Info Toast**: Clicking unloggable habits shows friendly explanation ("Goal habit is loggable for 48 hours" or "Habit Muscle is loggable for 24 hours")
        -   **Philosophy**: "Path not blocks" - motivating, not restrictive
-   **Data Persistence**: All user data (habits, goals, chat entries, reflections, streak progress, onboarding phase, logic tree, micro-win, app tour completion, emergency mode) is saved in localStorage.
-   **`createdAt` Field Contract**: Habits include a `createdAt` Unix timestamp for accurate scheduling and stats.
-   **Quick Navigation**: Home icon (jump to Phase 0) and Target icon (jump to Phase 4) in top-left corner.

## External Dependencies
-   **Frontend Framework**: React 18
-   **Build Tool**: Vite 5
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Replit environment (configured for port 5000 and `0.0.0.0` host)
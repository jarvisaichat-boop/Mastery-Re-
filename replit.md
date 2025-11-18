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
-   **Data Persistence**: All user data (habits, goals, chat entries, reflections, streak progress, onboarding phase, logic tree, micro-win completion) is saved in localStorage.
-   **`createdAt` Field Contract**: Habits include a `createdAt` Unix timestamp for accurate scheduling and stats.
-   **Quick Navigation**: Home icon (jump to Phase 0) and Target icon (jump to Phase 4) in top-left corner.

## External Dependencies
-   **Frontend Framework**: React 18
-   **Build Tool**: Vite 5
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Replit environment (configured for port 5000 and `0.0.0.0` host)
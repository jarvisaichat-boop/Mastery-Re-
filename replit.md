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
- **2025-11-17**: The Architect Phase - Logic Tree Breakdown (STRATEGIC MASTERSTROKE)
  - **NEW PHASE 4 - THE ARCHITECT**: Inserted between Logistics and Synthesis, transforming onboarding from "Setup Wizard" into "Strategy Session"
  - **The "Doctor Frame" (Authority)**: AI takes control by building a logical breakdown that proves the goal is achievable
  - **The Logic Tree**: Visual breakdown showing Root (Goal) → Branch (Milestone) → Leaf (Action) with user input
  - **Reality Check Screen**: Users define specific metric (e.g., "$10k/mo", "10% Body Fat") to eliminate "blank canvas paralysis"
  - **Logic Tree Builder**: Interactive tree diagram with user-filled milestones and actions, creating psychological investment
  - **Agreement Screen**: Users commit to the logic: "Does this logic hold up? Do you agree that consistent [Action] makes [Goal] realistic?"
  - **The "Sunk Cost" Investment**: By spending 3-5 minutes building logic tree, users become invested and unlikely to abandon app
  - **The "Aha Moment"**: Users realize "This system is smarter than me. I should listen to it."
  - **Bridge Quote**: "Vague goals die. Logical systems survive. Let's deconstruct your vision."
  - **Phase Renumbering**: Previous Phase 4 (Synthesis) → Phase 5, Phase 5 (Negotiation) → Phase 6, Phase 6 (Contract) → Phase 7
  - **New 7-Phase Flow**: Manifesto → Download → Deep Discovery → Logistics → **👉 ARCHITECT** → Negotiation → Contract
  - **Type System**: Added specificMetric, logicTreeRoot, logicTreeBranch, logicTreeLeaf, agreedToLogic fields to MasteryProfile

- **2025-11-17**: Enriched Onboarding Module - "Pulse & Punch" UI Pattern (MAJOR ENHANCEMENT)
  - **BridgeScreen Component**: Interstitial wisdom screens between phases with philosophical quotes and "Tap Anywhere to Continue" interaction
  - **CoachFeedback Component**: Toast/overlay notifications that trigger after specific user selections (e.g., selecting "Perfectionist" shows "Perfectionism is fear. We'll fix this with 'Stupid Small' micro-habits.")
  - **Golden Wisdom Headers**: Small yellow uppercase text headers above main questions throughout all phases for added guidance
  - **MBTI Text Field**: Added optional "My MBTI is..." input field to Phase 2 Archetype screen for enhanced personality profiling
  - **Phase-specific Bridges**: Added 7 wisdom bridges with quotes like:
    - Phase 1: "To guide you, I need to know the terrain. Your past struggles are data, not failures."
    - Phase 2: "Discipline is an Ecosystem. Let's align your Personality & Environment."
    - Phase 3: "Time management is a myth. Energy management is reality."
    - Phase 5: "A plan you can't stick to is a fantasy. Let's be real."
  - **Refined Content**: Updated all question text, sub-headers, and copy to match detailed specification
  - **Enhanced Phase 1**: Now includes 3 bridge screens interwoven with 5 content screens (Context Injection, Spark & Profile combined, North Star, Deep Dive, Baseline)
  - **Enhanced Phase 2**: Added bridge, MBTI field, and feedback trigger for Perfectionist selection
  - **Enhanced Phase 3**: Consolidated bio-clock and structure into single screen, added bridge
  - **Enhanced Phase 4**: Updated synthesis text to match spec: "[Name], you are a [Archetype] driven by [Fuel]. Your [Saboteur] is the risk. We will stack habits during [Golden Hour]."
  - **Enhanced Phase 5**: Added bridge before negotiation, refined "Too Hard" downgrade messaging
  - **Type Safety**: Added 'GOAL' to mentalState union type and 'mbti' field to MasteryProfile
  - **UX Polish**: Smooth transitions, auto-dismissing toasts (3s duration), and consistent visual hierarchy

- **2025-11-17**: Onboarding Preview Mode (Dev Feature)
  - **Preview Button**: Top-left ⟲ icon on dashboard allows previewing onboarding without data loss
  - **Exit to Dashboard**: Blue "Exit to Dashboard" button appears in top-right during preview
  - **Data Safety**: Preview mode does not clear localStorage - all habits and data preserved
  - **Testing Tool**: Developers can test onboarding flow repeatedly without resetting progress
  - **Auto-Save Still Works**: Profile and phase data continue to save automatically during preview

- **2025-11-17**: Save/Resume Onboarding Functionality
  - **Phase Persistence**: Current onboarding phase now saved to localStorage
  - **Auto-Resume**: Users return to exact phase they were on when reloading page
  - **Data Preservation**: All answers and selections persist across browser refreshes
  - **Smart Cleanup**: Both profile and phase data cleared when onboarding completes
  - **User Experience**: Can exit onboarding at any time and return days later to same spot

- **2025-11-17**: Comprehensive Mastery Onboarding Module (MAJOR FEATURE)
  - **Complete Replacement**: Built comprehensive 7-phase onboarding system replacing simple onboarding
  - **Phase 0 - Manifesto**: 3-slide carousel introducing philosophy (willpower myth, science, promise) with smooth transitions
  - **Phase 1 - The Download**: 8 screens collecting context dump, mental state (SPARK/STUCK/CURIOUS/GOAL), identity (name/occupation), north star goal with timeline, deep dive reasoning, and existing habits marked as "Safe"
  - **Phase 2 - Deep Discovery**: 5 screens for psychological profiling using card-based selection UI
    - Archetype selection (Commander/Monk/Warrior/Explorer) with MBTI field
    - Fuel type (Glory/Fear) - determines AI coach persona (Hype Man vs Drill Sergeant)
    - Saboteur identification (Perfectionist/Distraction/Exhaustion/Time Scarcity)
    - Stakes assessment (Stagnant/Regressing/No-Think) with heavy red visual treatment
  - **Phase 3 - Logistics**: 3 screens for time audit and scheduling
    - Bio-clock with wake/sleep time pickers and low battery warnings
    - Structure scan for weekday/weekend routines
    - Golden hour selection (Morning/Lunch/After Work/Late Night)
  - **Phase 4 - The Architect**: 3 screens for logic tree breakdown (NEW!)
    - Reality Check: Define specific metric for goal
    - Logic Tree: Visual breakdown of Root → Branch → Leaf
    - Agreement: Psychological contract for logical pathway
  - **Phase 5 - Synthesis**: Displays collected profile summary and AI persona calibration
  - **Phase 6 - Negotiation**: 2 screens for habit proposal
    - Context-aware core habit generated from north star goal and golden hour
    - Accept/Too Hard interaction (downgrades 45min → 15min)
    - Non-negotiable "Drink Water" habit displayed as read-only commitment
  - **Phase 7 - Contract**: Commitment screen with checkboxes and "Sign & Enter Dojo" button
  - **Data Architecture**: MasteryProfile type system covering all collected data points
  - **Persistence**: Auto-save functionality via localStorage for all profile data
  - **Integration**: Seamlessly creates habits and transitions to main dashboard
  - **Bug Fix**: Fixed Phase 2 navigation - primer screen now allows progression with proper canProceed() logic

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
  - **Chat Persistence**: Daily chat messages now saved to localStorage per date - conversations persist when closing/reopening Daily Check-In
  - **Bug Fix #1**: Edit Reflection now pre-populates form with existing answer and reasoning instead of starting fresh
  - **Bug Fix #2**: Added "Change" button in celebration box to allow changing answer selection while preserving reasoning text
  - **Bug Fix #3**: Chat messages now persist when editing reflections (no longer cleared on edit/save)
  - **Bug Fix #4**: AI only generates motivational message for new reflections, not when editing existing ones
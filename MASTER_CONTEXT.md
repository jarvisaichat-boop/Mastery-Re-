# MASTER_CONTEXT.md - Path Self Mastery

> **Single Source of Truth** for project vision, architecture, and design patterns.
> Check this file before writing any code.

## Documentation Index
| Feature | Details |
|---------|---------|
| Momentum Generator | [docs/momentum-generator.md](docs/momentum-generator.md) |

---

## Overview
**Path - Self Mastery** is a gamified, AI-powered habit coaching program designed to guide users through a 7-phase coaching cycle: Intake, Goal Contract, Plan, Do, Review, Accountability, and Loop. The application aims to provide an engaging and effective platform for habit formation, leveraging a "Duolingo for Habit Forming" model with a dark mode "Focus Dojo" aesthetic. It emphasizes positive reinforcement and a comprehensive onboarding process to combat common pitfalls in habit formation.

## User Preferences
I want to enable the AI to make changes to my codebase. I prefer detailed explanations. I want iterative development. I prefer simple language. I prefer that you ask me before making major changes. I like functional programming.

## System Architecture
The application is a single-page application (SPA) built with React 18 and TypeScript, using Vite 5 as the build tool. Tailwind CSS is used for styling, and Lucide React for icons. State management is handled via React Hooks with data persistence managed through localStorage.

**Backend API Server:**
-   Express server on port 3001 for YouTube metadata validation and search
-   YouTube Data API v3 integration for:
    * Fetching real video metadata (title, channel, duration)
    * Searching for habit-formation videos with automatic filtering
-   Strict 480-second (8-minute) enforcement at API level to prevent incorrect durations
-   API key stored securely in Replit Secrets (never exposed to browser)
-   Vite proxy configuration routes `/api/*` to backend in dev mode
-   Endpoints:
    * `/api/youtube/metadata` - Verify single video by URL
    * `/api/youtube/search` - Search YouTube and filter results ≤8 minutes
    * `/api/health` - Health check

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
-   **Momentum Generator**: 8-step daily ritual (Streak → Vision → Video → Reflection → Goal → Habit → Starter Action → Pledge/Launch) that transforms passive tracking into active execution. Automatically marks "Ignite" anchor habit complete. → [Detailed docs](docs/momentum-generator.md)
-   **Data Persistence**: All user data (habits, goals, chat entries, reflections, streak progress, onboarding phase, logic tree, micro-win, app tour completion, emergency mode, notification schedules, mini-app types, journal entries, program library selections, momentum generator content) is saved in localStorage.
-   **`createdAt` Field Contract**: Habits include a `createdAt` Unix timestamp.
-   **Quick Navigation**: Home and Target icons for quick access to key phases.

## Future Planned Features

### Duolingo-Style Habit Formation Curriculum
**Goal**: Transform the Momentum Generator from a random video library into a **structured learning path** that progressively teaches habit formation, like Duolingo teaches languages. Instead of customizable recommendations (too chaotic) or infinite choice (paralysis), provide a **curated curriculum** that guides users from beginner to mastery.

**Core Philosophy**: "Too random is not helpful; too customizable means they can just use YouTube. This should be a curriculum - like a class teaching the discipline of the Path."

**Daily Lesson Flow**:
1. **Watch**: 4-8 minute micro-lesson on a specific habit formation technique (e.g., "The 2-Minute Rule")
2. **Reflect**: Answer a personalized question: "How will YOU use this technique TODAY to achieve your goal?"
3. **Apply**: User writes their specific implementation plan for that day
4. **Track**: Did they actually apply it? Builds curriculum completion streak

**Progressive Curriculum Structure**:
-   **Week 1-2: Foundations** - Habit loops, environment design, 2-minute rule, making habits obvious
-   **Week 2-3: Identity & Momentum** - Identity-based habits, habit stacking, celebration techniques
-   **Week 4-5: Advanced Techniques** - Temptation bundling, breaking bad habits, social accountability
-   **Week 6+: Mastery & Specialization** - Track-based paths (fitness, productivity, mental health, relationships)

**Key Features**:
-   **Sequential unlocking**: Cannot skip ahead; must complete each day's lesson
-   **Forced application**: Reflection questions require users to apply TODAY's teaching to THEIR specific goal
-   **Curriculum tracks**: Different learning paths based on user's primary goal (weight loss, business, relationships)
-   **Visual progress**: Duolingo-style streak tracking and course completion percentage
-   **Spaced repetition**: Key concepts resurface at optimal intervals for retention

**Implementation Notes**:
-   Build curriculum database with ~60-90 days of sequential lessons
-   Store user's curriculum progress in localStorage (current day, completion status, reflection answers)
-   Lock Momentum Generator to "today's lesson" (no random selection)
-   Create curriculum tracks aligned to common goal categories
-   Design reflection question templates that force specific, actionable daily plans
-   Track curriculum streak separately from habit completion streak

## External Dependencies
-   **Frontend Framework**: React 18
-   **Build Tool**: Vite 5
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Replit environment
-   **Video Embedding**: YouTube oEmbed API / YouTube iframe API
-   **Transcript Analysis**: youtube-transcript npm package
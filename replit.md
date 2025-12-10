# Mastery Dashboard

> **DO NOT DELETE OR RENAME THIS FILE**
> This `replit.md` file is automatically read by Replit Agent to understand project context, preferences, and architecture. Deleting or renaming it will break Agent's ability to work effectively on this project.
> See also: `MASTER_CONTEXT.md` for detailed project vision and roadmap.

---

## Overview

Mastery Dashboard is a gamified, AI-powered habit coaching application designed to guide users through structured behavior change. The app combines habit tracking with psychological coaching principles, featuring a multi-phase onboarding system, gamification mechanics (streaks, celebrations, micro-wins), and a "Momentum Generator" feature to help users overcome inertia and build consistent habits.

The application uses a dark "Focus Dojo" theme and emphasizes user psychology through archetypes, personalized AI coach personas, and structured coaching cycles.

## User Preferences

Preferred communication style: Simple, everyday language.

Additional preferences:
- Enable AI to make changes to the codebase
- Provide detailed explanations for changes
- Use iterative development approach
- Ask before making major architectural changes

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using functional components and hooks
- **Build Tool**: Vite 5 configured to run on port 5000
- **Styling**: Tailwind CSS with custom animations and a dark theme palette
- **Icons**: Lucide React for consistent iconography
- **Gestures**: react-swipeable for touch interactions in the Momentum Generator

### State Management Pattern
- Local React state (useState/useEffect) for component-level state
- No global state library - data flows through props
- Multiple localStorage keys prefixed with `mastery-dashboard-*` for persistent data:
  - Habits, user profiles, onboarding progress, reflections, streaks, daily reasons, content library

### Application Structure
- **Entry Point**: `src/App.tsx` - main orchestrator managing views, modals, and core state
- **Components**: Located in `src/components/` - feature-specific UI components
- **Onboarding Flow**: Multi-phase system in `src/components/mastery-onboarding/` (Phase 0-7)
- **Utilities**: `src/utils/` for date handling, logging, video recommendation, goal analysis
- **Services**: `src/services/NotificationService.ts` for browser notifications with escalation logic
- **Data**: `src/data/` contains program library and content library definitions

### Key Features Architecture
1. **Momentum Generator** (`MomentumGeneratorModal.tsx`): 8-step flow to build user momentum with a 3D flip card pledge system
2. **Discipline Engine**: Tiered logging windows based on habit strictness (Anchor, Life Goal, Regular)
3. **Micro-Win Protocol**: Fallback system for overwhelming days with 60-second action options
4. **Notification Escalation**: T-5 gentle → T-0 urgent → T+5 buzzing notification pattern

### Backend API Server
- Express.js server running on port 3001
- Vite proxy configuration routes `/api/*` requests to backend during development
- Currently handles YouTube Data API v3 integration for video metadata and search

## External Dependencies

### Third-Party Services
- **YouTube Data API v3**: Video metadata fetching and search for content library
- **youtube-transcript**: NPM package for fetching video transcripts (server-side)

### Browser APIs
- **Notification API**: Browser push notifications with permission management
- **Speech Synthesis API**: Voice guidance in Breath Pacer component
- **LocalStorage**: All persistent data storage (no database)

### Key NPM Dependencies
- `react`, `react-dom`: UI framework
- `express`, `cors`: Backend API server
- `lucide-react`: Icon library
- `react-swipeable`: Touch gesture handling
- `youtube-transcript`: Transcript fetching

### Development Dependencies
- `vite`, `@vitejs/plugin-react`: Build tooling
- `typescript`, `typescript-eslint`: Type safety
- `tailwindcss`, `autoprefixer`, `postcss`: CSS processing
- `eslint`, `eslint-plugin-react-hooks`: Code quality
# Mastery Dashboard

## Overview

Mastery Dashboard is a gamified, AI-powered habit coaching application designed to guide users through a structured 7-phase coaching cycle: Intake, Goal Contract, Plan, Do, Review, Accountability, and Loop. The app transforms habit building into an engaging, game-like experience with features like streak tracking, AI coach interactions, and a daily "Momentum Generator" ritual.

## User Preferences

Preferred communication style: Simple, everyday language.

Additional preferences:
- Enable AI to make changes to the codebase
- Provide detailed explanations for changes
- Use iterative development approach
- Ask before making major architectural changes

## System Architecture

**Frontend Stack:**
- React 18 with TypeScript as the UI framework
- Vite 5 for build tooling and development server (runs on port 5000)
- Tailwind CSS for styling with a dark "Focus Dojo" theme
- Lucide React for iconography
- Local Storage for all data persistence (no database currently)

**Backend API Server:**
- Express.js server running on port 3001
- YouTube Data API v3 integration for video metadata and search
- Vite proxy configuration routes `/api/*` requests to the backend during development
- API endpoints: `/api/youtube/metadata`, `/api/youtube/search`, `/api/health`

**State Management:**
- React useState/useEffect hooks for component-level state
- LocalStorage for persistent data (habits, user profiles, onboarding progress, reflections)
- Multiple localStorage keys prefixed with `mastery-dashboard-*` for different data domains

**Core Application Flow:**
- Multi-phase onboarding system (8 phases: Phase0-Phase7) that collects user psychology, logistics, and goals
- Main dashboard with week/month/year calendar views for habit tracking
- Gamification features: streak celebrations, AI coach reactions, micro-win protocol
- Discipline Engine with tiered logging windows based on habit strictness (Anchor, Life Goal, Regular)

**Key Feature Implementations:**
- Momentum Generator: 7-step daily ritual with video content, goal visualization, and habit selection
- Emergency Mode: "I'm Overwhelmed" toggle reduces all habits to 60-second micro-wins
- Streak Repair: Auto-detection and instant redemption flow for broken streaks
- Mini-Apps: Immersive experiences (BreathPacer, JournalModule) linkable to habits
- Program Library: Pre-packaged habit programs for batch creation
- Smart Notifications: Browser notifications with escalation logic (T-5 gentle → T-0 urgent → T+5 buzzing)
- Content Library: Curated educational videos with smart recommendation based on user habits

## External Dependencies

**Third-Party APIs:**
- YouTube Data API v3: Video metadata fetching and search functionality
- API key stored in Replit Secrets (never exposed to browser)
- 8-minute (480 seconds) maximum duration enforcement for videos

**NPM Packages:**
- `express` and `cors`: Backend API server
- `youtube-transcript`: YouTube transcript fetching
- `react-swipeable`: Touch gesture support for mobile interactions
- `lucide-react`: Icon library

**Browser APIs:**
- Notification API: Push notifications with permission management
- SpeechSynthesis API: Voice guidance in BreathPacer
- LocalStorage: All persistent data storage

**Data Storage:**
- All user data persists in browser localStorage
- No external database currently configured
- Content library includes default curated videos with option to add custom content
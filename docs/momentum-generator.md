# Momentum Generator - Detailed Documentation

## Overview
The Momentum Generator is a 7-step daily ritual that transforms passive habit tracking into active execution. It's the core feature that drives daily engagement and habit formation.

## Step-by-Step Flow

### Step 1: Streak Celebration
- Radial firework celebration animation
- Displays current streak count with visual flourish
- Builds momentum before the day starts

### Step 2: Vision Board
- Goal display with visual representation
- Reinforces the user's "why" before action
- Shows progress toward main life goal

### Step 3: Video Lesson
- **Duration**: Strictly 4-8 minutes maximum (enforced via YouTube Data API v3)
- **Content**: Educational videos on habit formation (Atomic Habits, Tiny Habits methodology)
- **Smart Recommendation Algorithm** considers:
  - User's habit categories
  - Journey stage (beginner/intermediate/advanced based on total habits + completion rate)
  - Watch history (30-day repetition avoidance)
  - Time of week (shorter videos weekdays, longer on weekends)
  - Content preferences
- **Video Tags**: contentType, lifeDomain, difficulty, emotion, techniques
- **Integration**: YouTube iframe API with failsafe error handling
- **Management**: Content Library Manager for curating videos

### Step 4: Reflection
- Daily question tailored to each video's content
- Forces user to apply learning to their specific goal
- Stored in localStorage for review

### Step 5: Goal Selection
- User selects their focus goal for the day
- Displays all active goals with visual cards
- No back navigation (prevents returning to video)

### Step 6: Habit Selection
- Shows pre-generated starter habits + user's life goal habits
- Card-based selection with consistent sizing (max-w-[280px])
- Supports back navigation to goals

### Step 7: Starter Action Selection
- Tiered approach options:
  - **Trap** - Environment design to trigger the habit
  - **Prep** - Pre-action that leads to the habit
  - **Direct** - Start the habit immediately
  - **Micro** - 60-second version of the habit
  - **Start** - Full habit execution
- Scrollable layout with fixed button at bottom

### Step 8: Pledge & Launch
- **Commitment Card**: Flip card showing goal + habit + starter action summary
- **Pledge**: Interactive hold-to-commit button
- **Launch**: 60-second countdown in dark timer mode
- **Auto-complete**: Marks "Ignite" anchor habit as complete

## UI/UX Design Patterns

### Layout Consistency
- All selection screens use consistent title positioning (`pt-8`)
- Responsive typography: `text-3xl sm:text-4xl md:text-5xl`
- Card sizing: `max-w-[280px]` for habit/goal cards

### Navigation
- Swipe gestures supported via `react-swipeable`
- Back arrows only on habit and starter-action steps
- No back from goal-selection (prevents video re-watching)

### Fixed Button Pattern
- All selection steps have fixed confirmation buttons at bottom
- Proper padding: `pb-32` for scrollable content, `pb-24` for cards
- Glowing effects on active buttons

### Commitment Card
- 3D flip animation with `transformStyle: 'preserve-3d'`
- Front: Summary of selections
- Back: Pledge interface
- `minHeight: 450px` for viewport fit

## Data Persistence

### localStorage Keys
- `mastery-dashboard-momentum-completed-{date}`: Daily completion status
- `mastery-dashboard-reflections`: Array of reflection entries
- `mastery-dashboard-video-history`: Watch history for repetition avoidance
- `mastery-dashboard-content-library`: Custom content preferences

## Backend Integration

### YouTube API Endpoints
- `POST /api/youtube/metadata` - Verify video URL, get metadata, check duration
- `POST /api/youtube/search` - Search videos with ≤8 minute filter
- `GET /api/health` - Health check

### Duration Enforcement
- All videos must be ≤480 seconds (8 minutes)
- Enforced at API level before video is accepted
- Frontend also validates before display

## Future: Curriculum Mode
See main MASTER_CONTEXT.md for planned Duolingo-style curriculum structure.

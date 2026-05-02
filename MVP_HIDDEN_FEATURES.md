# MVP Hidden Features

This file tracks every UI element or feature that has been intentionally hidden for the MVP launch. Code is **not deleted** — each section is commented out so it can be re-enabled post-MVP.

---

## 1. Browse Program Library Button

**Feature:** "Browse Program Library" button and the "or create custom habit" divider that appears below it at the top of the Create New Habit modal.

**Where it lives:**
- UI entry point: `src/components/AddHabitModal.tsx` (commented out block near line 315, inside the `{!habitToEdit && onOpenProgramLibrary && ...}` condition)
- Modal implementation: `src/components/ProgramLibraryModal.tsx`
- Data: `src/data/programLibrary.ts`

**What it does:** Lets users browse and bulk-add habits from pre-built programs (Morning Starter, Deep Morning, Quick Reset, Gratitude Practice). Clicking it opens `ProgramLibraryModal`, where the user picks a program, selects which habits to include, and adds them all at once.

**Why hidden for MVP:** Feature is not fully polished and the habit programs themselves are incomplete. Hiding keeps the modal clean and focused on custom habit creation.

**To re-enable:** Uncomment the block marked `MVP HIDDEN: Browse Program Library button` in `AddHabitModal.tsx`. The `onOpenProgramLibrary` prop and `ProgramLibraryModal` component remain fully wired up — no other code changes are needed.

---

## 2. Mini-App Experience Section

**Feature:** "Mini-App Experience (optional)" section inside the Create New Habit modal, containing the Breath Pacer and Journal option cards.

**Where it lives:**
- UI: `src/components/AddHabitModal.tsx` (commented out block near line 632, labelled `MVP HIDDEN: Mini-App Experience section`)
- Breath Pacer implementation: `src/components/BreathPacer.tsx` (or similar)
- Journal implementation: `src/components/JournalModule.tsx` (or similar)

**What it does:** Allows a habit to be linked to an immersive mini-app. When the user logs the habit, instead of a simple checkbox it opens either the Breath Pacer (guided breathing session) or Journal (gratitude writing prompt) full-screen experience.

**Why hidden for MVP:** The mini-app experiences are not ready for launch. Hiding the selector prevents users from enabling a partially complete feature.

**To re-enable:** Uncomment the block marked `MVP HIDDEN: Mini-App Experience section` in `AddHabitModal.tsx`. The underlying `miniAppType` state, data model, and mini-app components remain intact.

---

## 3. Phase 5 Onboarding — GM / GD / GN Routine Steps and Busy Day Plan

**Feature:** The Good Morning (GM), Good Day (GD), Good Night (GN) routine configuration steps and the Busy Day Plan step inside Phase 5 of onboarding.

**Where it lives:** `src/components/mastery-onboarding/Phase5Schedule.tsx` — render code is preserved and clearly marked with `MVP DEFERRED` comments. The steps `gm`, `gd`, `gn`, and `busy` are removed from the active `FLOW_STEPS` array and their `nextStep`/`prevStep` switch cases are commented out.

**What it does:** Walks users through building morning, daytime, and evening routines as part of their schedule, and creates a contingency plan for busy days.

**Why hidden for MVP:** These steps added significant complexity to the onboarding flow and were deferred to keep the MVP launch on schedule.

**To re-enable:** Restore the commented-out `nextStep`/`prevStep` switch cases and add `'gm'`, `'gd'`, `'gn'`, `'busy'` back to the `FLOW_STEPS` array in `Phase5Schedule.tsx`. The underlying Vision Board data model (`gmRoutine`, `gdRoutine`, `gnRoutine`, `busyDayPlan`) is untouched.

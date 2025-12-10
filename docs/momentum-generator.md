# Momentum Generator (Ignite) Feature

## Overview
The **Momentum Generator** (triggered by the "Ignite" button) is a core engagement feature designed to break user inertia and build immediate momentum through a structured 8-step flow.

## Product Philosophy
*   **State-Change Machine:** This feature is **NOT** a standard form wizard. Its sole purpose is to mechanically and psychologically ratchet the user from "stasis" (doing nothing) to "action".
*   **Lowering Barriers:** Steps like "Starter Action" exist solely to lower the activation energy.
*   **The Pledge as a Contract:** The Pledge step uses a **3D Flip Card** metaphor to separate the "Rational Review" (Front/System Check) from the "Emotional Contract" (Back/Lock In).

## Core Flow (8 Steps)
1.  **Streak**: Visual celebration of consistency.
2.  **Vision**: Reminds user of their "Why".
3.  **Video**: Daily lesson (4-8m) with reflection question.
4.  **Goal Focus**: User selects/confirms their primary goal category.
5.  **Habits**: User selects a specific "Life Goal Habit".
6.  **Starter Action**: User picks a low-friction entry point (5 Tiers: Trap, Prep, Direct, Start, Micro Win).
7.  **Pledge**: **Flip Card Interaction**.
    *   *Front*: System Check (Summary of Goal, Habit, Action).
    *   *Back*: "Make a Commitment" (Hold-to-Ignite button).
8.  **Launch**: 60-second immediate action countdown.

## Technical Details
-   **Component**: `MomentumGeneratorModal.tsx`
-   **State Management**: Local React state for steps (`currentStep`).
-   **Data**: Prioritizes user-defined "Life Goal Habits".
-   **Design**: Uses `react-swipeable` (potential future use) and CSS 3D transforms for the flip card.

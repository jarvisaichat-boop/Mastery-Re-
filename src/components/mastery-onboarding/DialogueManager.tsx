import { useState } from 'react';
import { Message } from './ConversationThread';
import { analyzeGoal, GoalContext } from '../../utils/goalUnderstanding';

export interface DialogueState {
  currentQuestion: string | null;
  awaitingClarification: boolean;
  context: GoalContext | null;
  messages: Message[];
  slot: string | null; // Which piece of information we're collecting
}

export function useDialogueManager(initialGoal?: string) {
  const [state, setState] = useState<DialogueState>({
    currentQuestion: null,
    awaitingClarification: false,
    context: initialGoal ? { originalGoal: initialGoal, clarified: false } : null,
    messages: [],
    slot: null,
  });

  const addMessage = (message: string, sender: 'ai' | 'user') => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `${Date.now()}-${Math.random()}`,
          message,
          sender,
          timestamp: Date.now(),
        },
      ],
    }));
  };

  const processGoalInput = (goal: string): boolean => {
    const analysis = analyzeGoal(goal);
    
    // Initialize context
    const newContext: GoalContext = {
      originalGoal: goal,
      clarified: !analysis.isAmbiguous,
    };

    setState(prev => ({
      ...prev,
      context: newContext,
    }));

    // If ambiguous, ask for clarification
    if (analysis.isAmbiguous && analysis.clarifyingQuestions.length > 0) {
      addMessage(analysis.clarifyingQuestions[0], 'ai');
      
      // Determine which slot we're filling
      let slot = 'goalType';
      if (analysis.ambiguityReasons.some(r => r.includes('timeframe'))) {
        slot = 'timeframe';
      } else if (analysis.ambiguityReasons.some(r => r.includes('unit') || r.includes('metric'))) {
        slot = 'specificMetric';
      }

      setState(prev => ({
        ...prev,
        awaitingClarification: true,
        currentQuestion: analysis.clarifyingQuestions[0],
        slot,
      }));

      return false; // Not ready to proceed
    }

    return true; // Goal is clear, can proceed
  };

  const handleClarification = (response: string) => {
    addMessage(response, 'user');

    if (!state.context || !state.slot) return false;

    const updatedContext = { ...state.context };

    // Update context based on slot
    switch (state.slot) {
      case 'goalType':
        if (/revenue|income|sales/i.test(response)) {
          updatedContext.goalType = 'revenue';
        } else if (/saving|save/i.test(response)) {
          updatedContext.goalType = 'savings';
        } else if (/fitness|weight|body/i.test(response)) {
          updatedContext.goalType = 'fitness';
        } else if (/learn|study/i.test(response)) {
          updatedContext.goalType = 'learning';
        }
        updatedContext.specificMetric = response;
        break;

      case 'timeframe':
        updatedContext.timeframe = response;
        break;

      case 'specificMetric':
        updatedContext.specificMetric = response;
        break;
    }

    // Check if we need more clarification
    const needsMore = !updatedContext.goalType || !updatedContext.timeframe;

    if (needsMore) {
      let nextQuestion = '';
      let nextSlot = '';

      if (!updatedContext.timeframe) {
        nextQuestion = 'And when do you want to achieve this by?';
        nextSlot = 'timeframe';
      } else if (!updatedContext.goalType) {
        nextQuestion = 'Got it. Can you tell me more about what type of goal this is?';
        nextSlot = 'goalType';
      }

      if (nextQuestion) {
        addMessage(nextQuestion, 'ai');
        setState(prev => ({
          ...prev,
          context: updatedContext,
          currentQuestion: nextQuestion,
          slot: nextSlot,
        }));
        return false;
      }
    }

    // All clarified!
    updatedContext.clarified = true;
    
    const summary = `Perfect! So we're working on: ${updatedContext.specificMetric || updatedContext.originalGoal}${
      updatedContext.timeframe ? ` by ${updatedContext.timeframe}` : ''
    }. That's clear and measurable. Let's build the logic for how we get there.`;
    
    addMessage(summary, 'ai');

    setState(prev => ({
      ...prev,
      context: updatedContext,
      awaitingClarification: false,
      currentQuestion: null,
      slot: null,
    }));

    return true; // Ready to proceed
  };

  const reset = () => {
    setState({
      currentQuestion: null,
      awaitingClarification: false,
      context: null,
      messages: [],
      slot: null,
    });
  };

  return {
    state,
    addMessage,
    processGoalInput,
    handleClarification,
    reset,
  };
}

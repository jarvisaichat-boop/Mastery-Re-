export interface GoalAnalysis {
  input: string;
  isAmbiguous: boolean;
  ambiguityReasons: string[];
  clarifyingQuestions: string[];
  detectedPatterns: {
    hasNumber?: boolean;
    hasTimeframe?: boolean;
    hasUnit?: boolean;
    hasAction?: boolean;
  };
}

export function analyzeGoal(input: string): GoalAnalysis {
  const lower = input.toLowerCase();
  const ambiguityReasons: string[] = [];
  const clarifyingQuestions: string[] = [];
  const detectedPatterns = {
    hasNumber: /\d+[kmb]?/i.test(input),
    hasTimeframe: /\b(eoy|q[1-4]|month|week|year|days?)\b/i.test(lower),
    hasUnit: /\b(dollars?|\$|revenue|income|savings|pounds|lbs|kg|%|percent)\b/i.test(lower),
    hasAction: /\b(launch|build|create|get|reach|achieve|learn)\b/i.test(lower),
  };

  // Check for numeric goals without context
  const numberMatch = input.match(/(\d+)([kmb])?/i);
  if (numberMatch && !detectedPatterns.hasUnit) {
    ambiguityReasons.push('Numeric goal without clear unit or context');
    clarifyingQuestions.push(
      `Tell me more about this ${numberMatch[0]} - is that revenue? Savings? A specific metric?`
    );
  }

  // Check for abbreviated timeframes
  if (/\beoy\b/i.test(input)) {
    ambiguityReasons.push('Abbreviated timeframe (EOY) needs clarification');
    clarifyingQuestions.push(
      'You mentioned EOY - do you mean end of THIS year (December 2025)? Or end of next year?'
    );
  }

  // Check for vague business goals
  if (/\b(100k|100 k|10k|10 k)\b/i.test(input) && /\b(business|freelance|revenue)\b/i.test(lower)) {
    if (!detectedPatterns.hasUnit) {
      ambiguityReasons.push('Business revenue goal without clear definition');
      clarifyingQuestions.push(
        'Is this $100K in total revenue? Monthly recurring revenue? Annual target?'
      );
    }
  }

  // Check for fitness goals without specificity
  if (/\b(fit|shape|weight|body)\b/i.test(lower) && !detectedPatterns.hasUnit) {
    ambiguityReasons.push('Fitness goal without measurable metric');
    clarifyingQuestions.push(
      'What does "fit" mean for you specifically? A target weight? Body fat percentage? Ability to do specific exercises?'
    );
  }

  // Check for vague learning goals
  if (/\b(learn|master|study)\b/i.test(lower) && input.length < 30) {
    ambiguityReasons.push('Learning goal could be more specific');
    clarifyingQuestions.push(
      'What level of proficiency are you aiming for? Can you describe what success looks like?'
    );
  }

  // Check for goals that are too short/vague
  if (input.trim().split(' ').length <= 2 && !detectedPatterns.hasNumber) {
    ambiguityReasons.push('Goal is very brief and may lack important context');
    clarifyingQuestions.push(
      'Can you tell me more about this goal? What would achieving it look like for you?'
    );
  }

  return {
    input,
    isAmbiguous: ambiguityReasons.length > 0,
    ambiguityReasons,
    clarifyingQuestions,
    detectedPatterns,
  };
}

export interface GoalContext {
  originalGoal: string;
  goalType?: 'revenue' | 'savings' | 'fitness' | 'learning' | 'creative' | 'other';
  specificMetric?: string;
  unit?: string;
  timeframe?: string;
  clarified: boolean;
}

export function buildGoalSummary(context: GoalContext): string {
  const parts: string[] = [];
  
  if (context.specificMetric) {
    parts.push(context.specificMetric);
  } else {
    parts.push(context.originalGoal);
  }
  
  if (context.goalType) {
    parts.push(`(${context.goalType})`);
  }
  
  if (context.timeframe) {
    parts.push(`by ${context.timeframe}`);
  }
  
  return parts.join(' ');
}

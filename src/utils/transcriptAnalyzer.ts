export interface AnalyzedTags {
  contentType: ('motivation' | 'education' | 'tutorial' | 'inspiration')[];
  lifeDomain: ('physical' | 'mental' | 'productivity' | 'business' | 'relationships' | 'finance' | 'creativity')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  emotion: ('energizing' | 'calming' | 'empowering' | 'reflective')[];
  technique: string[];
}

export function analyzeTranscript(transcript: string, title: string, description: string): AnalyzedTags {
  const fullText = `${title} ${description} ${transcript}`.toLowerCase();
  
  const contentType: AnalyzedTags['contentType'] = [];
  const lifeDomain: AnalyzedTags['lifeDomain'] = [];
  const emotion: AnalyzedTags['emotion'] = [];
  const technique: string[] = [];
  let difficulty: AnalyzedTags['difficulty'] = 'intermediate';
  
  if (/\bhow to\b|\btutorial\b|\bstep by step\b|\bguide\b/.test(fullText)) {
    contentType.push('tutorial');
  }
  if (/\bscience\b|\bresearch\b|\bstudy\b|\bevidence\b/.test(fullText)) {
    contentType.push('education');
  }
  if (/\bmotivat/i.test(fullText) || /\binspir/i.test(fullText)) {
    contentType.push('motivation');
  }
  if (/\binspir/i.test(fullText) || /\bstory\b|\bjourney\b/.test(fullText)) {
    contentType.push('inspiration');
  }
  
  if (!contentType.length) {
    contentType.push('education');
  }
  
  if (/\bworkout\b|\bexercise\b|\bfitness\b|\bphysical\b|\bgym\b|\brunning\b|\bwalk/i.test(fullText)) {
    lifeDomain.push('physical');
  }
  if (/\bmeditat/i.test(fullText) || /\bmindful/i.test(fullText) || /\bmental health\b|\banxiety\b|\bstress\b/.test(fullText)) {
    lifeDomain.push('mental');
  }
  if (/\bproductiv/i.test(fullText) || /\btime management\b|\befficiency\b|\borganiz/i.test(fullText)) {
    lifeDomain.push('productivity');
  }
  if (/\bbusiness\b|\bentrepreneur/i.test(fullText) || /\bstartup\b|\bcompany\b|\bmarketing\b/.test(fullText)) {
    lifeDomain.push('business');
  }
  if (/\brelationship\b|\bsocial\b|\bfriend/i.test(fullText) || /\bfamily\b|\bcommunication\b/.test(fullText)) {
    lifeDomain.push('relationships');
  }
  if (/\bmoney\b|\bfinance\b|\binvest/i.test(fullText) || /\bsaving\b|\bbudget\b|\bwealth\b/.test(fullText)) {
    lifeDomain.push('finance');
  }
  if (/\bcreativ/i.test(fullText) || /\bart\b|\bdesign\b|\bwriting\b|\bmusic\b/.test(fullText)) {
    lifeDomain.push('creativity');
  }
  
  if (!lifeDomain.length) {
    lifeDomain.push('productivity', 'mental');
  }
  
  if (/\bbeginner\b|\bstart/i.test(fullText) || /\bbasic\b|\bintro/i.test(fullText) || /\bfirst time\b/.test(fullText)) {
    difficulty = 'beginner';
  } else if (/\badvanced\b|\bmaster/i.test(fullText) || /\bexpert\b|\bpro\b/.test(fullText)) {
    difficulty = 'advanced';
  }
  
  if (/\benergiz/i.test(fullText) || /\bpump/i.test(fullText) || /\bexcit/i.test(fullText)) {
    emotion.push('energizing');
  }
  if (/\bcalm/i.test(fullText) || /\brelax/i.test(fullText) || /\bpeace/i.test(fullText)) {
    emotion.push('calming');
  }
  if (/\bempower/i.test(fullText) || /\bconfiden/i.test(fullText) || /\bstrong\b/.test(fullText)) {
    emotion.push('empowering');
  }
  if (/\breflect/i.test(fullText) || /\bthink/i.test(fullText) || /\bcontempl/i.test(fullText)) {
    emotion.push('reflective');
  }
  
  if (!emotion.length) {
    emotion.push('empowering');
  }
  
  if (/atomic habits?|james clear/i.test(fullText)) {
    technique.push('atomic habits');
  }
  if (/tiny habits?|bj fogg|b\.j\. fogg/i.test(fullText)) {
    technique.push('tiny habits');
  }
  if (/habit stack/i.test(fullText)) {
    technique.push('habit stacking');
  }
  if (/2[\s-]?minute rule/i.test(fullText) || /two[\s-]?minute rule/i.test(fullText)) {
    technique.push('2-minute rule');
  }
  if (/cue[\s-]?routine[\s-]?reward|habit loop/i.test(fullText)) {
    technique.push('habit loop');
  }
  if (/identity[\s-]?based|who you are/i.test(fullText)) {
    technique.push('identity-based habits');
  }
  if (/environment design|design your environment/i.test(fullText)) {
    technique.push('environment design');
  }
  if (/implementation intention|if[\s-]?then/i.test(fullText)) {
    technique.push('implementation intentions');
  }
  if (/celebrat/i.test(fullText) && /habit/i.test(fullText)) {
    technique.push('celebration');
  }
  if (/keystone habit/i.test(fullText)) {
    technique.push('keystone habits');
  }
  
  return {
    contentType: Array.from(new Set(contentType)),
    lifeDomain: Array.from(new Set(lifeDomain)),
    difficulty,
    emotion: Array.from(new Set(emotion)),
    technique: Array.from(new Set(technique))
  };
}

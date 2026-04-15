import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { MasteryProfile } from '../../types/onboarding';

function parseContextForProfile(
  context: string
): Partial<Pick<MasteryProfile, 'name' | 'occupation' | 'location' | 'interests'>> {
  const result: Partial<Pick<MasteryProfile, 'name' | 'occupation' | 'location' | 'interests'>> = {};

  // Name: "The user's name is X." or "named X" or "my name is X"
  const nameMatch =
    context.match(/the user(?:['\u2019]s)?\s+name\s+is\s+([A-Z][a-zA-Z\s\-'.]{1,35}?)(?:\.|,|\n|$)/i) ||
    context.match(/named\s+([A-Z][a-zA-Z\s\-'.]{1,35}?)(?:\.|,|\n|$)/i);
  if (nameMatch) {
    const name = nameMatch[1].trim().replace(/[,.]$/, '');
    if (name.length >= 2 && name.length <= 40) result.name = name;
  }

  // Occupation: "The user works as X" — stop before comma, period, or " in [City]"
  const occMatch =
    context.match(/the user works as\s+(.*?)(?:,|\.|\n|$)/i) ||
    context.match(/occupation[:\s]+([^\n.,]+)/i);
  if (occMatch) {
    let occ = occMatch[1].trim().replace(/[,.]$/, '');
    occ = occ.replace(/\s+in\s+[A-Z][\w\s,]+$/, '').trim();
    occ = occ.replace(/^an?\s+/i, '').trim();
    if (occ.length >= 2 && occ.length <= 100) result.occupation = occ;
  }

  // Location: "located in / lives in / based in / living in / from X"
  const locMatch =
    context.match(/the user(?:\s+is)?\s+(?:located in|lives in|based in|living in|residing in|currently in|from)\s+([^.\n]+?)(?:\.|,|\n|$)/i) ||
    context.match(/location[:\s]+([^\n.]+)/i);
  if (locMatch) {
    const loc = locMatch[1].trim().replace(/[,.]$/, '');
    if (loc.length >= 2 && loc.length <= 80) result.location = loc;
  }

  // Interests: look inside section 7 first, then fall back to full text
  const sectionMatch = context.match(/7\.\s+INTERESTS[^\n]*\n([\s\S]+?)(?=\n\d+\.\s+[A-Z]|$)/i);
  const searchIn = sectionMatch ? sectionMatch[1] : context;
  const intMatch =
    searchIn.match(/the user is interested in\s+([^.\n]+)/i) ||
    searchIn.match(/interests?[:\s]+([^\n.]+)/i);
  if (intMatch) {
    const interests = intMatch[1].trim().replace(/[,.]$/, '');
    if (interests.length >= 2 && interests.length <= 300) result.interests = interests;
  }

  return result;
}

interface Phase1ContextBaselineProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

const IMPORT_PROMPT = `I'm setting up a new personal dashboard and want to pre-fill it with what you already know about me. I'm giving you full permission to use our conversation history and any saved context you have about me.

Refer to me as "the user" throughout. Do not write "unknown" or "not recorded."

1. PROFILE
Name, age, occupation, location, lifestyle notes.
Example: "The user's name is X. The user works as Y in Z."
If you have no real data here, skip this section entirely.

2. CORE VALUES
What matters most to the user. Beliefs and principles they've expressed.
Example: "The user values X. The user believes Y."
If you have no real data here, skip this section entirely.

3. LIFE GOALS & PROJECTS
Long-term goals, current projects, what the user is actively working toward.
Example: "The user's main goal is X. The user is currently working on Y."
If you have no real data here, skip this section entirely.

4. DAILY SCHEDULE & ROUTINES
Wake/sleep times, work hours, energy patterns, regular routines.
Example: "The user wakes at X. The user's peak focus time is Y."
If you have no real data here, skip this section entirely.

5. HABITS
Habits the user is building or maintaining. What's worked, what hasn't.
Example: "The user is building a habit of X."
If you have no real data here, skip this section entirely.

6. STRUGGLES & BLOCKERS
Recurring challenges, patterns of failure, emotional blockers.
Example: "The user repeatedly struggles with X."
If you have no real data here, skip this section entirely.

7. INTERESTS & RELATIONSHIPS
Active interests, communities, accountability partners.
Example: "The user is interested in X."
If you have no real data here, skip this section entirely.

Output as a single plain-text block using the numbered labels above.`;

const WHY_OPTIONS = [
  { value: 'RESTART', emoji: '🔁', label: 'I keep starting over', sub: 'I set goals but never follow through' },
  { value: 'GOAL', emoji: '🎯', label: 'I have a specific goal', sub: 'I know what I want, I just need structure' },
  { value: 'OVERWHELMED', emoji: '😵', label: 'I feel overwhelmed', sub: 'Too much going on, hard to focus' },
  { value: 'FELL_OFF', emoji: '📉', label: 'I lost my momentum', sub: 'I was doing well, then fell off track' },
  { value: 'NEW_HABIT', emoji: '🌱', label: 'I want to build new habits', sub: 'Starting fresh with something new' },
  { value: 'LOST', emoji: '🧭', label: 'I feel lost', sub: "Not sure what to focus on, I need direction" },
  { value: 'LEVEL_UP', emoji: '⚡', label: "I'm ready to level up", sub: "Things are okay — I want exceptional" },
];

export default function Phase1ContextBaseline({ profile, onComplete }: Phase1ContextBaselineProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<Partial<MasteryProfile>>({
    context: profile.context || '',
    mentalState: profile.mentalState || '',
    name: profile.name || '',
    location: profile.location || '',
    occupation: profile.occupation || '',
    interests: profile.interests || '',
  });
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const acceptSuggestionItem = (field: string, item: string) => {
    if (field === 'interests') {
      setData(prev => ({
        ...prev,
        interests: prev.interests ? `${prev.interests}, ${item}` : item,
      }));
    } else {
      setData(prev => ({ ...prev, [field]: item }));
    }
    setSuggestions(prev => {
      const remaining = (prev[field] || '').split(',').map(s => s.trim()).filter(s => s !== item).join(', ');
      if (!remaining) { const next = { ...prev }; delete next[field]; return next; }
      return { ...prev, [field]: remaining };
    });
  };

  const dismissSuggestionItem = (field: string, item: string) => {
    setSuggestions(prev => {
      const remaining = (prev[field] || '').split(',').map(s => s.trim()).filter(s => s !== item).join(', ');
      if (!remaining) { const next = { ...prev }; delete next[field]; return next; }
      return { ...prev, [field]: remaining };
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(IMPORT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = IMPORT_PROMPT;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nextScreen = () => {
    if (currentScreen === 2) {
      if (data.context && data.context.length > 10) {
        const parsed = parseContextForProfile(data.context);
        const newSuggestions: Record<string, string> = {};
        if (parsed.name) newSuggestions.name = parsed.name;
        if (parsed.occupation) newSuggestions.occupation = parsed.occupation;
        if (parsed.location) newSuggestions.location = parsed.location;
        if (parsed.interests) newSuggestions.interests = parsed.interests;
        setSuggestions(newSuggestions);
      } else {
        setSuggestions({});
      }
      setCurrentScreen(3);
      return;
    }
    if (currentScreen < 3) {
      setCurrentScreen(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 1) {
      if (currentScreen === 3) setSuggestions({});
      setCurrentScreen(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 1: return data.mentalState !== '';
      case 2: return true;
      case 3: return data.name !== '';
      default: return false;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {

      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <p className="text-xs text-yellow-400/80 uppercase tracking-widest font-medium">What brought you here?</p>
              <h2 className="text-3xl font-bold text-white leading-tight">Why are you here?</h2>
              <p className="text-gray-400 text-base">Pick the one that fits right now.</p>
            </div>
            <div className="space-y-2.5">
              {WHY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData({ mentalState: option.value })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                    data.mentalState === option.value
                      ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-900/40 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/40'
                  }`}
                >
                  <span className="text-2xl w-8 text-center flex-shrink-0">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-base">{option.label}</p>
                    <p className="text-sm text-gray-400">{option.sub}</p>
                  </div>
                  {data.mentalState === option.value && (
                    <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <p className="text-xs text-yellow-400/80 uppercase tracking-widest font-medium">Optional — skip if you're starting fresh</p>
              <h2 className="text-3xl font-bold text-white leading-tight">Bring your context</h2>
              <p className="text-gray-400 text-base">Paste anything — a journal, goals doc, notes, or an AI export. Whatever you've got.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-700 text-xs flex items-center justify-center text-gray-300 flex-shrink-0">1</span>
                  <span>Paste this into the AI you talk to most — <span className="text-gray-500 font-normal">use an existing conversation, not a new chat.</span></span>
                </p>
                <div className="relative bg-gray-900 border border-gray-700 rounded-xl">
                  <div className="overflow-y-auto max-h-44 p-4 pr-24 custom-scrollbar">
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{IMPORT_PROMPT}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied
                        ? 'bg-green-600/30 text-green-400 border border-green-600/40'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <div className="px-4 pb-2 text-xs text-gray-600 italic">Scroll to read full prompt</div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tip: Getting blank responses? Check that Memory and Extensions are turned on in your AI settings.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-700 text-xs flex items-center justify-center text-gray-300 flex-shrink-0">2</span>
                  Paste your notes, journals, docs, or AI response here
                </p>
                <div className="relative">
                  <textarea
                    value={data.context}
                    onChange={(e) => updateData({ context: e.target.value })}
                    placeholder="Paste anything — a journal entry, goal list, AI response, or just write freely..."
                    className="w-full h-36 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                  />
                  {data.context && data.context.length > 20 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-green-400 bg-gray-900/80 px-2 py-1 rounded-md">
                      <Check className="w-3 h-3" />
                      {data.context.length} chars saved
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3: {
        const hasAnySuggestion = Object.keys(suggestions).length > 0;
        const SuggestionRow = ({ field }: { field: string }) => {
          const raw = suggestions[field];
          if (!raw) return null;
          const items = raw.split(',').map(s => s.trim()).filter(Boolean);
          return (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {items.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 bg-gray-800/70 border border-gray-600/50 rounded-full text-sm text-gray-300 cursor-pointer hover:border-gray-500 hover:bg-gray-700/60 transition-colors group"
                  onClick={() => acceptSuggestionItem(field, item)}
                >
                  {item}
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); dismissSuggestionItem(field, item); }}
                    className="ml-0.5 text-gray-600 hover:text-gray-300 transition-colors"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="w-3 h-3" />
                  </span>
                </span>
              ))}
            </div>
          );
        };

        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <p className="text-xs text-yellow-400/80 uppercase tracking-widest font-medium">Almost done</p>
              <h2 className="text-3xl font-bold text-white leading-tight">Your Profile</h2>
              <p className="text-gray-400 text-base">
                {hasAnySuggestion
                  ? 'We found some details — tap a suggestion to use it.'
                  : 'Tell me a bit about yourself.'}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                  placeholder="Your name *"
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <SuggestionRow field="name" />
              </div>
              <div>
                <input
                  type="text"
                  value={data.occupation}
                  onChange={(e) => updateData({ occupation: e.target.value })}
                  placeholder="Occupation"
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <SuggestionRow field="occupation" />
              </div>
              <div>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => updateData({ location: e.target.value })}
                  placeholder="Location (optional)"
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <SuggestionRow field="location" />
              </div>
              <div>
                <input
                  type="text"
                  value={data.interests}
                  onChange={(e) => updateData({ interests: e.target.value })}
                  placeholder="Interests (fitness, business, creative...)"
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <SuggestionRow field="interests" />
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span className="font-medium">Phase 1: Profile</span>
            <span>Screen {currentScreen} of 3</span>
          </div>
          <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentScreen / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderScreen()}

        <div className="flex gap-3 mt-10">
          <button
            onClick={prevScreen}
            disabled={currentScreen === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentScreen === 1
                ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800/50 text-white hover:bg-gray-700/50 border border-gray-700/50'
            }`}
          >
            Back
          </button>
          <button
            onClick={nextScreen}
            disabled={!canProceed()}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentScreen === 3 ? 'Complete Phase 1' : currentScreen === 2 ? 'Next →' : 'Next'}
          </button>
        </div>

        {currentScreen === 2 && (
          <p className="text-center text-xs text-gray-600 mt-3">
            This step is optional — tap Next to skip
          </p>
        )}
      </div>
    </div>
  );
}

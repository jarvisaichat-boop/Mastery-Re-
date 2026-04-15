import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MasteryProfile } from '../../types/onboarding';

interface Phase1ContextBaselineProps {
  profile: Partial<MasteryProfile>;
  onComplete: (data: Partial<MasteryProfile>) => void;
}

const IMPORT_PROMPT = `You are helping me import my personal context into a new app. Go through our past conversations and summarize what you know about me.

Avoid using first-person (I, my, me) or second-person (you, your) pronouns. Refer to the person as "the user".

Output in this exact order and format:

1. PROFILE
Name, age, occupation, location, education, lifestyle notes.
Format: "The user's name is X. The user works as Y."

2. CORE VALUES
What matters most to the user. Identity statements, principles they live by, what they stand for.
Format: "The user values X. The user believes Y."

3. LIFE GOALS & PROJECTS
Long-term goals, current big projects, quarterly targets, what the user is actively working toward.
Format: "The user's main goal is X. The user is currently working on Y."

4. DAILY SCHEDULE & ROUTINES
Wake/sleep times, work hours, peak energy windows, established routines (morning, evening, etc.), commitments that block time.
Format: "The user wakes at X. The user's peak focus time is Y."

5. HABITS
Habits the user is trying to build or maintain. Frequency, duration, context. What has worked and what hasn't.
Format: "The user is building a habit of X. The user struggles to maintain Y."

6. STRUGGLES & BLOCKERS
Recurring challenges, patterns of failure, what gets in the way, emotional blockers.
Format: "The user repeatedly struggles with X. A common blocker is Y."

7. INTERESTS & RELATIONSHIPS
Active interests, communities, important relationships that provide context or accountability.
Format: "The user is interested in X. The user has Y as an accountability partner."

Output everything as a single plain-text block. Use the numbered section labels above.`;

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

  const updateData = (updates: Partial<MasteryProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
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
    if (currentScreen < 3) {
      setCurrentScreen(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 1) {
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
              <h2 className="text-3xl font-bold text-white leading-tight">Import your memory</h2>
              <p className="text-gray-400 text-base">Already working with an AI? Bring your context here.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-700 text-xs flex items-center justify-center text-gray-300 flex-shrink-0">1</span>
                  Copy this prompt into your AI (ChatGPT, Gemini, etc.)
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
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-700 text-xs flex items-center justify-center text-gray-300 flex-shrink-0">2</span>
                  Paste the response here
                </p>
                <div className="relative">
                  <textarea
                    value={data.context}
                    onChange={(e) => updateData({ context: e.target.value })}
                    placeholder="Paste your info here..."
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

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <p className="text-xs text-yellow-400/80 uppercase tracking-widest font-medium">Almost done</p>
              <h2 className="text-3xl font-bold text-white leading-tight">Your Profile</h2>
              <p className="text-gray-400 text-base">Tell me a bit about yourself.</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Your name *"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={data.occupation}
                onChange={(e) => updateData({ occupation: e.target.value })}
                placeholder="Occupation"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
                placeholder="Location (optional)"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={data.interests}
                onChange={(e) => updateData({ interests: e.target.value })}
                placeholder="Interests (fitness, business, creative...)"
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl text-white text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        );

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

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface JournalModuleProps {
  habitName: string;
  habitId: number;
  onComplete: () => void;
  onCancel: () => void;
}

interface JournalEntry {
  habitId: number;
  habitName: string;
  entry1: string;
  entry2: string;
  timestamp: number;
}

const JOURNAL_STORAGE_KEY = 'path_journal_entries';

const JournalModule = ({ habitName, habitId, onComplete, onCancel }: JournalModuleProps) => {
  const [entry1, setEntry1] = useState('');
  const [entry2, setEntry2] = useState('');

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const canSave = entry1.trim().length > 0 && entry2.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY) || '[]') as JournalEntry[];
    
    const newEntry: JournalEntry = {
      habitId,
      habitName,
      entry1: entry1.trim(),
      entry2: entry2.trim(),
      timestamp: Date.now(),
    };

    existingEntries.push(newEntry);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(existingEntries));

    // Complete the habit
    onComplete();
  };

  const handleExit = () => {
    if (entry1.trim() || entry2.trim()) {
      const confirmed = confirm('You have unsaved entries. Are you sure you want to exit?');
      if (!confirmed) return;
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white">{habitName}</h2>
          <p className="text-sm text-gray-400 mt-1">Gratitude Practice</p>
        </div>
        <button
          onClick={handleExit}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Instructions */}
          <div className="text-center space-y-3">
            <p className="text-xl text-gray-300 leading-relaxed">
              Write 2 things you're grateful for in life or recently.
            </p>
            <p className="text-lg text-gray-500 italic">
              Remember the feeling.
            </p>
          </div>

          {/* Entry 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Gratitude #1
              </label>
              <span className="text-xs text-gray-600">
                {getWordCount(entry1)} words
              </span>
            </div>
            <textarea
              value={entry1}
              onChange={(e) => setEntry1(e.target.value)}
              placeholder="I am grateful for..."
              className="w-full h-40 px-6 py-4 bg-gray-900/50 border border-gray-800 rounded-lg text-white text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-700 font-serif"
              autoFocus
            />
            {getWordCount(entry1) > 0 && getWordCount(entry1) < 10 && (
              <p className="text-xs text-gray-600 italic">Keep going... dig deeper</p>
            )}
          </div>

          {/* Entry 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Gratitude #2
              </label>
              <span className="text-xs text-gray-600">
                {getWordCount(entry2)} words
              </span>
            </div>
            <textarea
              value={entry2}
              onChange={(e) => setEntry2(e.target.value)}
              placeholder="I am grateful for..."
              className="w-full h-40 px-6 py-4 bg-gray-900/50 border border-gray-800 rounded-lg text-white text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-700 font-serif"
            />
            {getWordCount(entry2) > 0 && getWordCount(entry2) < 10 && (
              <p className="text-xs text-gray-600 italic">Keep going... dig deeper</p>
            )}
          </div>

          {/* Encouragement */}
          {canSave && (
            <div className="text-center">
              <p className="text-green-400 text-sm animate-pulse">
                ✨ Beautiful. Your gratitude is captured.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={handleExit}
            className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-semibold disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Save & Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalModule;

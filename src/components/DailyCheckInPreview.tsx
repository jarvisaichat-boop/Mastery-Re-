import { Sparkles } from 'lucide-react';

export default function DailyCheckInPreview() {
  return (
    <div 
      className="w-[380px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
      role="img"
      aria-label="Daily Check-in interface preview"
    >
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">Daily Check-In</h3>
      </div>

      {/* Chat Messages */}
      <div className="p-4 space-y-3 h-[280px] overflow-y-auto bg-zinc-900">
        {/* AI Message */}
        <div className="flex gap-2 items-start">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 max-w-[280px]">
            <p className="text-sm text-gray-200">
              Hell yeah! 🔥 That's the kind of energy that builds empires. Keep this momentum going.
            </p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-2 items-start justify-end">
          <div className="bg-blue-600 rounded-lg p-3 max-w-[280px]">
            <p className="text-sm text-white">
              Crushed my workout and deep work session today!
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 text-xs text-gray-400">
            You
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-zinc-800 border-t border-zinc-700">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your reflection..."
            className="flex-1 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-sm text-zinc-300 placeholder-zinc-500"
            disabled
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

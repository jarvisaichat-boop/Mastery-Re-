import React from 'react';
import { Clock, X } from 'lucide-react';

interface TimePickerProps {
  value?: string; // HH:MM format
  onChange: (time: string | undefined) => void;
  label?: string;
}

export default function TimePicker({ value, onChange, label = 'Notification Time' }: TimePickerProps) {
  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        {label}
        <span className="text-gray-500 text-xs">(optional)</span>
      </label>
      
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Clear notification time"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {value && (
        <p className="text-xs text-gray-500">
          You'll get notifications at T-5min (gentle), T-0 (urgent), and T+5min (buzzing)
        </p>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronUp, ChevronDown, EyeOff, Eye, Trash2 } from 'lucide-react';

interface ActionMenuProps {
  index: number;
  totalItems: number;
  isHidden: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleHide: () => void;
  onDelete: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  index,
  totalItems,
  isHidden,
  onMoveUp,
  onMoveDown,
  onToggleHide,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-500 hover:text-gray-300 rounded transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-8 z-50 bg-gray-900 border border-white/10 rounded-lg shadow-xl py-1 min-w-[140px]"
          style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
        >
          {index > 0 && (
            <button
              onClick={() => handleAction(onMoveUp)}
              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
            >
              <ChevronUp size={14} />
              Move Up
            </button>
          )}
          {index < totalItems - 1 && (
            <button
              onClick={() => handleAction(onMoveDown)}
              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
            >
              <ChevronDown size={14} />
              Move Down
            </button>
          )}
          <button
            onClick={() => handleAction(onToggleHide)}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
          >
            {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
            {isHidden ? 'Show' : 'Hide'}
          </button>
          <div className="border-t border-white/5 my-1" />
          <button
            onClick={() => handleAction(onDelete)}
            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

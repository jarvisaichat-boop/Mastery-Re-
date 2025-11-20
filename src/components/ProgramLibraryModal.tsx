import { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';
import { Program, HabitTemplate } from '../types';
import { PROGRAM_LIBRARY } from '../data/programLibrary';

interface ProgramLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHabits: (habits: HabitTemplate[], programId: string) => void;
}

export function ProgramLibraryModal({ isOpen, onClose, onSelectHabits }: ProgramLibraryModalProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedHabitIndices, setSelectedHabitIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program);
    setSelectedHabitIndices(program.habits.map((_, i) => i));
  };

  const handleBack = () => {
    setSelectedProgram(null);
    setSelectedHabitIndices([]);
  };

  const handleToggleHabit = (index: number) => {
    setSelectedHabitIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleToggleAll = () => {
    if (!selectedProgram) return;
    if (selectedHabitIndices.length === selectedProgram.habits.length) {
      setSelectedHabitIndices([]);
    } else {
      setSelectedHabitIndices(selectedProgram.habits.map((_, i) => i));
    }
  };

  const handleAddSelected = () => {
    if (!selectedProgram || selectedHabitIndices.length === 0) return;
    const selectedHabits = selectedHabitIndices.map(i => selectedProgram.habits[i]);
    onSelectHabits(selectedHabits, selectedProgram.id);
    handleBack();
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'morning': return 'text-orange-400';
      case 'focus': return 'text-blue-400';
      case 'evening': return 'text-purple-400';
      case 'wellness': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-4xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {!selectedProgram ? (
          <>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Program Library</h2>
                <p className="text-sm text-gray-400 mt-1">Choose a pre-built program to add multiple habits at once</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROGRAM_LIBRARY.map(program => (
                  <div
                    key={program.id}
                    onClick={() => handleProgramClick(program)}
                    className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{program.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {program.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(program.difficulty)} capitalize`}>
                            {program.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className={`capitalize ${getCategoryColor(program.category)}`}>
                            {program.category}
                          </span>
                          <span>•</span>
                          <span>{program.habits.length} habit{program.habits.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-400" />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedProgram.icon}</span>
                    <h2 className="text-2xl font-bold text-white">{selectedProgram.name}</h2>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{selectedProgram.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Select Habits ({selectedHabitIndices.length}/{selectedProgram.habits.length})
                </h3>
                <button
                  onClick={handleToggleAll}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {selectedHabitIndices.length === selectedProgram.habits.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-3">
                {selectedProgram.habits.map((habit, index) => {
                  const isSelected = selectedHabitIndices.includes(index);
                  return (
                    <div
                      key={index}
                      onClick={() => handleToggleHabit(index)}
                      className={`group bg-white/5 border ${
                        isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                      } rounded-xl p-4 hover:bg-white/10 cursor-pointer transition-all`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded border-2 ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                        } flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-white">{habit.name}</h4>
                            {habit.miniAppType && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                {habit.miniAppType === 'breath' ? '🫁 Breathing' : '📝 Journal'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{habit.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span style={{ color: habit.color }} className="font-medium">
                              {habit.type === 'habit_muscle' ? '💪 Habit Muscle' : 
                               habit.type === 'life_goal' ? '⭐ Life Goal' : 'Regular'}
                            </span>
                            <span>•</span>
                            <span>{habit.frequencyType === 'daily' ? 'Daily' : habit.frequencyType}</span>
                            {habit.scheduledTime && (
                              <>
                                <span>•</span>
                                <span>🔔 {habit.scheduledTime}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-white/10">
              <button
                onClick={handleAddSelected}
                disabled={selectedHabitIndices.length === 0}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                Add {selectedHabitIndices.length} Habit{selectedHabitIndices.length !== 1 ? 's' : ''} to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

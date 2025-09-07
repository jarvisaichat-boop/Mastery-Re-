import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Category, AddHabitModalProps } from '../types';
import { isHabitScheduledOnDay, formatDate } from '../utils';

const LOCAL_STORAGE_CATEGORIES_KEY = 'bolt_habit_categories';

const initialPresetCategories = {
  'Physical': ['Exercise', 'Nutrition', 'Sleep', 'Hygiene', 'Movement'],
  'Mental': ['Learning', 'Mindfulness', 'Journaling', 'Reading', 'Problem Solving'],
  'Emotional': ['Stress Management', 'Gratitude', 'Self-Compassion', 'Emotional Regulation'],
  'Social': ['Relationships', 'Community', 'Networking', 'Communication'],
  'Career': ['Productivity', 'Skill Development', 'Professional Growth', 'Work-Life Balance'],
  'Personal Growth': ['Hobbies', 'Creative Projects', 'New Skills', 'Self-Reflection', 'Purpose'],
  'Financial': ['Budgeting', 'Saving', 'Investing', 'Debt Management'],
  'Spiritual': ['Meditation', 'Reflection', 'Values Alignment', 'Connection'],
  'Home & Environment': ['Organization', 'Cleaning', 'Decluttering', 'Sustainability'],
  'Project': ['Side Projects', 'Creative Work', 'Business Ventures', 'Research', 'Building'],
  'Life': ['Life Planning', 'Goal Setting', 'Life Review', 'Major Decisions', 'Life Balance']
};

const loadCategoriesFromLocalStorage = (): Record<string, string[]> => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch (error) {
    console.error('Error loading categories from localStorage:', error);
  }
  localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(initialPresetCategories));
  return initialPresetCategories;
};

const saveCategoriesToLocalStorage = (categoriesMap: Record<string, string[]>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categoriesMap));
  } catch (error) {
    console.error('Error saving categories to localStorage:', error);
  }
};

const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen, onClose, onSaveHabit, onDeleteHabit, habitToEdit, habitMuscleCount, lifeGoalsCount
}) => {
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('green');
  const [habitType, setHabitType] = useState('Habit');
  const [frequencyType, setFrequencyType] = useState('Everyday');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timesPerPeriod, setTimesPerPeriod] = useState(1);
  const [periodUnit, setPeriodUnit] = useState('Week');
  const [repeatDays, setRepeatDays] = useState(1);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [customMainCategoryInput, setCustomMainCategoryInput] = useState('');
  const [customSubCategoryInput, setCustomSubCategoryInput] = useState('');
  const [customSubCategoryParent, setCustomSubCategoryParent] = useState<string | null>(null);
  const [allCategoriesMap, setAllCategoriesMap] = useState<Record<string, string[]>>(loadCategoriesFromLocalStorage);

  const calculateHabitStats = (habit: any) => {
    if (!habit || !habit.completed) return { totalCompletions: 0, highestStreak: 0 };
    const totalCompletions = Object.values(habit.completed).filter(Boolean).length;
    let highestStreak = 0;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const habitCreationDate = new Date(habit.id);
    habitCreationDate.setHours(0, 0, 0, 0);
    let currentDay = new Date(habitCreationDate);
    while (currentDay <= today) {
      const dateString = formatDate(currentDay, 'yyyy-MM-dd');
      const isScheduled = isHabitScheduledOnDay(habit, currentDay);
      const isCompleted = habit.completed[dateString];
      if (isScheduled) {
        if (isCompleted) {
          currentStreak++;
          highestStreak = Math.max(highestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return { totalCompletions, highestStreak };
  };

  const colorOptions = [
    { name: 'red', class: 'bg-red-500' }, { name: 'orange', class: 'bg-orange-500' },
    { name: 'yellow', class: 'bg-yellow-500' }, { name: 'green', class: 'bg-green-500' },
    { name: 'blue', class: 'bg-blue-500' }, { name: 'indigo', class: 'bg-indigo-500' },
    { name: 'purple', class: 'bg-purple-500' },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleMainCategoryClick = (main: string) => {
    setExpandedCategories(prev =>
      prev.includes(main) ? prev.filter(c => c !== main) : [...prev, main]
    );
    setSelectedCategories(prev => {
      const mainOnlyExists = prev.some(cat => cat.main === main && !cat.sub);
      const subsExist = prev.some(cat => cat.main === main && cat.sub);
      if (mainOnlyExists) {
        return prev.filter(cat => cat.main !== main);
      } else if (subsExist) {
        const otherCategories = prev.filter(cat => cat.main !== main);
        return [...otherCategories, { main }];
      } else {
        return [...prev, { main }];
      }
    });
  };
  
  const handleSubCategoryClick = (main: string, sub: string) => {
    setSelectedCategories(prev => {
      const subExists = prev.some(cat => cat.main === main && cat.sub === sub);
      if (subExists) {
        const newSelection = prev.filter(cat => !(cat.main === main && cat.sub === sub));
        if (!newSelection.some(cat => cat.main === main)) {
            newSelection.push({ main });
        }
        return newSelection;
      } else {
        const withoutMainOnly = prev.filter(cat => !(cat.main === main && !cat.sub));
        return [...withoutMainOnly, { main, sub }];
      }
    });
  };

  const handleRemoveHabitCategory = (categoryToRemove: Category) => {
    setSelectedCategories(prev =>
      prev.filter(cat => !(cat.main === categoryToRemove.main && cat.sub === categoryToRemove.sub))
    );
  };

  const handleAddCustomMainCategory = () => {
    const trimmedInput = customMainCategoryInput.trim();
    if (trimmedInput && !allCategoriesMap[trimmedInput]) {
      const newCategoriesMap = { ...allCategoriesMap, [trimmedInput]: [] };
      setAllCategoriesMap(newCategoriesMap);
      saveCategoriesToLocalStorage(newCategoriesMap);
      setCustomMainCategoryInput('');
    }
  };

  const handleAddCustomSubCategory = (main: string) => {
    const trimmedInput = customSubCategoryInput.trim();
    if (trimmedInput && main && !allCategoriesMap[main]?.includes(trimmedInput)) {
      const newCategoriesMap = {
        ...allCategoriesMap,
        [main]: [...(allCategoriesMap[main] || []), trimmedInput]
      };
      setAllCategoriesMap(newCategoriesMap);
      saveCategoriesToLocalStorage(newCategoriesMap);
      setCustomSubCategoryInput('');
      setCustomSubCategoryParent(null);
    }
  };

  const handleCustomMainCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomMainCategory();
    }
  };

  const handleCustomSubCategoryKeyDown = (e: React.KeyboardEvent, main: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSubCategory(main);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      setShowCategorySelection(false);
      setExpandedCategories([]);
      setCustomMainCategoryInput('');
      setCustomSubCategoryInput('');
      if (habitToEdit) {
        setHabitName(habitToEdit.name);
        setHabitDescription(habitToEdit.description);
        setSelectedColor(habitToEdit.color);
        setHabitType(habitToEdit.type);
        setSelectedCategories(habitToEdit.categories);
        setFrequencyType(habitToEdit.frequencyType);
        setSelectedDays(habitToEdit.selectedDays);
        setTimesPerPeriod(habitToEdit.timesPerPeriod);
        setPeriodUnit(habitToEdit.periodUnit);
        setRepeatDays(habitToEdit.repeatDays);
      } else {
        setHabitName('');
        setHabitDescription('');
        setSelectedColor('green');
        setHabitType('Habit');
        setSelectedCategories([]);
        setFrequencyType('Everyday');
        setSelectedDays([]);
        setTimesPerPeriod(1);
        setPeriodUnit('Week');
        setRepeatDays(1);
      }
    }
  }, [isOpen, habitToEdit]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      const habitData = {
        ...(habitToEdit && { id: habitToEdit.id }),
        name: habitName.trim(),
        description: habitDescription.trim(),
        color: selectedColor,
        type: habitType,
        categories: selectedCategories,
        frequencyType,
        selectedDays,
        timesPerPeriod,
        periodUnit,
        repeatDays,
      };
      onSaveHabit(habitData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (habitToEdit && onDeleteHabit) {
      onDeleteHabit(habitToEdit.id);
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 bg-[#2C2C2E] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{habitToEdit ? 'Edit Habit' : 'Create New Habit'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button>
        </div>
        
        {habitToEdit && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const stats = calculateHabitStats(habitToEdit);
                return (
                  <>
                    <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600">
                      <div className="text-center"><div className="text-2xl font-bold text-white mb-1">{stats.totalCompletions}</div><div className="text-sm text-gray-400">Total Completions</div></div>
                    </div>
                    <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600">
                      <div className="text-center"><div className="text-2xl font-bold text-white mb-1">{stats.highestStreak}</div><div className="text-sm text-gray-400">Highest Streak</div></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Habit Type</label>
             <div className="space-y-3">
              {[
                { value: 'Habit', label: 'Habit', description: 'Regular habit for personal growth' },
                { value: 'Anchor Habit', label: 'Habit Muscle 💪', description: 'Simple habit to build your habit muscle (only 1 allowed)' },
                { value: 'Life Goal Habit', label: 'Life Goals ⭐', description: 'Top priority habit for major life improvement (only 3 allowed)' }
              ].map((type) => {
                const isCurrentSelection = habitType === type.value;
                let shouldShrink = false;
                let backgroundClasses = '';
                let paddingClass = 'p-3';

                if (type.value === 'Habit') {
                  backgroundClasses = 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20';
                } else if (type.value === 'Anchor Habit') {
                  const isLimitReached = habitMuscleCount >= 1;
                  shouldShrink = !isCurrentSelection && isLimitReached;
                  backgroundClasses = 'bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20';
                  paddingClass = shouldShrink ? 'py-2' : 'p-3';
                } else if (type.value === 'Life Goal Habit') {
                  const isLimitReached = lifeGoalsCount >= 3;
                  shouldShrink = !isCurrentSelection && isLimitReached;
                  backgroundClasses = 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20';
                  paddingClass = shouldShrink ? 'py-2' : 'p-3';
                }

                return (
                  <label key={type.value} className={`flex items-center space-x-3 cursor-pointer ${paddingClass} rounded-lg transition-colors ${backgroundClasses}`}>
                    <input type="radio" name="habitType" value={type.value} checked={habitType === type.value} onChange={(e) => setHabitType(e.target.value)} className="w-4 h-4 text-green-500 bg-[#1C1C1E] border-gray-600 focus:ring-green-500 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">{type.label}</div>
                      <div className={`text-sm text-gray-400 ${shouldShrink ? 'hidden' : ''}`}>{type.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          <div>
            <button type="button" onClick={() => setShowCategorySelection(!showCategorySelection)} className="flex items-center justify-between w-full text-left mb-3">
              <span className="text-sm font-medium text-gray-300">Categories (Optional)</span>
              {showCategorySelection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories.map((category, index) => (
                      <span key={`${category.main}-${category.sub || ''}-${index}`} className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                          category.sub 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                          {category.sub || category.main}
                          <button type="button" onClick={() => handleRemoveHabitCategory(category)} className="ml-1.5 text-gray-400 hover:text-white"><X className="w-3 h-3" /></button>
                      </span>
                  ))}
                </div>
            )}
            
            {showCategorySelection && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-2">Main Categories</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.keys(allCategoriesMap).map((mainCategory) => {
                      const isSelectedAsMain = selectedCategories.some(c => c.main === mainCategory && !c.sub);
                      const hasSelectedSubs = selectedCategories.some(c => c.main === mainCategory && c.sub);
                      return (
                        <button
                          key={mainCategory}
                          type="button"
                          onClick={() => handleMainCategoryClick(mainCategory)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                            isSelectedAsMain ? 'bg-blue-600 border-blue-500 text-white' :
                            hasSelectedSubs ? 'bg-blue-900 border-blue-700 text-blue-300' :
                            'bg-[#1C1C1E] border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                          }`}
                        >
                          {mainCategory}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex space-x-2">
                    <input type="text" value={customMainCategoryInput} onChange={(e) => setCustomMainCategoryInput(e.target.value)} onKeyDown={handleCustomMainCategoryKeyDown} placeholder="Add custom main category..." className="flex-1 px-3 py-2 bg-[#1C1C1E] border border-gray-600 rounded-lg text-sm" />
                    <button type="button" onClick={handleAddCustomMainCategory} disabled={!customMainCategoryInput.trim()} className="px-3 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-600"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                {expandedCategories.length > 0 && (
                  <div className="space-y-4 mt-4 border-t border-gray-700 pt-4">
                    {expandedCategories.map(mainCategory => (
                      <div key={mainCategory}>
                        <div className="text-xs font-medium text-gray-400 mb-2">
                          {mainCategory} Sub-Categories
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {allCategoriesMap[mainCategory]?.map((subCategory) => {
                            const isSelected = selectedCategories.some(
                              cat => cat.main === mainCategory && cat.sub === subCategory
                            );
                            return (
                              <button
                                key={subCategory}
                                type="button"
                                onClick={() => handleSubCategoryClick(mainCategory, subCategory)}
                                className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                                  isSelected
                                    ? 'bg-green-500 border-green-400 text-white'
                                    : 'bg-[#1C1C1E] border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                                }`}
                              >
                                {subCategory}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex space-x-2">
                            <input type="text"
                            value={customSubCategoryParent === mainCategory ? customSubCategoryInput : ''}
                            onFocus={() => setCustomSubCategoryParent(mainCategory)}
                            onChange={(e) => setCustomSubCategoryInput(e.target.value)}
                            onKeyDown={(e) => handleCustomSubCategoryKeyDown(e, mainCategory)}
                            placeholder={`Add custom ${mainCategory.toLowerCase()} category...`}
                            className="flex-1 px-3 py-2 bg-[#1C1C1E] border border-gray-600 rounded-lg text-sm" />
                            <button type="button" onClick={() => handleAddCustomSubCategory(mainCategory)} disabled={!customSubCategoryInput.trim()} className="px-3 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-600">
                            <Plus className="w-4 h-4" />
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
            <div className="space-y-3 pt-4">
                {habitToEdit && onDeleteHabit && (
                    <button type="button" onClick={handleDelete} className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 bg-red-900/30 border border-red-800/50 rounded-lg hover:bg-red-900/50">
                        <Trash2 className="w-4 h-4" /><span>Delete Habit</span>
                    </button>
                )}
                <div className="flex space-x-3">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                    <button type="submit" disabled={!habitName.trim()} className="flex-1 px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600">{habitToEdit ? 'Save' : 'Create Habit'}</button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
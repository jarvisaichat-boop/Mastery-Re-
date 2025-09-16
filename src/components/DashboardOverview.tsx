import React, { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react'; 
import { DashboardOverviewProps } from '../types';

// New Inline Tooltip Component
const CustomTooltip: React.FC<{ content: string }> = ({ content }) => (
    // Positioned absolutely within the relative widget container
    <div className="absolute z-10 p-3 mt-1 text-sm text-white bg-gray-800 rounded-lg shadow-xl w-64 left-1/2 transform -translate-x-1/2" style={{ top: 'calc(100% + 5px)' }}>
        {content}
    </div>
);


const DashboardOverview: React.FC<DashboardOverviewProps> = ({ dashboardData, onToggleRateMode, onToggleStreakMode }) => {
  const { weeklyCompletionRate, streaks, categoryBreakdown, heatmapData } = dashboardData;

  // NEW STATE: Track which tooltip is open
  const [rateTooltipOpen, setRateTooltipOpen] = useState(false);
  const [streakTooltipOpen, setStreakTooltipOpen] = useState(false);
  const [focusTooltipOpen, setFocusTooltipOpen] = useState(false);


  // Metric Calculations (Unchanged)
  const currentRate = weeklyCompletionRate.mode === 'basic' 
      ? weeklyCompletionRate.basic 
      : weeklyCompletionRate.hard;
  const streakModeText = streaks.mode === 'easy' ? 'BASIC' : 'HARD';
  const currentStreak = streaks.mode === 'easy' ? streaks.easyCurrent : streaks.hardCurrent;
  const longestStreak = streaks.mode === 'easy' ? streaks.easyLongest : streaks.hardLongest;

  // SIMPLIFIED TOOLTIP EXPLANATIONS
  const rateInfo = `BASIC Mode (Motivational): Measures the percentage of tasks you completed out of the tasks you paid attention to (completed or marked missed). Tasks you ignore are not counted against you.
HARD Mode (Discipline): Measures the percentage of tasks completed out of every task you had scheduled from Monday through today. Future tasks are not counted.`;
  
  const streakInfo = `BASIC Mode: The longest number of consecutive days where you completed at least one habit.
HARD Mode: The longest number of consecutive days where you achieved a Perfect Day (100% of scheduled tasks completed).`;

  const focusInfo = `Metric: This chart shows where your successful energy is focused. It calculates the percentage of all your total checkmarks that fall under each category (Life Goal, Habit Muscle, or Regular Habit).`;

  // FIX: Function to handle opening/closing a tooltip on click
  const handleInfoClick = useCallback((e, setOpen, currentOpen) => {
    e.stopPropagation(); // Prevents click from reaching parent card (the mode toggle)
    
    // Close all others and toggle the current one
    setRateTooltipOpen(false);
    setStreakTooltipOpen(false);
    setFocusTooltipOpen(false);
    
    setOpen(!currentOpen);
  }, []);

  // FIX: Effect for handling clicks outside the info box to dismiss tooltips
  useEffect(() => {
    const handleOutsideClick = () => {
        if (rateTooltipOpen || streakTooltipOpen || focusTooltipOpen) {
            setRateTooltipOpen(false);
            setStreakTooltipOpen(false);
            setFocusTooltipOpen(false);
        }
    };

    // Attach listener to the document body to close tooltips on outside click
    document.addEventListener('click', handleOutsideClick);

    return () => {
        document.removeEventListener('click', handleOutsideClick);
    };
  }, [rateTooltipOpen, streakTooltipOpen, focusTooltipOpen]);

  // Helper functions (omitted for brevity)
  const getHeatmapColor = (data: { completionCount: number, missedCount: number }): string => {
    if (data.missedCount > 0) return 'bg-red-900/30'; 
    if (data.completionCount === 0) return 'bg-gray-700/50';
    if (data.completionCount <= 1) return 'bg-green-600/30';
    if (data.completionCount <= 3) return 'bg-green-600/60';
    return 'bg-green-600';
  };
  
  const getDonutGradient = () => {
    const goal = categoryBreakdown['Life Goal'];
    const anchor = categoryBreakdown['Habit Muscle 💪'];
    const regular = categoryBreakdown['Habit'];
    const segments = [
      { name: 'Life Goal', value: goal, color: '#ef4444' }, { name: 'Habit Muscle 💪', value: anchor, color: '#3b82f6' }, { name: 'Habit', value: regular, color: '#a855f7' } 
    ];
    let gradientString = 'conic-gradient(';
    let currentAngle = 0;
    segments.forEach((segment, index) => {
      const angle = (segment.value / 100) * 360;
      gradientString += `${segment.color} ${currentAngle}deg ${currentAngle + angle}deg`;
      if (index < segments.length - 1) { gradientString += ', '; }
      currentAngle += angle;
    });
    gradientString += ')';
    return gradientString;
  };


  return (
    <div className="p-4">
      {/* Main Content Card */}
      <div className="bg-[#2C2C2E] p-6 rounded-2xl shadow-xl space-y-6">
        
        {/* WIDGET GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Widget 1: Weekly Completion Rate */}
          <div 
            className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600 cursor-pointer transition-colors hover:bg-gray-700 relative"
            onClick={onToggleRateMode}
          >
            {/* Title Centered with Info Icon */}
            <div className="flex justify-center items-center mb-2 relative">
                <div className="text-sm font-semibold text-gray-300">Weekly Completion Rate</div>
                
                <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-help" 
                    onClick={(e) => handleInfoClick(e, setRateTooltipOpen, rateTooltipOpen)} 
                >
                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-400" />
                </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">{currentRate}%</div>
              
              <div className="text-xs text-gray-400 font-medium mt-1">
                  {weeklyCompletionRate.mode === 'basic' ? 'BASIC' : 'HARD'} MODE
              </div>
            </div>
            {/* NEW: Conditional Tooltip */}
            {rateTooltipOpen && <CustomTooltip content={rateInfo} />}
          </div>

          {/* Widget 2: Consistency Streak */}
          <div 
            className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600 cursor-pointer transition-colors hover:bg-gray-700 relative"
            onClick={onToggleStreakMode}
          >
            {/* Title 'Streak' centered with Info Icon */}
            <div className="flex justify-center items-center mb-2 relative">
                <div className="text-sm font-semibold text-gray-300">Streak</div> 
                
                 <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-help" 
                    onClick={(e) => handleInfoClick(e, setStreakTooltipOpen, streakTooltipOpen)}
                >
                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-400" />
                </div>
            </div>
            <div className="text-center">
              {/* Number and 'days' inline */}
              <div className="flex justify-center items-end leading-none">
                <div className="text-5xl font-bold text-white">{currentStreak}</div>
                <div className="text-lg font-bold text-gray-300 mb-1 ml-1">days</div>
              </div>

              <div className="text-sm text-gray-400 mt-1">Longest Streak: {longestStreak} days</div>
              
              {/* Mode Indicator below Longest Streak */}
              <div className="text-xs text-gray-400 font-medium mt-1">
                {streakModeText} MODE
              </div>
            </div>
            {/* NEW: Conditional Tooltip */}
            {streakTooltipOpen && <CustomTooltip content={streakInfo} />}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Widget 3: Habit Type Focus */}
          <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600 relative"> 
            {/* Title Row with Info Icon */}
            <div className="flex justify-between items-center mb-4 relative">
              <div className="text-sm font-semibold text-gray-300">Habit Type Focus</div>
              
              {/* Info Icon for Focus Metric */}
              <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-help" 
                    onClick={(e) => handleInfoClick(e, setFocusTooltipOpen, focusTooltipOpen)}
                >
                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-400" />
                </div>
            </div>
            <div className="flex flex-col items-center">
              {/* Donut Chart Placeholder */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{ background: getDonutGradient() }}
              >
                {/* Center Cutout */}
                <div className="absolute w-14 h-14 bg-[#1C1C1E] rounded-full" />
                <div className="text-lg font-bold z-10 text-white">100%</div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 space-y-1 text-xs w-full">
                {Object.entries(categoryBreakdown).map(([name, value], index) => {
                  const colorMap: Record<string, string> = {
                    'Life Goal': 'text-red-400',
                    'Habit Muscle 💪': 'text-blue-400', 
                    'Habit': 'text-purple-400',
                  };
                  return (
                    <div key={index} className="flex justify-between text-gray-400">
                      <span className={colorMap[name] || 'text-white'}>{name}</span>
                      <span className="font-medium text-white">{value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* NEW: Conditional Tooltip */}
            {focusTooltipOpen && <CustomTooltip content={focusInfo} />}
          </div>

          {/* Widget 4: Consistency Heatmap */}
          <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600">
            <div className="text-sm font-semibold text-gray-300 mb-2">Consistency Heatmap</div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1 pt-2">
              {heatmapData.map((data, index) => (
                <div
                  key={index}
                  className={`w-full aspect-square rounded-sm ${getHeatmapColor(data)} transition-colors`}
                  title={`Completed: ${data.completionCount}, Missed: ${data.missedCount} on ${data.date}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Less</span>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
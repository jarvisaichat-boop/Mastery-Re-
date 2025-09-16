import React from 'react';
import { Info } from 'lucide-react'; 
import { DashboardOverviewProps } from '../types';

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ dashboardData, onToggleRateMode, onToggleStreakMode }) => {
  const { weeklyCompletionRate, streaks, categoryBreakdown, heatmapData } = dashboardData;

  // Determine the current rate value and mode text
  const currentRate = weeklyCompletionRate.mode === 'basic' 
      ? weeklyCompletionRate.basic 
      : weeklyCompletionRate.hard;
      
  const rateModeText = weeklyCompletionRate.mode === 'basic' 
      ? 'Basic Mode (High Motivation)' 
      : 'Hard Mode (Strict)';
      
  // Determine the current streak value and mode text
  const currentStreak = streaks.mode === 'easy' ? streaks.easyCurrent : streaks.hardCurrent;
  const longestStreak = streaks.mode === 'easy' ? streaks.easyLongest : streaks.hardLongest;
  // 'easy' mode is now labeled 'BASIC'
  const streakModeText = streaks.mode === 'easy' ? 'BASIC' : 'HARD';

  // Helper function for the heatmap color (Now uses data to check for missed habits)
  const getHeatmapColor = (data: { completionCount: number, missedCount: number }): string => {
    // If there is at least one explicitly missed habit (X-ed out)
    if (data.missedCount > 0) return 'bg-red-900/30'; 
    
    // Otherwise, use the green completion scale
    if (data.completionCount === 0) return 'bg-gray-700/50';
    if (data.completionCount <= 1) return 'bg-green-600/30';
    if (data.completionCount <= 3) return 'bg-green-600/60';
    return 'bg-green-600';
  };
  
  // Helper function to generate the conic gradient for the donut chart placeholder
  const getDonutGradient = () => {
    const goal = categoryBreakdown['Life Goal'];
    const anchor = categoryBreakdown['Habit Muscle 💪'];
    const regular = categoryBreakdown['Habit'];
    
    const segments = [
      { name: 'Life Goal', value: goal, color: '#ef4444' }, // Red
      { name: 'Habit Muscle 💪', value: anchor, color: '#3b82f6' }, // Blue
      { name: 'Habit', value: regular, color: '#a855f7' } // Purple
    ];
    
    let gradientString = 'conic-gradient(';
    let currentAngle = 0;
    
    segments.forEach((segment, index) => {
      const angle = (segment.value / 100) * 360;
      gradientString += `${segment.color} ${currentAngle}deg ${currentAngle + angle}deg`;
      if (index < segments.length - 1) {
        gradientString += ', ';
      }
      currentAngle += angle;
    });
    
    gradientString += ')';
    return gradientString;
  };

  // Define Tooltip Explanations
  const rateInfo = `Basic Mode (Motivational): Completed / Acknowledged (True or False). Skips unacknowledged future days.
Hard Mode (Strict): Completed / Scheduled. Calculated only for days elapsed this week (Mon-Today).`;
  
  const streakInfo = `BASIC Mode: Consecutive days with at least one completed habit.
HARD Mode: Consecutive days with 100% completion (Perfect Day).`;

  const focusInfo = `Metric: Distribution of Completed Actions. Shows where your successfully completed checkmarks are concentrated across your habit types (Life Goals, Muscle, Regular).`;


  return (
    <div className="p-4">
      {/* Main Content Card */}
      <div className="bg-[#2C2C2E] p-6 rounded-2xl shadow-xl space-y-6">
        
        {/* WIDGET GRID (APPLYING MOBILE FIX) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Widget 1: Weekly Completion Rate */}
          <div 
            className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600 cursor-pointer transition-colors hover:bg-gray-700"
            onClick={onToggleRateMode}
          >
            {/* A.2: Title Centered with Info Icon */}
            <div className="flex justify-center items-center mb-2 relative">
                <div className="text-sm font-semibold text-gray-300">Weekly Completion Rate</div>
                
                {/* Info Icon */}
                <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-default" 
                    title={rateInfo}
                >
                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-400" />
                </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">{currentRate}%</div>
              
              {/* A.1/A.3: Mode Indicator below Percentage, removing long text */}
              <div className="text-xs text-gray-400 font-medium mt-1">
                  {weeklyCompletionRate.mode === 'basic' ? 'BASIC' : 'HARD'} MODE
              </div>
            </div>
          </div>

          {/* Widget 2: Consistency Streak */}
          <div 
            className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600 cursor-pointer transition-colors hover:bg-gray-700"
            onClick={onToggleStreakMode}
          >
            {/* B.1, B.2: Title 'Streak' centered with Info Icon */}
            <div className="flex justify-center items-center mb-2 relative">
                <div className="text-sm font-semibold text-gray-300">Streak</div> 
                
                {/* Info Icon */}
                 <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-default" 
                    title={streakInfo}
                >
                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-400" />
                </div>
            </div>
            <div className="text-center">
              {/* B.3: Number and 'days' inline */}
              <div className="flex justify-center items-end leading-none">
                <div className="text-5xl font-bold text-white">{currentStreak}</div>
                <div className="text-lg font-bold text-gray-300 mb-1 ml-1">days</div>
              </div>

              <div className="text-sm text-gray-400 mt-1">Longest Streak: {longestStreak} days</div>
              
              {/* B.4: Mode Indicator below Longest Streak */}
              <div className="text-xs text-gray-400 font-medium mt-1">
                {streakModeText} MODE
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Widget 3: Habit Type Focus */}
          <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600">
            {/* Title Row with Info Icon */}
            <div className="flex justify-between items-center mb-4 relative">
              <div className="text-sm font-semibold text-gray-300">Habit Type Focus</div>
              
              {/* Info Icon for Focus Metric */}
              <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-default" 
                    title={focusInfo}
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
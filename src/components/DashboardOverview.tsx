import React from 'react';
import { DashboardOverviewProps } from '../types';

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ dashboardData, onToggleRateMode }) => {
  const { weeklyCompletionRate, currentStreak, longestStreak, categoryBreakdown, heatmapData } = dashboardData;

  // Determine the current rate value and mode text
  const currentRate = weeklyCompletionRate.mode === 'basic' 
      ? weeklyCompletionRate.basic 
      : weeklyCompletionRate.hard;
      
  const modeText = weeklyCompletionRate.mode === 'basic' 
      ? 'Basic Mode (High Motivation)' 
      : 'Hard Mode (Strict)';

  // Helper function for the heatmap color
  const getHeatmapColor = (count: number): string => {
    if (count === 0) return 'bg-gray-700/50';
    if (count <= 1) return 'bg-green-600/30';
    if (count <= 3) return 'bg-green-600/60';
    return 'bg-green-600';
  };
  
  // Helper function to generate the conic gradient for the donut chart placeholder
  const getDonutGradient = () => {
    const goal = categoryBreakdown['Goal Habit'];
    const anchor = categoryBreakdown['Habit Muscle 💪'];
    const regular = categoryBreakdown['Regular'];
    
    const segments = [
      { name: 'Goal Habit', value: goal, color: '#ef4444' },
      { name: 'Habit Muscle 💪', value: anchor, color: '#3b82f6' },
      { name: 'Regular', value: regular, color: '#a855f7' }
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

  return (
    <div className="p-4">
      {/* Main Content Card - Slightly Lighter Background */}
      <div className="bg-[#2C2C2E] p-6 rounded-2xl shadow-xl space-y-6">
        
        {/* WIDGET GRID (APPLYING MOBILE FIX) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Widget 1: Weekly Completion Rate (CLICKABLE FOR TOGGLE) */}
          <div 
            className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600 cursor-pointer transition-colors hover:bg-gray-700"
            onClick={onToggleRateMode} // TOGGLE CLICK HANDLER
          >
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-semibold text-gray-300">Weekly Completion Rate</div>
                <div className="text-xs text-gray-400 font-medium">{weeklyCompletionRate.mode === 'basic' ? 'BASIC' : 'HARD'} MODE</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">{currentRate}%</div>
              <div className="text-sm text-gray-400 mt-1">{modeText}</div>
            </div>
          </div>

          {/* Widget 2: Consistency Streak */}
          <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600">
            <div className="text-sm font-semibold text-gray-300 mb-2">Consistency Streak</div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white leading-none">{currentStreak}</div>
              <div className="text-lg font-bold text-gray-300 mb-2">days</div>
              <div className="text-sm text-gray-400 mt-1">Longest Streak: {longestStreak} days</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Widget 3: Habit Type Focus (Donut Chart) */}
          <div className="bg-[#1C1C1E] p-4 rounded-lg border border-gray-600">
            <div className="text-sm font-semibold text-gray-300 mb-4">Habit Type Focus</div>
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
                    'Goal Habit': 'text-red-400',
                    'Habit Muscle 💪': 'text-blue-400', // FIXED LABEL REFERENCE
                    'Regular': 'text-purple-400',
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
                  className={`w-full aspect-square rounded-sm ${getHeatmapColor(data.completionCount)} transition-colors`}
                  title={`Completed ${data.completionCount} habits on ${data.date}`}
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
import React from 'react';
import { CoreValuesSection, PathSection, ScheduleSection, CustomSectionComponent } from './SectionComponents';
import { Habit } from '../../types';

import { useVisionBoard } from '../../contexts/VisionBoardContext';

interface VisionBoardDashboardProps {
   habits: Habit[];
   rawGoal?: string;
}

export const VisionBoardDashboard: React.FC<VisionBoardDashboardProps> = ({ habits, rawGoal }) => {
   const { data, updateSchedule } = useVisionBoard();
   const { schedule } = data;
   return (
      <div className="min-h-screen bg-gray-900 text-white pb-20">
         <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight">Vision Board</h1>
               <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">MASTER DASHBOARD</p>
            </div>
            <div className="text-xs text-green-500 font-medium bg-green-500/10 px-3 py-1 rounded-full">
               AUTO-SAVING
            </div>
         </div>

         <div className="max-w-3xl mx-auto divide-y divide-gray-800">
            {/* What I'm chasing — raw goal from onboarding */}
            {rawGoal && (
               <section className="px-6 py-6">
                  <p className="text-xs font-semibold text-yellow-500/60 uppercase tracking-widest mb-2">What I'm chasing</p>
                  <blockquote className="border-l-2 border-yellow-500/40 pl-4 text-gray-300 text-base italic leading-relaxed">
                     "{rawGoal}"
                  </blockquote>
               </section>
            )}

            {/* Stacked Vertical Sections */}
            <section>
               <CoreValuesSection mode="edit" />
            </section>

            <section className="bg-gray-900">
               <PathSection mode="edit" habits={habits} />
            </section>

            <section className="bg-gray-900">
               <ScheduleSection mode="edit" schedule={schedule} updateSchedule={updateSchedule} habits={habits} />
            </section>

            <section className="bg-gray-900">
               <CustomSectionComponent mode="edit" />
            </section>
         </div>
      </div>
   );
};

import React from 'react';
import { CoreValuesSection, PathSection, ScheduleSection, CustomSectionComponent } from './SectionComponents';
import { Habit } from '../../types';

import { useVisionBoard } from '../../contexts/VisionBoardContext';

interface VisionBoardDashboardProps {
   habits: Habit[];
}

export const VisionBoardDashboard: React.FC<VisionBoardDashboardProps> = ({ habits }) => {
   const { data, updateSchedule } = useVisionBoard();
   const { schedule } = data;
   return (
      <div className="min-h-screen bg-gray-900 text-white pb-20">
         <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight">Vision Board</h1>
               <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">MASTER DASHBOARD</p>
            </div>
            <div className="text-xs text-green-500 font-medium bg-green-500/10 px-3 py-1 rounded-full">
               AUTO-SAVING
            </div>
         </div>

         <div className="max-w-3xl mx-auto divide-y divide-gray-800">
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

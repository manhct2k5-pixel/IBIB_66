import React from 'react';
import type { NavigationStep } from '../../types';

interface RouteProgressProps {
  currentStepIndex: number;
  totalSteps: number;
  steps: NavigationStep[];
}

export const RouteProgress: React.FC<RouteProgressProps> = ({
  currentStepIndex,
  totalSteps,
  steps
}) => {
  const progressPercent = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

  return (
    <div className="w-full bg-teal-900 text-white px-4 py-2 flex flex-col gap-1.5 shadow-inner">
      <div className="flex items-center justify-between text-sm sm:text-base font-bold">
        <span className="text-teal-200">
          Chặng {currentStepIndex + 1} / {totalSteps}
        </span>
        <span className="text-teal-100 font-medium">
          {progressPercent}% tuyến đường
        </span>
      </div>

      {/* Thanh tiến trình phân đoạn */}
      <div className="w-full h-2.5 bg-teal-950/60 rounded-full overflow-hidden flex gap-1 p-0.5 border border-teal-700/50">
        {steps.map((_, idx) => {
          let segmentBg = 'bg-teal-950/40';
          if (idx < currentStepIndex) {
            segmentBg = 'bg-teal-400';
          } else if (idx === currentStepIndex) {
            segmentBg = 'bg-amber-400 animate-pulse';
          }
          return (
            <div
              key={idx}
              className={`h-full flex-1 rounded-sm transition-all duration-300 ${segmentBg}`}
            />
          );
        })}
      </div>
    </div>
  );
};

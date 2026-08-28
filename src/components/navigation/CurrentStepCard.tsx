import React from 'react';
import { 
  ArrowUp, 
  ArrowUpLeft, 
  ArrowUpRight, 
  DoorOpen, 
  Building2, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Eye
} from 'lucide-react';
import type { NavigationStep } from '../../types';

interface CurrentStepCardProps {
  step: NavigationStep;
  stepIndex: number;
  totalSteps: number;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const CurrentStepCard: React.FC<CurrentStepCardProps> = ({
  step,
  stepIndex,
  totalSteps,
  isSpeaking,
  onToggleSpeech
}) => {
  // Biểu tượng hành động theo actionType
  const getActionIcon = () => {
    switch (step.actionType) {
      case 'turn_left':
        return <ArrowUpLeft className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 stroke-[3]" />;
      case 'turn_right':
        return <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 stroke-[3]" />;
      case 'enter_building':
        return <DoorOpen className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 stroke-[2.5]" />;
      case 'take_elevator':
        return <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 stroke-[2.5]" />;
      case 'arrive':
        return <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 stroke-[2.5]" />;
      case 'go_straight':
      default:
        return <ArrowUp className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 stroke-[3]" />;
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-800 flex flex-col gap-3">
      {/* Hàng trên: Icon chỉ hướng + Câu lệnh chính */}
      <div className="flex items-start gap-3.5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border-2 border-amber-400/40 flex items-center justify-center shrink-0 shadow-md">
          {getActionIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-sm font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Chặng {stepIndex + 1}/{totalSteps}
            </span>
            {step.distanceMeters && step.distanceMeters > 0 && (
              <span className="text-sm font-bold text-amber-300">
                ~{step.distanceMeters} mét
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            {step.instruction}
          </h2>
        </div>
      </div>

      {/* Thông tin mốc nhận biết thực tế */}
      <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 flex items-start gap-2.5">
        <Eye className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm sm:text-base text-slate-200">
          <span className="font-bold text-amber-300">Mốc nhận biết: </span>
          <span>{step.landmark}</span>
        </div>
      </div>

      {/* Tầng & Tòa nhà nếu có */}
      {(step.buildingId || step.floorId) && (
        <div className="flex items-center justify-between text-sm text-slate-300 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1.5 font-medium">
            <Building2 className="w-4 h-4 text-teal-400" />
            {step.floorId ? `${step.floorId}` : 'Mặt đất'}
          </span>

          <button
            type="button"
            onClick={onToggleSpeech}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-teal-100 text-sm font-bold transition-colors"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-300" />
                <span>Dừng đọc</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-teal-200" />
                <span>Nghe lại</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { NavigationRoute, NavigationStep } from '../types';
import { 
  ArrowUp, 
  CornerUpLeft, 
  CornerUpRight, 
  Layers, 
  Footprints, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  CheckCircle2, 
  Clock, 
  Milestone
} from 'lucide-react';
import { speakInstruction, stopSpeaking } from '../utils/speech';

interface NavigationControllerProps {
  route: NavigationRoute;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onClose: () => void;
  language: 'vi' | 'en';
}

export const NavigationController: React.FC<NavigationControllerProps> = ({
  route,
  currentStepIndex,
  onStepChange,
  onClose,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [showStepList, setShowStepList] = useState<boolean>(false);

  const currentStep: NavigationStep | undefined = route.steps[currentStepIndex];
  const totalSteps = route.steps.length;

  // Speak instruction when step changes
  useEffect(() => {
    if (currentStep && isVoiceEnabled) {
      const text = language === 'vi' ? currentStep.instructionVi : currentStep.instructionEn;
      speakInstruction(text, language);
    }
  }, [currentStepIndex, isVoiceEnabled, language]);

  // Auto-play / Simulation loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const stepDuration = Math.max(1500, (currentStep?.distance || 10) * 400 / playSpeed);
      timer = setTimeout(() => {
        if (currentStepIndex < totalSteps - 1) {
          onStepChange(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, stepDuration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, totalSteps, playSpeed, currentStep]);

  // Maneuver Icon Resolver
  const getManeuverIcon = (maneuver: NavigationStep['maneuver']) => {
    switch (maneuver) {
      case 'turn_left':
      case 'turn_slight_left':
        return <CornerUpLeft className="w-8 h-8 text-cyan-600" />;
      case 'turn_right':
      case 'turn_slight_right':
        return <CornerUpRight className="w-8 h-8 text-cyan-600" />;
      case 'take_elevator_up':
      case 'take_stairs_up':
        return <Layers className="w-8 h-8 text-amber-500" />;
      case 'take_elevator_down':
      case 'take_stairs_down':
        return <Layers className="w-8 h-8 text-amber-600" />;
      case 'cross_skybridge':
        return <Milestone className="w-8 h-8 text-emerald-600" />;
      case 'arrive':
        return <CheckCircle2 className="w-8 h-8 text-emerald-600" />;
      case 'start':
      case 'straight':
      default:
        return <ArrowUp className="w-8 h-8 text-blue-600" />;
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Minutes and seconds
  const minutes = Math.floor(route.estimatedDurationSeconds / 60);
  const seconds = route.estimatedDurationSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes} phút ${seconds > 0 ? `${seconds}s` : ''}` : `${seconds} giây`;

  return (
    <div className="w-full bg-white border-t border-slate-200 p-2.5 sm:p-4 shadow-xl text-slate-800 flex flex-col gap-2 sm:gap-3">
      {/* Top Route Summary Bar */}
      <div className="flex items-center justify-between gap-2 text-xs border-b border-slate-200 pb-1.5 sm:pb-2">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="flex items-center gap-1 font-bold text-cyan-700 shrink-0">
            <Footprints className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{route.totalDistance}m</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span>~{timeFormatted}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
            <Layers className="w-4 h-4" />
            <span>{route.floorsInvolved.length} Tầng</span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Voice guidance toggle */}
          <button
            id="btn-toggle-voice"
            onClick={() => {
              if (isVoiceEnabled) stopSpeaking();
              setIsVoiceEnabled(!isVoiceEnabled);
            }}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
              isVoiceEnabled 
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold' 
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title="Bật/Tắt giọng đọc chỉ đường"
          >
            {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="hidden md:inline">{isVoiceEnabled ? 'Giọng đọc: BẬT' : 'Giọng đọc: TẮT'}</span>
          </button>

          {/* Toggle Full Steps List */}
          <button
            id="btn-toggle-steps-list"
            onClick={() => setShowStepList(!showStepList)}
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] sm:text-xs border border-slate-200 transition cursor-pointer font-medium"
          >
            {showStepList ? 'Thu gọn' : `Chi tiết (${totalSteps})`}
          </button>

          {/* Exit navigation */}
          <button
            id="btn-exit-navigation"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1 sm:p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-lg border border-slate-200 transition cursor-pointer"
            title="Dừng chỉ đường"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1 sm:h-1.5 rounded-full overflow-hidden border border-slate-200">
        <div 
          className="bg-cyan-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Current Turn Direction Active Card */}
      {currentStep && (
        <div className="flex items-center gap-2.5 sm:gap-4 bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shrink-0 shadow-xs">
            {getManeuverIcon(currentStep.maneuver)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <span className="px-1.5 sm:px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] sm:text-[11px] font-bold rounded-md shrink-0">
                Bước {currentStep.stepIndex} / {totalSteps}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                Tòa {currentStep.buildingId} - {currentStep.floorId === 'B1' ? 'Tầng B1' : `Tầng ${currentStep.floorId}`}
              </span>
              {currentStep.distance > 0 && (
                <span className="text-[10px] sm:text-[11px] text-slate-700 font-bold ml-auto shrink-0">
                  {currentStep.distance}m
                </span>
              )}
            </div>

            <p className="text-xs sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 sm:line-clamp-none">
              {language === 'vi' ? currentStep.instructionVi : currentStep.instructionEn}
            </p>
          </div>

          {/* Re-play voice button */}
          <button
            id="btn-replay-voice"
            onClick={() => {
              const text = language === 'vi' ? currentStep.instructionVi : currentStep.instructionEn;
              speakInstruction(text, language);
            }}
            className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 text-cyan-700 rounded-xl border border-slate-200 transition shrink-0 shadow-xs cursor-pointer"
            title="Đọc lại hướng dẫn"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Simulation Controls */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-0.5">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="btn-step-prev"
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer shadow-xs min-h-[34px]"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bước trước</span>
          </button>

          <button
            id="btn-step-play-pause"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 sm:px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer min-h-[34px]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Mô phỏng đi</span>
              </>
            )}
          </button>

          <button
            id="btn-step-next"
            onClick={() => onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === totalSteps - 1}
            className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer shadow-xs min-h-[34px]"
          >
            <span className="hidden sm:inline">Bước tiếp</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] text-slate-400 mr-0.5 hidden md:inline">Tốc độ:</span>
          {[1, 2, 4].map(s => (
            <button
              key={s}
              id={`btn-speed-${s}x`}
              onClick={() => setPlaySpeed(s)}
              className={`px-1.5 sm:px-2 py-1 rounded-lg font-bold text-[10px] sm:text-[11px] transition cursor-pointer ${
                playSpeed === s 
                  ? 'bg-cyan-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Steps List Drawer */}
      {showStepList && (
        <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200 mt-1">
          {route.steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                id={`step-item-${idx}`}
                onClick={() => onStepChange(idx)}
                className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                  isCurrent 
                    ? 'bg-cyan-50 border border-cyan-300 text-cyan-950 font-bold shadow-xs' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-slate-900 font-medium">
                      {language === 'vi' ? step.instructionVi : step.instructionEn}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Tòa {step.buildingId} • T{step.floorId}
                    </span>
                  </div>
                </div>

                {step.distance > 0 && (
                  <span className="text-[10px] text-slate-500 font-medium shrink-0">
                    {step.distance}m
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

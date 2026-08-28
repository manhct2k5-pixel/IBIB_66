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
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  Clock, 
  Milestone,
  QrCode,
  MapPin,
  Eye,
  Info,
  RotateCcw
} from 'lucide-react';
import { speakInstruction, stopSpeaking } from '../utils/speech';

interface NavigationControllerProps {
  route: NavigationRoute;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onClose: () => void;
  onOpenQRScanner: () => void;
  language: 'vi' | 'en';
}

export const NavigationController: React.FC<NavigationControllerProps> = ({
  route,
  currentStepIndex,
  onStepChange,
  onClose,
  onOpenQRScanner,
  language
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [showStepList, setShowStepList] = useState<boolean>(false);
  const [userConfirmedNotice, setUserConfirmedNotice] = useState<string | null>(null);

  const currentStep: NavigationStep | undefined = route.steps[currentStepIndex];
  const totalSteps = route.steps.length;
  const isFinalStep = currentStepIndex === totalSteps - 1;

  // Speak instruction when step changes
  useEffect(() => {
    if (currentStep && isVoiceEnabled) {
      const text = language === 'vi' ? currentStep.instructionVi : currentStep.instructionEn;
      speakInstruction(text, language);
    }
  }, [currentStepIndex, isVoiceEnabled, language]);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIdx = currentStepIndex + 1;
      onStepChange(nextIdx);
      setUserConfirmedNotice(`Đã xác nhận đến Bước ${currentStepIndex + 1}. Đang hiển thị Bước ${nextIdx + 1}.`);
      setTimeout(() => setUserConfirmedNotice(null), 3000);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1);
    }
  };

  // Maneuver Icon Resolver
  const getManeuverIcon = (maneuver: NavigationStep['maneuver']) => {
    switch (maneuver) {
      case 'turn_left':
      case 'turn_slight_left':
        return <CornerUpLeft className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 shrink-0" />;
      case 'turn_right':
      case 'turn_slight_right':
        return <CornerUpRight className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 shrink-0" />;
      case 'take_elevator_up':
      case 'take_stairs_up':
        return <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 shrink-0" />;
      case 'take_elevator_down':
      case 'take_stairs_down':
        return <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 shrink-0" />;
      case 'cross_skybridge':
        return <Milestone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 shrink-0" />;
      case 'arrive':
        return <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 shrink-0" />;
      case 'start':
      case 'straight':
      default:
        return <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 shrink-0" />;
    }
  };

  // Time format
  const minutes = Math.floor(route.estimatedDurationSeconds / 60);
  const seconds = route.estimatedDurationSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes} phút ${seconds > 0 ? `${seconds}s` : ''}` : `${seconds} giây`;

  // Landmark observation hint text
  const getLandmarkHint = (step: NavigationStep) => {
    if (step.maneuver === 'arrive') {
      return `Bạn đã đến cửa/sảnh ${step.toNode.name}. Vui lòng liên hệ quầy tiếp đón tại sảnh nếu cần hỗ trợ thêm.`;
    }
    if (step.fromNode.buildingId !== 'OUTDOOR') {
      return `Khu vực sảnh Tòa ${step.fromNode.buildingId}. Chú ý quan sát biển tên phòng và biển chỉ dẫn treo tường.`;
    }
    return `Trục đường nội khu: Đi theo lối đi chính, quan sát biển chỉ dẫn và các khối nhà lân cận (${step.toNode.name}).`;
  };

  return (
    <div 
      id="navigation-controller-panel"
      className="w-full bg-white border-t border-slate-200 p-3 sm:p-4 shadow-2xl text-slate-800 flex flex-col gap-3 max-h-[70vh] sm:max-h-[50vh] overflow-y-auto"
    >
      {/* Top Route Summary Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200">
            <Footprints className="w-3.5 h-3.5 text-cyan-700" />
            <span>{route.totalDistance}m</span>
          </div>

          <div className="flex items-center gap-1 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{timeFormatted}</span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Bước {currentStepIndex + 1} / {totalSteps}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* TTS Voice Toggle */}
          <button
            id="btn-toggle-voice"
            onClick={() => {
              if (isVoiceEnabled) stopSpeaking();
              setIsVoiceEnabled(!isVoiceEnabled);
            }}
            className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition cursor-pointer ${
              isVoiceEnabled 
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold' 
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title="Bật/Tắt giọng đọc chỉ đường"
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{isVoiceEnabled ? 'Giọng đọc: BẬT' : 'Giọng đọc: TẮT'}</span>
          </button>

          {/* Toggle Step List */}
          <button
            id="btn-toggle-step-list"
            onClick={() => setShowStepList(!showStepList)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs border border-slate-200 transition cursor-pointer font-semibold"
          >
            {showStepList ? 'Thu gọn' : `Toàn tuyến (${totalSteps})`}
          </button>

          {/* Stop Navigation */}
          <button
            id="btn-stop-navigation"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Dừng chỉ đường"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notice after user confirmation */}
      {userConfirmedNotice && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{userConfirmedNotice}</span>
        </div>
      )}

      {/* Main Single Step Card */}
      {currentStep && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              {getManeuverIcon(currentStep.maneuver)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded-md">
                  {isFinalStep ? 'Đến điểm đích' : `Bước ${currentStepIndex + 1} / ${totalSteps}`}
                </span>
                {currentStep.distance > 0 && (
                  <span className="text-xs font-bold text-slate-600">
                    {currentStep.distance}m
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                {language === 'vi' ? currentStep.instructionVi : currentStep.instructionEn}
              </h3>
            </div>
          </div>

          {/* Landmark Observation Guide */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Eye className="w-3.5 h-3.5 text-cyan-600" />
              <span>Mốc quan sát thực tế:</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-5">
              {getLandmarkHint(currentStep)}
            </p>
          </div>

          {/* Survey notice (Requirement 4) */}
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pl-1 italic">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Đoạn đường này chưa có ảnh mốc khảo sát. Vui lòng đối chiếu biển chỉ dẫn thực tế.</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons: Next / QR Checkpoint / Back */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Previous Step Button */}
        {currentStepIndex > 0 && (
          <button
            id="btn-prev-step"
            onClick={handlePrevStep}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bước trước</span>
          </button>
        )}

        {/* Primary Next Action: "Tôi đã đến điểm này" or "Hoàn thành" */}
        {!isFinalStep ? (
          <button
            id="btn-confirm-arrived-step"
            onClick={handleNextStep}
            className="flex-1 min-w-[150px] py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <span>Tôi đã đến điểm này</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="btn-finish-navigation"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="flex-1 min-w-[150px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã đến nơi • Hoàn thành</span>
          </button>
        )}

        {/* Button: Scan QR to verify location */}
        <button
          id="btn-nav-scan-qr"
          onClick={onOpenQRScanner}
          className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          title="Quét QR checkpoint để xác nhận lại vị trí đứng"
        >
          <QrCode className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Quét QR vị trí</span>
          <span className="sm:hidden">Quét QR</span>
        </button>
      </div>

      {/* Expanded Step-by-Step List */}
      {showStepList && (
        <div className="mt-2 space-y-1.5 border-t border-slate-200 pt-3">
          <div className="text-xs font-bold text-slate-700 mb-1">
            Toàn bộ các bước chỉ đường ({totalSteps} bước):
          </div>
          {route.steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => onStepChange(idx)}
              className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-950 font-bold shadow-2xs'
                  : idx < currentStepIndex
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                idx === currentStepIndex
                  ? 'bg-cyan-600 text-white font-black'
                  : idx < currentStepIndex
                  ? 'bg-slate-300 text-slate-700'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="truncate">
                  {language === 'vi' ? step.instructionVi : step.instructionEn}
                </div>
                {step.distance > 0 && (
                  <div className="text-[10px] text-slate-500 font-normal">
                    Khoảng cách: {step.distance}m
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Volume2, 
  VolumeX, 
  QrCode, 
  MoreVertical, 
  X, 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  Footprints,
  CornerUpRight,
  CornerUpLeft
} from 'lucide-react';
import { MapNode, NavigationRoute, RouteStep } from '../types';
import { Hospital2DCampusMap } from './Hospital2DCampusMap';
import { speakInstruction, stopSpeaking } from '../utils/speech';

interface SimpleNavigationViewProps {
  startNode: MapNode;
  destinationNode: MapNode;
  activeRoute: NavigationRoute;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onArrived: () => void;
  onStopNavigation: () => void;
  onOpenQRScanner: () => void;
  language?: 'vi' | 'en';
}

export const SimpleNavigationView: React.FC<SimpleNavigationViewProps> = ({
  startNode,
  destinationNode,
  activeRoute,
  currentStepIndex,
  onStepChange,
  onArrived,
  onStopNavigation,
  onOpenQRScanner,
  language = 'vi'
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [showAllStepsModal, setShowAllStepsModal] = useState(false);
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);

  const steps = activeRoute.steps;
  const currentStep: RouteStep | undefined = steps[currentStepIndex];
  const isLastStep = currentStepIndex >= steps.length - 1;

  // Auto-speak ONLY if explicitly enabled by user
  useEffect(() => {
    if (autoSpeakEnabled && currentStep) {
      speakInstruction(currentStep.instruction || currentStep.instructionVi, language === 'en' ? 'en' : 'vi');
      setIsSpeaking(true);
    }
  }, [currentStepIndex, autoSpeakEnabled, currentStep, language]);

  // Handle manual speak button click
  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (currentStep) {
      speakInstruction(currentStep.instruction || currentStep.instructionVi, language === 'en' ? 'en' : 'vi');
      setIsSpeaking(true);
    }
  };

  // Helper for step icons
  const getStepIcon = (action: string) => {
    switch (action) {
      case 'turn-left':
        return <CornerUpLeft className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-800 stroke-[2.5]" />;
      case 'turn-right':
        return <CornerUpRight className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-800 stroke-[2.5]" />;
      case 'arrive':
        return <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-700 stroke-[2.5]" />;
      case 'straight':
      default:
        return <ArrowUp className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-800 stroke-[2.5]" />;
    }
  };

  // Handle step advance
  const handleConfirmStep = () => {
    if (isLastStep) {
      stopSpeaking();
      onArrived();
    } else {
      setConfirmationNotice('Đã xác nhận. Đây là hướng dẫn tiếp theo.');
      setTimeout(() => {
        setConfirmationNotice(null);
      }, 2500);

      onStepChange(currentStepIndex + 1);
    }
  };

  if (!currentStep) return null;

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-100 overflow-hidden relative">
      {/* Mini Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-500">
              Đang đi đến:
            </div>
            <div className="text-base font-black text-slate-900 truncate">
              {destinationNode.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-nav-stop-trigger"
            onClick={() => setIsStopConfirmOpen(true)}
            className="h-10 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-sm rounded-xl border border-rose-200 transition flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <X className="w-4 h-4 text-rose-700" />
            <span>Dừng</span>
          </button>

          <button
            id="btn-nav-options-toggle"
            onClick={() => setIsOptionsMenuOpen(true)}
            className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 transition flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-600"
            aria-label="Mở tùy chọn chỉ đường"
          >
            <MoreVertical className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Tùy chọn</span>
          </button>
        </div>
      </div>

      {/* Map Area (Clamped mobile height clamp(200px, 34dvh, 300px)) */}
      <div className="w-full h-[clamp(200px,34dvh,300px)] shrink-0 relative bg-slate-200 border-b-2 border-slate-300 overflow-hidden">
        <Hospital2DCampusMap
          startNode={startNode}
          destinationNode={destinationNode}
          onSelectStartNode={() => {}}
          onSelectDestinationNode={() => {}}
          activeRoute={activeRoute}
          currentStepIndex={currentStepIndex}
          isNavigating={true}
          routingProfile="fastest"
          language={language}
        />
      </div>

      {/* Turn-by-Turn Instruction Card Container (Takes remaining space, thumb-reach buttons at bottom) */}
      <div className="flex-1 flex flex-col justify-between bg-white px-4 py-4 sm:py-5 overflow-y-auto z-10 space-y-3">
        {/* Step Progress & Confirmation Notice */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1.5 bg-cyan-100 text-cyan-900 font-black text-base sm:text-lg rounded-xl">
              Bước {currentStepIndex + 1} / {steps.length}
            </span>

            <span className="text-sm sm:text-base font-bold text-slate-600">
              Cách mốc ~{Math.round(currentStep.distance)} mét
            </span>
          </div>

          {confirmationNotice && (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 font-bold text-base flex items-center gap-2 animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />
              <span>{confirmationNotice}</span>
            </div>
          )}
        </div>

        {/* Main Instruction Display */}
        <div className="p-4 sm:p-5 bg-cyan-50/70 border-2 border-cyan-300 rounded-3xl flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-cyan-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
            {getStepIcon(currentStep.action)}
          </div>

          <div className="min-w-0 space-y-1.5 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug">
              {currentStep.instruction}
            </h2>
            {currentStep.visualCue && (
              <p className="text-base sm:text-lg text-cyan-950 font-semibold leading-relaxed">
                {currentStep.visualCue}
              </p>
            )}
          </div>
        </div>

        {/* Primary Action & Secondary Buttons in Thumb Reach */}
        <div className="space-y-3 pt-1">
          {/* Largest Primary Action Button */}
          <button
            id="btn-confirm-step"
            onClick={handleConfirmStep}
            className="w-full h-16 sm:h-18 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white font-black text-xl rounded-2xl shadow-lg transition flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/40"
          >
            <Check className="w-7 h-7 stroke-[3]" />
            <span>{isLastStep ? 'Tôi đã đến nơi' : 'Tôi đã đến mốc này'}</span>
          </button>

          {/* 2 Simple Secondary Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Audio Speech Button */}
            <button
              id="btn-toggle-speech-guidance"
              onClick={handleToggleSpeak}
              className={`h-13 font-bold text-base rounded-2xl border-2 flex items-center justify-center gap-2 transition cursor-pointer ${
                isSpeaking 
                  ? 'bg-rose-50 text-rose-900 border-rose-300' 
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 text-rose-700" />
                  <span>Dừng đọc</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-cyan-800" />
                  <span>Nghe hướng dẫn</span>
                </>
              )}
            </button>

            {/* QR Scanner for Position Verification */}
            <button
              id="btn-scan-qr-checkpoint"
              onClick={onOpenQRScanner}
              className="h-13 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <QrCode className="w-5 h-5 text-cyan-800" />
              <span>Quét mã vị trí</span>
            </button>
          </div>
        </div>
      </div>

      {/* Options Menu Modal */}
      {isOptionsMenuOpen && (
        <div 
          id="nav-options-backdrop"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">
                Tùy chọn chỉ đường
              </h3>
              <button
                onClick={() => setIsOptionsMenuOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-800"
                aria-label="Đóng tùy chọn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Back to previous step */}
              {currentStepIndex > 0 && (
                <button
                  onClick={() => {
                    onStepChange(currentStepIndex - 1);
                    setIsOptionsMenuOpen(false);
                  }}
                  className="w-full h-14 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-base text-slate-800 flex items-center gap-3"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                  <span>Quay lại bước trước</span>
                </button>
              )}

              {/* View all steps */}
              <button
                onClick={() => {
                  setIsOptionsMenuOpen(false);
                  setShowAllStepsModal(true);
                }}
                className="w-full h-14 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-base text-slate-800 flex items-center gap-3"
              >
                <Footprints className="w-5 h-5 text-cyan-800" />
                <span>Xem danh sách toàn bộ các bước ({steps.length})</span>
              </button>

              {/* Auto Speak Toggle */}
              <label className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-base text-slate-800 flex items-center justify-between cursor-pointer">
                <span>Tự động đọc khi chuyển bước</span>
                <input
                  type="checkbox"
                  checked={autoSpeakEnabled}
                  onChange={(e) => setAutoSpeakEnabled(e.target.checked)}
                  className="w-6 h-6 text-cyan-700 rounded-lg"
                />
              </label>

              {/* Stop navigation */}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOptionsMenuOpen(false);
                  onStopNavigation();
                }}
                className="w-full h-14 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 rounded-2xl font-bold text-base flex items-center gap-3"
              >
                <X className="w-5 h-5 text-rose-700" />
                <span>Dừng chỉ đường</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Steps Modal */}
      {showAllStepsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 bg-cyan-700 text-white flex items-center justify-between">
              <h3 className="text-lg font-black">
                Toàn bộ {steps.length} bước di chuyển
              </h3>
              <button
                onClick={() => setShowAllStepsModal(false)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onStepChange(idx);
                    setShowAllStepsModal(false);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    idx === currentStepIndex
                      ? 'border-cyan-600 bg-cyan-50'
                      : idx < currentStepIndex
                      ? 'border-slate-200 bg-slate-50 opacity-75'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                    idx === currentStepIndex
                      ? 'bg-cyan-700 text-white'
                      : idx < currentStepIndex
                      ? 'bg-slate-400 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-slate-900">
                      {s.instruction}
                    </div>
                    {s.visualCue && (
                      <div className="text-sm text-slate-600 mt-0.5">
                        {s.visualCue}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setShowAllStepsModal(false)}
                className="w-full h-13 bg-slate-800 text-white font-bold text-base rounded-2xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stop Navigation Confirmation Modal */}
      {isStopConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <X className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Bạn muốn dừng chỉ đường?
              </h3>
              <p className="text-sm font-semibold text-slate-600">
                Tuyến đường hiện tại sẽ được dừng lại và quay về màn hình xem trước.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                id="btn-continue-navigation"
                onClick={() => setIsStopConfirmOpen(false)}
                className="w-full h-14 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white font-black text-lg rounded-2xl transition cursor-pointer shadow-md"
              >
                Tiếp tục chỉ đường
              </button>

              <button
                id="btn-confirm-stop-navigation"
                onClick={() => {
                  stopSpeaking();
                  setIsStopConfirmOpen(false);
                  onStopNavigation();
                }}
                className="w-full h-12 bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-300 font-bold text-base rounded-2xl transition cursor-pointer"
              >
                Dừng chỉ đường
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

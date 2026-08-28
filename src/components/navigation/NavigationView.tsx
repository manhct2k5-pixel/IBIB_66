import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  QrCode, 
  HelpCircle, 
  PhoneCall, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import type { 
  NavigationSession, 
  CalculatedRoute, 
  Destination, 
  StartLocation, 
  RouteNode 
} from '../../types';
import { HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES } from '../../data/hospital108/navigation';
import { RouteProgress } from './RouteProgress';
import { CurrentStepCard } from './CurrentStepCard';
import { RouteMap } from './RouteMap';
import { RelocateSheet } from './RelocateSheet';
import { QRCheckpointScanner } from './QRCheckpointScanner';

interface NavigationViewProps {
  session: NavigationSession;
  route: CalculatedRoute;
  destination: Destination;
  startLocation: StartLocation;
  onArrive: () => void;
  onExit: () => void;
  onRecalculateRoute: (newNode: RouteNode) => void;
  onOpenOfficialMap: () => void;
}

export const NavigationView: React.FC<NavigationViewProps> = ({
  session,
  route,
  destination,
  startLocation,
  onArrive,
  onExit,
  onRecalculateRoute,
  onOpenOfficialMap
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(session.currentStepIndex || 0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isRelocateOpen, setIsRelocateOpen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);

  const steps = route.steps;
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || steps[0];
  const currentNodeId = currentStep ? currentStep.fromNodeId : route.pathNodeIds[0];

  // Lưu session vào localStorage
  useEffect(() => {
    try {
      const updatedSession: NavigationSession = {
        ...session,
        currentStepIndex,
        updatedAt: Date.now()
      };
      localStorage.setItem('mednav_108_active_session', JSON.stringify(updatedSession));
    } catch {
      // Bỏ qua lỗi quota storage nếu có
    }
  }, [session, currentStepIndex]);

  // Trợ lý đọc giọng nói tiếng Việt
  const speakInstruction = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.92; // Tốc độ vừa phải cho người cao tuổi

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Đọc tự động khi chuyển sang bước mới nếu bật
  useEffect(() => {
    if (currentStep) {
      const speechText = `${currentStep.instruction}. Mốc nhận biết: ${currentStep.landmark}`;
      speakInstruction(speechText);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, currentStep, speakInstruction]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (currentStep) {
      const speechText = `${currentStep.instruction}. Mốc nhận biết: ${currentStep.landmark}`;
      speakInstruction(speechText);
    }
  };

  // Người dùng bấm "Tôi đã đến mốc này"
  const handleAdvanceStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Đã đến bước cuối cùng -> Chuyển sang màn hình Đến nơi
      onArrive();
    }
  };

  // Xử lý quét QR thành công
  const handleConfirmQrCheckpoint = (detectedNode: RouteNode) => {
    // Tìm xem node này có nằm trong danh sách steps không
    const matchingStepIdx = steps.findIndex(s => s.toNodeId === detectedNode.id);
    if (matchingStepIdx !== -1) {
      if (matchingStepIdx < totalSteps - 1) {
        setCurrentStepIndex(matchingStepIdx + 1);
      } else {
        onArrive();
      }
    } else {
      // Nếu node không thuộc tuyến hiện tại -> Tính lại đường
      onRecalculateRoute(detectedNode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header cố định */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        <div className="text-center px-2 flex-1 min-w-0">
          <div className="text-sm text-slate-400 font-medium truncate">
            Tới: {destination.name}
          </div>
          <div className="text-sm text-teal-400 font-bold">
            {destination.building} — {destination.floor}
          </div>
        </div>

        <a
          href="tel:02462784108"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-sm font-bold border border-rose-800 transition-colors"
          title="Gọi khẩn cấp viện 108"
        >
          <PhoneCall className="w-4 h-4" />
          <span className="hidden sm:inline">Trợ giúp</span>
        </a>
      </header>

      {/* Tiến trình phân đoạn */}
      <RouteProgress
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        steps={steps}
      />

      {/* Thân giao diện cuộn */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 flex flex-col gap-4">
        {/* Sơ đồ tuyến bản đồ */}
        <RouteMap
          nodes={HOSPITAL_108_ROUTE_NODES}
          edges={HOSPITAL_108_ROUTE_EDGES}
          pathNodeIds={route.pathNodeIds}
          currentNodeId={currentNodeId}
          currentStepIndex={currentStepIndex}
          steps={steps}
          onOpenOfficialMap={onOpenOfficialMap}
        />

        {/* Thẻ chỉ dẫn hiện tại */}
        {currentStep && (
          <CurrentStepCard
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={totalSteps}
            isSpeaking={isSpeaking}
            onToggleSpeech={handleToggleSpeech}
          />
        )}
      </main>

      {/* Khối điều khiển dưới cùng cố định trong Viewport */}
      <footer className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 safe-bottom shadow-2xl">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-3">
          {/* NÚT CHÍNH: "Tôi đã đến mốc này" */}
          <button
            type="button"
            onClick={handleAdvanceStep}
            className="w-full min-h-[56px] h-14 sm:h-16 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-transform active:scale-[0.99]"
          >
            <CheckCircle className="w-6 h-6 stroke-[3]" />
            <span>Tôi đã đến mốc này</span>
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Hàng nút phụ trợ năng & xử lý sự cố */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className="min-h-[44px] py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors text-center"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Dừng đọc</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>Đọc lại</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="min-h-[44px] py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors text-center"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Quét QR mốc</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRelocateOpen(true)}
              className="min-h-[44px] py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-sm font-bold border border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors text-center"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Đi nhầm đường?</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Các Sheet phụ trợ */}
      <RelocateSheet
        isOpen={isRelocateOpen}
        onClose={() => setIsRelocateOpen(false)}
        onSelectNewStartNode={onRecalculateRoute}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenOfficialMap={onOpenOfficialMap}
      />

      <QRCheckpointScanner
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onConfirmCheckpoint={handleConfirmQrCheckpoint}
      />
    </div>
  );
};

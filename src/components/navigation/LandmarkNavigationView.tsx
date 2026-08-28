import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  HelpCircle,
  ListOrdered,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  DoorOpen,
  Building2,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import type { 
  NavigationSession, 
  CalculatedRoute, 
  Destination, 
  StartLocation, 
  RouteNode 
} from '../../types';
import { HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES } from '../../data/hospital108/navigation';
import { OrientationCard } from './OrientationCard';
import { LandmarkPhotoCard } from './LandmarkPhotoCard';
import { LocalRouteStrip } from './LocalRouteStrip';
import { RouteOverviewSheet } from './RouteOverviewSheet';
import { LandmarkHelpSheet } from './LandmarkHelpSheet';
import { QRCheckpointScanner } from './QRCheckpointScanner';

export interface LandmarkNavigationViewProps {
  session: NavigationSession;
  route: CalculatedRoute;
  destination: Destination;
  startLocation: StartLocation;
  onArrive: () => void;
  onExit: () => void;
  onRecalculateRoute: (newNode: RouteNode) => void;
  onOpenOfficialMap: () => void;
}

export const LandmarkNavigationView: React.FC<LandmarkNavigationViewProps> = ({
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
  const [isAutoSpeechEnabled, setIsAutoSpeechEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mednav_108_auto_speech') === 'true';
    } catch {
      return false;
    }
  });

  // Trạng thái xác nhận hướng ban đầu
  const [isOrientationConfirmed, setIsOrientationConfirmed] = useState<boolean>(
    (session.currentStepIndex || 0) > 0
  );

  // Sheets phụ trợ
  const [isHelpSheetOpen, setIsHelpSheetOpen] = useState<boolean>(false);
  const [isOverviewSheetOpen, setIsOverviewSheetOpen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);

  const steps = route.steps;
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Map nodes
  const nodeMap = useMemo(() => {
    return new globalThis.Map<string, RouteNode>(
      HOSPITAL_108_ROUTE_NODES.map(n => [n.id, n])
    );
  }, []);

  const pathNodes = useMemo(() => {
    return route.pathNodeIds
      .map(id => nodeMap.get(id))
      .filter((n): n is RouteNode => Boolean(n));
  }, [route.pathNodeIds, nodeMap]);

  const fromNode = currentStep ? nodeMap.get(currentStep.fromNodeId) : pathNodes[0];
  const targetNode = currentStep ? nodeMap.get(currentStep.toNodeId) : pathNodes[1] || pathNodes[0];
  const previousNode = currentStepIndex > 0 ? pathNodes[currentStepIndex - 1] : null;
  const nextNode = currentStepIndex < totalSteps - 1 ? pathNodes[currentStepIndex + 1] : null;

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
      // Bỏ qua lỗi quota
    }
  }, [session, currentStepIndex]);

  // Trợ lý đọc tiếng Việt thân thiện
  const speakInstruction = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.90; // Tốc độ vừa phải cho người cao tuổi

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const getFriendlySpeechText = useCallback(() => {
    if (!targetNode && !currentStep) return '';
    const targetName = targetNode?.shortName || targetNode?.name || currentStep?.landmark;
    const action = currentStep?.instruction || 'tiến về phía trước';
    const confirmText = targetNode?.confirmationLabel || `Đã tới ${targetName}`;
    return `Mốc tiếp theo là ${targetName}. Bác ${action}. Khi nhìn thấy ${targetName}, bấm ${confirmText}.`;
  }, [targetNode, currentStep]);

  // Đọc tự động khi đổi bước NẾU người dùng đã bật chế độ tự động
  useEffect(() => {
    if (isAutoSpeechEnabled && currentStep && isOrientationConfirmed) {
      const speech = getFriendlySpeechText();
      speakInstruction(speech);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, currentStep, isAutoSpeechEnabled, isOrientationConfirmed, getFriendlySpeechText, speakInstruction]);

  // Bật/tắt chế độ tự động đọc
  const handleToggleAutoSpeech = () => {
    const nextVal = !isAutoSpeechEnabled;
    setIsAutoSpeechEnabled(nextVal);
    try {
      localStorage.setItem('mednav_108_auto_speech', String(nextVal));
    } catch {
      // Bỏ qua
    }
    if (nextVal && !isSpeaking) {
      speakInstruction(getFriendlySpeechText());
    } else if (!nextVal && isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Nghe lại ngay lập tức
  const handlePlayVoice = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakInstruction(getFriendlySpeechText());
    }
  };

  // Xác nhận hướng đứng ban đầu
  const handleConfirmOrientation = () => {
    setIsOrientationConfirmed(true);
    if (isAutoSpeechEnabled) {
      speakInstruction(getFriendlySpeechText());
    }
  };

  // Bấm nút chính "Đã tới [Mốc]"
  const handleAdvanceStep = () => {
    if (!isOrientationConfirmed) {
      handleConfirmOrientation();
      return;
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      // Giữ orientation đã xác nhận
    } else {
      // Đã hoàn thành mốc cuối cùng -> Đến nơi
      onArrive();
    }
  };

  // Tính lại đường
  const handleRecalculate = (newNode: RouteNode) => {
    setIsOrientationConfirmed(false); // Yêu cầu định hướng lại
    onRecalculateRoute(newNode);
  };

  // Quét QR
  const handleConfirmQrCheckpoint = (detectedNode: RouteNode) => {
    const matchingStepIdx = steps.findIndex(s => s.toNodeId === detectedNode.id);
    if (matchingStepIdx !== -1) {
      if (matchingStepIdx < totalSteps - 1) {
        setCurrentStepIndex(matchingStepIdx + 1);
        setIsOrientationConfirmed(true);
      } else {
        onArrive();
      }
    } else {
      handleRecalculate(detectedNode);
    }
  };

  // Biểu tượng hành động
  const getActionIcon = () => {
    if (!currentStep) return <ArrowUp className="w-8 h-8 text-teal-800 stroke-[3]" />;
    switch (currentStep.actionType) {
      case 'turn_left':
        return <ArrowUpLeft className="w-8 h-8 sm:w-10 sm:h-10 text-teal-800 stroke-[3]" />;
      case 'turn_right':
        return <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-teal-800 stroke-[3]" />;
      case 'enter_building':
        return <DoorOpen className="w-8 h-8 sm:w-10 sm:h-10 text-teal-800 stroke-[2.5]" />;
      case 'take_elevator':
        return <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-teal-800 stroke-[2.5]" />;
      case 'arrive':
        return <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-800 stroke-[2.5]" />;
      case 'go_straight':
      default:
        return <ArrowUp className="w-8 h-8 sm:w-10 sm:h-10 text-teal-800 stroke-[3]" />;
    }
  };

  // Nhãn nút chính cụ thể theo mốc
  const targetLandmarkName = targetNode?.shortName || targetNode?.name || currentStep?.landmark || 'mốc này';
  const primaryButtonLabel = targetNode?.confirmationLabel || `Đã tới ${targetLandmarkName}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* 1. Header tối giản */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-xs flex items-center justify-between">
        {/* Nút thoát */}
        <button
          type="button"
          data-testid="exit-nav-btn"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        {/* Tiêu đề mốc tối giản: "Mốc 2/5" */}
        <div className="text-center px-2 flex-1 min-w-0">
          <div className="text-base sm:text-lg font-black text-slate-900">
            Mốc {currentStepIndex + 1}/{totalSteps}
          </div>
          <div className="text-xs text-slate-700 truncate font-semibold">
            Tới: {destination.name}
          </div>
        </div>

        {/* Nút gọi hỗ trợ */}
        <a
          href="tel:02462784108"
          data-testid="emergency-btn"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-sm font-bold border border-rose-200 transition-colors min-h-[44px]"
          title="Gọi tổng đài hỗ trợ 108"
        >
          <PhoneCall className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">Cấp cứu</span>
        </a>
      </header>

      {/* Banner nhãn thử nghiệm trung thực */}
      <div className="bg-amber-100/80 border-b border-amber-200 px-4 py-1.5 text-center text-xs font-semibold text-amber-900">
        Tuyến thử nghiệm – chưa dùng để chỉ đường thực tế
      </div>

      {/* Thân giao diện điều hướng Landmark-First */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 flex flex-col gap-4">
        {/* B. Câu lệnh chính (Mũi tên lớn + câu ngắn tối đa 2 dòng >= 22px bold) */}
        <div
          data-testid="main-command-card"
          className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center shrink-0 shadow-xs">
            {getActionIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-0.5">
              Hành động hiện tại:
            </div>
            <h2 className="text-[22px] sm:text-2xl font-black text-slate-900 leading-snug line-clamp-2">
              {currentStep?.instruction || 'Đi theo hướng dẫn phía trước'}
            </h2>
          </div>
        </div>

        {/* C. Hướng đứng ban đầu (OrientationCard) */}
        {(!isOrientationConfirmed || currentStepIndex === 0) && (
          <OrientationCard
            startNode={fromNode}
            onConfirm={handleConfirmOrientation}
            isConfirmed={isOrientationConfirmed}
          />
        )}

        {/* D. Mốc nhận biết (LandmarkPhotoCard) */}
        <LandmarkPhotoCard
          landmarkNode={targetNode}
          stepLandmarkName={currentStep?.landmark || targetLandmarkName}
          stepVisualCue={targetNode?.visibleCue}
        />

        {/* E. Sơ đồ cục bộ đơn giản 3 mốc (LocalRouteStrip) */}
        {targetNode && (
          <LocalRouteStrip
            previousNode={previousNode}
            currentNode={targetNode}
            nextNode={nextNode}
            currentStepNumber={currentStepIndex + 1}
            totalSteps={totalSteps}
          />
        )}
      </main>

      {/* F. Khối điều khiển dưới cùng cố định trong Viewport */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 safe-bottom shadow-xl">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-2.5">
          {/* NÚT CHÍNH: "Đã tới [Tên mốc]" (Cao tối thiểu 60px) */}
          <button
            type="button"
            data-testid="advance-step-btn"
            onClick={handleAdvanceStep}
            className="w-full min-h-[60px] bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 shadow-md shadow-amber-950/10 transition-transform active:scale-[0.99]"
          >
            <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            <span className="truncate">{primaryButtonLabel}</span>
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Hàng nút phụ hành động */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Không thấy mốc */}
            <button
              type="button"
              data-testid="help-landmark-btn"
              onClick={() => setIsHelpSheetOpen(true)}
              className="min-h-[48px] py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Không thấy mốc</span>
            </button>

            {/* 2. Nghe lại */}
            <button
              type="button"
              data-testid="listen-again-btn"
              onClick={handlePlayVoice}
              className="min-h-[48px] py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600" />
                  <span>Dừng đọc</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-700" />
                  <span>Nghe lại</span>
                </>
              )}
            </button>

            {/* 3. Xem toàn tuyến */}
            <button
              type="button"
              data-testid="view-full-route-btn"
              onClick={() => setIsOverviewSheetOpen(true)}
              className="min-h-[48px] py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <ListOrdered className="w-4 h-4 text-slate-700" />
              <span>Toàn tuyến</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Sheets hỗ trợ & Đối chiếu */}
      <LandmarkHelpSheet
        isOpen={isHelpSheetOpen}
        onClose={() => setIsHelpSheetOpen(false)}
        targetNode={targetNode}
        onSpeakInstruction={handlePlayVoice}
        onSelectRelocateNode={handleRecalculate}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenOfficialMap={onOpenOfficialMap}
      />

      <RouteOverviewSheet
        isOpen={isOverviewSheetOpen}
        onClose={() => setIsOverviewSheetOpen(false)}
        nodes={HOSPITAL_108_ROUTE_NODES}
        edges={HOSPITAL_108_ROUTE_EDGES}
        pathNodeIds={route.pathNodeIds}
        currentStepIndex={currentStepIndex}
        steps={steps}
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

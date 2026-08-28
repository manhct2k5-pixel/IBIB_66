import React, { useState, useEffect } from 'react';
import { Official108MapLink, Hospital108Destination } from '../types';
import { 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  HelpCircle, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface Official108MapProps {
  mapLink: Official108MapLink;
  destination?: Hospital108Destination | null;
  onClose: () => void;
  onChangeDestination: () => void;
  onOpenHelp: () => void;
  onOpenEmergency: () => void;
}

export function Official108Map({ 
  mapLink, 
  destination,
  onClose,
  onChangeDestination,
  onOpenHelp,
  onOpenEmergency
}: Official108MapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setHasError(true);
      }, 10000); // 10s fallback
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Bác đang xem bản đồ ${mapLink.label}. Để chỉ đường, bác hãy bấm nút Chỉ đường trên bản đồ chính thức, sau đó chọn điểm xuất phát và nơi muốn đến. Bác có thể chọn tầng bằng nút chọn tầng trên bản đồ.`;

    setIsSpeaking(true);
    speakText(
      textToRead,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không có kết nối Internet</h2>
        <p className="text-slate-600 text-lg mb-6 max-w-sm">
          Bản đồ Bệnh viện 108 cần kết nối Internet. Vui lòng kiểm tra mạng và thử lại.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="h-14 px-8 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-6 h-6" />
          Thử lại
        </button>
        <button 
          onClick={onClose}
          className="mt-4 h-14 px-8 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-[100dvh] overflow-hidden">
      {/* Top Header nhỏ, cố định */}
      <header className="h-16 flex-none bg-emerald-800 text-white border-b border-emerald-900 flex items-center px-3 justify-between sticky top-0 z-20 safe-top shadow-md">
        <button
          onClick={onClose}
          className="min-w-[48px] h-12 px-3 rounded-xl text-white hover:bg-white/10 active:bg-white/20 flex items-center justify-center gap-1 font-bold transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-base font-bold hidden sm:inline">Quay lại</span>
        </button>
        
        <div className="flex-1 px-2 text-center truncate">
          <h1 className="text-base sm:text-lg font-black text-white truncate">
            {destination ? destination.name : mapLink.label}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 truncate font-medium">
            {mapLink.label}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Nút Cấp cứu */}
          <button
            onClick={onOpenEmergency}
            className="h-11 px-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl flex items-center justify-center gap-1.5 font-bold transition-colors shadow-sm"
            aria-label="Cấp cứu khẩn cấp"
          >
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            <span className="text-sm font-bold hidden xs:inline">Cấp cứu</span>
          </button>

          {/* Mở toàn màn hình ngoài */}
          <a 
            href={mapLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center gap-1 font-bold transition-colors shadow-sm"
            title="Mở toàn màn hình"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-bold">Bản đồ gốc</span>
          </a>
        </div>
      </header>

      {/* Main Map Container */}
      <div className="flex-1 relative bg-slate-100 w-full overflow-hidden">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 pointer-events-none">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-700 font-bold text-lg">Đang tải bản đồ chính thức Bệnh viện 108...</p>
          </div>
        )}
        
        <iframe
          src={mapLink.url}
          title={mapLink.label}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
        
        {/* Fallback khi tải lâu (>10s) hoặc lỗi */}
        {hasError && (
          <div className="absolute top-4 left-4 right-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-lg z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
              <p className="text-amber-900 font-bold text-sm sm:text-base">
                Nếu vùng bản đồ bị trắng hoặc không thao tác được, hãy bấm nút &quot;Mở bản đồ gốc&quot;.
              </p>
            </div>
            <a
              href={mapLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở tab mới</span>
            </a>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Hướng dẫn & Điều khiển có thể thu gọn (<35% chiều cao) */}
      <div className={`flex-none bg-white border-t-2 border-slate-200 shadow-2xl transition-all duration-300 z-20 flex flex-col safe-bottom ${
        isSheetExpanded ? 'max-h-[38dvh] overflow-y-auto' : 'h-[125px]'
      }`}>
        {/* Thanh cầm kéo / Header Sheet */}
        <div 
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors select-none"
        >
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse shrink-0"></div>
            <span className="font-bold text-slate-800 text-base truncate">
              Đến: <span className="text-emerald-800 font-black">{destination?.name || mapLink.label}</span>
            </span>
          </div>

          <button 
            type="button"
            className="flex items-center gap-1 text-slate-600 font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm shrink-0"
          >
            <span>{isSheetExpanded ? 'Thu gọn' : 'Xem hướng dẫn'}</span>
            {isSheetExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Nội dung Sheet */}
        <div className="p-3 sm:p-4 space-y-3 flex-1">
          {/* Khi mở rộng: Hướng dẫn chi tiết */}
          {isSheetExpanded && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-slate-800 text-sm sm:text-base font-medium space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="font-black text-emerald-800">1.</span>
                <span>Chạm vào nút <strong>“Chỉ đường”</strong> trên bản đồ InMapz.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-emerald-800">2.</span>
                <span>Chọn điểm xuất phát và nơi muốn đến để bản đồ vẽ tuyến đường.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-emerald-800">3.</span>
                <span>Nếu cần đổi tầng, bác dùng nút chọn tầng ở góc bản đồ.</span>
              </div>
            </div>
          )}

          {/* Dải nút hành động chính */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Nút Nghe / Dừng đọc */}
            <button
              onClick={handleToggleSpeak}
              className={`h-12 sm:h-14 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 border transition-all ${
                isSpeaking 
                  ? 'bg-amber-100 border-amber-300 text-amber-900' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 text-amber-800 shrink-0" />
                  <span>Dừng đọc</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Nghe hướng dẫn</span>
                </>
              )}
            </button>

            {/* Nút Bản đồ gốc */}
            <a
              href={mapLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 sm:h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <ExternalLink className="w-5 h-5 text-slate-600 shrink-0" />
              <span>Bản đồ gốc</span>
            </a>

            {/* Nút Đổi nơi đến */}
            <button
              onClick={() => {
                stopSpeaking();
                onChangeDestination();
              }}
              className="h-12 sm:h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <RotateCcw className="w-5 h-5 text-slate-600 shrink-0" />
              <span>Đổi nơi đến</span>
            </button>

            {/* Nút Hướng dẫn */}
            <button
              onClick={onOpenHelp}
              className="h-12 sm:h-14 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 transition-colors border border-amber-200"
            >
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <span>Trợ giúp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

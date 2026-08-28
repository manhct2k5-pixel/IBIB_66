import React, { useState, useEffect } from 'react';
import { Official108MapLink, Hospital108Destination } from '../data/hospital108';
import { 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  HelpCircle, 
  RotateCcw,
  Navigation,
  Layers,
  Search,
  Footprints
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface Official108MapProps {
  mapLink: Official108MapLink;
  destination?: Hospital108Destination | null;
  onClose: () => void;
  onChangeDestination: () => void;
  onOpenHelp: () => void;
}

export function Official108Map({ 
  mapLink, 
  destination,
  onClose,
  onChangeDestination,
  onOpenHelp
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

    const textToRead = `Bác đang xem bản đồ ${mapLink.label}. Hãy chọn điểm bắt đầu và điểm muốn đến trực tiếp trên bản đồ chính thức. Bác có thể đổi tầng bằng nút chọn tầng trên bản đồ.`;

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
          className="h-14 px-8 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
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
      {/* Top Header */}
      <header className="h-16 flex-none bg-teal-800 text-white border-b border-teal-900 flex items-center px-3 justify-between sticky top-0 z-20 safe-top shadow-md">
        <button
          onClick={onClose}
          className="min-w-[48px] h-12 px-3 rounded-xl text-white hover:bg-white/10 active:bg-white/20 flex items-center justify-center gap-1.5 font-bold transition-colors"
          aria-label="Đóng bản đồ"
        >
          <X className="w-6 h-6" />
          <span className="text-base font-bold">Đóng</span>
        </button>
        
        <div className="flex-1 px-2 text-center truncate">
          <h1 className="text-lg sm:text-xl font-black text-white truncate">
            {destination ? destination.name : mapLink.label}
          </h1>
          <p className="text-sm sm:text-base text-teal-200 truncate font-medium">
            {mapLink.label}
          </p>
        </div>
        
        <a 
          href={mapLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-[48px] h-12 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center gap-1.5 font-bold transition-colors shadow-sm"
          title="Mở toàn màn hình"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-bold">Toàn màn hình</span>
        </a>
      </header>

      {/* Main Map Container */}
      <div className="flex-1 relative bg-slate-100 w-full overflow-hidden">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 pointer-events-none">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mb-4"></div>
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
        
        {/* Fallback khi tải lâu hoặc lỗi */}
        {hasError && (
          <div className="absolute top-4 left-4 right-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-lg z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
              <p className="text-amber-900 font-bold text-sm sm:text-base">
                Nếu vùng bản đồ bị trắng hoặc không thao tác được, hãy bấm nút "Mở bản đồ chính thức".
              </p>
            </div>
            <a
              href={mapLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở ngoài</span>
            </a>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Hướng dẫn & Điều khiển cho người bệnh */}
      <div className={`flex-none bg-white border-t-2 border-slate-200 shadow-2xl transition-all duration-300 z-20 flex flex-col safe-bottom ${
        isSheetExpanded ? 'max-h-[42dvh] overflow-y-auto' : 'h-[135px]'
      }`}>
        {/* Thanh cầm kéo / Header Sheet */}
        <div 
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-600 animate-pulse"></div>
            <span className="font-bold text-slate-800 text-base sm:text-lg truncate">
              Đang đến: <span className="text-teal-800 font-black">{destination?.name || mapLink.label}</span>
            </span>
          </div>

          <button 
            className="flex items-center gap-1 text-slate-600 font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <span>{isSheetExpanded ? 'Thu gọn' : 'Xem hướng dẫn'}</span>
            {isSheetExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Nội dung Sheet */}
        <div className="p-4 space-y-4 flex-1">
          {/* Trạng thái mở rộng: Chi tiết các bước thao tác */}
          {isSheetExpanded && (
            <div className="space-y-3 py-1">
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-slate-800 text-base font-medium space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="font-black text-teal-800">1.</span>
                  <span>Chạm vào ô tìm kiếm trên bản đồ InMapz hoặc bấm vào một phòng trên sơ đồ.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-black text-teal-800">2.</span>
                  <span>Chọn điểm bắt đầu và điểm muốn đến để xem đường đi.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-black text-teal-800">3.</span>
                  <span>Làm theo tuyến đường được bản đồ chỉ dẫn màu xanh.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-black text-teal-800">4.</span>
                  <span>Nếu cần xem tầng khác, dùng nút chọn tầng ngay trên bản đồ.</span>
                </div>
              </div>
            </div>
          )}

          {/* Dải nút hành động chính */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Nút Nghe / Dừng đọc */}
            <button
              onClick={handleToggleSpeak}
              className={`h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border transition-all ${
                isSpeaking 
                  ? 'bg-amber-100 border-amber-300 text-amber-900' 
                  : 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 text-amber-800" />
                  <span>Dừng đọc</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-teal-700" />
                  <span>Nghe hướng dẫn</span>
                </>
              )}
            </button>

            {/* Nút Mở bản đồ chính thức */}
            <a
              href={mapLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-base flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <ExternalLink className="w-5 h-5 text-slate-600" />
              <span>Bản đồ gốc</span>
            </a>

            {/* Nút Đổi điểm đến */}
            <button
              onClick={() => {
                stopSpeaking();
                onChangeDestination();
              }}
              className="h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-base flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <RotateCcw className="w-5 h-5 text-slate-600" />
              <span>Đổi nơi đến</span>
            </button>

            {/* Nút Trợ giúp */}
            <button
              onClick={onOpenHelp}
              className="h-14 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl font-bold text-base flex items-center justify-center gap-1.5 transition-colors border border-amber-200"
            >
              <HelpCircle className="w-5 h-5 text-amber-700" />
              <span>Tôi cần trợ giúp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

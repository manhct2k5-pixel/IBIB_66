import React, { useState, useEffect } from 'react';
import type { 
  Official108MapLink, 
  Hospital108Destination, 
  Hospital108StartLocation,
  RoutingMode,
  RouteLaunchResult
} from '../types';
import { 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw,
  ShieldAlert,
  Navigation,
  HelpCircle,
  X
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface Official108MapProps {
  mapLink: Official108MapLink;
  destination?: Hospital108Destination | null;
  startLocation?: Hospital108StartLocation | null;
  routingMode?: RoutingMode;
  routeLaunchResult?: RouteLaunchResult | null;
  onClose: () => void;
  onChangeStart?: () => void;
  onChangeDestination: () => void;
  onOpenHelp: () => void;
  onOpenEmergency: () => void;
}

export function Official108Map({ 
  mapLink, 
  destination,
  startLocation,
  routingMode = 'assisted_external_map',
  routeLaunchResult,
  onClose,
  onChangeStart,
  onChangeDestination,
  onOpenHelp,
  onOpenEmergency
}: Official108MapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [showIconHelper, setShowIconHelper] = useState(false);

  const effectiveMapUrl =
    routingMode === 'official_deep_link' &&
    routeLaunchResult?.routePreloaded === true
      ? routeLaunchResult.url
      : mapLink.url;
  const isDeepLinkReady = routingMode === 'official_deep_link' && routeLaunchResult?.routePreloaded;

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

    let textToRead = '';
    if (isDeepLinkReady) {
      textToRead = `Tuyến đường đã được mở trên bản đồ chính thức từ ${startLocation?.name || 'vị trí ban đầu'} đến ${destination?.name || 'điểm đến'}.`;
    } else {
      const fromText = startLocation ? `từ ${startLocation.name}` : '';
      const toText = destination ? `đến ${destination.name}` : mapLink.label;
      textToRead = `Hướng dẫn thao tác trên bản đồ InMapz: Bác đang muốn đi ${fromText} ${toText}. Bước 1: Mở bản đồ toàn màn hình. Bước 2: Tìm và bấm nút Chỉ đường. Bước 3: Chọn điểm bắt đầu là ${startLocation?.name || 'vị trí hiện tại'}. Bước 4: Chọn nơi muốn đến là ${destination?.name || mapLink.label}.`;
    }

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
          className="min-h-[48px] h-14 px-8 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-6 h-6" />
          Thử lại
        </button>
        <button 
          onClick={onClose}
          className="mt-4 min-h-[48px] h-14 px-8 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-[100dvh] overflow-hidden">
      {/* Top Header tối ưu cho mobile */}
      <header className="h-16 flex-none bg-teal-800 text-white border-b border-teal-900 flex items-center px-2 justify-between sticky top-0 z-20 safe-top shadow-md">
        {/* Bên trái: Nút quay lại 48x48 */}
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl text-white hover:bg-white/10 active:bg-white/20 flex items-center justify-center font-bold transition-colors shrink-0"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Chính giữa: Tên điểm đến 1 dòng, truncate */}
        <div className="flex-1 px-2 text-center min-w-0">
          <h1 className="text-base sm:text-lg font-black text-white truncate">
            {destination ? destination.name : mapLink.label}
          </h1>
          <p className="text-sm text-teal-200 truncate font-medium">
            {mapLink.label}
          </p>
        </div>
        
        {/* Bên phải: Nút cấp cứu 48x48 icon */}
        <button
          onClick={onOpenEmergency}
          className="w-12 h-12 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl flex items-center justify-center font-bold transition-colors shadow-sm shrink-0"
          aria-label="Cấp cứu khẩn cấp"
          title="Cấp cứu khẩn cấp"
        >
          <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
        </button>
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
          src={effectiveMapUrl}
          title={mapLink.label}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />

        {/* Thanh hướng dẫn nổi BƯỚC TIẾP THEO (chỉ hiện trong assisted_external_map) */}
        {!isBannerDismissed && routingMode === 'assisted_external_map' && (
          <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-sm border-2 border-teal-600 rounded-2xl p-3.5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-sm font-black rounded uppercase tracking-wider">
                BƯỚC TIẾP THEO
              </span>
              <button
                type="button"
                onClick={() => setIsBannerDismissed(true)}
                aria-label="Đóng thông báo"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-black text-slate-900 text-base mt-1.5 leading-snug">
              Bấm nút “Chỉ đường” trên bản đồ InMapz
            </p>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              Sau đó chọn điểm đầu ({startLocation?.name || 'Vị trí hiện tại'}) và nơi đến ({destination?.name || mapLink.label}).
            </p>
            <a
              href={effectiveMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 w-full min-h-[48px] h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Mở InMapz toàn màn hình để chỉ đường</span>
            </a>
          </div>
        )}
        
        {/* Fallback khi tải lâu (>10s) hoặc lỗi */}
        {hasError && (
          <div className="absolute top-4 left-4 right-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-lg z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
              <p className="text-amber-900 font-bold text-sm sm:text-base">
                Nếu vùng bản đồ bị trắng hoặc không thao tác được, bác hãy bấm nút &quot;Mở tab mới&quot;.
              </p>
            </div>
            <a
              href={effectiveMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] h-12 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở tab mới</span>
            </a>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Khi thu gọn (!isSheetExpanded) */}
      {!isSheetExpanded && (
        <div className="flex-none bg-white border-t-2 border-slate-200 shadow-2xl z-20 safe-bottom">
          {/* Header Sheet: Luôn hiển thị Từ & Đến */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5 overflow-hidden pr-2 min-w-0 flex-1">
              {startLocation && (
                <div className="text-sm font-semibold text-slate-600 truncate">
                  Từ: <span className="text-slate-900 font-bold">{startLocation.name}</span>
                </div>
              )}
              <div className="text-base font-bold text-slate-800 truncate">
                Đến: <span className="text-teal-800 font-black">{destination?.name || mapLink.label}</span>
              </div>
            </div>

            <button 
              type="button"
              aria-expanded={false}
              aria-controls="routing-sheet-content"
              onClick={() => setIsSheetExpanded(true)}
              className="min-h-[44px] h-11 flex items-center gap-1.5 text-slate-700 font-bold text-sm bg-white hover:bg-slate-100 active:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm shrink-0 transition-colors"
            >
              <span>Xem hướng dẫn</span>
              <ChevronUp className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Phần hành động khi thu gọn: Luôn có nút CTA >= 56px */}
          <div className="p-3">
            <a
              href={effectiveMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[56px] h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-colors shadow-md text-center"
            >
              <ExternalLink className="w-5 h-5 shrink-0" />
              <span>Mở InMapz để xem đường đi</span>
            </a>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Khi mở rộng (isSheetExpanded) */}
      {isSheetExpanded && (
        <div className="flex-none bg-white border-t-2 border-slate-200 shadow-2xl z-20 safe-bottom max-h-[65dvh] flex flex-col">
          {/* Header Sheet: Luôn hiển thị Từ & Đến */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-none">
            <div className="flex flex-col gap-0.5 overflow-hidden pr-2 min-w-0 flex-1">
              {startLocation && (
                <div className="text-sm font-semibold text-slate-600 truncate">
                  Từ: <span className="text-slate-900 font-bold">{startLocation.name}</span>
                </div>
              )}
              <div className="text-base font-bold text-slate-800 truncate">
                Đến: <span className="text-teal-800 font-black">{destination?.name || mapLink.label}</span>
              </div>
            </div>

            <button 
              type="button"
              aria-expanded={true}
              aria-controls="routing-sheet-content"
              onClick={() => setIsSheetExpanded(false)}
              className="min-h-[44px] h-11 flex items-center gap-1.5 text-slate-700 font-bold text-sm bg-white hover:bg-slate-100 active:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm shrink-0 transition-colors"
            >
              <span>Thu gọn</span>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Nội dung Sheet mở rộng id="routing-sheet-content" */}
          <div id="routing-sheet-content" className="p-3 sm:p-4 space-y-3 overflow-y-auto flex-1">
            {/* 5 bước xem tuyến trên InMapz */}
            <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-slate-800 text-sm sm:text-base font-medium space-y-2">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <Navigation className="w-5 h-5 text-teal-700 shrink-0" />
                <span>Các bước xem tuyến trên bản đồ InMapz:</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Mở bản đồ InMapz toàn màn hình.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Tìm và bấm biểu tượng <strong>“Chỉ đường”</strong> trên bản đồ.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Chọn điểm bắt đầu: <strong className="text-teal-950">{startLocation?.name || 'Vị trí hiện tại'}</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span>Chọn nơi muốn đến: <strong className="text-teal-950">{destination?.name || mapLink.label}</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">5</span>
                <span>Bấm tìm đường và đi theo tuyến do InMapz hiển thị.</span>
              </div>
            </div>

            {/* Nút trợ giúp khi không thấy nút Chỉ đường */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <button
                type="button"
                onClick={() => setShowIconHelper(v => !v)}
                className="w-full text-left font-bold text-sm text-teal-800 hover:text-teal-900 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Không tìm thấy nút Chỉ đường?</span>
                </span>
                <span className="text-sm font-semibold text-slate-500 underline">{showIconHelper ? 'Đóng' : 'Xem trợ giúp'}</span>
              </button>
              {showIconHelper && (
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  Hãy mở bản đồ trong tab mới/toàn màn hình. Một số điện thoại có thể ẩn bớt công cụ khi bản đồ nằm trong khung nhỏ.
                </p>
              )}
            </div>

            {/* Lưới các nút hành động */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* 1. Mở InMapz toàn màn hình */}
              <a
                href={effectiveMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm text-center"
              >
                <ExternalLink className="w-5 h-5 shrink-0" />
                <span>Mở InMapz toàn màn hình</span>
              </a>

              {/* 2. Nghe hướng dẫn */}
              <button
                type="button"
                onClick={handleToggleSpeak}
                className={`min-h-[48px] h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 border transition-all ${
                  isSpeaking 
                    ? 'bg-amber-100 border-amber-300 text-amber-900' 
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Dừng đọc</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-teal-700 shrink-0" />
                    <span>Nghe hướng dẫn</span>
                  </>
                )}
              </button>

              {/* 3. Xem hướng dẫn chi tiết */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  onOpenHelp();
                }}
                className="min-h-[48px] h-12 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-teal-200"
              >
                <HelpCircle className="w-5 h-5 text-teal-700 shrink-0" />
                <span>Xem hướng dẫn chi tiết</span>
              </button>

              {/* 4. Đổi điểm xuất phát (nếu có callback) */}
              {onChangeStart && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    onChangeStart();
                  }}
                  className="min-h-[48px] h-12 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-slate-200"
                >
                  <RotateCcw className="w-5 h-5 text-slate-600 shrink-0" />
                  <span>Đổi điểm xuất phát</span>
                </button>
              )}

              {/* 5. Đổi nơi đến (nếu có callback) */}
              {onChangeDestination && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    onChangeDestination();
                  }}
                  className="min-h-[48px] h-12 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-slate-200"
                >
                  <RotateCcw className="w-5 h-5 text-slate-600 shrink-0" />
                  <span>Đổi nơi đến</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

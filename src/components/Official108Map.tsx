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
  X,
  Info,
  MapPin,
  Clock,
  Building,
  Layers,
  Check
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';
import { HOSPITAL_108_START_LOCATIONS } from '../data/hospital108';
import { MapPrecisionBadge } from './MapPrecisionBadge';

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
  startLocation: initialStartLocation,
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
  const [showIconHelper, setShowIconHelper] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Vị trí xuất phát hỗ trợ (tùy chọn)
  const [selectedStart, setSelectedStart] = useState<Hospital108StartLocation | null>(initialStartLocation || null);
  const [isSelectingStart, setIsSelectingStart] = useState(false);
  const [isViewingDestInfo, setIsViewingDestInfo] = useState(false);

  const effectiveMapUrl =
    routingMode === 'official_deep_link' &&
    routeLaunchResult?.routePreloaded === true
      ? routeLaunchResult.url
      : mapLink.url;

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

  // Đặt lại trạng thái khi đổi URL hoặc reload
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const timer = setTimeout(() => {
      // Sau 10s nếu chưa load xong -> hiển thị fallback hỗ trợ
      setIsLoading(false);
      setHasError(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [effectiveMapUrl, reloadKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleReloadIframe = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey(k => k + 1);
  };

  // Đọc hướng dẫn ngắn gọn chuẩn chỉ
  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const destName = destination?.name || mapLink.label;
    let textToRead = '';
    if (selectedStart) {
      textToRead = `Bác đang ở ${selectedStart.name}. Trên bản đồ, hãy chọn vị trí này làm điểm bắt đầu và chọn ${destName} làm điểm đến.`;
    } else {
      textToRead = `Bác muốn đến ${destName}. Trên bản đồ, bác bấm Chỉ đường, chọn điểm bắt đầu, sau đó chọn ${destName}.`;
    }

    setIsSpeaking(true);
    speakText(
      textToRead,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Xử lý nút Back thông minh
  const handleSmartBack = () => {
    stopSpeaking();
    if (isSelectingStart) {
      setIsSelectingStart(false);
    } else if (isViewingDestInfo) {
      setIsViewingDestInfo(false);
    } else if (isSheetExpanded) {
      setIsSheetExpanded(false);
    } else {
      onClose();
    }
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
      {/* Top Header: Chiều cao 56-64px, tối ưu cho mobile */}
      <header className="h-14 sm:h-16 flex-none bg-teal-800 text-white border-b border-teal-900 flex items-center px-2 justify-between sticky top-0 z-20 safe-top shadow-md">
        {/* Nút quay lại: Vùng chạm >= 48x48px */}
        <button
          onClick={handleSmartBack}
          className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-xl text-white hover:bg-white/10 active:bg-white/20 flex items-center justify-center font-bold transition-colors shrink-0"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Tên điểm đến ở giữa */}
        <div className="flex-1 px-2 text-center min-w-0">
          <h1 className="text-base sm:text-lg font-black text-white truncate leading-tight">
            {destination ? destination.name : mapLink.label}
          </h1>
          <p className="text-sm text-teal-200 truncate font-medium mt-0.5">
            {destination?.building || mapLink.label}
          </p>
        </div>
        
        {/* Nút cấp cứu: Vùng chạm >= 48x48px */}
        <button
          onClick={onOpenEmergency}
          className="min-w-[48px] min-h-[48px] w-12 h-12 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl flex items-center justify-center font-bold transition-colors shadow-sm shrink-0"
          aria-label="Cấp cứu khẩn cấp"
          title="Cấp cứu khẩn cấp"
        >
          <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
        </button>
      </header>

      {/* Main Map Container: Không có lớp phủ chặn tương tác của iframe */}
      <div className="flex-1 relative bg-slate-100 w-full overflow-hidden">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 pointer-events-none">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-700 font-bold text-lg text-center px-4">
              Đang tải bản đồ chính thức Bệnh viện 108...
            </p>
          </div>
        )}
        
        <iframe
          key={reloadKey}
          src={effectiveMapUrl}
          title={`Bản đồ Bệnh viện 108 - ${destination?.name ?? mapLink.label}`}
          loading="eager"
          className="h-full w-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />

        {/* Fallback khi tải lỗi hoặc quá 10s */}
        {hasError && (
          <div className="absolute top-3 left-3 right-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-lg z-20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
              <p className="text-amber-950 font-bold text-sm sm:text-base">
                Bản đồ tải chậm hoặc trình duyệt đang hạn chế nhúng. Bác có thể thử tải lại ngay hoặc mở ở tab mới.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReloadIframe}
                className="flex-1 sm:flex-initial min-h-[48px] h-12 px-4 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Thử tải lại trong MedNav</span>
              </button>
              <a
                href={effectiveMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial min-h-[48px] h-12 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở tab mới</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Trạng thái Thu gọn (!isSheetExpanded) */}
      {!isSheetExpanded && (
        <div className="flex-none bg-white border-t-2 border-slate-200 shadow-2xl z-20 safe-bottom">
          <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 overflow-hidden min-w-0 flex-1">
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                Đến: <span className="text-teal-800">{destination?.name || mapLink.label}</span>
              </div>
              <div className="text-sm font-bold text-teal-900 flex items-center gap-1.5 truncate">
                <Navigation className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Bấm “Chỉ đường” ngay trên bản đồ</span>
              </div>
              {selectedStart && (
                <div className="text-sm font-semibold text-slate-600 truncate">
                  Điểm bắt đầu gợi ý: {selectedStart.name}
                </div>
              )}
            </div>

            <button 
              type="button"
              aria-expanded={false}
              aria-controls="routing-sheet-content"
              onClick={() => setIsSheetExpanded(true)}
              className="min-w-[48px] min-h-[48px] h-12 flex items-center gap-1.5 text-teal-900 font-black text-sm sm:text-base bg-teal-50 hover:bg-teal-100 active:bg-teal-200 px-4 py-2 rounded-xl border border-teal-200 shadow-sm shrink-0 transition-colors"
            >
              <span>Xem hỗ trợ</span>
              <ChevronUp className="w-5 h-5 text-teal-800" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Trạng thái Mở rộng (isSheetExpanded) */}
      {isSheetExpanded && (
        <div className="flex-none bg-white border-t-2 border-slate-200 shadow-2xl z-20 safe-bottom max-h-[65dvh] flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header Sheet Mở rộng */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-none">
            <div className="flex flex-col gap-0.5 overflow-hidden min-w-0 flex-1">
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                Đến: <span className="text-teal-800">{destination?.name || mapLink.label}</span>
              </div>
              {destination && (
                <div className="text-sm font-semibold text-slate-600 truncate">
                  {destination.building} {destination.floor ? `• ${destination.floor}` : ''}
                </div>
              )}
            </div>

            <button 
              type="button"
              aria-expanded={true}
              aria-controls="routing-sheet-content"
              onClick={() => setIsSheetExpanded(false)}
              className="min-w-[48px] min-h-[48px] h-12 flex items-center gap-1.5 text-slate-700 font-bold text-sm bg-white hover:bg-slate-100 active:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-300 shadow-sm shrink-0 transition-colors"
            >
              <span>Thu gọn</span>
              <ChevronDown className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Nội dung Sheet mở rộng */}
          <div id="routing-sheet-content" className="p-4 space-y-3.5 overflow-y-auto flex-1">
            {/* Hiển thị vị trí đã chọn nếu có */}
            {selectedStart && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-slate-800 space-y-1">
                <div className="text-sm sm:text-base font-bold text-blue-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Bác đang ở: <strong>{selectedStart.name}</strong></span>
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Khi mở Chỉ đường trên bản đồ, hãy chọn vị trí này làm điểm bắt đầu.
                </p>
                <p className="text-sm font-semibold text-amber-800 pt-0.5">
                  * Lưu ý: MedNav chưa thể tự điền vị trí này vào InMapz.
                </p>
              </div>
            )}

            {/* 3 bước ngắn gọn chỉ đường */}
            <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-slate-800 text-sm sm:text-base font-medium space-y-2.5">
              <div className="font-black text-teal-950 flex items-center gap-2 text-base">
                <Navigation className="w-5 h-5 text-teal-700 shrink-0" />
                <span>3 bước xem đường đi trên bản đồ:</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span className="text-slate-800 leading-snug">
                  Bấm nút <strong>“Chỉ đường”</strong> ngay trên bản đồ bên trên.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span className="text-slate-800 leading-snug">
                  Chọn điểm bắt đầu {selectedStart ? <>là <strong className="text-teal-900">{selectedStart.name}</strong></> : '(vị trí bác đang đứng)'}.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span className="text-slate-800 leading-snug">
                  Chọn nơi muốn đến là <strong className="text-teal-900">{destination?.name || mapLink.label}</strong> và xem tuyến.
                </span>
              </div>
            </div>

            {/* Trợ giúp không tìm thấy nút Chỉ đường */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <button
                type="button"
                onClick={() => setShowIconHelper(v => !v)}
                className="w-full text-left font-bold text-sm sm:text-base text-teal-800 hover:text-teal-900 flex items-center justify-between min-h-[44px]"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Tôi không thấy nút Chỉ đường?</span>
                </span>
                <span className="text-sm font-semibold text-slate-500 underline">
                  {showIconHelper ? 'Đóng' : 'Xem trợ giúp'}
                </span>
              </button>
              {showIconHelper && (
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  Biểu tượng Chỉ đường (hình mũi tên rẽ) nằm ở góc dưới hoặc thanh tìm kiếm của bản đồ InMapz. Nếu màn hình quá nhỏ không thấy, bác có thể bấm &quot;Mở bản đồ ở tab mới&quot; phía dưới.
                </p>
              )}
            </div>

            {/* Lưới các nút hành động */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* 1. Nút quan trọng nhất: Nghe hướng dẫn */}
              <button
                type="button"
                onClick={handleToggleSpeak}
                className={`min-h-[56px] h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 border transition-all shadow-sm ${
                  isSpeaking 
                    ? 'bg-amber-100 border-amber-300 text-amber-900' 
                    : 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white border-transparent'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>Dừng đọc hướng dẫn</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-teal-100 shrink-0" />
                    <span>Nghe hướng dẫn</span>
                  </>
                )}
              </button>

              {/* 2. Chọn vị trí hiện tại để được hỗ trợ (Tùy chọn) */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsSelectingStart(true);
                }}
                className="min-h-[48px] h-12 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-slate-300 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{selectedStart ? 'Đổi vị trí hiện tại' : 'Chọn vị trí hiện tại để được hỗ trợ'}</span>
              </button>

              {/* 3. Thông tin nơi đến */}
              {destination && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setIsViewingDestInfo(true);
                  }}
                  className="min-h-[48px] h-12 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-slate-300 shadow-sm"
                >
                  <Info className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Thông tin nơi đến</span>
                </button>
              )}

              {/* 4. Đổi nơi đến */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  onChangeDestination();
                }}
                className="min-h-[48px] h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <RotateCcw className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Đổi nơi đến</span>
              </button>

              {/* 5. Nút phụ: Mở bản đồ ở tab mới (dự phòng, không nổi bật) */}
              <div className="sm:col-span-2 pt-1">
                <a
                  href={effectiveMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200 text-center"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Mở bản đồ ở tab mới (Dự phòng)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-sheet / Modal Chọn vị trí hiện tại (Tùy chọn) */}
      {isSelectingStart && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsSelectingStart(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85dvh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200 z-10">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Bác đang đứng ở đâu?
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Chọn mốc để MedNav nhắc bác làm điểm bắt đầu trên InMapz.
                </p>
              </div>
              <button
                onClick={() => setIsSelectingStart(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-900">
                * Lưu ý: MedNav chưa thể tự điền vị trí này vào InMapz. Bác sẽ chọn vị trí này khi bấm “Chỉ đường” trên bản đồ.
              </div>

              {HOSPITAL_108_START_LOCATIONS.map(loc => {
                const isCurrent = selectedStart?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedStart(loc);
                      setIsSelectingStart(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isCurrent 
                        ? 'border-teal-700 bg-teal-50 text-teal-950' 
                        : 'border-slate-200 hover:border-teal-400 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{loc.name}</h4>
                      <p className="text-sm text-slate-600 mt-0.5">{loc.building}</p>
                    </div>
                    {isCurrent && (
                      <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-sheet / Modal Thông tin nơi đến (Tùy chọn) */}
      {isViewingDestInfo && destination && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsViewingDestInfo(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85dvh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200 z-10">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 truncate pr-2">
                Thông tin: {destination.name}
              </h3>
              <button
                onClick={() => setIsViewingDestInfo(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Tòa nhà</div>
                    <div className="text-base font-bold text-slate-900">{destination.building}</div>
                  </div>
                </div>

                {destination.floor && (
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-500 uppercase">Tầng</div>
                      <div className="text-base font-bold text-slate-900">{destination.floor}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Thời gian tiếp đón</div>
                    <div className="text-base font-bold text-slate-900">06:30 - 17:00 (Thứ 2 - Thứ 6)</div>
                  </div>
                </div>
              </div>

              {destination.description && (
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
                  <div className="text-sm font-bold text-teal-900 uppercase mb-1">Ghi chú hướng dẫn</div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {destination.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-slate-500">Mức độ xác minh bản đồ:</div>
                <MapPrecisionBadge precision={destination.mapPrecision} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Official108MapLink } from '../data/hospital108';
import { AlertTriangle, ExternalLink, RefreshCw, X } from 'lucide-react';

interface Official108MapProps {
  mapLink: Official108MapLink;
  onClose: () => void;
}

export function Official108Map({ mapLink, onClose }: Official108MapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Không có kết nối Internet</h2>
        <p className="text-slate-600 mb-6 max-w-sm">
          Bản đồ Bệnh viện 108 cần kết nối Internet. Vui lòng kiểm tra mạng và thử lại.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Thử lại
        </button>
        <button 
          onClick={onClose}
          className="mt-4 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-[100dvh]">
      {/* Header */}
      <header className="h-14 sm:h-16 flex-none bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-10 safe-top">
        <button
          onClick={onClose}
          className="h-10 px-3 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 font-medium transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Đóng</span>
        </button>
        
        <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate px-2 max-w-[50%]">
          {mapLink.label}
        </h1>
        
        <a 
          href={mapLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 font-bold transition-colors"
        >
          <span className="hidden sm:inline">Mở toàn màn hình</span>
          <span className="sm:hidden">Mở</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      {/* Map Content */}
      <div className="flex-1 relative bg-slate-100 w-full">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 pointer-events-none">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải bản đồ chính thức...</p>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6 text-center z-10">
            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Không thể hiển thị bản đồ trực tiếp trong MedNav</h2>
            <p className="text-slate-600 mb-6 max-w-sm">
              Bấm nút bên dưới để mở bản đồ chính thức của Bệnh viện 108 trong tab mới.
            </p>
            <a 
              href={mapLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Mở bản đồ 108 toàn màn hình
            </a>
          </div>
        ) : (
          <iframe
            src={mapLink.url}
            title={mapLink.label}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="geolocation"
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="py-3 flex-none bg-slate-800 text-slate-300 text-xs flex items-center justify-center px-4 text-center safe-bottom">
        Dữ liệu bản đồ được cung cấp qua bản đồ chỉ dẫn chính thức của Bệnh viện Trung ương Quân đội 108.
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  CameraOff,
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  BACH_MAI_QR_CHECKPOINTS, 
  findQRCheckpointByCode, 
  VerifiedQRCheckpoint 
} from '../data/bachMai/checkpoints';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';

interface QRLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCheckpointNode: (node: MapNode, checkpoint: VerifiedQRCheckpoint) => void;
  language?: 'vi' | 'en';
}

export const QRLocationModal: React.FC<QRLocationModalProps> = ({
  isOpen,
  onClose,
  onConfirmCheckpointNode,
  language = 'vi'
}) => {
  const [inputCode, setInputCode] = useState('');
  const [matchedCheckpoint, setMatchedCheckpoint] = useState<VerifiedQRCheckpoint | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera only when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setInputCode('');
      setMatchedCheckpoint(null);
      setErrorMessage('');
      setSuccessMessage('');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('Thiết bị chưa hỗ trợ truy cập trực tiếp máy ảnh.');
        setCameraActive(false);
      }
    } catch (err: any) {
      setCameraError('Chưa cấp quyền máy ảnh hoặc máy ảnh đang bận.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }
    } catch (e) {
      // Ignore haptic errors on unsupported platforms
    }
  };

  const handleLookup = (codeToSearch: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    const found = findQRCheckpointByCode(codeToSearch);
    if (found) {
      triggerHaptic();
      setMatchedCheckpoint(found);
      const node = MAP_NODES_DATA.find(n => n.id === found.nodeId);
      if (node) {
        setSuccessMessage(`Đã nhận diện: ${found.title} (${found.landmarkNear})`);
      }
    } else {
      setMatchedCheckpoint(null);
      setErrorMessage('Chưa tìm thấy mã vị trí phù hợp. Bác vui lòng thử lại hoặc chọn từ danh sách.');
    }
  };

  const handleApplyCheckpoint = (cp: VerifiedQRCheckpoint) => {
    const node = MAP_NODES_DATA.find(n => n.id === cp.nodeId);
    if (node) {
      triggerHaptic();
      onConfirmCheckpointNode(node, cp);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="qr-location-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="qr-location-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92svh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-tight leading-snug truncate">
                Quét mã vị trí MedNav
              </h2>
              <p className="text-xs text-slate-300 font-medium truncate">
                Xác định điểm đứng tại Bệnh viện Bạch Mai
              </p>
            </div>
          </div>

          <button
            id="btn-close-qr-modal"
            onClick={onClose}
            className="w-10 h-10 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Đóng bảng mã vị trí"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Camera Viewfinder Area */}
          <div className="w-full aspect-4/3 max-h-56 bg-slate-950 rounded-2xl relative overflow-hidden border-2 border-slate-300 shadow-inner flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4 space-y-2 text-slate-400">
                <CameraOff className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-xs sm:text-sm font-medium">
                  {cameraError || 'Máy ảnh chưa kích hoạt'}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-lg border border-slate-700 transition cursor-pointer"
                >
                  Thử bật lại máy ảnh
                </button>
              </div>
            )}

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
              <div className="w-36 h-36 border-2 border-dashed border-cyan-400/80 rounded-2xl relative flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              </div>
              <div className="mt-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-white text-xs font-bold text-center">
                Hướng máy ảnh vào mã QR trên biển
              </div>
            </div>
          </div>

          {/* Quick Input Form */}
          <div className="space-y-2">
            <label htmlFor="input-qr-code" className="text-sm sm:text-base font-black text-slate-900 block">
              Hoặc gõ mã dưới biển (ví dụ: CP-K1, Cổng 4, A9, VTM):
            </label>
            <div className="flex gap-2">
              <input
                id="input-qr-code"
                type="search"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(inputCode);
                }}
                placeholder="Ví dụ: CP-K1, K1, A9, Cổng 4..."
                className="flex-1 h-14 px-4 bg-slate-50 border-2 border-slate-300 focus:border-cyan-700 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
              />
              <button
                id="btn-lookup-qr-code"
                onClick={() => handleLookup(inputCode)}
                className="h-14 px-5 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white font-bold text-base rounded-2xl transition cursor-pointer shrink-0"
              >
                Xác nhận
              </button>
            </div>
          </div>

          {/* Matched Success Card */}
          {matchedCheckpoint && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-base sm:text-lg font-black text-emerald-950">
                    {matchedCheckpoint.title}
                  </div>
                  <p className="text-sm text-emerald-800 font-semibold mt-0.5">
                    Gần: {matchedCheckpoint.landmarkNear} (Mã: {matchedCheckpoint.code})
                  </p>
                </div>
              </div>

              <button
                id="btn-confirm-matched-qr"
                onClick={() => handleApplyCheckpoint(matchedCheckpoint)}
                className="w-full h-13 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-base rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <span>Xác nhận vị trí xuất phát</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-sm font-bold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Select Common Location Codes */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-sm font-bold text-slate-700">
              Điểm xuất phát phổ biến:
            </div>

            <div className="space-y-2">
              {BACH_MAI_QR_CHECKPOINTS.slice(0, 4).map((cp) => (
                <button
                  key={cp.code}
                  onClick={() => handleApplyCheckpoint(cp)}
                  className="w-full p-3 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-500 rounded-xl flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-base font-bold text-slate-900 truncate">
                      {cp.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {cp.landmarkNear} • Mã {cp.code}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-cyan-700 shrink-0 ml-2">Chọn</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full h-12 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-base rounded-xl transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export const QRCheckpointModal = QRLocationModal;


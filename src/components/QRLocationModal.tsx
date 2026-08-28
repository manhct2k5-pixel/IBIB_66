import React, { useState } from 'react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Building2,
  ArrowRight,
  Search
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

  if (!isOpen) return null;

  const handleLookup = (codeToSearch: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    const found = findQRCheckpointByCode(codeToSearch);
    if (found) {
      setMatchedCheckpoint(found);
      const node = MAP_NODES_DATA.find(n => n.id === found.nodeId);
      if (node) {
        setSuccessMessage(`Bạn đang ở ${found.title}, gần ${found.landmarkNear}.`);
      }
    } else {
      setMatchedCheckpoint(null);
      setErrorMessage('Chưa tìm thấy mã vị trí phù hợp. Bác vui lòng thử lại hoặc chọn từ danh sách.');
    }
  };

  const handleApplyCheckpoint = (cp: VerifiedQRCheckpoint) => {
    const node = MAP_NODES_DATA.find(n => n.id === cp.nodeId);
    if (node) {
      onConfirmCheckpointNode(node, cp);
      onClose();
    }
  };

  return (
    <div 
      id="qr-location-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="qr-location-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-snug">
                Quét hoặc nhập mã vị trí
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Xác nhận vị trí đứng thực tế tại Bệnh viện Bạch Mai
              </p>
            </div>
          </div>

          <button
            id="btn-close-qr-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng bảng mã vị trí"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Instructions */}
          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl text-sm sm:text-base text-cyan-950 font-medium leading-relaxed">
            Nhìn vào bảng tên hoặc biển dán MedNav gần bạn (Ví dụ: <strong>CP-GATE4</strong>, <strong>CP-K1</strong>, <strong>CP-A9</strong> hoặc gõ <strong>k1</strong>, <strong>cổng 4</strong>):
          </div>

          {/* Quick Input Form */}
          <div className="space-y-2">
            <label htmlFor="input-qr-code" className="text-base font-bold text-slate-800">
              Nhập mã vị trí hoặc tên cổng / tòa:
            </label>
            <div className="flex gap-2">
              <input
                id="input-qr-code"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(inputCode);
                }}
                placeholder="Ví dụ: CP-K1, cổng 4, a9, vtm..."
                className="flex-1 h-14 px-4 bg-slate-50 border-2 border-slate-300 focus:border-cyan-700 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
              />
              <button
                id="btn-lookup-qr-code"
                onClick={() => handleLookup(inputCode)}
                className="h-14 px-5 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white font-bold text-base rounded-2xl transition cursor-pointer shrink-0"
              >
                Kiểm tra
              </button>
            </div>
          </div>

          {/* Result / Success / Error Message */}
          {successMessage && matchedCheckpoint && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base sm:text-lg font-black text-emerald-950">
                    {successMessage}
                  </h4>
                  <p className="text-sm text-emerald-800 font-medium mt-0.5">
                    Mã xác nhận: {matchedCheckpoint.code}
                  </p>
                </div>
              </div>

              <button
                id="btn-confirm-matched-qr"
                onClick={() => handleApplyCheckpoint(matchedCheckpoint)}
                className="w-full h-13 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Xác nhận xuất phát từ đây</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-sm font-semibold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Select Common Location Codes */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-sm font-bold text-slate-700">
              Hoặc chọn nhanh mã vị trí phổ biến:
            </div>

            <div className="space-y-2">
              {BACH_MAI_QR_CHECKPOINTS.slice(0, 5).map((cp) => (
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
                      {cp.landmarkNear} ({cp.code})
                    </div>
                  </div>
                  <span className="text-sm font-bold text-cyan-700">Chọn</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
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

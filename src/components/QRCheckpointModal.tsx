import React, { useState } from 'react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  BACH_MAI_QR_CHECKPOINTS, 
  findQRCheckpointByCode, 
  VerifiedQRCheckpoint 
} from '../data/bachMai/checkpoints';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';

interface QRCheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCheckpointNode: (node: MapNode, checkpoint: VerifiedQRCheckpoint) => void;
  language?: 'vi' | 'en';
}

export const QRCheckpointModal: React.FC<QRCheckpointModalProps> = ({
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
      setErrorMessage('Không tìm thấy mã QR checkpoint phù hợp. Vui lòng thử lại hoặc chọn điểm từ danh sách.');
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
      id="qr-checkpoint-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="qr-checkpoint-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'vi' ? 'Quét mã QR Checkpoint' : 'Scan QR Checkpoint'}
              </h2>
              <p className="text-xs text-slate-300">
                Xác nhận vị trí đứng thực tế tại Bệnh viện Bạch Mai
              </p>
            </div>
          </div>

          <button
            id="btn-close-qr-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Notice */}
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-cyan-900 leading-relaxed">
            <strong>Cơ chế xác nhận:</strong> Khi quét mã QR MedNav gắn tại các cổng hoặc sảnh tòa nhà, hệ thống sẽ xác nhận ngay vị trí hiện tại và tự động tính lại tuyến đường tối ưu đến điểm bạn cần đến.
          </div>

          {/* Manual Input / Scan Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Nhập mã Checkpoint hoặc tên điểm (Demo):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-qr-checkpoint-code"
                  type="text"
                  placeholder="Ví dụ: CP-K1, CP-A9, Cổng 1, K2, Q..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLookup(inputCode);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                />
              </div>
              <button
                id="btn-submit-qr-lookup"
                onClick={() => handleLookup(inputCode)}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>

          {/* Result Alert */}
          {matchedCheckpoint && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-900">
                    Đã tìm thấy Checkpoint hợp lệ:
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {matchedCheckpoint.title}
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{matchedCheckpoint.landmarkNear}</span>
                  </p>
                </div>
              </div>

              <button
                id="btn-apply-matched-checkpoint"
                onClick={() => handleApplyCheckpoint(matchedCheckpoint)}
                className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>Xác nhận đang đứng tại đây & Cập nhật tuyến</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Checkpoints List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Hoặc chọn nhanh mã QR mẫu đã xác minh:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BACH_MAI_QR_CHECKPOINTS.slice(0, 8).map((cp) => (
                <button
                  key={cp.code}
                  onClick={() => {
                    setInputCode(cp.code);
                    handleApplyCheckpoint(cp);
                  }}
                  className="p-2.5 text-left bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-xl transition cursor-pointer text-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black font-mono text-cyan-800 px-1.5 py-0.5 bg-cyan-100 rounded">
                      {cp.code}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {cp.title.replace('Mã QR ', '')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>MedNav QR Checkpoint • Bệnh viện Bạch Mai</span>
          <button 
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { QrCode, X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import type { RouteNode } from '../../types';
import { 
  QR_CHECKPOINT_FEATURE_ENABLED, 
  lookupCheckpointByQr, 
  HOSPITAL_108_CHECKPOINTS 
} from '../../data/hospital108/navigation';

interface QRCheckpointScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCheckpoint: (node: RouteNode) => void;
}

export const QRCheckpointScanner: React.FC<QRCheckpointScannerProps> = ({
  isOpen,
  onClose,
  onConfirmCheckpoint
}) => {
  const [manualCode, setManualCode] = useState<string>('');
  const [detectedNode, setDetectedNode] = useState<RouteNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!QR_CHECKPOINT_FEATURE_ENABLED) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Tính năng đang thử nghiệm</h3>
          <p className="text-slate-600 mb-6">
            Hệ thống QR Checkpoint thực địa đang trong quá trình khảo sát và dán mã tại các cột mốc Bệnh viện 108.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 bg-slate-800 text-white rounded-xl font-bold"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const handleLookup = (code: string) => {
    setErrorMessage(null);
    const node = lookupCheckpointByQr(code);
    if (node) {
      setDetectedNode(node);
    } else {
      setDetectedNode(null);
      setErrorMessage('Mã QR không hợp lệ hoặc chưa thuộc dữ liệu cột mốc đã xác minh.');
    }
  };

  const handleSelectSample = (sampleNode: RouteNode) => {
    if (sampleNode.qrCode) {
      setManualCode(sampleNode.qrCode);
      handleLookup(sampleNode.qrCode);
    }
  };

  const handleConfirm = () => {
    if (detectedNode) {
      onConfirmCheckpoint(detectedNode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-teal-400" />
            <h3 className="text-lg sm:text-xl font-black">Quét mã QR tại cột mốc</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
          {/* Giả lập khung quét Camera */}
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-dashed border-teal-500/60 overflow-hidden">
            <div className="w-32 h-32 border-2 border-teal-400 rounded-xl relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 rounded-tl-sm" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 rounded-br-sm" />
              <QrCode className="w-12 h-12 text-slate-700 animate-pulse" />
            </div>
            <p className="text-sm text-teal-200 mt-2 font-medium">Hướng camera vào mã QR dán trên cột mốc</p>
          </div>

          {/* Nhập mã thủ công / Chọn mốc thử nghiệm */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Hoặc nhập / chọn mã mốc khảo sát:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="MEDNAV108:checkpoint:node_gate_01"
                className="flex-1 h-11 px-3 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={() => handleLookup(manualCode)}
                className="px-4 h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm"
              >
                Kiểm tra
              </button>
            </div>
          </div>

          {/* Danh sách các mã có sẵn để test nhanh */}
          <div className="flex flex-wrap gap-1.5">
            {HOSPITAL_108_CHECKPOINTS.map(cp => (
              <button
                key={cp.id}
                type="button"
                onClick={() => handleSelectSample(cp)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 text-sm font-bold border border-slate-200 transition-colors"
              >
                {cp.shortName}
              </button>
            ))}
          </div>

          {/* Kết quả nhận diện */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {detectedNode && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span>Đã xác định cột mốc:</span>
              </div>
              <div className="font-extrabold text-lg text-slate-900">{detectedNode.name}</div>
              <div className="text-sm text-slate-600">{detectedNode.landmarkDescription}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 safe-bottom">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] h-12 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm sm:text-base transition-colors"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!detectedNode}
            onClick={handleConfirm}
            className={`flex-1 min-h-[48px] h-12 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-colors ${
              detectedNode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Xác nhận vị trí</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

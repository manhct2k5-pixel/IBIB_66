import React, { useState } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  QrCode, 
  RotateCcw, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import type { RouteNode } from '../../types';
import { HOSPITAL_108_ROUTE_NODES } from '../../data/hospital108/navigation';
import { removeVietnameseTones } from '../../utils/stringUtils';

interface RelocateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNewStartNode: (newNode: RouteNode) => void;
  onOpenQrScanner: () => void;
  onOpenOfficialMap: () => void;
}

export const RelocateSheet: React.FC<RelocateSheetProps> = ({
  isOpen,
  onClose,
  onSelectNewStartNode,
  onOpenQrScanner,
  onOpenOfficialMap
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<RouteNode | null>(null);

  if (!isOpen) return null;

  const verifiedNodes = HOSPITAL_108_ROUTE_NODES.filter(
    n => n.verificationStatus === 'field_verified'
  );

  const filteredNodes = verifiedNodes.filter(node => {
    if (!searchTerm.trim()) return true;
    const cleanSearch = removeVietnameseTones(searchTerm.toLowerCase());
    const cleanName = removeVietnameseTones(node.name.toLowerCase());
    const cleanLandmark = removeVietnameseTones(node.landmarkDescription.toLowerCase());
    return cleanName.includes(cleanSearch) || cleanLandmark.includes(cleanSearch);
  });

  const handleConfirmRecalculate = () => {
    if (selectedNode) {
      onSelectNewStartNode(selectedNode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Định vị lại vị trí hiện tại
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung chính */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Nếu bác đi nhầm hoặc không thấy cột mốc phía trước, vui lòng quét mã QR gắn tại mốc hoặc chọn vị trí bác đang đứng:
          </p>

          {/* Nút quét QR nhanh */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenQrScanner();
            }}
            className="w-full min-h-[52px] h-14 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 border-2 border-teal-600 rounded-2xl flex items-center justify-center gap-3 text-teal-900 font-black text-base shadow-sm transition-colors"
          >
            <QrCode className="w-6 h-6 text-teal-700" />
            <span>Quét mã QR tại cột mốc gần nhất</span>
          </button>

          {/* Tìm kiếm mốc theo tên */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm mốc bác đang đứng (ví dụ: Cổng 1, Sảnh C1-1...)"
              className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none text-sm sm:text-base text-slate-900"
            />
          </div>

          {/* Danh sách các mốc khảo sát thực địa */}
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`w-full p-3 rounded-xl text-left border-2 flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/80 text-teal-950 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-base">{node.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                      {node.landmarkDescription}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mở InMapz đối chiếu nếu chưa rõ mốc */}
          <button
            type="button"
            onClick={onOpenOfficialMap}
            className="flex items-center justify-center gap-2 py-2 text-sm font-bold text-teal-800 hover:text-teal-900 underline"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mở bản đồ toàn viện để tra cứu vị trí</span>
          </button>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 safe-bottom">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] h-12 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm sm:text-base transition-colors"
          >
            Đóng
          </button>

          <button
            type="button"
            disabled={!selectedNode}
            onClick={handleConfirmRecalculate}
            className={`flex-1 min-h-[48px] h-12 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-colors ${
              selectedNode
                ? 'bg-teal-700 hover:bg-teal-800 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tính lại đường</span>
          </button>
        </div>
      </div>
    </div>
  );
};

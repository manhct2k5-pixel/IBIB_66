import React, { useState } from 'react';
import {
  X,
  Eye,
  Volume2,
  HelpCircle,
  MapPin,
  QrCode,
  ExternalLink,
  PhoneCall,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import type { RouteNode } from '../../types';
import { HOSPITAL_108_ROUTE_NODES } from '../../data/hospital108/navigation';
import { removeVietnameseTones } from '../../utils/stringUtils';

interface LandmarkHelpSheetProps {
  isOpen: boolean;
  onClose: () => void;
  targetNode?: RouteNode;
  onSpeakInstruction: () => void;
  onSelectRelocateNode: (newNode: RouteNode) => void;
  onOpenQrScanner: () => void;
  onOpenOfficialMap: () => void;
}

export const LandmarkHelpSheet: React.FC<LandmarkHelpSheetProps> = ({
  isOpen,
  onClose,
  targetNode,
  onSpeakInstruction,
  onSelectRelocateNode,
  onOpenQrScanner,
  onOpenOfficialMap
}) => {
  const [subView, setSubView] = useState<'main' | 'visual_cues' | 'select_location' | 'photo_detail'>('main');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pendingNode, setPendingNode] = useState<RouteNode | null>(null);

  if (!isOpen) return null;

  const targetName = targetNode?.shortName || targetNode?.name || 'mốc cần tìm';

  const handleClose = () => {
    setSubView('main');
    setSearchTerm('');
    setPendingNode(null);
    onClose();
  };

  const handleConfirmNewNode = (node: RouteNode) => {
    onSelectRelocateNode(node);
    handleClose();
  };

  const filteredNodes = HOSPITAL_108_ROUTE_NODES.filter(node => {
    if (!searchTerm.trim()) return true;
    const cleanSearch = removeVietnameseTones(searchTerm.toLowerCase());
    const cleanName = removeVietnameseTones(node.name.toLowerCase());
    const cleanLandmark = removeVietnameseTones(node.landmarkDescription.toLowerCase());
    return cleanName.includes(cleanSearch) || cleanLandmark.includes(cleanSearch);
  });

  return (
    <div
      data-testid="landmark-help-sheet"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Bác chưa nhìn thấy {targetName}?
            </h3>
          </div>
          <button
            type="button"
            data-testid="close-help-sheet-btn"
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung tương tác theo subView */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {subView === 'main' && (
            <div className="flex flex-col gap-2.5">
              <p className="text-sm text-slate-600 mb-1">
                Đừng lo lắng, bác hãy chọn một trong các phương án trợ giúp bên dưới:
              </p>

              {/* 1. Xem ảnh mốc lớn hơn hoặc chi tiết */}
              {targetNode?.landmarkPhotoUrl && targetNode.dataStatus === 'field_verified' ? (
                <button
                  type="button"
                  data-testid="help-option-photo"
                  onClick={() => setSubView('photo_detail')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        1. Xem ảnh mốc thực tế lớn hơn
                      </div>
                      <div className="text-xs text-slate-500">
                        Đối chiếu khung cảnh thực địa đã khảo sát
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ) : null}

              {/* 2. Nghe lại hướng dẫn */}
              <button
                type="button"
                data-testid="help-option-listen"
                onClick={() => {
                  onSpeakInstruction();
                  handleClose();
                }}
                className="w-full p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-200 text-teal-900 flex items-center justify-center shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-teal-950">
                      2. Nghe lại hướng dẫn bằng giọng nói
                    </div>
                    <div className="text-xs text-teal-800">
                      Nghe lại câu chỉ dẫn và mốc cần tìm
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-teal-700" />
              </button>

              {/* 3. Xem dấu hiệu nhận biết chi tiết */}
              <button
                type="button"
                data-testid="help-option-cues"
                onClick={() => setSubView('visual_cues')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">
                      3. Xem dấu hiệu nhận biết chi tiết
                    </div>
                    <div className="text-xs text-slate-500">
                      Mô tả đặc điểm vật lý, màu sắc, biển chữ
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* 4. Chọn một địa điểm đang nhìn thấy */}
              <button
                type="button"
                data-testid="help-option-select-node"
                onClick={() => setSubView('select_location')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">
                      4. Chọn địa điểm bác đang nhìn thấy
                    </div>
                    <div className="text-xs text-slate-500">
                      Hệ thống sẽ tính lại lộ trình từ vị trí mới
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* 5. Quét QR vị trí */}
              <button
                type="button"
                data-testid="help-option-qr"
                onClick={() => {
                  handleClose();
                  onOpenQrScanner();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">
                      5. Quét mã QR tại cột mốc gần nhất
                    </div>
                    <div className="text-xs text-slate-500">
                      Tự động nhận diện điểm đứng hiện tại
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* 6. Mở bản đồ chính thức */}
              <button
                type="button"
                data-testid="help-option-official-map"
                onClick={() => {
                  handleClose();
                  onOpenOfficialMap();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">
                      6. Mở sơ đồ chính thức Bệnh viện 108
                    </div>
                    <div className="text-xs text-slate-500">
                      Đối chiếu sơ đồ mặt bằng InMapz 108
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* 7. Gọi trợ giúp viện */}
              <a
                href="tel:02462784108"
                data-testid="help-option-call"
                className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-between text-left transition-colors min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-rose-950">
                      7. Gọi điện thoại hỗ trợ Bệnh viện 108
                    </div>
                    <div className="text-xs text-rose-800">
                      Tổng đài hướng dẫn: 024 6278 4108
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-rose-700" />
              </a>
            </div>
          )}

          {/* SubView: Dấu hiệu nhận biết chi tiết */}
          {subView === 'visual_cues' && (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setSubView('main')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                ← Quay lại danh sách trợ giúp
              </button>

              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase">
                  Dấu hiệu nhận biết mốc {targetName}:
                </span>
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {targetNode?.visibleCue || targetNode?.landmarkDescription}
                </p>
                {targetNode?.instructionWhenNotVisible && (
                  <div className="mt-2 pt-2 border-t border-amber-200 text-sm text-slate-800">
                    <span className="font-bold text-amber-900">Nếu vẫn chưa thấy: </span>
                    <span>{targetNode.instructionWhenNotVisible}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700">
                <span className="font-bold block mb-1">Mẹo nhỏ khi đi lại:</span>
                Bác có thể hỏi nhân viên bảo vệ hoặc cán bộ y tế gần nhất: <br />
                <em className="text-teal-800 font-bold">
                  "Làm ơn cho tôi hỏi đường tới {targetNode?.name || targetName} ở đâu?"
                </em>
              </div>
            </div>
          )}

          {/* SubView: Chọn địa điểm đang nhìn thấy để tính lại đường */}
          {subView === 'select_location' && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setPendingNode(null);
                  setSubView('main');
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                ← Quay lại danh sách trợ giúp
              </button>

              <div className="text-sm font-bold text-slate-900">
                Chọn một điểm mốc bác đang đứng gần:
              </div>

              <input
                type="text"
                placeholder="Tìm tên cổng, sảnh, quầy..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
                {filteredNodes.map(node => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setPendingNode(node)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      pendingNode?.id === node.id
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">
                      {node.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {node.landmarkDescription}
                    </div>
                  </button>
                ))}
              </div>

              {pendingNode && (
                <div className="p-3 bg-teal-50 border border-teal-300 rounded-xl flex flex-col gap-2 mt-1 animate-in fade-in">
                  <div className="text-xs text-teal-900 font-medium">
                    Bác xác nhận đang đứng tại: <strong>{pendingNode.name}</strong>?
                  </div>
                  <button
                    type="button"
                    data-testid="confirm-relocate-btn"
                    onClick={() => handleConfirmNewNode(pendingNode)}
                    className="w-full min-h-[48px] py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Xác nhận & tính lại đường từ đây</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SubView: Chi tiết ảnh */}
          {subView === 'photo_detail' && targetNode?.landmarkPhotoUrl && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSubView('main')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                ← Quay lại danh sách trợ giúp
              </button>

              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={targetNode.landmarkPhotoUrl}
                  alt={targetNode.landmarkPhotoAlt || targetNode.name}
                  className="w-full max-h-72 object-cover"
                />
                <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Ảnh thực địa
                  </span>
                  <span>{targetNode.photoCapturedAt}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

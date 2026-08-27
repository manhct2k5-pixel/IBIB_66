import React from 'react';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';
import { 
  AlertOctagon, 
  PhoneCall, 
  Navigation, 
  X, 
  ShieldAlert, 
  Activity, 
  Zap, 
  Skull,
  MapPin,
  Clock
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmergencyNode: (node: MapNode) => void;
  currentFloor: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSelectEmergencyNode
}) => {
  if (!isOpen) return null;

  const handleRouteToEmergency = (targetNodeId: string) => {
    const node = MAP_NODES_DATA.find(n => n.id === targetNodeId);
    if (node) {
      onSelectEmergencyNode(node);
      onClose();
    } else {
      // Fallback to A9 emergency
      const a9Node = MAP_NODES_DATA.find(n => n.id === 'node_a9_emergency_entrance') || MAP_NODES_DATA[0];
      if (a9Node) {
        onSelectEmergencyNode(a9Node);
        onClose();
      }
    }
  };

  const emergencyUnits = [
    {
      id: 'node_a9_emergency_entrance',
      nameVi: 'Trung Tâm Cấp Cứu A9 (24/7)',
      locationVi: 'Tòa A9 - Tầng 1 (Vào từ Cổng 1 đường Giải Phóng)',
      hotline: '086 958 7707',
      descVi: 'Tiếp nhận cấp cứu đa khoa, đau ngực cấp, khó thở nặng, tai nạn, hôn mê, sốc 24/7.',
      icon: Activity,
      color: 'bg-rose-600',
      border: 'border-rose-300'
    },
    {
      id: 'node_a10_stroke_entrance',
      nameVi: 'Trung Tâm Đột Quỵ (Tòa A10)',
      locationVi: 'Tòa A10 - Tầng 1 (Cạnh Tòa A9)',
      hotline: '086 958 7707',
      descVi: 'Cấp cứu đột quỵ não, méo miệng, yếu liệt nửa người trong giờ vàng.',
      icon: Zap,
      color: 'bg-red-600',
      border: 'border-red-300'
    },
    {
      id: 'node_k3_poison_entrance',
      nameVi: 'Trung Tâm Chống Độc Quốc Gia (Tòa K3)',
      locationVi: 'Tòa K3 - Tầng 1 (Ngay cạnh Cổng 1 Giải Phóng)',
      hotline: '1900 888 866',
      descVi: 'Cấp cứu ngộ độc cấp, rắn cắn, nấm độc, hóa chất độc hại.',
      icon: Skull,
      color: 'bg-orange-600',
      border: 'border-orange-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white border border-rose-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">HỖ TRỢ CẤP CỨU KHẨN CẤP</h2>
              <p className="text-xs text-rose-100 font-medium">Bệnh viện Bạch Mai • Hà Nội</p>
            </div>
          </div>

          <button
            id="btn-close-emergency-modal"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Nguyên tắc an toàn:</strong> Trong tình huống đe dọa tính mạng, hãy gọi <strong>115</strong> hoặc di chuyển ngay tới <strong>Trung tâm Cấp cứu A9</strong> (gần Cổng 1 đường Giải Phóng). Ưu tiên tuyệt đối theo hướng dẫn của nhân viên y tế.
          </p>
        </div>

        {/* Quick Dial Buttons */}
        <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50 border-b border-slate-200">
          <a
            id="btn-call-115"
            href="tel:115"
            className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex items-center gap-3 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-rose-700 font-semibold">Tổng Đài Cấp Cứu</div>
              <div className="text-base font-black text-rose-900">115</div>
            </div>
          </a>

          <a
            id="btn-call-hotline-a9"
            href="tel:0869587707"
            className="p-3 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-2xl flex items-center gap-3 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-cyan-700 font-semibold">Hotline Cấp Cứu A9</div>
              <div className="text-sm font-black text-cyan-900">086 958 7707</div>
            </div>
          </a>
        </div>

        {/* Emergency Centers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Các trung tâm cấp cứu chuyên sâu tại Bệnh viện Bạch Mai:
          </div>

          {emergencyUnits.map((unit) => {
            const Icon = unit.icon;
            return (
              <div
                key={unit.id}
                className="p-3.5 bg-white border border-slate-200 hover:border-rose-300 rounded-2xl transition space-y-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${unit.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{unit.nameVi}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {unit.locationVi}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded text-[10px] border border-rose-200 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    24/7
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg">
                  {unit.descVi}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    id={`btn-route-${unit.id}`}
                    onClick={() => handleRouteToEmergency(unit.id)}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>CHỈ ĐƯỜNG KHẨN CẤP TỚI ĐÂY</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Tổng đài Bệnh viện Bạch Mai: <strong className="text-slate-700">1900 888 866</strong> • Hotline Cấp cứu A9: <strong className="text-rose-700">086 958 7707</strong> • Địa chỉ: Số 78 Đường Giải Phóng, P. Kim Liên, TP Hà Nội
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  QrCode, 
  MapPin, 
  HelpCircle, 
  ArrowLeft, 
  ChevronRight, 
  Building2, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';
import { UnknownLocationModal } from './UnknownLocationModal';

interface CurrentLocationStepProps {
  destinationNode: MapNode;
  onSelectStartLocation: (node: MapNode) => void;
  onBackToDestination: () => void;
  onOpenQRScanner: () => void;
  language?: 'vi' | 'en';
}

export const CurrentLocationStep: React.FC<CurrentLocationStepProps> = ({
  destinationNode,
  onSelectStartLocation,
  onBackToDestination,
  onOpenQRScanner,
  language = 'vi'
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [expandedGate, setExpandedGate] = useState<string | null>(null);

  // 4 Official Gates (Exact descriptions, 1-column direct tap)
  const officialGates = [
    {
      id: 'node_gate_4',
      name: 'Cổng 4',
      subtitle: 'Thuận tiện đến K1 và K2 (Đường Giải Phóng)',
      badgeColor: 'bg-emerald-700 text-white',
      borderColor: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70'
    },
    {
      id: 'node_gate_1',
      name: 'Cổng 1',
      subtitle: 'Số 78 Giải Phóng – gần Cấp cứu A9, K3',
      badgeColor: 'bg-rose-600 text-white',
      borderColor: 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/70'
    },
    {
      id: 'node_gate_3',
      name: 'Cổng 3',
      subtitle: 'Phố Phương Mai (Lối vào phía sau bệnh viện)',
      badgeColor: 'bg-cyan-700 text-white',
      borderColor: 'border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100/70'
    },
    {
      id: 'node_gate_2',
      name: 'Cổng 2',
      subtitle: 'Chủ yếu là lối ô tô đi ra (Đường Giải Phóng)',
      badgeColor: 'bg-slate-700 text-white',
      borderColor: 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
    }
  ];

  const handleSelectGate = (nodeId: string) => {
    const node = MAP_NODES_DATA.find(n => n.id === nodeId);
    if (node) {
      onSelectStartLocation(node);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 flex flex-col space-y-6 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-base sm:text-lg font-black text-cyan-800 tracking-tight">
          Bước 2/3 – Chọn vị trí hiện tại
        </span>
        <button
          id="btn-back-to-destination"
          onClick={onBackToDestination}
          className="flex items-center gap-1.5 text-slate-600 hover:text-cyan-800 font-bold text-sm cursor-pointer p-1 -m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Clean Destination Reminder Bar */}
      <div className="p-3.5 sm:p-4 bg-cyan-50 border-2 border-cyan-200 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white font-black text-base flex items-center justify-center shrink-0">
            {destinationNode.buildingId || 'ĐÍCH'}
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-cyan-800">
              Đang tìm đường đến:
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">
              {destinationNode.name}
            </div>
          </div>
        </div>

        <button
          id="btn-change-destination"
          onClick={onBackToDestination}
          className="h-10 px-3 bg-white hover:bg-cyan-100 text-cyan-900 border border-cyan-300 font-bold text-sm rounded-xl transition cursor-pointer shrink-0"
        >
          Đổi
        </button>
      </div>

      {/* Main Question */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          Bạn đang đứng ở đâu?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          Quét mã tại chỗ hoặc chọn cổng bệnh viện nơi bạn vừa bước vào.
        </p>
      </div>

      {/* Primary Action Button: Quét mã vị trí */}
      <button
        id="btn-scan-qr-location"
        onClick={onOpenQRScanner}
        className="w-full min-h-18 p-4.5 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white rounded-2xl shadow-md transition flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/40"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <QrCode className="w-7 h-7 text-white stroke-[2.5]" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-lg sm:text-xl font-black">
              Quét mã vị trí
            </div>
            <div className="text-sm sm:text-base text-cyan-100 font-medium">
              Quét mã MedNav tại cổng hoặc điểm giao gần bạn
            </div>
          </div>
        </div>

        <ChevronRight className="w-7 h-7 text-white/90 shrink-0 stroke-[2.5]" />
      </button>

      {/* 4 Official Gates (1 Column, Large rows >= 56px) */}
      <div className="space-y-3 pt-2">
        <div className="text-base sm:text-lg font-black text-slate-800">
          Hoặc chọn cổng bệnh viện:
        </div>

        <div className="space-y-3">
          {officialGates.map((gate) => (
            <button
              key={gate.id}
              id={`btn-select-${gate.id}`}
              onClick={() => handleSelectGate(gate.id)}
              className={`w-full min-h-18 p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 text-left cursor-pointer shadow-xs focus:outline-none focus:ring-4 focus:ring-cyan-600/30 ${gate.borderColor}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-12 h-12 rounded-xl font-black text-base flex items-center justify-center shrink-0 shadow-xs ${gate.badgeColor}`}>
                  {gate.name}
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {gate.name}
                  </div>
                  <div className="text-sm sm:text-base text-slate-600 font-medium truncate mt-0.5">
                    {gate.subtitle}
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-700 shrink-0 border border-slate-200">
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Unknown Location Help Button */}
      <div className="pt-2">
        <button
          id="btn-unknown-location-help"
          onClick={() => setIsHelpOpen(true)}
          className="w-full h-15 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2.5 transition cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
        >
          <HelpCircle className="w-6 h-6 text-cyan-700 stroke-[2.5]" />
          <span>Tôi không biết mình đang ở đâu</span>
        </button>
      </div>

      {/* Modal Help Guide */}
      <UnknownLocationModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onSelectGate={handleSelectGate}
        onOpenQRScanner={onOpenQRScanner}
        onSelectNode={(node) => onSelectStartLocation(node)}
      />
    </div>
  );
};

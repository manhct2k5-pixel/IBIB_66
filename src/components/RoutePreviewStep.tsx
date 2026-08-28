import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Footprints, 
  Clock, 
  Info, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { MapNode, NavigationRoute, RoutingProfile } from '../types';
import { Hospital2DCampusMap } from './Hospital2DCampusMap';

interface RoutePreviewStepProps {
  startNode: MapNode;
  destinationNode: MapNode;
  activeRoute: NavigationRoute;
  onStartNavigation: () => void;
  onChangeStartLocation: () => void;
  onChangeDestination: () => void;
  onOpenDataInfo: () => void;
  language?: 'vi' | 'en';
}

export const RoutePreviewStep: React.FC<RoutePreviewStepProps> = ({
  startNode,
  destinationNode,
  activeRoute,
  onStartNavigation,
  onChangeStartLocation,
  onChangeDestination,
  onOpenDataInfo,
  language = 'vi'
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col space-y-5 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-base sm:text-lg font-black text-cyan-800 tracking-tight">
          Bước 3/3 – Kiểm tra tuyến đường
        </span>
        <button
          id="btn-preview-back"
          onClick={onChangeStartLocation}
          className="flex items-center gap-1.5 text-slate-600 hover:text-cyan-800 font-bold text-sm cursor-pointer p-1 -m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Đổi vị trí</span>
        </button>
      </div>

      {/* From / To Summary Box */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Start Point */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0">
              ĐI
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Vị trí xuất phát:
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                {startNode.name}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex text-slate-400">
            <ArrowRight className="w-6 h-6 stroke-[2.5]" />
          </div>

          {/* Destination Point */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              ĐÍCH
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Nơi muốn đến:
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                {destinationNode.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 2D Map Area (Clean, clamped mobile height) */}
      <div className="w-full h-[clamp(240px,42dvh,380px)] bg-slate-100 rounded-3xl border-2 border-slate-300 overflow-hidden shadow-sm relative">
        <Hospital2DCampusMap
          startNode={startNode}
          destinationNode={destinationNode}
          onSelectStartNode={() => {}}
          onSelectDestinationNode={() => {}}
          activeRoute={activeRoute}
          currentStepIndex={0}
          isNavigating={false}
          routingProfile="fastest"
          language={language}
        />
      </div>

      {/* Max 3 Stats Below Map */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stat 1: Số bước */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
            <Footprints className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Tổng số chặng:</div>
            <div className="text-base font-black text-slate-900">
              {activeRoute.steps.length} bước di chuyển
            </div>
          </div>
        </div>

        {/* Stat 2: Khoảng cách */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Khoảng cách & Thời gian:</div>
            <div className="text-base font-black text-slate-900">
              ~{Math.round(activeRoute.totalDistance)}m ({Math.ceil(activeRoute.estimatedTimeSeconds / 60)} phút)
            </div>
          </div>
        </div>

        {/* Stat 3: Phạm vi chỉ đường */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Phạm vi hướng dẫn:</div>
            <div className="text-base font-black text-slate-900">
              Đến cửa / sảnh tòa nhà
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-slate-600 font-medium">
        <span>MedNav chỉ hướng dẫn đến cửa hoặc sảnh tòa nhà. Chưa có dữ liệu xác minh đường đi bên trong từng tòa.</span>
        <button
          id="btn-preview-data-info"
          onClick={onOpenDataInfo}
          className="text-cyan-800 font-bold hover:underline cursor-pointer shrink-0"
        >
          Nguồn dữ liệu
        </button>
      </div>

      {/* Primary Action Button: Bắt đầu chỉ đường */}
      <div className="pt-2 space-y-3">
        <button
          id="btn-start-navigation"
          onClick={onStartNavigation}
          className="w-full h-16 sm:h-18 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white font-black text-xl rounded-2xl shadow-lg transition flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/40"
        >
          <Navigation className="w-7 h-7 fill-white stroke-[2.5]" />
          <span>Bắt đầu chỉ đường</span>
        </button>

        {/* Secondary Edit Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-change-start-location"
            onClick={onChangeStartLocation}
            className="h-13 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base rounded-xl transition cursor-pointer"
          >
            Đổi vị trí bắt đầu
          </button>
          <button
            id="btn-change-destination-node"
            onClick={onChangeDestination}
            className="h-13 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base rounded-xl transition cursor-pointer"
          >
            Đổi nơi muốn đến
          </button>
        </div>
      </div>
    </div>
  );
};

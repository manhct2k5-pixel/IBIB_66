import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  BACH_MAI_OFFICIAL_SOURCES, 
  BACH_MAI_GATES, 
  BACH_MAI_BUILDINGS 
} from '../data/hospitalData';

interface DataInfoViewProps {
  onGoToNavigation: () => void;
  language?: 'vi' | 'en';
}

export const DataInfoView: React.FC<DataInfoViewProps> = ({
  onGoToNavigation,
  language = 'vi'
}) => {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title Banner */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Minh bạch nguồn dữ liệu & Bản đồ MedNav
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Nguyên tắc trung thực dữ liệu đối với khuôn viên Bệnh viện Bạch Mai
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            MedNav xây dựng sơ đồ khuôn viên dựa trên <strong>thông báo phân luồng giao thông chính thức</strong>, <strong>biển chỉ dẫn thực tế tại cổng viện</strong> và <strong>sơ đồ các khối nhà được công bố</strong> của Bệnh viện Bạch Mai. Ứng dụng tuân thủ nguyên tắc không bịa đặt dữ liệu tầng hay phòng khi chưa có sơ đồ CAD nội bộ chính thức được xác minh.
          </p>
        </div>

        {/* 4 Gates Regulation Summary */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span>4 Cổng chính thức và Quy chế phân luồng giao thông</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              Đã xác minh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BACH_MAI_GATES.map(gate => (
              <div 
                key={gate.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    {gate.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-mono">
                    Đường {gate.street}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {gate.descriptionVi}
                </p>
                <div className="text-[11px] text-cyan-900 font-semibold bg-cyan-50/70 p-2 rounded-xl border border-cyan-100">
                  {gate.vehicleRules}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope and Boundaries */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Phạm vi hỗ trợ & Giới hạn công nghệ</span>
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <p>
                <strong>Phạm vi chỉ đường:</strong> MedNav chỉ hướng dẫn đến cửa hoặc sảnh tòa nhà. Chưa có dữ liệu xác minh đường đi bên trong từng tòa.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <p>
                <strong>Định vị vị trí đứng:</strong> MedNav không tự ý hiển thị định vị GPS/chấm xanh giả. Người dùng xác nhận vị trí bằng cách chọn cổng, tòa nhà hoặc quét mã QR Checkpoint tại chỗ.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <p>
                <strong>Dữ liệu dịch vụ phụ trợ:</strong> Hiện tại bệnh viện chưa công bố sơ đồ vị trí căng tin chính thức, ứng dụng thể hiện rõ thông báo chưa có dữ liệu xác minh khi tìm kiếm để đảm bảo độ tin cậy.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToNavigation}
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Chuyển sang màn hình chỉ đường</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Reference Sources */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <span>Nguồn tài liệu tham khảo chính thức</span>
          </h3>

          <div className="space-y-2">
            {BACH_MAI_OFFICIAL_SOURCES.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-2xl flex items-center justify-between text-xs text-slate-800 transition cursor-pointer group"
              >
                <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                  <div className="font-bold text-slate-900 group-hover:text-cyan-900">
                    {source.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Xác minh: {source.verifiedAt} • Cổng thông tin chính thức BV Bạch Mai
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 shrink-0" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

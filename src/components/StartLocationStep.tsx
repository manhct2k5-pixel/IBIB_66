import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  QrCode, 
  HelpCircle, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Building,
  Layers
} from 'lucide-react';
import { 
  Hospital108StartLocation, 
  Hospital108Destination, 
  Hospital108Checkpoint 
} from '../types';
import { 
  HOSPITAL_108_START_LOCATIONS, 
  HOSPITAL_108_DESTINATIONS,
  lookupCheckpointByCode,
  HOSPITAL_108_CHECKPOINTS
} from '../data/hospital108';
import { normalizeSearchText } from '../utils/search';
import { SpeechGuideButton } from './SpeechGuideButton';

interface StartLocationStepProps {
  destination: Hospital108Destination;
  onSelectStartLocation: (start: Hospital108StartLocation) => void;
  onBack: () => void;
  onShowUnknownHelp: () => void;
}

type StartTab = 'list' | 'qr' | 'help';

export function StartLocationStep({
  destination,
  onSelectStartLocation,
  onBack,
  onShowUnknownHelp
}: StartLocationStepProps) {
  const [activeTab, setActiveTab] = useState<StartTab>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State cho Tab quét / nhập mã vị trí
  const [qrInputCode, setQrInputCode] = useState('');
  const [scannedCheckpoint, setScannedCheckpoint] = useState<Hospital108Checkpoint | null>(null);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);

  // Tạo danh sách tổng hợp các điểm xuất phát xác minh
  const allStartCandidates: Hospital108StartLocation[] = useMemo(() => {
    // Start with predefined start locations
    const list: Hospital108StartLocation[] = [...HOSPITAL_108_START_LOCATIONS];
    
    // Add destinations that aren't duplicates
    for (const d of HOSPITAL_108_DESTINATIONS) {
      const exists = list.some(l => l.mapLinkId === d.mapLinkId && l.name.toLowerCase() === d.name.toLowerCase());
      if (!exists && d.id !== 'tong_quan') {
        list.push({
          id: `start_${d.id}`,
          name: d.name,
          building: d.building,
          floor: d.floor || 'Tầng 1',
          mapLinkId: d.mapLinkId,
          description: d.description,
          aliases: d.aliases
        });
      }
    }
    return list;
  }, []);

  // Lọc tìm kiếm điểm xuất phát
  const filteredStartLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return allStartCandidates;
    }
    const norm = normalizeSearchText(searchQuery);
    return allStartCandidates.filter(item => {
      if (normalizeSearchText(item.name).includes(norm)) return true;
      if (normalizeSearchText(item.building).includes(norm)) return true;
      if (item.floor && normalizeSearchText(item.floor).includes(norm)) return true;
      return item.aliases.some(a => normalizeSearchText(a).includes(norm));
    });
  }, [allStartCandidates, searchQuery]);

  // Xử lý kiểm tra mã QR / Checkpoint
  const handleVerifyQrCode = (codeToVerify: string) => {
    setQrErrorMessage(null);
    setScannedCheckpoint(null);
    
    if (!codeToVerify.trim()) {
      setQrErrorMessage('Vui lòng nhập hoặc quét mã vị trí.');
      return;
    }

    const checkpoint = lookupCheckpointByCode(codeToVerify);
    if (checkpoint) {
      setScannedCheckpoint(checkpoint);
    } else {
      setQrErrorMessage('Không nhận diện được mã vị trí này. Hãy kiểm tra lại mã trên biển chỉ dẫn.');
    }
  };

  const handleApplyCheckpoint = (checkpoint: Hospital108Checkpoint) => {
    const startLoc: Hospital108StartLocation = {
      id: `chk_${checkpoint.id}`,
      name: checkpoint.name,
      building: checkpoint.building,
      floor: checkpoint.floor,
      mapLinkId: checkpoint.mapLinkId,
      description: `Mã vị trí xác minh: ${checkpoint.code}`,
      aliases: [checkpoint.name, checkpoint.code]
    };
    onSelectStartLocation(startLoc);
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
      <div className="space-y-4">
        {/* Header điều hướng */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="h-12 px-3 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/60 active:bg-slate-200 flex items-center gap-1.5 font-bold text-base transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Đổi nơi muốn đến</span>
          </button>

          <SpeechGuideButton 
            textToSpeak="Bác đang ở đâu trong bệnh viện? Hãy chọn vị trí nhìn thấy quanh bác hoặc chọn Tôi không biết mình đang ở đâu để được trợ giúp." 
            label="Nghe hướng dẫn"
          />
        </div>

        {/* Tóm tắt điểm đến đã chọn */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0">
              Đến
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Nơi muốn đến</div>
              <div className="text-base font-bold text-slate-900 line-clamp-1">{destination.name}</div>
            </div>
          </div>
          <span className="text-sm font-medium text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">
            {destination.building}
          </span>
        </div>

        {/* Tiêu đề câu hỏi */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bác đang ở đâu?
          </h2>
          <p className="text-base sm:text-lg font-medium text-slate-600 mt-1">
            Chọn vị trí bác đang đứng để chuẩn bị tuyến đường chính xác.
          </p>
        </div>

        {/* Chuyển đổi 3 cách xác định vị trí */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`py-2.5 px-2 rounded-xl font-bold text-sm sm:text-base transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 'list'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Vị trí nhìn thấy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-2.5 px-2 rounded-xl font-bold text-sm sm:text-base transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 'qr'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Mã vị trí (QR)</span>
          </button>

          <button
            type="button"
            onClick={() => onShowUnknownHelp()}
            className={`py-2.5 px-2 rounded-xl font-bold text-sm sm:text-base transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 'help'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-600" />
            <span>Chưa rõ vị trí</span>
          </button>
        </div>

        {/* TAB 1: Danh sách vị trí nhìn thấy */}
        {activeTab === 'list' && (
          <div className="space-y-3 pt-1">
            {/* Ô tìm kiếm điểm xuất phát */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên tòa, tầng hoặc biển báo..."
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 focus:border-emerald-600 rounded-2xl text-base sm:text-lg font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all"
              />
              <Search className="w-6 h-6 text-slate-400 absolute left-4 top-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 h-8 px-2 text-sm font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Danh sách các điểm xuất phát */}
            <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
              {filteredStartLocations.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-lg font-bold text-slate-700">Không tìm thấy vị trí khớp với từ khóa</p>
                  <p className="text-base text-slate-500 mt-1">Bác hãy thử tìm từ khóa đơn giản như &quot;Cổng&quot;, &quot;C1-1&quot;, &quot;Yêu cầu&quot;</p>
                </div>
              ) : (
                filteredStartLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => onSelectStartLocation(loc)}
                    className="w-full p-4 bg-white hover:bg-emerald-50/60 active:bg-emerald-100/80 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl transition-all text-left flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3.5 pr-2">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
                        <MapPin className="w-6 h-6 text-slate-600 group-hover:text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-900">
                          {loc.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                            <Building className="w-4 h-4 text-slate-400" />
                            {loc.building}
                          </span>
                          {loc.floor && (
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                              <Layers className="w-4 h-4 text-slate-400" />
                              {loc.floor}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="h-10 px-3.5 bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center">
                        Bắt đầu từ đây
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Quét / Nhập mã vị trí (Thử nghiệm với cảnh báo) */}
        {activeTab === 'qr' && (
          <div className="space-y-4 pt-1">
            {/* Cảnh báo tính năng thử nghiệm */}
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-sm sm:text-base text-amber-900">
                <span className="font-bold">Lưu ý:</span> Chức năng mã vị trí chỉ hoạt động tại các điểm đã được Bệnh viện 108 triển khai mã chính thức.
              </div>
            </div>

            {/* Ô nhập mã hoặc quét */}
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 space-y-4 shadow-sm">
              <div>
                <label className="block text-base font-bold text-slate-900 mb-1.5">
                  Nhập mã vị trí trên biển chỉ dẫn:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qrInputCode}
                    onChange={(e) => {
                      setQrInputCode(e.target.value);
                      setQrErrorMessage(null);
                    }}
                    placeholder="Ví dụ: 108-GATE-01, 108-C1-1-LOBBY"
                    className="flex-1 h-14 px-4 bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 rounded-xl text-base sm:text-lg font-bold text-slate-900 uppercase focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyQrCode(qrInputCode)}
                    className="h-14 px-5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl font-bold text-base transition-colors"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>

              {/* Thông báo lỗi nếu mã không hợp lệ */}
              {qrErrorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-base font-semibold">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{qrErrorMessage}</span>
                </div>
              )}

              {/* Kết quả nhận diện thành công */}
              {scannedCheckpoint && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                    Đã xác nhận vị trí hợp lệ
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                    <div className="text-base font-bold text-slate-900">{scannedCheckpoint.name}</div>
                    <div className="text-sm font-medium text-slate-600 mt-0.5">
                      {scannedCheckpoint.building} • {scannedCheckpoint.floor}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Nguồn xác minh: {scannedCheckpoint.verificationSource}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyCheckpoint(scannedCheckpoint)}
                    className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl font-bold text-base transition-colors shadow-sm"
                  >
                    Bắt đầu từ điểm này
                  </button>
                </div>
              )}

              {/* Danh sách mã mẫu đã triển khai tại BV 108 */}
              <div className="pt-2">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Mã điểm vị trí đã xác minh:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {HOSPITAL_108_CHECKPOINTS.map((chk) => (
                    <button
                      key={chk.id}
                      type="button"
                      onClick={() => {
                        setQrInputCode(chk.code);
                        handleVerifyQrCode(chk.code);
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors"
                    >
                      <span className="font-mono font-bold text-emerald-800 text-sm block">{chk.code}</span>
                      <span className="text-xs font-semibold text-slate-700 truncate block mt-0.5">{chk.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chân trang hỗ trợ */}
      <div className="pt-4 pb-2">
        <button
          onClick={onShowUnknownHelp}
          className="w-full py-3 text-center text-slate-600 hover:text-slate-900 font-bold text-base flex items-center justify-center gap-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span>Bác chưa biết mình đang ở đâu? Xem trợ giúp 4 bước</span>
        </button>
      </div>
    </div>
  );
}

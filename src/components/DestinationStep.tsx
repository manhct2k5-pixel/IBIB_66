import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Mic, 
  MicOff, 
  ChevronRight, 
  Building2, 
  ShieldAlert, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Check
} from 'lucide-react';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';
import { isSpeechRecognitionSupported, VoiceSearchController } from '../utils/voiceRecognition';

interface DestinationStepProps {
  onSelectDestination: (node: MapNode) => void;
  onOpenDataInfo: () => void;
  language?: 'vi' | 'en';
}

export const DestinationStep: React.FC<DestinationStepProps> = ({
  onSelectDestination,
  onOpenDataInfo,
  language = 'vi'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllBuildings, setShowAllBuildings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const voiceControllerRef = useRef<VoiceSearchController | null>(null);

  // Key popular destinations (4 primary items)
  const popularDestinations = useMemo(() => {
    return [
      {
        badge: 'K1',
        title: 'Khám bệnh – Tòa K1',
        desc: 'Trung tâm Khám bệnh và Điều trị trong ngày',
        nodeId: 'node_k1_entrance',
        color: 'border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100/80 text-cyan-950',
        badgeColor: 'bg-cyan-700 text-white'
      },
      {
        badge: 'A9',
        title: 'Cấp cứu – Tòa A9',
        desc: 'Trung tâm Cấp cứu 24/7 (Cạnh Cổng 1)',
        nodeId: 'node_a9_entrance',
        color: 'border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 text-rose-950',
        badgeColor: 'bg-rose-600 text-white'
      },
      {
        badge: 'VTM',
        title: 'Viện Tim mạch (Nhà C)',
        desc: 'Viện Tim Mạch Quốc Gia – Khám & Điều trị tim mạch',
        nodeId: 'node_vtm_entrance',
        color: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950',
        badgeColor: 'bg-emerald-700 text-white'
      },
      {
        badge: 'K2',
        title: 'Tòa Nhà K2',
        desc: 'Điều trị theo yêu cầu, Thận nhân tạo & Tiết niệu',
        nodeId: 'node_k2_entrance',
        color: 'border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-950',
        badgeColor: 'bg-blue-700 text-white'
      }
    ];
  }, []);

  // Extended buildings list when user clicks "Xem thêm địa điểm"
  const extendedBuildings = useMemo(() => {
    return [
      { badge: 'Q', title: 'Tòa Q (21 tầng)', desc: 'Trung tâm Ung bướu & Y học hạt nhân', nodeId: 'node_q_21story_entrance' },
      { badge: 'P', title: 'Tòa P (Việt Nhật)', desc: 'Trung tâm kỹ thuật cao Hợp tác Việt - Nhật', nodeId: 'node_p_vietnhat_entrance' },
      { badge: 'A10', title: 'Trung tâm Đột quỵ (A10)', desc: 'Tòa nhà A10 – Cấp cứu & Can thiệp mạch não', nodeId: 'node_a10_stroke_entrance' },
      { badge: 'K3', title: 'Trung tâm Chống độc (K3)', desc: 'Tòa nhà K3 – Điều trị ngộ độc & Hồi sức', nodeId: 'node_k3_poison_entrance' },
      { badge: 'H', title: 'Tòa H (Y học hạt nhân)', desc: 'Điều trị xạ trị & Chẩn đoán hình ảnh phóng xạ', nodeId: 'node_h_onco_entrance' },
      { badge: 'F', title: 'Tòa F (Bệnh Nhiệt đới)', desc: 'Viện Y học Nhiệt đới Lâm sàng', nodeId: 'node_f_tropical_entrance' },
      { badge: 'T1', title: 'Cụm T1 - T3 (Thần kinh)', desc: 'Khoa Thần kinh & Phẫu thuật thần kinh', nodeId: 'node_t1_neuro_entrance' },
      { badge: 'T4', title: 'Cụm T4 - T6 (Sức khỏe tâm thần)', desc: 'Viện Sức khỏe Tâm thần', nodeId: 'node_t4_mental_entrance' }
    ];
  }, []);

  // Filter destination nodes
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    // Check canteen search intent
    const isCanteenQuery = q.includes('căng tin') || q.includes('canteen') || q.includes('cang tin') || q.includes('ăn uống') || q.includes('an uong');
    if (isCanteenQuery) {
      return { isCanteen: true, items: [] };
    }

    const matched = MAP_NODES_DATA.filter(node => {
      // Exclude pure street gates from destination search results unless explicitly typed
      if (node.type === 'entrance' || node.type === 'room' || node.type === 'emergency') {
        const nameMatch = node.name.toLowerCase().includes(q);
        const nameEnMatch = (node.nameEn || '').toLowerCase().includes(q);
        const buildingMatch = (node.buildingId || '').toLowerCase().includes(q);
        const roomMatch = (node.roomId || '').toLowerCase().includes(q);
        return nameMatch || nameEnMatch || buildingMatch || roomMatch;
      }
      return false;
    });

    return { isCanteen: false, items: matched };
  }, [searchQuery]);

  // Voice Search Handler
  const handleToggleVoice = () => {
    if (isListening) {
      voiceControllerRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceMessage('Trình duyệt của bác chưa hỗ trợ nhận diện giọng nói. Bác vui lòng nhập bằng chữ.');
      return;
    }

    if (!voiceControllerRef.current) {
      voiceControllerRef.current = new VoiceSearchController();
    }

    setIsListening(true);
    setVoiceMessage('Đang lắng nghe... Bác hãy nói tên nơi cần đến (Ví dụ: "Khám bệnh K1", "Viện Tim mạch")');

    voiceControllerRef.current.start(
      (transcript) => {
        setSearchQuery(transcript);
      },
      (errorMsg) => {
        setIsListening(false);
        setVoiceMessage(errorMsg);
      },
      () => {
        setIsListening(false);
        setVoiceMessage(null);
      }
    );
  };

  const handleSelectByNodeId = (nodeId: string) => {
    const node = MAP_NODES_DATA.find(n => n.id === nodeId);
    if (node) {
      onSelectDestination(node);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 flex flex-col space-y-6 animate-in fade-in duration-200">
      {/* Step Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-base sm:text-lg font-black text-cyan-800 tracking-tight">
          Bước 1/3 – Chọn nơi muốn đến
        </span>
        <span className="text-sm font-semibold text-slate-500">
          Bệnh viện Bạch Mai
        </span>
      </div>

      {/* Main Title Question */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          Bạn muốn đến đâu?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          Nhập tên tòa nhà hoặc chọn một địa điểm phổ biến bên dưới.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="space-y-2">
        <label htmlFor="input-destination-search" className="sr-only">
          Nhập tên nơi muốn đến tại Bệnh viện Bạch Mai
        </label>
        
        <div className="relative flex items-center">
          <div className="absolute left-4.5 text-slate-400 pointer-events-none">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </div>

          <input
            id="input-destination-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ví dụ: K1, A9, Viện Tim mạch…"
            className="w-full h-15 sm:h-16 pl-13 pr-28 bg-white border-2 border-slate-300 focus:border-cyan-700 rounded-2xl text-lg sm:text-xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-600/30 transition shadow-xs"
          />

          {/* Action buttons inside search bar: Clear & Voice */}
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                id="btn-clear-destination-search"
                onClick={() => setSearchQuery('')}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-600"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            <button
              id="btn-voice-search"
              onClick={handleToggleVoice}
              className={`h-11 px-3 rounded-xl font-bold text-sm flex items-center gap-1.5 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                isListening 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
              }`}
              aria-label={isListening ? 'Đang nghe giọng nói' : 'Nói tên nơi cần đến'}
              title="Nói tên nơi cần đến bằng giọng nói"
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span className="hidden sm:inline">Dừng</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 text-cyan-700" />
                  <span className="hidden sm:inline">Nói</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Voice Feedback Notification */}
        {voiceMessage && (
          <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-xl text-sm sm:text-base font-semibold text-cyan-900 flex items-center justify-between gap-2">
            <span>{voiceMessage}</span>
            <button
              onClick={() => setVoiceMessage(null)}
              className="text-cyan-700 hover:text-cyan-900 p-1"
              aria-label="Đóng thông báo giọng nói"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Results OR Default Popular Destinations */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-3 pt-1">
          <div className="text-base font-bold text-slate-700 flex items-center justify-between">
            <span>Kết quả tìm kiếm cho "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-sm font-semibold text-cyan-700 hover:underline"
            >
              Xem các địa điểm phổ biến
            </button>
          </div>

          {/* Case 1: Canteen query */}
          {typeof searchResults === 'object' && searchResults.isCanteen ? (
            <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-amber-950">
                    Chưa có dữ liệu xác minh vị trí căng tin trong phiên bản hiện tại.
                  </h3>
                  <p className="text-base text-amber-900 font-medium mt-1">
                    MedNav chỉ hiển thị các tòa nhà và khoa khám bệnh đã được xác thực trên sơ đồ chính thức.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-amber-200/80">
                <button
                  onClick={() => setSearchQuery('')}
                  className="h-13 px-4 bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 font-bold text-base rounded-xl transition cursor-pointer text-center"
                >
                  Xem danh sách địa điểm đã xác minh
                </button>
                <button
                  onClick={() => handleSelectByNodeId('node_k1_entrance')}
                  className="h-13 px-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-base rounded-xl transition cursor-pointer text-center"
                >
                  Chỉ đường đến Quầy tiếp đón K1
                </button>
              </div>
            </div>
          ) : /* Case 2: Matching results */
          Array.isArray(searchResults.items) && searchResults.items.length > 0 ? (
            <div className="space-y-3">
              {searchResults.items.map((node) => (
                <button
                  key={node.id}
                  onClick={() => onSelectDestination(node)}
                  className="w-full min-h-18 p-4 bg-white hover:bg-cyan-50/80 active:bg-cyan-100/90 border-2 border-slate-200 hover:border-cyan-600 rounded-2xl flex items-center justify-between gap-4 transition text-left cursor-pointer shadow-xs focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-cyan-700 text-white font-black text-lg flex items-center justify-center shrink-0">
                      {node.buildingId || 'BM'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-xl font-black text-slate-900 truncate">
                        {node.name}
                      </div>
                      <div className="text-sm sm:text-base text-slate-600 font-medium truncate mt-0.5">
                        {node.description || 'Khu vực khám & điều trị Bệnh viện Bạch Mai'}
                      </div>
                    </div>
                  </div>

                  <div className="h-11 px-4 bg-cyan-700 text-white font-bold text-base rounded-xl flex items-center gap-1.5 shrink-0">
                    <span>Chọn</span>
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Case 3: No results found */
            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-4 text-center">
              <div className="text-xl font-black text-slate-900">
                Chưa tìm thấy địa điểm này.
              </div>
              <p className="text-base text-slate-600 font-medium">
                Bác có thể kiểm tra lại tên tòa nhà hoặc chọn một trong các gợi ý dưới đây:
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="h-14 px-5 bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl transition cursor-pointer"
                >
                  Xem danh sách địa điểm
                </button>
                <button
                  onClick={() => handleSelectByNodeId('node_k1_entrance')}
                  className="h-14 px-5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-base rounded-2xl transition cursor-pointer"
                >
                  Chỉ đường đến Quầy tiếp đón K1
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Popular Destinations (Default View - 1 Single Clean Column) */
        <div className="space-y-4 pt-1">
          <div className="text-base sm:text-lg font-black text-slate-800">
            Địa điểm phổ biến
          </div>

          {/* 4 Primary Large Cards in 1 Column */}
          <div className="space-y-3">
            {popularDestinations.map((item) => (
              <button
                key={item.badge}
                id={`btn-popular-${item.badge.toLowerCase()}`}
                onClick={() => handleSelectByNodeId(item.nodeId)}
                className={`w-full min-h-18 p-4 rounded-2xl border-2 transition flex items-center justify-between gap-4 text-left cursor-pointer shadow-xs focus:outline-none focus:ring-4 focus:ring-cyan-600/30 ${item.color}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-13 h-13 rounded-2xl font-black text-lg flex items-center justify-center shrink-0 shadow-xs ${item.badgeColor}`}>
                    {item.badge}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl font-black leading-snug truncate">
                      {item.title}
                    </div>
                    <div className="text-sm sm:text-base font-medium opacity-90 truncate mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-slate-700 shrink-0">
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </div>
              </button>
            ))}
          </div>

          {/* Toggle Extended Buildings */}
          <div className="pt-2">
            <button
              id="btn-toggle-all-destinations"
              onClick={() => setShowAllBuildings(!showAllBuildings)}
              className="w-full h-14 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border border-slate-300 flex items-center justify-center gap-2 transition cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
            >
              <span>{showAllBuildings ? 'Thu gọn danh sách' : 'Xem thêm địa điểm khác'}</span>
              {showAllBuildings ? <ChevronUp className="w-5 h-5 stroke-[2.5]" /> : <ChevronDown className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

          {/* Extended List */}
          {showAllBuildings && (
            <div className="space-y-3 pt-2 animate-in fade-in duration-150">
              {extendedBuildings.map((b) => (
                <button
                  key={b.badge}
                  onClick={() => handleSelectByNodeId(b.nodeId)}
                  className="w-full min-h-16 p-3.5 bg-white hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-600 rounded-2xl flex items-center justify-between gap-3 text-left transition cursor-pointer shadow-2xs focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 text-white font-bold text-base flex items-center justify-center shrink-0">
                      {b.badge}
                    </div>
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
                        {b.title}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium truncate">
                        {b.desc}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Info Link */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600 font-medium">
        <span>Sơ đồ chính thức Bệnh viện Bạch Mai</span>
        <button
          onClick={onOpenDataInfo}
          className="text-cyan-800 font-bold hover:underline cursor-pointer"
        >
          Thông tin dữ liệu
        </button>
      </div>
    </div>
  );
};

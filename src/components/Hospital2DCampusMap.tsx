import React, { useState, useMemo, useRef } from 'react';
import { 
  BuildingId, 
  FloorId, 
  MapNode, 
  NavigationRoute, 
  RoutingProfile
} from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Clock, 
  X, 
  Sparkles, 
  Crosshair, 
  Layers, 
  Navigation, 
  Search,
  Building2,
  Car,
  Flame,
  Stethoscope,
  Info,
  ExternalLink,
  Footprints,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Hospital2DCampusMapProps {
  onSwitchToFloorMap: (buildingId: BuildingId, floorId?: FloorId) => void;
  startNode: MapNode | null;
  destinationNode: MapNode | null;
  onSelectStartNode: (node: MapNode) => void;
  onSelectDestinationNode: (node: MapNode) => void;
  activeRoute: NavigationRoute | null;
  routingProfile: RoutingProfile;
  language: 'vi' | 'en';
  onOpenAIAssistant?: () => void;
  onOpenEmergency?: () => void;
}

// Master Building Data based directly on the official Bach Mai Hospital signboard
interface CampusBlock {
  num: number | string;
  id: string;
  name: string;
  nameEn: string;
  category: 'clinical' | 'emergency' | 'admin' | 'service' | 'education' | 'neighbor';
  buildingId?: BuildingId; // linked indoor floor plan
  description: string;
  highlights: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  customShape?: 'polygon' | 'round_top' | 'comb';
  polygonPoints?: string;
  colorType: 'yellow' | 'red' | 'gray' | 'blue' | 'purple' | 'green';
  entranceX?: number;
  entranceY?: number;
  emergencyIcon?: boolean;
  pharmacyIcon?: boolean;
  cashierIcon?: boolean;
}

const MASTER_CAMPUS_BLOCKS: CampusBlock[] = [
  // 1: KHU NHÀ P (TÒA NHÀ VIỆT NHẬT) - Khối nhà vàng lớn trung tâm
  {
    num: 1,
    id: 'block_p_viet_nhat',
    name: 'Khu Nhà P (Tòa Nhà Việt - Nhật)',
    nameEn: 'Building P (Vietnam - Japan Center)',
    category: 'clinical',
    buildingId: 'P',
    description: 'Trung tâm khám chữa bệnh kỹ thuật cao hợp tác Việt - Nhật. Gồm phòng khám đa khoa, nội soi, chẩn đoán hình ảnh và các khoa lâm sàng chuyên sâu.',
    highlights: ['Khám Giáo Sư/Chuyên Gia', 'Trung tâm Nội Soi Tiêu Hóa', 'Xét nghiệm tự động', 'Nhà thuốc số 1'],
    x: 440,
    y: 430,
    width: 140,
    height: 200,
    polygonPoints: '440,430 500,430 500,510 580,510 580,630 450,630 450,540 440,540',
    colorType: 'yellow',
    entranceX: 470,
    entranceY: 630,
    cashierIcon: true,
    pharmacyIcon: true
  },
  // 2: TÒA NHÀ Q - TT UNG BƯỚU VÀ YHHN TRẺ EM
  {
    num: 2,
    id: 'block_q_onco',
    name: 'Tòa Nhà Q (TT Ung Bướu & YHHN Trẻ Em)',
    nameEn: 'Building Q (Oncology & Pediatric Nuclear Med)',
    category: 'clinical',
    buildingId: 'Q',
    description: 'Trung tâm điều trị ung bướu, xạ trị kỹ thuật cao và y học hạt nhân cho người lớn & trẻ em.',
    highlights: ['Máy xạ trị gia tốc TrueBeam', 'Khu hóa trị ban ngày', 'Y học hạt nhân Nhi khoa'],
    x: 520,
    y: 390,
    width: 60,
    height: 105,
    colorType: 'yellow',
    entranceX: 550,
    entranceY: 495
  },
  // 3: TÒA ĐIỀU HÀNH KỸ THUẬT (QMS - TDS.VN)
  {
    num: 3,
    id: 'block_3_admin_qms',
    name: 'Tòa Nhà Điều Hành Kỹ Thuật (QMS)',
    nameEn: 'Technical & Operational Center (QMS)',
    category: 'admin',
    description: 'Khu trung tâm điều phối hệ thống chỉ dẫn thông minh, giám sát kỹ thuật và công nghệ thông tin.',
    highlights: ['Điều phối tiếp đón QMS', 'Trung tâm máy chủ CNTT'],
    x: 470,
    y: 670,
    width: 55,
    height: 35,
    colorType: 'yellow'
  },
  // 4: KHU NHÀ KHÁM BỆNH
  {
    num: 4,
    id: 'block_4_outpatient',
    name: 'Khu Nhà Khám Bệnh (Đa Khoa Ngoại Trú)',
    nameEn: 'General Outpatient Clinic Building',
    category: 'clinical',
    buildingId: 'K1',
    description: 'Khu tiếp đón, đăng ký khám bảo hiểm y tế và khám theo yêu cầu các chuyên khoa tổng quát.',
    highlights: ['Đăng ký khám BHYT', 'Khám Nội, Ngoại, Sản, Nhi', 'Thu viện phí trung tâm'],
    x: 535,
    y: 668,
    width: 110,
    height: 68,
    colorType: 'yellow',
    entranceX: 580,
    entranceY: 668,
    cashierIcon: true
  },
  // 5: TRUNG TÂM Y HỌC HẠT NHÂN & UNG BƯỚU
  {
    num: 5,
    id: 'block_5_nuclear_med',
    name: 'Trung Tâm Y Học Hạt Nhân & Ung Bướu',
    nameEn: 'Center for Nuclear Medicine & Oncology',
    category: 'clinical',
    buildingId: 'H',
    description: 'Kỹ thuật chẩn đoán PET/CT, SPECT, điều trị I-131 và y học hạt nhân hiện đại hàng đầu cả nước.',
    highlights: ['Chụp PET/CT độ phân giải cao', 'Điều trị I-131 bệnh lý tuyến giáp'],
    x: 590,
    y: 555,
    width: 50,
    height: 95,
    colorType: 'yellow'
  },
  // A9: TÒA NHÀ A9 (TRUNG TÂM CẤP CỨU A9 24/7)
  {
    num: 22,
    id: 'block_22_a9_er',
    name: 'Tòa A9 (Trung Tâm Cấp Cứu A9 24/7)',
    nameEn: 'Building A9 (A9 Emergency Center 24/7)',
    category: 'emergency',
    buildingId: 'A9',
    description: 'Trung tâm Cấp Cứu A9 hoạt động 24/7 tiếp nhận mọi trường hợp cấp cứu khẩn cấp, nguy kịch. Hotline: 086 958 7707 và 115.',
    highlights: ['Tiếp nhận cấp cứu 24/7', 'Phân loại bệnh nhân Triage', 'Hồi sức cấp cứu ICU'],
    x: 375,
    y: 485,
    width: 25,
    height: 110,
    colorType: 'red',
    emergencyIcon: true,
    entranceX: 387,
    entranceY: 595,
    pharmacyIcon: true
  },
  // A10: TÒA NHÀ A10 (TRUNG TÂM ĐỘT QUỴ)
  {
    num: 'A10',
    id: 'block_a10_stroke',
    name: 'Tòa A10 (Trung Tâm Đột Quỵ)',
    nameEn: 'Building A10 (Stroke Center)',
    category: 'emergency',
    buildingId: 'A10',
    description: 'Trung tâm Đột quỵ Bệnh viện Bạch Mai, cấp cứu tiêu sợi huyết và can thiệp mạch não giờ vàng.',
    highlights: ['Can thiệp đột quỵ não khẩn cấp', 'Tiêu sợi huyết giờ vàng'],
    x: 375,
    y: 600,
    width: 25,
    height: 50,
    colorType: 'red',
    emergencyIcon: true,
    entranceX: 387,
    entranceY: 650
  },
  // K3: TÒA NHÀ K3 (TRUNG TÂM CHỐNG ĐỘC & DA LIỄU / BỎNG)
  {
    num: 'K3',
    id: 'block_k3_poison',
    name: 'Tòa K3 (Trung Tâm Chống Độc & Khoa Da Liễu / Bỏng)',
    nameEn: 'Building K3 (Poison Control & Dermatology / Burn)',
    category: 'emergency',
    buildingId: 'K3',
    description: 'Trung tâm Chống độc Quốc gia, Khoa Da liễu và Đơn vị Bỏng (ngay cạnh Cổng 1 đường Giải Phóng).',
    highlights: ['Trung tâm Chống độc Quốc gia', 'Khoa Da liễu', 'Đơn vị Bỏng'],
    x: 440,
    y: 650,
    width: 30,
    height: 60,
    colorType: 'red',
    emergencyIcon: true,
    entranceX: 455,
    entranceY: 710
  },
  // 19: VIỆN TIM MẠCH VIỆT NAM - NHÀ KHU C (Khối nhà chữ E màu vàng lớn)
  {
    num: 19,
    id: 'block_19_vietnam_cardio',
    name: 'Viện Tim Mạch Việt Nam (Nhà Khu C)',
    nameEn: 'Vietnam National Heart Institute (Block C)',
    category: 'clinical',
    buildingId: 'VTM',
    description: 'Viện chuyên khoa đầu ngành về tim mạch học, can thiệp tim mạch, phẫu thuật lồng ngực và hồi sức tim mạch.',
    highlights: ['Phòng can thiệp tim mạch Cathlab', 'Phẫu thuật tim hở', 'Điện sinh lý tim', 'Khám tim mạch chuyên gia'],
    x: 100,
    y: 380,
    width: 260,
    height: 180,
    customShape: 'comb',
    polygonPoints: '110,380 340,380 340,460 305,460 305,550 260,550 260,460 200,460 200,550 155,550 155,460 110,460',
    colorType: 'yellow',
    entranceX: 200,
    entranceY: 460,
    cashierIcon: true
  },
  // 20 & 21: KHU NHÀ HÀNH CHÍNH & TÒA A1
  {
    num: 21,
    id: 'block_21_admin',
    name: 'Khu Nhà Hành Chính Cũ & Ban Giám Đốc',
    nameEn: 'Old Administration Building & Directorate',
    category: 'admin',
    description: 'Văn phòng Ban Giám đốc, phòng Tổ chức cán bộ, Kế hoạch tổng hợp, Tài chính kế toán.',
    highlights: ['Văn phòng Ban Giám Đốc', 'Phòng Kế hoạch tổng hợp', 'Phòng Công tác xã hội'],
    x: 140,
    y: 575,
    width: 155,
    height: 40,
    colorType: 'yellow'
  },
  {
    num: 20,
    id: 'block_20_a1_sub',
    name: 'Nhà A1 (Khu Điều Trị Cũ)',
    nameEn: 'Building A1 Clinical Wing',
    category: 'clinical',
    description: 'Khu vực chuyên môn và lưu trữ hồ sơ bệnh án.',
    highlights: ['Lưu trữ hồ sơ', 'Phòng trực chuyên môn'],
    x: 140,
    y: 575,
    width: 35,
    height: 45,
    colorType: 'yellow'
  },
  // 24, 25, 26, 27, 28: KHU NHÀ A
  {
    num: 24,
    id: 'block_24_a_wing',
    name: 'Khu Nhà A (Khoa Điều Trị)',
    nameEn: 'Building A Treatment Wing',
    category: 'clinical',
    description: 'Các khoa điều trị nội trú, ngoại tổng hợp và chuyên khoa lẻ.',
    highlights: ['Điều trị nội trú', 'Thăm khám bệnh nhân'],
    x: 260,
    y: 650,
    width: 140,
    height: 80,
    polygonPoints: '260,650 310,650 310,620 345,620 345,680 400,680 400,725 260,725',
    colorType: 'yellow',
    emergencyIcon: true
  },
  // 16: TRUNG TÂM DINH DƯỠNG LÂM SÀNG
  {
    num: 16,
    id: 'block_16_nutrition',
    name: 'Trung Tâm Dinh Dưỡng Lâm Sàng',
    nameEn: 'Clinical Nutrition Center',
    category: 'clinical',
    description: 'Tư vấn chế độ ăn bệnh lý, cung cấp suất ăn dinh dưỡng điều trị cho bệnh nhân nội trú.',
    highlights: ['Khám tư vấn dinh dưỡng', 'Suất ăn bệnh lý chuyên sâu'],
    x: 362,
    y: 310,
    width: 45,
    height: 90,
    colorType: 'yellow'
  },
  // 11: TRUNG TÂM PHỤC HỒI CHỨC NĂNG (VÒM)
  {
    num: 11,
    id: 'block_11_rehab',
    name: 'Trung Tâm Phục Hồi Chức Năng',
    nameEn: 'Rehabilitation Center',
    category: 'clinical',
    description: 'Vật lý trị liệu, phục hồi chức năng vận động sau tai biến, sau phẫu thuật xương khớp và chấn thương sọ não.',
    highlights: ['Vật lý trị liệu', 'Phục hồi sau tai biến', 'Thủy trị liệu'],
    x: 175,
    y: 140,
    width: 70,
    height: 80,
    customShape: 'round_top',
    colorType: 'yellow'
  },
  // 12: KHOA TRUYỀN NHIỄM (BỆNH NHIỆT ĐỚI)
  {
    num: 12,
    id: 'block_12_infectious',
    name: 'Trung Tâm Bệnh Nhiệt Đới (Truyền Nhiễm)',
    nameEn: 'Center for Tropical Diseases',
    category: 'clinical',
    description: 'Điều trị các bệnh truyền nhiễm nguy hiểm, sốt xuất huyết, viêm gan virus, viêm màng não và cúm.',
    highlights: ['Phòng cách ly áp lực âm', 'Điều trị Viêm gan & HIV/AIDS'],
    x: 185,
    y: 270,
    width: 25,
    height: 80,
    colorType: 'yellow'
  },
  // 13: TRUNG TÂM ĐÀO TẠO VÀ CHỈ ĐẠO TUYẾN
  {
    num: 13,
    id: 'block_13_training',
    name: 'Trung Tâm Đào Tạo & Chỉ Đạo Tuyến (TDC)',
    nameEn: 'Training & Direction of Healthcare Activities',
    category: 'education',
    description: 'Trung tâm đào tạo y khoa liên tục, chuyển giao kỹ thuật cho tuyến dưới và hợp tác quốc tế.',
    highlights: ['Hội trường lớn', 'Phòng mô phỏng y khoa SimLab'],
    x: 230,
    y: 260,
    width: 30,
    height: 95,
    colorType: 'yellow'
  },
  // 14: TRƯỜNG CAO ĐẲNG Y TẾ BẠCH MAI
  {
    num: 14,
    id: 'block_14_college',
    name: 'Trường Cao Đẳng Y Tế Bạch Mai',
    nameEn: 'Bach Mai Medical College',
    category: 'education',
    description: 'Đào tạo cử nhân điều dưỡng, kỹ thuật viên xét nghiệm, kỹ thuật viên hình ảnh y học chất lượng cao.',
    highlights: ['Khu giảng đường thực hành', 'Thư viện y học'],
    x: 300,
    y: 180,
    width: 55,
    height: 50,
    colorType: 'yellow'
  },
  // 15: NHÀ LƯU TRÚ BỆNH NHÂN
  {
    num: 15,
    id: 'block_15_guest_house',
    name: 'Nhà Lưu Trú Bệnh Nhân & Người Nhà',
    nameEn: 'Patient & Family Dormitory',
    category: 'service',
    description: 'Cung cấp chỗ nghỉ qua đêm giá rẻ, sạch sẽ cho người nhà bệnh nhân ở xa đến điều trị.',
    highlights: ['Chỗ nghỉ qua đêm có điều hòa', 'Phòng tắm giặt tiện nghi'],
    x: 345,
    y: 240,
    width: 15,
    height: 70,
    colorType: 'yellow'
  },
  // 8: KHOA KIỂM SOÁT NHIỄM KHUẨN
  {
    num: 8,
    id: 'block_8_infection_control',
    name: 'Khoa Kiểm Soát Nhiễm Khuẩn',
    nameEn: 'Infection Control Department',
    category: 'service',
    description: 'Trung tâm khử khuẩn, tiệt trùng dụng cụ phẫu thuật và quản lý đồ vải y tế vô trùng.',
    highlights: ['Hệ thống tiệt trùng Plasma', 'Quản lý vô khuẩn toàn viện'],
    x: 435,
    y: 160,
    width: 125,
    height: 38,
    colorType: 'yellow'
  },
  // 9: NHÀ TANG LỄ & NHÀ CHỜ
  {
    num: 9,
    id: 'block_9_funeral',
    name: 'Nhà Tang Lễ & Nhà Chờ Bệnh Viện',
    nameEn: 'Hospital Funeral Home & Waiting Hall',
    category: 'service',
    description: 'Khu vực tổ chức hậu sự trang trọng và nhà chờ riêng biệt.',
    highlights: ['Nhà đại thể', 'Phòng viếng trang nghiêm'],
    x: 362,
    y: 105,
    width: 58,
    height: 125,
    colorType: 'purple'
  },
  // 10: VIỆN GIÁM ĐỊNH Y KHOA TW
  {
    num: 10,
    id: 'block_10_forensic',
    name: 'Viện Giám Định Y Khoa Trung Ương',
    nameEn: 'National Institute of Medical Assessment',
    category: 'admin',
    description: 'Giám định khả năng lao động, thương tật, tai nạn lao động và chính sách người có công.',
    highlights: ['Hội đồng giám định TW', 'Khám sức khỏe chuyên gia'],
    x: 260,
    y: 135,
    width: 100,
    height: 25,
    colorType: 'yellow'
  },
  // 6 & 7: NHÀ T1, T2, T3 (KHOA THẦN KINH - TÂM THẦN)
  {
    num: 7,
    id: 'block_7_t2_t3',
    name: 'Nhà T1, T2, T3 (Khoa Thần Kinh - Viện Sức Khỏe Tâm Thần)',
    nameEn: 'Buildings T1, T2, T3 (Neurology & Mental Health)',
    category: 'clinical',
    description: 'Chẩn đoán và điều trị bệnh lý thần kinh, rối loạn giấc ngủ, trầm cảm, sa sút trí tuệ và tâm thần.',
    highlights: ['Điện não đồ Video EEG', 'Trị liệu tâm lý chuyên sâu'],
    x: 565,
    y: 145,
    width: 100,
    height: 180,
    polygonPoints: '595,145 618,145 618,205 665,205 665,245 565,245 565,185 595,185',
    colorType: 'yellow'
  },
  // VIỆN SỨC KHỎE TÂM THẦN
  {
    num: 'TT',
    id: 'block_mental_health',
    name: 'Viện Sức Khỏe Tâm Thần',
    nameEn: 'National Institute of Mental Health',
    category: 'clinical',
    description: 'Đơn vị đầu ngành về sức khỏe tâm thần, tâm lý lâm sàng và phục hồi chức năng tâm thần.',
    highlights: ['Khám ngoại trú tâm lý', 'Phòng điều trị nội trú khép kín'],
    x: 685,
    y: 155,
    width: 50,
    height: 165,
    colorType: 'yellow'
  },
  // KHU NHÀ KỸ THUẬT & TRẠM ĐIỆN
  {
    num: 'KT',
    id: 'block_technical_building',
    name: 'Khu Nhà Kỹ Thuật & Trạm Điện',
    nameEn: 'Technical Wing & Power Substation',
    category: 'service',
    description: 'Hệ thống cung cấp oxy trung tâm, máy phát điện dự phòng và xử lý nước thải y tế.',
    highlights: ['Hệ thống khí y tế trung tâm', 'Trạm điện dự phòng 24/7'],
    x: 450,
    y: 240,
    width: 85,
    height: 105,
    colorType: 'purple'
  },
  // BỆNH VIỆN LIÊN KẾT: BV DA LIỄU, BV TMH, BV LÃO KHOA
  {
    num: 'DL',
    id: 'block_neighbor_dermatology',
    name: 'Bệnh Viện Da Liễu Trung Ương',
    nameEn: 'National Hospital of Dermatology',
    category: 'neighbor',
    description: 'Khuôn viên bệnh viện lân cận tiếp giáp ngõ Phương Mai.',
    highlights: ['Tiếp giáp Cổng 3 Phương Mai'],
    x: 735,
    y: 155,
    width: 70,
    height: 205,
    colorType: 'purple'
  },
  {
    num: 'LK',
    id: 'block_neighbor_geriatric',
    name: 'Bệnh Viện Lão Khoa Trung Ương & TMH TW',
    nameEn: 'National Geriatric & ENT Hospital',
    category: 'neighbor',
    description: 'Khuôn viên các viện chuyên khoa trung ương tiếp giáp.',
    highlights: ['Tiếp giáp đường Phương Mai'],
    x: 650,
    y: 385,
    width: 160,
    height: 270,
    colorType: 'purple'
  }
];

export const Hospital2DCampusMap: React.FC<Hospital2DCampusMapProps> = ({
  onSwitchToFloorMap,
  startNode,
  destinationNode,
  onSelectStartNode,
  onSelectDestinationNode,
  activeRoute,
  language
}) => {
  const [scale, setScale] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedBlock, setSelectedBlock] = useState<CampusBlock | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; dist: number; initialScale: number } | null>(null);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.interactive-card') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch-to-zoom
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-card') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('button')) return;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y });
      touchStartRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y, dist: 0, initialScale: scale };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      touchStartRef.current = { x: pan.x, y: pan.y, dist, initialScale: scale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && touchStartRef.current) {
      const t = e.touches[0];
      setPan({
        x: t.clientX - dragStart.x,
        y: t.clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchStartRef.current && touchStartRef.current.dist > 0) {
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      const factor = currentDist / touchStartRef.current.dist;
      const newScale = Math.min(Math.max(touchStartRef.current.initialScale * factor, 0.4), 2.4);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = null;
  };

  const handleResetView = () => {
    setScale(0.9);
    setPan({ x: 0, y: 0 });
    setSelectedBlock(null);
  };

  // Filter blocks
  const filteredBlocks = useMemo(() => {
    return MASTER_CAMPUS_BLOCKS.filter(block => {
      if (selectedCategory !== 'all' && block.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          block.name.toLowerCase().includes(q) ||
          block.nameEn.toLowerCase().includes(q) ||
          block.num.toString().includes(q) ||
          block.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div 
      ref={containerRef}
      id="hospital-master-2d-campus-map"
      className="relative w-full h-full min-h-[400px] bg-slate-100 flex flex-col overflow-hidden select-none cursor-grab active:cursor-grabbing font-sans touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= TOP FLOATING CONTROL BAR ================= */}
      <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 right-2 sm:right-3.5 z-30 flex flex-col gap-1.5 sm:gap-2 pointer-events-none">
        
        {/* Main Bar: Title + Search + Zoom */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-slate-200 shadow-sm pointer-events-auto">
          
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-[11px] sm:text-xs shadow-xs shrink-0">
              BM
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 truncate">
                <span className="truncate">SƠ ĐỒ TOÀN CẢNH BV BẠCH MAI</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300 shrink-0">
                  Toàn Cảnh 2D
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 hidden md:block">
                78 Giải Phóng & Phố Phương Mai • Nhấn vào từng khối nhà để xem chi tiết & chuyển sang sơ đồ từng tầng
              </p>
            </div>
          </div>

          {/* Right Tools: Search & Zoom */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 sm:left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm tòa nhà, khoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-6 sm:pl-7 pr-5 sm:pr-6 py-1 text-[11px] sm:text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl w-28 sm:w-48 focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-slate-800 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs p-0.5"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
              <button
                id="btn-campus-zoom-in"
                onClick={() => setScale(s => Math.min(s + 0.15, 2.4))}
                className="p-1 hover:bg-white rounded-lg text-slate-700 hover:text-emerald-700 transition cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-campus-zoom-out"
                onClick={() => setScale(s => Math.max(s - 0.15, 0.4))}
                className="p-1 hover:bg-white rounded-lg text-slate-700 hover:text-emerald-700 transition cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-campus-reset-view"
                onClick={handleResetView}
                className="p-1 hover:bg-white rounded-lg text-slate-700 hover:text-emerald-700 transition cursor-pointer"
                title="Đặt lại góc nhìn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5 pointer-events-auto no-scrollbar touch-pan-x">
          {[
            { id: 'all', label: 'Tất cả 28 khối nhà', icon: Building2 },
            { id: 'emergency', label: '🔴 Cấp Cứu A9', icon: Flame },
            { id: 'clinical', label: '🟡 Khám Bệnh & Tim Mạch', icon: Stethoscope },
            { id: 'admin', label: 'Nhà Điều Hành', icon: ShieldAlert },
            { id: 'service', label: 'Dịch Vụ & Nhà Ăn', icon: Info },
            { id: 'education', label: 'Trường CĐ Y', icon: Building2 },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-full border transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer shadow-2xs ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-white/90 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= CRISP 2D SVG VIEWPORT ================= */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center pt-8 pb-14">
        <div 
          className="transition-transform duration-75 ease-out select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Main 2D Campus SVG: 980 x 860 Coordinate Space (Direct Replica of Official Board) */}
          <svg
            width="980"
            height="860"
            viewBox="0 0 980 860"
            className="bg-white rounded-3xl border-4 border-slate-300 shadow-2xl overflow-hidden"
          >
            <defs>
              {/* Soft Grid for campus ground */}
              <pattern id="campus-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="0.6" />
              </pattern>

              {/* Railway Stripes Pattern */}
              <pattern id="railway-stripes" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="12" height="12" fill="#64748b" />
                <rect x="0" y="2" width="12" height="3" fill="#cbd5e1" />
                <rect x="0" y="7" width="12" height="3" fill="#cbd5e1" />
                <rect x="3" y="0" width="2" height="12" fill="#334155" />
                <rect x="9" y="0" width="2" height="12" fill="#334155" />
              </pattern>

              {/* Tree Canopy Pattern */}
              <pattern id="garden-trees-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="7" fill="#86efac" opacity="0.6" />
                <circle cx="12" cy="12" r="5" fill="#4ade80" opacity="0.8" />
              </pattern>

              {/* Shadow filter */}
              <filter id="campus-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.08" />
              </filter>

              {/* Red Glow for A9 & Active Pin */}
              <filter id="emergency-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Background Yard & Walkways */}
            <rect width="980" height="860" fill="#f8fafc" />
            <rect width="980" height="860" fill="url(#campus-grid-pattern)" />

            {/* Perimeter Hospital Campus Boundary Line */}
            <rect 
              x="20" 
              y="20" 
              width="940" 
              height="820" 
              rx="20" 
              fill="#ffffff" 
              stroke="#cbd5e1" 
              strokeWidth="2" 
            />

            {/* ================= ROADS & ENTRANCES ================= */}
            
            {/* 1. Phố Phương Mai (Right Side Street) */}
            <g id="street-phuong-mai">
              <rect x="830" y="100" width="70" height="580" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
              
              {/* Traffic Arrows */}
              <g transform="translate(865, 250)">
                <line x1="0" y1="20" x2="0" y2="-20" stroke="#0284c7" strokeWidth="2.5" />
                <polygon points="0,-25 -5,-15 5,-15" fill="#0284c7" />
              </g>
              <g transform="translate(865, 550)">
                <line x1="0" y1="20" x2="0" y2="-20" stroke="#0284c7" strokeWidth="2.5" />
                <polygon points="0,-25 -5,-15 5,-15" fill="#0284c7" />
              </g>

              {/* Gate 3 (Cổng 3 - Lối Vào Phương Mai) */}
              <g transform="translate(865, 410)" className="cursor-pointer">
                <rect x="-42" y="-22" width="84" height="44" rx="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="url(#campus-shadow)" />
                <text y="-8" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="bold">LỐI VÀO PHƯƠNG MAI</text>
                <text y="4" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="black">CỔNG SỐ 3</text>
                <text y="14" textAnchor="middle" fill="#64748b" fontSize="7">Phuong Mai Entrance</text>
                {/* Arrow pointing into hospital */}
                <polygon points="-50,0 -42,-6 -42,6" fill="#0284c7" />
              </g>
            </g>

            {/* 2. Đường Ray Xe Lửa (Railway) */}
            <rect x="70" y="748" width="770" height="12" fill="url(#railway-stripes)" rx="3" stroke="#475569" strokeWidth="1" />
            <text x="590" y="757" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black" letterSpacing="2">
              ĐƯỜNG RAY
            </text>

            {/* 3. Đường Giải Phóng (Bottom Main Street) */}
            <g id="street-giai-phong">
              <rect x="40" y="764" width="890" height="44" fill="#334155" rx="10" />
              <line x1="60" y1="786" x2="910" y2="786" stroke="#ffffff" strokeWidth="2" strokeDasharray="14 10" opacity="0.8" />
              
              {/* Street Label */}
              <text x="490" y="790" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black" letterSpacing="3">
                ĐƯỜNG GIẢI PHÓNG
              </text>
              
              {/* Traffic Arrows */}
              <polygon points="340,786 355,781 355,791" fill="#ffffff" />
              <polygon points="690,786 675,781 675,791" fill="#ffffff" />

              {/* BUS Stop Icon */}
              <g transform="translate(340, 775)">
                <rect x="-10" y="-8" width="20" height="14" rx="3" fill="#0284c7" />
                <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black">BUS</text>
              </g>
            </g>

            {/* 4. Gate 1 - Cổng Số 1 (Lối Vào Chính 78 Giải Phóng - Ô tô vào A9) */}
            <g id="gate-1-main-entry" transform="translate(480, 725)" className="cursor-pointer" onClick={() => {
              const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_1');
              if (node) onSelectStartNode?.(node);
            }}>
              {/* Blue Curved Arrow entering */}
              <path d="M 10 38 Q 10 18 -10 10" fill="none" stroke="#0284c7" strokeWidth="4" />
              <polygon points="-16,10 -8,5 -8,15" fill="#0284c7" />

              <rect x="-48" y="-12" width="96" height="34" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="url(#campus-shadow)" />
              <text y="-2" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="bold">LỐI VÀO CHÍNH (A9)</text>
              <text y="9" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="black">CỔNG SỐ 1</text>
              <text y="18" textAnchor="middle" fill="#64748b" fontSize="6.5">78 Giải Phóng</text>
            </g>

            {/* 5. Gate 2 - Cổng Số 2 (Lối Ra Ô Tô Trong Giờ Hành Chính - Giải Phóng) */}
            <g id="gate-2-exit-entry" transform="translate(210, 725)" className="cursor-pointer" onClick={() => {
              const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_2');
              if (node) onSelectStartNode?.(node);
            }}>
              {/* Blue Curved Arrow exiting */}
              <path d="M 5 5 Q 5 25 18 36" fill="none" stroke="#0284c7" strokeWidth="4" />
              <polygon points="22,40 12,35 20,27" fill="#0284c7" />

              <rect x="-44" y="-12" width="88" height="34" rx="8" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" filter="url(#campus-shadow)" />
              <text y="-2" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="bold">LỐI RA Ô TÔ (HÀNH CHÍNH)</text>
              <text y="9" textAnchor="middle" fill="#1e293b" fontSize="9.5" fontWeight="black">CỔNG SỐ 2</text>
              <text y="18" textAnchor="middle" fill="#64748b" fontSize="6.5">Giải Phóng (Exit)</text>
            </g>

            {/* 6. Gate 4 - Cổng Số 4 (Lối Vào K1 & K2 - Giải Phóng) */}
            <g id="gate-4-k1-entry" transform="translate(680, 725)" className="cursor-pointer" onClick={() => {
              const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_4');
              if (node) onSelectStartNode?.(node);
            }}>
              {/* Blue Curved Arrow entering */}
              <path d="M 10 38 Q 10 18 -10 10" fill="none" stroke="#0284c7" strokeWidth="4" />
              <polygon points="-16,10 -8,5 -8,15" fill="#0284c7" />

              <rect x="-48" y="-12" width="96" height="34" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="url(#campus-shadow)" />
              <text y="-2" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="bold">LỐI VÀO K1 - K2</text>
              <text y="9" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="black">CỔNG SỐ 4</text>
              <text y="18" textAnchor="middle" fill="#64748b" fontSize="6.5">Giải Phóng (K1/K2)</text>
            </g>

            {/* ================= BLUE PARKING LOTS & WATER FEATURES ================= */}
            
            {/* Central Lake / Courtyard (Light Blue Zone) */}
            <g id="central-water-pond" transform="translate(265, 205)">
              <rect width="55" height="195" rx="8" fill="#60a5fa" opacity="0.85" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="27" cy="115" r="14" fill="#ffffff" />
              <text x="27" y="120" textAnchor="middle" fill="#1d4ed8" fontSize="12" fontWeight="black">P</text>
              <text x="27" y="145" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">ĐỖ XE Ô TÔ</text>
            </g>

            {/* Left Gate 2 Parking (Light Blue Zone) */}
            <g id="west-parking-c" transform="translate(60, 415)">
              <rect width="45" height="115" rx="8" fill="#60a5fa" opacity="0.85" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="22" cy="55" r="12" fill="#ffffff" />
              <text x="22" y="60" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="black">P</text>
              <text x="22" y="76" textAnchor="middle" fill="#ffffff" fontSize="8">Ô TÔ</text>
            </g>

            {/* East Building Q Parking (Light Blue Zone) */}
            <g id="east-parking-q" transform="translate(595, 420)">
              <rect width="45" height="115" rx="8" fill="#60a5fa" opacity="0.85" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="22" cy="55" r="12" fill="#ffffff" />
              <text x="22" y="60" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="black">P</text>
              <text x="22" y="76" textAnchor="middle" fill="#ffffff" fontSize="8">Ô TÔ</text>
            </g>

            {/* Motorbike Parking near Gate 1 (Blue P with Scooter icon) */}
            <g id="motorbike-parking-gate1" transform="translate(635, 655)">
              <rect width="95" height="75" rx="8" fill="#60a5fa" opacity="0.9" stroke="#2563eb" strokeWidth="1.5" />
              <circle cx="35" cy="40" r="16" fill="#ffffff" />
              <text x="35" y="46" textAnchor="middle" fill="#1d4ed8" fontSize="14" fontWeight="black">P</text>
              <text x="68" y="44" fontSize="18">🛵</text>
              <text x="47" y="66" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">BÃI GỬI XE MÁY</text>
            </g>

            {/* Underground Water Tank (Bể nước - bottom left) */}
            <g id="underground-water-tank" transform="translate(185, 665)">
              <rect width="45" height="55" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="4" y="4" width="37" height="47" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
              <text x="22" y="32" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">BỂ NƯỚC</text>
            </g>

            {/* Garden Green Patches (Courtyards) */}
            <g id="garden-courtyard-trees">
              <rect x="135" y="500" width="35" height="45" rx="8" fill="url(#garden-trees-pattern)" />
              <rect x="225" y="500" width="35" height="45" rx="8" fill="url(#garden-trees-pattern)" />
              <rect x="325" y="480" width="35" height="70" rx="8" fill="url(#garden-trees-pattern)" />
              <rect x="425" y="330" width="20" height="60" rx="6" fill="url(#garden-trees-pattern)" />
              <rect x="620" y="210" width="40" height="50" rx="8" fill="url(#garden-trees-pattern)" />
            </g>

            {/* ================= ALL 28 MASTER BUILDINGS ================= */}
            {MASTER_CAMPUS_BLOCKS.map(block => {
              const isSelected = selectedBlock?.id === block.id;
              const isHovered = hoveredBlockId === block.id;

              // Color Schemes matching official signage
              let fill = '#fef08a'; // Official warm yellow
              let stroke = '#ca8a04';
              let textFill = '#713f12';
              let badgeFill = '#eab308';
              let badgeText = '#ffffff';

              if (block.colorType === 'red') {
                fill = '#dc2626'; // Vibrant Red for A9
                stroke = '#991b1b';
                textFill = '#ffffff';
                badgeFill = '#ffffff';
                badgeText = '#dc2626';
              } else if (block.colorType === 'purple') {
                fill = '#cbd5e1'; // Gray-purple for technical/neighbor
                stroke = '#64748b';
                textFill = '#1e293b';
                badgeFill = '#475569';
                badgeText = '#ffffff';
              }

              if (isSelected) {
                stroke = '#0284c7';
                fill = block.colorType === 'red' ? '#b91c1c' : '#fde047';
              }

              return (
                <g
                  key={block.id}
                  id={`campus-block-${block.id}`}
                  onClick={() => setSelectedBlock(block)}
                  onMouseEnter={() => setHoveredBlockId(block.id)}
                  onMouseLeave={() => setHoveredBlockId(null)}
                  className="cursor-pointer transition-all"
                  filter={block.colorType === 'red' ? 'url(#emergency-glow)' : 'url(#campus-shadow)'}
                >
                  {/* Shape Rendering */}
                  {block.polygonPoints ? (
                    <polygon
                      points={block.polygonPoints}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                      className="transition-all"
                    />
                  ) : block.customShape === 'round_top' ? (
                    <path
                      d={`M ${block.x} ${block.y + 35} A 35 35 0 0 1 ${block.x + block.width} ${block.y + 35} L ${block.x + block.width} ${block.y + block.height} L ${block.x} ${block.y + block.height} Z`}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                    />
                  ) : (
                    <rect
                      x={block.x}
                      y={block.y}
                      width={block.width}
                      height={block.height}
                      rx={6}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                      className="transition-all"
                    />
                  )}

                  {/* Circular Number Marker */}
                  <g transform={`translate(${block.x + (block.polygonPoints ? 20 : block.width / 2)}, ${block.y + (block.polygonPoints ? 22 : 18)})`}>
                    <circle
                      r="10"
                      fill={badgeFill}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      filter="url(#campus-shadow)"
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill={badgeText}
                      fontSize="9"
                      fontWeight="black"
                    >
                      {block.num}
                    </text>
                  </g>

                  {/* Block Title Text */}
                  {block.width > 40 && block.height > 30 && (
                    <text
                      x={block.x + block.width / 2}
                      y={block.y + (block.height > 60 ? 38 : 28)}
                      textAnchor="middle"
                      fill={textFill}
                      fontSize={block.id === 'block_22_a9_er' ? '8.5' : '8'}
                      fontWeight="bold"
                    >
                      {block.name.length > 20 ? block.name.slice(0, 18) + '…' : block.name}
                    </text>
                  )}

                  {/* Secondary Line for A9 & Large Blocks */}
                  {block.id === 'block_22_a9_er' && (
                    <g transform={`translate(${block.x + block.width / 2}, ${block.y + 70})`}>
                      <text y="0" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black">KHOA</text>
                      <text y="11" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black">CẤP CỨU</text>
                      <text y="22" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black">24/7</text>
                      <circle cx="0" cy="40" r="8" fill="#ffffff" />
                      <text cx="0" y="43.5" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="black">➕</text>
                    </g>
                  )}

                  {/* Red Cross icon for emergency rooms */}
                  {block.emergencyIcon && block.id !== 'block_22_a9_er' && (
                    <g transform={`translate(${block.x + block.width - 14}, ${block.y + 14})`}>
                      <circle r="7" fill="#dc2626" />
                      <text y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">➕</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* ================= OFFICIAL "YOU ARE HERE" (BẠN ĐANG Ở ĐÂY) ================= */}
            <g id="you-are-here-official-marker" transform="translate(438, 688)">
              {/* Pulsing Target Ring */}
              <circle r="14" fill="#dc2626" opacity="0.3" className="animate-ping" />
              <circle r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
              
              {/* Red Line pointing to badge */}
              <line x1="0" y1="0" x2="-35" y2="0" stroke="#dc2626" strokeWidth="2" />

              {/* Red Official Signboard Badge */}
              <g transform="translate(-105, -12)">
                <rect 
                  x="0" 
                  y="0" 
                  width="70" 
                  height="24" 
                  rx="6" 
                  fill="#ffffff" 
                  stroke="#dc2626" 
                  strokeWidth="2" 
                  filter="url(#campus-shadow)" 
                />
                <text x="35" y="15" textAnchor="middle" fill="#dc2626" fontSize="8.5" fontWeight="black">
                  BẠN ĐANG Ở ĐÂY
                </text>
              </g>
            </g>

            {/* ================= OFFICIAL BOTTOM GREEN LEGEND BAR ================= */}
            <g id="official-bottom-green-legend-bar" transform="translate(320, 818)">
              {/* Green Header */}
              <rect x="0" y="0" width="380" height="24" rx="6" fill="#15803d" />
              <text x="190" y="16" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black" letterSpacing="1">
                SƠ ĐỒ BỆNH VIỆN BẠCH MAI
              </text>
            </g>

            <g id="official-legend-items" transform="translate(20, 842)">
              <rect x="0" y="0" width="940" height="18" fill="#f0fdf4" rx="4" />
              
              <g transform="translate(40, 12)">
                <text fontSize="10">🚪</text>
                <text x="16" y="0" fill="#166534" fontSize="8.5" fontWeight="bold">Cổng ra vào</text>
              </g>

              <g transform="translate(180, 12)">
                <text fontSize="10">➕</text>
                <text x="16" y="0" fill="#b91c1c" fontSize="8.5" fontWeight="bold">Khoa cấp cứu (Đỏ)</text>
              </g>

              <g transform="translate(360, 12)">
                <text fontSize="10">🚹</text>
                <text x="16" y="0" fill="#166534" fontSize="8.5" fontWeight="bold">Điểm thu viện phí</text>
              </g>

              <g transform="translate(520, 12)">
                <text fontSize="10">🅿️</text>
                <text x="16" y="0" fill="#166534" fontSize="8.5" fontWeight="bold">Bãi đỗ xe (Ô tô, Xe máy)</text>
              </g>

              <g transform="translate(700, 12)">
                <text fontSize="10">💊</text>
                <text x="16" y="0" fill="#166534" fontSize="8.5" fontWeight="bold">Nhà thuốc</text>
              </g>

              <g transform="translate(820, 12)">
                <rect x="-4" y="-9" width="96" height="14" rx="3" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
                <text x="44" y="1" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="black">BẠN ĐANG Ở ĐÂY</text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* ================= SELECTED BUILDING POPUP / BOTTOM SHEET ================= */}
      <AnimatePresence>
        {selectedBlock && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="interactive-card absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 sm:w-96 z-40 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-2xl text-slate-800 max-h-[75vh] flex flex-col overflow-hidden"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

            <div className="flex items-start justify-between gap-2 mb-2 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {selectedBlock.num}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
                    {selectedBlock.category === 'emergency' 
                      ? '🚨 Cấp cứu 24/7' 
                      : selectedBlock.category === 'clinical' 
                      ? '🩺 Khám chữa bệnh' 
                      : selectedBlock.category === 'admin' 
                      ? '🏛️ Hành chính' 
                      : 'ℹ️ Dịch vụ & Hậu cần'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-1 leading-snug truncate">
                  {selectedBlock.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{selectedBlock.nameEn}</p>
              </div>

              <button
                id="btn-close-campus-block-modal"
                onClick={() => setSelectedBlock(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar space-y-2.5 flex-1 pr-0.5">
              <p className="text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 leading-relaxed">
                {selectedBlock.description}
              </p>

              {/* Highlights */}
              {selectedBlock.highlights && selectedBlock.highlights.length > 0 && (
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 block mb-1">Chức năng nổi bật:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedBlock.highlights.map((h, i) => (
                      <span key={i} className="text-[9px] sm:text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-lg">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1.5 sm:gap-2 pt-2 border-t border-slate-100 shrink-0 mt-2">
              {selectedBlock.buildingId && (
                <button
                  id="btn-view-indoor-floorplan"
                  onClick={() => {
                    onSwitchToFloorMap(selectedBlock.buildingId!, '1');
                  }}
                  className="w-full py-2 sm:py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer min-h-[38px]"
                >
                  <Layers className="w-4 h-4" />
                  <span>Xem sơ đồ từng tầng (Tòa {selectedBlock.buildingId})</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="btn-set-campus-start"
                  onClick={() => {
                    const matchNode = (selectedBlock.buildingId && MAP_NODES_DATA.find(n => n.buildingId === selectedBlock.buildingId)) || MAP_NODES_DATA[0];
                    onSelectStartNode(matchNode);
                    setSelectedBlock(null);
                  }}
                  className="flex-1 py-2 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Điểm xuất phát</span>
                </button>

                <button
                  id="btn-set-campus-dest"
                  onClick={() => {
                    const matchNode = (selectedBlock.buildingId && MAP_NODES_DATA.find(n => n.buildingId === selectedBlock.buildingId)) || MAP_NODES_DATA[1];
                    onSelectDestinationNode(matchNode);
                    setSelectedBlock(null);
                  }}
                  className="flex-1 py-2 px-2.5 sm:px-3 bg-cyan-50 hover:bg-cyan-100 active:scale-98 text-cyan-800 border border-cyan-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  <span className="truncate">Chỉ đường tới đây</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

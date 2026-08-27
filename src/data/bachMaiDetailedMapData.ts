import { Building, BuildingId, FloorId, MapEdge, MapNode, RoomDetails, ClinicalWorkflowPreset } from '../types';

/**
 * DETAILED MAP ARCHITECTURE FOR BỆNH VIỆN BẠCH MAI (HÀ NỘI)
 * Địa chỉ: 78 Đường Giải Phóng, Phương Mai, Đống Đa, Hà Nội
 * 
 * Mô hình 4 lớp:
 * 1. Data Layer: Graph Nodes, Edges, Audio Landmarks, Accessibility Metadata (width, steps, slope).
 * 2. Positioning Layer: PDR Simulation Coordinates, Map-Matching Anchors, QR Checkpoints.
 * 3. Routing Layer: Fastest, Wheelchair/Accessible (Avoid steps), Visually Impaired (Audio Cues), Emergency A9.
 * 4. Field Survey & Missing Data Registry: Danh mục các thông tin cần khảo sát và bổ sung thực địa.
 */

export interface BachMaiFieldSurveyNote {
  category: 'blueprint' | 'indoor_rf' | 'access_control' | 'elevator_dynamics' | 'tactile_acoustic' | 'clinical_workflow';
  titleVi: string;
  titleEn: string;
  status: 'missing_survey' | 'estimated' | 'verified';
  descriptionVi: string;
  descriptionEn: string;
  impactOnNavigation: string;
  recommendedAction: string;
}

export const BACH_MAI_FIELD_SURVEY_NOTES: BachMaiFieldSurveyNote[] = [
  {
    category: 'blueprint',
    titleVi: 'Bản vẽ Kiến trúc Hoàn công (As-Built CAD/Revit BIM)',
    titleEn: 'As-Built CAD/Revit BIM Architectural Blueprints',
    status: 'estimated',
    descriptionVi: 'Hiện tại sơ đồ phòng khám Tòa K1 (9 tầng), Tòa A9 Cấp cứu và Tòa Q Viện Tim Mạch được dựng dựa trên cấu trúc mặt bằng công khai và bảng phân khoa thực tế. Chưa có tọa độ kích thước chi tiết từng centimet của các vách ngăn phòng khám chuyên gia nhỏ và phòng thủ thuật.',
    descriptionEn: 'Currently mapped from public hospital floor directories and departmental layouts. Exact centimeter-level dimensions of individual specialist consultation rooms and procedure rooms require official CAD drawings.',
    impactOnNavigation: 'Sai số toạ độ mép phòng có thể dao động 1-2m nếu không có bản vẽ CAD chuẩn.',
    recommendedAction: 'Xin trích xuất bản vẽ mặt bằng kiến trúc từ Phòng Quản trị & Hạ tầng kỹ thuật Bệnh viện Bạch Mai.'
  },
  {
    category: 'indoor_rf',
    titleVi: 'Bản đồ Tín hiệu Sóng BLE Beacon & WiFi BSSID Indoor',
    titleEn: 'Indoor BLE Beacon & WiFi Fingerprinting Signal Map',
    status: 'missing_survey',
    descriptionVi: 'Chưa có dữ liệu phân bổ địa chỉ MAC BSSID của các điểm phát WiFi bệnh viện và chưa lắp đặt hệ thống iBeacon Bluetooth Low Energy tại các cột hành lang để hỗ trợ định vị tuyệt đối song song với PDR.',
    descriptionEn: 'Missing hospital enterprise WiFi BSSID fingerprinting data and BLE iBeacon deployment maps along main corridors.',
    impactOnNavigation: 'Thuật toán PDR hiện đang sử dụng cơ chế Dead Reckoning kết hợp Map-Matching và Checkpoint QR để triệt tiêu drift. Nếu có BLE, thời gian bắt vị trí ban đầu sẽ tự động 100%.',
    recommendedAction: 'Khảo sát đo cường độ trường sóng RSSI tại các sảnh chính Tòa K1, A9, Tòa Q và gắn mã định danh iBeacon mỗi 15-20m.'
  },
  {
    category: 'access_control',
    titleVi: 'Phân quyền Khu vực Vô trùng & Hạn chế Thân nhân (Sterile & Restricted Zones)',
    titleEn: 'Sterile Operating Theatres & Restricted Patient Zones',
    status: 'estimated',
    descriptionVi: 'Các khu vực như Phòng mổ can thiệp Tim mạch CathLab (Tầng 2 Tòa Q), Khoa Hồi sức Cấp cứu Đột quỵ (Tầng 2 Tòa A9), Khu pha chế thuốc Hóa trị xạ trị cấm thân nhân đi vào tự do mà cần thẻ kiểm soát ra vào RFID/Vân tay.',
    descriptionEn: 'Areas like Cardiology CathLab, Stroke ICU, and Chemotherapy compounding units require strict RFID keycard access.',
    impactOnNavigation: 'Cần thiết lập rào cản luồng định tuyến (Routing Barrier) để tránh dẫn người nhà bệnh nhân vào khu vực vô khuẩn phẫu thuật.',
    recommendedAction: 'Gắn cờ thuộc tính `isRestrictedZone: true` và cảnh báo giọng nói tự động khi người dùng tiến gần khu vực này.'
  },
  {
    category: 'elevator_dynamics',
    titleVi: 'Thời gian Chờ & Phân luồng Thang máy Giờ cao điểm',
    titleEn: 'Peak Hours Elevator Wait Time & Lift Allocation Rules',
    status: 'estimated',
    descriptionVi: 'Bệnh viện Bạch Mai có lưu lượng khám rất đông vào khung giờ 06:30 - 09:30 sáng. Một số thang máy tại Tòa K1 và Tòa Q được ưu tiên độc quyền cho xe đẩy cáng bệnh nhân và nhân viên y tế.',
    descriptionEn: 'Heavy elevator traffic between 6:30 - 9:30 AM. Certain elevator banks in K1 and Building Q are reserved exclusively for stretchers and staff.',
    impactOnNavigation: 'Thời gian định tuyến có thể tăng thêm 3-8 phút chờ thang máy trong giờ cao điểm.',
    recommendedAction: 'Bổ sung trọng số dynamic weighting cho elevator edges theo khung giờ trong ngày (Dynamic Traffic Time Cost).'
  },
  {
    category: 'tactile_acoustic',
    titleVi: 'Khảo sát Môi trường Âm học & Gờ dẫn hướng xúc giác (Tactile Paving)',
    titleEn: 'Tactile Ground Surface Indicators & Acoustic Ambient Survey',
    status: 'estimated',
    descriptionVi: 'Hệ thống gờ nổi xúc giác màu vàng cho người khiếm thị đã được lắp đặt tại sảnh Tòa K1 mới, nhưng lối đi ngoài trời kết nối giữa Tòa K1 sang Tòa A9 và Viện Tim Mạch chưa có gờ xúc giác đồng bộ.',
    descriptionEn: 'Tactile ground paving exists in the new K1 main lobby, but outdoor transitional paths to Building A9 and Cardiology Institute need verification.',
    impactOnNavigation: 'Ảnh hưởng trực tiếp đến chất lượng hồ sơ chỉ đường cho người khiếm thị (Visually Impaired Profile).',
    recommendedAction: 'Khảo sát thực địa vị trí chính xác của từng đoạn gờ xúc giác và các nguồn âm thanh cố định (tiếng chuông cửa tự động, loa phát thanh phát số thứ tự).'
  },
  {
    category: 'clinical_workflow',
    titleVi: 'Quy trình Luân chuyển Bệnh phẩm & Kết quả Xét nghiệm Tự động',
    titleEn: 'Pneumatic Tube & Automated Lab Results Delivery Timing',
    status: 'verified',
    descriptionVi: 'Hệ thống ống chuyển mẫu bệnh phẩm tự động (Pneumatic Tube System) đã hoạt động giữa Tòa K1 và Trung tâm Xét nghiệm, bệnh nhân chỉ cần lấy mẫu tại Tòa K1 Tầng 3 mà không cần tự mang mẫu sang tòa khác.',
    descriptionEn: 'Pneumatic tube transport system is operational between K1 Outpatient and Central Laboratory.',
    impactOnNavigation: 'Giảm bớt 2 chặng di chuyển không cần thiết cho bệnh nhân khi làm xét nghiệm máu.',
    recommendedAction: 'Tích hợp mốc nhắc việc tự động trên bản đồ: "Chờ kết quả xét nghiệm qua ứng dụng sau 45-60 phút".'
  }
];

// Danh sách các phòng ban chi tiết tại Bệnh viện Bạch Mai
export const BACH_MAI_ROOMS_DATA: RoomDetails[] = [
  // ================= TÒA K1: TRUNG TÂM KHÁM BỆNH ĐA KHOA (9 TẦNG) =================
  {
    id: 'bm_k1_101',
    name: 'Sảnh Đón Tiếp & Kiosk Đăng Ký Khám Tự Động K1',
    nameEn: 'K1 Main Welcome Lobby & Smart Self-Registration Kiosk',
    code: 'K1-101',
    category: 'administration',
    buildingId: 'A', // Mapped to Building A in core engine
    floorId: '1',
    description: 'Nơi đón tiếp bệnh nhân, quét CCCD gắn chip / VNeID lấy số thứ tự tự động, hướng dẫn luồng khám.',
    descriptionEn: 'Main reception lobby, smart self-service kiosk check-in with Chip-ID card / VNeID.',
    operatingHours: '06:00 - 17:00',
    commonSymptoms: ['đón tiếp', 'lấy số', 'đăng ký', 'cccd', 'vneid', 'kiosk', 'hỏi đường', 'bắt đầu'],
    color: '#0ea5e9'
  },
  {
    id: 'bm_k1_102',
    name: 'Khu Quầy Tiếp Nhận Bảo Hiểm Y Tế (BHYT) & Thu Viện Phí K1',
    nameEn: 'Health Insurance (BHYT) & Cashier Counter K1',
    code: 'K1-102',
    category: 'pharmacy_cashier',
    buildingId: 'A',
    floorId: '1',
    description: 'Xác thực thẻ BHYT, kiểm tra tuyến chuyển viện, thanh toán viện phí và tạm ứng viện phí.',
    descriptionEn: 'Health insurance verification, referral check, hospital fee payment & refund.',
    operatingHours: '06:30 - 17:00',
    commonSymptoms: ['bhyt', 'bảo hiểm', 'thanh toán', 'thu viện phí', 'đóng tiền', 'viện phí'],
    color: '#10b981'
  },
  {
    id: 'bm_k1_103',
    name: 'Nhà Thuốc Bệnh Viện Bạch Mai Số 1 (Tòa K1)',
    nameEn: 'Bach Mai Hospital Pharmacy No. 1 (Building K1)',
    code: 'K1-103',
    category: 'pharmacy_cashier',
    buildingId: 'A',
    floorId: '1',
    description: 'Cấp phát thuốc BHYT và bán thuốc theo đơn của bác sĩ Bạch Mai, tư vấn dùng thuốc an toàn.',
    descriptionEn: 'Dispensing insurance prescriptions and hospital pharmacy medications.',
    operatingHours: '06:30 - 18:30',
    commonSymptoms: ['mua thuốc', 'lấy thuốc', 'nhà thuốc', 'đơn thuốc', 'dược phẩm', 'pharmacy'],
    color: '#22c55e'
  },
  {
    id: 'bm_k1_201',
    name: 'Khoa Khám Chuyên Khoa Nội Chung & Tim Mạch Ngoại Trú',
    nameEn: 'General Internal Medicine & Outpatient Cardiology Clinic',
    code: 'K1-201',
    category: 'clinical',
    buildingId: 'A',
    floorId: '2',
    description: 'Khám các bệnh lý tim mạch ngoại trú, tăng huyết áp, bệnh mạch vành, kiểm tra sức khỏe tổng quát.',
    descriptionEn: 'Outpatient cardiology consultations, hypertension, coronary screening.',
    doctorInCharge: 'PGS.TS.BS. Nguyễn Thị Bạch Yến',
    operatingHours: '07:00 - 16:30',
    commonSymptoms: ['tức ngực', 'hồi hộp', 'tăng huyết áp', 'đo huyết áp', 'khám tim', 'tim mạch'],
    color: '#f43f5e'
  },
  {
    id: 'bm_k1_202',
    name: 'Phòng Đo Điện Tâm Đồ (ECG) & Siêu Âm Tim Doppler K1',
    nameEn: 'Electrocardiogram (ECG) & Doppler Echocardiography K1',
    code: 'K1-202',
    category: 'diagnostic',
    buildingId: 'A',
    floorId: '2',
    description: 'Ghi điện tâm đồ 12 chuyển đạo, siêu âm màu đánh giá chức năng van tim và cơ tim.',
    descriptionEn: '12-lead ECG recording, colour Doppler echocardiography.',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['điện tim', 'ecg', 'siêu âm tim', 'doppler', 'đo nhịp tim'],
    color: '#a855f7'
  },
  {
    id: 'bm_k1_301',
    name: 'Trung Tâm Lấy Máu & Tiếp Nhận Bệnh Phẩm Tự Động K1',
    nameEn: 'Automated Blood Collection & Specimen Intake Center K1',
    code: 'K1-301',
    category: 'diagnostic',
    buildingId: 'A',
    floorId: '3',
    description: 'Hệ thống lấy máu tự động dán barcode định danh, chuyển mẫu nhanh qua hệ thống ống khí nén.',
    descriptionEn: 'Automated barcode blood drawing & pneumatic tube transport system.',
    operatingHours: '06:00 - 17:00',
    commonSymptoms: ['xét nghiệm', 'lấy máu', 'thử máu', 'nước tiểu', 'sinh hóa', 'huyết học', 'lab'],
    color: '#e11d48'
  },
  {
    id: 'bm_k1_302',
    name: 'Khoa Khám Tiêu Hóa & Nội Tiết - Đái Tháo Đường',
    nameEn: 'Gastroenterology & Endocrinology / Diabetes Clinic',
    code: 'K1-302',
    category: 'clinical',
    buildingId: 'A',
    floorId: '3',
    description: 'Khám viêm loét dạ dày tá tràng, gan mật, đái tháo đường typ 1, typ 2, bệnh tuyến giáp.',
    descriptionEn: 'Specialist care for GI ulcers, hepatitis, diabetes management and thyroid disorders.',
    doctorInCharge: 'TS.BS. Nguyễn Khắc Đức',
    operatingHours: '07:00 - 16:30',
    commonSymptoms: ['đau dạ dày', 'tiểu đường', 'đái tháo đường', 'tuyến giáp', 'ợ chua', 'đau bụng', 'gan'],
    color: '#d97706'
  },
  {
    id: 'bm_k1_401',
    name: 'Khoa Khám Cơ Xương Khớp & Thần Kinh K1',
    nameEn: 'Rheumatology & Neurology Outpatient Clinic K1',
    code: 'K1-401',
    category: 'clinical',
    buildingId: 'A',
    floorId: '4',
    description: 'Khám thoái hóa khớp, viêm cột sống dính khớp, thoát vị đĩa đệm, đau đầu mãn tính, Parkinson.',
    descriptionEn: 'Arthritis, spinal disc herniation, chronic migraines, tremors and neurological disorders.',
    operatingHours: '07:00 - 16:30',
    commonSymptoms: ['đau khớp', 'đau lưng', 'thoát vị đĩa đệm', 'đau đầu', 'chóng mặt', 'tê bì chân tay', 'khớp'],
    color: '#8b5cf6'
  },
  {
    id: 'bm_k1_402',
    name: 'Phòng Chụp X-Quang Kỹ Thuật Số & Siêu Âm Bụng K1',
    nameEn: 'Digital Radiography (DR X-Ray) & Abdominal Ultrasound K1',
    code: 'K1-402',
    category: 'diagnostic',
    buildingId: 'A',
    floorId: '4',
    description: 'Chụp X-Quang tim phổi thẳng, xương khớp, siêu âm ổ bụng tổng quát độ phân giải cao.',
    descriptionEn: 'Digital chest/bone X-rays, high-resolution abdominal ultrasound scans.',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['chụp xquang', 'x-quang', 'siêu âm bụng', 'chụp phổi', 'chụp xương'],
    color: '#0284c7'
  },
  {
    id: 'bm_k1_501',
    name: 'Khoa Khám Tai Mũi Họng - Mắt - Răng Hàm Mặt',
    nameEn: 'ENT, Ophthalmology & Maxillofacial Outpatient Clinic',
    code: 'K1-501',
    category: 'clinical',
    buildingId: 'A',
    floorId: '5',
    description: 'Nội soi tai mũi họng ống mềm, đo khúc xạ và soi đáy mắt, khám răng sâu và nhổ răng khôn.',
    descriptionEn: 'Flexible video endoscopy for ENT, visual acuity tests, dental care.',
    operatingHours: '07:00 - 16:30',
    commonSymptoms: ['đau tai', 'viêm họng', 'ngạt mũi', 'mờ mắt', 'đau mắt', 'sâu răng', 'nhổ răng'],
    color: '#06b6d4'
  },

  // ================= TÒA A1 - A9: TRUNG TÂM CẤP CỨU A9 & ĐỘT QUỴ =================
  {
    id: 'bm_a9_100',
    name: 'Trung Tâm Cấp Cứu A9 - Sảnh Tiếp Nhận & Phân Luồng Triage 24/7',
    nameEn: 'A9 Emergency Center - 24/7 Intake & Patient Triage Area',
    code: 'A9-100',
    category: 'emergency',
    buildingId: 'B', // Mapped to Building B
    floorId: '1',
    description: 'Tiếp nhận hỏa tốc bệnh nhân cấp cứu, phân loại mức độ khẩn cấp (Đỏ - Vàng - Xanh) theo chuẩn quốc tế.',
    descriptionEn: 'Critical emergency admissions, international 3-tier triage (Red/Yellow/Green).',
    doctorInCharge: 'PGS.TS.BS. Nguyễn Văn Chi',
    operatingHours: '24/7 Khẩn Cấp',
    commonSymptoms: ['cấp cứu', 'bất tỉnh', 'khó thở dữ dội', 'tai nạn', 'chấn thương', 'nguy kịch', 'a9', 'sốc'],
    color: '#ef4444'
  },
  {
    id: 'bm_a9_101',
    name: 'Phòng Hồi Sức Cấp Cứu Đỏ (Red Resuscitation Zone)',
    nameEn: 'Red Zone - Critical Shock & Trauma Resuscitation',
    code: 'A9-101',
    category: 'emergency',
    buildingId: 'B',
    floorId: '1',
    description: 'Khu vực hồi sinh tim phổi nâng cao, đặt nội khí quản khẩn cấp, máy thở đa chức năng, sốc điện.',
    descriptionEn: 'Advanced cardiac life support, rapid sequence intubation, defibrillators.',
    operatingHours: '24/7 Khẩn Cấp',
    commonSymptoms: ['ngừng tim', 'hôn mê sâu', 'suy hô hấp cấp', 'sốc phản vệ'],
    color: '#dc2626'
  },
  {
    id: 'bm_a9_201',
    name: 'Trung Tâm Đột Quỵ Bạch Mai (Stroke Center)',
    nameEn: 'Bach Mai National Stroke Center',
    code: 'A9-201',
    category: 'clinical',
    buildingId: 'B',
    floorId: '2',
    description: 'Đơn vị chuyên sâu can thiệp tiêu sợi huyết giờ vàng, lấy huyết khối cơ học mạch não cấp.',
    descriptionEn: 'Golden-hour thrombolysis, mechanical thrombectomy, neuro-critical care.',
    doctorInCharge: 'PGS.TS.BS. Mai Duy Tôn',
    operatingHours: '24/7 Khẩn Cấp',
    commonSymptoms: ['đột quỵ', 'liệt nửa người', 'méo miệng', 'nói ngọng', 'tai biến mạch máu não', 'stroke'],
    color: '#b91c1c'
  },
  {
    id: 'bm_a9_301',
    name: 'Trung Tâm Chống Độc Quốc Gia Bạch Mai (Poison Control)',
    nameEn: 'National Poison Control Center Bach Mai',
    code: 'A9-301',
    category: 'clinical',
    buildingId: 'B',
    floorId: '3',
    description: 'Điều trị giải độc khẩn cấp ngộ độc thực phẩm, hóa chất bảo vệ thực vật, rắn độc cắn, ngộ độc thuốc.',
    descriptionEn: 'Specialized antidotes, hemodialysis for chemical/snake venom/drug intoxication.',
    doctorInCharge: 'TS.BS. Nguyễn Trung Nguyên',
    operatingHours: '24/7 Khẩn Cấp',
    commonSymptoms: ['ngộ độc', 'rắn cắn', 'uống nhầm thuốc', 'hóa chất', 'chống độc', 'say nấm'],
    color: '#ca8a04'
  },

  // ================= TÒA Q: VIỆN TIM MẠCH QUỐC GIA VIỆT NAM =================
  {
    id: 'bm_q_101',
    name: 'Sảnh Tiếp Nhận Viện Tim Mạch & Cấp Cứu Tim Mạch C1',
    nameEn: 'Cardiology Institute Reception & C1 Cardiac ER',
    code: 'Q-101',
    category: 'emergency',
    buildingId: 'C', // Mapped to Building C
    floorId: '1',
    description: 'Tiếp nhận bệnh nhân cấp cứu nhồi máu cơ tim, suy tim cấp, cơn đau thắt ngực không ổn định.',
    descriptionEn: 'Intake for acute myocardial infarction, acute heart failure, unstable angina.',
    doctorInCharge: 'PGS.TS.BS. Phạm Mạnh Hùng',
    operatingHours: '24/7 Khẩn Cấp',
    commonSymptoms: ['nhồi máu cơ tim', 'đau thắt ngực', 'khó thở khi nằm', 'cấp cứu tim', 'viện tim mạch'],
    color: '#e11d48'
  },
  {
    id: 'bm_q_201',
    name: 'Trung Tâm Can Thiệp Tim Mạch (CathLab 1 - 2 - 3)',
    nameEn: 'Cardiac Catheterization Laboratories (CathLab 1-3)',
    code: 'Q-201',
    category: 'surgical',
    buildingId: 'C',
    floorId: '2',
    description: 'Chụp động mạch vành qua da, nong và đặt Stent can thiệp, nong van hai lá bằng bóng, bít dù thông liên nhĩ.',
    descriptionEn: 'Percutaneous coronary intervention (PCI), stent placement, valvuloplasty.',
    operatingHours: '24/7 Can thiệp cấp cứu',
    commonSymptoms: ['đặt stent', 'nong mạch vành', 'can thiệp tim', 'cathlab', 'chụp mạch vành'],
    color: '#9333ea'
  },
  {
    id: 'bm_q_301',
    name: 'Khoa Phẫu Thuật Tim Mạch & Lồng Ngực - Hồi Sức Sau Mổ',
    nameEn: 'Cardiovascular & Thoracic Surgery - Post-Op ICU',
    code: 'Q-301',
    category: 'surgical',
    buildingId: 'C',
    floorId: '3',
    description: 'Mổ bắc cầu động mạch vành, thay van tim sinh học/cơ học, phẫu thuật quai động mạch chủ.',
    descriptionEn: 'Coronary artery bypass grafting (CABG), valve replacement, aortic surgery.',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['mổ tim', 'thay van tim', 'phẫu thuật lồng ngực', 'hồi sức tim mạch'],
    color: '#7c3aed'
  }
];

// Danh sách các Nodes định vị trên đồ thị Bệnh viện Bạch Mai
export const BACH_MAI_NODES_DATA: MapNode[] = [
  // --- TÒA K1: TẦNG 1 ---
  { id: 'node_bm_gate1', name: 'Cổng 1 - 78 Giải Phóng (Cổng Chính)', nameEn: 'Gate 1 - 78 Giai Phong Main Entrance', buildingId: 'A', floorId: '1', x: 120, y: 720, type: 'entrance', isAccessible: true, kioskCode: 'QR_BM_GATE_1' },
  { id: 'node_bm_k1_entrance', name: 'Sảnh Chính Tòa K1 Khám Bệnh', nameEn: 'K1 Main Entrance', buildingId: 'A', floorId: '1', x: 280, y: 550, type: 'entrance', isAccessible: true, kioskCode: 'QR_BM_K1_ENTRANCE' },
  { id: 'node_bm_k1_101', name: 'Sảnh Đón Tiếp & Kiosk Tự Động K1', nameEn: 'K1 Welcome Lobby & Kiosk', buildingId: 'A', floorId: '1', x: 400, y: 550, type: 'kiosk', roomId: 'bm_k1_101', isAccessible: true, kioskCode: 'QR_BM_K1_RECEPTION' },
  { id: 'node_bm_k1_102', name: 'Quầy BHYT & Thu Viện Phí K1', nameEn: 'Insurance & Cashier K1', buildingId: 'A', floorId: '1', x: 580, y: 550, type: 'cashier', roomId: 'bm_k1_102', isAccessible: true, kioskCode: 'QR_BM_K1_BHYT' },
  { id: 'node_bm_k1_103', name: 'Nhà Thuốc Bệnh Viện Số 1', nameEn: 'Pharmacy No. 1 K1', buildingId: 'A', floorId: '1', x: 750, y: 550, type: 'pharmacy', roomId: 'bm_k1_103', isAccessible: true, kioskCode: 'QR_BM_K1_PHARMACY' },
  { id: 'node_bm_k1_1_elev', name: 'Cụm Thang Máy Tòa K1 (Tầng 1)', nameEn: 'K1 Elevator Bank (1F)', buildingId: 'A', floorId: '1', x: 480, y: 400, type: 'elevator', isAccessible: true, kioskCode: 'QR_BM_K1_ELEV_1' },
  { id: 'node_bm_k1_1_stairs', name: 'Cầu Thang Bộ Tòa K1 (Tầng 1)', nameEn: 'K1 Stairs (1F)', buildingId: 'A', floorId: '1', x: 540, y: 400, type: 'stairs', isAccessible: false },

  // --- TÒA K1: TẦNG 2 ---
  { id: 'node_bm_k1_2_elev', name: 'Thang Máy Tòa K1 (Tầng 2)', nameEn: 'K1 Elevator (2F)', buildingId: 'A', floorId: '2', x: 480, y: 400, type: 'elevator', isAccessible: true, kioskCode: 'QR_BM_K1_ELEV_2' },
  { id: 'node_bm_k1_2_stairs', name: 'Thang Bộ Tòa K1 (Tầng 2)', nameEn: 'K1 Stairs (2F)', buildingId: 'A', floorId: '2', x: 540, y: 400, type: 'stairs', isAccessible: false },
  { id: 'node_bm_k1_201', name: 'Khám Nội Chung & Tim Mạch Ngoại Trú', nameEn: 'Internal Medicine & Cardiology Clinic', buildingId: 'A', floorId: '2', x: 300, y: 350, type: 'room', roomId: 'bm_k1_201', isAccessible: true },
  { id: 'node_bm_k1_202', name: 'Phòng Đo Điện Tim ECG & Siêu Âm Tim', nameEn: 'ECG & Echocardiography', buildingId: 'A', floorId: '2', x: 680, y: 350, type: 'room', roomId: 'bm_k1_202', isAccessible: true },
  { id: 'node_bm_k1_bridge_q', name: 'Cầu Nối Trên Cao Tòa K1 -> Viện Tim Mạch (Tòa Q)', nameEn: 'Skybridge K1 to Cardiology Institute', buildingId: 'A', floorId: '2', x: 880, y: 400, type: 'skybridge', isAccessible: true, kioskCode: 'QR_BM_BRIDGE_K1_Q' },

  // --- TÒA K1: TẦNG 3 ---
  { id: 'node_bm_k1_3_elev', name: 'Thang Máy Tòa K1 (Tầng 3)', nameEn: 'K1 Elevator (3F)', buildingId: 'A', floorId: '3', x: 480, y: 400, type: 'elevator', isAccessible: true, kioskCode: 'QR_BM_K1_ELEV_3' },
  { id: 'node_bm_k1_3_stairs', name: 'Thang Bộ Tòa K1 (Tầng 3)', nameEn: 'K1 Stairs (3F)', buildingId: 'A', floorId: '3', x: 540, y: 400, type: 'stairs', isAccessible: false },
  { id: 'node_bm_k1_301', name: 'Khu Lấy Máu & Xét Nghiệm Tự Động K1', nameEn: 'Automated Blood Test Center K1', buildingId: 'A', floorId: '3', x: 320, y: 320, type: 'lab', roomId: 'bm_k1_301', isAccessible: true, kioskCode: 'QR_BM_K1_LAB' },
  { id: 'node_bm_k1_302', name: 'Khoa Khám Tiêu Hóa & Nội Tiết', nameEn: 'Gastroenterology & Diabetes', buildingId: 'A', floorId: '3', x: 650, y: 320, type: 'room', roomId: 'bm_k1_302', isAccessible: true },

  // --- TÒA A9: TRUNG TÂM CẤP CỨU & ĐỘT QUỴ (TÒA B) ---
  { id: 'node_bm_a9_gate2', name: 'Cổng 2 - Cổng Ưu Tiên Xe Cấp Cứu A9', nameEn: 'Gate 2 - A9 Ambulance Gate', buildingId: 'B', floorId: '1', x: 120, y: 280, type: 'entrance', isAccessible: true, kioskCode: 'QR_BM_GATE_A9' },
  { id: 'node_bm_a9_100', name: 'Sảnh Tiếp Nhận Cấp Cứu A9 & Triage', nameEn: 'A9 Emergency Intake & Triage', buildingId: 'B', floorId: '1', x: 320, y: 280, type: 'emergency', roomId: 'bm_a9_100', isAccessible: true, kioskCode: 'QR_BM_A9_TRIAGE' },
  { id: 'node_bm_a9_101', name: 'Phòng Hồi Sức Cấp Cứu Đỏ (Red Zone)', nameEn: 'Red Zone Shock Resuscitation', buildingId: 'B', floorId: '1', x: 520, y: 280, type: 'emergency', roomId: 'bm_a9_101', isAccessible: true },
  { id: 'node_bm_a9_1_elev', name: 'Thang Máy Cấp Cứu Tòa A9 (Tầng 1)', nameEn: 'A9 ER Elevator (1F)', buildingId: 'B', floorId: '1', x: 620, y: 280, type: 'elevator', isAccessible: true },
  
  { id: 'node_bm_a9_2_elev', name: 'Thang Máy Tòa A9 (Tầng 2)', nameEn: 'A9 Elevator (2F)', buildingId: 'B', floorId: '2', x: 620, y: 280, type: 'elevator', isAccessible: true },
  { id: 'node_bm_a9_201', name: 'Trung Tâm Đột Quỵ Bạch Mai (Stroke Center)', nameEn: 'Stroke Center A9 (2F)', buildingId: 'B', floorId: '2', x: 350, y: 280, type: 'room', roomId: 'bm_a9_201', isAccessible: true, kioskCode: 'QR_BM_STROKE_CENTER' },

  // --- TÒA Q: VIỆN TIM MẠCH (TÒA C) ---
  { id: 'node_bm_q_101', name: 'Sảnh Đón Tiếp & Cấp Cứu Tim Mạch C1', nameEn: 'Cardiology Intake & C1 ER', buildingId: 'C', floorId: '1', x: 450, y: 600, type: 'emergency', roomId: 'bm_q_101', isAccessible: true, kioskCode: 'QR_BM_Q_HALL' },
  { id: 'node_bm_q_1_elev', name: 'Thang Máy Viện Tim Mạch (Tầng 1)', nameEn: 'Cardiology Elevator (1F)', buildingId: 'C', floorId: '1', x: 600, y: 600, type: 'elevator', isAccessible: true },
  { id: 'node_bm_q_2_elev', name: 'Thang Máy Viện Tim Mạch (Tầng 2)', nameEn: 'Cardiology Elevator (2F)', buildingId: 'C', floorId: '2', x: 600, y: 600, type: 'elevator', isAccessible: true },
  { id: 'node_bm_q_201', name: 'Phòng Can Thiệp Mạch Vành CathLab (1-3)', nameEn: 'CathLab 1-3 Coronary Intervention', buildingId: 'C', floorId: '2', x: 400, y: 600, type: 'room', roomId: 'bm_q_201', isAccessible: true, kioskCode: 'QR_BM_Q_CATHLAB' },
  { id: 'node_bm_q_bridge_k1', name: 'Đầu Cầu Nối Tòa Q sang Tòa K1', nameEn: 'Skybridge Q to K1', buildingId: 'C', floorId: '2', x: 200, y: 600, type: 'skybridge', isAccessible: true }
];

// Danh sách các Cạnh (Edges) đồ thị đi kèm Metadata 4 lớp cho Bệnh viện Bạch Mai
export const BACH_MAI_EDGES_DATA: MapEdge[] = [
  // Luồng từ Cổng 1 Giải Phóng vào Sảnh K1
  { 
    fromNodeId: 'node_bm_gate1', 
    toNodeId: 'node_bm_k1_entrance', 
    distance: 35, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 4.5, 
    audioLandmarkVi: 'Đi thẳng theo lối lát đá có gờ xúc giác từ Cổng 1 Giải Phóng vào sảnh kính Tòa K1', 
    audioLandmarkEn: 'Follow tactile path from Gate 1 to K1 glass entrance' 
  },
  { 
    fromNodeId: 'node_bm_k1_entrance', 
    toNodeId: 'node_bm_k1_101', 
    distance: 12, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.8, 
    audioLandmarkVi: 'Nghe tiếng máy phát số tự động Kiosk và quầy hướng dẫn sảnh K1', 
    audioLandmarkEn: 'Hear auto-kiosk beeps and guidance desk' 
  },
  { 
    fromNodeId: 'node_bm_k1_101', 
    toNodeId: 'node_bm_k1_102', 
    distance: 18, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.5, 
    audioLandmarkVi: 'Quầy tiếp nhận BHYT và thu viện phí phía tay phải', 
    audioLandmarkEn: 'BHYT and cashier counters on the right' 
  },
  { 
    fromNodeId: 'node_bm_k1_102', 
    toNodeId: 'node_bm_k1_103', 
    distance: 20, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.2, 
    audioLandmarkVi: 'Nhà thuốc bệnh viện số 1 ở cuối sảnh Tầng 1 Tòa K1', 
    audioLandmarkEn: 'Hospital pharmacy No. 1 at end of K1 corridor' 
  },
  { 
    fromNodeId: 'node_bm_k1_101', 
    toNodeId: 'node_bm_k1_1_elev', 
    distance: 15, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Cụm thang máy trung tâm Tòa K1 phát chuông ding-dong khi mở cửa', 
    audioLandmarkEn: 'Central elevator bank with acoustic chime' 
  },
  { 
    fromNodeId: 'node_bm_k1_1_elev', 
    toNodeId: 'node_bm_k1_1_stairs', 
    distance: 6, 
    type: 'walk', 
    isAccessible: false, 
    hasSteps: true, 
    widthMeters: 2.0, 
    audioLandmarkVi: 'Cầu thang bộ có tay vịn kim loại cạnh thang máy K1' 
  },

  // Liên kết dọc thang máy Tòa K1
  { 
    fromNodeId: 'node_bm_k1_1_elev', 
    toNodeId: 'node_bm_k1_2_elev', 
    distance: 4, 
    type: 'elevator', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Thang máy K1 di chuyển từ Tầng 1 lên Tầng 2' 
  },
  { 
    fromNodeId: 'node_bm_k1_2_elev', 
    toNodeId: 'node_bm_k1_3_elev', 
    distance: 4, 
    type: 'elevator', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Thang máy K1 di chuyển từ Tầng 2 lên Tầng 3' 
  },

  // Tầng 2 Tòa K1
  { 
    fromNodeId: 'node_bm_k1_2_elev', 
    toNodeId: 'node_bm_k1_201', 
    distance: 16, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 2.8, 
    audioLandmarkVi: 'Hành lang dẫn vào Khoa Khám Tim Mạch Ngoại Trú K1' 
  },
  { 
    fromNodeId: 'node_bm_k1_2_elev', 
    toNodeId: 'node_bm_k1_202', 
    distance: 18, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 2.8, 
    audioLandmarkVi: 'Phòng đo điện tâm đồ ECG và siêu âm tim K1 phía tay phải' 
  },
  { 
    fromNodeId: 'node_bm_k1_2_elev', 
    toNodeId: 'node_bm_k1_bridge_q', 
    distance: 30, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.2, 
    audioLandmarkVi: 'Cầu vượt trên cao có mái che nối từ Tòa K1 sang Viện Tim Mạch Tòa Q' 
  },
  { 
    fromNodeId: 'node_bm_k1_bridge_q', 
    toNodeId: 'node_bm_q_bridge_k1', 
    distance: 25, 
    type: 'skybridge', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Di chuyển qua cầu vượt kính trên cao sang Tòa Q' 
  },
  { 
    fromNodeId: 'node_bm_q_bridge_k1', 
    toNodeId: 'node_bm_q_2_elev', 
    distance: 20, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 2.8, 
    audioLandmarkVi: 'Sảnh thang máy Tầng 2 Viện Tim Mạch' 
  },
  { 
    fromNodeId: 'node_bm_q_2_elev', 
    toNodeId: 'node_bm_q_201', 
    distance: 18, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 2.8, 
    audioLandmarkVi: 'Khu Can Thiệp Tim Mạch CathLab (Khu vực vô khuẩn)' 
  },

  // Tầng 3 Tòa K1 (Lấy máu xét nghiệm)
  { 
    fromNodeId: 'node_bm_k1_3_elev', 
    toNodeId: 'node_bm_k1_301', 
    distance: 15, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Trung tâm lấy máu và xét nghiệm tự động có tiếng loa gọi số tự động' 
  },
  { 
    fromNodeId: 'node_bm_k1_3_elev', 
    toNodeId: 'node_bm_k1_302', 
    distance: 18, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 2.8, 
    audioLandmarkVi: 'Phòng khám Tiêu hóa và Nội tiết đái tháo đường' 
  },

  // Cấp Cứu A9
  { 
    fromNodeId: 'node_bm_a9_gate2', 
    toNodeId: 'node_bm_a9_100', 
    distance: 20, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 4.5, 
    audioLandmarkVi: 'Luồng hỏa tốc xe cấp cứu vào sảnh đón tiếp Triage A9' 
  },
  { 
    fromNodeId: 'node_bm_a9_100', 
    toNodeId: 'node_bm_a9_101', 
    distance: 18, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.5, 
    audioLandmarkVi: 'Phòng Hồi sức Cấp cứu Đỏ (Red Zone) có đèn tín hiệu ưu tiên' 
  },
  { 
    fromNodeId: 'node_bm_a9_100', 
    toNodeId: 'node_bm_a9_1_elev', 
    distance: 16, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Thang máy chuyên dụng cấp cứu Tòa A9' 
  },
  { 
    fromNodeId: 'node_bm_a9_1_elev', 
    toNodeId: 'node_bm_a9_2_elev', 
    distance: 4, 
    type: 'elevator', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.2, 
    audioLandmarkVi: 'Thang máy chuyển bệnh nhân lên Trung tâm Đột quỵ Tầng 2 A9' 
  },
  { 
    fromNodeId: 'node_bm_a9_2_elev', 
    toNodeId: 'node_bm_a9_201', 
    distance: 15, 
    type: 'walk', 
    isAccessible: true, 
    hasSteps: false, 
    widthMeters: 3.0, 
    audioLandmarkVi: 'Cửa tự động dẫn vào Trung Tâm Đột Quỵ Bạch Mai' 
  }
];

// Presets quy trình lâm sàng mẫu tại Bệnh Viện Bạch Mai
export const BACH_MAI_WORKFLOW_PRESETS: ClinicalWorkflowPreset[] = [
  {
    id: 'bm_wf_cardiology_full',
    titleVi: 'Khám Tim Mạch Chuyên Sâu Bạch Mai',
    titleEn: 'Comprehensive Cardiology Examination (Bach Mai)',
    descriptionVi: 'Quy trình chuẩn: Đăng ký Kiosk K1 -> Khám lâm sàng Tim mạch -> Đo điện tim & Siêu âm Doppler -> Lấy máu xét nghiệm -> Nhận thuốc Nhà thuốc BV.',
    descriptionEn: 'Full workflow: Check-in Kiosk -> Cardiology consult -> ECG & Doppler echo -> Blood test -> Pharmacy.',
    category: 'cardiology',
    estimatedTimeMin: 75,
    stopRoomIds: ['bm_k1_101', 'bm_k1_201', 'bm_k1_202', 'bm_k1_301', 'bm_k1_103']
  },
  {
    id: 'bm_wf_stroke_emergency',
    titleVi: 'Luồng Cấp Cứu Đột Quỵ Giờ Vàng (A9 -> Can Thiệp)',
    titleEn: 'Golden-Hour Acute Stroke Emergency Path',
    descriptionVi: 'Tiếp nhận Cổng 2 A9 -> Phân luồng Triage Cấp cứu -> Chụp CT mạch não khẩn cấp -> Trung tâm Đột quỵ A9 tiêu sợi huyết.',
    descriptionEn: 'Direct ambulance intake -> Triage -> Emergency CT angiography -> Stroke Center thrombolysis.',
    category: 'emergency',
    estimatedTimeMin: 15,
    stopRoomIds: ['bm_a9_100', 'bm_a9_101', 'bm_a9_201']
  },
  {
    id: 'bm_wf_gi_endoscopy',
    titleVi: 'Khám & Tầm Soát Tiêu Hóa - Gan Mật',
    titleEn: 'Gastroenterology & Liver Screening Workflow',
    descriptionVi: 'Đăng ký K1 -> Khám Tiêu hóa Tầng 3 -> Lấy máu chức năng gan -> Siêu âm ổ bụng Tầng 4 -> Mua thuốc BHYT.',
    descriptionEn: 'K1 registration -> GI clinic -> Liver enzyme lab -> Abdominal ultrasound -> Pharmacy.',
    category: 'general',
    estimatedTimeMin: 60,
    stopRoomIds: ['bm_k1_101', 'bm_k1_302', 'bm_k1_301', 'bm_k1_402', 'bm_k1_103']
  }
];

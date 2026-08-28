import { MapNode } from '../../types';

export const BACH_MAI_NODES: MapNode[] = [
  // ================= CÁC CỔNG BỆNH VIỆN BẠCH MAI =================
  {
    id: 'node_gate_4',
    name: 'Cổng số 4 (Đường Giải Phóng - Lối vào K1, K2)',
    nameEn: 'Gate 4 (Giai Phong St - Entrance to K1, K2)',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 280,
    y: 740,
    type: 'gate',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_gate_2',
    name: 'Cổng số 2 (Đường Giải Phóng - Lối ra ô tô)',
    nameEn: 'Gate 2 (Giai Phong St - Vehicle Exit)',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 480,
    y: 740,
    type: 'gate',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_gate_1',
    name: 'Cổng số 1 (78 Giải Phóng - Vào K3, A9, A10)',
    nameEn: 'Gate 1 (78 Giai Phong St - Main Entrance)',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 680,
    y: 740,
    type: 'gate',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_gate_3',
    name: 'Cổng số 3 (Đường Phương Mai - Vào T1-T6, F, Q, H)',
    nameEn: 'Gate 3 (Phuong Mai St - Gate to T1-T6, F, Q, H)',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 900,
    y: 440,
    type: 'gate',
    isAccessible: true,
    verificationStatus: 'verified'
  },

  // ================= ĐIỂM TRỤC GIAO THÔNG NGOÀI TRỜI (OUTDOOR PATHWAYS) =================
  {
    id: 'node_path_giai_phong_south',
    name: 'Trục đường Giải Phóng (Phía trước cổng)',
    nameEn: 'Giai Phong Road Pathway',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 480,
    y: 710,
    type: 'corridor',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_path_junction_k1_k2',
    name: 'Lối vào cụm K1 & K2',
    nameEn: 'Path to K1 & K2 Complex',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 280,
    y: 650,
    type: 'corridor',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_path_junction_a9_k3',
    name: 'Ngã ba trục Cổng 1 (Vào K3, A9, A10)',
    nameEn: 'Gate 1 Internal Pathway Junction',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 680,
    y: 640,
    type: 'corridor',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_path_central_axis',
    name: 'Trục đường trung tâm khuôn viên',
    nameEn: 'Central Campus Pathway Axis',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 480,
    y: 480,
    type: 'corridor',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_path_phuong_mai_east',
    name: 'Trục đường nội bộ phía Phương Mai',
    nameEn: 'Phuong Mai Internal Pathway Axis',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 820,
    y: 440,
    type: 'corridor',
    isAccessible: true,
    verificationStatus: 'verified'
  },
  {
    id: 'node_path_north_west',
    name: 'Trục đường phía Tây Bắc (Khu D2-D6 & E)',
    nameEn: 'North-West Campus Axis',
    buildingId: 'OUTDOOR',
    floorId: 'G',
    x: 320,
    y: 280,
    type: 'corridor',
    isAccessible: true,
    verificationStatus: 'verified'
  },

  // ================= TÒA A9: TRUNG TÂM CẤP CỨU A9 (CHÍNH THỨC) =================
  {
    id: 'node_a9_emergency_entrance',
    name: 'Trung Tâm Cấp Cứu A9 - Lối Vào 24/7',
    nameEn: 'Building A9 - Emergency Entrance 24/7',
    buildingId: 'A9',
    x: 580,
    y: 560,
    type: 'emergency',
    roomId: 'dept_a9_emergency',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA A10: TRUNG TÂM ĐỘT QUỴ =================
  {
    id: 'node_a10_stroke_entrance',
    name: 'Tòa A10 - Trung Tâm Đột Quỵ',
    nameEn: 'Building A10 - Stroke Center',
    buildingId: 'A10',
    x: 580,
    y: 490,
    type: 'emergency',
    roomId: 'dept_stroke_a10',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA A11: HỘI TRƯỜNG QUỐC TẾ & HIẾN MÁU =================
  {
    id: 'node_a11_hall_entrance',
    name: 'Tòa A11 - Hội Trường Quốc Tế & Trạm Hiến Máu',
    nameEn: 'Building A11 - International Hall & Blood Donation',
    buildingId: 'A11',
    x: 580,
    y: 420,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA K3: TRUNG TÂM CHỐNG ĐỘC & DA LIỄU / BỎNG =================
  {
    id: 'node_k3_poison_entrance',
    name: 'Tòa K3 - Trung Tâm Chống Độc Quốc Gia',
    nameEn: 'Building K3 - Poison Control Center',
    buildingId: 'K3',
    x: 660,
    y: 620,
    type: 'emergency',
    roomId: 'dept_poison_k3',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k3_derma_entrance',
    name: 'Tòa K3 - Khoa Da Liễu & Bỏng',
    nameEn: 'Building K3 - Dermatology & Burn Unit',
    buildingId: 'K3',
    x: 690,
    y: 620,
    type: 'room',
    roomId: 'dept_derma_k3',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA K1: TRUNG TÂM KHÁM BỆNH & THEO YÊU CẦU =================
  {
    id: 'node_k1_entrance',
    name: 'Tòa K1 - Sảnh Đón Tiếp Chính (Vào từ Cổng 4)',
    nameEn: 'Building K1 - Main Entrance (Via Gate 4)',
    buildingId: 'K1',
    x: 280,
    y: 620,
    type: 'entrance',
    roomId: 'dept_reception_k1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_reception',
    name: 'Quầy Tiếp Đón BHYT & Đăng Ký Khám K1',
    nameEn: 'K1 Reception & Insurance Registration',
    buildingId: 'K1',
    x: 250,
    y: 600,
    type: 'reception',
    roomId: 'dept_reception_k1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_cashier',
    name: 'Quầy Thu Viện Phí & Thanh Toán BHYT K1',
    nameEn: 'K1 Cashier & Billing',
    buildingId: 'K1',
    x: 310,
    y: 600,
    type: 'cashier',
    roomId: 'dept_cashier_k1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_pharmacy',
    name: 'Nhà Thuốc Bệnh Viện Bạch Mai (Tòa K1)',
    nameEn: 'K1 Hospital Pharmacy',
    buildingId: 'K1',
    x: 330,
    y: 620,
    type: 'pharmacy',
    roomId: 'dept_pharmacy_k1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_elev_1',
    name: 'Thang Máy Tòa K1',
    nameEn: 'Building K1 Elevator',
    buildingId: 'K1',
    x: 280,
    y: 570,
    type: 'elevator',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_stairs_1',
    name: 'Cầu Thang Bộ Tòa K1',
    nameEn: 'Building K1 Stairs',
    buildingId: 'K1',
    x: 260,
    y: 570,
    type: 'stairs',
    isAccessible: false,
    verificationStatus: 'campus_verified'
  },

  // Tòa K1 - Tầng 2
  {
    id: 'node_k1_elev_2',
    name: 'Thang Máy Tòa K1 (Khu vực trên)',
    nameEn: 'Building K1 Elevator (Upper Area)',
    buildingId: 'K1',
    x: 280,
    y: 570,
    type: 'elevator',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_stairs_2',
    name: 'Cầu Thang Bộ Tòa K1 (Khu vực trên)',
    nameEn: 'Building K1 Stairs (Upper Area)',
    buildingId: 'K1',
    x: 260,
    y: 570,
    type: 'stairs',
    isAccessible: false,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_internal_clinic',
    name: 'Phòng Khám Nội Tổng Quát (Tòa K1)',
    nameEn: 'Internal Medicine Clinic (Building K1)',
    buildingId: 'K1',
    x: 240,
    y: 540,
    type: 'room',
    roomId: 'dept_internal_k1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_k1_gastro_clinic',
    name: 'Phòng Khám Tiêu Hóa - Gan Mật (Tòa K1)',
    nameEn: 'Gastroenterology Clinic (Building K1)',
    buildingId: 'K1',
    x: 320,
    y: 540,
    type: 'room',
    roomId: 'dept_gastro_k1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA K2: KHÁM BỆNH & ĐIỀU TRỊ TRONG NGÀY =================
  {
    id: 'node_k2_entrance',
    name: 'Tòa K2 - Khám Bệnh & Điều Trị Trong Ngày',
    nameEn: 'Building K2 - Outpatient Center',
    buildingId: 'K2',
    x: 370,
    y: 620,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= VIỆN TIM MẠCH QUỐC GIA (KHỐI BÊN TRÁI) =================
  {
    id: 'node_vtm_entrance',
    name: 'Viện Tim Mạch Quốc Gia (Khối nhà bên trái)',
    nameEn: 'Vietnam National Heart Institute (VNHI)',
    buildingId: 'VTM',
    x: 180,
    y: 460,
    type: 'entrance',
    roomId: 'dept_cardiology_vtm',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA P: KHU NHÀ VIỆT - NHẬT =================
  {
    id: 'node_p_vietnhat_entrance',
    name: 'Khu Nhà P (Tòa Nhà Việt - Nhật)',
    nameEn: 'Building P (Vietnam - Japan Building)',
    buildingId: 'P',
    x: 440,
    y: 440,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA Q: TÒA NHÀ 21 TẦNG =================
  {
    id: 'node_q_21story_entrance',
    name: 'Khu Nhà Q (Tòa Nhà 21 Tầng)',
    nameEn: 'Building Q (21-Story Building)',
    buildingId: 'Q',
    x: 540,
    y: 340,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA H: VIỆN Y HỌC HẠT NHÂN & UNG BƯỚU =================
  {
    id: 'node_h_onco_entrance',
    name: 'Tòa H - Viện Y Học Hạt Nhân & Ung Bướu',
    nameEn: 'Building H - Nuclear Medicine & Oncology Institute',
    buildingId: 'H',
    x: 680,
    y: 350,
    type: 'entrance',
    roomId: 'dept_onco_h',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA F: VIỆN Y HỌC NHIỆT ĐỚI & TIÊM CHỦNG =================
  {
    id: 'node_f_tropical_entrance',
    name: 'Tòa F - Viện Y Học Nhiệt Đới & Tư Vấn Tiêm Chủng',
    nameEn: 'Building F - Tropical Medicine & Vaccine',
    buildingId: 'F',
    x: 520,
    y: 220,
    type: 'entrance',
    roomId: 'dept_tropical_f',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_f_eye_dental_entrance',
    name: 'Tòa F - Khoa Mắt & Răng Hàm Mặt',
    nameEn: 'Building F - Eye & Dental Clinic',
    buildingId: 'F',
    x: 550,
    y: 220,
    type: 'room',
    roomId: 'dept_eye_dental_f',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA E: KHOA KIỂM SOÁT NHIỄM KHUẨN =================
  {
    id: 'node_e_infection_entrance',
    name: 'Tòa E - Khoa Kiểm Soát Nhiễm Khuẩn',
    nameEn: 'Building E - Infection Control',
    buildingId: 'E',
    x: 360,
    y: 220,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= CỤM T1-T3: VIỆN THẦN KINH =================
  {
    id: 'node_t1_neuro_entrance',
    name: 'Cụm T1, T2, T3 - Viện Thần Kinh',
    nameEn: 'Buildings T1-T3 - Neurology Institute',
    buildingId: 'T1',
    x: 800,
    y: 340,
    type: 'entrance',
    roomId: 'dept_neuro_t1',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= CỤM T4-T6: VIỆN SỨC KHỔE TÂM THẦN =================
  {
    id: 'node_t4_mental_entrance',
    name: 'Cụm T4, T5, T6 - Viện Sức Khỏe Tâm Thần',
    nameEn: 'Buildings T4-T6 - National Institute of Mental Health',
    buildingId: 'T4',
    x: 800,
    y: 480,
    type: 'entrance',
    roomId: 'dept_mental_t4',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= CỤM D2-D6 (PHÍA TÂY BẮC) =================
  {
    id: 'node_d2_trad_entrance',
    name: 'Tòa D2 - Khoa Y Học Cổ Truyền',
    nameEn: 'Building D2 - Traditional Medicine',
    buildingId: 'D2',
    x: 240,
    y: 240,
    type: 'entrance',
    roomId: 'dept_trad_d2',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_d4_rehab_entrance',
    name: 'Tòa D4 - Viện Phục Hồi Chức Năng',
    nameEn: 'Building D4 - Rehabilitation Institute',
    buildingId: 'D4',
    x: 200,
    y: 290,
    type: 'entrance',
    roomId: 'dept_rehab_d4',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_d5_training_entrance',
    name: 'Tòa D5 - Viện Đào Tạo & Nghiên Cứu Y Dược',
    nameEn: 'Building D5 - Medical Training Institute',
    buildingId: 'D5',
    x: 270,
    y: 310,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },
  {
    id: 'node_d6_allergy_entrance',
    name: 'Tòa D6 - Trung Tâm Dị Ứng - Miễn Dịch Lâm Sàng',
    nameEn: 'Building D6 - Allergy & Immunology Center',
    buildingId: 'D6',
    x: 320,
    y: 340,
    type: 'entrance',
    roomId: 'dept_allergy_d6',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  },

  // ================= TÒA B2: KHU HÀNH CHÍNH CŨ =================
  {
    id: 'node_b2_admin_entrance',
    name: 'Tòa B2 - Khu Hành Chính Cũ',
    nameEn: 'Building B2 - Administrative Building',
    buildingId: 'B2',
    x: 400,
    y: 360,
    type: 'entrance',
    isAccessible: true,
    verificationStatus: 'campus_verified'
  }
];

export function getNodeById(id: string): MapNode | undefined {
  return BACH_MAI_NODES.find(n => n.id === id);
}

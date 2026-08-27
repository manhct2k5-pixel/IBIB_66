import { HospitalCampus, GateInfo } from '../../types';
import { BACH_MAI_OFFICIAL_SOURCES } from './sources';

export const BACH_MAI_GATES: GateInfo[] = [
  {
    id: 'gate_1',
    gateNumber: 1,
    name: 'Cổng số 1 (78 Giải Phóng)',
    nameEn: 'Gate 1 (78 Giai Phong St)',
    street: 'Giải Phóng',
    nodeId: 'node_gate_1',
    descriptionVi: 'Nằm phía đường Giải Phóng, gần trục đi vào K3 (Trung tâm Chống độc / Da liễu), A9 (Cấp cứu) và A10 (Đột quỵ). Ô tô được đón/trả khách theo phân luồng.',
    descriptionEn: 'Located on Giai Phong Street, near K3 (Poison/Dermatology), A9 (Emergency) and A10 (Stroke). Cars can drop-off/pick-up following traffic routing.',
    operatingHours: '24/7 (Ô tô ban đêm sau 22:00 sử dụng Cổng 1)',
    bestForBuildings: ['K3', 'A9', 'A10', 'A11', 'P'],
    vehicleRules: 'Người đi bộ, xe máy, ô tô đón/trả khách theo phân luồng.',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[1].url
  },
  {
    id: 'gate_2',
    gateNumber: 2,
    name: 'Cổng số 2 (Giải Phóng)',
    nameEn: 'Gate 2 (Giai Phong St)',
    street: 'Giải Phóng',
    nodeId: 'node_gate_2',
    descriptionVi: 'Nằm phía đường Giải Phóng. Chủ yếu dành cho ô tô đi ra trong giờ hành chính theo phân luồng giao thông bệnh viện.',
    descriptionEn: 'Located on Giai Phong Street. Primarily designated as vehicle exit for cars during business hours.',
    operatingHours: 'Giờ hành chính (Chủ yếu làn xe ra)',
    bestForBuildings: ['K1', 'K2'],
    vehicleRules: 'Chủ yếu làn ô tô đi ra; không phải cổng đón tiếp chính cho người đi bộ.',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[1].url
  },
  {
    id: 'gate_3',
    gateNumber: 3,
    name: 'Cổng số 3 (Phố Phương Mai)',
    nameEn: 'Gate 3 (Phuong Mai St)',
    street: 'Phương Mai',
    nodeId: 'node_gate_3',
    descriptionVi: 'Nằm trên đường Phương Mai, thuận tiện để đến cụm Viện Thần kinh (T1-T3), Viện Sức khỏe tâm thần (T4-T6), Viện Y học nhiệt đới (F), Tòa 21 tầng (Q), Ung bướu (H) và khu gửi xe. Mở cửa từ 05:30 đến 22:00. Sau 22:00 chỉ mở lối phụ cho người đi bộ và xe máy; ô tô sau 22:00 vui lòng sử dụng Cổng 1 (đường Giải Phóng).',
    descriptionEn: 'Located on Phuong Mai Street, convenient for T1-T6, F, Q, H buildings and parking. Open 05:30 - 22:00. After 22:00 pedestrian/motorbike sub-entrance only; cars after 22:00 must use Gate 1.',
    operatingHours: '05:30 - 22:00 (Sau 22:00 chỉ mở lối phụ đi bộ/xe máy, ô tô qua Cổng 1)',
    bestForBuildings: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'F', 'Q', 'H'],
    vehicleRules: 'Xe máy gửi tại bãi xe cổng Phương Mai; ô tô di chuyển theo giờ quy định.',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[1].url
  },
  {
    id: 'gate_4',
    gateNumber: 4,
    name: 'Cổng số 4 (Giải Phóng - Lối vào K1, K2)',
    nameEn: 'Gate 4 (Giai Phong St - Access to K1, K2)',
    street: 'Giải Phóng',
    nodeId: 'node_gate_4',
    descriptionVi: 'Nằm phía đường Giải Phóng, là cổng thuận tiện nhất để tiếp cận Tòa nhà K1 và K2 (Trung tâm Khám bệnh và Điều trị trong ngày).',
    descriptionEn: 'Located on Giai Phong Street, the most convenient gate to access Building K1 and K2 (Outpatient & Day Treatment Center).',
    operatingHours: '05:30 - 18:00 (Phục vụ tiếp đón khám bệnh ngoại trú)',
    bestForBuildings: ['K1', 'K2'],
    vehicleRules: 'Ưu tiên người đi bộ đến đăng ký khám ngoại trú tại K1/K2.',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[1].url
  }
];

export const BACH_MAI_CAMPUS: HospitalCampus = {
  id: 'bach_mai_hanoi',
  name: 'Bệnh viện Bạch Mai (Hà Nội)',
  nameEn: 'Bach Mai Hospital (Hanoi)',
  city: 'Hà Nội',
  address: 'Số 78 Đường Giải Phóng, P. Kim Liên, TP Hà Nội',
  phone: '1900 888 866', // Tổng đài chăm sóc khách hàng & đặt lịch
  emergencyPhone: '086 958 7707', // Hotline Trung tâm Cấp cứu A9 (24/7)
  description: 'Bệnh viện đa khoa hạng đặc biệt tuyến cuối lớn nhất miền Bắc với hơn 30+ viện, trung tâm và khoa lâm sàng.',
  hasIndoorMap: true,
  verificationNotice: 'Sơ đồ định hướng, không theo tỷ lệ. Vui lòng ưu tiên biển chỉ dẫn thực tế tại bệnh viện.',
  gates: BACH_MAI_GATES,
  buildings: [
    {
      id: 'marker_k1',
      name: 'Tòa K1 - Trung Tâm Khám Bệnh & Điều Trị Trong Ngày (Theo Yêu Cầu)',
      nameEn: 'Building K1 - Outpatient & Day Treatment Center (On Demand)',
      buildingId: 'K1',
      type: 'outpatient',
      description: 'Khu khám chữa bệnh theo yêu cầu; thuận tiện nhất từ Cổng 4 (Giải Phóng).',
      floorsCount: 9
    },
    {
      id: 'marker_k2',
      name: 'Tòa K2 - Khám Bệnh & Điều Trị Trong Ngày',
      nameEn: 'Building K2 - Day Treatment Center',
      buildingId: 'K2',
      type: 'outpatient',
      description: 'Trung tâm khám bệnh và điều trị trong ngày, thuận tiện từ Cổng 4.',
      floorsCount: 5
    },
    {
      id: 'marker_k3',
      name: 'Tòa K3 - Trung Tâm Chống Độc & Khoa Da Liễu / Bỏng',
      nameEn: 'Building K3 - Poison Control Center & Dermatology / Burn Unit',
      buildingId: 'K3',
      type: 'emergency',
      description: 'Trung tâm Chống độc Quốc gia, Khoa Da liễu và Đơn vị Bỏng.',
      floorsCount: 4
    },
    {
      id: 'marker_a9',
      name: 'Tòa A9 - Trung Tâm Cấp Cứu A9 (24/7)',
      nameEn: 'Building A9 - A9 Emergency Center (24/7)',
      buildingId: 'A9',
      type: 'emergency',
      description: 'Tiếp nhận cấp cứu 24/7. Hotline: 086 958 7707 và 115. Nằm gần Cổng 1 (Giải Phóng).',
      floorsCount: 5
    },
    {
      id: 'marker_a10',
      name: 'Tòa A10 - Trung Tâm Đột Quỵ',
      nameEn: 'Building A10 - Stroke Center',
      buildingId: 'A10',
      type: 'emergency',
      description: 'Trung tâm Đột quỵ Bệnh viện Bạch Mai, cấp cứu can thiệp mạch máu não giờ vàng.',
      floorsCount: 4
    },
    {
      id: 'marker_a11',
      name: 'Tòa A11 - Hội Trường Quốc Tế & Trạm Hiến Máu',
      nameEn: 'Building A11 - International Hall & Blood Donation Center',
      buildingId: 'A11',
      type: 'admin',
      description: 'Hội trường quốc tế và điểm tiếp nhận hiến máu tình nguyện.',
      floorsCount: 3
    },
    {
      id: 'marker_vtm',
      name: 'Viện Tim Mạch Quốc Gia (Khối nhà bên trái)',
      nameEn: 'Vietnam National Heart Institute (VNHI)',
      buildingId: 'VTM',
      type: 'inpatient',
      description: 'Viện Tim mạch là khối nhà lớn phía bên trái khuôn viên, chuyên sâu tim mạch can thiệp và phẫu thuật.',
      floorsCount: 7
    },
    {
      id: 'marker_p',
      name: 'Khu Nhà P (Tòa Nhà Việt - Nhật)',
      nameEn: 'Building P (Vietnam - Japan Building)',
      buildingId: 'P',
      type: 'inpatient',
      description: 'Khu nhà Việt - Nhật trung tâm khuôn viên, gồm nhiều khoa lâm sàng và cận lâm sàng.',
      floorsCount: 6
    },
    {
      id: 'marker_q',
      name: 'Khu Nhà Q (Tòa Nhà 21 Tầng)',
      nameEn: 'Building Q (21-Story Building)',
      buildingId: 'Q',
      type: 'inpatient',
      description: 'Tòa nhà cao tầng trung tâm, gồm Trung tâm Ung bướu & Y học hạt nhân, Hóa trị, Tiêu hóa.',
      floorsCount: 21
    },
    {
      id: 'marker_h',
      name: 'Tòa H - Viện Y Học Hạt Nhân & Ung Bướu',
      nameEn: 'Building H - Nuclear Medicine & Oncology Institute',
      buildingId: 'H',
      type: 'diagnostic',
      description: 'Viện Y học hạt nhân và Ung bướu (phía bên phải P/Q).',
      floorsCount: 5
    },
    {
      id: 'marker_f',
      name: 'Tòa F - Viện Y Học Nhiệt Đới & Tư Vấn Tiêm Chủng',
      nameEn: 'Building F - Tropical Medicine & Vaccination Unit',
      buildingId: 'F',
      type: 'clinical',
      description: 'Viện Y học nhiệt đới, Đơn vị tư vấn và tiêm chủng, Mắt, Răng Hàm Mặt, Huyết học và Truyền máu (phía trên P/Q).',
      floorsCount: 4
    },
    {
      id: 'marker_e',
      name: 'Tòa E - Khoa Kiểm Soát Nhiễm Khuẩn',
      nameEn: 'Building E - Infection Control Department',
      buildingId: 'E',
      type: 'admin',
      description: 'Khoa Kiểm soát nhiễm khuẩn.',
      floorsCount: 3
    },
    {
      id: 'marker_t1_t3',
      name: 'Cụm T1, T2, T3 - Viện Thần Kinh',
      nameEn: 'Buildings T1, T2, T3 - Neurology Institute',
      buildingId: 'T1',
      type: 'inpatient',
      description: 'Viện Thần kinh Bệnh viện Bạch Mai, gần Cổng 3 (Phương Mai).',
      floorsCount: 4
    },
    {
      id: 'marker_t4_t6',
      name: 'Cụm T4, T5, T6 - Viện Sức Khỏe Tâm Thần',
      nameEn: 'Buildings T4, T5, T6 - National Institute of Mental Health',
      buildingId: 'T4',
      type: 'inpatient',
      description: 'Viện Sức khỏe tâm thần, gần Cổng 3 (Phương Mai).',
      floorsCount: 3
    },
    {
      id: 'marker_d2',
      name: 'Tòa D2 - Khoa Y Học Cổ Truyền',
      nameEn: 'Building D2 - Traditional Medicine Department',
      buildingId: 'D2',
      type: 'clinical',
      description: 'Khoa Y học cổ truyền (khu phía trên bên trái).',
      floorsCount: 3
    },
    {
      id: 'marker_d4',
      name: 'Tòa D4 - Viện Phục Hồi Chức Năng',
      nameEn: 'Building D4 - Rehabilitation Institute',
      buildingId: 'D4',
      type: 'clinical',
      description: 'Viện Phục hồi chức năng.',
      floorsCount: 3
    },
    {
      id: 'marker_d5',
      name: 'Tòa D5 - Viện Đào Tạo & Nghiên Cứu Y Dược',
      nameEn: 'Building D5 - Medical & Pharmaceutical Training Institute',
      buildingId: 'D5',
      type: 'education',
      description: 'Viện Đào tạo và Nghiên cứu Y Dược Bạch Mai.',
      floorsCount: 4
    },
    {
      id: 'marker_d6',
      name: 'Tòa D6 - Trung Tâm Dị Ứng - Miễn Dịch Lâm Sàng',
      nameEn: 'Building D6 - Allergy & Clinical Immunology Center',
      buildingId: 'D6',
      type: 'clinical',
      description: 'Trung tâm Dị ứng - Miễn dịch lâm sàng.',
      floorsCount: 3
    },
    {
      id: 'marker_b2',
      name: 'Tòa B2 - Khu Hành Chính Cũ',
      nameEn: 'Building B2 - Administrative Building',
      buildingId: 'B2',
      type: 'admin',
      description: 'Khu hành chính Bệnh viện Bạch Mai.',
      floorsCount: 3
    }
  ]
};

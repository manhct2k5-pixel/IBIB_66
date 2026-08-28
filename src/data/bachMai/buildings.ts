import { Building, BuildingId } from '../../types';
import { BACH_MAI_OFFICIAL_SOURCES } from './sources';

export const BACH_MAI_BUILDINGS: Building[] = [
  {
    id: 'K1',
    name: 'Tòa K1 - Trung Tâm Khám Bệnh & Điều Trị Trong Ngày (Theo Yêu Cầu)',
    nameEn: 'Building K1 - Outpatient & Day Treatment Center',
    code: 'K1',
    description: 'Khu khám chữa bệnh theo yêu cầu; thuận tiện nhất từ Cổng 4 (đường Giải Phóng). Đăng ký khám BHYT và dịch vụ theo yêu cầu.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[2].url,
    floors: [
      {
        id: '1',
        buildingId: 'K1',
        name: 'Tòa K1 - Sảnh Tiếp Đón',
        nameEn: 'Building K1 - Reception Lobby',
        level: 1,
        description: 'Sảnh chính đón tiếp bệnh nhân K1.',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'K2',
    name: 'Tòa K2 - Khám Bệnh & Điều Trị Trong Ngày',
    nameEn: 'Building K2 - Day Treatment Center',
    code: 'K2',
    description: 'Trung tâm khám bệnh và điều trị trong ngày, thuận tiện đi từ Cổng 4 (Giải Phóng). Đã xác minh vị trí tòa nhà trên sơ đồ tổng thể.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'K2',
        name: 'Tòa K2 - Sảnh Tiếp Nhận',
        nameEn: 'Building K2 - Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận và điều trị trong ngày K2.',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'K3',
    name: 'Tòa K3 - Trung Tâm Chống Độc & Khoa Da Liễu / Bỏng',
    nameEn: 'Building K3 - Poison Control Center & Dermatology / Burn Unit',
    code: 'K3',
    description: 'Trung tâm Chống độc Quốc gia, Khoa Da liễu và Đơn vị Bỏng. Nằm gần Cổng 1 (Giải Phóng). Đã xác minh vị trí tòa nhà trên sơ đồ tổng thể.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'K3',
        name: 'Tòa K3 - Sảnh Tiếp Nhận',
        nameEn: 'Building K3 - Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Chống độc & Da liễu.',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'A9',
    name: 'Tòa A9 - Trung Tâm Cấp Cứu A9 (24/7)',
    nameEn: 'Building A9 - A9 Emergency Center (24/7)',
    code: 'A9',
    description: 'Tiếp nhận cấp cứu 24/7 mọi trường hợp nặng, nguy kịch. Hotline: 086 958 7707 và 115. Nằm gần Cổng 1 (Giải Phóng).',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[3].url,
    floors: [
      {
        id: '1',
        buildingId: 'A9',
        name: 'Tòa A9 - Sảnh Cấp Cứu A9',
        nameEn: 'Building A9 - Emergency Lobby',
        level: 1,
        description: 'Khu vực tiếp nhận cấp cứu khẩn cấp 24/7.',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'A10',
    name: 'Tòa A10 - Trung Tâm Đột Quỵ',
    nameEn: 'Building A10 - Stroke Center',
    code: 'A10',
    description: 'Trung tâm Đột quỵ Bệnh viện Bạch Mai, cấp cứu tiêu sợi huyết và can thiệp mạch não giờ vàng. Đã xác minh vị trí tòa nhà trên sơ đồ tổng thể.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'A10',
        name: 'Tầng 1 - Sảnh Tiếp Nhận Đột Quỵ A10',
        nameEn: '1st Floor - Stroke Admission Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận bệnh nhân đột quỵ não (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'A11',
    name: 'Tòa A11 - Hội Trường Quốc Tế & Trạm Hiến Máu',
    nameEn: 'Building A11 - International Hall & Blood Donation Station',
    code: 'A11',
    description: 'Hội trường quốc tế và điểm tiếp nhận hiến máu tình nguyện. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'A11',
        name: 'Tầng 1 - Sảnh A11',
        nameEn: '1st Floor - Lobby A11',
        level: 1,
        description: 'Hội trường và trạm hiến máu (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'VTM',
    name: 'Viện Tim Mạch Quốc Gia (Khối nhà bên trái)',
    nameEn: 'Vietnam National Heart Institute (VNHI)',
    code: 'VTM',
    description: 'Viện Tim mạch là khối nhà lớn phía bên trái khuôn viên, chuyên sâu khám tim mạch, can thiệp và phẫu thuật. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'VTM',
        name: 'Tầng 1 - Sảnh Đón Tiếp Viện Tim Mạch',
        nameEn: '1st Floor - Heart Institute Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận và phòng khám chuyên khoa tim mạch (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'P',
    name: 'Khu Nhà P (Tòa Nhà Việt - Nhật)',
    nameEn: 'Building P (Vietnam - Japan Building)',
    code: 'P',
    description: 'Khu nhà hợp tác Việt - Nhật trung tâm khuôn viên, gồm nhiều khoa lâm sàng và cận lâm sàng. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'P',
        name: 'Tầng 1 - Sảnh Nhà P',
        nameEn: '1st Floor - Building P Lobby',
        level: 1,
        description: 'Sảnh chính Tòa nhà Việt - Nhật (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'Q',
    name: 'Khu Nhà Q (Tòa Nhà 21 Tầng)',
    nameEn: 'Building Q (21-Story Building)',
    code: 'Q',
    description: 'Tòa nhà cao tầng trung tâm, gồm Trung tâm Ung bướu & YHHN, Hóa trị, Tiêu hóa. Đã xác minh vị trí tòa nhà.',
    floorsCount: 21,
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'Q',
        name: 'Tầng 1 - Sảnh Tòa Q (21 Tầng)',
        nameEn: '1st Floor - Building Q Lobby',
        level: 1,
        description: 'Sảnh chính Tòa nhà 21 tầng (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'H',
    name: 'Tòa H - Viện Y Học Hạt Nhân & Ung Bướu',
    nameEn: 'Building H - Nuclear Medicine & Oncology Institute',
    code: 'H',
    description: 'Viện Y học hạt nhân và Ung bướu (phía bên phải P/Q). Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'H',
        name: 'Tầng 1 - Sảnh Tòa H',
        nameEn: '1st Floor - Building H Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Viện YHHN & Ung bướu (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'F',
    name: 'Tòa F - Viện Y Học Nhiệt Đới & Tư Vấn Tiêm Chủng',
    nameEn: 'Building F - Tropical Medicine & Vaccination Unit',
    code: 'F',
    description: 'Viện Y học nhiệt đới, Đơn vị tư vấn và tiêm chủng; Mắt, Răng hàm mặt, Huyết học và Truyền máu (phía trên P/Q). Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'F',
        name: 'Tầng 1 - Sảnh Tòa F',
        nameEn: '1st Floor - Building F Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận và tiêm chủng Tòa F (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'E',
    name: 'Tòa E - Khoa Kiểm Soát Nhiễm Khuẩn',
    nameEn: 'Building E - Infection Control Department',
    code: 'E',
    description: 'Khoa Kiểm soát nhiễm khuẩn. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'E',
        name: 'Tầng 1 - Khoa KSNK',
        nameEn: '1st Floor - Infection Control',
        level: 1,
        description: 'Khu vực kiểm soát nhiễm khuẩn (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'T1',
    name: 'Cụm T1, T2, T3 - Viện Thần Kinh',
    nameEn: 'Buildings T1, T2, T3 - Neurology Institute',
    code: 'T1-T3',
    description: 'Viện Thần kinh Bệnh viện Bạch Mai, thuận tiện từ Cổng 3 (Phương Mai). Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'T1',
        name: 'Tầng 1 - Sảnh Viện Thần Kinh',
        nameEn: '1st Floor - Neurology Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Viện Thần kinh (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'T4',
    name: 'Cụm T4, T5, T6 - Viện Sức Khỏe Tâm Thần',
    nameEn: 'Buildings T4, T5, T6 - National Institute of Mental Health',
    code: 'T4-T6',
    description: 'Viện Sức khỏe tâm thần, thuận tiện từ Cổng 3 (Phương Mai). Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'T4',
        name: 'Tầng 1 - Sảnh Viện SKTT',
        nameEn: '1st Floor - Mental Health Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Viện Sức khỏe tâm thần (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'D2',
    name: 'Tòa D2 - Khoa Y Học Cổ Truyền',
    nameEn: 'Building D2 - Traditional Medicine Department',
    code: 'D2',
    description: 'Khoa Y học cổ truyền (khu phía trên bên trái). Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'D2',
        name: 'Tầng 1 - Sảnh D2',
        nameEn: '1st Floor - Traditional Medicine Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Y học cổ truyền (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'D4',
    name: 'Tòa D4 - Viện Phục Hồi Chức Năng',
    nameEn: 'Building D4 - Rehabilitation Institute',
    code: 'D4',
    description: 'Viện Phục hồi chức năng. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'D4',
        name: 'Tầng 1 - Sảnh D4',
        nameEn: '1st Floor - Rehab Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Phục hồi chức năng (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'D5',
    name: 'Tòa D5 - Viện Đào Tạo & Nghiên Cứu Y Dược',
    nameEn: 'Building D5 - Medical & Pharmaceutical Training Institute',
    code: 'D5',
    description: 'Viện Đào tạo và Nghiên cứu Y Dược Bạch Mai. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'D5',
        name: 'Tầng 1 - Sảnh D5',
        nameEn: '1st Floor - Training Institute Lobby',
        level: 1,
        description: 'Sảnh Viện Đào tạo & NCKH (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'D6',
    name: 'Tòa D6 - Trung Tâm Dị Ứng - Miễn Dịch Lâm Sàng',
    nameEn: 'Building D6 - Allergy & Clinical Immunology Center',
    code: 'D6',
    description: 'Trung tâm Dị ứng - Miễn dịch lâm sàng. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'D6',
        name: 'Tầng 1 - Sảnh D6',
        nameEn: '1st Floor - Allergy Center Lobby',
        level: 1,
        description: 'Sảnh tiếp nhận Dị ứng - Miễn dịch (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  },
  {
    id: 'B2',
    name: 'Tòa B2 - Khu Hành Chính Cũ',
    nameEn: 'Building B2 - Administrative Building',
    code: 'B2',
    description: 'Khu hành chính Bệnh viện Bạch Mai. Đã xác minh vị trí tòa nhà.',
    hasVerifiedIndoorMap: false,
    verificationStatus: 'campus_verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url,
    floors: [
      {
        id: '1',
        buildingId: 'B2',
        name: 'Tầng 1 - Sảnh B2',
        nameEn: '1st Floor - Admin Lobby',
        level: 1,
        description: 'Sảnh hành chính (Chưa có sơ đồ tầng được xác minh).',
        nodes: [],
        hasVerifiedFloorplan: false
      }
    ]
  }
];

export function getBuildingById(id: BuildingId): Building | undefined {
  return BACH_MAI_BUILDINGS.find(b => b.id === id);
}

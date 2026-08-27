import { HospitalCampus } from '../types';

export const REAL_HOSPITALS_LIST: HospitalCampus[] = [
  {
    id: 'bach_mai',
    name: 'Bệnh Viện Bạch Mai (78 Giải Phóng, Hà Nội)',
    nameEn: 'Bach Mai National Special-Class Hospital (Hanoi)',
    city: 'Hà Nội',
    address: '78 Đường Giải Phóng, Phường Phương Mai, Quận Đống Đa, Hà Nội',
    phone: '024 3869 3731',
    emergencyPhone: '024 3869 7501 (Cấp Cứu A9) / 115',
    center: { lat: 20.999513, lng: 105.841804 },
    zoom: 17,
    description: 'Bệnh viện đa khoa hạng đặc biệt tuyến cuối quy mô lớn nhất Việt Nam. Trang bị hệ thống điều hướng nội viện Indoor Navigation từ các cổng vào đến từng khoa phòng, phòng khám, chụp chiếu và nhận thuốc.',
    hasIndoorMap: true,
    buildings: [
      {
        id: 'bm_kham_benh',
        name: 'Tòa Nhà K1 - Trung Tâm Khám Bệnh Đa Khoa & Theo Yêu Cầu',
        nameEn: 'Building K1 - Outpatient & Specialty Clinics',
        buildingId: 'A',
        type: 'outpatient',
        position: { lat: 20.999800, lng: 105.842100 },
        description: 'Tòa nhà K1: Tiếp đón BHYT thông minh, Quầy thu ngân, Nhà thuốc Bệnh viện số 1, Khám Nội / Tim mạch / Tiêu hóa / Cơ xương khớp / Nhi / Sản / TMH / Mắt / Da liễu / Thần kinh.',
        floorsCount: 6,
        highlightColor: '#0ea5e9'
      },
      {
        id: 'bm_a9',
        name: 'Tòa Nhà A1 - Trung Tâm Cấp Cứu A9 & Đột Quỵ Não & Chống Độc',
        nameEn: 'Building A1 - A9 Emergency, Stroke & Poison Center',
        buildingId: 'B',
        type: 'emergency',
        position: { lat: 20.999200, lng: 105.841400 },
        description: 'Tuyến đầu cấp cứu hồi sức 24/7, phân luồng Triage Đỏ-Vàng-Xanh, Trung tâm Đột quỵ Não, Can thiệp DSA hỏa tốc và Trung tâm Hồi sức tích cực ICU.',
        floorsCount: 5,
        highlightColor: '#ef4444'
      },
      {
        id: 'bm_chan_doan',
        name: 'Tòa C - Trung Tâm Chẩn Đoán Hình Ảnh & Xét Nghiệm Kỹ Thuật Cao',
        nameEn: 'Building C - Diagnostic Imaging & Clinical Labs',
        buildingId: 'C',
        type: 'diagnostic',
        position: { lat: 20.999600, lng: 105.842700 },
        description: 'Lấy máu tự động, Chụp X-Quang kỹ thuật số DR, CT-Scanner 512 dãy, MRI 3.0 Tesla, Trung tâm Nội soi Tiêu hóa Việt - Nhật & Cầu vượt Skybridge.',
        floorsCount: 4,
        highlightColor: '#a855f7'
      },
      {
        id: 'bm_gate_1',
        name: 'Cổng 1 - 78 Đường Giải Phóng (Cổng Chính)',
        nameEn: 'Gate 1 - 78 Giai Phong Main Gate',
        type: 'gate',
        position: { lat: 20.998900, lng: 105.841100 },
        description: 'Lối vào chính từ đường Giải Phóng (đối diện Lê Thanh Nghị), đón trả taxi, xe buýt, lối vào sảnh Tòa K1 và Kiosk quét QR.',
        floorsCount: 1,
        highlightColor: '#3b82f6'
      },
      {
        id: 'bm_gate_2',
        name: 'Cổng 2 - Làn Cấp Cứu A9 Hỏa Tốc & Lối Xe Máy',
        nameEn: 'Gate 2 - A9 Fast Emergency & Motorbike Gate',
        type: 'emergency',
        position: { lat: 20.999150, lng: 105.841250 },
        description: 'Làn ưu tiên xe cứu thương 24/7 và gửi xe máy, dẫn trực tiếp vào sảnh phân luồng Triage Cấp Cứu A9 và Tòa K1.',
        floorsCount: 1,
        highlightColor: '#dc2626'
      },
      {
        id: 'bm_gate_3',
        name: 'Cổng 3 - Phố Phương Mai (Lối Bãi Xe & Thông TMH TW)',
        nameEn: 'Gate 3 - Phuong Mai Street Entrance',
        type: 'gate',
        position: { lat: 21.000150, lng: 105.842850 },
        description: 'Lối vào từ phố Phương Mai, tiếp cận bãi đỗ xe lớn Cổng 3, Tòa C Chẩn đoán hình ảnh và thông sang BV Tai Mũi Họng & Da Liễu TW.',
        floorsCount: 1,
        highlightColor: '#10b981'
      },
      {
        id: 'bm_skybridge',
        name: 'Cầu Vượt Đi Bộ Trên Cao (Skybridge K1 <-> C)',
        nameEn: 'Elevated Covered Skybridge (K1 <-> C)',
        type: 'gate',
        position: { lat: 20.999700, lng: 105.842400 },
        description: 'Hệ thống cầu vượt có mái che và kính bảo vệ nối tầng 2 Tòa K1 sang tầng 2 Tòa C Chẩn đoán hình ảnh.',
        floorsCount: 1,
        highlightColor: '#f59e0b'
      }
    ]
  },
  {
    id: 'mednav_central',
    name: 'Bệnh Viện Đa Khoa Quốc Tế MedNav (Khuôn Viên Mẫu)',
    nameEn: 'MedNav International Medical Center (Smart Campus)',
    city: 'Hà Nội',
    address: 'Số 1 Phố Y Dược Thông Minh, Quận Cầu Giấy, Hà Nội',
    phone: '024 3999 8888',
    emergencyPhone: '115 / 024 3999 9115',
    center: { lat: 21.028511, lng: 105.782302 },
    zoom: 18,
    description: 'Tổ hợp y tế kỹ thuật số thông minh 500 giường bệnh, trang bị Digital Twin dẫn đường nội viện đa tầng, tự động hóa HIS/LIS và bãi đáp trực thăng cấp cứu.',
    hasIndoorMap: true,
    buildings: [
      {
        id: 'campus_bld_a',
        name: 'Tòa A - Trung Tâm Khám Bệnh & Cấp Cứu 24/7',
        nameEn: 'Building A - Outpatient & Emergency Center',
        buildingId: 'A',
        type: 'outpatient',
        position: { lat: 21.028650, lng: 105.782050 },
        description: 'Tòa nhà 5 tầng: Cấp cứu 24/7, Tiếp đón, Nhà thuốc, Khám chuyên khoa Nội/Nhi/Sản/TMH/Mắt/RHM/Thần kinh.',
        floorsCount: 6,
        highlightColor: '#0ea5e9'
      },
      {
        id: 'campus_bld_b',
        name: 'Tòa B - Khối Ngoại Khoa & Phẫu Thuật Nội Trú',
        nameEn: 'Building B - Inpatient & Surgical Center',
        buildingId: 'B',
        type: 'inpatient',
        position: { lat: 21.028900, lng: 105.782550 },
        description: 'Tòa nhà 4 tầng: Trung tâm Phẫu thuật Hybrid, Hồi sức tích cực ICU/CCU, 300 giường bệnh nội trú.',
        floorsCount: 4,
        highlightColor: '#10b981'
      },
      {
        id: 'campus_bld_c',
        name: 'Tòa C - Trung Tâm Chẩn Đoán Hình Ảnh & Xét Nghiệm',
        nameEn: 'Building C - Diagnostic Imaging & Laboratory',
        buildingId: 'C',
        type: 'diagnostic',
        position: { lat: 21.028300, lng: 105.782600 },
        description: 'Tòa nhà 3 tầng: Lấy máu xét nghiệm tự động, Chụp X-Quang, CT-Scanner 128 dãy, MRI 3.0 Tesla, Nội soi.',
        floorsCount: 3,
        highlightColor: '#a855f7'
      },
      {
        id: 'campus_gate_main',
        name: 'Cổng Chính & Đón Trả Khách (Cổng 1)',
        nameEn: 'Main Entrance & Pick-up Gate 1',
        type: 'gate',
        position: { lat: 21.028150, lng: 105.781800 },
        description: 'Lối vào chính cho xe ô tô, taxi, người đi bộ và xe buýt. Có điểm Kiosk quét QR nhận diện vị trí ban đầu.',
        floorsCount: 1,
        highlightColor: '#3b82f6'
      },
      {
        id: 'campus_gate_er',
        name: 'Cổng Luồng Ưu Tiên Xe Cấp Cứu (Cổng 2)',
        nameEn: 'Emergency Ambulance Fast Gate 2',
        type: 'emergency',
        position: { lat: 21.028500, lng: 105.781600 },
        description: 'Lối tiếp cận hỏa tốc 24/7 trực tiếp vào Sảnh Cấp cứu Tòa A, có thanh chắn tự động nhận diện xe cứu thương.',
        floorsCount: 1,
        highlightColor: '#ef4444'
      }
    ]
  },
  {
    id: 'cho_ray',
    name: 'Bệnh Viện Chợ Rẫy (TP. Hồ Chí Minh)',
    nameEn: 'Cho Ray Hospital (HCMC)',
    city: 'TP. Hồ Chí Minh',
    address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
    phone: '028 3855 4137',
    emergencyPhone: '028 3855 4138',
    center: { lat: 10.757821, lng: 106.659648 },
    zoom: 17,
    description: 'Bệnh viện đa khoa tuyến cuối lớn nhất phía Nam với hơn 3.000 giường bệnh, thế mạnh Ngoại khoa, Ghép tạng, Ung bướu, Hồi sức cấp cứu và Chấn thương sọ não.',
    hasIndoorMap: false,
    buildings: [
      {
        id: 'cr_cap_cuu',
        name: 'Khoa Cấp Cứu Hồi Sức Chợ Rẫy',
        nameEn: 'Cho Ray Emergency Trauma Center',
        type: 'emergency',
        position: { lat: 10.757600, lng: 106.659200 },
        description: 'Tiếp nhận cấp cứu chấn thương, ngoại khoa và hồi sức tích cực 24/7.',
        floorsCount: 4,
        highlightColor: '#ef4444'
      },
      {
        id: 'cr_kham_benh',
        name: 'Khu Khám Bệnh Ngoại Trú & Chuyên Gia',
        nameEn: 'Outpatient Diagnostic & Clinic',
        type: 'outpatient',
        position: { lat: 10.758100, lng: 106.659900 },
        description: 'Khu khám ngoại trú, nhà thuốc bệnh viện và các phòng khám nội khoa/ngoại khoa.',
        floorsCount: 8,
        highlightColor: '#0ea5e9'
      },
      {
        id: 'cr_ung_buou',
        name: 'Trung Tâm Ung Bướu Chợ Rẫy',
        nameEn: 'Cho Ray Oncology Center',
        type: 'diagnostic',
        position: { lat: 10.757300, lng: 106.660200 },
        description: 'Xạ trị, hóa trị, phẫu thuật u và điều trị y học hạt nhân hiện đại.',
        floorsCount: 12,
        highlightColor: '#a855f7'
      },
      {
        id: 'cr_gate_nct',
        name: 'Cổng Chính - Nguyễn Chí Thanh',
        nameEn: 'Main Gate - Nguyen Chi Thanh St.',
        type: 'gate',
        position: { lat: 10.758400, lng: 106.659400 },
        description: 'Cổng vào chính cho bệnh nhân đến khám và liên hệ công tác.',
        floorsCount: 1,
        highlightColor: '#3b82f6'
      }
    ]
  },
  {
    id: 'dhyd_hcm',
    name: 'Bệnh Viện Đại Học Y Dược TP.HCM',
    nameEn: 'University Medical Center HCMC (UMC)',
    city: 'TP. Hồ Chí Minh',
    address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
    phone: '028 3855 4269',
    emergencyPhone: '028 3952 5353',
    center: { lat: 10.755498, lng: 106.661285 },
    zoom: 18,
    description: 'Bệnh viện đại học y khoa hiện đại với quy mô 1.000 giường, đi đầu về chuyển đổi số y tế, bệnh án điện tử EMR, phẫu thuật nội soi và tim mạch can thiệp.',
    hasIndoorMap: false,
    buildings: [
      {
        id: 'umc_toa_a',
        name: 'Tòa Nhà A - Khối Khám Ngoại Trú & Cấp Cứu',
        nameEn: 'Building A - Outpatient & ER',
        type: 'outpatient',
        position: { lat: 10.755600, lng: 106.661100 },
        description: 'Khám bệnh thông minh, ki-ốt thanh toán tự động, xét nghiệm và cấp cứu 24/7.',
        floorsCount: 17,
        highlightColor: '#0ea5e9'
      },
      {
        id: 'umc_toa_b',
        name: 'Tòa Nhà B - Khối Nội Trú & Trung Tâm Tim Mạch',
        nameEn: 'Building B - Inpatient & Cardiology',
        type: 'inpatient',
        position: { lat: 10.755300, lng: 106.661500 },
        description: 'Khu phòng mổ hiện đại, phòng nội trú tiêu chuẩn quốc tế và can thiệp tim mạch.',
        floorsCount: 15,
        highlightColor: '#10b981'
      },
      {
        id: 'umc_gate_hb',
        name: 'Cổng 1 - Mặt tiền Hồng Bàng',
        nameEn: 'Gate 1 - Hong Bang Main Entrance',
        type: 'gate',
        position: { lat: 10.755800, lng: 106.660900 },
        description: 'Lối vào sảnh chính đăng ký khám bệnh và đón trả người bệnh.',
        floorsCount: 1,
        highlightColor: '#3b82f6'
      }
    ]
  },
  {
    id: 'viet_duc',
    name: 'Bệnh Viện Hữu Nghị Việt Đức (Hà Nội)',
    nameEn: 'Viet Duc University Hospital',
    city: 'Hà Nội',
    address: '40 Tràng Thi, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội',
    phone: '024 3825 3531',
    emergencyPhone: '024 3825 3535',
    center: { lat: 21.028987, lng: 105.847526 },
    zoom: 18,
    description: 'Trung tâm phẫu thuật ngoại khoa và ghép tạng hàng đầu Việt Nam, chuyên sâu chấn thương chỉnh hình, thần kinh, tim mạch lồng ngực và tiêu hóa.',
    hasIndoorMap: false,
    buildings: [
      {
        id: 'vd_cap_cuu',
        name: 'Khoa Khám Bệnh Cấp Cứu Ban Đầu',
        nameEn: 'Emergency & Acute Trauma Unit',
        type: 'emergency',
        position: { lat: 21.028800, lng: 105.847200 },
        description: 'Cấp cứu ngoại khoa, hồi sức đa chấn thương và vết thương nặng 24/7.',
        floorsCount: 5,
        highlightColor: '#ef4444'
      },
      {
        id: 'vd_toa_d',
        name: 'Tòa Nhà D - Khu Phẫu Thuật & Chẩn Đoán Hình Ảnh',
        nameEn: 'Building D - Surgery & Diagnostic Imaging',
        type: 'diagnostic',
        position: { lat: 21.029200, lng: 105.847800 },
        description: 'Hệ thống phòng mổ thông minh, máy chụp CT đa dãy, MRI và mạch máu DSA.',
        floorsCount: 8,
        highlightColor: '#a855f7'
      },
      {
        id: 'vd_gate_trang_thi',
        name: 'Cổng 1 - 40 Tràng Thi',
        nameEn: 'Gate 1 - 40 Trang Thi St.',
        type: 'gate',
        position: { lat: 21.028600, lng: 105.847400 },
        description: 'Cổng chính vào bệnh viện Việt Đức ngay trung tâm phố cổ.',
        floorsCount: 1,
        highlightColor: '#3b82f6'
      }
    ]
  },
  {
    id: 'vinmec_timescity',
    name: 'Bệnh Viện Đa Khoa Quốc Tế Vinmec Times City',
    nameEn: 'Vinmec Times City International Hospital',
    city: 'Hà Nội',
    address: '458 Minh Khai, Phường Vĩnh Tuy, Quận Hai Bà Trưng, Hà Nội',
    phone: '024 3974 3556',
    emergencyPhone: '024 3974 4333',
    center: { lat: 20.994682, lng: 105.868205 },
    zoom: 18,
    description: 'Bệnh viện tiêu chuẩn JCI Hoa Kỳ với quy mô 600 phòng nội trú đơn, trung tâm ghép tạng, y học tái tạo và tế bào gốc.',
    hasIndoorMap: false,
    buildings: [
      {
        id: 'vm_main',
        name: 'Tòa Nhà Bệnh Viện Vinmec',
        nameEn: 'Vinmec Hospital Main Complex',
        type: 'outpatient',
        position: { lat: 20.994700, lng: 105.868200 },
        description: 'Tổ hợp y tế liên hoàn 7 tầng nổi, 2 tầng hầm đạt chuẩn quốc tế JCI.',
        floorsCount: 9,
        highlightColor: '#0ea5e9'
      },
      {
        id: 'vm_gate',
        name: 'Sảnh Đón & Cổng Cấp Cứu Vinmec',
        nameEn: 'Vinmec Main Drop-off & ER',
        type: 'emergency',
        position: { lat: 20.994300, lng: 105.868000 },
        description: 'Sảnh đón tiếp sang trọng và luồng ưu tiên xe cứu thương 24/7.',
        floorsCount: 1,
        highlightColor: '#ef4444'
      }
    ]
  }
];

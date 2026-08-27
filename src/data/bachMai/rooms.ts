import { RoomDetails } from '../../types';
import { BACH_MAI_OFFICIAL_SOURCES } from './sources';

export const BACH_MAI_ROOMS: RoomDetails[] = [
  // --- TÒA A9: TRUNG TÂM CẤP CỨU A9 (24/7) ---
  {
    id: 'dept_a9_emergency',
    name: 'Trung Tâm Cấp Cứu A9 (24/7)',
    nameEn: 'A9 Emergency Center (24/7)',
    code: 'A9-100',
    category: 'emergency',
    buildingId: 'A9',
    floorId: '1',
    description: 'Tiếp nhận cấp cứu 24/7 cho các trường hợp nguy kịch, đau ngực dữ dội, khó thở cấp, ngộ độc, tai nạn nặng, hôn mê. Hotline A9: 086 958 7707 và Tổng đài cấp cứu: 115.',
    descriptionEn: '24/7 Emergency reception for critical conditions, acute chest pain, severe dyspnea, poison, shock. Hotline: 086 958 7707 / 115.',
    operatingHours: '24/7 (Cả ngày & đêm)',
    phoneExtension: '086 958 7707 / 115',
    commonSymptoms: [
      'cấp cứu', 'khó thở', 'đau ngực dữ dội', 'ngất xỉu', 'co giật', 'chảy máu nhiều', 
      'tai nạn', 'hôn mê', 'sốc', 'nguy kịch', 'ngộ độc thực phẩm', 'ngộ độc hóa chất',
      'a9', 'cấp cứu a9'
    ],
    color: '#ef4444',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[3].url
  },

  // --- TÒA A10: TRUNG TÂM ĐỘT QUỴ ---
  {
    id: 'dept_stroke_a10',
    name: 'Trung Tâm Đột Quỵ (Tòa A10)',
    nameEn: 'Stroke Center (Building A10)',
    code: 'A10-101',
    category: 'emergency',
    buildingId: 'A10',
    floorId: '1',
    description: 'Cấp cứu và điều trị đột quỵ não, tiêu sợi huyết và can thiệp mạch máu não giờ vàng.',
    descriptionEn: 'Emergency stroke triage, thrombolysis and endovascular thrombectomy.',
    operatingHours: '24/7',
    commonSymptoms: [
      'đột quỵ', 'méo miệng', 'liệt nửa người', 'nói ngọng', 'yếu tay chân', 
      'tai biến mạch máu não', 'tai biến', 'stroke', 'a10'
    ],
    color: '#dc2626',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA K3: TRUNG TÂM CHỐNG ĐỘC & DA LIỄU / BỎNG ---
  {
    id: 'dept_poison_k3',
    name: 'Trung Tâm Chống Độc Quốc Gia (Tòa K3)',
    nameEn: 'National Poison Control Center (Building K3)',
    code: 'K3-101',
    category: 'emergency',
    buildingId: 'K3',
    floorId: '1',
    description: 'Cấp cứu, điều trị ngộ độc cấp và mạn tính do thực phẩm, hóa chất, thuốc bảo vệ thực vật, rắn độc cắn.',
    descriptionEn: 'Emergency care and toxicology treatment for drug, food, chemical poison and snakebites.',
    operatingHours: '24/7',
    commonSymptoms: [
      'ngộ độc', 'uống nhầm hóa chất', 'rắn cắn', 'ong đốt', 'ngộ độc nấm', 
      'ngộ độc rượu', 'chống độc', 'k3'
    ],
    color: '#ea580c',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },
  {
    id: 'dept_derma_k3',
    name: 'Khoa Da Liễu & Đơn Vị Bỏng (Tòa K3)',
    nameEn: 'Dermatology & Burn Unit (Building K3)',
    code: 'K3-102',
    category: 'clinical',
    buildingId: 'K3',
    floorId: '1',
    description: 'Khám và điều trị các bệnh về da, bỏng, vảy nến, viêm da cơ địa, nhiễm trùng da.',
    descriptionEn: 'Consultation and treatment for skin diseases, burn, psoriasis, dermatitis.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'da liễu', 'bỏng', 'ngứa da', 'dị ứng da', 'mẩn đỏ', 'mụn', 'vảy nến', 'nấm da', 'viêm da'
    ],
    color: '#d97706',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA K1: TRUNG TÂM KHÁM BỆNH & ĐIỀU TRỊ TRONG NGÀY (THEO YÊU CẦU) ---
  {
    id: 'dept_reception_k1',
    name: 'Sảnh Tiếp Đón & Đăng Ký Khám (Tòa K1)',
    nameEn: 'Welcome Lobby & Registration (Building K1)',
    code: 'K1-101',
    category: 'administration',
    buildingId: 'K1',
    floorId: '1',
    description: 'Tiếp đón người bệnh, phát số thứ tự khám, đăng ký khám BHYT và khám theo yêu cầu. Thuận tiện nhất khi đi vào từ Cổng 4 (đường Giải Phóng).',
    descriptionEn: 'Patient reception, queue numbering, health insurance & on-demand clinic registration. Best accessed via Gate 4.',
    operatingHours: '06:00 - 17:00 (Thứ 2 - Thứ 7)',
    commonSymptoms: [
      'đăng ký khám', 'tiếp đón', 'lấy số', 'thủ tục', 'bảo hiểm y tế', 'bhyt', 
      'khám bệnh', 'hỏi đường', 'khám theo yêu cầu', 'k1'
    ],
    color: '#0284c7',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[2].url
  },
  {
    id: 'dept_cashier_k1',
    name: 'Quầy Thu Viện Phí & Thanh Toán BHYT (Tòa K1)',
    nameEn: 'Cashier & Insurance Payment (Building K1)',
    code: 'K1-102',
    category: 'pharmacy_cashier',
    buildingId: 'K1',
    floorId: '1',
    description: 'Quầy thu tiền viện phí, tạm ứng viện phí và thanh toán chi phí khám chữa bệnh BHYT.',
    descriptionEn: 'Cashier desk for outpatient billing, hospital deposit and insurance checkout.',
    operatingHours: '06:00 - 17:30',
    commonSymptoms: ['thu ngân', 'nộp tiền', 'đóng tiền', 'viện phí', 'thanh toán', 'hóa đơn'],
    color: '#059669',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[2].url
  },
  {
    id: 'dept_pharmacy_k1',
    name: 'Nhà Thuốc Bệnh Viện Bạch Mai (Tòa K1)',
    nameEn: 'Bach Mai Hospital Pharmacy (Building K1)',
    code: 'K1-103',
    category: 'pharmacy_cashier',
    buildingId: 'K1',
    floorId: '1',
    description: 'Quầy cấp phát thuốc theo đơn BHYT và bán lẻ thuốc theo đơn bác sĩ.',
    descriptionEn: 'Dispensary for prescription medicines and health insurance pharmacy.',
    operatingHours: '06:30 - 18:00',
    commonSymptoms: ['mua thuốc', 'lấy thuốc', 'nhà thuốc', 'đơn thuốc', 'dược', 'thuốc'],
    color: '#10b981',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[2].url
  },
  {
    id: 'dept_internal_k1',
    name: 'Phòng Khám Nội Tổng Quát (Tòa K1 - Tầng 2)',
    nameEn: 'General Internal Medicine Clinic (Building K1 - 2F)',
    code: 'K1-201',
    category: 'clinical',
    buildingId: 'K1',
    floorId: '2',
    description: 'Khám và tư vấn các bệnh lý nội khoa thông thường, sốt kéo dài, mệt mỏi, sụt cân, kiểm tra sức khỏe tổng quát.',
    descriptionEn: 'Consultation for general internal conditions, fever, fatigue, weight loss, health check-up.',
    operatingHours: '06:30 - 17:00 (Thứ 2 - Thứ 7)',
    commonSymptoms: ['sốt', 'mệt mỏi', 'sụt cân', 'khám tổng quát', 'nội khoa', 'khám sức khỏe'],
    color: '#0284c7',
    verificationStatus: 'estimated',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[2].url
  },
  {
    id: 'dept_gastro_k1',
    name: 'Phòng Khám Tiêu Hóa - Gan Mật (Tòa K1 - Tầng 2)',
    nameEn: 'Gastroenterology & Hepatology Clinic (Building K1 - 2F)',
    code: 'K1-202',
    category: 'clinical',
    buildingId: 'K1',
    floorId: '2',
    description: 'Khám và điều trị viêm loét dạ dày, trào ngược thực quản, viêm gan, đại tràng, đau bụng kéo dài.',
    descriptionEn: 'Diagnosis for gastritis, acid reflux, hepatitis, colon diseases, abdominal pain.',
    operatingHours: '06:30 - 17:00 (Thứ 2 - Thứ 7)',
    commonSymptoms: ['đau dạ dày', 'ợ chua', 'đau bụng', 'viêm gan', 'trào ngược', 'đại tràng', 'tiêu chảy', 'táo bón'],
    color: '#0284c7',
    verificationStatus: 'estimated',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[2].url
  },

  // --- VIỆN TIM MẠCH QUỐC GIA (KHỐI NHÀ BÊN TRÁI) ---
  {
    id: 'dept_cardiology_vtm',
    name: 'Viện Tim Mạch Quốc Gia (Khối nhà bên trái)',
    nameEn: 'Vietnam National Heart Institute (VNHI)',
    code: 'VTM-101',
    category: 'clinical',
    buildingId: 'VTM',
    floorId: '1',
    description: 'Khám chuyên sâu bệnh lý tim mạch, tăng huyết áp, suy tim, bệnh van tim, mạch vành và can thiệp tim mạch.',
    descriptionEn: 'Specialized cardiology consultation, hypertension, heart failure, coronary disease.',
    operatingHours: '06:30 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'tim mạch', 'tăng huyết áp', 'huyết áp cao', 'hồi hộp', 'đánh trống ngực', 
      'suy tim', 'van tim', 'mạch vành', 'viện tim mạch', 'vtm'
    ],
    color: '#ef4444',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA H: VIỆN Y HỌC HẠT NHÂN & UNG BƯỚU ---
  {
    id: 'dept_onco_h',
    name: 'Viện Y Học Hạt Nhân & Ung Bướu (Tòa H)',
    nameEn: 'Nuclear Medicine & Oncology Institute (Building H)',
    code: 'H-101',
    category: 'clinical',
    buildingId: 'H',
    floorId: '1',
    description: 'Tầm soát ung thư, chẩn đoán y học hạt nhân (PET/CT, SPECT), xạ trị và hóa trị ung bướu.',
    descriptionEn: 'Cancer screening, nuclear medicine diagnostics (PET/CT), radiotherapy and oncology care.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'ung bướu', 'ung thư', 'u hạch', 'tầm soát ung thư', 'xạ trị', 'hóa trị', 
      'pet ct', 'y học hạt nhân', 'tòa h'
    ],
    color: '#7c3aed',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA F: VIỆN Y HỌC NHIỆT ĐỚI, TIÊM CHỦNG, MẮT, RHM, HUYẾT HỌC ---
  {
    id: 'dept_tropical_f',
    name: 'Viện Y Học Nhiệt Đới & Phòng Tiêm Chủng (Tòa F)',
    nameEn: 'Tropical Medicine & Vaccination Unit (Building F)',
    code: 'F-101',
    category: 'clinical',
    buildingId: 'F',
    floorId: '1',
    description: 'Khám và điều trị các bệnh truyền nhiễm, sốt xuất huyết, cúm, viêm gan virus; tư vấn và tiêm chủng vaccine.',
    descriptionEn: 'Infectious diseases treatment, dengue, viral hepatitis; vaccine consultation and immunization.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'sốt xuất huyết', 'tiêm chủng', 'tiêm phòng', 'vaccine', 'truyền nhiễm', 
      'nhiệt đới', 'uốn ván', 'dại', 'tòa f'
    ],
    color: '#0d9488',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },
  {
    id: 'dept_eye_dental_f',
    name: 'Khoa Mắt & Răng Hàm Mặt (Tòa F)',
    nameEn: 'Ophthalmology & Maxillofacial / Dental Department (Building F)',
    code: 'F-102',
    category: 'clinical',
    buildingId: 'F',
    floorId: '1',
    description: 'Khám bệnh lý về mắt, đo thị lực, đục thủy tinh thể, khám răng hàm mặt, nhổ răng khôn, điều trị sâu răng.',
    descriptionEn: 'Ophthalmology, visual check-up, dental, maxillofacial and teeth care.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'mắt', 'mờ mắt', 'đau mắt', 'đo thị lực', 'răng', 'đau răng', 'nhổ răng', 'sâu răng', 'răng hàm mặt'
    ],
    color: '#0891b2',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- CỤM T1-T3: VIỆN THẦN KINH ---
  {
    id: 'dept_neuro_t1',
    name: 'Viện Thần Kinh (Cụm Nhà T1, T2, T3)',
    nameEn: 'Neurology Institute (Buildings T1-T3)',
    code: 'T1-101',
    category: 'clinical',
    buildingId: 'T1',
    floorId: '1',
    description: 'Khám và điều trị các bệnh thần kinh: đau đầu mạn tính, rối loạn tiền đình, Parkinson, động kinh, đau thần kinh tọa, mất ngủ kéo dài. Thuận tiện từ Cổng 3 (đường Phương Mai).',
    descriptionEn: 'Specialized neurology care for chronic headache, vestibular disorders, Parkinson, epilepsy, insomnia.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'thần kinh', 'đau đầu', 'chóng mặt', 'tiền đình', 'mất ngủ', 'parkinson', 
      'động kinh', 'tê bì chân tay', 'viện thần kinh', 't1'
    ],
    color: '#4f46e5',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- CỤM T4-T6: VIỆN SỨC KHỎE TÂM THẦN ---
  {
    id: 'dept_mental_t4',
    name: 'Viện Sức Khỏe Tâm Thần (Cụm Nhà T4, T5, T6)',
    nameEn: 'National Institute of Mental Health (Buildings T4-T6)',
    code: 'T4-101',
    category: 'clinical',
    buildingId: 'T4',
    floorId: '1',
    description: 'Tư vấn, khám và điều trị rối loạn lo âu, trầm cảm, stress, rối loạn giấc ngủ, tâm lý học đường. Thuận tiện từ Cổng 3 (đường Phương Mai).',
    descriptionEn: 'Psychiatric care for anxiety, depression, chronic stress, sleep disorders, mental health.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'tâm thần', 'trầm cảm', 'lo âu', 'stress', 'rối loạn lo âu', 'tâm lý', 
      'hoảng sợ', 'viện sức khỏe tâm thần', 't4'
    ],
    color: '#6366f1',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA D2: KHOA Y HỌC CỔ TRUYỀN ---
  {
    id: 'dept_trad_d2',
    name: 'Khoa Y Học Cổ Truyền (Tòa D2)',
    nameEn: 'Traditional Medicine Department (Building D2)',
    code: 'D2-101',
    category: 'clinical',
    buildingId: 'D2',
    floorId: '1',
    description: 'Khám chữa bệnh kết hợp Đông - Tây y, châm cứu, bấm huyệt, xoa bóp trị liệu, thuốc y học cổ truyền.',
    descriptionEn: 'Traditional oriental medicine, acupuncture, herbal remedies and acupressure therapy.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: ['đông y', 'châm cứu', 'bấm huyệt', 'y học cổ truyền', 'thuốc nam', 'thuốc bắc', 'd2'],
    color: '#15803d',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA D4: VIỆN PHỤC HỒI CHỨC NĂNG ---
  {
    id: 'dept_rehab_d4',
    name: 'Viện Phục Hồi Chức Năng (Tòa D4)',
    nameEn: 'Rehabilitation Institute (Building D4)',
    code: 'D4-101',
    category: 'clinical',
    buildingId: 'D4',
    floorId: '1',
    description: 'Phục hồi chức năng sau tai biến, chấn thương sọ não, di chứng chấn thương cột sống, tập vận động trị liệu.',
    descriptionEn: 'Post-stroke rehab, physical therapy, spinal cord injury recovery, occupational therapy.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: ['phục hồi chức năng', 'tập đi', 'vật lý trị liệu', 'di chứng tai biến', 'phcn', 'd4'],
    color: '#047857',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  },

  // --- TÒA D6: TRUNG TÂM DỊ ỨNG - MIỄN DỊCH LÂM SÀNG ---
  {
    id: 'dept_allergy_d6',
    name: 'Trung Tâm Dị Ứng - Miễn Dịch Lâm Sàng (Tòa D6)',
    nameEn: 'Allergy & Clinical Immunology Center (Building D6)',
    code: 'D6-101',
    category: 'clinical',
    buildingId: 'D6',
    floorId: '1',
    description: 'Chẩn đoán và điều trị dị ứng thuốc, lupus ban đỏ, mày đay mạn tính, hen phế quản dị ứng, bệnh tự miễn.',
    descriptionEn: 'Treatment for drug allergies, lupus erythematosus, chronic urticaria, autoimmune diseases.',
    operatingHours: '07:00 - 16:30 (Thứ 2 - Thứ 6)',
    commonSymptoms: [
      'dị ứng', 'mày đay', 'lupus', 'dị ứng thuốc', 'tự miễn', 'hen dị ứng', 'd6'
    ],
    color: '#b45309',
    verificationStatus: 'verified',
    sourceUrl: BACH_MAI_OFFICIAL_SOURCES[0].url
  }
];

export function getRoomById(id: string): RoomDetails | undefined {
  return BACH_MAI_ROOMS.find(r => r.id === id);
}

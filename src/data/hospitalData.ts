import { Building, BuildingId, FloorId, MapEdge, MapNode, RoomDetails, ClinicalWorkflowPreset } from '../types';

export const BUILDINGS_DATA: Building[] = [
  {
    id: 'A',
    name: 'Tòa K1 - Trung Tâm Khám Bệnh Đa Khoa & Theo Yêu Cầu (Bạch Mai)',
    nameEn: 'Building K1 - Outpatient & Specialty Clinic Center',
    description: 'Khám ngoại trú 20+ chuyên khoa, Tiếp đón BHYT & Kiosk thông minh, Quầy thu ngân, Nhà thuốc Bệnh viện Bạch Mai số 1',
    floors: [
      { id: 'B1', buildingId: 'A', name: 'Tầng Hầm B1', nameEn: 'Basement B1', level: -1, description: 'Bãi đỗ xe thông minh ngầm K1, Căn tin bệnh viện, ATM ngân hàng', nodes: [] },
      { id: '1', buildingId: 'A', name: 'Tầng 1', nameEn: '1st Floor', level: 1, description: 'Cổng 1 (78 Giải Phóng), Cổng 2 (Làn A9), Tiếp đón BHYT, Kiosk tra cứu, Quầy Thu ngân, Nhà thuốc số 1, Phòng CSKH', nodes: [] },
      { id: '2', buildingId: 'A', name: 'Tầng 2', nameEn: '2nd Floor', level: 2, description: 'Trung tâm Khám Tim mạch Bạch Mai, Khám Nội tổng quát, Tiêu hóa & Gan mật, Cơ xương khớp, Cầu vượt Skybridge nối Tòa C', nodes: [] },
      { id: '3', buildingId: 'A', name: 'Tầng 3', nameEn: '3rd Floor', level: 3, description: 'Khoa Khám Nhi & Tiêm chủng vắc-xin, Khoa Phụ Sản & Quản lý thai, Phòng khám Tai Mũi Họng ống mềm', nodes: [] },
      { id: '4', buildingId: 'A', name: 'Tầng 4', nameEn: '4th Floor', level: 4, description: 'Phòng khám Mắt & Đo khúc xạ, Khám Răng Hàm Mặt kỹ thuật cao, Khám Da Liễu & Dị ứng - Miễn dịch lâm sàng', nodes: [] },
      { id: '5', buildingId: 'A', name: 'Tầng 5', nameEn: '5th Floor', level: 5, description: 'Khám Thần kinh & Phòng ngừa đột quỵ, Trung tâm Y học hạt nhân & Ung bướu - Hóa trị ban ngày', nodes: [] },
    ],
  },
  {
    id: 'B',
    name: 'Tòa A1 - Trung Tâm Cấp Cứu A9 & Đột Quỵ Não & Chống Độc Quốc Gia',
    nameEn: 'Building A1 - A9 Emergency, Stroke & National Poison Center',
    description: 'Cấp cứu hồi sinh 24/7, Phân luồng Triage Đỏ-Vàng-Xanh, Can thiệp tiêu sợi huyết đột quỵ não, Trung tâm Hồi sức tích cực (ICU)',
    floors: [
      { id: '1', buildingId: 'B', name: 'Tầng 1', nameEn: '1st Floor', level: 1, description: 'Sảnh Tiếp nhận Cấp cứu A9 24/7, Phân luồng Triage, Quầy thủ tục nhập viện, Đơn vị Đột quỵ giờ vàng, Nhà thuốc cấp cứu 24/7', nodes: [] },
      { id: '2', buildingId: 'B', name: 'Tầng 2', nameEn: '2nd Floor', level: 2, description: 'Trung Tâm Chống Độc Quốc Gia Bạch Mai, Phòng Can thiệp mạch máu cấp cứu DSA', nodes: [] },
      { id: '3', buildingId: 'B', name: 'Tầng 3', nameEn: '3rd Floor', level: 3, description: 'Trung Tâm Hồi Sức Tích Cực (ICU) Bạch Mai, Đơn vị Hồi sức tim mạch CCU & ECMO lọc máu', nodes: [] },
      { id: '4', buildingId: 'B', name: 'Tầng 4', nameEn: '4th Floor', level: 4, description: 'Khoa Phẫu Thuật Cấp Cứu & Ngoại Chấn Thương, Khu hậu phẫu vô trùng', nodes: [] },
    ],
  },
  {
    id: 'C',
    name: 'Tòa C - Trung Tâm Chẩn Đoán Hình Ảnh & Xét Nghiệm Kỹ Thuật Cao',
    nameEn: 'Building C - Diagnostic Imaging & High-Tech Laboratories',
    description: 'Trung tâm lấy máu tự động LIS, Chụp X-Quang DR, CT-Scanner 512 dãy, MRI 3.0 Tesla, Trung tâm Nội soi Tiêu hóa Việt - Nhật',
    floors: [
      { id: '1', buildingId: 'C', name: 'Tầng 1', nameEn: '1st Floor', level: 1, description: 'Cổng 3 (Phố Phương Mai), Khu Lấy Máu & Bệnh phẩm tự động, Chụp X-Quang kỹ thuật số DR, Quầy trả kết quả nhanh', nodes: [] },
      { id: '2', buildingId: 'C', name: 'Tầng 2', nameEn: '2nd Floor', level: 2, description: 'Trung tâm Chụp Cắt Lớp CT-Scanner (128/512 dãy), Phòng Chụp MRI 3.0 Tesla & Cầu vượt Skybridge nối Tòa K1', nodes: [] },
      { id: '3', buildingId: 'C', name: 'Tầng 3', nameEn: '3rd Floor', level: 3, description: 'Trung Tâm Nội Soi Tiêu Hóa Việt Nam - Nhật Bản, Phòng Siêu Âm Màu 4D & Doppler tim mạch', nodes: [] },
    ],
  },
];

export const ROOMS_DATA: RoomDetails[] = [
  // --- TÒA K1 (A) - TẦNG B1 ---
  {
    id: 'room_a_b101',
    name: 'Căn Tin Bệnh Viện Bạch Mai & Cà Phê',
    nameEn: 'Bach Mai Hospital Cafeteria & Coffee Lounge',
    code: 'K1-B101',
    category: 'amenity',
    buildingId: 'A',
    floorId: 'B1',
    description: 'Phục vụ suất ăn dinh dưỡng chuẩn y khoa cho bệnh nhân, người nhà và y bác sĩ, cà phê, nước giải khát.',
    descriptionEn: 'Nutritious hospital meals for patients, visitors, and medical staff.',
    operatingHours: '05:30 - 21:30',
    commonSymptoms: ['đói', 'ăn uống', 'cà phê', 'nước uống', 'cơm', 'bánh mì', 'căn tin', 'canteen'],
    color: '#f59e0b'
  },
  {
    id: 'room_a_b102',
    name: 'Bãi Gửi Xe Ngầm Tòa K1 (Xe Máy & Ô Tô)',
    nameEn: 'Basement Parking Garage K1',
    code: 'K1-B102',
    category: 'amenity',
    buildingId: 'A',
    floorId: 'B1',
    description: 'Khu vực gửi xe máy và ô tô thông minh dưới hầm Tòa K1, có lối thang máy dẫn thẳng lên sảnh tiếp đón tầng 1.',
    descriptionEn: 'Smart parking area for motorbikes and cars with direct elevator access to 1F lobby.',
    operatingHours: '24/7',
    commonSymptoms: ['gửi xe', 'bãi xe', 'đỗ xe', 'xe máy', 'ô tô', 'parking'],
    color: '#64748b'
  },
  {
    id: 'room_a_b103',
    name: 'ATM Ngân Hàng (Vietcombank / BIDV / VietinBank)',
    nameEn: 'ATM & Banking Services',
    code: 'K1-B103',
    category: 'amenity',
    buildingId: 'A',
    floorId: 'B1',
    description: 'Cây rút tiền tự động và cây nộp tiền nhanh liên ngân hàng Vietcombank, BIDV, VietinBank, Agribank.',
    descriptionEn: 'Automatic Teller Machines (ATM) for Vietcombank, BIDV, VietinBank, Agribank.',
    operatingHours: '24/7',
    commonSymptoms: ['rút tiền', 'atm', 'tiền mặt', 'ngân hàng'],
    color: '#0ea5e9'
  },

  // --- TÒA K1 (A) - TẦNG 1 ---
  {
    id: 'dept_emergency',
    name: 'Phòng Phân Luồng Sàng Lọc & Cấp Cứu Ban Đầu K1',
    nameEn: 'Initial Triage & Urgent Care K1',
    code: 'K1-100',
    category: 'emergency',
    buildingId: 'A',
    floorId: '1',
    description: 'Sàng lọc khẩn cấp các ca bệnh nặng tại sảnh Tòa K1 trước khi chuyển tiếp vào Trung tâm Cấp cứu A9 hoặc các chuyên khoa.',
    descriptionEn: 'Urgent screening at Building K1 lobby before transfer to A9 Emergency.',
    doctorInCharge: 'BS.CKII. Trần Thanh Nam',
    operatingHours: '24/7',
    phoneExtension: '115 / 100',
    commonSymptoms: ['cấp cứu', 'khó thở', 'đau ngực dữ dội', 'ngất xỉu', 'co giật', 'chảy máu', 'tai nạn', 'ngộ độc', 'hôn mê', 'sốc'],
    color: '#ef4444'
  },
  {
    id: 'dept_reception',
    name: 'Quầy Tiếp Đón BHYT & Kiosk Tra Cứu Tự Động K1',
    nameEn: 'Central Reception & Smart Registration Kiosk K1',
    code: 'K1-101',
    category: 'administration',
    buildingId: 'A',
    floorId: '1',
    description: 'Tiếp đón bệnh nhân, phân luồng ban đầu, quét CCCD gắn chip/VNeID, phát số khám tự động, hướng dẫn BHYT và đăng ký khám theo yêu cầu.',
    descriptionEn: 'Patient registration, chip ID/VNeID scanning, insurance triage, outpatient queue ticket.',
    operatingHours: '06:00 - 17:30 (Thứ 2 - Chủ Nhật)',
    phoneExtension: '101',
    commonSymptoms: ['đăng ký khám', 'lấy số', 'tiếp đón', 'hỏi thông tin', 'bảo hiểm y tế', 'bhyt', 'thủ tục', 'quét cccd', 'vneid'],
    color: '#0284c7'
  },
  {
    id: 'dept_cashier_a',
    name: 'Quầy Thu Ngân & Thanh Toán Viện Phí K1',
    nameEn: 'Cashier & QR Payment Counter K1',
    code: 'K1-105',
    category: 'pharmacy_cashier',
    buildingId: 'A',
    floorId: '1',
    description: 'Thanh toán viện phí, tạm ứng, xuất hóa đơn điện tử, thanh toán không tiền mặt qua VNPAY/VietQR/Thẻ ngân hàng.',
    descriptionEn: 'Medical bill payment, deposit, e-invoicing, cashless payment via VietQR/Card.',
    operatingHours: '06:30 - 18:00',
    phoneExtension: '105',
    commonSymptoms: ['đóng tiền', 'viện phí', 'thanh toán', 'thu ngân', 'hóa đơn', 'quẹt thẻ', 'qr pay'],
    color: '#10b981'
  },
  {
    id: 'dept_pharmacy_a',
    name: 'Nhà Thuốc Bệnh Viện Bạch Mai Số 1',
    nameEn: 'Bach Mai Main Pharmacy No. 1',
    code: 'K1-108',
    category: 'pharmacy_cashier',
    buildingId: 'A',
    floorId: '1',
    description: 'Cấp phát thuốc BHYT và bán thuốc theo đơn của bác sĩ, tư vấn hướng dẫn sử dụng thuốc an toàn, đầy đủ danh mục thuốc đặc trị.',
    descriptionEn: 'Prescription drug dispensing, health insurance pharmacy, medication counseling.',
    operatingHours: '06:30 - 21:00 (24/7 với đơn cấp cứu)',
    phoneExtension: '108',
    commonSymptoms: ['lấy thuốc', 'mua thuốc', 'nhà thuốc', 'đơn thuốc', 'dược phẩm', 'uống thuốc'],
    color: '#10b981'
  },
  {
    id: 'room_a_110',
    name: 'Phòng CSKH, Mượn Xe Lăn & Hướng Dẫn Người Bệnh',
    nameEn: 'Customer Care & Wheelchair Assistance',
    code: 'K1-110',
    category: 'administration',
    buildingId: 'A',
    floorId: '1',
    description: 'Hỗ trợ xe lăn miễn phí, hỗ trợ người khuyết tật, người cao tuổi, tư vấn đặt lịch hẹn tái khám và giải đáp thắc mắc.',
    descriptionEn: 'Free wheelchairs, disabled accessibility support, customer care desk.',
    operatingHours: '06:30 - 17:00',
    commonSymptoms: ['mượn xe lăn', 'chăm sóc khách hàng', 'đặt lịch', 'hỗ trợ xe lăn', 'khiếu nại', 'người già'],
    color: '#6366f1'
  },

  // --- TÒA K1 (A) - TẦNG 2 ---
  {
    id: 'dept_internal',
    name: 'Phòng Khám Nội Tổng Quát & Rối Loạn Chuyển Hóa',
    nameEn: 'General Internal Medicine Clinic',
    code: 'K1-201',
    category: 'clinical',
    buildingId: 'A',
    floorId: '2',
    description: 'Khám và điều trị các bệnh lý nội khoa, đái tháo đường, rối loạn lipid máu, sốt kéo dài, khám sức khỏe tổng quát định kỳ.',
    descriptionEn: 'General adult internal medicine, diabetes, metabolic disorders, regular health checks.',
    doctorInCharge: 'TS.BS. Lê Hoàng Minh',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['sốt', 'mệt mỏi', 'sụt cân', 'khám tổng quát', 'tiểu đường', 'tăng mỡ máu', 'gout', 'nội khoa'],
    color: '#0284c7'
  },
  {
    id: 'dept_cardiology',
    name: 'Phòng Khám Tim Mạch Bạch Mai & Đo Điện Tim (ECG)',
    nameEn: 'Cardiology Clinic & ECG Diagnostic',
    code: 'K1-204',
    category: 'clinical',
    buildingId: 'A',
    floorId: '2',
    description: 'Khám chuyên sâu bệnh lý mạch vành, tăng huyết áp, suy tim, đo điện tim 12 chuyển đạo tại chỗ, gắn Holter điện tâm đồ 24h.',
    descriptionEn: 'Coronary artery diseases, hypertension, heart failure, 12-lead ECG, 24h Holter monitoring.',
    doctorInCharge: 'PGS.TS.BS. Nguyễn Văn Hùng',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['đau ngực', 'hồi hộp', 'đánh trống ngực', 'tăng huyết áp', 'huyết áp cao', 'huyết áp thấp', 'khó thở khi nằm', 'tim mạch', 'đo điện tim'],
    color: '#e11d48'
  },
  {
    id: 'dept_gastro',
    name: 'Phòng Khám Tiêu Hóa & Gan Mật',
    nameEn: 'Gastroenterology & Hepatobiliary Clinic',
    code: 'K1-208',
    category: 'clinical',
    buildingId: 'A',
    floorId: '2',
    description: 'Khám bệnh lý viêm loét dạ dày, trào ngược GERD, viêm đại tràng, trĩ, viêm gan B/C mạn tính, gan nhiễm mỡ, men gan tăng cao.',
    descriptionEn: 'Gastric ulcers, GERD, colitis, hepatitis B/C, fatty liver, gallbladder diagnostics.',
    doctorInCharge: 'BS.CKII. Phạm Thị Thúy Hà',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['đau bụng', 'đau dạ dày', 'ợ chua', 'ợ hơi', 'buồn nôn', 'trào ngược', 'tiêu chảy', 'táo bón', 'đi ngoài ra máu', 'men gan cao', 'viêm gan'],
    color: '#059669'
  },
  {
    id: 'dept_ortho',
    name: 'Phòng Khám Cơ Xương Khớp & Bó Bột Chấn Thương',
    nameEn: 'Orthopedics & Rheumatology Clinic',
    code: 'K1-212',
    category: 'clinical',
    buildingId: 'A',
    floorId: '2',
    description: 'Khám thoái hóa khớp gối/khớp háng, thoát vị đĩa đệm, đau thần kinh tọa, viêm khớp dạng thấp, nẹp cố định và bó bột chấn thương nhẹ.',
    descriptionEn: 'Osteoarthritis, disc herniation, sciatica, rheumatoid arthritis, fracture casting.',
    doctorInCharge: 'BS.CKI. Vũ Đình Trọng',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['đau khớp', 'đau lưng', 'đau cổ vai gáy', 'thoái hóa khớp gối', 'thoát vị đĩa đệm', 'tê chân', 'bong gân', 'gãy xương', 'chấn thương khớp', 'bó bột'],
    color: '#d97706'
  },

  // --- TÒA K1 (A) - TẦNG 3 ---
  {
    id: 'dept_pediatrics',
    name: 'Khoa Khám Nhi & Tiêm Chủng Vắc-Xin Cho Bé',
    nameEn: 'Pediatric Clinic & Child Immunization Center',
    code: 'K1-301',
    category: 'clinical',
    buildingId: 'A',
    floorId: '3',
    description: 'Khám chữa bệnh cho trẻ sơ sinh và trẻ nhỏ dưới 16 tuổi, phòng tiêm chủng vắc-xin có khu vui chơi theo dõi sau tiêm an toàn.',
    descriptionEn: 'General pediatrics for infants and children, child vaccine clinic with playground.',
    doctorInCharge: 'BS.CKII. Đặng Mỹ Linh',
    operatingHours: '07:00 - 17:30',
    commonSymptoms: ['trẻ sốt', 'bé ho', 'sổ mũi trẻ em', 'tiêu chảy trẻ em', 'khám nhi', 'tiêm phòng', 'vắc xin cho bé', 'biếng ăn', 'chậm lớn'],
    color: '#ec4899'
  },
  {
    id: 'dept_obgyn',
    name: 'Khoa Phụ Sản & Quản Lý Thai Sản Toàn Diện',
    nameEn: 'Obstetrics & Gynecology (OB-GYN)',
    code: 'K1-306',
    category: 'clinical',
    buildingId: 'A',
    floorId: '3',
    description: 'Khám thai định kỳ, sàng lọc dị tật thai nhi, khám phụ khoa, soi cổ tử cung, tầm soát ung thư cổ tử cung HPV/Pap smear.',
    descriptionEn: 'Prenatal care, fetal screening, gynecological exams, colposcopy, Pap smear HPV test.',
    doctorInCharge: 'BS.CKII. Ngô Thị Bích Vân',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['khám thai', 'siêu âm thai', 'chậm kinh', 'đau bụng dưới', 'khám phụ khoa', 'viêm nhiễm phụ khoa', 'tầm soát ung thư cổ tử cung'],
    color: '#f43f5e'
  },
  {
    id: 'dept_ent',
    name: 'Phòng Khám Tai Mũi Họng & Nội Soi Ống Mềm',
    nameEn: 'ENT Clinic & Flexible Video Endoscopy',
    code: 'K1-310',
    category: 'clinical',
    buildingId: 'A',
    floorId: '3',
    description: 'Nội soi tai mũi họng ống mềm không đau độ nét cao, điều trị viêm xoang, viêm họng mạn, viêm amidan, viêm tai giữa, khàn tiếng.',
    descriptionEn: 'Flexible video ENT endoscopy, sinusitis, chronic pharyngitis, tonsillitis, otitis media.',
    doctorInCharge: 'BS.CKI. Nguyễn Thành Trung',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['đau họng', 'nghẹt mũi', 'chảy mũi', 'đau tai', 'ù tai', 'khàn tiếng', 'nội soi tai mũi họng', 'viêm xoang', 'viêm amidan'],
    color: '#8b5cf6'
  },

  // --- TÒA K1 (A) - TẦNG 4 ---
  {
    id: 'dept_eye',
    name: 'Phòng Khám Mắt & Đo Thị Lực Khúc Xạ',
    nameEn: 'Ophthalmology & Refraction Clinic',
    code: 'K1-401',
    category: 'clinical',
    buildingId: 'A',
    floorId: '4',
    description: 'Khám mắt bằng máy sinh hiển vi hiện đại, đo thị lực khúc xạ điện tử, tầm soát đục thủy tinh thể, cườm nước (Glaucoma), viêm kết mạc.',
    descriptionEn: 'Microscopic eye exam, automated refraction, cataract & glaucoma screening, conjunctivitis.',
    doctorInCharge: 'BS.CKI. Mai Văn Toàn',
    operatingHours: '07:30 - 17:00',
    commonSymptoms: ['mờ mắt', 'đau mắt', 'đỏ mắt', 'chảy nước mắt', 'cận thị', 'đo kính', 'đục thủy tinh thể', 'cườm mắt'],
    color: '#06b6d4'
  },
  {
    id: 'dept_dental',
    name: 'Phòng Khám Răng Hàm Mặt Kỹ Thuật Cao',
    nameEn: 'Maxillofacial & Advanced Dental Clinic',
    code: 'K1-405',
    category: 'clinical',
    buildingId: 'A',
    floorId: '4',
    description: 'Khám điều trị sâu răng, viêm tủy, nhổ răng khôn không đau bằng sóng siêu âm Piezotome, lấy cao răng vô trùng, phục hình răng sứ.',
    descriptionEn: 'Cavity treatment, endodontics, painless wisdom tooth extraction, scaling, prosthetics.',
    doctorInCharge: 'BS.CKI. Lâm Quốc Toàn',
    operatingHours: '07:30 - 17:00',
    commonSymptoms: ['đau răng', 'sâu răng', 'nhổ răng', 'nhổ răng khôn', 'chảy máu chân răng', 'trám răng', 'lấy cao răng', 'niềng răng', 'sưng nướu'],
    color: '#14b8a6'
  },
  {
    id: 'dept_derma',
    name: 'Phòng Khám Da Liễu & Dị Ứng - Miễn Dịch Lâm Sàng',
    nameEn: 'Dermatology & Clinical Immunology Clinic',
    code: 'K1-410',
    category: 'clinical',
    buildingId: 'A',
    floorId: '4',
    description: 'Điều trị viêm da cơ địa, mề đay dị ứng mạn tính, vảy nến, mụn trứng cá nặng, nấm da, rụng tóc, test dị nguyên dị ứng.',
    descriptionEn: 'Atopic dermatitis, chronic urticaria, psoriasis, acne, allergy patch testing.',
    doctorInCharge: 'BS.CKI. Võ Kim Ngân',
    operatingHours: '07:30 - 16:30',
    commonSymptoms: ['ngứa da', 'nổi mề đay', 'dị ứng da', 'mụn trứng cá', 'nấm da', 'viêm da', 'vảy nến', 'rụng tóc', 'sạm da', 'dị nguyên'],
    color: '#f97316'
  },

  // --- TÒA K1 (A) - TẦNG 5 ---
  {
    id: 'dept_neuro',
    name: 'Phòng Khám Thần Kinh & Phòng Ngừa Đột Quỵ',
    nameEn: 'Neurology & Stroke Prevention Clinic',
    code: 'K1-501',
    category: 'clinical',
    buildingId: 'A',
    floorId: '5',
    description: 'Chẩn đoán và điều trị đau đầu Migraine mạn tính, rối loạn tiền đình, mất ngủ kéo dài, bệnh Parkinson, động kinh, sàng lọc nguy cơ đột quỵ não.',
    descriptionEn: 'Migraine, vestibular vertigo, chronic insomnia, Parkinson disease, epilepsy, stroke risk screening.',
    doctorInCharge: 'PGS.TS.BS. Bùi Quang Vinh',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['đau đầu', 'chóng mặt', 'rối loạn tiền đình', 'mất ngủ', 'tê bì chân tay', 'run tay', 'co giật nhẹ', 'suy giảm trí nhớ', 'liệt mặt', 'tiền đột quỵ'],
    color: '#6366f1'
  },
  {
    id: 'dept_onco',
    name: 'Trung Tâm Y Học Hạt Nhân & Ung Bướu - Hóa Trị Ban Ngày',
    nameEn: 'Nuclear Medicine, Oncology & Day Infusion',
    code: 'K1-508',
    category: 'clinical',
    buildingId: 'A',
    floorId: '5',
    description: 'Tầm soát ung thư sớm, hội chẩn đa chuyên khoa ung bướu, điều trị truyền hóa chất ban ngày, xạ trị và chăm sóc giảm nhẹ.',
    descriptionEn: 'Cancer screening, multidisciplinary oncology board, day chemotherapy infusions, palliative care.',
    doctorInCharge: 'TS.BS. Đinh Mạnh Cường',
    operatingHours: '07:00 - 17:00',
    commonSymptoms: ['tầm soát ung thư', 'khối u', 'nổi hạch', 'sụt cân không rõ nguyên nhân', 'truyền hóa chất', 'ung bướu', 'xạ trị'],
    color: '#a855f7'
  },

  // --- TÒA A1 (B) - TRUNG TÂM CẤP CỨU A9 & ĐỘT QUỴ & CHỐNG ĐỘC ---
  {
    id: 'dept_inpatient_admit',
    name: 'Quầy Tiếp Nhận Cấp Cứu A9 & Làm Thủ Tục Nhập Viện',
    nameEn: 'A9 Emergency Reception & Inpatient Admission',
    code: 'A1-101',
    category: 'administration',
    buildingId: 'B',
    floorId: '1',
    description: 'Tiếp nhận bệnh nhân cấp cứu hỏa tốc 24/7 từ Cổng 2 Giải Phóng, làm hồ sơ nhập viện nội trú khẩn cấp, phân luồng Triage Đỏ-Vàng-Xanh.',
    descriptionEn: '24/7 Fast emergency intake from Gate 2, urgent admission paperwork, Triage Red-Yellow-Green sorting.',
    operatingHours: '24/7 Luôn mở cửa',
    commonSymptoms: ['nhập viện cấp cứu', 'thủ tục khẩn cấp', 'hồ sơ bệnh án a9', 'cấp cứu 24/7'],
    color: '#0284c7'
  },
  {
    id: 'dept_stroke_er',
    name: 'Đơn Vị Can Thiệp Đột Quỵ Não Cấp Giờ Vàng A9',
    nameEn: 'A9 Emergency Stroke Intervention Unit',
    code: 'A1-105',
    category: 'emergency',
    buildingId: 'B',
    floorId: '1',
    description: 'Đơn vị can thiệp tiêu sợi huyết tĩnh mạch (rTPA) và lấy huyết khối cơ học bằng dụng cụ trong khung giờ vàng 4.5h - 6h cho bệnh nhân đột quỵ não.',
    descriptionEn: 'Thrombolytic therapy (rTPA) and mechanical thrombectomy for acute ischemic stroke during golden hours.',
    doctorInCharge: 'PGS.TS.BS. Mai Duy Tôn',
    operatingHours: '24/7 Cấp cứu hỏa tốc',
    commonSymptoms: ['đột quỵ', 'liệt nửa người', 'méo miệng', 'nói ngọng', 'yếu tay chân đột ngột', 'tai biến mạch máu não', 'giờ vàng đột quỵ'],
    color: '#dc2626'
  },
  {
    id: 'dept_er_pharmacy',
    name: 'Nhà Thuốc Cấp Cứu A9 24/7',
    nameEn: 'A9 Emergency 24/7 Pharmacy',
    code: 'A1-108',
    category: 'pharmacy_cashier',
    buildingId: 'B',
    floorId: '1',
    description: 'Cung cấp thuốc cấp cứu khẩn cấp, huyết thanh kháng nọc độc, thuốc tim mạch và hồi sức tích cực liên tục 24/24.',
    descriptionEn: '24/7 emergency medications, antivenom serums, cardiac resuscitation drugs.',
    operatingHours: '24/7 Liên tục',
    commonSymptoms: ['mua thuốc cấp cứu', 'thuốc chống độc', 'huyết thanh'],
    color: '#10b981'
  },
  {
    id: 'dept_surgery_suite',
    name: 'Trung Tâm Chống Độc Quốc Gia Bạch Mai',
    nameEn: 'Bach Mai National Poison Control Center',
    code: 'A1-201',
    category: 'emergency',
    buildingId: 'B',
    floorId: '2',
    description: 'Trung tâm chống độc đầu ngành quốc gia: Cấp cứu ngộ độc thực phẩm nặng, ngộ độc thuốc bảo vệ thực vật, rắn độc cắn, ngộ độc cồn công nghiệp Methanol, lọc máu hấp phụ than hoạt.',
    descriptionEn: 'National Poison Center: Severe food poisoning, pesticides, snake bites, methanol toxicity, charcoal hemoperfusion.',
    doctorInCharge: 'TS.BS. Nguyễn Trung Nguyên',
    operatingHours: '24/7 Khẩn cấp',
    commonSymptoms: ['ngộ độc thực phẩm', 'uống nhầm thuốc trừ sâu', 'rắn cắn', 'ngộ độc rượu', 'methanol', 'ngộ độc hóa chất', 'súc ruột'],
    color: '#dc2626'
  },
  {
    id: 'dept_icu',
    name: 'Trung Tâm Hồi Sức Tích Cực (ICU) Bạch Mai',
    nameEn: 'Intensive Care Unit (ICU) Bach Mai',
    code: 'A1-301',
    category: 'surgical',
    buildingId: 'B',
    floorId: '3',
    description: 'Hồi sức chuyên sâu bệnh nhân suy đa tạng, sốc nhiễm khuẩn, viêm phổi ARDS thở máy bảo vệ phổi, tim phổi nhân tạo ECMO, lọc máu liên tục CRRT.',
    descriptionEn: 'Specialized critical care, multi-organ failure, ARDS mechanical ventilation, ECMO, continuous CRRT dialysis.',
    operatingHours: '24/7 (Thăm bệnh: 11h30-12h30 & 17h00-18h00)',
    commonSymptoms: ['hồi sức cấp cứu', 'icu', 'thở máy', 'lọc máu liên tục', 'ecmo', 'sốc nhiễm khuẩn', 'thăm bệnh nhân nặng'],
    color: '#e11d48'
  },
  {
    id: 'dept_ward_4',
    name: 'Khoa Phẫu Thuật Cấp Cứu & Ngoại Chấn Thương',
    nameEn: 'Emergency Surgery & Trauma Theater Suite',
    code: 'A1-401',
    category: 'surgical',
    buildingId: 'B',
    floorId: '4',
    description: 'Phòng mổ cấp cứu ngoại khoa vô trùng 24/7 xử trí đa chấn thương, vỡ tạng, chảy máu nội tạng, phẫu thuật thần kinh sọ não cấp cứu.',
    descriptionEn: '24/7 sterile trauma operating rooms for acute polytrauma, visceral rupture, emergency neurosurgery.',
    operatingHours: '24/7',
    commonSymptoms: ['mổ cấp cứu', 'phẫu thuật chấn thương', 'mổ sọ não cấp cứu', 'vết thương hở'],
    color: '#0891b2'
  },

  // --- TÒA C - TRUNG TÂM CHẨN ĐOÁN HÌNH ẢNH & XÉT NGHIỆM ---
  {
    id: 'dept_lab',
    name: 'Trung Tâm Lấy Máu & Bệnh Phẩm Tự Động Bạch Mai',
    nameEn: 'Automated Blood & Sample Laboratory',
    code: 'C-102',
    category: 'diagnostic',
    buildingId: 'C',
    floorId: '1',
    description: 'Hệ thống lấy mẫu máu bằng ống chân không tự động dán barcode, xét nghiệm huyết học, sinh hóa máu, miễn dịch, đông máu tự động trả kết quả nhanh qua SMS/App.',
    descriptionEn: 'Automated barcode vacuum blood sampling, hematology, biochemistry, digital results via SMS.',
    operatingHours: '05:30 - 18:30 (24/7 cho cấp cứu)',
    phoneExtension: '122',
    commonSymptoms: ['lấy máu', 'xét nghiệm máu', 'xét nghiệm nước tiểu', 'thử máu', 'xét nghiệm men gan', 'xét nghiệm mỡ máu', 'xét nghiệm đường huyết', 'nhận kết quả xét nghiệm'],
    color: '#8b5cf6'
  },
  {
    id: 'dept_xray',
    name: 'Phòng Chụp X-Quang Kỹ Thuật Số (DR-01 / DR-02)',
    nameEn: 'Digital Radiography (DR X-Ray)',
    code: 'C-106',
    category: 'diagnostic',
    buildingId: 'C',
    floorId: '1',
    description: 'Chụp X-quang tim phổi thẳng/nghiêng, X-quang xương khớp, cột sống, xoang sọ giảm liều tia X an toàn, hình ảnh truyền trực tiếp lên hệ thống PACS.',
    descriptionEn: 'Digital chest, bone, joint, and spine radiography integrated with PACS digital imaging.',
    operatingHours: '06:00 - 18:00 (24/7 cho cấp cứu)',
    phoneExtension: '126',
    commonSymptoms: ['chụp x quang', 'chụp phổi', 'chụp xương', 'x-quang gãy xương', 'chụp cột sống', 'chụp xquang', 'pacs'],
    color: '#6366f1'
  },
  {
    id: 'dept_mri_ct',
    name: 'Trung Tâm Chụp CT-Scanner 512 Dãy & MRI 3.0 Tesla',
    nameEn: 'Advanced CT-Scanner 512 & 3.0T MRI Suite',
    code: 'C-202',
    category: 'diagnostic',
    buildingId: 'C',
    floorId: '2',
    description: 'Chụp CT-Scanner 512 dãy tầm soát mạch vành và đột quỵ cấp chỉ trong vài giây. Chụp Cộng hưởng từ MRI 3.0 Tesla độ phân giải siêu cao sọ não, mạch máu, cột sống, ổ bụng.',
    descriptionEn: '512-slice CT scanner for coronary & acute stroke scans, high-resolution 3.0T MRI suite.',
    operatingHours: '06:30 - 21:00 (24/7 cho cấp cứu đột quỵ)',
    phoneExtension: '222',
    commonSymptoms: ['chụp ct', 'chụp cắt lớp', 'chụp mri', 'chụp cộng hưởng từ', 'chụp sọ não', 'chụp mạch máu não', 'chụp đĩa đệm mri', 'chụp cột sống mri'],
    color: '#7c3aed'
  },
  {
    id: 'dept_endoscopy_us',
    name: 'Trung Tâm Nội Soi Tiêu Hóa Việt Nam - Nhật Bản',
    nameEn: 'Vietnam - Japan Digestive Endoscopy Center',
    code: 'C-301',
    category: 'diagnostic',
    buildingId: 'C',
    floorId: '3',
    description: 'Nội soi dạ dày và đại tràng tiền mê không đau bằng hệ thống máy soi phóng đại NBI thế hệ mới phát hiện sớm ung thư đường tiêu hóa, cắt polyp qua nội soi an toàn.',
    descriptionEn: 'Painless NBI magnifying gastrointestinal endoscopy, early cancer detection, endoscopic polypectomy.',
    operatingHours: '06:30 - 17:30',
    phoneExtension: '321',
    commonSymptoms: ['nội soi dạ dày', 'nội soi đại tràng', 'nội soi không đau', 'nội soi nbi', 'cắt polyp dạ dày', 'siêu âm bụng', 'siêu âm gan mật'],
    color: '#0284c7'
  }
];

// ==========================================
// DETAILED MAP NODES (Waypoints on Grid)
// Coordinate Space: x: 0..1000, y: 0..800
// ==========================================
export const MAP_NODES_DATA: MapNode[] = [
  // ================= TÒA K1 (A) - TẦNG B1 =================
  { id: 'node_a_b1_entrance', name: 'Cửa Hầm B1 & Lối Vào Bãi Xe Ngầm', nameEn: 'Basement B1 Parking Ramp', buildingId: 'A', floorId: 'B1', x: 120, y: 380, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_A_B1_ENTRY' },
  { id: 'node_a_b1_c1', name: 'Hành Lang Trung Tâm Hầm B1 K1', nameEn: 'B1 Central Corridor', buildingId: 'A', floorId: 'B1', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_a_b1_parking', name: 'Bãi Gửi Xe Ngầm Tòa K1', nameEn: 'Parking Garage K1', buildingId: 'A', floorId: 'B1', x: 200, y: 220, type: 'room', roomId: 'room_a_b102', isAccessible: true },
  { id: 'node_a_b1_canteen', name: 'Căn Tin Dinh Dưỡng Bạch Mai', nameEn: 'Bach Mai Cafeteria', buildingId: 'A', floorId: 'B1', x: 800, y: 220, type: 'canteen', roomId: 'room_a_b101', isAccessible: true },
  { id: 'node_a_b1_atm', name: 'Khu Vực Cây Rút Tiền ATM', nameEn: 'ATM Station', buildingId: 'A', floorId: 'B1', x: 800, y: 540, type: 'atm', roomId: 'room_a_b103', isAccessible: true },
  { id: 'node_a_b1_wc', name: 'Nhà Vệ Sinh Hầm B1', nameEn: 'Restroom B1', buildingId: 'A', floorId: 'B1', x: 280, y: 150, type: 'restroom', isAccessible: true },
  { id: 'node_a_b1_elev1', name: 'Thang Máy Tòa K1 (Trục 1)', nameEn: 'Elevator Tower K1 (1)', buildingId: 'A', floorId: 'B1', x: 420, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_b1_elev2', name: 'Thang Máy Tòa K1 (Trục 2 - Xe Lăn)', nameEn: 'Elevator Tower K1 (2 - Accessible)', buildingId: 'A', floorId: 'B1', x: 580, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_b1_stairs', name: 'Cầu Thang Bộ Tòa K1', nameEn: 'Staircase Tower K1', buildingId: 'A', floorId: 'B1', x: 500, y: 140, type: 'stairs', isAccessible: false },

  // ================= TÒA K1 (A) - TẦNG 1 (CÁC CỔNG VÀ SẢNH TIẾP ĐÓN) =================
  { id: 'node_bm_gate_1', name: 'Cổng 1 - 78 Giải Phóng (Cổng Chính)', nameEn: 'Gate 1 - 78 Giai Phong Main Entrance', buildingId: 'A', floorId: '1', x: 500, y: 740, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_GATE_1' },
  { id: 'node_bm_gate_2', name: 'Cổng 2 - Làn Cấp Cứu A9', nameEn: 'Gate 2 - A9 Fast Emergency Gate', buildingId: 'A', floorId: '1', x: 120, y: 740, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_GATE_2' },
  { id: 'node_a_1_main_gate', name: 'Sảnh Đón Tiếp Chính Tòa K1', nameEn: 'Building K1 Main Ground Entry', buildingId: 'A', floorId: '1', x: 500, y: 640, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_K1_ENTRY' },
  { id: 'node_a_1_lobby', name: 'Sảnh Chờ Tiếp Đón Trung Tâm', nameEn: 'Building K1 Central Lobby', buildingId: 'A', floorId: '1', x: 500, y: 520, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_A1_LOBBY' },
  { id: 'node_a_1_reception', name: 'Quầy Tiếp Đón BHYT & Kiosk', nameEn: 'Reception & Smart Triage', buildingId: 'A', floorId: '1', x: 200, y: 520, type: 'reception', roomId: 'dept_reception', isAccessible: true },
  { id: 'node_a_1_cashier', name: 'Quầy Thu Ngân & Viện Phí', nameEn: 'Cashier & Payment Desk', buildingId: 'A', floorId: '1', x: 800, y: 520, type: 'cashier', roomId: 'dept_cashier_a', isAccessible: true },
  { id: 'node_a_1_emergency', name: 'Phòng Cấp Cứu Sàng Lọc Ban Đầu', nameEn: 'Initial Triage & Urgent Care', buildingId: 'A', floorId: '1', x: 200, y: 380, type: 'emergency', roomId: 'dept_emergency', isAccessible: true, kioskCode: 'KIOSK_A1_ER' },
  { id: 'node_a_1_pharmacy', name: 'Nhà Thuốc Bệnh Viện Số 1', nameEn: 'Main Pharmacy No. 1', buildingId: 'A', floorId: '1', x: 800, y: 380, type: 'pharmacy', roomId: 'dept_pharmacy_a', isAccessible: true },
  { id: 'node_a_1_customercare', name: 'Phòng CSKH & Xe Lăn Miễn Phí', nameEn: 'Customer Care & Wheelchair Desk', buildingId: 'A', floorId: '1', x: 800, y: 220, type: 'room', roomId: 'room_a_110', isAccessible: true },
  { id: 'node_a_1_c_mid', name: 'Giao Lộ Hành Lang Chính', nameEn: 'Central Crossroad 1F Tower K1', buildingId: 'A', floorId: '1', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_a_1_elev1', name: 'Thang Máy K1 (Trục 1)', nameEn: 'Elevator K1 (1)', buildingId: 'A', floorId: '1', x: 420, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_1_elev2', name: 'Thang Máy K1 (Trục 2 - Xe Lăn)', nameEn: 'Elevator K1 (2 - Accessible)', buildingId: 'A', floorId: '1', x: 580, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_1_stairs', name: 'Cầu Thang Bộ Tòa K1', nameEn: 'Staircase Tower K1', buildingId: 'A', floorId: '1', x: 500, y: 140, type: 'stairs', isAccessible: false },
  { id: 'node_a_1_wc', name: 'Nhà Vệ Sinh Tầng 1', nameEn: 'Accessible Restrooms 1F', buildingId: 'A', floorId: '1', x: 280, y: 150, type: 'restroom', isAccessible: true },
  { id: 'node_a_1_atm', name: 'Cây ATM & Nước Uống Vô Trùng', nameEn: 'ATM & Water Station 1F', buildingId: 'A', floorId: '1', x: 720, y: 150, type: 'atm', isAccessible: true },
  { id: 'node_a_1_link_b', name: 'Lối Sang Tòa Cấp Cứu A9', nameEn: 'Walkway to A9 Emergency Building', buildingId: 'A', floorId: '1', x: 120, y: 150, type: 'corridor', isAccessible: true },
  { id: 'node_a_1_link_c', name: 'Lối Sang Tòa C Xét Nghiệm', nameEn: 'Walkway to Building C Labs', buildingId: 'A', floorId: '1', x: 880, y: 150, type: 'corridor', isAccessible: true },

  // ================= TÒA K1 (A) - TẦNG 2 =================
  { id: 'node_a_2_hall', name: 'Sảnh Chờ Khám Tầng 2', nameEn: 'Central Waiting Lounge 2F K1', buildingId: 'A', floorId: '2', x: 500, y: 380, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_A2_HALL' },
  { id: 'node_a_2_cardio', name: 'Phòng Khám Tim Mạch & Điện Tim ECG', nameEn: 'Cardiology Clinic & ECG', buildingId: 'A', floorId: '2', x: 200, y: 220, type: 'room', roomId: 'dept_cardiology', isAccessible: true },
  { id: 'node_a_2_internal', name: 'Phòng Khám Nội Tổng Quát', nameEn: 'Internal Medicine Clinic', buildingId: 'A', floorId: '2', x: 200, y: 540, type: 'room', roomId: 'dept_internal', isAccessible: true },
  { id: 'node_a_2_ortho', name: 'Phòng Khám Cơ Xương Khớp & Bó Bột', nameEn: 'Orthopedics Clinic', buildingId: 'A', floorId: '2', x: 800, y: 220, type: 'room', roomId: 'dept_ortho', isAccessible: true },
  { id: 'node_a_2_gastro', name: 'Phòng Khám Tiêu Hóa & Gan Mật', nameEn: 'Gastroenterology Clinic', buildingId: 'A', floorId: '2', x: 800, y: 540, type: 'room', roomId: 'dept_gastro', isAccessible: true },
  { id: 'node_a_2_elev1', name: 'Thang Máy K1 (Trục 1)', nameEn: 'Elevator K1 (1)', buildingId: 'A', floorId: '2', x: 420, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_2_elev2', name: 'Thang Máy K1 (Trục 2 - Xe Lăn)', nameEn: 'Elevator K1 (2 - Accessible)', buildingId: 'A', floorId: '2', x: 580, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_2_stairs', name: 'Cầu Thang Bộ Tòa K1', nameEn: 'Staircase Tower K1', buildingId: 'A', floorId: '2', x: 500, y: 140, type: 'stairs', isAccessible: false },
  { id: 'node_a_2_wc', name: 'Nhà Vệ Sinh Tầng 2', nameEn: 'Restroom 2F', buildingId: 'A', floorId: '2', x: 280, y: 150, type: 'restroom', isAccessible: true },
  { id: 'node_a_2_skybridge_c', name: 'Cầu Vượt Sang Tòa C Tầng 2', nameEn: 'Skybridge to Building C 2F', buildingId: 'A', floorId: '2', x: 920, y: 380, type: 'skybridge', isAccessible: true },

  // ================= TÒA K1 (A) - TẦNG 3 =================
  { id: 'node_a_3_hall', name: 'Sảnh Chờ Khám Tầng 3', nameEn: 'Central Waiting Lounge 3F K1', buildingId: 'A', floorId: '3', x: 500, y: 380, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_A3_HALL' },
  { id: 'node_a_3_pedia', name: 'Khoa Khám Nhi & Tiêm Chủng', nameEn: 'Pediatrics Clinic & Vaccines', buildingId: 'A', floorId: '3', x: 200, y: 220, type: 'room', roomId: 'dept_pediatrics', isAccessible: true },
  { id: 'node_a_3_obgyn', name: 'Khoa Phụ Sản & Quản Lý Thai Sản', nameEn: 'OB-GYN Clinic', buildingId: 'A', floorId: '3', x: 200, y: 540, type: 'room', roomId: 'dept_obgyn', isAccessible: true },
  { id: 'node_a_3_ent', name: 'Phòng Khám Tai Mũi Họng', nameEn: 'Flexible ENT Clinic', buildingId: 'A', floorId: '3', x: 800, y: 380, type: 'room', roomId: 'dept_ent', isAccessible: true },
  { id: 'node_a_3_elev1', name: 'Thang Máy K1 (Trục 1)', nameEn: 'Elevator K1 (1)', buildingId: 'A', floorId: '3', x: 420, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_3_elev2', name: 'Thang Máy K1 (Trục 2 - Xe Lăn)', nameEn: 'Elevator K1 (2 - Accessible)', buildingId: 'A', floorId: '3', x: 580, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_3_stairs', name: 'Cầu Thang Bộ Tòa K1', nameEn: 'Staircase Tower K1', buildingId: 'A', floorId: '3', x: 500, y: 140, type: 'stairs', isAccessible: false },
  { id: 'node_a_3_wc', name: 'Nhà Vệ Sinh & Phòng Mẹ Bé', nameEn: 'Restroom & Baby Care 3F', buildingId: 'A', floorId: '3', x: 280, y: 150, type: 'restroom', isAccessible: true },

  // ================= TÒA K1 (A) - TẦNG 4 =================
  { id: 'node_a_4_hall', name: 'Sảnh Chờ Khám Tầng 4', nameEn: 'Central Waiting Lounge 4F K1', buildingId: 'A', floorId: '4', x: 500, y: 380, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_A4_HALL' },
  { id: 'node_a_4_eye', name: 'Phòng Khám Mắt & Đo Khúc Xạ', nameEn: 'Ophthalmology Clinic', buildingId: 'A', floorId: '4', x: 200, y: 220, type: 'room', roomId: 'dept_eye', isAccessible: true },
  { id: 'node_a_4_dental', name: 'Phòng Khám Răng Hàm Mặt', nameEn: 'Dental Clinic', buildingId: 'A', floorId: '4', x: 200, y: 540, type: 'room', roomId: 'dept_dental', isAccessible: true },
  { id: 'node_a_4_derma', name: 'Phòng Khám Da Liễu & Dị Ứng', nameEn: 'Dermatology & Allergy', buildingId: 'A', floorId: '4', x: 800, y: 380, type: 'room', roomId: 'dept_derma', isAccessible: true },
  { id: 'node_a_4_elev1', name: 'Thang Máy K1 (Trục 1)', nameEn: 'Elevator K1 (1)', buildingId: 'A', floorId: '4', x: 420, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_4_elev2', name: 'Thang Máy K1 (Trục 2 - Xe Lăn)', nameEn: 'Elevator K1 (2 - Accessible)', buildingId: 'A', floorId: '4', x: 580, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_4_stairs', name: 'Cầu Thang Bộ Tòa K1', nameEn: 'Staircase Tower K1', buildingId: 'A', floorId: '4', x: 500, y: 140, type: 'stairs', isAccessible: false },
  { id: 'node_a_4_wc', name: 'Nhà Vệ Sinh Tầng 4', nameEn: 'Restroom 4F', buildingId: 'A', floorId: '4', x: 280, y: 150, type: 'restroom', isAccessible: true },

  // ================= TÒA K1 (A) - TẦNG 5 =================
  { id: 'node_a_5_hall', name: 'Sảnh Chờ Khám Tầng 5', nameEn: 'Central Waiting Lounge 5F K1', buildingId: 'A', floorId: '5', x: 500, y: 380, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_A5_HALL' },
  { id: 'node_a_5_neuro', name: 'Phòng Khám Thần Kinh & Đột Quỵ', nameEn: 'Neurology & Stroke Clinic', buildingId: 'A', floorId: '5', x: 200, y: 380, type: 'room', roomId: 'dept_neuro', isAccessible: true },
  { id: 'node_a_5_onco', name: 'Trung Tâm Y Học Hạt Nhân & Ung Bướu', nameEn: 'Oncology & Chemotherapy', buildingId: 'A', floorId: '5', x: 800, y: 380, type: 'room', roomId: 'dept_onco', isAccessible: true },
  { id: 'node_a_5_elev1', name: 'Thang Máy K1 (Trục 1)', nameEn: 'Elevator K1 (1)', buildingId: 'A', floorId: '5', x: 420, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_5_elev2', name: 'Thang Máy K1 (Trục 2 - Xe Lăn)', nameEn: 'Elevator K1 (2 - Accessible)', buildingId: 'A', floorId: '5', x: 580, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_a_5_stairs', name: 'Cầu Thang Bộ Tòa K1', nameEn: 'Staircase Tower K1', buildingId: 'A', floorId: '5', x: 500, y: 140, type: 'stairs', isAccessible: false },
  { id: 'node_a_5_wc', name: 'Nhà Vệ Sinh Tầng 5', nameEn: 'Restroom 5F', buildingId: 'A', floorId: '5', x: 280, y: 150, type: 'restroom', isAccessible: true },

  // ================= TÒA A1 (B) - TẦNG 1 (TRUNG TÂM CẤP CỨU A9 & ĐỘT QUỴ) =================
  { id: 'node_b_1_entrance', name: 'Sảnh Tiếp Nhận Cấp Cứu A9 24/7', nameEn: 'A9 Emergency 24/7 Intake Hall', buildingId: 'B', floorId: '1', x: 500, y: 650, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_A9_ENTRY' },
  { id: 'node_b_1_corridor', name: 'Hành Lang Phân Luồng Triage Cấp Cứu A9', nameEn: 'A9 Triage Central Corridor 1F', buildingId: 'B', floorId: '1', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_b_1_admit', name: 'Quầy Tiếp Nhận Cấp Cứu & Nhập Viện', nameEn: 'Emergency Admission Counter', buildingId: 'B', floorId: '1', x: 200, y: 380, type: 'reception', roomId: 'dept_inpatient_admit', isAccessible: true },
  { id: 'node_b_1_stroke', name: 'Đơn Vị Can Thiệp Đột Quỵ Não Giờ Vàng', nameEn: 'Acute Stroke Intervention Unit', buildingId: 'B', floorId: '1', x: 800, y: 380, type: 'emergency', roomId: 'dept_stroke_er', isAccessible: true },
  { id: 'node_b_1_pharmacy', name: 'Nhà Thuốc Cấp Cứu A9 24/7', nameEn: 'A9 Emergency Pharmacy', buildingId: 'B', floorId: '1', x: 800, y: 540, type: 'pharmacy', roomId: 'dept_er_pharmacy', isAccessible: true },
  { id: 'node_b_1_elev', name: 'Thang Máy Tòa A1 (Ưu Tiên Cáng Bệnh)', nameEn: 'A9 Medical Elevator (Gurney Priority)', buildingId: 'B', floorId: '1', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_b_1_stairs', name: 'Cầu Thang Bộ Tòa A1', nameEn: 'Staircase Building A1', buildingId: 'B', floorId: '1', x: 680, y: 230, type: 'stairs', isAccessible: false },
  { id: 'node_b_1_wc', name: 'Nhà Vệ Sinh Tòa A1', nameEn: 'Restroom Building A1 1F', buildingId: 'B', floorId: '1', x: 320, y: 230, type: 'restroom', isAccessible: true },

  // ================= TÒA A1 (B) - TẦNG 2 (TRUNG TÂM CHỐNG ĐỘC QUỐC GIA) =================
  { id: 'node_b_2_corridor', name: 'Hành Lang Trung Tâm Chống Độc Tầng 2', nameEn: 'Poison Control Corridor 2F', buildingId: 'B', floorId: '2', x: 500, y: 380, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_B2_POISON' },
  { id: 'node_b_2_poison', name: 'Trung Tâm Chống Độc Quốc Gia', nameEn: 'National Poison Center', buildingId: 'B', floorId: '2', x: 200, y: 380, type: 'emergency', roomId: 'dept_surgery_suite', isAccessible: true },
  { id: 'node_b_2_elev', name: 'Thang Máy Tòa A1', nameEn: 'Building A1 Elevator', buildingId: 'B', floorId: '2', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_b_2_stairs', name: 'Cầu Thang Bộ Tòa A1', nameEn: 'Staircase Building A1', buildingId: 'B', floorId: '2', x: 680, y: 230, type: 'stairs', isAccessible: false },

  // ================= TÒA A1 (B) - TẦNG 3 (HỒI SỨC TÍCH CỰC ICU) =================
  { id: 'node_b_3_corridor', name: 'Hành Lang Trung Tâm Hồi Sức ICU', nameEn: 'ICU Critical Corridor 3F', buildingId: 'B', floorId: '3', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_b_3_icu', name: 'Trung Tâm Hồi Sức Tích Cực ICU', nameEn: 'Intensive Care Unit', buildingId: 'B', floorId: '3', x: 200, y: 380, type: 'room', roomId: 'dept_icu', isAccessible: true },
  { id: 'node_b_3_elev', name: 'Thang Máy Tòa A1', nameEn: 'Building A1 Elevator', buildingId: 'B', floorId: '3', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_b_3_stairs', name: 'Cầu Thang Bộ Tòa A1', nameEn: 'Staircase Building A1', buildingId: 'B', floorId: '3', x: 680, y: 230, type: 'stairs', isAccessible: false },

  // ================= TÒA A1 (B) - TẦNG 4 (PHẪU THUẬT CẤP CỨU & NGOẠI CHẤN THƯƠNG) =================
  { id: 'node_b_4_corridor', name: 'Hành Lang Khu Phẫu Thuật Cấp Cứu', nameEn: 'Emergency Surgery Corridor 4F', buildingId: 'B', floorId: '4', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_b_4_ward', name: 'Khoa Phẫu Thuật Cấp Cứu & Chấn Thương', nameEn: 'Emergency Trauma Surgery', buildingId: 'B', floorId: '4', x: 200, y: 380, type: 'room', roomId: 'dept_ward_4', isAccessible: true },
  { id: 'node_b_4_elev', name: 'Thang Máy Tòa A1', nameEn: 'Building A1 Elevator', buildingId: 'B', floorId: '4', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_b_4_stairs', name: 'Cầu Thang Bộ Tòa A1', nameEn: 'Staircase Building A1', buildingId: 'B', floorId: '4', x: 680, y: 230, type: 'stairs', isAccessible: false },

  // ================= TÒA C - TẦNG 1 (CỔNG 3, XÉT NGHIỆM & X-QUANG) =================
  { id: 'node_bm_gate_3', name: 'Cổng 3 - Phố Phương Mai', nameEn: 'Gate 3 - Phuong Mai Street Entrance', buildingId: 'C', floorId: '1', x: 880, y: 740, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_GATE_3' },
  { id: 'node_c_1_entrance', name: 'Sảnh Vào Tòa C & Cổng 3', nameEn: 'Building C Ground Entrance', buildingId: 'C', floorId: '1', x: 500, y: 650, type: 'entrance', isAccessible: true, kioskCode: 'KIOSK_C1_ENTRY' },
  { id: 'node_c_1_corridor', name: 'Hành Lang Lấy Máu & Chẩn Đoán', nameEn: 'Diagnostic Corridor 1F Tower C', buildingId: 'C', floorId: '1', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_c_1_lab', name: 'Trung Tâm Lấy Máu & Bệnh Phẩm Tự Động', nameEn: 'Blood Sampling & Clinical Lab', buildingId: 'C', floorId: '1', x: 200, y: 380, type: 'lab', roomId: 'dept_lab', isAccessible: true },
  { id: 'node_c_1_xray', name: 'Phòng Chụp X-Quang Kỹ Thuật Số', nameEn: 'Digital X-Ray DR-01/02', buildingId: 'C', floorId: '1', x: 800, y: 380, type: 'imaging', roomId: 'dept_xray', isAccessible: true },
  { id: 'node_c_1_elev', name: 'Thang Máy Tòa C', nameEn: 'Building C Elevator', buildingId: 'C', floorId: '1', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_c_1_stairs', name: 'Cầu Thang Bộ Tòa C', nameEn: 'Staircase Building C', buildingId: 'C', floorId: '1', x: 680, y: 230, type: 'stairs', isAccessible: false },
  { id: 'node_c_1_wc', name: 'Nhà Vệ Sinh Tòa C', nameEn: 'Restroom Building C 1F', buildingId: 'C', floorId: '1', x: 320, y: 230, type: 'restroom', isAccessible: true },

  // ================= TÒA C - TẦNG 2 (CT-SCANNER, MRI & SKYBRIDGE) =================
  { id: 'node_c_2_corridor', name: 'Hành Lang Trung Tâm CT & MRI', nameEn: 'CT & MRI Corridor 2F', buildingId: 'C', floorId: '2', x: 500, y: 380, type: 'corridor', isAccessible: true, kioskCode: 'KIOSK_C2_MRI' },
  { id: 'node_c_2_mri_ct', name: 'Trung Tâm Chụp CT 512 Dãy & MRI 3.0T', nameEn: 'CT-Scanner 512 & 3.0T MRI', buildingId: 'C', floorId: '2', x: 240, y: 380, type: 'imaging', roomId: 'dept_mri_ct', isAccessible: true },
  { id: 'node_c_2_skybridge_a', name: 'Cầu Vượt Skybridge Sang Tòa K1', nameEn: 'Skybridge to Building K1 2F', buildingId: 'C', floorId: '2', x: 80, y: 380, type: 'skybridge', isAccessible: true },
  { id: 'node_c_2_elev', name: 'Thang Máy Tòa C', nameEn: 'Building C Elevator', buildingId: 'C', floorId: '2', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_c_2_stairs', name: 'Cầu Thang Bộ Tòa C', nameEn: 'Staircase Building C', buildingId: 'C', floorId: '2', x: 680, y: 230, type: 'stairs', isAccessible: false },

  // ================= TÒA C - TẦNG 3 (NỘI SOI TIÊU HÓA VIỆT - NHẬT) =================
  { id: 'node_c_3_corridor', name: 'Hành Lang Trung Tâm Nội Soi & Siêu Âm', nameEn: 'Endoscopy & Ultrasound Corridor 3F', buildingId: 'C', floorId: '3', x: 500, y: 380, type: 'corridor', isAccessible: true },
  { id: 'node_c_3_endoscopy', name: 'Trung Tâm Nội Soi Tiêu Hóa Việt - Nhật', nameEn: 'Vietnam - Japan Endoscopy Center', buildingId: 'C', floorId: '3', x: 240, y: 380, type: 'room', roomId: 'dept_endoscopy_us', isAccessible: true },
  { id: 'node_c_3_elev', name: 'Thang Máy Tòa C', nameEn: 'Building C Elevator', buildingId: 'C', floorId: '3', x: 500, y: 230, type: 'elevator', isAccessible: true },
  { id: 'node_c_3_stairs', name: 'Cầu Thang Bộ Tòa C', nameEn: 'Staircase Building C', buildingId: 'C', floorId: '3', x: 680, y: 230, type: 'stairs', isAccessible: false },
];

// ==========================================
// GRAPH EDGES (Corridors, Elevators, Stairs, Gates)
// ==========================================
export const MAP_EDGES_DATA: MapEdge[] = [
  // --- KẾT NỐI TỪ CỔNG VÀO (GATES) ---
  { fromNodeId: 'node_bm_gate_1', toNodeId: 'node_a_1_main_gate', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 5.0, audioLandmarkVi: 'Từ Cổng 1 (78 Giải Phóng) đi thẳng qua sân chính vào sảnh Tòa K1, có đường dốc cho xe lăn và vạch xúc giác', audioLandmarkEn: 'From Gate 1 (78 Giai Phong) straight across courtyard into Tower K1 lobby with tactile path' },
  { fromNodeId: 'node_bm_gate_2', toNodeId: 'node_a_1_emergency', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 4.5, audioLandmarkVi: 'Từ Cổng 2 Giải Phóng theo làn ưu tiên rẽ vào phòng Cấp cứu sàng lọc ban đầu K1', audioLandmarkEn: 'From Gate 2 along fast emergency lane into K1 initial triage' },
  { fromNodeId: 'node_bm_gate_2', toNodeId: 'node_b_1_entrance', distance: 15, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 4.5, audioLandmarkVi: 'Từ Cổng 2 Giải Phóng theo làn ưu tiên cấp cứu dẫn thẳng vào Sảnh Cấp Cứu A9 24/7', audioLandmarkEn: 'From Gate 2 directly into A9 24/7 Emergency Intake Hall' },
  { fromNodeId: 'node_bm_gate_3', toNodeId: 'node_c_1_entrance', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 4.0, audioLandmarkVi: 'Từ Cổng 3 (Phố Phương Mai) đi qua lối bãi xe vào thẳng Sảnh Tòa C Xét Nghiệm & X-Quang', audioLandmarkEn: 'From Gate 3 (Phuong Mai St) past parking into Building C diagnostic lobby' },

  // --- TÒA K1 (A) - TẦNG B1 ---
  { fromNodeId: 'node_a_b1_entrance', toNodeId: 'node_a_b1_c1', distance: 15, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Đi qua cửa trượt tự động tầng hầm K1, sàn gạch men chống trượt có vạch dẫn hướng', audioLandmarkEn: 'Passing basement automatic slider door, anti-slip tiles with tactile paving' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_parking', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 4.0, audioLandmarkVi: 'Rẽ về phía bãi giữ xe máy và ô tô ngầm Tòa K1', audioLandmarkEn: 'Turn towards basement K1 parking garage' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_canteen', distance: 16, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Đi thẳng theo mùi thơm quầy bánh mì & cơm dinh dưỡng căn-tin bệnh viện Bạch Mai', audioLandmarkEn: 'Go straight following food aroma from Bach Mai hospital cafeteria' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_atm', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Nghe tiếng máy rút tiền ATM Vietcombank / BIDV bên trái', audioLandmarkEn: 'Audio cue: Bank ATM station on your left' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_wc', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Lối vào nhà vệ sinh hầm B1 có gờ nổi cảm ứng', audioLandmarkEn: 'Restroom entrance with tactile floor threshold' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_elev1', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Cửa thang máy Tòa K1 số 1 có âm báo ding dong', audioLandmarkEn: 'Elevator 1 door with audible ding chime' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_elev2', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy K1 số 2 khoang rộng chuyên dụng xe lăn và băng ca', audioLandmarkEn: 'Elevator 2 wide accessible carriage with voice prompts' },
  { fromNodeId: 'node_a_b1_c1', toNodeId: 'node_a_b1_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ có tay vịn inox hai bên', audioLandmarkEn: 'Staircase with handrails and warning steps' },

  // --- TÒA K1 (A) - TẦNG 1 ---
  { fromNodeId: 'node_a_1_main_gate', toNodeId: 'node_a_1_lobby', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 4.5, audioLandmarkVi: 'Qua cửa chính sảnh Tòa K1, có thảm chống trượt và gờ xúc giác dẫn vào sảnh tiếp đón trung tâm', audioLandmarkEn: 'Passing main entrance with tactile guidance path into central lobby' },
  { fromNodeId: 'node_a_1_lobby', toNodeId: 'node_a_1_reception', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.5, audioLandmarkVi: 'Âm thanh loa gọi số tự động tại Quầy Tiếp đón BHYT và cụm Kiosk thông minh K1-101', audioLandmarkEn: 'Audio cue: Central reception queue voice announcement and smart kiosks' },
  { fromNodeId: 'node_a_1_lobby', toNodeId: 'node_a_1_cashier', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Quầy Thu ngân & Thanh toán viện phí K1-105 nằm chếch phía bên phải sảnh', audioLandmarkEn: 'Cashier & payment counters K1-105 to your right' },
  { fromNodeId: 'node_a_1_lobby', toNodeId: 'node_a_1_c_mid', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.5, audioLandmarkVi: 'Đi dọc hành lang chính giữa Tòa K1, sàn phẳng rộng thoáng', audioLandmarkEn: 'Straight along main center corridor of Tower K1' },
  { fromNodeId: 'node_a_1_lobby', toNodeId: 'node_a_1_customercare', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Khu vực quầy Chăm sóc khách hàng và mượn xe lăn miễn phí K1-110', audioLandmarkEn: 'Customer care lounge and wheelchair assistance desk' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_emergency', distance: 18, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.8, audioLandmarkVi: 'Lối sang Phòng phân luồng sàng lọc cấp cứu ban đầu K1-100 có vạch sơn đỏ ưu tiên', audioLandmarkEn: 'Path to K1 initial triage with red tactile guidance lines' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_pharmacy', distance: 16, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Đi về phía Nhà thuốc Bệnh viện Bạch Mai Số 1 K1-108, có bảng điện tử lấy số nhận thuốc', audioLandmarkEn: 'Towards Bach Mai Pharmacy No. 1 with digital display chime' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_elev1', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Cửa thang máy Tòa K1 trục 1 có chữ nổi Braille', audioLandmarkEn: 'Elevator 1 with Braille buttons and voice floor cue' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_elev2', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy K1 trục 2 ưu tiên xe lăn và người khiếm thị', audioLandmarkEn: 'Elevator 2 accessible priority with voice prompts' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_stairs', distance: 8, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ lên tầng 2 Tòa K1 có gờ cảnh báo xúc giác', audioLandmarkEn: 'Stairs to 2F with warning tactile tiles' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_wc', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh tầng 1 có phòng riêng cho xe lăn', audioLandmarkEn: '1F Accessible restrooms' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_atm', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Khu vực máy ATM và cây nước lọc vô trùng miễn phí', audioLandmarkEn: 'ATM and sterile water station' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_link_b', distance: 22, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Hành lang sân vườn có mái che nối sang Trung tâm Cấp cứu A9 (Tòa A1)', audioLandmarkEn: 'Covered walkway connecting to A9 Emergency Building' },
  { fromNodeId: 'node_a_1_c_mid', toNodeId: 'node_a_1_link_c', distance: 22, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Hành lang tầng trệt nối sang Tòa C Trung tâm Xét nghiệm & Chẩn đoán hình ảnh', audioLandmarkEn: 'Covered walkway connecting to Building C Laboratories' },

  // --- TÒA K1 (A) - TẦNG 2 ---
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_internal', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Đi về phía Phòng Khám Nội Tổng Quát K1-201 bên tay trái', audioLandmarkEn: 'Towards Internal Medicine Clinic K1-201 on your left' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_cardio', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Tim Mạch & Điện Tim K1-204, có loa gọi bệnh nhân tự động', audioLandmarkEn: 'Cardiology Clinic K1-204 with queue voice' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_gastro', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Tiêu Hóa & Gan Mật K1-208 bên tay phải hành lang', audioLandmarkEn: 'Gastroenterology K1-208 on corridor right' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_ortho', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Cơ Xương Khớp & Bó Bột K1-212', audioLandmarkEn: 'Orthopedics Clinic K1-212' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_elev1', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Khu thang máy số 1 Tầng 2 Tòa K1', audioLandmarkEn: 'Elevator 1 landing 2F' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_elev2', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Khu thang máy số 2 xe lăn Tầng 2', audioLandmarkEn: 'Elevator 2 accessible landing 2F' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_stairs', distance: 8, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa K1 Tầng 2', audioLandmarkEn: 'Staircase 2F' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_wc', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh Tầng 2', audioLandmarkEn: 'Restroom 2F' },
  { fromNodeId: 'node_a_2_hall', toNodeId: 'node_a_2_skybridge_c', distance: 25, type: 'skybridge', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Cầu vượt đi bộ trên cao lát kính nối sang Tòa C Tầng 2 (Chụp CT 512 dãy & MRI 3.0T)', audioLandmarkEn: 'Glass skybridge to Building C 2F (CT & MRI Center)' },

  // --- TÒA K1 (A) - TẦNG 3 ---
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_pedia', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Khoa Khám Nhi & Tiêm Chủng Vắc-xin K1-301, nghe tiếng nhạc thiếu nhi và khu vui chơi trẻ em', audioLandmarkEn: 'Pediatrics Clinic K1-301 with child playground music' },
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_obgyn', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Khoa Phụ Sản & Quản Lý Thai Sản K1-306', audioLandmarkEn: 'OB-GYN Clinic K1-306' },
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_ent', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Tai Mũi Họng Ống Mềm K1-310', audioLandmarkEn: 'ENT Clinic K1-310' },
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_elev1', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy 1 Tầng 3', audioLandmarkEn: 'Elevator 1 3F' },
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_elev2', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy 2 xe lăn Tầng 3', audioLandmarkEn: 'Elevator 2 3F' },
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_stairs', distance: 8, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 3', audioLandmarkEn: 'Staircase 3F' },
  { fromNodeId: 'node_a_3_hall', toNodeId: 'node_a_3_wc', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh & Phòng chăm sóc mẹ bé Tầng 3', audioLandmarkEn: 'Restroom & Baby Care 3F' },

  // --- TÒA K1 (A) - TẦNG 4 ---
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_eye', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Mắt & Đo Khúc Xạ K1-401', audioLandmarkEn: 'Ophthalmology Clinic K1-401' },
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_dental', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Răng Hàm Mặt K1-405', audioLandmarkEn: 'Dental Clinic K1-405' },
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_derma', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Da Liễu & Dị Ứng Miễn Dịch K1-410', audioLandmarkEn: 'Dermatology Clinic K1-410' },
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_elev1', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy 1 Tầng 4', audioLandmarkEn: 'Elevator 1 4F' },
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_elev2', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy 2 xe lăn Tầng 4', audioLandmarkEn: 'Elevator 2 4F' },
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_stairs', distance: 8, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 4', audioLandmarkEn: 'Staircase 4F' },
  { fromNodeId: 'node_a_4_hall', toNodeId: 'node_a_4_wc', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh Tầng 4', audioLandmarkEn: 'Restroom 4F' },

  // --- TÒA K1 (A) - TẦNG 5 ---
  { fromNodeId: 'node_a_5_hall', toNodeId: 'node_a_5_neuro', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Phòng Khám Thần Kinh & Phòng Ngừa Đột Quỵ K1-501', audioLandmarkEn: 'Neurology Clinic K1-501' },
  { fromNodeId: 'node_a_5_hall', toNodeId: 'node_a_5_onco', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Trung Tâm Y Học Hạt Nhân & Ung Bướu - Hóa Trị Ban Ngày K1-508', audioLandmarkEn: 'Oncology Unit K1-508' },
  { fromNodeId: 'node_a_5_hall', toNodeId: 'node_a_5_elev1', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy 1 Tầng 5', audioLandmarkEn: 'Elevator 1 5F' },
  { fromNodeId: 'node_a_5_hall', toNodeId: 'node_a_5_elev2', distance: 6, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy 2 xe lăn Tầng 5', audioLandmarkEn: 'Elevator 2 5F' },
  { fromNodeId: 'node_a_5_hall', toNodeId: 'node_a_5_stairs', distance: 8, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 5', audioLandmarkEn: 'Staircase 5F' },
  { fromNodeId: 'node_a_5_hall', toNodeId: 'node_a_5_wc', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh Tầng 5', audioLandmarkEn: 'Restroom 5F' },

  // --- TÒA A1 (B) - CẤP CỨU A9, CHỐNG ĐỘC, ICU ---
  { fromNodeId: 'node_b_1_entrance', toNodeId: 'node_b_1_corridor', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.5, audioLandmarkVi: 'Sảnh vào Trung tâm Cấp cứu A9 24/7', audioLandmarkEn: 'Building A1 A9 entrance hall' },
  { fromNodeId: 'node_b_1_corridor', toNodeId: 'node_b_1_admit', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Quầy tiếp nhận cấp cứu & làm thủ tục nhập viện A1-101', audioLandmarkEn: 'Emergency admission desk A1-101' },
  { fromNodeId: 'node_b_1_corridor', toNodeId: 'node_b_1_stroke', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Đơn Vị Can Thiệp Đột Quỵ Não Cấp Giờ Vàng A1-105', audioLandmarkEn: 'Acute Stroke Intervention Unit A1-105' },
  { fromNodeId: 'node_b_1_corridor', toNodeId: 'node_b_1_pharmacy', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Nhà thuốc Cấp cứu A9 24/7 A1-108', audioLandmarkEn: 'A9 Emergency Pharmacy A1-108' },
  { fromNodeId: 'node_b_1_corridor', toNodeId: 'node_b_1_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy chuyên dụng giường bệnh & cáng cứu thương Tòa A1', audioLandmarkEn: 'Building A1 medical elevator' },
  { fromNodeId: 'node_b_1_corridor', toNodeId: 'node_b_1_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1', audioLandmarkEn: 'Building A1 staircase' },
  { fromNodeId: 'node_b_1_corridor', toNodeId: 'node_b_1_wc', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh Tòa A1 Tầng 1', audioLandmarkEn: 'Building A1 1F restroom' },

  { fromNodeId: 'node_b_2_corridor', toNodeId: 'node_b_2_poison', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Trung Tâm Chống Độc Quốc Gia Bạch Mai A1-201', audioLandmarkEn: 'National Poison Center A1-201' },
  { fromNodeId: 'node_b_2_corridor', toNodeId: 'node_b_2_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy Tòa A1 Tầng 2', audioLandmarkEn: 'Building A1 2F elevator' },
  { fromNodeId: 'node_b_2_corridor', toNodeId: 'node_b_2_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1 Tầng 2', audioLandmarkEn: 'Building A1 2F staircase' },

  { fromNodeId: 'node_b_3_corridor', toNodeId: 'node_b_3_icu', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Trung Tâm Hồi Sức Tích Cực ICU Bạch Mai A1-301, khu vực vô trùng cao', audioLandmarkEn: 'ICU Critical Care A1-301 sterile zone' },
  { fromNodeId: 'node_b_3_corridor', toNodeId: 'node_b_3_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy Tòa A1 Tầng 3', audioLandmarkEn: 'Building A1 3F elevator' },
  { fromNodeId: 'node_b_3_corridor', toNodeId: 'node_b_3_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1 Tầng 3', audioLandmarkEn: 'Building A1 3F staircase' },

  { fromNodeId: 'node_b_4_corridor', toNodeId: 'node_b_4_ward', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Khoa Phẫu Thuật Cấp Cứu & Ngoại Chấn Thương A1-401', audioLandmarkEn: 'Emergency Surgery A1-401' },
  { fromNodeId: 'node_b_4_corridor', toNodeId: 'node_b_4_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy Tòa A1 Tầng 4', audioLandmarkEn: 'Building A1 4F elevator' },
  { fromNodeId: 'node_b_4_corridor', toNodeId: 'node_b_4_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1 Tầng 4', audioLandmarkEn: 'Building A1 4F staircase' },

  // --- TÒA C - XÉT NGHIỆM, CT/MRI, NỘI SOI ---
  { fromNodeId: 'node_c_1_entrance', toNodeId: 'node_c_1_corridor', distance: 10, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Sảnh vào Tòa C Khối Xét nghiệm & Chẩn đoán hình ảnh', audioLandmarkEn: 'Building C diagnostic entrance' },
  { fromNodeId: 'node_c_1_corridor', toNodeId: 'node_c_1_lab', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Trung tâm Lấy máu & Bệnh phẩm tự động C-102, loa đọc số tự động', audioLandmarkEn: 'Blood sampling & clinical lab C-102 queue chime' },
  { fromNodeId: 'node_c_1_corridor', toNodeId: 'node_c_1_xray', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Phòng Chụp X-Quang Kỹ thuật số DR C-106', audioLandmarkEn: 'Digital X-Ray C-106' },
  { fromNodeId: 'node_c_1_corridor', toNodeId: 'node_c_1_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy Tòa C Tầng 1', audioLandmarkEn: 'Building C 1F elevator' },
  { fromNodeId: 'node_c_1_corridor', toNodeId: 'node_c_1_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa C Tầng 1', audioLandmarkEn: 'Building C 1F staircase' },
  { fromNodeId: 'node_c_1_corridor', toNodeId: 'node_c_1_wc', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 2.2, audioLandmarkVi: 'Nhà vệ sinh Tòa C Tầng 1', audioLandmarkEn: 'Building C 1F restroom' },

  { fromNodeId: 'node_c_2_corridor', toNodeId: 'node_c_2_mri_ct', distance: 12, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Trung tâm CT-Scanner 512 dãy & MRI 3.0 Tesla C-202', audioLandmarkEn: 'CT 512 & 3.0T MRI Center C-202' },
  { fromNodeId: 'node_c_2_corridor', toNodeId: 'node_c_2_skybridge_a', distance: 15, type: 'skybridge', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Lối vào Cầu vượt kính Skybridge nối sang Tòa K1 Tầng 2', audioLandmarkEn: 'Skybridge entry connecting to Building K1 2F' },
  { fromNodeId: 'node_c_2_corridor', toNodeId: 'node_c_2_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy Tòa C Tầng 2', audioLandmarkEn: 'Building C 2F elevator' },
  { fromNodeId: 'node_c_2_corridor', toNodeId: 'node_c_2_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa C Tầng 2', audioLandmarkEn: 'Building C 2F staircase' },

  { fromNodeId: 'node_c_3_corridor', toNodeId: 'node_c_3_endoscopy', distance: 14, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Trung tâm Nội soi Tiêu hóa Việt Nam - Nhật Bản C-301', audioLandmarkEn: 'Vietnam - Japan Endoscopy Center C-301' },
  { fromNodeId: 'node_c_3_corridor', toNodeId: 'node_c_3_elev', distance: 8, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy Tòa C Tầng 3', audioLandmarkEn: 'Building C 3F elevator' },
  { fromNodeId: 'node_c_3_corridor', toNodeId: 'node_c_3_stairs', distance: 10, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa C Tầng 3', audioLandmarkEn: 'Building C 3F staircase' },

  // ================= INTER-BUILDING CONNECTIONS =================
  { fromNodeId: 'node_a_1_link_b', toNodeId: 'node_b_1_entrance', distance: 30, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.5, audioLandmarkVi: 'Hành lang sân vườn nối Tòa K1 và Tòa Cấp Cứu A9', audioLandmarkEn: 'Garden corridor connecting Tower K1 and A9 Emergency' },
  { fromNodeId: 'node_a_1_link_c', toNodeId: 'node_c_1_entrance', distance: 28, type: 'walk', isAccessible: true, hasSteps: false, widthMeters: 3.5, audioLandmarkVi: 'Hành lang nối Tòa K1 và Tòa C Xét nghiệm & Chẩn đoán hình ảnh', audioLandmarkEn: 'Walkway connecting Tower K1 and Building C' },
  { fromNodeId: 'node_a_2_skybridge_c', toNodeId: 'node_c_2_skybridge_a', distance: 35, type: 'skybridge', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Cầu vượt kính tầng 2 vượt sân nội bộ, sàn bằng phẳng có lan can tay vịn', audioLandmarkEn: 'Glass skybridge across courtyard, completely flat surface' },

  // ================= VERTICAL ELEVATOR CONNECTIONS (TÒA K1 - A) =================
  { fromNodeId: 'node_a_b1_elev1', toNodeId: 'node_a_1_elev1', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Thang máy di chuyển giữa Tầng B1 và Tầng 1', audioLandmarkEn: 'Elevator moving between B1 and 1F' },
  { fromNodeId: 'node_a_1_elev1', toNodeId: 'node_a_2_elev1', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Thang máy di chuyển giữa Tầng 1 và Tầng 2', audioLandmarkEn: 'Elevator moving between 1F and 2F' },
  { fromNodeId: 'node_a_2_elev1', toNodeId: 'node_a_3_elev1', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Thang máy di chuyển giữa Tầng 2 và Tầng 3', audioLandmarkEn: 'Elevator moving between 2F and 3F' },
  { fromNodeId: 'node_a_3_elev1', toNodeId: 'node_a_4_elev1', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Thang máy di chuyển giữa Tầng 3 và Tầng 4', audioLandmarkEn: 'Elevator moving between 3F and 4F' },
  { fromNodeId: 'node_a_4_elev1', toNodeId: 'node_a_5_elev1', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.5, audioLandmarkVi: 'Thang máy di chuyển giữa Tầng 4 và Tầng 5', audioLandmarkEn: 'Elevator moving between 4F and 5F' },

  { fromNodeId: 'node_a_b1_elev2', toNodeId: 'node_a_1_elev2', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Thang máy xe lăn di chuyển giữa B1 và 1', audioLandmarkEn: 'Accessible elevator B1 to 1F' },
  { fromNodeId: 'node_a_1_elev2', toNodeId: 'node_a_2_elev2', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Thang máy xe lăn di chuyển giữa 1 và 2', audioLandmarkEn: 'Accessible elevator 1F to 2F' },
  { fromNodeId: 'node_a_2_elev2', toNodeId: 'node_a_3_elev2', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Thang máy xe lăn di chuyển giữa 2 và 3', audioLandmarkEn: 'Accessible elevator 2F to 3F' },
  { fromNodeId: 'node_a_3_elev2', toNodeId: 'node_a_4_elev2', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Thang máy xe lăn di chuyển giữa 3 và 4', audioLandmarkEn: 'Accessible elevator 3F to 4F' },
  { fromNodeId: 'node_a_4_elev2', toNodeId: 'node_a_5_elev2', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 2.8, audioLandmarkVi: 'Thang máy xe lăn di chuyển giữa 4 và 5', audioLandmarkEn: 'Accessible elevator 4F to 5F' },

  // ================= VERTICAL STAIR CONNECTIONS (TÒA K1 - A) =================
  { fromNodeId: 'node_a_b1_stairs', toNodeId: 'node_a_1_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ B1 lên Tầng 1' },
  { fromNodeId: 'node_a_1_stairs', toNodeId: 'node_a_2_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 1 lên Tầng 2' },
  { fromNodeId: 'node_a_2_stairs', toNodeId: 'node_a_3_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 2 lên Tầng 3' },
  { fromNodeId: 'node_a_3_stairs', toNodeId: 'node_a_4_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 3 lên Tầng 4' },
  { fromNodeId: 'node_a_4_stairs', toNodeId: 'node_a_5_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tầng 4 lên Tầng 5' },

  // ================= VERTICAL CONNECTIONS (TÒA A1 - B) =================
  { fromNodeId: 'node_b_1_elev', toNodeId: 'node_b_2_elev', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy Tòa A1 Tầng 1 lên 2' },
  { fromNodeId: 'node_b_2_elev', toNodeId: 'node_b_3_elev', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy Tòa A1 Tầng 2 lên 3' },
  { fromNodeId: 'node_b_3_elev', toNodeId: 'node_b_4_elev', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 3.2, audioLandmarkVi: 'Thang máy Tòa A1 Tầng 3 lên 4' },

  { fromNodeId: 'node_b_1_stairs', toNodeId: 'node_b_2_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1 Tầng 1 lên 2' },
  { fromNodeId: 'node_b_2_stairs', toNodeId: 'node_b_3_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1 Tầng 2 lên 3' },
  { fromNodeId: 'node_b_3_stairs', toNodeId: 'node_b_4_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa A1 Tầng 3 lên 4' },

  // ================= VERTICAL CONNECTIONS (TÒA C) =================
  { fromNodeId: 'node_c_1_elev', toNodeId: 'node_c_2_elev', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy Tòa C Tầng 1 lên 2' },
  { fromNodeId: 'node_c_2_elev', toNodeId: 'node_c_3_elev', distance: 4, type: 'elevator', isAccessible: true, hasSteps: false, widthMeters: 3.0, audioLandmarkVi: 'Thang máy Tòa C Tầng 2 lên 3' },

  { fromNodeId: 'node_c_1_stairs', toNodeId: 'node_c_2_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa C Tầng 1 lên 2' },
  { fromNodeId: 'node_c_2_stairs', toNodeId: 'node_c_3_stairs', distance: 6, type: 'stairs', isAccessible: false, hasSteps: true, widthMeters: 1.8, audioLandmarkVi: 'Cầu thang bộ Tòa C Tầng 2 lên 3' },
];

// Attach nodes to floor structures dynamically
BUILDINGS_DATA.forEach(b => {
  b.floors.forEach(f => {
    f.nodes = MAP_NODES_DATA.filter(n => n.buildingId === b.id && n.floorId === f.id);
  });
});

// ==========================================
// PRESET CLINICAL WORKFLOWS (BẠCH MAI)
// ==========================================
export const CLINICAL_WORKFLOW_PRESETS: ClinicalWorkflowPreset[] = [
  {
    id: 'wf_bm_outpatient',
    titleVi: 'Khám BHYT / Tự Nguyện Chuẩn Tòa K1',
    titleEn: 'Standard Outpatient Pathway (Building K1)',
    descriptionVi: 'Cổng 1 (78 Giải Phóng) -> Tiếp đón K1-101 -> Khám Nội K1-201 -> Lấy máu C-102 -> Chụp X-Quang C-106 -> Bác sĩ kết luận -> Lấy thuốc K1-108',
    descriptionEn: 'Gate 1 -> Reception K1-101 -> Internal Clinic K1-201 -> Blood Lab C-102 -> Chest X-Ray C-106 -> Consultation -> Pharmacy K1-108',
    category: 'Khám BHYT / Ngoại trú',
    estimatedTimeMin: 90,
    stopRoomIds: ['dept_reception', 'dept_internal', 'dept_lab', 'dept_xray', 'dept_internal', 'dept_pharmacy_a']
  },
  {
    id: 'wf_bm_stroke_a9',
    titleVi: 'Cấp Cứu Đột Quỵ Giờ Vàng A9 (Hỏa Tốc)',
    titleEn: 'A9 Emergency Acute Stroke Fast Track',
    descriptionVi: 'Cổng 2 (Làn A9) -> Tiếp nhận khẩn cấp A1-101 -> Đơn vị Đột quỵ A1-105 -> Chụp CT 512 dãy/MRI khẩn C-202 -> Hồi sức ICU A1-301',
    descriptionEn: 'Gate 2 Fast ER -> A9 Intake A1-101 -> Stroke Unit A1-105 -> Urgent CT/MRI C-202 -> ICU A1-301',
    category: 'Cấp cứu A9',
    estimatedTimeMin: 20,
    stopRoomIds: ['dept_inpatient_admit', 'dept_stroke_er', 'dept_mri_ct', 'dept_icu']
  },
  {
    id: 'wf_bm_cardiology',
    titleVi: 'Tầm Soát Tim Mạch & Đo Điện Tim Chuyên Sâu',
    titleEn: 'Cardiovascular & ECG Screening Pathway',
    descriptionVi: 'Cổng 1 -> Tiếp đón K1-101 -> Khám Tim Mạch & Đo ECG K1-204 -> Lấy máu mỡ máu C-102 -> Siêu âm tim C-301 -> Kết luận & Lấy thuốc K1-108',
    descriptionEn: 'Gate 1 -> Reception K1-101 -> Cardiology & ECG K1-204 -> Lipid Lab C-102 -> Echo Doppler C-301 -> Pharmacy K1-108',
    category: 'Tim mạch',
    estimatedTimeMin: 75,
    stopRoomIds: ['dept_reception', 'dept_cardiology', 'dept_lab', 'dept_endoscopy_us', 'dept_cardiology', 'dept_pharmacy_a']
  },
  {
    id: 'wf_bm_digestive',
    titleVi: 'Nội Soi Tiêu Hóa Việt - Nhật & Thăm Dò Gan Mật',
    titleEn: 'Vietnam - Japan Painless Endoscopy Pathway',
    descriptionVi: 'Cổng 1 -> Tiếp đón K1-101 -> Khám Tiêu Hóa K1-208 -> Xét nghiệm đông máu C-102 -> Trung tâm Nội soi C-301 -> Tư vấn & Nhận thuốc',
    descriptionEn: 'Gate 1 -> Reception K1-101 -> Gastroenterologist K1-208 -> Lab C-102 -> Endoscopy Center C-301 -> Pharmacy K1-108',
    category: 'Tiêu hóa',
    estimatedTimeMin: 120,
    stopRoomIds: ['dept_reception', 'dept_gastro', 'dept_lab', 'dept_endoscopy_us', 'dept_gastro', 'dept_pharmacy_a']
  },
  {
    id: 'wf_bm_ortho',
    titleVi: 'Khám Cơ Xương Khớp & Bó Bột Chấn Thương',
    titleEn: 'Orthopedics & Spine Consultation Pathway',
    descriptionVi: 'Cổng 1 -> Tiếp đón K1-101 -> Khám Cơ Xương Khớp K1-212 -> Chụp X-Quang C-106 / MRI C-202 -> Bó bột nẹp -> Nhà thuốc K1-108',
    descriptionEn: 'Gate 1 -> Reception -> Orthopedics K1-212 -> X-Ray C-106/MRI C-202 -> Casting -> Pharmacy K1-108',
    category: 'Xương khớp',
    estimatedTimeMin: 60,
    stopRoomIds: ['dept_reception', 'dept_ortho', 'dept_xray', 'dept_ortho', 'dept_pharmacy_a']
  },
  {
    id: 'wf_bm_pediatrics',
    titleVi: 'Khám & Tiêm Chủng Vắc-Xin Nhi Khoa K1',
    titleEn: 'Pediatric Care & Immunization Pathway',
    descriptionVi: 'Cổng 1 -> Quầy tiếp đón K1-101 -> Khoa Khám Nhi K1-301 -> Phòng Tiêm chủng vắc-xin -> Theo dõi 30 phút -> Nhà thuốc K1-108',
    descriptionEn: 'Gate 1 -> Reception K1-101 -> Pediatric Clinic K1-301 -> Vaccine Room -> 30min Observation -> Pharmacy K1-108',
    category: 'Nhi khoa',
    estimatedTimeMin: 45,
    stopRoomIds: ['dept_reception', 'dept_pediatrics', 'dept_pharmacy_a']
  }
];

export function getRoomById(roomId: string): RoomDetails | undefined {
  return ROOMS_DATA.find(r => r.id === roomId);
}

export function getNodeById(nodeId: string): MapNode | undefined {
  return MAP_NODES_DATA.find(n => n.id === nodeId);
}

export function getNodeByRoomId(roomId: string): MapNode | undefined {
  return MAP_NODES_DATA.find(n => n.roomId === roomId);
}

export function getBuildingById(buildingId: BuildingId): Building | undefined {
  return BUILDINGS_DATA.find(b => b.id === buildingId);
}

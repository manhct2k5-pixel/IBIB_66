import type { Hospital108Destination } from '../../types';

export const HOSPITAL_108_DESTINATIONS: Hospital108Destination[] = [
  {
    id: 'c1_1_a',
    name: 'Khoa Khám bệnh đa khoa C1.1-A',
    aliases: ['c1.1-a', 'c1-1', 'đa khoa', 'khám đa khoa'],
    mapLinkId: 'c1-1-floor1',
    building: 'Nhà C1-1',
    floor: 'Tầng 1',
    description: 'Tiếp đón 6h–17h, Thứ Hai đến Thứ Sáu',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    mapPrecision: 'verified_floor',
    locationNotice: 'Bản đồ đang mở tại Nhà C1-1, tầng 1. Vui lòng chọn đúng khu vực khám trên bản đồ.'
  },
  {
    id: 'c1_1_b',
    name: 'Khoa Khám bệnh theo yêu cầu C1.1-B',
    aliases: ['c1.1-b', 'khám theo yêu cầu', 'nhà khám bệnh theo yêu cầu'],
    mapLinkId: 'kham-yeu-cau-floor1',
    building: 'Nhà Khoa Khám bệnh theo yêu cầu',
    floor: 'Tầng 1',
    description: 'Tiếp đón 6h–17h, Thứ Hai đến Thứ Bảy',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    mapPrecision: 'verified_floor',
    locationNotice: 'Bản đồ đang mở tại Nhà Khoa Khám bệnh theo yêu cầu, tầng 1. Vui lòng chọn đúng khu vực khám trên bản đồ.'
  },
  {
    id: 'c1_1_c',
    name: 'Khoa Phẫu thuật và điều trị theo yêu cầu C1.1-C',
    aliases: ['c1.1-c', 'phẫu thuật theo yêu cầu', 'điều trị theo yêu cầu'],
    mapLinkId: 'c1-1-floor1', 
    building: 'Nhà C1-1',
    floor: 'Tầng 1',
    description: 'Tiếp đón 6h–17h, Thứ Hai đến Thứ Bảy',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    mapPrecision: 'verified_floor',
    locationNotice: 'Bản đồ đang mở tại Nhà C1-1, tầng 1. Vui lòng chọn đúng khu vực điều trị trên bản đồ.'
  },
  {
    id: 'cap_cuu',
    name: 'Khoa Cấp cứu (C1-3)',
    aliases: ['cấp cứu', 'cap cuu', '115', 'c1-3', 'c1.3', 'khoa cap cuu'],
    mapLinkId: 'campus',
    building: 'Bệnh viện 108',
    description: 'Tiếp nhận và xử trí cấp cứu 24/7. Điện thoại: 024 6278 4115',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-khoa-cap-cuu.htm',
    mapPrecision: 'campus_only',
    locationNotice: 'Bản đồ đang mở tại khuôn viên tổng quan Bệnh viện 108.'
  },
  {
    id: 'kham_quoc_te',
    name: 'Khu Khám Đối ngoại – Quốc tế',
    aliases: ['quốc tế', 'đối ngoại', 'quoc te', 'doi ngoai'],
    mapLinkId: 'campus',
    building: 'Tòa nhà Trung tâm',
    floor: 'Tầng 1 (Sảnh B)',
    description: 'Hotline đăng ký: 0862 878 918',
    sourceUrl: 'https://benhvien108.vn/quy-trinh-kham/quy-trinh-kham-benh-doi-ngoai-quoc-te.htm',
    mapPrecision: 'campus_only',
    locationNotice: 'Bản đồ đang mở tại khuôn viên tổng quan Bệnh viện 108.'
  },
  {
    id: 'tong_quan',
    name: 'Mở bản đồ toàn Bệnh viện 108',
    aliases: ['bản đồ', 'tổng quan', 'khuôn viên'],
    mapLinkId: 'campus',
    building: 'Bệnh viện 108',
    description: 'Số 1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội',
    sourceUrl: 'https://www.benhvien108.vn/',
    mapPrecision: 'campus_only'
  }
];

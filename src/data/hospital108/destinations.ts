import { Official108MapLink } from './officialMapLinks';

export interface Hospital108Destination {
  id: string;
  name: string;
  aliases: string[];
  mapLinkId: string; 
  building: string;
  description?: string;
  sourceUrl?: string;
}

export const HOSPITAL_108_DESTINATIONS: Hospital108Destination[] = [
  {
    id: 'c1_1_a',
    name: 'Khoa Khám bệnh đa khoa C1.1-A',
    aliases: ['c1.1-a', 'c1-1', 'đa khoa', 'khám đa khoa'],
    mapLinkId: 'c1-1-floor1',
    building: 'Nhà C1-1',
    description: 'Tiếp đón 6h–17h, Thứ Hai đến Thứ Sáu',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'c1_1_b',
    name: 'Khoa Khám bệnh theo yêu cầu C1.1-B',
    aliases: ['c1.1-b', 'khám theo yêu cầu', 'nhà khám bệnh theo yêu cầu'],
    mapLinkId: 'kham-yeu-cau-floor1',
    building: 'Nhà Khoa Khám bệnh theo yêu cầu',
    description: 'Tiếp đón 6h–17h, Thứ Hai đến Thứ Bảy',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'c1_1_c',
    name: 'Khoa Phẫu thuật và điều trị theo yêu cầu C1.1-C',
    aliases: ['c1.1-c', 'phẫu thuật theo yêu cầu', 'điều trị theo yêu cầu'],
    mapLinkId: 'c1-1-floor1', 
    building: 'Nhà C1-1',
    description: 'Tiếp đón 6h–17h, Thứ Hai đến Thứ Bảy',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'cap_cuu',
    name: 'Khoa Cấp cứu',
    aliases: ['cấp cứu', 'cap cuu', '115'],
    mapLinkId: 'campus',
    building: 'Bệnh viện 108',
    description: 'Tiếp nhận và xử trí cấp cứu 24/7. Điện thoại: 024 6278 4115',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-khoa-cap-cuu.htm'
  },
  {
    id: 'kham_quoc_te',
    name: 'Khu Khám Đối ngoại – Quốc tế',
    aliases: ['quốc tế', 'đối ngoại', 'quoc te', 'doi ngoai'],
    mapLinkId: 'campus',
    building: 'Tầng 1, sảnh B, tòa nhà Trung tâm',
    description: 'Hotline đăng ký: 0862 878 918',
    sourceUrl: 'https://benhvien108.vn/quy-trinh-kham/quy-trinh-kham-benh-doi-ngoai-quoc-te.htm'
  },
  {
    id: 'tong_quan',
    name: 'Mở bản đồ toàn Bệnh viện 108',
    aliases: ['bản đồ', 'tổng quan', 'khuôn viên'],
    mapLinkId: 'campus',
    building: 'Bệnh viện 108',
    description: 'Số 1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội',
    sourceUrl: 'https://www.benhvien108.vn/'
  }
];

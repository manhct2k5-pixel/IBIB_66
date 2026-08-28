export interface Official108MapLink {
  id: string;
  label: string;
  venueId: number;
  floorId: number;
  facilityId?: number;
  url: string;
  verificationStatus: 'official_map';
  sourceUrl: string;
  lastCheckedAt: string;
}

export const HOSPITAL_108_OFFICIAL_MAP_LINKS: Official108MapLink[] = [
  {
    id: 'campus',
    label: 'Tổng quan khuôn viên',
    venueId: 2302,
    floorId: 5171,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2302&floor=5171',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  },
  {
    id: 'c1-1-floor1',
    label: 'Nhà C1-1 - Tầng 1',
    venueId: 2301,
    floorId: 5170,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2301&floor=5170',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  },
  {
    id: 'c1-1-floor2',
    label: 'Nhà C1-1 - Tầng 2',
    venueId: 2301,
    floorId: 5176,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2301&floor=5176',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  },
  {
    id: 'kham-yeu-cau-floor1',
    label: 'Nhà Khoa Khám bệnh theo yêu cầu - Tầng 1',
    venueId: 2303,
    floorId: 5172,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2303&floor=5172',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  },
  {
    id: 'kham-yeu-cau-floor2',
    label: 'Nhà Khoa Khám bệnh theo yêu cầu - Tầng 2',
    venueId: 2303,
    floorId: 5173,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2303&floor=5173',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  },
  {
    id: 'kham-yeu-cau-floor3',
    label: 'Nhà Khoa Khám bệnh theo yêu cầu - Tầng 3',
    venueId: 2303,
    floorId: 5174,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2303&floor=5174',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  },
  {
    id: 'kham-yeu-cau-floor4',
    label: 'Nhà Khoa Khám bệnh theo yêu cầu - Tầng 4',
    venueId: 2303,
    floorId: 5175,
    url: 'https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2303&floor=5175',
    verificationStatus: 'official_map',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    lastCheckedAt: '2026-08-28'
  }
];

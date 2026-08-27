/**
 * Nguồn dữ liệu chính thức Bệnh viện Bạch Mai
 * Cập nhật: 01/08/2026
 */

export interface VerifiedSource {
  id: string;
  title: string;
  url: string;
  verifiedAt: string;
  description: string;
}

export const BACH_MAI_OFFICIAL_SOURCES: VerifiedSource[] = [
  {
    id: 'src_map_01082026',
    title: 'Sơ đồ Bệnh viện Bạch Mai cơ sở Hà Nội',
    url: 'https://bachmai.gov.vn/bai-viet/so-do-benh-vien-bach-mai?id=a84bf36d-1da1-461f-8bb2-e5a511c45647',
    verifiedAt: '2026-08-01',
    description: 'Sơ đồ định hướng mặt bằng các khối nhà, cổng vào và phân khu chức năng Bệnh viện Bạch Mai.'
  },
  {
    id: 'src_gates_guide',
    title: 'Thông báo điều chỉnh thời gian đóng/mở Cổng số 3 và hướng dẫn di chuyển đến các cổng',
    url: 'https://bachmai.gov.vn/bai-viet/thong-bao-dieu-chinh-thoi-gian-dong-mo-cong-so-3-va-huong-dan-di-chuyen-den-cac-cong-cua-benh-vien-bach-mai?id=0bd2bac3-474d-4755-bbb0-c70e96ad901c',
    verifiedAt: '2026-08-01',
    description: 'Quy định phân luồng xe và người đi bộ qua Cổng 1, Cổng 2, Cổng 3 (đường Phương Mai) và Cổng 4 (đường Giải Phóng).'
  },
  {
    id: 'src_k1_guide',
    title: '5 mẹo vàng khám nhanh tại Bệnh viện Bạch Mai (Tòa K1)',
    url: 'https://bachmai.gov.vn/bai-viet/5-meo-vang-kham-nhanh-tai-benh-vien-bach-mai-toi-uu-thoi-gian-cua-ban?id=d08ac5cf-ac99-4ab8-be84-e1588bc97091',
    verifiedAt: '2026-08-01',
    description: 'Hướng dẫn tiếp đón, đăng ký khám và phân luồng tại Tòa nhà K1 (thuận tiện nhất từ Cổng 4).'
  },
  {
    id: 'src_a9_emergency',
    title: 'Thông tin Trung tâm Cấp cứu A9',
    url: 'https://bachmai.gov.vn/don-vi/trung-tam-cap-cuu-a9/60a668af-6bd7-e930-1bf2-59765f13d55f',
    verifiedAt: '2026-08-01',
    description: 'Hotline Cấp cứu A9: 086 958 7707 và tiếp nhận cấp cứu 24/7 gần Cổng 1.'
  }
];

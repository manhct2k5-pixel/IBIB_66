import { describe, it, expect } from 'vitest';
import { HOSPITAL_108_OFFICIAL_MAP_LINKS, HOSPITAL_108_DESTINATIONS, HOSPITAL_108_SOURCES } from '../data/hospital108';

describe('Bệnh viện Trung ương Quân đội 108 Data Verification', () => {
  it('Không còn BACH_MAI_ trong mã nguồn (mô phỏng bằng kiểm tra dữ liệu)', () => {
    const dataString = JSON.stringify({ HOSPITAL_108_OFFICIAL_MAP_LINKS, HOSPITAL_108_DESTINATIONS, HOSPITAL_108_SOURCES });
    expect(dataString).not.toContain('BACH_MAI_');
    expect(dataString).not.toContain('bachmai.gov.vn');
    expect(dataString).not.toContain('78 Giải Phóng');
    expect(dataString).not.toContain('086 958 7707'); // Hotline A9 cũ
  });

  it('Mọi link bản đồ đều thuộc https://mapscustom.inmapz.com/customers/bv108/', () => {
    HOSPITAL_108_OFFICIAL_MAP_LINKS.forEach(link => {
      expect(link.url.startsWith('https://mapscustom.inmapz.com/customers/bv108/')).toBe(true);
    });
  });

  it('C1-1 có đúng hai liên kết tầng', () => {
    const c11Links = HOSPITAL_108_OFFICIAL_MAP_LINKS.filter(l => l.venueId === 2301);
    expect(c11Links.length).toBe(2);
    expect(c11Links.map(l => l.floorId).sort()).toEqual([5170, 5176].sort());
  });

  it('Nhà Khám bệnh theo yêu cầu có đúng bốn liên kết tầng', () => {
    const kyqLinks = HOSPITAL_108_OFFICIAL_MAP_LINKS.filter(l => l.venueId === 2303);
    expect(kyqLinks.length).toBe(4);
    expect(kyqLinks.map(l => l.floorId).sort()).toEqual([5172, 5173, 5174, 5175].sort());
  });

  it('Nút cấp cứu có 115', () => {
    expect(HOSPITAL_108_SOURCES.nationalEmergency).toBe('115');
  });
});

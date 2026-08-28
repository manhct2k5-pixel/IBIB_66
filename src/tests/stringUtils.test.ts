import { describe, it, expect } from 'vitest';
import { normalizeVietnamese } from '../utils/stringUtils';

describe('normalizeVietnamese', () => {
  it('xóa dấu tiếng Việt', () => {
    expect(normalizeVietnamese('khoa khám bệnh đa khoa')).toBe('khoa kham benh da khoa');
    expect(normalizeVietnamese('Khoa Phẫu thuật và điều trị theo yêu cầu')).toBe('khoa phau thuat va dieu tri theo yeu cau');
  });

  it('xử lý chữ Đ, đ', () => {
    expect(normalizeVietnamese('đối ngoại')).toBe('doi ngoai');
    expect(normalizeVietnamese('ĐỐI NGOẠI')).toBe('doi ngoai');
  });

  it('chuyển thành chữ thường và trim', () => {
    expect(normalizeVietnamese('  C1.1-A  ')).toBe('c1.1-a');
    expect(normalizeVietnamese('C1-1')).toBe('c1-1');
  });
});

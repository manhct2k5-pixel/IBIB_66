import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { 
  createInMapzRouteLaunch, 
  chooseVerifiedMapView 
} from '../services/inmapzRouting';
import { 
  HOSPITAL_108_START_LOCATIONS, 
  HOSPITAL_108_DESTINATIONS
} from '../data/hospital108';

describe('InMapz Routing Capability & Assisted Mode Service Tests', () => {
  it('Trả về đúng cấu trúc assisted_external_map khi không có deep link chính thức', () => {
    const startLoc = HOSPITAL_108_START_LOCATIONS[0];
    const destLoc = HOSPITAL_108_DESTINATIONS[0];

    const result = createInMapzRouteLaunch({
      startLocationId: startLoc.id,
      destinationId: destLoc.id
    });

    expect(result.mode).toBe('assisted_external_map');
    expect(result.startResolved).toBe(false);
    expect(result.destinationResolved).toBe(false);
    expect(result.routePreloaded).toBe(false);
    expect(result.url).toBeTruthy();
    expect(result.url.startsWith('https://mapscustom.inmapz.com/')).toBe(true);
    expect(result.message).toContain('Bản đồ được mở đúng khu vực nhưng bác cần chọn lại điểm đầu và điểm đến');
  });

  it('chooseVerifiedMapView mở bản đồ phân khu nếu cùng 1 tòa nhà (cùng venueId)', () => {
    // Tìm 2 địa điểm cùng thuộc Nhà C1-1 (venueId 2301)
    const startInC1 = HOSPITAL_108_START_LOCATIONS.find(s => s.mapLinkId.startsWith('c1-1'));
    const destInC1 = HOSPITAL_108_DESTINATIONS.find(d => d.mapLinkId.startsWith('c1-1'));

    if (startInC1 && destInC1) {
      const chosenMap = chooseVerifiedMapView(startInC1, destInC1);
      expect(chosenMap.venueId).toBe(2301);
      expect(chosenMap.id).toBe(destInC1.mapLinkId);
    }
  });

  it('chooseVerifiedMapView mở bản đồ khuôn viên tổng quan nếu khác tòa nhà (khác venueId)', () => {
    // Điểm xuất phát ở Cổng chính số 1 (mapLinkId: campus, venueId: 2302)
    // Điểm đến ở Nhà C1-1 (mapLinkId: c1-1-floor1, venueId: 2301)
    const cong1 = HOSPITAL_108_START_LOCATIONS.find(s => s.id === 'start_gate_01');
    const c1_1_a = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'c1_1_a');

    expect(cong1).toBeDefined();
    expect(c1_1_a).toBeDefined();

    if (cong1 && c1_1_a) {
      const chosenMap = chooseVerifiedMapView(cong1, c1_1_a);
      // Khi khác tòa nhà, phải mở campus trước để người dùng thấy tổng thể khuôn viên
      expect(chosenMap.id).toBe('campus');
      expect(chosenMap.venueId).toBe(2302);
    }
  });

  it('Fallback an toàn về campus map nếu ID không tồn tại', () => {
    const result = createInMapzRouteLaunch({
      startLocationId: 'invalid_start',
      destinationId: 'invalid_dest'
    });

    expect(result.mode).toBe('assisted_external_map');
    expect(result.targetMapLink.id).toBe('campus');
    expect(result.routePreloaded).toBe(false);
  });

  it('RoutePreview hiển thị "Cần chọn lại trên bản đồ" và nút "Mở chức năng Chỉ đường trên InMapz"', () => {
    const routePreviewCode = fs.readFileSync(
      path.join(process.cwd(), 'src/components/RoutePreview.tsx'),
      'utf-8'
    );

    expect(routePreviewCode).toContain('Cần chọn lại trên bản đồ');
    expect(routePreviewCode).toContain('MedNav đã ghi nhớ:');
    expect(routePreviewCode).toContain('Mở chức năng Chỉ đường trên InMapz');
    expect(routePreviewCode).not.toContain('Tuyến đã sẵn sàng');
    expect(routePreviewCode).not.toContain('bước chân');
    expect(routePreviewCode).not.toContain('khoảng cách:');
  });

  it('Official108Map hiển thị Từ và Đến trong bottom sheet và các bước hướng dẫn', () => {
    const mapCode = fs.readFileSync(
      path.join(process.cwd(), 'src/components/Official108Map.tsx'),
      'utf-8'
    );

    expect(mapCode).toContain('Từ:');
    expect(mapCode).toContain('Đến:');
    expect(mapCode).toContain('bước xem tuyến trên bản đồ InMapz');
    expect(mapCode).toContain('Chỉ đường');
  });
});

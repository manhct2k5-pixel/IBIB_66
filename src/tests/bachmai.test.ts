import { describe, it, expect } from 'vitest';
import { 
  BACH_MAI_CAMPUS, 
  BACH_MAI_GATES, 
  DEFAULT_EMERGENCY_NODE_ID, 
  DEFAULT_EMERGENCY_PHONE, 
  NATIONAL_EMERGENCY_PHONE 
} from '../data/bachMai/campus';
import { BACH_MAI_BUILDINGS } from '../data/bachMai/buildings';
import { BACH_MAI_ROOMS, getRoomById } from '../data/bachMai/rooms';
import { BACH_MAI_NODES } from '../data/bachMai/nodes';
import { BACH_MAI_EDGES } from '../data/bachMai/edges';
import { BACH_MAI_QR_CHECKPOINTS, findQRCheckpointByCode } from '../data/bachMai/checkpoints';
import { findRoute } from '../utils/pathfinding';

describe('1. Kiểm tra vị trí và thông tin các cổng Bệnh viện Bạch Mai', () => {
  it('phải có đúng 4 cổng chính thức (Cổng 1, 2, 3, 4)', () => {
    expect(BACH_MAI_GATES).toHaveLength(4);
    const gateIds = BACH_MAI_GATES.map(g => g.id);
    expect(gateIds).toEqual(['gate_1', 'gate_2', 'gate_3', 'gate_4']);
  });

  it('Cổng 1, 2, 4 nằm phía đường Giải Phóng, chỉ Cổng 3 nằm phía đường Phương Mai', () => {
    const gate1 = BACH_MAI_GATES.find(g => g.id === 'gate_1')!;
    const gate2 = BACH_MAI_GATES.find(g => g.id === 'gate_2')!;
    const gate3 = BACH_MAI_GATES.find(g => g.id === 'gate_3')!;
    const gate4 = BACH_MAI_GATES.find(g => g.id === 'gate_4')!;

    expect(gate1.street).toContain('Giải Phóng');
    expect(gate2.street).toContain('Giải Phóng');
    expect(gate4.street).toContain('Giải Phóng');
    expect(gate3.street).toContain('Phương Mai');
    expect(gate3.street).not.toContain('Giải Phóng');
  });

  it('Cổng 1 ưu tiên ô tô ra/vào và đón/trả bệnh nhân, không mặc định điều hướng xe máy', () => {
    const gate1 = BACH_MAI_GATES.find(g => g.id === 'gate_1')!;
    expect(gate1.vehicleRules).toContain('ưu tiên ô tô ra/vào');
    expect(gate1.vehicleRules).toContain('không mặc định điều hướng xe máy');
    expect(gate1.bestForBuildings).toContain('A9');
    expect(gate1.bestForBuildings).toContain('A10');
    expect(gate1.bestForBuildings).toContain('K3');
  });

  it('Cổng 2 chủ yếu là lối ô tô đi ra trong giờ hành chính, không ghi làn cấp cứu hay lối xe máy', () => {
    const gate2 = BACH_MAI_GATES.find(g => g.id === 'gate_2')!;
    expect(gate2.descriptionVi.toLowerCase()).toContain('lối ô tô đi ra');
    expect(gate2.vehicleRules.toLowerCase()).toContain('lối ra');
    expect(gate2.vehicleRules.toLowerCase()).toContain('giờ hành chính');
    // Không được ghi là cổng cấp cứu hỏa tốc hay lối xe máy
    expect(gate2.name).not.toContain('Cấp cứu');
    expect(gate2.descriptionVi).not.toContain('hỏa tốc');
    expect(gate2.descriptionVi).not.toContain('lối xe máy');
  });

  it('Cổng 3 mở 05:30 - 22:00, có cổng phụ sau 22:00, thuận tiện cho T1-T6, F, Q, H', () => {
    const gate3 = BACH_MAI_GATES.find(g => g.id === 'gate_3')!;
    expect(gate3.operatingHours).toContain('05:30 - 22:00');
    expect(gate3.vehicleRules).toContain('sau 22:00');
    expect(gate3.bestForBuildings).toContain('T1');
    expect(gate3.bestForBuildings).toContain('T4');
    expect(gate3.bestForBuildings).toContain('F');
    expect(gate3.bestForBuildings).toContain('Q');
    expect(gate3.bestForBuildings).toContain('H');
  });

  it('Cổng 4 thuận tiện đến K1 và K2, không bịa giờ mở cửa 05:30 - 18:00', () => {
    const gate4 = BACH_MAI_GATES.find(g => g.id === 'gate_4')!;
    expect(gate4.bestForBuildings).toContain('K1');
    expect(gate4.bestForBuildings).toContain('K2');
    expect(gate4.operatingHours).not.toBe('05:30 - 18:00');
    expect(gate4.operatingHours).toContain('Chưa có dữ liệu xác minh');
  });
});

describe('2. Kiểm tra tính toàn vẹn của Dữ liệu Tòa nhà, Phòng ban & Bản đồ', () => {
  it('hasIndoorMap trong BACH_MAI_CAMPUS phải là false khi chưa có sơ đồ nội bộ xác minh', () => {
    expect(BACH_MAI_CAMPUS.hasIndoorMap).toBe(false);
  });

  it('hằng số cấp cứu mặc định và hotline phải chính xác', () => {
    expect(DEFAULT_EMERGENCY_NODE_ID).toBe('node_a9_emergency_entrance');
    expect(DEFAULT_EMERGENCY_PHONE).toBe('086 958 7707');
    expect(NATIONAL_EMERGENCY_PHONE).toBe('115');
    const emergencyNode = BACH_MAI_NODES.find(n => n.id === DEFAULT_EMERGENCY_NODE_ID);
    expect(emergencyNode).toBeDefined();
    expect(emergencyNode?.buildingId).toBe('A9');
  });

  it('floorsCount không được gán số tầng chưa xác minh cho các tòa (trừ Tòa Q 21 tầng)', () => {
    for (const b of BACH_MAI_BUILDINGS) {
      if (b.id === 'Q') {
        expect(b.floorsCount).toBe(21);
      } else {
        expect(b.floorsCount).toBeUndefined();
      }
      expect(b.hasVerifiedIndoorMap).toBe(false);
    }
  });

  it('không mặc định các khoa hoặc phòng ở tầng 1 (floorId là optional)', () => {
    for (const room of BACH_MAI_ROOMS) {
      expect(room.floorId).toBeUndefined();
    }
  });

  it('tất cả node ID trong BACH_MAI_NODES phải là duy nhất', () => {
    const ids = BACH_MAI_NODES.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('mọi edge trong BACH_MAI_EDGES phải tham chiếu đến node ID tồn tại', () => {
    const nodeIds = new Set(BACH_MAI_NODES.map(n => n.id));
    for (const edge of BACH_MAI_EDGES) {
      expect(nodeIds.has(edge.fromNodeId)).toBe(true);
      expect(nodeIds.has(edge.toNodeId)).toBe(true);
    }
  });

  it('mọi node có roomId phải tham chiếu đến một khoa/phòng tồn tại trong BACH_MAI_ROOMS', () => {
    const roomIds = new Set(BACH_MAI_ROOMS.map(r => r.id));
    const nodesWithRoom = BACH_MAI_NODES.filter(n => n.roomId);
    for (const node of nodesWithRoom) {
      expect(roomIds.has(node.roomId!)).toBe(true);
    }
  });

  it('mọi phòng ban trong BACH_MAI_ROOMS phải thuộc một tòa nhà hợp lệ', () => {
    const buildingIds = new Set(BACH_MAI_BUILDINGS.map(b => b.id));
    for (const room of BACH_MAI_ROOMS) {
      expect(buildingIds.has(room.buildingId)).toBe(true);
    }
  });

  it('không còn mã phòng bịa đặt (e.g. A9-100, K1-101, VTM-101, T1-101)', () => {
    const fabricatedCodes = ['A9-100', 'K1-101', 'K1-201', 'K1-202', 'VTM-101', 'T1-101', 'T4-101', 'F-101', 'H-101', 'D2-101', 'D4-101', 'D6-101'];
    for (const room of BACH_MAI_ROOMS) {
      if (room.code) {
        expect(fabricatedCodes).not.toContain(room.code);
      }
    }
  });

  it('chỉ dữ liệu có nguồn chính thức mới được gắn verified, các khoa khác là campus_verified', () => {
    const a9 = getRoomById('dept_a9_emergency');
    expect(a9?.verificationStatus).toBe('verified');
    expect(a9?.sourceUrl).toBeDefined();

    // Các khoa chưa có sơ đồ tầng chi tiết chính thức phải là campus_verified
    const otherRooms = BACH_MAI_ROOMS.filter(r => r.id !== 'dept_a9_emergency');
    for (const r of otherRooms) {
      expect(r.verificationStatus).toBe('campus_verified');
      expect(r.operatingHours).toBe('Chưa có dữ liệu xác minh');
    }
  });
});

describe('3. Kiểm tra thuật toán định tuyến (Pathfinding) giữa các cổng và tòa nhà', () => {
  it('có thể tìm đường từ Cổng 1 đến A9 (Cấp cứu)', () => {
    const route = findRoute('node_gate_1', 'node_a9_emergency_entrance', 'fastest');
    expect(route).not.toBeNull();
    expect(route!.pathNodes.length).toBeGreaterThan(1);
    expect(route!.pathNodes[0].id).toBe('node_gate_1');
    expect(route!.pathNodes[route!.pathNodes.length - 1].id).toBe('node_a9_emergency_entrance');
  });

  it('có thể tìm đường từ Cổng 1 đến A10 (Đột quỵ) và K3 (Chống độc)', () => {
    const routeA10 = findRoute('node_gate_1', 'node_a10_stroke_entrance', 'fastest');
    expect(routeA10).not.toBeNull();
    expect(routeA10!.pathNodes[routeA10!.pathNodes.length - 1].id).toBe('node_a10_stroke_entrance');

    const routeK3 = findRoute('node_gate_1', 'node_k3_poison_entrance', 'fastest');
    expect(routeK3).not.toBeNull();
    expect(routeK3!.pathNodes[routeK3!.pathNodes.length - 1].id).toBe('node_k3_poison_entrance');
  });

  it('có thể tìm đường từ Cổng 4 đến K1 (Sảnh tiếp đón) và K2', () => {
    const routeK1 = findRoute('node_gate_4', 'node_k1_reception', 'fastest');
    expect(routeK1).not.toBeNull();
    expect(routeK1!.pathNodes[routeK1!.pathNodes.length - 1].id).toBe('node_k1_reception');

    const routeK2 = findRoute('node_gate_4', 'node_k2_entrance', 'fastest');
    expect(routeK2).not.toBeNull();
    expect(routeK2!.pathNodes[routeK2!.pathNodes.length - 1].id).toBe('node_k2_entrance');
  });

  it('có thể tìm đường từ Cổng 3 đến T1 (Thần kinh), T4 (Tâm thần), F (Nhiệt đới), H (Ung bướu), Q (21 tầng)', () => {
    const targets = [
      'node_t1_neuro_entrance', 
      'node_t4_mental_entrance', 
      'node_f_tropical_entrance', 
      'node_h_onco_entrance', 
      'node_q_21story_entrance'
    ];
    for (const targetId of targets) {
      const route = findRoute('node_gate_3', targetId, 'fastest');
      expect(route).not.toBeNull();
      expect(route!.pathNodes[route!.pathNodes.length - 1].id).toBe(targetId);
    }
  });

  it('tất cả 4 cổng đều có đường đi đến node Cấp cứu A9', () => {
    const gates = ['node_gate_1', 'node_gate_2', 'node_gate_3', 'node_gate_4'];
    for (const gateId of gates) {
      const route = findRoute(gateId, 'node_a9_emergency_entrance', 'fastest');
      expect(route).not.toBeNull();
      expect(route!.pathNodes[route!.pathNodes.length - 1].id).toBe('node_a9_emergency_entrance');
    }
  });
});

describe('4. Kiểm tra hệ thống QR Checkpoint và xác thực vị trí', () => {
  it('phải có các checkpoint mẫu cho các cổng và tòa nhà chính', () => {
    expect(BACH_MAI_QR_CHECKPOINTS.length).toBeGreaterThanOrEqual(10);
    const cpGate1 = findQRCheckpointByCode('CP-GATE-1');
    expect(cpGate1).toBeDefined();
    expect(cpGate1?.nodeId).toBe('node_gate_1');

    const cpK1 = findQRCheckpointByCode('CP-K1');
    expect(cpK1).toBeDefined();
    expect(cpK1?.nodeId).toBe('node_k1_entrance');

    const cpA9 = findQRCheckpointByCode('CP-A9');
    expect(cpA9).toBeDefined();
    expect(cpA9?.nodeId).toBe('node_a9_emergency_entrance');
  });

  it('hỗ trợ tìm checkpoint theo bí danh (alias) không phân biệt hoa thường', () => {
    const cpByAlias1 = findQRCheckpointByCode('k1');
    expect(cpByAlias1?.code).toBe('CP-K1');

    const cpByAlias2 = findQRCheckpointByCode('cổng 1');
    expect(cpByAlias2?.code).toBe('CP-GATE-1');

    const cpByAlias3 = findQRCheckpointByCode('đột quỵ');
    expect(cpByAlias3?.code).toBe('CP-A10');
  });

  it('mọi checkpoint nodeId phải tồn tại trong BACH_MAI_NODES', () => {
    const nodeIds = new Set(BACH_MAI_NODES.map(n => n.id));
    for (const cp of BACH_MAI_QR_CHECKPOINTS) {
      expect(nodeIds.has(cp.nodeId)).toBe(true);
    }
  });
});

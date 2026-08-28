// TEST FIXTURE ONLY — NOT HOSPITAL DATA
import type { RouteNode, RouteEdge } from '../../types';

export const FIXTURE_NODES: RouteNode[] = [
  {
    id: 'f_node_a',
    name: 'Điểm bắt đầu A (Tầng 1)',
    shortName: 'Điểm A',
    buildingId: 'building_test',
    floorId: 'floor_1',
    type: 'gate',
    x: 0,
    y: 0,
    landmarkDescription: 'Cửa ra vào thử nghiệm A',
    qrCode: 'MEDNAV108:checkpoint:f_node_a',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_b',
    name: 'Ngã rẽ B (Tầng 1)',
    shortName: 'Ngã rẽ B',
    buildingId: 'building_test',
    floorId: 'floor_1',
    type: 'intersection',
    x: 10,
    y: 0,
    landmarkDescription: 'Giao lộ hành lang B',
    qrCode: 'MEDNAV108:checkpoint:f_node_b',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_stairs_f1',
    name: 'Chân cầu thang bộ (Tầng 1)',
    shortName: 'Thang bộ T1',
    buildingId: 'building_test',
    floorId: 'floor_1',
    type: 'stairs',
    x: 10,
    y: 10,
    landmarkDescription: 'Cầu thang bộ dẫn lên tầng 2',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_elevator_f1',
    name: 'Cửa thang máy (Tầng 1)',
    shortName: 'Thang máy T1',
    buildingId: 'building_test',
    floorId: 'floor_1',
    type: 'elevator',
    x: 20,
    y: 0,
    landmarkDescription: 'Cụm thang máy tầng 1',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_stairs_f2',
    name: 'Đỉnh cầu thang bộ (Tầng 2)',
    shortName: 'Thang bộ T2',
    buildingId: 'building_test',
    floorId: 'floor_2',
    type: 'stairs',
    x: 10,
    y: 10,
    landmarkDescription: 'Đầu cầu thang bộ tầng 2',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_elevator_f2',
    name: 'Cửa thang máy (Tầng 2)',
    shortName: 'Thang máy T2',
    buildingId: 'building_test',
    floorId: 'floor_2',
    type: 'elevator',
    x: 20,
    y: 0,
    landmarkDescription: 'Cụm thang máy tầng 2',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_dest_f2',
    name: 'Phòng khám đích Z (Tầng 2)',
    shortName: 'Phòng khám Z',
    buildingId: 'building_test',
    floorId: 'floor_2',
    type: 'destination',
    x: 30,
    y: 10,
    landmarkDescription: 'Cửa phòng khám số Z tầng 2',
    qrCode: 'MEDNAV108:checkpoint:f_node_dest_f2',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_node_isolated',
    name: 'Đảo cô lập không có đường nối',
    shortName: 'Đảo cô lập',
    type: 'destination',
    landmarkDescription: 'Khu vực thử nghiệm không thể tới',
    verificationStatus: 'field_verified'
  }
];

export const FIXTURE_EDGES: RouteEdge[] = [
  {
    id: 'f_edge_a_to_b',
    from: 'f_node_a',
    to: 'f_node_b',
    distanceMeters: 10,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Từ A đi thẳng 10m tới B.',
    reverseInstruction: 'Từ B đi thẳng 10m tới A.',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_edge_b_to_stairs1',
    from: 'f_node_b',
    to: 'f_node_stairs_f1',
    distanceMeters: 5,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Từ B rẽ phải 5m tới chân cầu thang bộ.',
    reverseInstruction: 'Từ chân thang bộ đi 5m ra ngã rẽ B.',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_edge_b_to_elev1',
    from: 'f_node_b',
    to: 'f_node_elevator_f1',
    distanceMeters: 25, // Dài hơn cầu thang bộ nhưng phẳng và đi thang máy
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Từ B đi thẳng 25m tới cửa thang máy tầng 1.',
    reverseInstruction: 'Từ thang máy đi thẳng 25m về ngã rẽ B.',
    verificationStatus: 'field_verified'
  },
  {
    // Cạnh cầu thang nối tầng 1 và tầng 2 (không dành cho xe lăn)
    id: 'f_edge_stairs1_to_stairs2',
    from: 'f_node_stairs_f1',
    to: 'f_node_stairs_f2',
    distanceMeters: 15,
    bidirectional: true,
    pathType: 'stairs',
    accessibility: { wheelchair: false, elderlyFriendly: false },
    status: 'open',
    instruction: 'Đi cầu thang bộ lên tầng 2.',
    reverseInstruction: 'Đi cầu thang bộ xuống tầng 1.',
    verificationStatus: 'field_verified'
  },
  {
    // Cạnh thang máy nối tầng 1 và tầng 2 (xe lăn đi tốt)
    id: 'f_edge_elev1_to_elev2',
    from: 'f_node_elevator_f1',
    to: 'f_node_elevator_f2',
    distanceMeters: 5,
    bidirectional: true,
    pathType: 'elevator',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Vào thang máy và bấm lên Tầng 2.',
    reverseInstruction: 'Vào thang máy và bấm xuống Tầng 1.',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_edge_stairs2_to_dest',
    from: 'f_node_stairs_f2',
    to: 'f_node_dest_f2',
    distanceMeters: 10,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Từ đỉnh thang bộ đi 10m tới phòng khám Z.',
    reverseInstruction: 'Từ phòng khám Z đi 10m về thang bộ.',
    verificationStatus: 'field_verified'
  },
  {
    id: 'f_edge_elev2_to_dest',
    from: 'f_node_elevator_f2',
    to: 'f_node_dest_f2',
    distanceMeters: 10,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Từ cửa thang máy đi 10m tới phòng khám Z.',
    reverseInstruction: 'Từ phòng khám Z đi 10m về thang máy.',
    verificationStatus: 'field_verified'
  },
  {
    // Cạnh một chiều thử nghiệm: từ A chỉ đi được đến node một chiều X
    id: 'f_edge_one_way',
    from: 'f_node_a',
    to: 'f_node_stairs_f1',
    distanceMeters: 50,
    bidirectional: false, // 1 chiều
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Đường một chiều từ A đến thang bộ.',
    verificationStatus: 'field_verified'
  },
  {
    // Cạnh bị đóng thử nghiệm
    id: 'f_edge_closed',
    from: 'f_node_a',
    to: 'f_node_dest_f2',
    distanceMeters: 1, // Siêu ngắn nhưng bị đóng
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'temporarily_closed',
    instruction: 'Cửa phụ đóng.',
    verificationStatus: 'field_verified'
  },
  {
    // Cạnh chưa xác minh (unverified)
    id: 'f_edge_unverified',
    from: 'f_node_a',
    to: 'f_node_isolated',
    distanceMeters: 2,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: { wheelchair: true, elderlyFriendly: true },
    status: 'open',
    instruction: 'Đường chưa xác minh.',
    verificationStatus: 'unverified'
  }
];

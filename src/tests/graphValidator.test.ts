import { describe, it, expect } from 'vitest';
import { validateNavigationGraph } from '../services/pathfinding/graphValidator';
import { HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES } from '../data/hospital108/navigation';
import type { RouteNode, RouteEdge } from '../types';

describe('validateNavigationGraph', () => {
  it('should validate official Hospital 108 graph with 100% success', () => {
    const result = validateNavigationGraph(HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.stats.verifiedNodes).toBe(HOSPITAL_108_ROUTE_NODES.length);
    expect(result.stats.verifiedEdges).toBe(HOSPITAL_108_ROUTE_EDGES.length);
  });

  it('should detect duplicate Node IDs', () => {
    const badNodes: RouteNode[] = [
      ...HOSPITAL_108_ROUTE_NODES,
      {
        ...HOSPITAL_108_ROUTE_NODES[0],
        name: 'Trùng node ID'
      }
    ];
    const result = validateNavigationGraph(badNodes, HOSPITAL_108_ROUTE_EDGES);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Trùng lặp Node ID'))).toBe(true);
  });

  it('should detect duplicate QR checkpoint codes', () => {
    const badNodes: RouteNode[] = [
      ...HOSPITAL_108_ROUTE_NODES,
      {
        id: 'node_duplicate_qr',
        name: 'Node trùng QR',
        shortName: 'Trùng QR',
        landmarkDescription: 'Test',
        type: 'intersection',
        qrCode: HOSPITAL_108_ROUTE_NODES[0].qrCode, // Trùng mã QR của node 0
        verificationStatus: 'field_verified'
      }
    ];
    const result = validateNavigationGraph(badNodes, HOSPITAL_108_ROUTE_EDGES);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Trùng lặp mã QR Checkpoint'))).toBe(true);
  });

  it('should detect edge with non-existent from/to nodes', () => {
    const badEdges: RouteEdge[] = [
      ...HOSPITAL_108_ROUTE_EDGES,
      {
        id: 'edge_ghost',
        from: 'non_existent_node_a',
        to: 'non_existent_node_b',
        distanceMeters: 10,
        bidirectional: true,
        pathType: 'indoor_hallway',
        accessibility: { wheelchair: true, elderlyFriendly: true },
        status: 'open',
        instruction: 'Đi tiếp',
        verificationStatus: 'field_verified'
      }
    ];
    const result = validateNavigationGraph(HOSPITAL_108_ROUTE_NODES, badEdges);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('không tồn tại'))).toBe(true);
  });

  it('should detect unverified edges', () => {
    const badEdges: RouteEdge[] = [
      {
        ...HOSPITAL_108_ROUTE_EDGES[0],
        id: 'edge_unverified_test',
        verificationStatus: 'unverified'
      }
    ];
    const result = validateNavigationGraph(HOSPITAL_108_ROUTE_NODES, badEdges);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('không được phép dùng'))).toBe(true);
  });

  it('should detect isolated destination node', () => {
    const isolatedDestination: RouteNode = {
      id: 'node_isolated_dest',
      name: 'Khoa cô lập',
      shortName: 'Khoa cô lập',
      type: 'destination',
      landmarkDescription: 'Không có đường đi',
      verificationStatus: 'field_verified'
    };
    const result = validateNavigationGraph([...HOSPITAL_108_ROUTE_NODES, isolatedDestination], HOSPITAL_108_ROUTE_EDGES);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('bị cô lập'))).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { generateNavigationSteps } from '../services/pathfinding/routeInstructions';
import { findPathAStar } from '../services/pathfinding/aStar';
import { HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES } from '../data/hospital108/navigation';

describe('generateNavigationSteps', () => {
  it('should generate accurate step-by-step navigation instructions for pilot route', () => {
    const pathResult = findPathAStar(
      'node_gate_01',
      'node_c1_1_a_desk',
      HOSPITAL_108_ROUTE_NODES,
      HOSPITAL_108_ROUTE_EDGES,
      'shortest_walk'
    );

    expect(pathResult.found).toBe(true);

    const steps = generateNavigationSteps(
      pathResult.pathNodeIds,
      pathResult.edges,
      HOSPITAL_108_ROUTE_NODES
    );

    expect(steps.length).toBe(4);

    // Bước 1: Cổng 1 -> Ngã ba sân trung tâm
    expect(steps[0].fromNodeId).toBe('node_gate_01');
    expect(steps[0].toNodeId).toBe('node_yard_junction');
    expect(steps[0].title).toContain('Bước 1/4');
    expect(steps[0].instruction).toContain('bùng binh');
    expect(steps[0].landmark.toLowerCase()).toContain('bùng binh');
    expect(steps[0].actionType).toBe('go_straight');

    // Bước 2: Ngã ba -> Cửa C1-1
    expect(steps[1].fromNodeId).toBe('node_yard_junction');
    expect(steps[1].toNodeId).toBe('node_c1_1_entrance');
    expect(steps[1].actionType).toBe('enter_building');

    // Bước 4 (cuối cùng): Sảnh -> Quầy tiếp đón C1.1-A
    expect(steps[3].fromNodeId).toBe('node_c1_1_lobby');
    expect(steps[3].toNodeId).toBe('node_c1_1_a_desk');
    expect(steps[3].actionType).toBe('arrive');
    expect(steps[3].checkpointCode).toBe('MEDNAV108:checkpoint:node_c1_1_a_desk');
  });

  it('should return empty steps when path has single node or is empty', () => {
    expect(generateNavigationSteps(['node_gate_01'], [], HOSPITAL_108_ROUTE_NODES)).toEqual([]);
    expect(generateNavigationSteps([], [], HOSPITAL_108_ROUTE_NODES)).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import { findPathAStar, calculateHeuristic } from '../services/pathfinding/aStar';
import { findPathDijkstra } from '../services/pathfinding/dijkstra';
import { HOSPITAL_108_ROUTE_NODES, HOSPITAL_108_ROUTE_EDGES } from '../data/hospital108/navigation';
import { FIXTURE_NODES, FIXTURE_EDGES } from './fixtures/navigationGraph.fixture';

describe('findPathAStar (Pathfinding Service)', () => {
  it('should find optimal path for real verified pilot route (Gate 1 -> C1.1-A Desk)', () => {
    const result = findPathAStar(
      'node_gate_01',
      'node_c1_1_a_desk',
      HOSPITAL_108_ROUTE_NODES,
      HOSPITAL_108_ROUTE_EDGES,
      'shortest_walk'
    );

    expect(result.found).toBe(true);
    expect(result.pathNodeIds).toEqual([
      'node_gate_01',
      'node_yard_junction',
      'node_c1_1_entrance',
      'node_c1_1_lobby',
      'node_c1_1_a_desk'
    ]);
    expect(result.totalDistanceMeters).toBe(100);
    expect(result.edges.length).toBe(4);
  });

  it('should return identical path to Dijkstra when heuristic is zero', () => {
    const aStarResult = findPathAStar(
      'node_gate_01',
      'node_c1_1_a_desk',
      HOSPITAL_108_ROUTE_NODES,
      HOSPITAL_108_ROUTE_EDGES,
      'shortest_walk'
    );

    const dijkstraResult = findPathDijkstra(
      'node_gate_01',
      'node_c1_1_a_desk',
      HOSPITAL_108_ROUTE_NODES,
      HOSPITAL_108_ROUTE_EDGES,
      'shortest_walk'
    );

    expect(aStarResult.found).toBe(true);
    expect(dijkstraResult.found).toBe(true);
    expect(aStarResult.pathNodeIds).toEqual(dijkstraResult.pathNodeIds);
    expect(aStarResult.totalDistanceMeters).toBe(dijkstraResult.totalDistanceMeters);
  });

  it('should choose elevator over stairs when profile is wheelchair_accessible', () => {
    const result = findPathAStar(
      'f_node_a',
      'f_node_dest_f2',
      FIXTURE_NODES,
      FIXTURE_EDGES,
      'wheelchair_accessible'
    );

    expect(result.found).toBe(true);
    // Tuyến xe lăn bắt buộc phải qua thang máy (f_node_elevator_f1 -> f_node_elevator_f2)
    expect(result.pathNodeIds).toContain('f_node_elevator_f1');
    expect(result.pathNodeIds).toContain('f_node_elevator_f2');
    expect(result.pathNodeIds).not.toContain('f_node_stairs_f1');
  });

  it('should choose stairs when profile is shortest_walk and stairs path is shorter', () => {
    const result = findPathAStar(
      'f_node_a',
      'f_node_dest_f2',
      FIXTURE_NODES,
      FIXTURE_EDGES,
      'shortest_walk'
    );

    expect(result.found).toBe(true);
    // Tuyến đi bộ ngắn nhất chọn thang bộ (10+5+15+10 = 40m vs 10+25+5+10 = 50m)
    expect(result.pathNodeIds).toContain('f_node_stairs_f1');
    expect(result.pathNodeIds).toContain('f_node_stairs_f2');
  });

  it('should return found=false when destination is unreachable or isolated', () => {
    const result = findPathAStar(
      'f_node_a',
      'f_node_isolated',
      FIXTURE_NODES,
      FIXTURE_EDGES,
      'shortest_walk'
    );

    expect(result.found).toBe(false);
    expect(result.pathNodeIds).toEqual([]);
    expect(result.totalDistanceMeters).toBe(0);
  });

  it('should handle startNodeId === destinationNodeId gracefully', () => {
    const result = findPathAStar(
      'node_gate_01',
      'node_gate_01',
      HOSPITAL_108_ROUTE_NODES,
      HOSPITAL_108_ROUTE_EDGES,
      'shortest_walk'
    );

    expect(result.found).toBe(true);
    expect(result.pathNodeIds).toEqual(['node_gate_01']);
    expect(result.totalDistanceMeters).toBe(0);
  });

  it('heuristic should be zero when comparing nodes on different floors or buildings', () => {
    const nodeF1 = FIXTURE_NODES.find(n => n.id === 'f_node_a')!;
    const nodeF2 = FIXTURE_NODES.find(n => n.id === 'f_node_dest_f2')!;
    expect(calculateHeuristic(nodeF1, nodeF2)).toBe(0);
  });
});

// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { RouteMap } from '../components/navigation/RouteMap';
import type { RouteNode, RouteEdge, NavigationStep } from '../types';

describe('RouteMap Runtime & Interactive Rendering Tests', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const sampleNodes: RouteNode[] = [
    {
      id: 'node_1',
      name: 'Cổng 1 - Trần Hưng Đạo',
      shortName: 'Cổng 1',
      x: 100,
      y: 100,
      type: 'gate',
      landmarkDescription: 'Cổng chính vào viện',
      verificationStatus: 'field_verified'
    },
    {
      id: 'node_2',
      name: 'Bùng binh sân trung tâm',
      shortName: 'Bùng binh',
      x: 300,
      y: 200,
      type: 'intersection',
      landmarkDescription: 'Đài phun nước / bùng binh',
      verificationStatus: 'field_verified'
    },
    {
      id: 'node_3',
      name: 'Cửa vào Tòa nhà C1-1',
      shortName: 'Cửa C1-1',
      x: 500,
      y: 350,
      type: 'building_entrance',
      landmarkDescription: 'Cửa kính tự động',
      verificationStatus: 'field_verified'
    }
  ];

  const sampleEdges: RouteEdge[] = [
    {
      id: 'edge_1_2',
      from: 'node_1',
      to: 'node_2',
      distanceMeters: 45,
      bidirectional: true,
      pathType: 'outdoor_walkway',
      accessibility: { wheelchair: true, elderlyFriendly: true },
      status: 'open',
      instruction: 'Đi thẳng từ Cổng 1 qua sân',
      verificationStatus: 'field_verified'
    },
    {
      id: 'edge_2_3',
      from: 'node_2',
      to: 'node_3',
      distanceMeters: 30,
      bidirectional: true,
      pathType: 'outdoor_walkway',
      accessibility: { wheelchair: true, elderlyFriendly: true },
      status: 'open',
      instruction: 'Rẽ phải hướng về sảnh C1-1',
      verificationStatus: 'field_verified'
    }
  ];

  const sampleSteps: NavigationStep[] = [
    {
      id: 'step_1',
      fromNodeId: 'node_1',
      toNodeId: 'node_2',
      title: 'Bước 1: Cổng 1 -> Bùng binh',
      instruction: 'Đi thẳng từ Cổng 1 đến Bùng binh sân trung tâm',
      landmark: 'Bùng binh sân trung tâm',
      distanceMeters: 45,
      verificationStatus: 'field_verified',
      actionType: 'go_straight'
    },
    {
      id: 'step_2',
      fromNodeId: 'node_2',
      toNodeId: 'node_3',
      title: 'Bước 2: Bùng binh -> Cửa C1-1',
      instruction: 'Rẽ phải về phía Cửa Tòa C1-1',
      landmark: 'Cửa kính tự động C1-1',
      distanceMeters: 30,
      verificationStatus: 'field_verified',
      actionType: 'turn_right'
    }
  ];

  it('1. Render thật component mà không ném lỗi runtime (không có lỗi Map is not a constructor)', () => {
    const handleOpenOfficialMap = vi.fn();

    expect(() => {
      render(
        <RouteMap
          nodes={sampleNodes}
          edges={sampleEdges}
          pathNodeIds={['node_1', 'node_2', 'node_3']}
          currentNodeId="node_1"
          currentStepIndex={0}
          steps={sampleSteps}
          onOpenOfficialMap={handleOpenOfficialMap}
        />
      );
    }).not.toThrow();

    // SVG canvas được render
    const svgElement = screen.getByTestId('route-map-svg');
    expect(svgElement).toBeTruthy();
    
    // Kiểm tra viewBox hợp lệ, không chứa NaN hay Infinity
    const viewBox = svgElement.getAttribute('viewBox');
    expect(viewBox).not.toBeNull();
    expect(viewBox).not.toContain('NaN');
    expect(viewBox).not.toContain('Infinity');
  });

  it('2. Hiển thị các node và nhãn mốc thuộc tuyến đường', () => {
    render(
      <RouteMap
        nodes={sampleNodes}
        edges={sampleEdges}
        pathNodeIds={['node_1', 'node_2', 'node_3']}
        currentNodeId="node_1"
        currentStepIndex={0}
        steps={sampleSteps}
      />
    );

    expect(screen.getByText('Cổng 1')).toBeTruthy();
    expect(screen.getByText('Bùng binh')).toBeTruthy();
    expect(screen.getByText('Cửa C1-1')).toBeTruthy();
  });

  it('3. Nút Bản đồ đối chiếu xuất hiện và gọi callback khi được click', () => {
    const handleOpenOfficialMap = vi.fn();
    render(
      <RouteMap
        nodes={sampleNodes}
        edges={sampleEdges}
        pathNodeIds={['node_1', 'node_2', 'node_3']}
        currentNodeId="node_1"
        currentStepIndex={0}
        steps={sampleSteps}
        onOpenOfficialMap={handleOpenOfficialMap}
      />
    );

    const mapBtn = screen.getByTestId('btn-official-map');
    expect(mapBtn).toBeTruthy();
    expect(screen.getByText('Bản đồ đối chiếu')).toBeTruthy();

    fireEvent.click(mapBtn);
    expect(handleOpenOfficialMap).toHaveBeenCalledTimes(1);
  });

  it('4. Các nút điều khiển phóng to, thu nhỏ, vừa màn hình hoạt động trơn tru', () => {
    render(
      <RouteMap
        nodes={sampleNodes}
        edges={sampleEdges}
        pathNodeIds={['node_1', 'node_2', 'node_3']}
        currentNodeId="node_1"
        currentStepIndex={0}
        steps={sampleSteps}
      />
    );

    const zoomInBtn = screen.getByTestId('btn-zoom-in');
    const zoomOutBtn = screen.getByTestId('btn-zoom-out');
    const resetBtn = screen.getByTestId('btn-reset-view');

    expect(zoomInBtn).toBeTruthy();
    expect(zoomOutBtn).toBeTruthy();
    expect(resetBtn).toBeTruthy();

    // Click các nút zoom
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomOutBtn);
    fireEvent.click(resetBtn);
  });

  it('5. Cập nhật khi thay đổi danh sách nodes mà không gặp lỗi', () => {
    const { rerender } = render(
      <RouteMap
        nodes={sampleNodes}
        edges={sampleEdges}
        pathNodeIds={['node_1', 'node_2']}
        currentNodeId="node_1"
        currentStepIndex={0}
        steps={sampleSteps}
      />
    );

    expect(screen.getByText('Cổng 1')).toBeTruthy();

    const updatedNodes: RouteNode[] = [
      ...sampleNodes,
      {
        id: 'node_4',
        name: 'Sảnh đón tiếp C1.1',
        shortName: 'Sảnh C1.1',
        x: 600,
        y: 400,
        type: 'lobby',
        landmarkDescription: 'Sảnh lớn',
        verificationStatus: 'field_verified'
      }
    ];

    expect(() => {
      rerender(
        <RouteMap
          nodes={updatedNodes}
          edges={sampleEdges}
          pathNodeIds={['node_1', 'node_2', 'node_4']}
          currentNodeId="node_2"
          currentStepIndex={1}
          steps={sampleSteps}
        />
      );
    }).not.toThrow();

    expect(screen.getByText('Sảnh C1.1')).toBeTruthy();
  });

  it('6. Xử lý an toàn khi pathNodeIds rỗng hoặc chứa id không tồn tại', () => {
    expect(() => {
      render(
        <RouteMap
          nodes={sampleNodes}
          edges={sampleEdges}
          pathNodeIds={[]}
          currentNodeId="node_1"
          currentStepIndex={0}
          steps={[]}
        />
      );
    }).not.toThrow();

    expect(() => {
      render(
        <RouteMap
          nodes={sampleNodes}
          edges={sampleEdges}
          pathNodeIds={['non_existent_1', 'non_existent_2']}
          currentNodeId="unknown"
          currentStepIndex={0}
          steps={[]}
        />
      );
    }).not.toThrow();
  });

  it('7. Xử lý an toàn khi nodes không có tọa độ (fallback thông báo thân thiện)', () => {
    const unpositionedNodes: RouteNode[] = [
      {
        id: 'node_x1',
        name: 'Điểm không tọa độ 1',
        shortName: 'Điểm 1',
        type: 'intersection',
        landmarkDescription: 'Mô tả',
        verificationStatus: 'field_verified'
      },
      {
        id: 'node_x2',
        name: 'Điểm không tọa độ 2',
        shortName: 'Điểm 2',
        type: 'intersection',
        landmarkDescription: 'Mô tả',
        verificationStatus: 'field_verified'
      }
    ];

    render(
      <RouteMap
        nodes={unpositionedNodes}
        edges={[]}
        pathNodeIds={['node_x1', 'node_x2']}
        currentNodeId="node_x1"
        currentStepIndex={0}
        steps={[]}
      />
    );

    expect(screen.getByText('Chưa có dữ liệu sơ đồ cho tuyến này.')).toBeTruthy();
    
    // ViewBox an toàn mặc định
    const svg = screen.getByTestId('route-map-svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 500 300');
  });

  it('8. Xử lý an toàn khi edge tham chiếu node không tồn tại', () => {
    const brokenEdges: RouteEdge[] = [
      {
        id: 'broken_edge',
        from: 'ghost_node_1',
        to: 'ghost_node_2',
        distanceMeters: 50,
        bidirectional: true,
        pathType: 'outdoor_walkway',
        accessibility: { wheelchair: true, elderlyFriendly: true },
        status: 'open',
        instruction: 'Đi qua hư không',
        verificationStatus: 'field_verified'
      }
    ];

    expect(() => {
      render(
        <RouteMap
          nodes={sampleNodes}
          edges={brokenEdges}
          pathNodeIds={['node_1', 'node_2']}
          currentNodeId="node_1"
          currentStepIndex={0}
          steps={sampleSteps}
        />
      );
    }).not.toThrow();
  });
});

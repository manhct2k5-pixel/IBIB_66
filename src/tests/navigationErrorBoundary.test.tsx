// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { NavigationErrorBoundary } from '../components/errors/NavigationErrorBoundary';

const FaultyComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test intentional rendering error');
  }
  return <div>Component bình thường</div>;
};

describe('NavigationErrorBoundary Tests', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('1. Render children bình thường khi không có lỗi', () => {
    render(
      <NavigationErrorBoundary>
        <FaultyComponent shouldThrow={false} />
      </NavigationErrorBoundary>
    );

    expect(screen.getByText('Component bình thường')).toBeTruthy();
  });

  it('2. Bắt lỗi runtime và hiển thị giao diện thân thiện với bệnh nhân (không hiển thị stack trace)', () => {
    // Tạm thời ẩn console.error trong test này
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <NavigationErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </NavigationErrorBoundary>
    );

    expect(screen.getByText('Không thể hiển thị sơ đồ chỉ đường')).toBeTruthy();
    expect(screen.getByText(/Bác có thể thử lại hoặc quay về chọn nơi đến/i)).toBeTruthy();
    expect(screen.getByText('Thử lại')).toBeTruthy();

    spy.mockRestore();
  });

  it('3. Nút Về trang chủ kích hoạt callback onReset', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const handleReset = vi.fn();

    render(
      <NavigationErrorBoundary onReset={handleReset}>
        <FaultyComponent shouldThrow={true} />
      </NavigationErrorBoundary>
    );

    const homeBtn = screen.getByText('Về trang chủ');
    expect(homeBtn).toBeTruthy();

    fireEvent.click(homeBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});

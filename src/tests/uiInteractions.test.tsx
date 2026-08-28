// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import App from '../App';
import { RoutePreview } from '../components/RoutePreview';
import { Official108Map } from '../components/Official108Map';
import { HOSPITAL_108_DESTINATIONS, HOSPITAL_108_START_LOCATIONS, HOSPITAL_108_OFFICIAL_MAP_LINKS } from '../data/hospital108';

describe('UI Interaction Tests', () => {
  beforeEach(() => {
    window.history.replaceState({ view: 'home', destinationId: null, startLocationId: null, mapLinkId: null }, '');
  });

  afterEach(() => {
    cleanup();
  });

  describe('RoutePreview Component', () => {
    const mockStart = HOSPITAL_108_START_LOCATIONS[0];
    const mockDest = HOSPITAL_108_DESTINATIONS[0];

    it('renders prominent CTA button and honest assisted disclaimer', () => {
      const onStartNav = vi.fn();
      const onChangeStart = vi.fn();
      const onChangeDest = vi.fn();

      render(
        <RoutePreview
          startLocation={mockStart}
          destination={mockDest}
          onStartNavigation={onStartNav}
          onChangeStart={onChangeStart}
          onChangeDestination={onChangeDest}
        />
      );

      // Verify CTA button exists with correct text
      const ctaBtn = screen.getByRole('button', { name: /Mở chức năng Chỉ đường trên InMapz/i });
      expect(ctaBtn).toBeTruthy();
      expect(ctaBtn.className).toContain('min-h-[56px]');

      // Verify honest disclaimer
      expect(screen.getByText(/Bác sẽ cần chọn lại điểm bắt đầu và nơi muốn đến trên bản đồ chính thức/i)).toBeTruthy();

      // Click CTA triggers onStartNavigation
      fireEvent.click(ctaBtn);
      expect(onStartNav).toHaveBeenCalledTimes(1);
    });

    it('handles change start and change destination clicks', () => {
      const onStartNav = vi.fn();
      const onChangeStart = vi.fn();
      const onChangeDest = vi.fn();

      render(
        <RoutePreview
          startLocation={mockStart}
          destination={mockDest}
          onStartNavigation={onStartNav}
          onChangeStart={onChangeStart}
          onChangeDestination={onChangeDest}
        />
      );

      const changeStartBtns = screen.getAllByRole('button', { name: /Đổi điểm xuất phát/i });
      fireEvent.click(changeStartBtns[0]);
      expect(onChangeStart).toHaveBeenCalledTimes(1);

      const changeDestBtns = screen.getAllByRole('button', { name: /Đổi nơi muốn đến/i });
      fireEvent.click(changeDestBtns[0]);
      expect(onChangeDest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Official108Map Component', () => {
    const mockStart = HOSPITAL_108_START_LOCATIONS[0];
    const mockDest = HOSPITAL_108_DESTINATIONS[0];
    const mockMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS[0];

    it('displays floating BƯỚC TIẾP THEO banner in assisted_external_map mode', () => {
      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          startLocation={mockStart}
          routingMode="assisted_external_map"
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      expect(screen.getByText('BƯỚC TIẾP THEO')).toBeTruthy();
      expect(screen.getByText(/Bấm nút “Chỉ đường” trên bản đồ InMapz/i)).toBeTruthy();

      // Dismiss banner
      const closeBannerBtn = screen.getByRole('button', { name: /Đóng thông báo/i });
      fireEvent.click(closeBannerBtn);
      expect(screen.queryByText('BƯỚC TIẾP THEO')).toBeNull();
    });

    it('expands and collapses bottom sheet on user interaction', () => {
      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          startLocation={mockStart}
          routingMode="assisted_external_map"
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      // Initially collapsed: button text is "Xem hướng dẫn" with aria-expanded="false"
      const expandBtn = screen.getByRole('button', { name: /Xem hướng dẫn/i });
      expect(expandBtn.getAttribute('aria-expanded')).toBe('false');
      expect(screen.queryByText(/Các bước xem tuyến trên bản đồ InMapz/i)).toBeNull();

      // Click to expand
      fireEvent.click(expandBtn);

      // Expanded: button text becomes "Thu gọn" with aria-expanded="true"
      const collapseBtn = screen.getByRole('button', { name: /Thu gọn/i });
      expect(collapseBtn.getAttribute('aria-expanded')).toBe('true');
      expect(screen.getByText(/Các bước xem tuyến trên bản đồ InMapz/i)).toBeTruthy();

      // Click helper toggle "Không tìm thấy nút Chỉ đường?"
      const helperToggle = screen.getByRole('button', { name: /Không tìm thấy nút Chỉ đường/i });
      fireEvent.click(helperToggle);
      expect(screen.getByText(/Một số điện thoại có thể ẩn bớt công cụ/i)).toBeTruthy();

      // Click collapse
      fireEvent.click(collapseBtn);
      expect(screen.queryByText(/Các bước xem tuyến trên bản đồ InMapz/i)).toBeNull();
    });

    it('all external links have rel="noopener noreferrer" and target="_blank"', () => {
      const { container } = render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          startLocation={mockStart}
          routingMode="assisted_external_map"
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      const links = container.querySelectorAll('a[target="_blank"]');
      expect(links.length).toBeGreaterThan(0);
      links.forEach(link => {
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        expect(link.getAttribute('href')).toContain('https://mapscustom.inmapz.com/');
      });
    });
  });

  describe('App Routing and History State Transitions', () => {
    it('navigates through the complete 5-step flow and supports sequential back navigation', async () => {
      render(<App />);

      // Step 1: Home view - search or select destination
      const c11aCards = screen.getAllByText('Khoa Khám bệnh đa khoa C1.1-A');
      expect(c11aCards.length).toBeGreaterThan(0);
      fireEvent.click(c11aCards[0]);

      // Step 2: Destination detail view
      expect(screen.getByText(/Thời gian tiếp đón:/i)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /Chọn điểm xuất phát/i }));

      // Step 3: Select start location
      expect(screen.getByText(/Bác đang ở đâu\?/i)).toBeTruthy();
      const startLocGate1 = screen.getAllByText('Cổng chính (Số 1 Trần Hưng Đạo)')[0];
      fireEvent.click(startLocGate1);

      // Step 4: Route preview
      expect(screen.getByText('Cần chọn lại trên bản đồ')).toBeTruthy();
      const openMapBtn = screen.getByRole('button', { name: /Mở chức năng Chỉ đường trên InMapz/i });
      expect(openMapBtn).toBeTruthy();

      // Step 5: Open Map view
      fireEvent.click(openMapBtn);
      expect(screen.getByText('BƯỚC TIẾP THEO')).toBeTruthy();

      // Test PopState / Back navigation
      // 1. Back from map -> Route Preview
      act(() => {
        window.dispatchEvent(new PopStateEvent('popstate', {
          state: {
            view: 'route_preview',
            destinationId: 'c1_1_a',
            startLocationId: 'start_gate_01',
            mapLinkId: null
          }
        }));
      });
      expect(screen.getByText('Cần chọn lại trên bản đồ')).toBeTruthy();

      // 2. Back from Route Preview -> Select Start
      act(() => {
        window.dispatchEvent(new PopStateEvent('popstate', {
          state: {
            view: 'select_start',
            destinationId: 'c1_1_a',
            startLocationId: null,
            mapLinkId: null
          }
        }));
      });
      expect(screen.getByText(/Bác đang ở đâu\?/i)).toBeTruthy();

      // 3. Back from Select Start -> Destination Detail
      act(() => {
        window.dispatchEvent(new PopStateEvent('popstate', {
          state: {
            view: 'destination_detail',
            destinationId: 'c1_1_a',
            startLocationId: null,
            mapLinkId: null
          }
        }));
      });
      expect(screen.getByText(/Thời gian tiếp đón:/i)).toBeTruthy();

      // 4. Back from Destination Detail -> Home
      act(() => {
        window.dispatchEvent(new PopStateEvent('popstate', {
          state: {
            view: 'home',
            destinationId: null,
            startLocationId: null,
            mapLinkId: null
          }
        }));
      });
      expect(screen.getAllByText('Khoa Khám bệnh đa khoa C1.1-A').length).toBeGreaterThan(0);
    });
  });
});

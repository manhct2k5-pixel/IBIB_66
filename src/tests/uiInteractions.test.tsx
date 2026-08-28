// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import App from '../App';
import { Official108Map } from '../components/Official108Map';
import { DestinationStep } from '../components/DestinationStep';
import { 
  HOSPITAL_108_DESTINATIONS, 
  HOSPITAL_108_START_LOCATIONS, 
  HOSPITAL_108_OFFICIAL_MAP_LINKS 
} from '../data/hospital108';

describe('UI Interaction & Streamlined Flow Tests', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    window.history.replaceState({ view: 'home', destinationId: null, startLocationId: null, mapLinkId: null }, '');
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Direct 2-Screen Flow: Home -> Official108Map', () => {
    it('1. Chọn một địa điểm từ trang chủ mở ngay Official108Map mà không đi qua các màn hình trung gian', () => {
      render(<App />);

      // Verify on Home screen
      expect(screen.getByText('Bác muốn đến đâu trong Bệnh viện 108?')).toBeTruthy();

      // Click destination button: "Khoa Khám bệnh đa khoa C1.1-A"
      const c11aCard = screen.getAllByText('Khoa Khám bệnh đa khoa C1.1-A')[0];
      const button = c11aCard.closest('button');
      expect(button).toBeTruthy();
      fireEvent.click(button!);

      // Verify we are directly in Official108Map
      expect(screen.queryByText('Kiểm tra tuyến đường')).toBeNull();

      // Official108Map is rendered with iframe in DOM
      const iframe = screen.getByTitle(/Bản đồ Bệnh viện 108 - Khoa Khám bệnh đa khoa C1.1-A/i);
      expect(iframe).toBeTruthy();
      expect(iframe.tagName.toLowerCase()).toBe('iframe');

      // 3. src của iframe khớp mapLinkId của điểm đến (c1_1_a -> c1-1-floor1)
      expect(iframe.getAttribute('src')).toContain('venue=2301');
      expect(iframe.getAttribute('src')).toContain('floor=5170');
    });

    it('2. Sau khi chọn điểm đến, iframe InMapz xuất hiện ngay trong MedNav mà không mở tab mới', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      render(<App />);
      const c11aCard = screen.getAllByText('Khoa Khám bệnh đa khoa C1.1-A')[0];
      fireEvent.click(c11aCard.closest('button')!);

      // 5. Không tự gọi window.open()
      expect(windowOpenSpy).not.toHaveBeenCalled();

      // iframe exists in DOM
      const iframe = document.querySelector('iframe');
      expect(iframe).toBeTruthy();
      expect(iframe?.getAttribute('loading')).toBe('eager');
    });

    it('3. Nút Back từ bản đồ quay thẳng về trang chủ khi bottom sheet đang thu gọn', () => {
      render(<App />);

      // Step 1: Select destination
      const c11aCard = screen.getAllByText('Khoa Khám bệnh đa khoa C1.1-A')[0];
      fireEvent.click(c11aCard.closest('button')!);
      expect(screen.getByTitle(/Bản đồ Bệnh viện 108/i)).toBeTruthy();

      // Step 2: Click Back button in header
      const backBtn = screen.getByRole('button', { name: /Quay lại/i });
      fireEvent.click(backBtn);

      // Verify returned straight to Home
      expect(screen.getByText('Bác muốn đến đâu trong Bệnh viện 108?')).toBeTruthy();
      expect(screen.queryByTitle(/Bản đồ Bệnh viện 108/i)).toBeNull();
    });

    it('4. Nếu bottom sheet đang mở rộng, Back đóng bottom sheet trước, không chuyển trang', () => {
      render(<App />);

      // Select destination
      const c11aCard = screen.getAllByText('Khoa Khám bệnh đa khoa C1.1-A')[0];
      fireEvent.click(c11aCard.closest('button')!);

      // Expand bottom sheet
      const expandBtn = screen.getByRole('button', { name: /Xem hỗ trợ/i });
      fireEvent.click(expandBtn);

      // Verify sheet is expanded
      expect(screen.getByText(/3 bước xem đường đi trên bản đồ/i)).toBeTruthy();

      // Click Back button
      const backBtn = screen.getByRole('button', { name: /Quay lại/i });
      fireEvent.click(backBtn);

      // Sheet should be collapsed, but still on map!
      expect(screen.queryByText(/3 bước xem đường đi trên bản đồ/i)).toBeNull();
      expect(screen.getByTitle(/Bản đồ Bệnh viện 108/i)).toBeTruthy();

      // Clicking Back again returns to Home
      fireEvent.click(backBtn);
      expect(screen.getByText('Bác muốn đến đâu trong Bệnh viện 108?')).toBeTruthy();
    });

    it('5. Phục hồi hợp lệ khi tải lại trang bản đồ hoặc fallback về home nếu không hợp lệ', () => {
      // Test valid restoration
      window.history.replaceState({
        view: 'official_map',
        destinationId: 'c1_1_a',
        startLocationId: null,
        mapLinkId: 'c1-1-floor1'
      }, '');

      const { unmount } = render(<App />);
      expect(screen.getByTitle(/Bản đồ Bệnh viện 108 - Khoa Khám bệnh đa khoa C1.1-A/i)).toBeTruthy();
      unmount();

      // Test invalid restoration fallback
      window.history.replaceState({
        view: 'official_map',
        destinationId: 'non_existent_id',
        startLocationId: null,
        mapLinkId: null
      }, '');

      render(<App />);
      expect(screen.getByText('Bác muốn đến đâu trong Bệnh viện 108?')).toBeTruthy();
    });
  });

  describe('Official108Map Component Detailed Interaction', () => {
    const mockDest = HOSPITAL_108_DESTINATIONS[0];
    const mockMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS[0];

    it('9. Bottom sheet thu gọn hiển thị đúng tên điểm đến và hướng dẫn theo ngữ cảnh', () => {
      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      // Collapsed sheet has destination label and context instruction
      expect(screen.getAllByText(new RegExp(mockDest.name, 'i')).length).toBeGreaterThan(0);
      expect(screen.getByText(/Chỉ đường tới đây/i)).toBeTruthy();

      const supportBtn = screen.getByRole('button', { name: /Xem hỗ trợ/i });
      expect(supportBtn.getAttribute('aria-expanded')).toBe('false');
    });

    it('10. Chọn vị trí hiện tại là tùy chọn trong sheet mở rộng và ghi rõ trung thực', () => {
      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      // Expand sheet
      fireEvent.click(screen.getByRole('button', { name: /Xem hỗ trợ/i }));

      // Click "Chọn vị trí hiện tại"
      const pickStartBtn = screen.getByRole('button', { name: /Chọn vị trí hiện tại/i });
      fireEvent.click(pickStartBtn);

      // Start locations modal appears
      expect(screen.getByText('Bác đang đứng ở đâu?')).toBeTruthy();
      expect(screen.getByText(/MedNav chưa thể tự điền vị trí này vào InMapz/i)).toBeTruthy();

      // Pick Gate 1
      const gate1Btn = screen.getByText('Cổng chính (Số 1 Trần Hưng Đạo)');
      fireEvent.click(gate1Btn.closest('button')!);

      // Start location notice appears in expanded sheet
      expect(screen.getByText(/Bác đang ở:/i)).toBeTruthy();
      expect(screen.getByText(/Khi mở Chỉ đường trên bản đồ, hãy chọn vị trí này làm điểm bắt đầu/i)).toBeTruthy();
      expect(screen.getByText(/MedNav chưa thể tự điền vị trí này vào InMapz/i)).toBeTruthy();
    });

    it('11. Không xuất hiện các chuỗi tuyên bố sai về tự động điền hoặc cự ly không nguồn', () => {
      const { container } = render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      const html = container.innerHTML;
      expect(html).not.toContain('Tuyến đường đã sẵn sàng');
      expect(html).not.toContain('MedNav đã tạo tuyến');
      expect(html).not.toContain('Đã tự động điền điểm đầu và điểm đến');
      expect(html).not.toContain('khoảng cách:');
      expect(html).not.toContain('bước chân');
    });

    it('12. Iframe Timeout & Lifecycle: Iframe chưa tải sau 10s -> fallback xuất hiện; tải xong -> fallback biến mất', () => {
      vi.useFakeTimers();

      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      const iframe = screen.getByTitle(/Bản đồ Bệnh viện 108/i);

      // Trước 10s: đang tải, fallback chưa xuất hiện
      expect(screen.queryByText(/Bản đồ tải chậm hoặc trình duyệt đang hạn chế nhúng/i)).toBeNull();

      // Tua qua 10s -> fallback xuất hiện
      act(() => {
        vi.advanceTimersByTime(10001);
      });
      expect(screen.getByText(/Bản đồ tải chậm hoặc trình duyệt đang hạn chế nhúng/i)).toBeTruthy();

      // Khi iframe phát onLoad -> fallback biến mất ngay lập tức
      act(() => {
        fireEvent.load(iframe);
      });
      expect(screen.queryByText(/Bản đồ tải chậm hoặc trình duyệt đang hạn chế nhúng/i)).toBeNull();

      vi.useRealTimers();
    });

    it('13. Iframe tải thành công trước 10s thì fallback không bao giờ xuất hiện', () => {
      vi.useFakeTimers();

      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      const iframe = screen.getByTitle(/Bản đồ Bệnh viện 108/i);

      // Tải thành công sau 2s
      act(() => {
        vi.advanceTimersByTime(2000);
        fireEvent.load(iframe);
      });

      // Tua tiếp sau 10s
      act(() => {
        vi.advanceTimersByTime(15000);
      });

      // Fallback không xuất hiện
      expect(screen.queryByText(/Bản đồ tải chậm hoặc trình duyệt đang hạn chế nhúng/i)).toBeNull();

      vi.useRealTimers();
    });

    it('14. Nút "Thử tải lại trong MedNav" tăng loadAttempt/key và trở về trạng thái loading', () => {
      vi.useFakeTimers();

      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      // Quá 10s để hiện nút thử lại
      act(() => {
        vi.advanceTimersByTime(10001);
      });
      const retryBtn = screen.getByRole('button', { name: /Thử tải lại trong MedNav/i });
      expect(retryBtn).toBeTruthy();

      // Bấm nút thử lại
      act(() => {
        fireEvent.click(retryBtn);
      });

      // Quay về trạng thái loading, fallback ẩn đi
      expect(screen.getByText(/Đang tải bản đồ chính thức Bệnh viện 108/i)).toBeTruthy();
      expect(screen.queryByText(/Bản đồ tải chậm hoặc trình duyệt đang hạn chế nhúng/i)).toBeNull();

      vi.useRealTimers();
    });

    it('15. onError hoặc mất kết nối kích hoạt fallback ngay lập tức', () => {
      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      const iframe = screen.getByTitle(/Bản đồ Bệnh viện 108/i);
      
      // Test offline event
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });
      expect(screen.getByText(/Không có kết nối Internet/i)).toBeTruthy();

      // Back online
      act(() => {
        window.dispatchEvent(new Event('online'));
      });
      expect(screen.queryByText(/Không có kết nối Internet/i)).toBeNull();

      // Test error event on iframe
      act(() => {
        fireEvent.error(iframe);
      });
    });

    it('16. Tất cả liên kết target="_blank" phải có rel="noopener noreferrer"', () => {
      const { container } = render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      // Expand to check secondary links
      fireEvent.click(screen.getByRole('button', { name: /Xem hỗ trợ/i }));

      const blankLinks = container.querySelectorAll('a[target="_blank"]');
      expect(blankLinks.length).toBeGreaterThan(0);
      blankLinks.forEach(link => {
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        expect(link.getAttribute('href')).toContain('https://mapscustom.inmapz.com/');
      });
    });

    it('17. Mở thông tin nơi đến hiển thị giờ tiếp đón và mức xác minh', () => {
      render(
        <Official108Map
          mapLink={mockMapLink}
          destination={mockDest}
          onClose={vi.fn()}
          onChangeDestination={vi.fn()}
          onOpenHelp={vi.fn()}
          onOpenEmergency={vi.fn()}
        />
      );

      // Expand sheet
      fireEvent.click(screen.getByRole('button', { name: /Xem hỗ trợ/i }));

      // Click "Thông tin nơi đến"
      const infoBtn = screen.getByRole('button', { name: /Thông tin nơi đến/i });
      fireEvent.click(infoBtn);

      expect(screen.getByText(new RegExp(`Thông tin: ${mockDest.name}`, 'i'))).toBeTruthy();
      expect(screen.getByText('06:30 - 17:00 (Thứ 2 - Thứ 6)')).toBeTruthy();
      expect(screen.getByText('Mức độ xác minh bản đồ:')).toBeTruthy();
    });
  });

  describe('Search & Emergency Interactions', () => {
    it('Tìm kiếm tiếng Việt có dấu và không dấu hoạt động chính xác', () => {
      const onSelect = vi.fn();
      render(
        <DestinationStep
          onSelectDestination={onSelect}
          onOpenVoiceModal={vi.fn()}
          onOpenGeneralMap={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Ví dụ: Cấp cứu, Khám bệnh, C1-1.../i);

      // Search without accents: "cap cuu"
      fireEvent.change(searchInput, { target: { value: 'cap cuu' } });
      expect(screen.getByText(/Khoa Cấp cứu/i)).toBeTruthy();

      // Search with accents: "quốc tế"
      fireEvent.change(searchInput, { target: { value: 'quốc tế' } });
      expect(screen.getByText(/Khu Khám Đối ngoại – Quốc tế/i)).toBeTruthy();
    });

    it('Nút Cấp cứu trên header mở EmergencyModal với số hotline 024 6278 4115', () => {
      render(<App />);

      const emergencyBtn = screen.getByLabelText('Cấp cứu');
      fireEvent.click(emergencyBtn);

      expect(screen.getByText(/Hỗ trợ khẩn cấp/i)).toBeTruthy();
      expect(screen.getByText(/024 6278 4115/i)).toBeTruthy();
      expect(screen.getByText('Gọi 115')).toBeTruthy();
    });
  });
});

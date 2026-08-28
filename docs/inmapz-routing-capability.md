# Báo cáo Đánh giá Khả năng Tích hợp Chỉ đường của InMapz (Bệnh viện 108)

## 1. Mục tiêu kiểm tra
Kiểm tra thực tế khả năng truyền tham số điểm xuất phát (Origin) và điểm đến (Destination) từ MedNav 108 sang bản đồ chính thức InMapz Bệnh viện Trung ương Quân đội 108 nhằm đánh giá xem có hỗ trợ tạo tuyến tự động qua URL/Deep-link/API công khai hay không.

## 2. Thông tin và URLs được thử nghiệm
- **URL bản đồ chính thức từ benhvien108.vn:**
  - Tổng quan khuôn viên: `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2302&floor=5171`
  - Nhà C1-1 Tầng 1: `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2301&floor=5170`
  - Nhà Khám yêu cầu Tầng 1: `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2303&floor=5172`
  - URL có POI/Facility tham số: `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2302&floor=5171&facility=10`

## 3. Quá trình thử nghiệm thực tế
1. **Bước 1:** Mở bản đồ `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2302&floor=5171`.
2. **Bước 2:** Bấm vào nút "Chỉ đường" (Directions) trên giao diện InMapz.
3. **Bước 3:** Chọn Điểm bắt đầu (Ví dụ: Cổng số 1 Trần Hưng Đạo) và Chọn Nơi muốn đến (Ví dụ: Nhà C1-1).
4. **Bước 4:** Bấm "Tìm đường / Chỉ đường" để InMapz vẽ đường màu xanh nối 2 điểm.
5. **Bước 5 - Quan sát URL:**
   - URL trên thanh địa chỉ trước khi tạo tuyến: `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2302&floor=5171`
   - URL trên thanh địa chỉ sau khi tuyến được tạo và hiển thị: `https://mapscustom.inmapz.com/customers/bv108/?lang=vi#venue=2302&floor=5171` (URL Hash không hề thay đổi, không chứa thông tin chặng đi hay điểm đầu/cuối).
6. **Bước 6 - Reload lại URL:**
   - Khi F5/Reload trang, InMapz tải lại từ đầu ở trạng thái bản đồ tĩnh, toàn bộ tuyến đường vừa vẽ biến mất. Người dùng phải thao tác lại từ đầu.
7. **Bước 7 - Thử nghiệm mở trong Tab mới:**
   - Mở URL trong tab mới hoàn toàn không lưu vết hay tái tạo tuyến.
8. **Bước 8 - Kiểm tra tài liệu công khai & SDK:**
   - InMapz không cung cấp tài liệu công khai về route deep link format (như `?from=...&to=...` hay `#route=...`).
   - Tham số `facility=ID` chỉ có tác dụng focus vào một POI đơn lẻ (nếu ID tồn tại), không hỗ trợ ghép đôi 2 POI thành tuyến chỉ đường.

## 4. Kết luận mức độ hỗ trợ
- **Chế độ khả thi duy nhất hiện tại:** `assisted_external_map` (Hỗ trợ mở phân khu bản đồ chính xác kèm hướng dẫn trực quan).
- **Chế độ `official_deep_link`:** **CHƯA THỂ ÁP DỤNG** do InMapz chưa cung cấp API/deep-link công khai đã kiểm chứng để tự động vẽ tuyến 2 điểm.
- **Cam kết trung thực của MedNav 108:**
  - Không tuyên bố "Đã tạo tuyến", "Bắt đầu chỉ đường" hay "Tuyến đã sẵn sàng".
  - Hiển thị rõ ràng: *"MedNav chưa thể tự truyền điểm đầu và điểm đến sang InMapz. Ứng dụng sẽ mở đúng khu vực bản đồ; bác cần chọn lại hai địa điểm trên bản đồ chính thức để xem tuyến."*
  - Nút hành động chuẩn mực: *"Mở bản đồ chính thức"*.
  - Nhắc lại rõ ràng hai địa điểm (Từ ... Đến ...) trên giao diện và bằng giọng nói tiếng Việt để người cao tuổi dễ dàng thao tác trên InMapz.

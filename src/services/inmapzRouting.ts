import type { 
  Hospital108Destination, 
  Hospital108StartLocation, 
  Official108MapLink, 
  RouteRequest, 
  RouteLaunchResult 
} from '../types';
import { 
  HOSPITAL_108_OFFICIAL_MAP_LINKS, 
  HOSPITAL_108_DESTINATIONS, 
  HOSPITAL_108_START_LOCATIONS 
} from '../data/hospital108';

/**
 * Lựa chọn phân khu bản đồ đã xác minh phù hợp nhất giữa điểm đầu và điểm đến:
 * - Nếu cùng một tòa nhà (cùng venueId): Mở bản đồ của tòa nhà/phân khu đó.
 * - Nếu khác tòa nhà hoặc khác venue: Mở bản đồ khuôn viên tổng quan (campus)
 *   để người dùng có cái nhìn toàn cảnh trước khi di chuyển giữa các tòa.
 */
export function chooseVerifiedMapView(
  start: Hospital108StartLocation,
  destination: Hospital108Destination
): Official108MapLink {
  const campusLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus') 
    || HOSPITAL_108_OFFICIAL_MAP_LINKS[0];

  const startMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === start.mapLinkId);
  const destMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === destination.mapLinkId);

  // Nếu một trong hai không có link, fallback về khuôn viên
  if (!startMapLink || !destMapLink) {
    return campusLink;
  }

  // Nếu cả hai cùng thuộc 1 venue (cùng 1 tòa nhà) và không phải là campus
  if (startMapLink.venueId === destMapLink.venueId && destMapLink.id !== 'campus') {
    return destMapLink;
  }

  // Nếu khác venue (khác tòa nhà), mở bản đồ khuôn viên tổng quan
  return campusLink;
}

/**
 * Tạo kết quả chuẩn bị mở bản đồ InMapz.
 * Hiện tại InMapz chưa cung cấp cơ chế deep link công khai để tự động nạp tuyến 2 điểm.
 * Hàm hoạt động trung thực ở chế độ 'assisted_external_map'.
 */
export function createInMapzRouteLaunch(
  request: RouteRequest
): RouteLaunchResult {
  const startLocation = HOSPITAL_108_START_LOCATIONS.find(s => s.id === request.startLocationId);
  const destination = HOSPITAL_108_DESTINATIONS.find(d => d.id === request.destinationId);

  const campusLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus') 
    || HOSPITAL_108_OFFICIAL_MAP_LINKS[0];

  if (!startLocation || !destination) {
    return {
      mode: 'assisted_external_map',
      url: campusLink.url,
      startResolved: false,
      destinationResolved: false,
      routePreloaded: false,
      message: 'Bản đồ được mở đúng khu vực nhưng bác cần chọn lại điểm đầu và điểm đến trên InMapz.',
      targetMapLink: campusLink
    };
  }

  const targetMapLink = chooseVerifiedMapView(startLocation, destination);

  return {
    mode: 'assisted_external_map',
    url: targetMapLink.url,
    startResolved: false,
    destinationResolved: false,
    routePreloaded: false,
    message: 'Bản đồ được mở đúng khu vực nhưng bác cần chọn lại điểm đầu và điểm đến trên InMapz.',
    targetMapLink
  };
}

import React from 'react';
import { TechnicalRouteMap, TechnicalRouteMapProps } from './TechnicalRouteMap';

export type RouteMapProps = TechnicalRouteMapProps;

/**
 * RouteMap (Sơ đồ kỹ thuật dành cho đối chiếu, debug và quản trị viên).
 * LƯU Ý: Không hiển thị trong luồng chỉ đường chính của người bệnh.
 */
export const RouteMap: React.FC<RouteMapProps> = (props) => {
  return <TechnicalRouteMap {...props} />;
};

export { TechnicalRouteMap };

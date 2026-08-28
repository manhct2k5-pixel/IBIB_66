import type { MapLayerConfig } from '../../../types';

export const HOSPITAL_108_MAP_LAYERS: MapLayerConfig[] = [
  {
    id: 'layer_campus_general',
    name: 'Khuôn viên toàn viện & Trục chính',
    viewBox: {
      minX: 0,
      minY: 0,
      width: 800,
      height: 600
    },
    backgroundColor: '#f8fafc'
  },
  {
    id: 'layer_c1_1_floor_1',
    name: 'Nhà C1-1 – Tầng 1 (Khoa Khám bệnh)',
    buildingId: 'building_c1_1',
    floorId: 'floor_1',
    viewBox: {
      minX: 350,
      minY: 100,
      width: 400,
      height: 300
    },
    backgroundColor: '#f1f5f9'
  }
];

export function getMapLayerById(id: string): MapLayerConfig | undefined {
  return HOSPITAL_108_MAP_LAYERS.find(l => l.id === id);
}

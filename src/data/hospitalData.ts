import { 
  BACH_MAI_BUILDINGS, 
  BACH_MAI_ROOMS, 
  BACH_MAI_NODES, 
  BACH_MAI_EDGES, 
  getRoomById, 
  getNodeById, 
  getBuildingById,
  BACH_MAI_CAMPUS,
  BACH_MAI_GATES,
  DEFAULT_EMERGENCY_NODE_ID,
  DEFAULT_EMERGENCY_PHONE,
  NATIONAL_EMERGENCY_PHONE,
  BACH_MAI_QR_CHECKPOINTS,
  findQRCheckpointByCode,
  BACH_MAI_OFFICIAL_SOURCES,
  BACH_MAI_FLOOR_DIRECTORY
} from './bachMai';

export {
  BACH_MAI_BUILDINGS,
  BACH_MAI_ROOMS,
  BACH_MAI_NODES,
  BACH_MAI_EDGES,
  BACH_MAI_BUILDINGS as BUILDINGS_DATA,
  BACH_MAI_ROOMS as ROOMS_DATA,
  BACH_MAI_NODES as MAP_NODES_DATA,
  BACH_MAI_EDGES as MAP_EDGES_DATA,
  getRoomById,
  getNodeById,
  getBuildingById,
  BACH_MAI_CAMPUS,
  BACH_MAI_GATES,
  DEFAULT_EMERGENCY_NODE_ID,
  DEFAULT_EMERGENCY_PHONE,
  NATIONAL_EMERGENCY_PHONE,
  BACH_MAI_QR_CHECKPOINTS,
  findQRCheckpointByCode,
  BACH_MAI_OFFICIAL_SOURCES,
  BACH_MAI_FLOOR_DIRECTORY
};

export const CLINICAL_WORKFLOW_PRESETS = [
  {
    id: 'wf_kham_tong_quat',
    titleVi: 'Quy trình khám bệnh ngoại trú (Tòa K1)',
    titleEn: 'Outpatient Clinic Flow (Building K1)',
    descriptionVi: 'Quy trình 3 bước chuẩn: Tiếp đón -> Khám lâm sàng -> Lấy thuốc & Viện phí.',
    descriptionEn: 'Standard 3-step: Reception -> Consultation -> Pharmacy & Cashier.',
    category: 'Khám theo yêu cầu',
    estimatedTimeMin: 45,
    stopRoomIds: ['dept_reception_k1', 'dept_internal_k1', 'dept_pharmacy_k1']
  }
];

export type IndoorVerificationStatus =
  | 'official_floor_plan'
  | 'official_floor_directory'
  | 'campus_verified'
  | 'pending_survey';

export interface FloorDirectoryEntry {
  id: string;
  destinationName: string;
  buildingId: string;
  floorLabel: string;
  serviceDescription?: string;
  instructionNote?: string;

  verificationStatus: IndoorVerificationStatus; // should be 'official_floor_directory'
  sourceUrl: string;
  sourceTitle: string;
  lastVerifiedAt: string;
}

export type BuildingId = 
  | 'K1' 
  | 'K2' 
  | 'K3' 
  | 'A9' 
  | 'A10' 
  | 'A11' 
  | 'P' 
  | 'Q' 
  | 'H' 
  | 'F' 
  | 'E' 
  | 'T1' 
  | 'T2' 
  | 'T3' 
  | 'T4' 
  | 'T5' 
  | 'T6' 
  | 'D2' 
  | 'D4' 
  | 'D5' 
  | 'D6' 
  | 'B1'
  | 'B2' 
  | 'VTM'
  | 'OUTDOOR';

export type FloorId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'G' | 'B1' | 'UNKNOWN';

export type NodeType = 
  | 'room' 
  | 'corridor' 
  | 'elevator' 
  | 'stairs' 
  | 'escalator' 
  | 'entrance' 
  | 'exit' 
  | 'gate'
  | 'reception' 
  | 'pharmacy' 
  | 'cashier' 
  | 'restroom' 
  | 'atm' 
  | 'canteen' 
  | 'emergency' 
  | 'lab' 
  | 'imaging' 
  | 'kiosk' 
  | 'skybridge';

export type DepartmentCategory = 
  | 'emergency'
  | 'clinical'
  | 'diagnostic'
  | 'surgical'
  | 'pharmacy_cashier'
  | 'amenity'
  | 'inpatient'
  | 'administration';

export type VerificationStatus = 'verified' | 'campus_verified' | 'unverified' | 'estimated';

export interface RoomDetails {
  id: string;
  name: string;
  nameEn: string;
  code?: string; // Mã phòng nếu có nguồn xác minh; để trống nếu chưa có dữ liệu xác minh
  category: DepartmentCategory;
  buildingId: BuildingId;
  floorId?: FloorId; // Tùy chọn nếu có nguồn xác minh tầng
  description: string;
  descriptionEn: string;
  specialty?: string;
  doctorInCharge?: string;
  operatingHours?: string;
  phoneExtension?: string;
  commonSymptoms?: string[];
  color?: string;
  verificationStatus: VerificationStatus;
  sourceUrl?: string;
}

export interface MapNode {
  id: string;
  name: string;
  nameEn: string;
  buildingId: BuildingId;
  floorId?: FloorId;
  x: number; // 0 to 1000 coordinate space
  y: number; // 0 to 800 coordinate space
  type: NodeType;
  roomId?: string; // Link to RoomDetails if it's a room
  isAccessible: boolean; // Wheelchair accessible
  kioskCode?: string; // For demo QR simulation
  verificationStatus?: VerificationStatus;

  // Optional display overrides when selected from directory
  displayAlias?: string;
  displayFloor?: string;
  directoryEntryId?: string;
}

export interface MapEdge {
  fromNodeId: string;
  toNodeId: string;
  distance: number; // in meters (estimated/surveyed)
  type: 'walk' | 'elevator' | 'stairs' | 'escalator' | 'skybridge';
  isAccessible: boolean; // Wheelchair accessible (no steps/stairs, wide passage)
  hasSteps?: boolean; // Has steps/stairs or curbs
  widthMeters?: number; // Corridor width (e.g. 2.4m, wheelchair clearance)
  slopeDegree?: number; // Slope in degrees
  audioLandmarkVi?: string;
  audioLandmarkEn?: string;
  verificationStatus?: VerificationStatus;
}

export interface QRCheckpoint {
  nodeId: string;
  code: string;
  title: string;
  buildingId: BuildingId;
  floorId: FloorId;
  x: number;
  y: number;
  description: string;
}

export interface Building {
  id: BuildingId;
  name: string;
  nameEn: string;
  code: string;
  floors: Floor[];
  description: string;
  floorsCount?: number;
  hasVerifiedIndoorMap: boolean;
  verificationStatus: IndoorVerificationStatus;
  sourceUrl?: string;
}

export interface Floor {
  id: FloorId;
  buildingId: BuildingId;
  name: string;
  nameEn: string;
  level: number; // -1 for B1, 1 for 1, etc.
  description: string;
  nodes: MapNode[];
  hasVerifiedFloorplan?: boolean;
}

export type RoutingProfile = 'fastest' | 'accessible' | 'visually_impaired' | 'emergency';

export interface NavigationStep {
  stepIndex: number;
  instructionVi: string;
  instructionEn: string;
  instruction?: string; // Backwards compatible alias for instructionVi
  action?: 'straight' | 'turn-left' | 'turn-right' | 'arrive' | string;
  visualCue?: string;
  distance: number; // meters
  maneuver: 
    | 'start' 
    | 'straight' 
    | 'turn_left' 
    | 'turn_right' 
    | 'turn_slight_left' 
    | 'turn_slight_right' 
    | 'take_elevator_up' 
    | 'take_elevator_down' 
    | 'take_stairs_up' 
    | 'take_stairs_down' 
    | 'cross_skybridge' 
    | 'arrive';
  fromNode: MapNode;
  toNode: MapNode;
  buildingId: BuildingId;
  floorId?: FloorId;
}

export type RouteStep = NavigationStep;

export interface NavigationRoute {
  pathNodes: MapNode[];
  totalDistance: number; // in meters (ước lượng)
  estimatedDurationSeconds: number; // seconds
  estimatedTimeSeconds?: number; // alias
  steps: NavigationStep[];
  profile: RoutingProfile;
  buildingsInvolved: BuildingId[];
  floorsInvolved: { buildingId: BuildingId; floorId?: FloorId }[];
  isVerifiedRoute?: boolean;
}

export interface HospitalCampusBuildingMarker {
  id: string;
  name: string;
  nameEn: string;
  buildingId?: BuildingId;
  type: 'emergency' | 'outpatient' | 'inpatient' | 'diagnostic' | 'gate' | 'parking' | 'helipad' | 'admin' | 'clinical' | 'education' | 'service' | 'neighbor';
  description: string;
  floorsCount?: number;
  highlightColor?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface GateInfo {
  id: string;
  gateNumber: 1 | 2 | 3 | 4;
  name: string;
  nameEn: string;
  street: 'Giải Phóng' | 'Phương Mai';
  nodeId: string;
  descriptionVi: string;
  descriptionEn: string;
  operatingHours: string;
  bestForBuildings: BuildingId[];
  vehicleRules: string;
  verificationStatus: VerificationStatus;
  sourceUrl: string;
}

export interface HospitalCampus {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  description: string;
  hasIndoorMap: boolean;
  buildings: HospitalCampusBuildingMarker[];
  gates: GateInfo[];
  verificationNotice: string;
}

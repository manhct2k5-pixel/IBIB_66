export type BuildingId = 'A' | 'B' | 'C';

export type FloorId = 'B1' | '1' | '2' | '3' | '4' | '5';

export type NodeType = 
  | 'room' 
  | 'corridor' 
  | 'elevator' 
  | 'stairs' 
  | 'escalator' 
  | 'entrance' 
  | 'exit' 
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

export interface RoomDetails {
  id: string;
  name: string;
  nameEn: string;
  code: string; // e.g. "A-101"
  category: DepartmentCategory;
  buildingId: BuildingId;
  floorId: FloorId;
  description: string;
  descriptionEn: string;
  specialty?: string;
  doctorInCharge?: string;
  operatingHours: string;
  phoneExtension?: string;
  commonSymptoms?: string[];
  color?: string;
}

export interface MapNode {
  id: string;
  name: string;
  nameEn: string;
  buildingId: BuildingId;
  floorId: FloorId;
  x: number; // 0 to 1000 coordinate space
  y: number; // 0 to 800 coordinate space
  type: NodeType;
  roomId?: string; // Link to RoomDetails if it's a room
  isAccessible: boolean; // Wheelchair accessible
  kioskCode?: string; // For QR scan simulation
}

export interface MapEdge {
  fromNodeId: string;
  toNodeId: string;
  distance: number; // in meters
  type: 'walk' | 'elevator' | 'stairs' | 'escalator' | 'skybridge';
  isAccessible: boolean; // Wheelchair accessible (no steps/stairs, wide passage)
  hasSteps?: boolean; // Has steps/stairs or curbs
  widthMeters?: number; // Corridor width (e.g. 2.4m, wheelchair clearance)
  slopeDegree?: number; // Slope in degrees
  audioLandmarkVi?: string; // Acoustic/olfactory/tactile landmark in Vietnamese ("Nghe tiếng quầy tiếp đón phía tay trái", "Có gờ dẫn hướng xúc giác sàn")
  audioLandmarkEn?: string; // English audio landmark description
  consecutiveTurns?: number; // Turn complexity indicator
}

export interface PDRSensorReading {
  timestamp: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  accelMagnitude: number;
  gyroZ: number; // Angular velocity (rad/s or deg/s)
  headingDeg: number; // Estimated azimuth heading 0-360
  stepDetected: boolean;
  stepLengthMeters: number;
}

export interface PDRPositionState {
  rawPdrX: number;
  rawPdrY: number;
  matchedX: number;
  matchedY: number;
  currentFloorId: FloorId;
  currentBuildingId: BuildingId;
  nearestEdge: MapEdge | null;
  nearestNodeId: string | null;
  confidence: number; // 0.0 to 1.0
  driftMeters: number;
  stepCount: number;
  lastQrCheckpointId: string | null;
  lastQrTimestamp: number | null;
  isMapMatched: boolean;
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
  floors: Floor[];
  description: string;
}

export interface Floor {
  id: FloorId;
  buildingId: BuildingId;
  name: string;
  nameEn: string;
  level: number; // -1 for B1, 1 for 1, etc.
  description: string;
  nodes: MapNode[];
}

export type RoutingProfile = 'fastest' | 'accessible' | 'visually_impaired' | 'emergency';

export interface NavigationStep {
  stepIndex: number;
  instructionVi: string;
  instructionEn: string;
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
  floorId: FloorId;
}

export interface NavigationRoute {
  pathNodes: MapNode[];
  totalDistance: number; // in meters
  estimatedDurationSeconds: number; // seconds
  steps: NavigationStep[];
  profile: RoutingProfile;
  buildingsInvolved: BuildingId[];
  floorsInvolved: { buildingId: BuildingId; floorId: FloorId }[];
}

export interface WorkflowStop {
  id: string;
  room: RoomDetails;
  node: MapNode;
  title: string;
  description: string;
  isCompleted: boolean;
  order: number;
}

export interface ClinicalWorkflowPreset {
  id: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  category: string;
  estimatedTimeMin: number;
  stopRoomIds: string[];
}

export interface HospitalCampusBuildingMarker {
  id: string;
  name: string;
  nameEn: string;
  position: { lat: number; lng: number };
  buildingId?: BuildingId;
  type: 'emergency' | 'outpatient' | 'inpatient' | 'diagnostic' | 'gate' | 'parking' | 'helipad';
  description: string;
  floorsCount: number;
  highlightColor?: string;
}

export interface HospitalCampus {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  center: { lat: number; lng: number };
  zoom: number;
  description: string;
  hasIndoorMap: boolean;
  buildings: HospitalCampusBuildingMarker[];
  googlePlaceId?: string;
}

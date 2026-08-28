export type AppView = 
  | 'home' 
  | 'destination_detail'
  | 'select_start' 
  | 'unknown_location_help'
  | 'route_preview' 
  | 'navigating'
  | 'arrived'
  | 'official_map';

export type MapPrecision = 
  | 'exact_facility' 
  | 'verified_floor' 
  | 'building_start_view' 
  | 'campus_only';

export type RoutingMode =
  | 'official_deep_link'
  | 'assisted_external_map'
  | 'checkpoint_assisted';

export type RouteProfile = 
  | 'shortest_walk' 
  | 'elderly_friendly' 
  | 'wheelchair_accessible';

export interface RouteNode {
  id: string;
  name: string;
  shortName: string;
  buildingId?: string;
  floorId?: string;
  x?: number;
  y?: number;
  type:
    | 'gate'
    | 'intersection'
    | 'building_entrance'
    | 'lobby'
    | 'reception'
    | 'hallway'
    | 'stairs'
    | 'elevator'
    | 'ramp'
    | 'checkpoint'
    | 'destination';
  landmarkDescription: string;
  visualInstruction?: string;
  qrCode?: string;
  verificationStatus: 'field_verified' | 'official_source' | 'unverified';
  sourceUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  distanceMeters: number;
  bidirectional: boolean;
  pathType:
    | 'outdoor_walkway'
    | 'indoor_hallway'
    | 'crossing'
    | 'stairs'
    | 'elevator'
    | 'ramp';
  accessibility: {
    wheelchair: boolean;
    elderlyFriendly: boolean;
    avoidWhenRaining?: boolean;
  };
  status: 'open' | 'temporarily_closed' | 'restricted';
  instruction: string;
  reverseInstruction?: string;
  verificationStatus: 'field_verified' | 'unverified';
  sourceUrl?: string;
  verifiedAt?: string;
}

export interface NavigationStep {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  title: string;
  instruction: string;
  landmark: string;
  buildingId?: string;
  floorId?: string;
  distanceMeters?: number;
  checkpointCode?: string;
  verificationStatus: 'field_verified';
  actionType?: 'go_straight' | 'turn_left' | 'turn_right' | 'enter_building' | 'take_elevator' | 'arrive';
}

export interface CalculatedRoute {
  id?: string;
  destinationId?: string;
  startNodeId?: string;
  destinationNodeId?: string;
  pathNodeIds: string[];
  totalDistanceMeters: number;
  estimatedDurationSeconds?: number;
  estimatedMinutes?: number;
  profile: RouteProfile;
  steps: NavigationStep[];
  edges?: RouteEdge[];
  isAccessible?: boolean;
  verificationStatus?: 'field_verified' | 'unverified';
}

export interface NavigationSession {
  id?: string;
  sessionId?: string;
  startLocationId?: string;
  destinationId?: string;
  startNodeId?: string;
  destinationNodeId?: string;
  startName?: string;
  destinationName?: string;
  profile?: RouteProfile;
  pathNodeIds?: string[];
  steps?: NavigationStep[];
  route?: CalculatedRoute;
  currentNodeId?: string;
  currentStepIndex: number;
  startedAt: string | number;
  updatedAt: string | number;
  status: 'active' | 'arrived' | 'cancelled';
}

export interface MapLayerConfig {
  id: string;
  name: string;
  buildingId?: string;
  floorId?: string;
  viewBox: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  };
  backgroundColor?: string;
}

export interface GraphValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalNodes: number;
    verifiedNodes: number;
    totalEdges: number;
    verifiedEdges: number;
    destinationsConnected: number;
  };
}

export interface RouteRequest {
  startLocationId: string;
  destinationId: string;
  profile?: RouteProfile;
}

export interface RouteLaunchResult {
  mode: RoutingMode;
  url: string;
  startResolved: boolean;
  destinationResolved: boolean;
  routePreloaded: boolean;
  message: string;
  targetMapLink: Official108MapLink;
  calculatedRoute?: CalculatedRoute | null;
}

export interface Hospital108Destination {
  id: string;
  name: string;
  aliases: string[];
  mapLinkId: string;
  building: string;
  floor?: string;
  description?: string;
  sourceUrl?: string;
  mapPrecision: MapPrecision;
  locationNotice?: string;
  notes?: string;
}

export interface Hospital108StartLocation {
  id: string;
  name: string;
  building: string;
  floor?: string;
  mapLinkId: string;
  description?: string;
  aliases: string[];
  sourceUrl: string;
  verificationStatus: 'official_map_view' | 'source_verified_landmark';
}

export type Destination = Hospital108Destination;
export type StartLocation = Hospital108StartLocation;

export interface Hospital108Checkpoint {
  id: string;
  code: string;
  name: string;
  building: string;
  floor?: string;
  mapLinkId: string;
  sourceUrl?: string;
}

export interface Official108MapLink {
  id: string;
  label: string;
  venueId: number;
  floorId: number;
  facilityId?: number;
  url: string;
  verificationStatus: 'official_map';
  sourceUrl: string;
  lastCheckedAt: string;
}

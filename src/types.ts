export type AppView = 
  | 'home' 
  | 'destination_detail'
  | 'select_start' 
  | 'unknown_location_help'
  | 'route_preview' 
  | 'official_map';

export type MapPrecision = 
  | 'exact_facility' 
  | 'verified_floor' 
  | 'building_start_view' 
  | 'campus_only';

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

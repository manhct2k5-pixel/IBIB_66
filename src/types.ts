export type AppView = 
  | 'home' 
  | 'select_start' 
  | 'route_preview' 
  | 'official_map' 
  | 'help';

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
}

export interface Hospital108Checkpoint {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: string;
  verificationStatus: 'verified_checkpoint';
  verificationSource: string;
  verifiedDate: string;
  mapLinkId: string;
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

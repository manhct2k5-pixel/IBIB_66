import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { 
  QR_CHECKPOINT_FEATURE_ENABLED, 
  HOSPITAL_108_CHECKPOINTS, 
  lookupCheckpointByCode,
  HOSPITAL_108_START_LOCATIONS,
  HOSPITAL_108_DESTINATIONS,
  HOSPITAL_108_OFFICIAL_MAP_LINKS
} from '../data/hospital108';

describe('Navigation Flow & Architectural Constraints Verification', () => {
  it('QR Checkpoint feature is enabled with verified field landmarks', () => {
    expect(QR_CHECKPOINT_FEATURE_ENABLED).toBe(true);
    expect(HOSPITAL_108_CHECKPOINTS.length).toBeGreaterThan(0);
    const sample = HOSPITAL_108_CHECKPOINTS[0];
    if (sample.qrCode) {
      expect(lookupCheckpointByCode(sample.qrCode)).not.toBeNull();
    }
  });

  it('All start locations are verified landmarks or official map views', () => {
    const validMapLinkIds = HOSPITAL_108_OFFICIAL_MAP_LINKS.map(l => l.id);
    expect(HOSPITAL_108_START_LOCATIONS.length).toBeGreaterThanOrEqual(5);

    HOSPITAL_108_START_LOCATIONS.forEach(loc => {
      expect(loc.name).toBeDefined();
      expect(loc.building).toBeDefined();
      expect(loc.sourceUrl.startsWith('https://benhvien108.vn/')).toBe(true);
      expect(validMapLinkIds.includes(loc.mapLinkId)).toBe(true);
      expect(['official_map_view', 'source_verified_landmark'].includes(loc.verificationStatus)).toBe(true);
    });
  });

  it('No fake step count or distance calculations in route preview', () => {
    const routePreviewCode = fs.readFileSync(
      path.join(process.cwd(), 'src/components/RoutePreview.tsx'), 
      'utf-8'
    );
    expect(routePreviewCode).not.toContain('bước chân');
    expect(routePreviewCode).not.toContain('mét');
    expect(routePreviewCode).not.toContain('khoảng cách:');
  });

  it('App.tsx imports and orchestrates all 6 views with cohesive types', () => {
    const appCode = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf-8');
    
    expect(appCode).toContain('DestinationStep');
    expect(appCode).toContain('DestinationDetailView');
    expect(appCode).toContain('StartLocationStep');
    expect(appCode).toContain('UnknownLocationHelp');
    expect(appCode).toContain('RoutePreview');
    expect(appCode).toContain('Official108Map');

    expect(appCode).toContain('handleSelectDestination');
    expect(appCode).toContain('handleProceedToSelectStart');
    expect(appCode).toContain('handleSelectStartLocation');
    expect(appCode).toContain('handleStartNavigationFromPreview');
  });

  it('VoiceSearchModal contains explicit user confirmation ("Đúng, chọn nơi này")', () => {
    const voiceCode = fs.readFileSync(
      path.join(process.cwd(), 'src/components/VoiceSearchModal.tsx'), 
      'utf-8'
    );
    expect(voiceCode).toContain('Đúng, chọn nơi này');
    expect(voiceCode).toContain('Chọn lại / Nói lại');
  });

  it('Official108Map implements emergency handler, help handler, effectiveMapUrl and bottom sheet', () => {
    const mapCode = fs.readFileSync(
      path.join(process.cwd(), 'src/components/Official108Map.tsx'), 
      'utf-8'
    );
    expect(mapCode).toContain('onOpenEmergency');
    expect(mapCode).toContain('onOpenHelp');
    expect(mapCode).toContain('effectiveMapUrl');
    expect(mapCode).toContain('isSheetExpanded');
  });

  it('App.tsx uses window.history.back() for sequential back navigation', () => {
    const appCode = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf-8');
    expect(appCode).toContain('window.history.back()');
    expect(appCode).toContain('handleBackStep');
  });

  it('Types are centralized in src/types.ts', () => {
    const typesCode = fs.readFileSync(
      path.join(process.cwd(), 'src/types.ts'), 
      'utf-8'
    );
    expect(typesCode).toContain('export type AppView');
    expect(typesCode).toContain('export type MapPrecision');
    expect(typesCode).toContain('export interface Hospital108Destination');
    expect(typesCode).toContain('export interface Hospital108StartLocation');
    expect(typesCode).toContain('export interface Official108MapLink');
  });
});

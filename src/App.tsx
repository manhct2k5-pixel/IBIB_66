import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SimpleHeader } from './components/SimpleHeader';
import { DestinationStep } from './components/DestinationStep';
import { DestinationDetailView } from './components/DestinationDetailView';
import { StartLocationStep } from './components/StartLocationStep';
import { RoutePreview } from './components/RoutePreview';
import { UnknownLocationHelp } from './components/UnknownLocationHelp';
import { Official108Map } from './components/Official108Map';
import { EmergencyModal } from './components/EmergencyModal';
import { MoreMenuDrawer } from './components/MoreMenuDrawer';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { 
  HOSPITAL_108_OFFICIAL_MAP_LINKS, 
  HOSPITAL_108_DESTINATIONS,
  HOSPITAL_108_START_LOCATIONS
} from './data/hospital108';
import type { 
  AppView, 
  Hospital108Destination, 
  Hospital108StartLocation,
  RouteLaunchResult
} from './types';
import { createInMapzRouteLaunch } from './services/inmapzRouting';
import { addRecentDestinationId } from './utils/history';
import { stopSpeaking } from './utils/speech';

export interface HistoryState {
  view: AppView;
  destinationId: string | null;
  startLocationId: string | null;
  mapLinkId: string | null;
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedDestination, setSelectedDestination] = useState<Hospital108Destination | null>(null);
  const [selectedStartLocation, setSelectedStartLocation] = useState<Hospital108StartLocation | null>(null);
  const [activeMapLinkId, setActiveMapLinkId] = useState<string | null>(null);
  const [activeRouteLaunchResult, setActiveRouteLaunchResult] = useState<RouteLaunchResult | null>(null);
  
  // Trạng thái các modal
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Helper commit state rõ ràng, không bao giờ để khuyết trường
  const commitHistoryState = useCallback((nextState: HistoryState, method: 'push' | 'replace' = 'push') => {
    if (method === 'push') {
      window.history.pushState(nextState, '');
    } else {
      window.history.replaceState(nextState, '');
    }
  }, []);

  // Đồng bộ với History API (nút Back của trình duyệt / Android)
  useEffect(() => {
    const initialState = window.history.state as HistoryState | null;
    if (!initialState || !initialState.view) {
      window.history.replaceState({ 
        view: 'home',
        destinationId: null,
        startLocationId: null,
        mapLinkId: null
      } as HistoryState, '');
    } else {
      // Phục hồi trạng thái nếu tải lại trang hoặc có state sẵn
      setCurrentView(initialState.view);
      const restoredDest = initialState.destinationId 
        ? HOSPITAL_108_DESTINATIONS.find(d => d.id === initialState.destinationId) || null 
        : null;
      const restoredStart = initialState.startLocationId 
        ? HOSPITAL_108_START_LOCATIONS.find(s => s.id === initialState.startLocationId) || null 
        : null;

      setSelectedDestination(restoredDest);
      setSelectedStartLocation(restoredStart);
      setActiveMapLinkId(initialState.mapLinkId || null);

      if (restoredStart && restoredDest) {
        setActiveRouteLaunchResult(createInMapzRouteLaunch({
          startLocationId: restoredStart.id,
          destinationId: restoredDest.id
        }));
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      stopSpeaking();
      const state = event.state as HistoryState | null;
      const stateView: AppView = state?.view || 'home';
      setCurrentView(stateView);

      let currentDest: Hospital108Destination | null = null;
      let currentStart: Hospital108StartLocation | null = null;

      if (state?.destinationId) {
        currentDest = HOSPITAL_108_DESTINATIONS.find(d => d.id === state.destinationId) || null;
        setSelectedDestination(currentDest);
      } else {
        setSelectedDestination(null);
      }

      if (state?.startLocationId) {
        currentStart = HOSPITAL_108_START_LOCATIONS.find(s => s.id === state.startLocationId) || null;
        setSelectedStartLocation(currentStart);
      } else {
        setSelectedStartLocation(null);
      }

      if (state?.mapLinkId) {
        setActiveMapLinkId(state.mapLinkId);
      } else {
        setActiveMapLinkId(null);
      }

      if (currentStart && currentDest) {
        setActiveRouteLaunchResult(createInMapzRouteLaunch({
          startLocationId: currentStart.id,
          destinationId: currentDest.id
        }));
      } else {
        setActiveRouteLaunchResult(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const activeMapLink = useMemo(() => {
    if (activeMapLinkId) {
      return HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === activeMapLinkId) || 
             HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus') || 
             HOSPITAL_108_OFFICIAL_MAP_LINKS[0];
    }
    if (activeRouteLaunchResult) {
      return activeRouteLaunchResult.targetMapLink;
    }
    return HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus') || HOSPITAL_108_OFFICIAL_MAP_LINKS[0];
  }, [activeMapLinkId, activeRouteLaunchResult]);

  // URL bản đồ thực tế có hiệu lực
  const effectiveMapUrl = useMemo(() => {
    if (
      activeRouteLaunchResult?.mode === 'official_deep_link' &&
      activeRouteLaunchResult.routePreloaded === true
    ) {
      return activeRouteLaunchResult.url;
    }
    return activeMapLink.url;
  }, [activeRouteLaunchResult, activeMapLink]);

  // Quay về trang chủ
  const handleBackToHome = useCallback(() => {
    stopSpeaking();
    setSelectedDestination(null);
    setSelectedStartLocation(null);
    setActiveMapLinkId(null);
    setActiveRouteLaunchResult(null);
    commitHistoryState({
      view: 'home',
      destinationId: null,
      startLocationId: null,
      mapLinkId: null
    }, 'push');
    setCurrentView('home');
  }, [commitHistoryState]);

  // Điều hướng lùi lại 1 bước theo History API
  const handleBackStep = useCallback(() => {
    stopSpeaking();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleBackToHome();
    }
  }, [handleBackToHome]);

  // Xử lý chọn điểm đến
  const handleSelectDestination = (dest: Hospital108Destination) => {
    stopSpeaking();
    addRecentDestinationId(dest.id);
    setSelectedDestination(dest);
    setSelectedStartLocation(null);
    setActiveMapLinkId(null);
    setActiveRouteLaunchResult(null);
    commitHistoryState({
      view: 'destination_detail',
      destinationId: dest.id,
      startLocationId: null,
      mapLinkId: null
    }, 'push');
    setCurrentView('destination_detail');
  };

  // Bước 1 -> Bước 2: Từ chi tiết điểm đến sang chọn điểm xuất phát
  const handleProceedToSelectStart = () => {
    stopSpeaking();
    if (!selectedDestination) return;
    commitHistoryState({
      view: 'select_start',
      destinationId: selectedDestination.id,
      startLocationId: null,
      mapLinkId: null
    }, 'push');
    setCurrentView('select_start');
  };

  // Bước 2 -> Bước 3: Từ chọn điểm xuất phát sang kiểm tra tuyến đường (RoutePreview)
  const handleSelectStartLocation = (start: Hospital108StartLocation) => {
    stopSpeaking();
    setSelectedStartLocation(start);
    if (selectedDestination) {
      const result = createInMapzRouteLaunch({
        startLocationId: start.id,
        destinationId: selectedDestination.id
      });
      setActiveRouteLaunchResult(result);
      commitHistoryState({
        view: 'route_preview',
        destinationId: selectedDestination.id,
        startLocationId: start.id,
        mapLinkId: null
      }, 'push');
      setCurrentView('route_preview');
    }
  };

  // Xem trợ giúp khi không biết vị trí
  const handleShowUnknownHelp = () => {
    stopSpeaking();
    commitHistoryState({
      view: 'unknown_location_help',
      destinationId: selectedDestination ? selectedDestination.id : null,
      startLocationId: null,
      mapLinkId: null
    }, 'push');
    setCurrentView('unknown_location_help');
  };

  // Bước 3 -> Bản đồ: Mở bản đồ chính thức
  const handleStartNavigationFromPreview = (routeResult: RouteLaunchResult) => {
    stopSpeaking();
    setActiveRouteLaunchResult(routeResult);
    setActiveMapLinkId(routeResult.targetMapLink.id);
    commitHistoryState({
      view: 'official_map',
      destinationId: selectedDestination ? selectedDestination.id : null,
      startLocationId: selectedStartLocation ? selectedStartLocation.id : null,
      mapLinkId: routeResult.targetMapLink.id
    }, 'push');
    setCurrentView('official_map');
  };

  // Mở bản đồ toàn viện tổng quan
  const handleOpenGeneralMap = () => {
    stopSpeaking();
    const tongQuanDest = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'tong_quan') || null;
    setSelectedDestination(tongQuanDest);
    setSelectedStartLocation(null);
    setActiveMapLinkId('campus');
    setActiveRouteLaunchResult(null);
    commitHistoryState({
      view: 'official_map',
      destinationId: tongQuanDest ? tongQuanDest.id : null,
      startLocationId: null,
      mapLinkId: 'campus'
    }, 'push');
    setCurrentView('official_map');
  };

  const getHeaderBackButtonProps = () => {
    switch (currentView) {
      case 'destination_detail':
      case 'select_start':
      case 'unknown_location_help':
      case 'route_preview':
        return { showBackButton: true, onBack: handleBackStep };
      default:
        return { showBackButton: false, onBack: undefined };
    }
  };

  const headerProps = getHeaderBackButtonProps();

  return (
    <div className="relative min-h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header chỉ hiển thị khi không ở màn hình Bản đồ (Bản đồ có header riêng) */}
      {currentView !== 'official_map' && (
        <SimpleHeader 
          onHome={handleBackToHome}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
          showBackButton={headerProps.showBackButton}
          onBack={headerProps.onBack}
        />
      )}
      
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        {currentView === 'home' && (
          <DestinationStep 
            onSelectDestination={handleSelectDestination} 
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenGeneralMap={handleOpenGeneralMap}
          />
        )}

        {currentView === 'destination_detail' && selectedDestination && (
          <DestinationDetailView 
            destination={selectedDestination}
            onSelectStart={handleProceedToSelectStart}
            onBack={handleBackStep}
          />
        )}

        {currentView === 'select_start' && selectedDestination && (
          <StartLocationStep 
            destination={selectedDestination}
            onSelectStartLocation={handleSelectStartLocation}
            onBack={handleBackStep}
            onShowUnknownHelp={handleShowUnknownHelp}
          />
        )}

        {currentView === 'unknown_location_help' && (
          <UnknownLocationHelp 
            onBackToSelect={handleBackStep}
            onOpenCampusMap={handleOpenGeneralMap}
          />
        )}

        {currentView === 'route_preview' && selectedDestination && selectedStartLocation && (
          <RoutePreview 
            startLocation={selectedStartLocation}
            destination={selectedDestination}
            onStartNavigation={handleStartNavigationFromPreview}
            onChangeStart={handleBackStep}
            onChangeDestination={handleBackToHome}
          />
        )}

        {currentView === 'official_map' && activeMapLink && (
          <Official108Map 
            mapLink={activeMapLink} 
            destination={selectedDestination}
            startLocation={selectedStartLocation}
            routingMode={activeRouteLaunchResult?.mode || 'assisted_external_map'}
            routeLaunchResult={activeRouteLaunchResult}
            onClose={handleBackStep}
            onChangeStart={selectedStartLocation ? handleBackStep : undefined}
            onChangeDestination={handleBackToHome}
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}
      </main>

      {/* Voice Search Modal */}
      <VoiceSearchModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelectDestination={handleSelectDestination}
      />

      {/* Emergency Modal */}
      {isEmergencyOpen && (
        <EmergencyModal 
          onClose={() => setIsEmergencyOpen(false)} 
          onOpenMap={handleOpenGeneralMap}
        />
      )}

      {/* More Menu Drawer */}
      <MoreMenuDrawer 
        isOpen={isMoreMenuOpen} 
        onClose={() => setIsMoreMenuOpen(false)} 
      />

      {/* Help Guide Modal */}
      <HelpGuideModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        mapUrl={effectiveMapUrl}
      />
    </div>
  );
}

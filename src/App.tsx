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

interface HistoryState {
  view: AppView;
  destinationId?: string;
  startLocationId?: string;
  mapLinkId?: string;
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

  // Đồng bộ với History API (nút Back của trình duyệt / Android)
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ view: 'home' } as HistoryState, '');
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
      } else if (stateView === 'home') {
        setSelectedDestination(null);
      }

      if (state?.startLocationId) {
        currentStart = HOSPITAL_108_START_LOCATIONS.find(s => s.id === state.startLocationId) || null;
        setSelectedStartLocation(currentStart);
      } else if (stateView === 'home' || stateView === 'destination_detail') {
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

  const navigateTo = useCallback((
    view: AppView, 
    push = true, 
    customState?: Partial<HistoryState>
  ) => {
    stopSpeaking();
    if (push) {
      const stateObj: HistoryState = {
        view,
        destinationId: customState?.destinationId || selectedDestination?.id,
        startLocationId: customState?.startLocationId || selectedStartLocation?.id,
        mapLinkId: customState?.mapLinkId || activeMapLinkId || undefined,
        ...customState
      };
      window.history.pushState(stateObj, '');
    }
    setCurrentView(view);
  }, [selectedDestination, selectedStartLocation, activeMapLinkId]);

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

  // Xử lý chọn điểm đến
  const handleSelectDestination = (dest: Hospital108Destination) => {
    addRecentDestinationId(dest.id);
    setSelectedDestination(dest);
    setSelectedStartLocation(null);
    setActiveMapLinkId(null);
    setActiveRouteLaunchResult(null);
    navigateTo('destination_detail', true, { 
      destinationId: dest.id,
      startLocationId: undefined,
      mapLinkId: undefined
    });
  };

  // Bước 1 -> Bước 2: Từ chi tiết điểm đến sang chọn điểm xuất phát
  const handleProceedToSelectStart = () => {
    if (!selectedDestination) return;
    navigateTo('select_start', true, {
      destinationId: selectedDestination.id
    });
  };

  // Bước 2 -> Bước 3: Từ chọn điểm xuất phát sang kiểm tra tuyến đường (RoutePreview)
  const handleSelectStartLocation = (start: Hospital108StartLocation) => {
    setSelectedStartLocation(start);
    if (selectedDestination) {
      const result = createInMapzRouteLaunch({
        startLocationId: start.id,
        destinationId: selectedDestination.id
      });
      setActiveRouteLaunchResult(result);
    }
    navigateTo('route_preview', true, {
      startLocationId: start.id
    });
  };

  // Bước 3 -> Bản đồ: Mở bản đồ chính thức
  const handleStartNavigationFromPreview = (routeResult: RouteLaunchResult) => {
    setActiveRouteLaunchResult(routeResult);
    setActiveMapLinkId(routeResult.targetMapLink.id);
    navigateTo('official_map', true, {
      mapLinkId: routeResult.targetMapLink.id
    });
  };

  // Quay về trang chủ
  const handleBackToHome = () => {
    stopSpeaking();
    setSelectedDestination(null);
    setSelectedStartLocation(null);
    setActiveMapLinkId(null);
    setActiveRouteLaunchResult(null);
    navigateTo('home', true, {
      destinationId: undefined,
      startLocationId: undefined,
      mapLinkId: undefined
    });
  };

  // Quay về chi tiết điểm đến
  const handleBackToDetail = () => {
    stopSpeaking();
    setSelectedStartLocation(null);
    setActiveMapLinkId(null);
    setActiveRouteLaunchResult(null);
    navigateTo('destination_detail');
  };

  // Mở bản đồ toàn viện tổng quan
  const handleOpenGeneralMap = () => {
    stopSpeaking();
    const tongQuanDest = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'tong_quan');
    setSelectedDestination(tongQuanDest || null);
    setSelectedStartLocation(null);
    setActiveMapLinkId('campus');
    setActiveRouteLaunchResult(null);
    navigateTo('official_map', true, {
      destinationId: tongQuanDest?.id,
      startLocationId: undefined,
      mapLinkId: 'campus'
    });
  };

  const getHeaderBackButtonProps = () => {
    switch (currentView) {
      case 'destination_detail':
        return { showBackButton: true, onBack: handleBackToHome };
      case 'select_start':
        return { showBackButton: true, onBack: handleBackToDetail };
      case 'unknown_location_help':
        return { showBackButton: true, onBack: () => navigateTo('select_start') };
      case 'route_preview':
        return { showBackButton: true, onBack: () => navigateTo('select_start') };
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
            onBack={handleBackToHome}
          />
        )}

        {currentView === 'select_start' && selectedDestination && (
          <StartLocationStep 
            destination={selectedDestination}
            onSelectStartLocation={handleSelectStartLocation}
            onBack={handleBackToDetail}
            onShowUnknownHelp={() => navigateTo('unknown_location_help')}
          />
        )}

        {currentView === 'unknown_location_help' && (
          <UnknownLocationHelp 
            onBackToSelect={() => navigateTo('select_start')}
            onOpenCampusMap={handleOpenGeneralMap}
          />
        )}

        {currentView === 'route_preview' && selectedDestination && selectedStartLocation && (
          <RoutePreview 
            startLocation={selectedStartLocation}
            destination={selectedDestination}
            onStartNavigation={handleStartNavigationFromPreview}
            onChangeStart={() => navigateTo('select_start')}
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
            onClose={() => {
              if (selectedStartLocation) {
                navigateTo('route_preview');
              } else {
                handleBackToHome();
              }
            }}
            onChangeStart={() => navigateTo('select_start')}
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
        mapUrl={activeMapLink?.url}
      />
    </div>
  );
}

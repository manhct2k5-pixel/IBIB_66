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
import { NavigationView, ArrivalView } from './components/navigation';
import { NavigationErrorBoundary } from './components/errors/NavigationErrorBoundary';
import { 
  HOSPITAL_108_OFFICIAL_MAP_LINKS, 
  HOSPITAL_108_DESTINATIONS,
  HOSPITAL_108_START_LOCATIONS
} from './data/hospital108';
import type { 
  AppView, 
  Hospital108Destination, 
  Hospital108StartLocation,
  RouteLaunchResult,
  NavigationSession,
  CalculatedRoute,
  RouteNode
} from './types';
import { createInMapzRouteLaunch } from './services/inmapzRouting';
import { 
  buildCalculatedRoute, 
  createNavigationSession,
  getRouteNodeIdForDestination,
  getRouteNodeIdForStartLocation
} from './services/pathfinding';
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
  
  // Trạng thái điều hướng từng bước (Assisted Checkpoint Navigation)
  const [activeNavigationSession, setActiveNavigationSession] = useState<NavigationSession | null>(null);
  const [activeCalculatedRoute, setActiveCalculatedRoute] = useState<CalculatedRoute | null>(null);

  // Trạng thái các modal
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Helper commit state rõ ràng
  const commitHistoryState = useCallback((nextState: HistoryState, method: 'push' | 'replace' = 'push') => {
    if (method === 'push') {
      window.history.pushState(nextState, '');
    } else {
      window.history.replaceState(nextState, '');
    }
  }, []);

  // Đồng bộ với History API và phục hồi phiên
  useEffect(() => {
    const initialState = window.history.state as HistoryState | null;
    
    // Kiểm tra xem có phiên điều hướng đang chạy trong localStorage không
    let savedSession: NavigationSession | null = null;
    try {
      const raw = localStorage.getItem('mednav_108_active_session');
      if (raw) {
        savedSession = JSON.parse(raw);
      }
    } catch {
      // Bỏ qua lỗi parse
    }

    if (!initialState || !initialState.view) {
      if (savedSession && savedSession.status === 'active' && savedSession.route) {
        const dest = HOSPITAL_108_DESTINATIONS.find(d => d.id === savedSession?.destinationId) || HOSPITAL_108_DESTINATIONS[0];
        const start = HOSPITAL_108_START_LOCATIONS.find(s => s.id === savedSession?.startLocationId) || HOSPITAL_108_START_LOCATIONS[0];
        setSelectedDestination(dest);
        setSelectedStartLocation(start);
        setActiveCalculatedRoute(savedSession.route);
        setActiveNavigationSession(savedSession);
        setCurrentView('navigating');
        window.history.replaceState({
          view: 'navigating',
          destinationId: dest.id,
          startLocationId: start.id,
          mapLinkId: null
        } as HistoryState, '');
      } else {
        window.history.replaceState({ 
          view: 'home',
          destinationId: null,
          startLocationId: null,
          mapLinkId: null
        } as HistoryState, '');
      }
    } else {
      // Phục hồi trạng thái nếu tải lại trang hoặc có state sẵn
      const restoredDest = initialState.destinationId 
        ? HOSPITAL_108_DESTINATIONS.find(d => d.id === initialState.destinationId) || null 
        : null;
      const restoredStart = initialState.startLocationId 
        ? HOSPITAL_108_START_LOCATIONS.find(s => s.id === initialState.startLocationId) || null 
        : null;

      if (initialState.view === 'navigating' && restoredDest) {
        const defaultStart = restoredStart || HOSPITAL_108_START_LOCATIONS[0];
        const startNodeId = getRouteNodeIdForStartLocation(defaultStart.id);
        const destNodeId = getRouteNodeIdForDestination(restoredDest.id);
        const route = buildCalculatedRoute(startNodeId, destNodeId, restoredDest.id, 'shortest_walk');
        
        if (route) {
          const session = savedSession && savedSession.destinationId === restoredDest.id
            ? savedSession
            : createNavigationSession(route, restoredDest, defaultStart);
          
          setSelectedDestination(restoredDest);
          setSelectedStartLocation(defaultStart);
          setActiveCalculatedRoute(route);
          setActiveNavigationSession(session);
          setCurrentView('navigating');
          return;
        }
      }

      // Nếu trạng thái bản đồ không có destination hợp lệ và không phải campus -> fallback về home
      if (initialState.view === 'official_map' && !restoredDest && initialState.mapLinkId !== 'campus') {
        setCurrentView('home');
        setSelectedDestination(null);
        setSelectedStartLocation(null);
        setActiveMapLinkId(null);
      } else {
        setCurrentView(initialState.view);
        setSelectedDestination(restoredDest);
        setSelectedStartLocation(restoredStart);
        setActiveMapLinkId(initialState.mapLinkId || (restoredDest ? restoredDest.mapLinkId : null));

        if (restoredStart && restoredDest) {
          setActiveRouteLaunchResult(createInMapzRouteLaunch({
            startLocationId: restoredStart.id,
            destinationId: restoredDest.id
          }));
        }
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      stopSpeaking();
      const state = event.state as HistoryState | null;
      const stateView: AppView = state?.view || 'home';

      let currentDest: Hospital108Destination | null = null;
      let currentStart: Hospital108StartLocation | null = null;

      if (state?.destinationId) {
        currentDest = HOSPITAL_108_DESTINATIONS.find(d => d.id === state.destinationId) || null;
      }

      if (state?.startLocationId) {
        currentStart = HOSPITAL_108_START_LOCATIONS.find(s => s.id === state.startLocationId) || null;
      }

      // Fallback về home nếu view không hợp lệ
      if (stateView === 'official_map' && !currentDest && state?.mapLinkId !== 'campus') {
        setCurrentView('home');
        setSelectedDestination(null);
        setSelectedStartLocation(null);
        setActiveMapLinkId(null);
        setActiveRouteLaunchResult(null);
        return;
      }

      setCurrentView(stateView);
      setSelectedDestination(currentDest);
      setSelectedStartLocation(currentStart);
      setActiveMapLinkId(state?.mapLinkId || (currentDest ? currentDest.mapLinkId : null));

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
    if (selectedDestination?.mapLinkId) {
      return HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === selectedDestination.mapLinkId) ||
             HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus') ||
             HOSPITAL_108_OFFICIAL_MAP_LINKS[0];
    }
    if (activeRouteLaunchResult) {
      return activeRouteLaunchResult.targetMapLink;
    }
    return HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus') || HOSPITAL_108_OFFICIAL_MAP_LINKS[0];
  }, [activeMapLinkId, selectedDestination, activeRouteLaunchResult]);

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
    try {
      localStorage.removeItem('mednav_108_active_session');
    } catch {
      // Ignore
    }
    setSelectedDestination(null);
    setSelectedStartLocation(null);
    setActiveMapLinkId(null);
    setActiveRouteLaunchResult(null);
    setActiveNavigationSession(null);
    setActiveCalculatedRoute(null);
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

  // Bắt đầu chỉ đường từng bước với A* (MedNav Checkpoint Navigation)
  const handleStartAssistedNavigation = useCallback((
    customStart?: Hospital108StartLocation | null,
    customDest?: Hospital108Destination | null
  ) => {
    stopSpeaking();
    const dest = customDest || selectedDestination || HOSPITAL_108_DESTINATIONS[0];
    const start = customStart || selectedStartLocation || HOSPITAL_108_START_LOCATIONS[0];

    const startNodeId = getRouteNodeIdForStartLocation(start.id);
    const destNodeId = getRouteNodeIdForDestination(dest.id);

    const calculatedRoute = buildCalculatedRoute(
      startNodeId,
      destNodeId,
      dest.id,
      'shortest_walk'
    );

    if (calculatedRoute) {
      const session = createNavigationSession(calculatedRoute, dest, start);
      setSelectedDestination(dest);
      setSelectedStartLocation(start);
      setActiveCalculatedRoute(calculatedRoute);
      setActiveNavigationSession(session);

      try {
        localStorage.setItem('mednav_108_active_session', JSON.stringify(session));
      } catch {
        // Ignore
      }

      commitHistoryState({
        view: 'navigating',
        destinationId: dest.id,
        startLocationId: start.id,
        mapLinkId: null
      }, 'push');
      setCurrentView('navigating');
    }
  }, [selectedDestination, selectedStartLocation, commitHistoryState]);

  // Tính lại đường khi người dùng đi lệch hoặc chọn mốc mới
  const handleRecalculateRoute = useCallback((newNode: RouteNode) => {
    if (!selectedDestination) return;

    const destNodeId = getRouteNodeIdForDestination(selectedDestination.id);
    const newRoute = buildCalculatedRoute(
      newNode.id,
      destNodeId,
      selectedDestination.id,
      'shortest_walk'
    );

    if (newRoute && activeNavigationSession) {
      const updatedSession: NavigationSession = {
        ...activeNavigationSession,
        route: newRoute,
        currentStepIndex: 0,
        updatedAt: Date.now()
      };
      setActiveCalculatedRoute(newRoute);
      setActiveNavigationSession(updatedSession);
      try {
        localStorage.setItem('mednav_108_active_session', JSON.stringify(updatedSession));
      } catch {
        // Ignore
      }
    }
  }, [selectedDestination, activeNavigationSession]);

  // Đến đích thành công
  const handleArrival = useCallback(() => {
    stopSpeaking();
    try {
      localStorage.removeItem('mednav_108_active_session');
    } catch {
      // Ignore
    }
    commitHistoryState({
      view: 'arrived',
      destinationId: selectedDestination ? selectedDestination.id : null,
      startLocationId: selectedStartLocation ? selectedStartLocation.id : null,
      mapLinkId: null
    }, 'push');
    setCurrentView('arrived');
  }, [selectedDestination, selectedStartLocation, commitHistoryState]);

  // LUỒNG MỚI: Chọn điểm đến -> Mở ngay bản đồ nhúng trong MedNav (home -> official_map)
  const handleSelectDestination = (dest: Hospital108Destination) => {
    stopSpeaking();
    addRecentDestinationId(dest.id);
    setSelectedDestination(dest);
    setSelectedStartLocation(null);
    setActiveMapLinkId(dest.mapLinkId);
    setActiveRouteLaunchResult(null);
    commitHistoryState({
      view: 'official_map',
      destinationId: dest.id,
      startLocationId: null,
      mapLinkId: dest.mapLinkId
    }, 'push');
    setCurrentView('official_map');
  };

  // Hỗ trợ luồng chi tiết nếu cần gọi riêng
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
      {/* Header chỉ hiển thị khi không ở màn hình Bản đồ / Điều hướng toàn màn hình */}
      {currentView !== 'official_map' && currentView !== 'navigating' && currentView !== 'arrived' && (
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
            onStartAssistedNavigation={() => handleStartAssistedNavigation(selectedStartLocation, selectedDestination)}
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
            onClose={handleBackToHome}
            onChangeStart={selectedStartLocation ? handleBackStep : undefined}
            onChangeDestination={handleBackToHome}
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onStartAssistedNavigation={() => handleStartAssistedNavigation(selectedStartLocation, selectedDestination)}
          />
        )}

        {/* Chế độ Điều hướng từng bước (Assisted Checkpoint Navigation) */}
        {currentView === 'navigating' && activeNavigationSession && activeCalculatedRoute && selectedDestination && (
          <NavigationErrorBoundary onReset={handleBackToHome}>
            <NavigationView
              session={activeNavigationSession}
              route={activeCalculatedRoute}
              destination={selectedDestination}
              startLocation={selectedStartLocation || HOSPITAL_108_START_LOCATIONS[0]}
              onArrive={handleArrival}
              onExit={handleBackToHome}
              onRecalculateRoute={handleRecalculateRoute}
              onOpenOfficialMap={() => {
                if (selectedDestination) {
                  setActiveMapLinkId(selectedDestination.mapLinkId);
                  setCurrentView('official_map');
                }
              }}
            />
          </NavigationErrorBoundary>
        )}

        {/* Chế độ Đã đến đích */}
        {currentView === 'arrived' && selectedDestination && (
          <ArrivalView
            destination={selectedDestination}
            onGoHome={handleBackToHome}
            onReviewRoute={() => {
              if (activeCalculatedRoute && activeNavigationSession) {
                setCurrentView('navigating');
              } else {
                handleBackToHome();
              }
            }}
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

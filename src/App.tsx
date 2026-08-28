import React, { useState, useMemo } from 'react';
import { 
  MapNode, 
  NavigationRoute, 
  RoutingProfile,
  HospitalCampus
} from './types';
import { 
  MAP_NODES_DATA, 
  BACH_MAI_CAMPUS, 
  DEFAULT_EMERGENCY_NODE_ID 
} from './data/hospitalData';
import { findRoute } from './utils/pathfinding';
import { SimpleHeader } from './components/SimpleHeader';
import { DestinationStep } from './components/DestinationStep';
import { CurrentLocationStep } from './components/CurrentLocationStep';
import { RoutePreviewStep } from './components/RoutePreviewStep';
import { SimpleNavigationView } from './components/SimpleNavigationView';
import { ArrivalView } from './components/ArrivalView';
import { EmergencyModal } from './components/EmergencyModal';
import { QRLocationModal } from './components/QRLocationModal';
import { DataLimitDrawer } from './components/DataLimitDrawer';
import { UserGuideModal } from './components/UserGuideModal';
import { MoreMenuDrawer } from './components/MoreMenuDrawer';
import { VerifiedQRCheckpoint } from './data/bachMai/checkpoints';

export type AppFlowState = 
  | 'destination'       // Step 1: Chọn nơi muốn đến
  | 'start_location'    // Step 2: Chọn vị trí hiện tại
  | 'route_preview'     // Step 3: Xem trước tuyến đường & bản đồ
  | 'navigating'        // Step 4: Chỉ đường từng bước
  | 'arrived';          // Step 5: Đã đến nơi

export default function App() {
  // Main Sequential Flow State
  const [flowState, setFlowState] = useState<AppFlowState>('destination');

  // Wayfinding Nodes
  const [destinationNode, setDestinationNode] = useState<MapNode | null>(null);
  const [startNode, setStartNode] = useState<MapNode | null>(null);
  const [routingProfile, setRoutingProfile] = useState<RoutingProfile>('fastest');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  // Modals & Drawers
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isDataLimitOpen, setIsDataLimitOpen] = useState<boolean>(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

  // Compute Active Navigation Route
  const activeRoute: NavigationRoute | null = useMemo(() => {
    if (!startNode || !destinationNode) return null;
    return findRoute(startNode.id, destinationNode.id, routingProfile);
  }, [startNode, destinationNode, routingProfile]);

  // Step 1 Handler: Destination Selected -> Move to Step 2
  const handleSelectDestination = (node: MapNode) => {
    setDestinationNode(node);
    setFlowState('start_location');
  };

  // Step 2 Handler: Start Location Selected -> Move to Step 3
  const handleSelectStartLocation = (node: MapNode) => {
    setStartNode(node);
    setCurrentStepIndex(0);
    setFlowState('route_preview');
  };

  // QR Code Location Confirmation
  const handleConfirmQRCheckpoint = (node: MapNode, checkpoint: VerifiedQRCheckpoint) => {
    if (flowState === 'destination' || flowState === 'start_location') {
      setStartNode(node);
      setCurrentStepIndex(0);
      if (destinationNode) {
        setFlowState('route_preview');
      } else {
        setFlowState('destination');
      }
    } else if (flowState === 'navigating' || flowState === 'route_preview') {
      setStartNode(node);
      setCurrentStepIndex(0);
    }
  };

  // Step 3 Handler: Start Active Navigation
  const handleStartNavigation = () => {
    if (startNode && destinationNode && activeRoute) {
      setCurrentStepIndex(0);
      setFlowState('navigating');
    }
  };

  // Step 4 Handler: Arrived at Final Step
  const handleArrived = () => {
    setFlowState('arrived');
  };

  // Reset to Home / Step 1
  const handleResetToHome = () => {
    setDestinationNode(null);
    setStartNode(null);
    setCurrentStepIndex(0);
    setFlowState('destination');
  };

  // Emergency Flow: Route directly to A9 Center
  const handleEmergencySelect = () => {
    const a9Node = MAP_NODES_DATA.find(n => n.id === DEFAULT_EMERGENCY_NODE_ID) || 
                   MAP_NODES_DATA.find(n => n.buildingId === 'A9') || 
                   MAP_NODES_DATA[0];
    
    setDestinationNode(a9Node);
    setRoutingProfile('emergency');

    // If start node is already set, jump straight to preview
    if (startNode) {
      setFlowState('route_preview');
    } else {
      setFlowState('start_location');
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-100 text-slate-900 overflow-x-hidden font-sans">
      {/* Elderly-Friendly Simplified Header */}
      <SimpleHeader
        language={language}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenGuide={() => setIsUserGuideOpen(true)}
        onOpenMenu={() => setIsMoreMenuOpen(true)}
        onGoHome={handleResetToHome}
      />

      {/* Main Flow Container */}
      <main className="flex-1 flex flex-col w-full relative">
        {/* STEP 1: CHỌN NƠI MUỐN ĐẾN */}
        {flowState === 'destination' && (
          <DestinationStep
            onSelectDestination={handleSelectDestination}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            language={language}
          />
        )}

        {/* STEP 2: CHỌN VỊ TRÍ HIỆN TẠI */}
        {flowState === 'start_location' && destinationNode && (
          <CurrentLocationStep
            destinationNode={destinationNode}
            onSelectStartLocation={handleSelectStartLocation}
            onBackToDestination={() => setFlowState('destination')}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            language={language}
          />
        )}

        {/* STEP 3: KIỂM TRA TUYẾN ĐƯỜNG */}
        {flowState === 'route_preview' && startNode && destinationNode && activeRoute && (
          <RoutePreviewStep
            startNode={startNode}
            destinationNode={destinationNode}
            activeRoute={activeRoute}
            onStartNavigation={handleStartNavigation}
            onChangeStartLocation={() => setFlowState('start_location')}
            onChangeDestination={() => setFlowState('destination')}
            onOpenDataInfo={() => setIsDataLimitOpen(true)}
            language={language}
          />
        )}

        {/* STEP 4: CHỈ ĐƯỜNG TỪNG BƯỚC */}
        {flowState === 'navigating' && startNode && destinationNode && activeRoute && (
          <SimpleNavigationView
            startNode={startNode}
            destinationNode={destinationNode}
            activeRoute={activeRoute}
            currentStepIndex={currentStepIndex}
            onStepChange={setCurrentStepIndex}
            onArrived={handleArrived}
            onStopNavigation={() => setFlowState('route_preview')}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            language={language}
          />
        )}

        {/* STEP 5: BÁO ĐÃ ĐẾN NƠI */}
        {flowState === 'arrived' && destinationNode && (
          <ArrivalView
            destinationNode={destinationNode}
            onFinish={handleResetToHome}
            onSearchAnother={handleResetToHome}
            language={language}
          />
        )}
      </main>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSelectEmergencyDestination={handleEmergencySelect}
        language={language}
      />

      {/* QR Location Modal */}
      <QRLocationModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onConfirmCheckpointNode={handleConfirmQRCheckpoint}
        language={language}
      />

      {/* Data Limits Drawer */}
      <DataLimitDrawer
        isOpen={isDataLimitOpen}
        onClose={() => setIsDataLimitOpen(false)}
        language={language}
      />

      {/* Senior User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        language={language}
      />

      {/* More Options Menu Drawer */}
      <MoreMenuDrawer
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onGoHome={handleResetToHome}
        onOpenGuide={() => setIsUserGuideOpen(true)}
        onOpenDataInfo={() => setIsDataLimitOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        language={language}
        onChangeLanguage={setLanguage}
      />
    </div>
  );
}

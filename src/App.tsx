import React, { useState, useMemo } from 'react';
import { 
  BuildingId, 
  FloorId, 
  MapNode, 
  NavigationRoute, 
  RoutingProfile,
  HospitalCampus
} from './types';
import { 
  MAP_NODES_DATA, 
  BACH_MAI_CAMPUS, 
  DEFAULT_EMERGENCY_NODE_ID,
  BACH_MAI_QR_CHECKPOINTS
} from './data/hospitalData';
import { findRoute } from './utils/pathfinding';
import { Header, AppNavTab } from './components/Header';
import { Hospital2DCampusMap } from './components/Hospital2DCampusMap';
import { SearchAndRoutePanel } from './components/SearchAndRoutePanel';
import { NavigationController } from './components/NavigationController';
import { AIAssistantModal } from './components/AIAssistantModal';
import { EmergencyModal } from './components/EmergencyModal';
import { QRCheckpointModal } from './components/QRCheckpointModal';
import { DataInfoView } from './components/DataInfoView';
import { VerifiedQRCheckpoint } from './data/bachMai/checkpoints';

export default function App() {
  const [currentCampus] = useState<HospitalCampus>(BACH_MAI_CAMPUS);
  const [activeTab, setActiveTab] = useState<AppNavTab>('home');

  // Navigation state (Starts clean as null - Destination first flow)
  const [startNode, setStartNode] = useState<MapNode | null>(null);
  const [destinationNode, setDestinationNode] = useState<MapNode | null>(null);
  const [routingProfile, setRoutingProfile] = useState<RoutingProfile>('fastest');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [lastVerifiedCheckpoint, setLastVerifiedCheckpoint] = useState<VerifiedQRCheckpoint | null>(null);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  // Modals state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);

  // Compute Active Route
  const activeRoute: NavigationRoute | null = useMemo(() => {
    if (!startNode || !destinationNode) return null;
    return findRoute(startNode.id, destinationNode.id, routingProfile);
  }, [startNode, destinationNode, routingProfile]);

  // Destination Selection
  const handleSelectDestinationNode = (node: MapNode | null) => {
    setDestinationNode(node);
    setCurrentStepIndex(0);
    setIsNavigating(false);
  };

  // Start Node Selection
  const handleSelectStartNode = (node: MapNode | null) => {
    setStartNode(node);
    setCurrentStepIndex(0);
    setIsNavigating(false);
  };

  // Swap Start & Destination
  const handleSwapNodes = () => {
    const temp = startNode;
    setStartNode(destinationNode);
    setDestinationNode(temp);
    setCurrentStepIndex(0);
    setIsNavigating(false);
  };

  // QR Checkpoint Confirmation
  const handleConfirmQRCheckpoint = (node: MapNode, checkpoint: VerifiedQRCheckpoint) => {
    setStartNode(node);
    setLastVerifiedCheckpoint(checkpoint);
    setCurrentStepIndex(0);
    setIsNavigating(false);
  };

  // Emergency flow (Redirect to A9)
  const handleEmergencyRoute = () => {
    const a9Node = MAP_NODES_DATA.find(n => n.id === DEFAULT_EMERGENCY_NODE_ID) || 
                   MAP_NODES_DATA.find(n => n.buildingId === 'A9') || 
                   MAP_NODES_DATA[0];
    
    setDestinationNode(a9Node);
    setRoutingProfile('emergency');
    setActiveTab('navigation');
    setIsEmergencyOpen(false);

    // If start node is already known, begin navigation immediately
    if (startNode) {
      setIsNavigating(true);
      setCurrentStepIndex(0);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        language={language}
        onChangeLanguage={setLanguage}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {activeTab === 'data_info' ? (
          /* ================= DATA TRANSPARENCY TAB ================= */
          <DataInfoView 
            onGoToNavigation={() => setActiveTab('navigation')}
            language={language}
          />
        ) : (
          /* ================= HOME & NAVIGATION TAB (2D MAP + WAYFINDING) ================= */
          <>
            {/* Left / Bottom Panel: Search, Gate Picking, & Turn-by-Turn Nav Controller */}
            <div className="w-full md:w-88 lg:w-96 flex-shrink-0 h-1/2 md:h-full overflow-hidden order-2 md:order-1 border-t md:border-t-0 md:border-r border-slate-200 bg-white flex flex-col shadow-sm z-10">
              {isNavigating && activeRoute ? (
                <NavigationController
                  route={activeRoute}
                  currentStepIndex={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                  onClose={() => setIsNavigating(false)}
                  onOpenQRScanner={() => setIsQRScannerOpen(true)}
                  language={language}
                />
              ) : (
                <SearchAndRoutePanel
                  currentCampus={currentCampus}
                  startNode={startNode}
                  destinationNode={destinationNode}
                  onSelectStartNode={handleSelectStartNode}
                  onSelectDestinationNode={handleSelectDestinationNode}
                  onSwapNodes={handleSwapNodes}
                  routingProfile={routingProfile}
                  onChangeRoutingProfile={setRoutingProfile}
                  onStartNavigation={() => {
                    if (startNode && destinationNode) {
                      setIsNavigating(true);
                      setCurrentStepIndex(0);
                    }
                  }}
                  onOpenQRScanner={() => setIsQRScannerOpen(true)}
                  lastVerifiedCheckpoint={lastVerifiedCheckpoint}
                  language={language}
                />
              )}
            </div>

            {/* Right / Top Area: 2D Interactive Hospital Map */}
            <div className="flex-1 flex flex-col h-1/2 md:h-full overflow-hidden relative order-1 md:order-2">
              <Hospital2DCampusMap
                startNode={startNode}
                destinationNode={destinationNode}
                onSelectStartNode={handleSelectStartNode}
                onSelectDestinationNode={handleSelectDestinationNode}
                activeRoute={activeRoute}
                currentStepIndex={currentStepIndex}
                isNavigating={isNavigating}
                routingProfile={routingProfile}
                language={language}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
              />
            </div>
          </>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSelectEmergencyDestination={handleEmergencyRoute}
        language={language}
      />

      {/* QR Checkpoint Modal */}
      <QRCheckpointModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onConfirmCheckpointNode={handleConfirmQRCheckpoint}
        language={language}
      />

      {/* AI Assistant Modal */}
      {isAIAssistantOpen && (
        <AIAssistantModal
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          onNavigateToDepartment={(deptId) => {
            const node = MAP_NODES_DATA.find(n => n.roomId === deptId) || 
                         MAP_NODES_DATA.find(n => n.id === deptId);
            if (node) {
              handleSelectDestinationNode(node);
              setIsAIAssistantOpen(false);
              setActiveTab('navigation');
            }
          }}
          language={language}
        />
      )}
    </div>
  );
}

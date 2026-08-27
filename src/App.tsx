import React, { useState, useMemo } from 'react';
import { 
  BuildingId, 
  FloorId, 
  MapNode, 
  NavigationRoute, 
  RoutingProfile,
  HospitalCampus,
  PDRPositionState
} from './types';
import { MAP_NODES_DATA } from './data/hospitalData';
import { REAL_HOSPITALS_LIST } from './data/realHospitalsData';
import { findRoute } from './utils/pathfinding';
import { Header, AppViewMode } from './components/Header';
import { HospitalMap } from './components/HospitalMap';
import { Hospital2DCampusMap } from './components/Hospital2DCampusMap';
import { ThreeDHospitalCampusMap } from './components/ThreeDHospitalCampusMap';
import { SearchAndRoutePanel } from './components/SearchAndRoutePanel';
import { NavigationController } from './components/NavigationController';
import { AIAssistantModal } from './components/AIAssistantModal';
import { EmergencyModal } from './components/EmergencyModal';
import { 
  Layers, 
  Building2,
  ListFilter, 
  Sparkles,
  ShieldAlert,
  Map
} from 'lucide-react';

export default function App() {
  const [currentCampus, setCurrentCampus] = useState<HospitalCampus>(REAL_HOSPITALS_LIST[0]);

  // View Mode: 'overview_2d' (Official Master 2D Signboard Map) vs 'floor_2d' (Indoor Floorplan with A* Pathfinding) vs '3d' (3D Campus)
  const [viewMode, setViewMode] = useState<AppViewMode>('overview_2d');

  // Navigation & Location state
  const [currentBuildingId, setCurrentBuildingId] = useState<BuildingId>('A');
  const [currentFloorId, setCurrentFloorId] = useState<FloorId>('1');
  const [startNode, setStartNode] = useState<MapNode | null>(MAP_NODES_DATA[9]); // Default: Sảnh chính Tòa A
  const [destinationNode, setDestinationNode] = useState<MapNode | null>(MAP_NODES_DATA[10]); // Default: Quầy tiếp đón A-101
  const [routingProfile, setRoutingProfile] = useState<RoutingProfile>('fastest');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [simulatedStepIndex, setSimulatedStepIndex] = useState<number>(0);
  const [pdrPosition] = useState<PDRPositionState | null>(null);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  // Mobile Tab toggle ('map' or 'search')
  const [mobileTab, setMobileTab] = useState<'map' | 'search'>('map');

  // Essential Modals
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Compute Active Navigation Route whenever start/dest/profile changes
  const activeRoute: NavigationRoute | null = useMemo(() => {
    if (!startNode || !destinationNode) return null;
    return findRoute(startNode.id, destinationNode.id, routingProfile);
  }, [startNode, destinationNode, routingProfile]);

  // When a destination is selected, auto-navigate / center
  const handleSelectDestinationNode = (node: MapNode) => {
    setDestinationNode(node);
    if (node) {
      setCurrentBuildingId(node.buildingId);
      setCurrentFloorId(node.floorId);
    }
    setSimulatedStepIndex(0);
    setMobileTab('map');
  };

  const handleSelectStartNode = (node: MapNode) => {
    setStartNode(node);
    if (node) {
      setCurrentBuildingId(node.buildingId);
      setCurrentFloorId(node.floorId);
    }
    setSimulatedStepIndex(0);
  };

  const handleSwapNodes = () => {
    const temp = startNode;
    setStartNode(destinationNode);
    setDestinationNode(temp);
    setSimulatedStepIndex(0);
  };

  // Emergency Action: strictly target A9 Emergency Entrance
  const handleEmergencyRoute = () => {
    const erNode = MAP_NODES_DATA.find(n => n.id === 'node_a9_emergency_entrance') || MAP_NODES_DATA.find(n => n.buildingId === 'A9') || MAP_NODES_DATA[0];
    setDestinationNode(erNode);
    setRoutingProfile('emergency');
    if (erNode) {
      setCurrentBuildingId(erNode.buildingId);
      setCurrentFloorId(erNode.floorId);
    }
    setIsNavigating(true);
    setSimulatedStepIndex(0);
    setMobileTab('map');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        language={language}
        onChangeLanguage={setLanguage}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* Main Workspace Layout (Sidebar + Map Viewport) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Sidebar: Search & Route Picker */}
        <div
          className={`w-full md:w-84 lg:w-96 flex-shrink-0 h-full overflow-hidden ${
            mobileTab === 'search' ? 'flex flex-col' : 'hidden md:flex flex-col'
          }`}
        >
          <SearchAndRoutePanel
            currentCampus={currentCampus}
            onSelectCampus={setCurrentCampus}
            startNode={startNode}
            destinationNode={destinationNode}
            onSelectStartNode={handleSelectStartNode}
            onSelectDestinationNode={handleSelectDestinationNode}
            onSwapNodes={handleSwapNodes}
            routingProfile={routingProfile}
            onChangeRoutingProfile={setRoutingProfile}
            onStartNavigation={() => {
              setIsNavigating(true);
              setSimulatedStepIndex(0);
              setViewMode('floor_2d');
              setMobileTab('map');
            }}
            language={language}
          />
        </div>

        {/* Right Area: Map Viewport (Overview 2D, Floor 2D, or 3D) */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden relative ${
            mobileTab === 'map' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {viewMode === 'overview_2d' ? (
            /* Official 2D Master Campus Map */
            <div className="flex-1 w-full h-full relative overflow-hidden">
              <Hospital2DCampusMap
                onSwitchToFloorMap={(bId, fId) => {
                  setCurrentBuildingId(bId);
                  if (fId) setCurrentFloorId(fId);
                  setViewMode('floor_2d');
                }}
                startNode={startNode}
                destinationNode={destinationNode}
                onSelectStartNode={handleSelectStartNode}
                onSelectDestinationNode={handleSelectDestinationNode}
                activeRoute={activeRoute}
                routingProfile={routingProfile}
                language={language}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            </div>
          ) : viewMode === 'floor_2d' ? (
            /* Interactive 2D Indoor Hospital Floor Plan */
            <div className="flex-1 w-full h-full relative overflow-hidden">
              <HospitalMap
                currentBuildingId={currentBuildingId}
                currentFloorId={currentFloorId}
                onSelectBuilding={setCurrentBuildingId}
                onSelectFloor={setCurrentFloorId}
                startNode={startNode}
                destinationNode={destinationNode}
                onSelectStartNode={handleSelectStartNode}
                onSelectDestinationNode={handleSelectDestinationNode}
                activeRoute={activeRoute}
                simulatedStepIndex={simulatedStepIndex}
                routingProfile={routingProfile}
                pdrPosition={pdrPosition}
                language={language}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            </div>
          ) : (
            /* Static / Interactive 3D Hospital Campus Overview */
            <div className="flex-1 w-full h-full relative overflow-hidden">
              <ThreeDHospitalCampusMap
                currentCampus={currentCampus}
                onSwitchToIndoorMap={(bId) => {
                  if (bId) setCurrentBuildingId(bId);
                  setViewMode('floor_2d');
                }}
                startNode={startNode}
                destinationNode={destinationNode}
                onSelectStartNode={handleSelectStartNode}
                onSelectDestinationNode={handleSelectDestinationNode}
                activeRoute={activeRoute}
                isNavigating={isNavigating}
                simulatedStepIndex={simulatedStepIndex}
                onStepChange={setSimulatedStepIndex}
                onStartNavigation={() => {
                  setIsNavigating(true);
                  setSimulatedStepIndex(0);
                }}
                onStopNavigation={() => setIsNavigating(false)}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                language={language}
              />
            </div>
          )}

          {/* Turn-by-Turn Navigation Bottom Controller (Active during 2D indoor navigation) */}
          {isNavigating && activeRoute && viewMode === 'floor_2d' && (
            <NavigationController
              route={activeRoute}
              currentStepIndex={simulatedStepIndex}
              onStepChange={setSimulatedStepIndex}
              onClose={() => setIsNavigating(false)}
              language={language}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden bg-white border-t border-slate-200 p-2 flex items-center justify-around z-40 shadow-lg">
        <button
          id="btn-mobile-mode-overview-2d"
          onClick={() => {
            setViewMode('overview_2d');
            setMobileTab('map');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
            mobileTab === 'map' && viewMode === 'overview_2d'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
              : 'text-slate-500'
          }`}
        >
          <Map className="w-4 h-4 text-emerald-600" />
          <span>Toàn cảnh 2D</span>
        </button>

        <button
          id="btn-mobile-mode-floor-2d"
          onClick={() => {
            setViewMode('floor_2d');
            setMobileTab('map');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
            mobileTab === 'map' && viewMode === 'floor_2d'
              ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200'
              : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-600" />
          <span>Từng tầng</span>
        </button>

        <button
          id="btn-mobile-mode-3d"
          onClick={() => {
            setViewMode('3d');
            setMobileTab('map');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
            mobileTab === 'map' && viewMode === '3d'
              ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200'
              : 'text-slate-500'
          }`}
        >
          <Building2 className="w-4 h-4 text-cyan-600" />
          <span>3D Khuôn viên</span>
        </button>

        <button
          id="btn-mobile-tab-search"
          onClick={() => setMobileTab('search')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
            mobileTab === 'search' ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200' : 'text-slate-500'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Tìm khoa</span>
        </button>

        <button
          id="btn-mobile-emergency"
          onClick={handleEmergencyRoute}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[11px] font-semibold text-rose-600 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Cấp cứu</span>
        </button>
      </div>

      {/* Essential Modals */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onSelectDestinationNode={handleSelectDestinationNode}
        currentBuilding={currentBuildingId}
        currentFloor={currentFloorId}
        language={language}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onTriggerEmergencyRoute={handleEmergencyRoute}
        language={language}
      />
    </div>
  );
}

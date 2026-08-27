import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  HospitalCampus, 
  BuildingId, 
  FloorId, 
  MapNode, 
  NavigationRoute, 
  NavigationStep,
  RoomDetails 
} from '../types';
import { MAP_NODES_DATA, getRoomById } from '../data/hospitalData';
import { 
  Compass, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Box, 
  Layers, 
  Footprints, 
  Navigation, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Layers2, 
  Sparkles, 
  Clock, 
  Milestone, 
  Building2, 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakInstruction, stopSpeaking } from '../utils/speech';

interface ThreeDHospitalCampusMapProps {
  currentCampus: HospitalCampus;
  onSwitchToIndoorMap?: (buildingId?: BuildingId) => void;
  startNode?: MapNode | null;
  destinationNode?: MapNode | null;
  onSelectStartNode?: (node: MapNode) => void;
  onSelectDestinationNode?: (node: MapNode) => void;
  activeRoute?: NavigationRoute | null;
  isNavigating?: boolean;
  simulatedStepIndex?: number;
  onStepChange?: (index: number) => void;
  onStartNavigation?: () => void;
  onStopNavigation?: () => void;
  onOpenAIAssistant?: () => void;
  language: 'vi' | 'en';
}

// 3D Building Definition
interface CampusBuilding3DDef {
  id: string;
  code: BuildingId;
  name: string;
  nameEn: string;
  floors: number;
  departments: string[];
  crowdLevel: 'low' | 'medium' | 'high';
  avgWaitMins: number;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: number;
  roofColor: number;
  accentColor: number;
  isEmergency?: boolean;
  hasHelipad?: boolean;
}

export const ThreeDHospitalCampusMap: React.FC<ThreeDHospitalCampusMapProps> = ({
  currentCampus,
  onSwitchToIndoorMap,
  startNode,
  destinationNode,
  onSelectStartNode,
  onSelectDestinationNode,
  activeRoute,
  isNavigating = false,
  simulatedStepIndex = 0,
  onStepChange,
  onStartNavigation,
  onStopNavigation,
  language
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Interactive View States
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>('A');
  const [selectedRoomNode, setSelectedRoomNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [isDayNight, setIsDayNight] = useState<'day' | 'night'>('day');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isExplodedView, setIsExplodedView] = useState<boolean>(false);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(true); // Default X-Ray to see indoor pathways
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<string>('all'); // 'all', '1', '2', '3', '4', '5'
  const [cameraMode, setCameraMode] = useState<'free' | 'follow' | 'fps' | 'topdown'>('free');

  // Simulation & Walkthrough state
  const [isPlayingSim, setIsPlayingSim] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // 3D Object Refs
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const floorSlicesRef = useRef<Map<string, THREE.Group[]>>(new Map());
  const roofGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const wallMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const roomMarkersGroupRef = useRef<THREE.Group | null>(null);
  const skybridgeMeshRef = useRef<THREE.Group | null>(null);
  const ambulanceRef = useRef<THREE.Group | null>(null);
  const helicopterPropellerRef = useRef<THREE.Mesh | null>(null);
  const routeLineRef = useRef<THREE.Mesh | null>(null);
  const routeParticlesRef = useRef<THREE.Points | null>(null);
  const startMarkerRef = useRef<THREE.Group | null>(null);
  const destMarkerRef = useRef<THREE.Group | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);

  // 3D Buildings Layout
  const buildingsData: CampusBuilding3DDef[] = useMemo(() => {
    return [
      {
        id: 'building-K1',
        code: 'K1',
        name: 'Tòa K1: Khám Bệnh Đa Khoa & Theo Yêu Cầu',
        nameEn: 'Building K1: Outpatient & Specialty Clinic Center',
        floors: 6,
        departments: ['Cổng 4 (Giải Phóng - Vào K1, K2)', 'Tiếp đón BHYT & Kiosk K1-101', 'Khám Tim Mạch & Nội Khoa', 'Khám Nhi, Sản, TMH, Mắt', 'Nhà thuốc BV Bạch Mai Số 1'],
        crowdLevel: 'high',
        avgWaitMins: 15,
        x: -45,
        z: 25,
        width: 52,
        depth: 42,
        height: 38,
        color: 0xf1f5f9,
        roofColor: 0x0284c7,
        accentColor: 0x38bdf8
      },
      {
        id: 'building-A9',
        code: 'A9',
        name: 'Tòa A9: Trung Tâm Cấp Cứu A9 (24/7)',
        nameEn: 'Building A9: A9 Emergency Center (24/7)',
        floors: 5,
        departments: ['Cổng 1 (78 Giải Phóng - Vào A9)', 'Cấp Cứu A9 24/7 (A9-100)', 'Phân loại bệnh nhân Triage', 'Hồi sức cấp cứu ICU'],
        crowdLevel: 'medium',
        avgWaitMins: 0,
        x: 45,
        z: 35,
        width: 45,
        depth: 30,
        height: 34,
        color: 0xf8fafc,
        roofColor: 0xdc2626,
        accentColor: 0xef4444,
        isEmergency: true,
        hasHelipad: true
      },
      {
        id: 'building-A10',
        code: 'A10',
        name: 'Tòa A10: Trung Tâm Đột Quỵ',
        nameEn: 'Building A10: Stroke Center',
        floors: 4,
        departments: ['Cạnh Tòa A9 (Cổng 1)', 'Cấp cứu đột quỵ giờ vàng', 'Tiêu sợi huyết', 'Can thiệp mạch não'],
        crowdLevel: 'medium',
        avgWaitMins: 0,
        x: 45,
        z: 5,
        width: 35,
        depth: 25,
        height: 28,
        color: 0xf8fafc,
        roofColor: 0xb91c1c,
        accentColor: 0xdc2626,
        isEmergency: true
      },
      {
        id: 'building-K3',
        code: 'K3',
        name: 'Tòa K3: TT Chống Độc & Da Liễu / Bỏng',
        nameEn: 'Building K3: Poison Control & Dermatology',
        floors: 4,
        departments: ['Gần Cổng 1 Giải Phóng', 'Trung tâm Chống độc Quốc gia', 'Khoa Da liễu', 'Đơn vị Bỏng'],
        crowdLevel: 'medium',
        avgWaitMins: 5,
        x: 10,
        z: 40,
        width: 30,
        depth: 25,
        height: 26,
        color: 0xf8fafc,
        roofColor: 0xe11d48,
        accentColor: 0xf43f5e,
        isEmergency: true
      },
      {
        id: 'building-VTM',
        code: 'VTM',
        name: 'Viện Tim Mạch Việt Nam (Khối nhà bên trái)',
        nameEn: 'Vietnam National Heart Institute (Building C)',
        floors: 4,
        departments: ['Khối nhà lớn bên trái', 'Khám Tim Mạch Chuyên Gia', 'Điện Sinh Lý Tim', 'Can thiệp Cathlab & Phẫu thuật tim'],
        crowdLevel: 'high',
        avgWaitMins: 20,
        x: -45,
        z: -45,
        width: 48,
        depth: 44,
        height: 28,
        color: 0xf8fafc,
        roofColor: 0x7c3aed,
        accentColor: 0xa855f7
      },
      {
        id: 'building-Q',
        code: 'Q',
        name: 'Tòa Q: Trung Tâm Ung Bướu & YHHN (21 Tầng)',
        nameEn: 'Building Q: Oncology & Nuclear Medicine Center',
        floors: 21,
        departments: ['Máy xạ trị gia tốc TrueBeam', 'PET/CT & SPECT', 'Hóa trị ban ngày', 'Y học hạt nhân Nhi khoa'],
        crowdLevel: 'medium',
        avgWaitMins: 8,
        x: 45,
        z: -45,
        width: 44,
        depth: 38,
        height: 54,
        color: 0xf8fafc,
        roofColor: 0x059669,
        accentColor: 0x10b981
      }
    ];
  }, []);

  // Helper: Convert any MapNode into 3D Vector Coordinate
  const getNode3DPosition = useCallback((node: MapNode): THREE.Vector3 => {
    let building = buildingsData.find(b => b.code === node.buildingId);
    if (!building) building = buildingsData[0];

    // Floor height in 3D
    let floorLevel = 1;
    if (node.floorId === 'B1') floorLevel = 0.4;
    else if (node.floorId === '1') floorLevel = 1;
    else if (node.floorId === '2') floorLevel = 2;
    else if (node.floorId === '3') floorLevel = 3;
    else if (node.floorId === '4') floorLevel = 4;
    else if (node.floorId === '5') floorLevel = 5;

    const floorHeight = 6.0;
    const y = (floorLevel - 1) * floorHeight + 2.5;

    // Node x,y are in 0..1000 coordinate space of 2D floorplan
    const innerX = (node.x / 1000 - 0.5) * (building.width * 0.72);
    const innerZ = (node.y / 800 - 0.5) * (building.depth * 0.72);

    return new THREE.Vector3(building.x + innerX, y, building.z + innerZ);
  }, [buildingsData]);

  // Compute 3D Path Waypoints from activeRoute.pathNodes
  const routePoints3D: THREE.Vector3[] = useMemo(() => {
    if (activeRoute && activeRoute.pathNodes && activeRoute.pathNodes.length >= 2) {
      const pts: THREE.Vector3[] = [];
      
      for (let i = 0; i < activeRoute.pathNodes.length; i++) {
        const curr = activeRoute.pathNodes[i];
        const pCurr = getNode3DPosition(curr);
        
        // If connecting via skybridge or inter-building ground link, add smooth transitions
        if (i > 0) {
          const prev = activeRoute.pathNodes[i - 1];
          if (prev.buildingId !== curr.buildingId) {
            // Check if skybridge on 2nd floor
            if (prev.floorId === '2' && curr.floorId === '2') {
              const midSky = new THREE.Vector3(
                (pCurr.x + pts[pts.length - 1].x) / 2,
                8.8, // Skybridge elevation
                (pCurr.z + pts[pts.length - 1].z) / 2
              );
              pts.push(midSky);
            } else if (prev.floorId === '1' && curr.floorId === '1') {
              const midGround = new THREE.Vector3(
                (pCurr.x + pts[pts.length - 1].x) / 2,
                1.5,
                (pCurr.z + pts[pts.length - 1].z) / 2
              );
              pts.push(midGround);
            }
          }
        }
        
        pts.push(pCurr);
      }
      return pts;
    }

    // Default fallback: between start & dest
    if (startNode && destinationNode) {
      const p1 = getNode3DPosition(startNode);
      const p2 = getNode3DPosition(destinationNode);
      const mid = new THREE.Vector3((p1.x + p2.x) / 2, 1.5, (p1.z + p2.z) / 2);
      return [p1, mid, p2];
    }

    return [];
  }, [activeRoute, startNode, destinationNode, getNode3DPosition]);

  // Selected Room Details
  const selectedRoomDetails: RoomDetails | null = useMemo(() => {
    if (!selectedRoomNode || !selectedRoomNode.roomId) return null;
    return getRoomById(selectedRoomNode.roomId) || null;
  }, [selectedRoomNode]);

  // Active step in route
  const currentNavStep: NavigationStep | undefined = activeRoute?.steps?.[simulatedStepIndex];

  // Voice guidance on step change
  useEffect(() => {
    if (isNavigating && currentNavStep && isVoiceEnabled) {
      const text = language === 'vi' ? currentNavStep.instructionVi : currentNavStep.instructionEn;
      speakInstruction(text, language);
    }
  }, [isNavigating, currentNavStep, isVoiceEnabled, language]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    const skyColorDay = 0xf1f5f9;
    const skyColorNight = 0x090d16;
    scene.background = new THREE.Color(isDayNight === 'day' ? skyColorDay : skyColorNight);
    scene.fog = new THREE.FogExp2(isDayNight === 'day' ? skyColorDay : skyColorNight, 0.0018);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.set(110, 100, 130);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDayNight === 'day' ? 1.25 : 0.95;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 350;
    controls.target.set(0, 10, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDayNight === 'day' ? 1.1 : 0.25);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, isDayNight === 'day' ? 0.75 : 0.2);
    hemiLight.position.set(0, 100, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, isDayNight === 'day' ? 1.7 : 0.3);
    sunLight.position.set(80, 140, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.camera.left = -140;
    sunLight.shadow.camera.right = 140;
    sunLight.shadow.camera.top = 140;
    sunLight.shadow.camera.bottom = -140;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 6. Ground & Plaza
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    const groundGeo = new THREE.PlaneGeometry(380, 380);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isDayNight === 'day' ? 0xf8fafc : 0x0b1120,
      roughness: 0.85
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    groundGroup.add(groundMesh);

    const gridHelper = new THREE.GridHelper(
      340, 
      34, 
      isDayNight === 'day' ? 0xcbd5e1 : 0x1e293b, 
      isDayNight === 'day' ? 0xe2e8f0 : 0x0f172a
    );
    gridHelper.position.y = 0.05;
    groundGroup.add(gridHelper);

    // Main Asphalt Roads
    const roadMat = new THREE.MeshStandardMaterial({ 
      color: isDayNight === 'day' ? 0x475569 : 0x1e293b, 
      roughness: 0.9 
    });
    const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(300, 24), roadMat);
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.y = 0.1;
    hRoad.receiveShadow = true;
    groundGroup.add(hRoad);

    const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(24, 300), roadMat);
    vRoad.rotation.x = -Math.PI / 2;
    vRoad.position.y = 0.11;
    vRoad.receiveShadow = true;
    groundGroup.add(vRoad);

    // Central Green Roundabout Plaza
    const plazaMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(26, 26, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.9 })
    );
    plazaMesh.position.set(0, 0.2, 0);
    plazaMesh.receiveShadow = true;
    groundGroup.add(plazaMesh);

    // Fountain
    const fountainBase = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 12, 1.8, 32),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.3 })
    );
    fountainBase.position.set(0, 0.9, 0);
    groundGroup.add(fountainBase);

    // 7. BUILD 3D ARCHITECTURAL BUILDINGS & FLOORS
    buildingMeshesRef.current.clear();
    floorSlicesRef.current.clear();
    roofGroupsRef.current.clear();
    wallMaterialsRef.current = [];

    buildingsData.forEach(b => {
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(b.x, 0, b.z);
      buildingGroup.userData = { id: b.id, code: b.code, name: b.name };

      const floorHeight = 6.0;
      const floorSlices: THREE.Group[] = [];

      for (let f = 0; f < b.floors; f++) {
        const floorGroup = new THREE.Group();
        const baseY = f * floorHeight;
        floorGroup.position.y = baseY;
        floorGroup.userData = { 
          baseY, 
          floorIndex: f, 
          floorNum: f + 1, 
          floorHeight, 
          buildingHeight: b.height,
          buildingId: b.code 
        };

        const isTopFloor = f === b.floors - 1;
        const slabColor = isTopFloor ? b.roofColor : b.color;

        // Concrete Floor Slab
        const slabMesh = new THREE.Mesh(
          new THREE.BoxGeometry(b.width, floorHeight * 0.94, b.depth),
          new THREE.MeshStandardMaterial({
            color: slabColor,
            roughness: 0.35,
            metalness: 0.05,
            transparent: true,
            opacity: isXRayMode ? 0.3 : 1.0
          })
        );
        slabMesh.position.y = floorHeight * 0.47;
        slabMesh.castShadow = true;
        slabMesh.receiveShadow = true;
        floorGroup.add(slabMesh);
        wallMaterialsRef.current.push(slabMesh.material as THREE.MeshStandardMaterial);

        // Glass Window Ribbon
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
          metalness: 0.8,
          transparent: true,
          opacity: isXRayMode ? 0.2 : 0.65
        });
        const glassMesh = new THREE.Mesh(
          new THREE.BoxGeometry(b.width + 0.6, floorHeight * 0.38, b.depth + 0.6),
          glassMat
        );
        glassMesh.position.y = floorHeight * 0.47;
        floorGroup.add(glassMesh);
        wallMaterialsRef.current.push(glassMat);

        // Interior Floor Plate & Walkway grid
        const interiorPlate = new THREE.Mesh(
          new THREE.BoxGeometry(b.width - 2, 0.2, b.depth - 2),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 })
        );
        interiorPlate.position.y = 0.1;
        floorGroup.add(interiorPlate);

        // Interior 3D Elevator Shaft core
        const elevatorCore = new THREE.Mesh(
          new THREE.BoxGeometry(6, floorHeight, 6),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, transparent: true, opacity: 0.8 })
        );
        elevatorCore.position.set(0, floorHeight * 0.5, 0);
        floorGroup.add(elevatorCore);

        buildingGroup.add(floorGroup);
        floorSlices.push(floorGroup);
      }

      floorSlicesRef.current.set(b.id, floorSlices);

      // Entrance Canopy
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(16, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.2 })
      );
      canopy.position.set(0, 4, b.depth / 2 + 4);
      canopy.castShadow = true;
      buildingGroup.add(canopy);

      // Roof Structure
      const roofGroup = new THREE.Group();
      roofGroup.position.y = b.height;
      roofGroup.userData = { baseY: b.height, totalFloors: b.floors, floorHeight };

      const parapet = new THREE.Mesh(
        new THREE.BoxGeometry(b.width + 0.8, 1.2, b.depth + 0.8),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 })
      );
      parapet.position.set(0, 0.6, 0);
      roofGroup.add(parapet);

      // Emergency Cross / Helipad for Tòa B
      if (b.isEmergency) {
        const crossH = new THREE.Mesh(
          new THREE.BoxGeometry(8, 2.5, 1.2),
          new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8 })
        );
        crossH.position.set(0, 1.5, b.depth / 2 + 0.6);
        roofGroup.add(crossH);

        const crossV = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 8, 1.2),
          new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8 })
        );
        crossV.position.set(0, 1.5, b.depth / 2 + 0.6);
        roofGroup.add(crossV);
      }

      if (b.hasHelipad) {
        const heliBase = new THREE.Mesh(
          new THREE.CylinderGeometry(14, 14, 0.8, 32),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
        );
        heliBase.position.set(0, 0.5, 0);
        roofGroup.add(heliBase);

        const heliGroup = new THREE.Group();
        heliGroup.position.set(0, 2, 0);

        const body = new THREE.Mesh(
          new THREE.BoxGeometry(6, 3, 12),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e })
        );
        heliGroup.add(body);

        const prop = new THREE.Mesh(
          new THREE.BoxGeometry(18, 0.2, 1.5),
          new THREE.MeshStandardMaterial({ color: 0x0f172a })
        );
        prop.position.y = 2.4;
        heliGroup.add(prop);
        helicopterPropellerRef.current = prop;

        roofGroup.add(heliGroup);
      }

      // 3D Billboard Label
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = b.isEmergency ? 'rgba(225, 29, 72, 0.92)' : 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(8, 8, 496, 124, 28);
        ctx.fill();

        ctx.strokeStyle = b.isEmergency ? '#ffffff' : '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = b.isEmergency ? '#ffffff' : '#38bdf8';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(`TÒA ${b.code}`, 32, 80);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        const shortName = b.name.replace(/Tòa [A-Z]:\s*/, '');
        ctx.fillText(shortName.length > 18 ? shortName.slice(0, 16) + '...' : shortName, 210, 80);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(30, 8.2, 1);
        sprite.position.set(0, 10, 0);
        roofGroup.add(sprite);
      }

      buildingGroup.add(roofGroup);
      roofGroupsRef.current.set(b.id, roofGroup);
      scene.add(buildingGroup);
      buildingMeshesRef.current.set(b.id, buildingGroup);
    });

    // 8. 3D PHYSICAL SKYBRIDGE (Between Building A 2F and Building C 2F)
    const skybridgeGroup = new THREE.Group();
    const bA = buildingsData[0]; // A at (-45, 25)
    const bC = buildingsData[2]; // C at (-45, -45)
    const bridgeLength = Math.abs(bA.z - bC.z) - (bA.depth + bC.depth) / 2;
    const bridgeZ = (bA.z + bC.z) / 2;
    const bridgeElevation = 8.8; // 2nd floor height

    const bridgeFloor = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.8, bridgeLength),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    bridgeFloor.position.set(bA.x, bridgeElevation, bridgeZ);
    skybridgeGroup.add(bridgeFloor);

    const bridgeGlass = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 4.5, bridgeLength),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.4 })
    );
    bridgeGlass.position.set(bA.x, bridgeElevation + 2.4, bridgeZ);
    skybridgeGroup.add(bridgeGlass);

    // Skybridge LED Floor Line
    const bridgeLED = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, bridgeLength - 2),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    bridgeLED.rotation.x = -Math.PI / 2;
    bridgeLED.position.set(bA.x, bridgeElevation + 0.42, bridgeZ);
    skybridgeGroup.add(bridgeLED);

    scene.add(skybridgeGroup);
    skybridgeMeshRef.current = skybridgeGroup;

    // 9. 3D INTERACTIVE ROOM PINS GROUP
    const roomMarkersGroup = new THREE.Group();
    scene.add(roomMarkersGroup);
    roomMarkersGroupRef.current = roomMarkersGroup;

    // 10. 3D AVATAR (WALKING AGENT)
    const avatarGroup = new THREE.Group();
    
    // Body & Head
    const avatarBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    avatarBody.position.y = 1.6;
    avatarGroup.add(avatarBody);

    const avatarHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 })
    );
    avatarHead.position.y = 3.2;
    avatarGroup.add(avatarHead);

    // Glowing Pulse Beacon Ring under avatar
    const pulseRing = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.4, 32),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    pulseRing.rotation.x = -Math.PI / 2;
    pulseRing.position.y = 0.2;
    avatarGroup.add(pulseRing);

    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;
    avatarGroup.visible = false;

    // Raycaster for Pointer Down & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedObject = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(scene.children, true);
    };

    const onPointerDown = (event: MouseEvent) => {
      const intersects = getIntersectedObject(event);
      if (intersects.length > 0) {
        for (let hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr && curr !== scene) {
            if (curr.userData && curr.userData.mapNode) {
              setSelectedRoomNode(curr.userData.mapNode);
              return;
            }
            if (curr.userData && curr.userData.code) {
              setSelectedBuildingId(curr.userData.code);
              return;
            }
            curr = curr.parent;
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Spin helicopter propeller
      if (helicopterPropellerRef.current) {
        helicopterPropellerRef.current.rotation.y += delta * 25;
      }

      // Auto-rotation mode
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotate;
        controlsRef.current.autoRotateSpeed = 1.0;
        controlsRef.current.update();
      }

      // Animate walking avatar along 3D route
      if (avatarGroupRef.current && routePoints3D.length >= 2) {
        avatarGroupRef.current.visible = true;
        const curve = new THREE.CatmullRomCurve3(routePoints3D);
        
        let progress = simProgress;
        if (isPlayingSim) {
          progress = (simProgress + delta * 0.06 * simSpeed) % 1;
          setSimProgress(progress);
        }

        const pt = curve.getPoint(progress);
        const tangent = curve.getTangent(progress);
        
        avatarGroupRef.current.position.copy(pt);
        avatarGroupRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        avatarGroupRef.current.position.y += Math.sin(elapsedTime * 8) * 0.12;

        // FOLLOW CAMERA MODE: Smoothly track avatar in 3D
        if (cameraMode === 'follow' && cameraRef.current && controlsRef.current) {
          const camOffset = tangent.clone().multiplyScalar(-18).add(new THREE.Vector3(0, 12, 0));
          const targetCamPos = pt.clone().add(camOffset);
          cameraRef.current.position.lerp(targetCamPos, 0.08);
          controlsRef.current.target.lerp(pt.clone().add(new THREE.Vector3(0, 2, 0)), 0.1);
        } else if (cameraMode === 'fps' && cameraRef.current && controlsRef.current) {
          const eyePos = pt.clone().add(new THREE.Vector3(0, 2.2, 0));
          cameraRef.current.position.lerp(eyePos, 0.15);
          const lookTarget = eyePos.clone().add(tangent.clone().multiplyScalar(15));
          controlsRef.current.target.lerp(lookTarget, 0.15);
        }
      } else if (avatarGroupRef.current) {
        avatarGroupRef.current.visible = false;
      }

      // Rotate Route Particles
      if (routeParticlesRef.current) {
        routeParticlesRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
    };
  }, [buildingsData, isDayNight]);

  // Update 3D Room Markers on Map
  useEffect(() => {
    if (!roomMarkersGroupRef.current || !sceneRef.current) return;
    const group = roomMarkersGroupRef.current;
    
    // Clear old markers
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const selectableNodes = MAP_NODES_DATA.filter(n => {
      if (selectedFloorFilter !== 'all' && n.floorId !== selectedFloorFilter) return false;
      return n.type === 'room' || n.type === 'emergency' || n.type === 'elevator' || n.type === 'skybridge' || n.type === 'reception';
    });

    selectableNodes.forEach(node => {
      const pos = getNode3DPosition(node);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(pos);
      markerGroup.userData = { mapNode: node };

      const isStart = startNode?.id === node.id;
      const isDest = destinationNode?.id === node.id;
      const isEmergency = node.type === 'emergency';

      // 3D Pin Geometry
      let pinColor = isStart ? 0x10b981 : isDest ? 0xf43f5e : isEmergency ? 0xe11d48 : 0x0284c7;
      if (node.type === 'elevator') pinColor = 0xf59e0b;

      const pinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(isStart || isDest ? 1.6 : 1.0, 16, 16),
        new THREE.MeshStandardMaterial({
          color: pinColor,
          emissive: pinColor,
          emissiveIntensity: isStart || isDest ? 0.8 : 0.4
        })
      );
      pinMesh.position.y = 1.2;
      markerGroup.add(pinMesh);

      // Floor ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 1.4, 16),
        new THREE.MeshBasicMaterial({ color: pinColor, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      ring.rotation.x = -Math.PI / 2;
      markerGroup.add(ring);

      group.add(markerGroup);
    });
  }, [selectedFloorFilter, startNode, destinationNode, getNode3DPosition]);

  // Update 3D Navigation Route in Scene
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old route meshes
    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current.geometry.dispose();
      routeLineRef.current = null;
    }
    if (routeParticlesRef.current) {
      scene.remove(routeParticlesRef.current);
      routeParticlesRef.current.geometry.dispose();
      routeParticlesRef.current = null;
    }
    if (startMarkerRef.current) {
      scene.remove(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (destMarkerRef.current) {
      scene.remove(destMarkerRef.current);
      destMarkerRef.current = null;
    }

    if (routePoints3D.length >= 2) {
      const curve = new THREE.CatmullRomCurve3(routePoints3D);
      const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.75, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.4,
        transparent: true,
        opacity: 0.92
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
      routeLineRef.current = tubeMesh;

      // Moving Light Energy Particles
      const particleCount = 60;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const p = curve.getPoint(t);
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y + 0.6;
        positions[i * 3 + 2] = p.z;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 2.8,
        transparent: true,
        opacity: 0.95
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);
      routeParticlesRef.current = particles;

      // Start Marker Flag
      const pStart = routePoints3D[0];
      const startGroup = new THREE.Group();
      startGroup.position.copy(pStart);
      const startPin = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 4, 16),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.8 })
      );
      startPin.position.y = 3;
      startPin.rotation.x = Math.PI;
      startGroup.add(startPin);
      scene.add(startGroup);
      startMarkerRef.current = startGroup;

      // Dest Marker Pin
      const pDest = routePoints3D[routePoints3D.length - 1];
      const destGroup = new THREE.Group();
      destGroup.position.copy(pDest);
      const destPin = new THREE.Mesh(
        new THREE.ConeGeometry(2.0, 5, 16),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.9 })
      );
      destPin.position.y = 3.5;
      destPin.rotation.x = Math.PI;
      destGroup.add(destPin);
      scene.add(destGroup);
      destMarkerRef.current = destGroup;
    }
  }, [routePoints3D]);

  // Update X-Ray mode material opacity
  useEffect(() => {
    wallMaterialsRef.current.forEach(mat => {
      mat.opacity = isXRayMode ? 0.35 : 1.0;
      mat.transparent = isXRayMode;
      mat.needsUpdate = true;
    });
  }, [isXRayMode]);

  // Exploded View Effect
  useEffect(() => {
    floorSlicesRef.current.forEach(slices => {
      slices.forEach((slice, idx) => {
        const baseY = (slice.userData && typeof slice.userData.baseY === 'number') 
          ? slice.userData.baseY 
          : idx * 6;
        const targetY = isExplodedView ? baseY + idx * 8 : baseY;
        slice.position.y = targetY;
      });
    });

    roofGroupsRef.current.forEach(roofGroup => {
      const baseY = (roofGroup.userData && typeof roofGroup.userData.baseY === 'number')
        ? roofGroup.userData.baseY
        : 30;
      const totalFloors = (roofGroup.userData && typeof roofGroup.userData.totalFloors === 'number')
        ? roofGroup.userData.totalFloors
        : 1;
      const targetY = isExplodedView ? baseY + (totalFloors - 1) * 8 : baseY;
      roofGroup.position.y = targetY;
    });
  }, [isExplodedView]);

  // Camera Reset / Modes
  const handleSetCameraMode = (mode: 'free' | 'follow' | 'fps' | 'topdown') => {
    setCameraMode(mode);
    if (!cameraRef.current || !controlsRef.current) return;

    if (mode === 'topdown') {
      cameraRef.current.position.set(0, 190, 10);
      controlsRef.current.target.set(0, 0, 0);
    } else if (mode === 'free') {
      cameraRef.current.position.set(110, 100, 130);
      controlsRef.current.target.set(0, 10, 0);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        {/* Left: Building & Mode Status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs text-slate-800">
            <Box className="w-4 h-4 text-cyan-600" />
            <span className="font-bold">Mô hình 3D Khuôn Viên</span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Mô phỏng</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">{currentCampus.name}</span>
          </div>

          {/* Floor Level Filter */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-1 text-xs">
            {['all', '1', '2', '3', '4', '5'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedFloorFilter(f)}
                className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                  selectedFloorFilter === f 
                    ? 'bg-cyan-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f === 'all' ? 'Tất cả tầng' : `Tầng ${f}`}
              </button>
            ))}
          </div>
        </div>

        {/* Right Tools (X-Ray, Explode, Day/Night, Follow Cam) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* X-Ray Inside View */}
          <button
            onClick={() => setIsXRayMode(!isXRayMode)}
            className={`p-2.5 rounded-2xl border transition shadow-lg flex items-center gap-1.5 text-xs cursor-pointer ${
              isXRayMode 
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold' 
                : 'bg-white/95 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Chế độ nhìn xuyên trong suốt (X-Ray)"
          >
            {isXRayMode ? <Eye className="w-4 h-4 text-cyan-600" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Nhìn xuyên tầng</span>
          </button>

          {/* Exploded View */}
          <button
            onClick={() => setIsExplodedView(!isExplodedView)}
            className={`p-2.5 rounded-2xl border transition shadow-lg flex items-center gap-1.5 text-xs cursor-pointer ${
              isExplodedView 
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold' 
                : 'bg-white/95 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Tách các tầng 3D"
          >
            <Layers2 className="w-4 h-4 text-cyan-600" />
            <span className="hidden sm:inline">Tách tầng 3D</span>
          </button>

          {/* Camera Preset */}
          <button
            onClick={() => handleSetCameraMode(cameraMode === 'topdown' ? 'free' : 'topdown')}
            className="p-2.5 bg-white/95 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-700 shadow-lg transition cursor-pointer"
            title="Góc nhìn từ trên cao / 3D tự do"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Day / Night */}
          <button
            onClick={() => setIsDayNight(isDayNight === 'day' ? 'night' : 'day')}
            className="p-2.5 bg-white/95 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-700 shadow-lg transition cursor-pointer"
            title="Bật/Tắt ánh sáng ngày đêm"
          >
            {isDayNight === 'day' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* Top Center: Active Turn-by-Turn Navigation HUD Card */}
      {activeRoute && currentNavStep && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 w-11/12 max-w-xl bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-3.5 shadow-2xl z-30 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
            {currentNavStep.maneuver === 'turn_left' ? <CornerUpLeft className="w-6 h-6" /> :
             currentNavStep.maneuver === 'turn_right' ? <CornerUpRight className="w-6 h-6" /> :
             currentNavStep.maneuver === 'take_elevator_up' || currentNavStep.maneuver === 'take_elevator_down' ? <Layers className="w-6 h-6" /> :
             currentNavStep.maneuver === 'cross_skybridge' ? <Milestone className="w-6 h-6" /> :
             currentNavStep.maneuver === 'arrive' ? <CheckCircle2 className="w-6 h-6" /> :
             <ArrowUp className="w-6 h-6" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-md">
                Bước {simulatedStepIndex + 1} / {activeRoute.steps.length}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Tòa {currentNavStep.buildingId} - Tầng {currentNavStep.floorId}
              </span>
              {currentNavStep.distance > 0 && (
                <span className="text-[11px] text-cyan-700 font-bold ml-auto">
                  {currentNavStep.distance}m
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
              {language === 'vi' ? currentNavStep.instructionVi : currentNavStep.instructionEn}
            </p>
          </div>

          {/* Voice Replay */}
          <button
            onClick={() => {
              const text = language === 'vi' ? currentNavStep.instructionVi : currentNavStep.instructionEn;
              speakInstruction(text, language);
            }}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-cyan-700 rounded-2xl border border-slate-200 transition shrink-0 cursor-pointer"
            title="Đọc lại hướng dẫn"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating 3D Selected Room Popup Card */}
      <AnimatePresence>
        {selectedRoomNode && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-4 right-4 sm:left-6 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-4 shadow-2xl z-30 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedRoomNode.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tòa {selectedRoomNode.buildingId} • {selectedRoomNode.floorId === 'B1' ? 'Tầng Hầm B1' : `Tầng ${selectedRoomNode.floorId}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRoomNode(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedRoomDetails && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                {selectedRoomDetails.doctorInCharge && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Bác sĩ phụ trách:</span>
                    <span className="font-bold text-slate-800">{selectedRoomDetails.doctorInCharge}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Thời gian làm việc:</span>
                  <span className="font-semibold text-slate-700">{selectedRoomDetails.operatingHours}</span>
                </div>
              </div>
            )}

            {/* Actions: Set Start / Set Destination / 2D View */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  if (onSelectStartNode) onSelectStartNode(selectedRoomNode);
                  setSelectedRoomNode(null);
                }}
                className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition border border-slate-200 cursor-pointer"
              >
                🚩 Điểm xuất phát
              </button>

              <button
                onClick={() => {
                  if (onSelectDestinationNode) onSelectDestinationNode(selectedRoomNode);
                  if (onStartNavigation) onStartNavigation();
                  setSelectedRoomNode(null);
                }}
                className="py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ đường tới đây</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating 3D Navigation Controls Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        {/* Camera Views Mode */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-1 text-xs pointer-events-auto">
          <button
            onClick={() => handleSetCameraMode('free')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              cameraMode === 'free' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            3D Tự do
          </button>
          <button
            onClick={() => handleSetCameraMode('follow')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
              cameraMode === 'follow' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Theo bước đi</span>
          </button>
          <button
            onClick={() => handleSetCameraMode('fps')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              cameraMode === 'fps' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Góc nhìn thứ 1
          </button>
        </div>

        {/* 3D Walkthrough Player */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              if (onStepChange) onStepChange(Math.max(0, simulatedStepIndex - 1));
            }}
            disabled={simulatedStepIndex === 0}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 rounded-xl text-slate-700 border border-slate-200 cursor-pointer"
            title="Bước trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlayingSim(!isPlayingSim)}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
          >
            {isPlayingSim ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlayingSim ? 'Dừng đi' : 'Mô phỏng đi 3D'}</span>
          </button>

          <button
            onClick={() => {
              if (onStepChange && activeRoute) {
                onStepChange(Math.min(activeRoute.steps.length - 1, simulatedStepIndex + 1));
              }
            }}
            disabled={!activeRoute || simulatedStepIndex >= (activeRoute.steps.length - 1)}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 rounded-xl text-slate-700 border border-slate-200 cursor-pointer"
            title="Bước tiếp"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center gap-1 text-[11px]">
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                  simSpeed === s ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { SimpleHeader } from './components/SimpleHeader';
import { DestinationStep } from './components/DestinationStep';
import { DestinationDetailView } from './components/DestinationDetailView';
import { Official108Map } from './components/Official108Map';
import { EmergencyModal } from './components/EmergencyModal';
import { MoreMenuDrawer } from './components/MoreMenuDrawer';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { 
  HOSPITAL_108_OFFICIAL_MAP_LINKS, 
  HOSPITAL_108_DESTINATIONS,
  Official108MapLink, 
  Hospital108Destination 
} from './data/hospital108';
import { addRecentDestinationId } from './utils/history';
import { stopSpeaking } from './utils/speech';

export type AppView = 'home' | 'destination_detail' | 'official_map' | 'help';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedDestination, setSelectedDestination] = useState<Hospital108Destination | null>(null);
  const [activeMapLink, setActiveMapLink] = useState<Official108MapLink | null>(null);
  
  // Trạng thái các modal
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Đồng bộ với History API (nút Back của trình duyệt / Android)
  useEffect(() => {
    // Khởi tạo state ban đầu nếu chưa có
    if (!window.history.state) {
      window.history.replaceState({ view: 'home' }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      stopSpeaking();
      const stateView = event.state?.view || 'home';
      setCurrentView(stateView);
      
      if (stateView === 'home') {
        setSelectedDestination(null);
        setActiveMapLink(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = useCallback((view: AppView, push = true) => {
    stopSpeaking();
    if (push) {
      window.history.pushState({ view }, '');
    }
    setCurrentView(view);
  }, []);

  const handleSelectDestination = (dest: Hospital108Destination) => {
    addRecentDestinationId(dest.id);
    setSelectedDestination(dest);
    navigateTo('destination_detail');
  };

  const handleStartNavigation = () => {
    if (!selectedDestination) return;

    let targetLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(
      l => l.id === selectedDestination.mapLinkId
    );

    if (!targetLink) {
      targetLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus')!;
    }

    setActiveMapLink(targetLink);
    navigateTo('official_map');
  };

  const handleBackToHome = () => {
    stopSpeaking();
    setSelectedDestination(null);
    setActiveMapLink(null);
    navigateTo('home');
  };

  const handleBackToDetail = () => {
    stopSpeaking();
    setActiveMapLink(null);
    navigateTo('destination_detail');
  };

  const handleOpenGeneralMap = () => {
    const campusLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus');
    const tongQuanDest = HOSPITAL_108_DESTINATIONS.find(d => d.id === 'tong_quan');
    
    if (campusLink) {
      setActiveMapLink(campusLink);
      setSelectedDestination(tongQuanDest || null);
      navigateTo('official_map');
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header chỉ hiển thị ở view Home hoặc Detail, Map có header riêng */}
      {currentView !== 'official_map' && (
        <SimpleHeader 
          onHome={handleBackToHome}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
          showBackButton={currentView === 'destination_detail'}
          onBack={handleBackToHome}
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
            onStartNavigation={handleStartNavigation}
            onBack={handleBackToHome}
          />
        )}

        {currentView === 'official_map' && activeMapLink && (
          <Official108Map 
            mapLink={activeMapLink} 
            destination={selectedDestination}
            onClose={handleBackToHome} 
            onChangeDestination={handleBackToHome}
            onOpenHelp={() => setIsHelpModalOpen(true)}
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

import React, { useState } from 'react';
import { SimpleHeader } from './components/SimpleHeader';
import { DestinationStep } from './components/DestinationStep';
import { Official108Map } from './components/Official108Map';
import { EmergencyModal } from './components/EmergencyModal';
import { MoreMenuDrawer } from './components/MoreMenuDrawer';
import { HOSPITAL_108_OFFICIAL_MAP_LINKS, Official108MapLink } from './data/hospital108';

export default function App() {
  const [activeMapLink, setActiveMapLink] = useState<Official108MapLink | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

  const handleSelectDestination = (mapLinkId: string) => {
    const link = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === mapLinkId);
    if (link) {
      setActiveMapLink(link);
    }
  };

  const handleBackToHome = () => {
    setActiveMapLink(null);
  };

  const handleOpenGeneralMap = () => {
    const campusLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === 'campus');
    if (campusLink) {
      setActiveMapLink(campusLink);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-hidden">
      <SimpleHeader 
        onHome={handleBackToHome}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
        showBackButton={activeMapLink !== null}
        onBack={handleBackToHome}
      />
      
      <main className="flex-1 overflow-y-auto w-full">
        <DestinationStep onSelectDestination={handleSelectDestination} />
      </main>
      
      {activeMapLink && (
        <Official108Map 
          mapLink={activeMapLink} 
          onClose={handleBackToHome} 
        />
      )}

      {isEmergencyOpen && (
        <EmergencyModal 
          onClose={() => setIsEmergencyOpen(false)} 
          onOpenMap={handleOpenGeneralMap}
        />
      )}

      <MoreMenuDrawer 
        isOpen={isMoreMenuOpen} 
        onClose={() => setIsMoreMenuOpen(false)} 
      />
    </div>
  );
}

import React from 'react';
import { ShieldAlert, Heart, MoreVertical, ArrowLeft } from 'lucide-react';

interface SimpleHeaderProps {
  onHome: () => void;
  onOpenEmergency: () => void;
  onOpenMoreMenu: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function SimpleHeader({
  onHome,
  onOpenEmergency,
  onOpenMoreMenu,
  showBackButton,
  onBack
}: SimpleHeaderProps) {
  return (
    <header className="h-16 sm:h-20 flex-none bg-emerald-700 text-white flex items-center justify-between px-3 safe-top relative z-10 shadow-md">
      <div className="flex items-center">
        {showBackButton && onBack ? (
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors mr-1"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-7 h-7 text-white" />
          </button>
        ) : (
          <div className="w-12 h-12 mr-1 flex items-center justify-center">
            <Heart className="w-7 h-7 text-emerald-100" />
          </div>
        )}
        
        <button 
          onClick={onHome} 
          className="flex items-center"
        >
          <div className="flex flex-col items-start leading-tight">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">MedNav <span className="text-emerald-200">108</span></span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenEmergency}
          className="h-12 px-4 sm:px-5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-rose-500/50"
          aria-label="Cấp cứu"
        >
          <ShieldAlert className="w-6 h-6 text-white stroke-[2.5]" />
          <span className="text-white font-bold text-base hidden sm:inline">Cấp cứu</span>
        </button>

        <button
          onClick={onOpenMoreMenu}
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors"
          aria-label="Menu mở rộng"
        >
          <MoreVertical className="w-7 h-7 text-white" />
        </button>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface SpeechGuideButtonProps {
  textToSpeak: string;
  label?: string;
  speakingLabel?: string;
  className?: string;
  size?: 'default' | 'large';
}

export function SpeechGuideButton({
  textToSpeak,
  label = 'Nghe hướng dẫn',
  speakingLabel = 'Dừng đọc',
  className = '',
  size = 'default'
}: SpeechGuideButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!textToSpeak.trim()) return;

    setIsSpeaking(true);
    speakText(
      textToSpeak,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const heightClass = size === 'large' ? 'h-14 sm:h-16 text-lg sm:text-xl' : 'h-12 text-base';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-4 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${heightClass} ${
        isSpeaking
          ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 active:bg-slate-100 shadow-sm'
      } ${className}`}
      aria-label={isSpeaking ? speakingLabel : label}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 shrink-0" />
          <span>{speakingLabel}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

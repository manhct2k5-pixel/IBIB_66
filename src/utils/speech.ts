// Web Speech API Voice Guidance helper

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakInstruction(text: string, language: 'vi' | 'en' = 'vi') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
  utterance.rate = 0.95; // Clear and easily audible in hospital
  utterance.pitch = 1.0;

  // Try to find a Vietnamese voice if available
  const voices = window.speechSynthesis.getVoices();
  if (language === 'vi') {
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
    if (viVoice) utterance.voice = viVoice;
  } else {
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Tiện ích chuyển đổi văn bản tiếng nói (Text-to-Speech) sử dụng Web Speech Synthesis API

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function speakText(
  text: string, 
  onStart?: () => void, 
  onEnd?: () => void, 
  onError?: (e: any) => void
): void {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError(new Error('Trình duyệt không hỗ trợ đọc giọng nói'));
    return;
  }

  // Dừng mọi âm thanh đang phát trước đó
  stopSpeaking();

  const cleanText = text.trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9; // Tốc độ vừa phải cho người cao tuổi dễ nghe
  utterance.pitch = 1.0;

  // Thử tìm voice tiếng Việt nếu có
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.startsWith('vi'));
  if (viVoice) {
    utterance.voice = viVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

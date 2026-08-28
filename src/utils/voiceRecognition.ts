import { Hospital108Destination } from '../data/hospital108';
import { normalizeVietnamese } from './stringUtils';

// Kiểu mở rộng cho SpeechRecognition trong Webkit
export interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isVoiceRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as IWindowWithSpeech;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

/**
 * Tìm điểm đến phù hợp nhất từ câu nói của người dùng
 */
export function matchDestinationFromVoice(
  transcript: string,
  destinations: Hospital108Destination[]
): Hospital108Destination | null {
  const norm = normalizeVietnamese(transcript);
  if (!norm) return null;

  // Chuẩn hóa một số cách phát âm số 1 trong tiếng Việt (ví dụ "c1 một a" -> "c1.1-a")
  const preparedNorm = norm
    .replace(/c1\s*mot\s*a/g, 'c1.1-a')
    .replace(/c1\s*mot\s*b/g, 'c1.1-b')
    .replace(/c1\s*mot\s*c/g, 'c1.1-c')
    .replace(/c1\s*1\s*a/g, 'c1.1-a')
    .replace(/c1\s*1\s*b/g, 'c1.1-b')
    .replace(/c1\s*1\s*c/g, 'c1.1-c')
    .replace(/c\s*mot\s*cham\s*mot\s*a/g, 'c1.1-a')
    .replace(/c\s*mot\s*cham\s*mot\s*b/g, 'c1.1-b')
    .replace(/c\s*mot\s*cham\s*mot\s*c/g, 'c1.1-c');

  // Ưu tiên khớp chính xác alias hoặc tên
  for (const dest of destinations) {
    const normName = normalizeVietnamese(dest.name);
    if (preparedNorm.includes(normName) || normName.includes(preparedNorm)) {
      return dest;
    }
    for (const alias of dest.aliases) {
      const normAlias = normalizeVietnamese(alias);
      if (preparedNorm.includes(normAlias)) {
        return dest;
      }
    }
  }

  // Khớp theo từ khóa đặc thù
  if (preparedNorm.includes('cap cuu') || preparedNorm.includes('115')) {
    return destinations.find(d => d.id === 'cap_cuu') || null;
  }
  if (preparedNorm.includes('theo yeu cau') || preparedNorm.includes('kham yeu cau')) {
    return destinations.find(d => d.id === 'c1_1_b') || null;
  }
  if (preparedNorm.includes('da khoa') || preparedNorm.includes('kham benh') || preparedNorm.includes('kham da khoa')) {
    return destinations.find(d => d.id === 'c1_1_a') || null;
  }
  if (preparedNorm.includes('doi ngoai') || preparedNorm.includes('quoc te')) {
    return destinations.find(d => d.id === 'kham_quoc_te') || null;
  }
  if (preparedNorm.includes('toan benh vien') || preparedNorm.includes('khuon vien') || preparedNorm.includes('tong quan')) {
    return destinations.find(d => d.id === 'tong_quan') || null;
  }

  return null;
}

export interface VoiceRecognitionOptions {
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindowWithSpeech;
      const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'vi-VN';
      }
    }
  }

  public startListening(options: VoiceRecognitionOptions): void {
    if (!this.recognition) {
      options.onError('Trình duyệt chưa hỗ trợ tìm kiếm bằng giọng nói.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        options.onResult(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      let message = 'Không thể nhận dạng giọng nói.';
      if (event.error === 'not-allowed') {
        message = 'Bác vui lòng cấp quyền microphone để sử dụng tính năng này.';
      } else if (event.error === 'no-speech') {
        message = 'Không nghe thấy giọng nói. Bác hãy thử nói lại gần micro hơn.';
      }
      options.onError(message);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd();
    };

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      options.onError(err?.message || 'Lỗi khi khởi động microphone.');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // bỏ qua nếu đã tắt
      }
      this.isListening = false;
    }
  }
}

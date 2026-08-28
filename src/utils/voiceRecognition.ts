// Voice recognition helper for Vietnamese elderly-friendly search using Web Speech API

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export class VoiceSearchController {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((errorMsg: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'vi-VN';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (this.onResultCallback && currentTranscript) {
            this.onResultCallback(currentTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          let message = 'Không nhận diện được giọng nói. Bác có thể nhập chữ để tìm kiếm.';
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            message = 'Ứng dụng chưa được cấp quyền micro. Vui lòng cho phép micro trên trình duyệt.';
          } else if (event.error === 'no-speech') {
            message = 'Không nghe thấy giọng nói. Bác vui lòng thử lại gần micro hơn.';
          }
          if (this.onErrorCallback) {
            this.onErrorCallback(message);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onEndCallback) {
            this.onEndCallback();
          }
        };
      }
    }
  }

  public start(
    onResult: (transcript: string) => void,
    onError: (errorMsg: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Trình duyệt hiện tại chưa hỗ trợ nhận diện giọng nói. Bác vui lòng nhập bằng chữ.');
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      onError('Không thể bật micro lúc này. Bác có thể chọn địa điểm trong danh sách bên dưới.');
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { matchDestinationFromVoice, isVoiceRecognitionSupported } from '../utils/voiceRecognition';
import { isSpeechSynthesisSupported, speakText, stopSpeaking } from '../utils/speech';
import { getRecentDestinationIds, addRecentDestinationId, clearRecentDestinations } from '../utils/history';
import { HOSPITAL_108_DESTINATIONS } from '../data/hospital108';

describe('Voice Recognition & Matching Suite', () => {
  it('Khớp chính xác câu: "Tôi muốn đến khoa cấp cứu" -> cap_cuu', () => {
    const match = matchDestinationFromVoice('Tôi muốn đến khoa cấp cứu', HOSPITAL_108_DESTINATIONS);
    expect(match).toBeDefined();
    expect(match?.id).toBe('cap_cuu');
  });

  it('Khớp chính xác câu: "Mở khoa khám bệnh" -> c1_1_a', () => {
    const match = matchDestinationFromVoice('Mở khoa khám bệnh', HOSPITAL_108_DESTINATIONS);
    expect(match).toBeDefined();
    expect(match?.id).toBe('c1_1_a');
  });

  it('Khớp chính xác câu: "Tìm khu khám theo yêu cầu" -> c1_1_b', () => {
    const match = matchDestinationFromVoice('Tìm khu khám theo yêu cầu', HOSPITAL_108_DESTINATIONS);
    expect(match).toBeDefined();
    expect(match?.id).toBe('c1_1_b');
  });

  it('Khớp chính xác câu: "Đi đến khu đối ngoại quốc tế" -> kham_quoc_te', () => {
    const match = matchDestinationFromVoice('Đi đến khu đối ngoại quốc tế', HOSPITAL_108_DESTINATIONS);
    expect(match).toBeDefined();
    expect(match?.id).toBe('kham_quoc_te');
  });

  it('Khớp chính xác câu: "Mở bản đồ toàn bệnh viện" -> tong_quan', () => {
    const match = matchDestinationFromVoice('Mở bản đồ toàn bệnh viện', HOSPITAL_108_DESTINATIONS);
    expect(match).toBeDefined();
    expect(match?.id).toBe('tong_quan');
  });

  it('Khớp dạng phát âm C1 một A, C1.1-A, c1 1 a -> c1_1_a', () => {
    const m1 = matchDestinationFromVoice('C1 một A', HOSPITAL_108_DESTINATIONS);
    expect(m1?.id).toBe('c1_1_a');

    const m2 = matchDestinationFromVoice('c1 1 a', HOSPITAL_108_DESTINATIONS);
    expect(m2?.id).toBe('c1_1_a');

    const m3 = matchDestinationFromVoice('c1.1-a', HOSPITAL_108_DESTINATIONS);
    expect(m3?.id).toBe('c1_1_a');
  });

  it('Khớp dạng phát âm C1 một B, C1.1-B -> c1_1_b', () => {
    const m1 = matchDestinationFromVoice('C1 một B', HOSPITAL_108_DESTINATIONS);
    expect(m1?.id).toBe('c1_1_b');

    const m2 = matchDestinationFromVoice('c1 1 b', HOSPITAL_108_DESTINATIONS);
    expect(m2?.id).toBe('c1_1_b');
  });

  it('Khớp dạng phát âm C1 một C, C1.1-C -> c1_1_c', () => {
    const m1 = matchDestinationFromVoice('C1 một C', HOSPITAL_108_DESTINATIONS);
    expect(m1?.id).toBe('c1_1_c');
  });

  it('Trả về null nếu câu nói không liên quan', () => {
    const match = matchDestinationFromVoice('Hôm nay thời tiết đẹp quá', HOSPITAL_108_DESTINATIONS);
    expect(match).toBeNull();
  });
});

describe('Recent Destinations History Suite', () => {
  beforeEach(() => {
    clearRecentDestinations();
  });

  afterEach(() => {
    clearRecentDestinations();
  });

  it('Lưu ID điểm đến vào localStorage và lấy ra đúng thứ tự', () => {
    addRecentDestinationId('c1_1_a');
    addRecentDestinationId('cap_cuu');
    const recents = getRecentDestinationIds();
    expect(recents).toEqual(['cap_cuu', 'c1_1_a']);
  });

  it('Giới hạn tối đa 3 điểm đến gần nhất', () => {
    addRecentDestinationId('c1_1_a');
    addRecentDestinationId('c1_1_b');
    addRecentDestinationId('cap_cuu');
    addRecentDestinationId('kham_quoc_te');
    const recents = getRecentDestinationIds();
    expect(recents.length).toBe(3);
    expect(recents).toEqual(['kham_quoc_te', 'cap_cuu', 'c1_1_b']);
  });

  it('Đẩy ID đã xem lại lên đầu danh sách không trùng lặp', () => {
    addRecentDestinationId('c1_1_a');
    addRecentDestinationId('c1_1_b');
    addRecentDestinationId('c1_1_a');
    const recents = getRecentDestinationIds();
    expect(recents).toEqual(['c1_1_a', 'c1_1_b']);
  });

  it('Xóa lịch sử làm rỗng danh sách', () => {
    addRecentDestinationId('c1_1_a');
    clearRecentDestinations();
    const recents = getRecentDestinationIds();
    expect(recents).toEqual([]);
  });
});

describe('Text-To-Speech (TTS) Suite', () => {
  it('Không bị crash khi gọi stopSpeaking hoặc speakText trong môi trường không có speech synthesis', () => {
    expect(() => stopSpeaking()).not.toThrow();
    expect(() => speakText('Test')).not.toThrow();
  });
});

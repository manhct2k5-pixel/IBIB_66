// Quản lý lịch sử điểm đến đã xem gần đây (lưu tối đa 3 ID trong localStorage)

const STORAGE_KEY = 'mednav_108_recent_destinations';
const MAX_RECENT = 3;

// Memory fallback store cho môi trường test hoặc khi localStorage bị vô hiệu hóa
let memoryFallback: string[] = [];

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
  } catch {
    return false;
  }
}

export function getRecentDestinationIds(): string[] {
  if (!isLocalStorageAvailable()) {
    return [...memoryFallback].slice(0, MAX_RECENT);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => typeof item === 'string').slice(0, MAX_RECENT);
    }
  } catch {
    return [...memoryFallback].slice(0, MAX_RECENT);
  }
  return [];
}

export function addRecentDestinationId(id: string): void {
  if (!id) return;
  const current = getRecentDestinationIds();
  const updated = [id, ...current.filter(item => item !== id)].slice(0, MAX_RECENT);

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      memoryFallback = updated;
    }
  } else {
    memoryFallback = updated;
  }
}

export function clearRecentDestinations(): void {
  memoryFallback = [];
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Xử lý an toàn
    }
  }
}

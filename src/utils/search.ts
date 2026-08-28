import { normalizeVietnamese } from './stringUtils';

export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return normalizeVietnamese(text)
    .replace(/[-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesSearchQuery(query: string, targetStrings: string[]): boolean {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return true;
  
  // also check literal without spaces (e.g. c11 matching c1-1 or c1.1)
  const queryNoSpace = normQuery.replace(/\s+/g, '');

  return targetStrings.some(target => {
    if (!target) return false;
    const normTarget = normalizeSearchText(target);
    if (normTarget.includes(normQuery)) return true;
    const targetNoSpace = normTarget.replace(/\s+/g, '');
    if (targetNoSpace.includes(queryNoSpace)) return true;
    return false;
  });
}

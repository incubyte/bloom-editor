const STORAGE_KEY = "bloom:recent-actions";
const MAX_RECENT = 10;

let recentCache: string[] | null = null;

function readFromStorage(): string[] {
  if (recentCache !== null) return recentCache;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      recentCache = JSON.parse(stored);
      return recentCache!;
    }
  } catch {
    // localStorage unavailable
  }
  return [];
}

function writeToStorage(actions: string[]): void {
  recentCache = actions;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch {
    // localStorage unavailable
  }
}

export function getRecentActions(): string[] {
  return readFromStorage();
}

export function recordAction(id: string): void {
  const current = readFromStorage();
  const deduplicated = current.filter((item) => item !== id);
  const updated = [id, ...deduplicated].slice(0, MAX_RECENT);
  writeToStorage(updated);
}

export function clearRecentActions(): void {
  recentCache = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

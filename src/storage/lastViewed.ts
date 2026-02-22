let lastViewedId: string | null = null;

export function setLastViewed(id: string): void {
  lastViewedId = id;
  try {
    localStorage.setItem("bloom:lastViewedDocId", id);
  } catch {
    // localStorage unavailable (e.g., in test environment)
  }
}

export function getLastViewed(): string | null {
  if (lastViewedId !== null) return lastViewedId;
  try {
    return localStorage.getItem("bloom:lastViewedDocId");
  } catch {
    return null;
  }
}

export function clearLastViewed(): void {
  lastViewedId = null;
}

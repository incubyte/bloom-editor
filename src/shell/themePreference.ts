const STORAGE_KEY = "bloom:theme-preference";

type Theme = "light" | "dark";

let cachedPreference: Theme | null = null;

export function getThemePreference(): Theme | null {
  if (cachedPreference !== null) return cachedPreference;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      cachedPreference = stored;
      return cachedPreference;
    }
  } catch {
    // localStorage unavailable
  }
  return null;
}

export function setThemePreference(theme: Theme): void {
  cachedPreference = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

export function clearThemePreference(): void {
  cachedPreference = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

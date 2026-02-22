import { useState, useCallback, useEffect } from "react";
import { getThemePreference, setThemePreference } from "./themePreference";

type Theme = "light" | "dark";

export function getOSThemePreference(): Theme {
  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    // matchMedia unavailable
  }
  return "light";
}

function resolveInitialTheme(): Theme {
  return getThemePreference() ?? getOSThemePreference();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      setThemePreference(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

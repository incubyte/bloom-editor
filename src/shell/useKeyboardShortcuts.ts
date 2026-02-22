import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onTogglePalette: () => void;
  onNewDocument: () => void;
  onToggleSidebar: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (!isModifier) return;

      if (e.key === "k") {
        e.preventDefault();
        handlers.onTogglePalette();
        return;
      }
      if (e.key === "n") {
        e.preventDefault();
        handlers.onNewDocument();
        return;
      }
      if (e.key === "\\") {
        e.preventDefault();
        handlers.onToggleSidebar();
      }
    },
    [handlers],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

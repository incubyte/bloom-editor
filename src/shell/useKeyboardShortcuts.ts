import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onTogglePalette: () => void;
  onNewDocument: () => void;
  onToggleSidebar: () => void;
}

interface KeyboardShortcut {
  key: string;
  modifiers: {
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  };
  handler: () => void;
}

const additionalShortcuts: KeyboardShortcut[] = [];

export function registerKeyboardShortcut(shortcut: KeyboardShortcut) {
  additionalShortcuts.push(shortcut);
}

export function clearKeyboardShortcuts() {
  additionalShortcuts.length = 0;
}

function matchesModifiers(
  event: KeyboardEvent,
  modifiers: KeyboardShortcut["modifiers"],
): boolean {
  if (modifiers.metaKey && !event.metaKey) return false;
  if (modifiers.ctrlKey && !event.ctrlKey) return false;
  if (modifiers.shiftKey && !event.shiftKey) return false;
  if (modifiers.altKey && !event.altKey) return false;
  return true;
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
        return;
      }

      for (const shortcut of additionalShortcuts) {
        if (e.key === shortcut.key && matchesModifiers(e, shortcut.modifiers)) {
          e.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [handlers],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

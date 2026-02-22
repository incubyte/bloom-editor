import { describe, test, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  test("calls onTogglePalette when Mod+K is pressed", () => {
    const handlers = {
      onTogglePalette: vi.fn(),
      onNewDocument: vi.fn(),
      onToggleSidebar: vi.fn(),
    };

    renderHook(() => useKeyboardShortcuts(handlers));

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true }),
    );

    expect(handlers.onTogglePalette).toHaveBeenCalledOnce();
  });

  test("calls onNewDocument when Mod+N is pressed", () => {
    const handlers = {
      onTogglePalette: vi.fn(),
      onNewDocument: vi.fn(),
      onToggleSidebar: vi.fn(),
    };

    renderHook(() => useKeyboardShortcuts(handlers));

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "n", metaKey: true }),
    );

    expect(handlers.onNewDocument).toHaveBeenCalledOnce();
  });

  test("calls onToggleSidebar when Mod+\\ is pressed", () => {
    const handlers = {
      onTogglePalette: vi.fn(),
      onNewDocument: vi.fn(),
      onToggleSidebar: vi.fn(),
    };

    renderHook(() => useKeyboardShortcuts(handlers));

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "\\", metaKey: true }),
    );

    expect(handlers.onToggleSidebar).toHaveBeenCalledOnce();
  });
});

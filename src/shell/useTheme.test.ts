import { describe, test, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { getOSThemePreference, useTheme } from "./useTheme";
import {
  clearThemePreference,
  setThemePreference,
  getThemePreference,
} from "./themePreference";

describe("getOSThemePreference", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("returns dark when OS prefers dark mode", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
      })),
    );

    expect(getOSThemePreference()).toBe("dark");
  });

  test("returns light when OS prefers light mode", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
      })),
    );

    expect(getOSThemePreference()).toBe("light");
  });

  test("returns light when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(getOSThemePreference()).toBe("light");
  });
});

function mockMatchMedia(prefersDark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: prefersDark && query === "(prefers-color-scheme: dark)",
      media: query,
    })),
  );
}

describe("useTheme", () => {
  beforeEach(() => {
    clearThemePreference();
    vi.restoreAllMocks();
  });

  test("initializes with OS preference when no stored preference exists", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  test("stored preference takes priority over OS preference", () => {
    setThemePreference("light");
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  test("toggleTheme switches from light to dark and persists", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("dark");
    expect(getThemePreference()).toBe("dark");
  });

  test("toggleTheme switches from dark to light and persists", () => {
    setThemePreference("dark");
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("light");
    expect(getThemePreference()).toBe("light");
  });

  test("sets data-theme attribute on document element to match theme", () => {
    mockMatchMedia(true);
    renderHook(() => useTheme());
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  test("updates data-theme attribute when theme is toggled", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    act(() => result.current.toggleTheme());
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    act(() => result.current.toggleTheme());
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  test("toggling theme multiple times produces correct alternating sequence", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");

    const expected = ["dark", "light", "dark", "light"];
    for (const expectedTheme of expected) {
      act(() => result.current.toggleTheme());
      expect(result.current.theme).toBe(expectedTheme);
    }
  });
});

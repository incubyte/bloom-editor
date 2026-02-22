import { describe, test, expect, beforeEach, vi } from "vitest";
import {
  getThemePreference,
  setThemePreference,
  clearThemePreference,
} from "./themePreference";

describe("themePreference", () => {
  beforeEach(() => {
    clearThemePreference();
  });

  test("getThemePreference returns null when nothing is saved", () => {
    expect(getThemePreference()).toBeNull();
  });

  test("setThemePreference persists and getThemePreference retrieves it", () => {
    setThemePreference("dark");
    expect(getThemePreference()).toBe("dark");

    setThemePreference("light");
    expect(getThemePreference()).toBe("light");
  });

  test("getThemePreference returns null when localStorage contains invalid data", () => {
    const mockStorage: Record<string, string> = {
      "bloom:theme-preference": "garbage",
    };
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
    });

    expect(getThemePreference()).toBeNull();

    vi.unstubAllGlobals();
  });
});

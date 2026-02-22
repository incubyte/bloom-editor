import { renderHook, act } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useZenMode } from "./useZenMode";

describe("useZenMode", () => {
  test("toggles zen mode on and off", () => {
    const { result } = renderHook(() => useZenMode());

    expect(result.current.isZenMode).toBe(false);

    act(() => {
      result.current.toggleZenMode();
    });
    expect(result.current.isZenMode).toBe(true);

    act(() => {
      result.current.toggleZenMode();
    });
    expect(result.current.isZenMode).toBe(false);
  });
});

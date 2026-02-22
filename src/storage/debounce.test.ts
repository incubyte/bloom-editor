import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("calls the callback after the debounce delay", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 1500);

    debounced();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledOnce();
  });

  test("resets the timer when called again before delay expires", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 1500);

    debounced();
    vi.advanceTimersByTime(1000);

    debounced();
    vi.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledOnce();
  });
});

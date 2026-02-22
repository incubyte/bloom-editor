import { describe, test, expect, vi, afterEach } from "vitest";
import { formatRelativeTime } from "./relativeTime";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('formats a date from seconds ago as "just now"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-21T12:00:00.000Z"));

    const thirtySecondsAgo = new Date("2026-02-21T11:59:30.000Z");

    expect(formatRelativeTime(thirtySecondsAgo)).toBe("just now");
  });

  test('formats a date from minutes ago as "N min ago"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-21T12:00:00.000Z"));

    const fiveMinutesAgo = new Date("2026-02-21T11:55:00.000Z");

    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 min ago");
  });

  test('formats a date from yesterday as "Yesterday"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-21T12:00:00.000Z"));

    const twentyFiveHoursAgo = new Date("2026-02-20T11:00:00.000Z");

    expect(formatRelativeTime(twentyFiveHoursAgo)).toBe("Yesterday");
  });

  test("handles future dates without crashing", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-21T12:00:00.000Z"));

    const oneHourInFuture = new Date("2026-02-21T13:00:00.000Z");

    expect(() => formatRelativeTime(oneHourInFuture)).not.toThrow();
    const result = formatRelativeTime(oneHourInFuture);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

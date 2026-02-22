import { describe, test, expect, beforeEach } from "vitest";
import {
  recordAction,
  getRecentActions,
  clearRecentActions,
} from "./recentActions";

describe("recentActions", () => {
  beforeEach(() => {
    clearRecentActions();
  });

  test("getRecentActions returns empty array when nothing recorded", () => {
    expect(getRecentActions()).toEqual([]);
  });

  test("recordAction stores action ids and getRecentActions returns most recent first, deduplicated", () => {
    recordAction("bold");
    recordAction("italic");
    recordAction("bold");

    expect(getRecentActions()).toEqual(["bold", "italic"]);
  });

  test("getRecentActions caps at a maximum number of entries", () => {
    for (let i = 0; i < 20; i++) {
      recordAction(`action-${i}`);
    }

    const recent = getRecentActions();
    expect(recent.length).toBeLessThanOrEqual(10);
  });
});

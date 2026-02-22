import { describe, test, expect, beforeEach } from "vitest";
import { setLastViewed, getLastViewed, clearLastViewed } from "./lastViewed";

describe("lastViewed", () => {
  beforeEach(() => {
    clearLastViewed();
  });

  test("persists and retrieves the last viewed document ID", () => {
    setLastViewed("abc123");
    expect(getLastViewed()).toBe("abc123");
  });
});

import { describe, test, expect } from "vitest";
import { countWords } from "./wordCount";

describe("countWords", () => {
  test("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0);
  });

  test("returns 0 for whitespace only", () => {
    expect(countWords("   \n\t  ")).toBe(0);
  });

  test("counts words in a sentence", () => {
    expect(countWords("The quick brown fox")).toBe(4);
  });

  test("handles multiple whitespace between words", () => {
    expect(countWords("hello   world")).toBe(2);
  });
});

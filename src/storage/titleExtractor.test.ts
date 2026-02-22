import { describe, test, expect } from "vitest";
import { extractTitle } from "./titleExtractor";

describe("extractTitle", () => {
  test("extracts title from first H1 heading", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "My Great Post" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Some body text" }],
        },
      ],
    };

    expect(extractTitle(content)).toBe("My Great Post");
  });

  test("falls back to first line of text when no H1 exists", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Just some text" }],
        },
      ],
    };

    expect(extractTitle(content)).toBe("Just some text");
  });

  test("extracts title from H1 even when nested inside other nodes", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Nested Title" }],
            },
          ],
        },
      ],
    };

    expect(extractTitle(content)).toBe("Nested Title");
  });

  test("extracts plain text title from H1 with bold and italic marks", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [
            { type: "text", marks: [{ type: "bold" }], text: "My " },
            { type: "text", text: "Title" },
          ],
        },
      ],
    };

    expect(extractTitle(content)).toBe("My Title");
  });

  test("returns Untitled for empty document", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    };

    expect(extractTitle(content)).toBe("Untitled");
  });
});

import { describe, test, expect } from "vitest";
import { toMarkdown } from "./markdownConverter";

describe("toMarkdown", () => {
  test("converts a paragraph to plain text", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello world" }],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("Hello world");
  });

  test("converts headings to # syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Title" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Subtitle" }],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Section" }],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("# Title\n\n## Subtitle\n\n### Section");
  });

  test("converts bold text to double asterisks", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hello " },
            {
              type: "text",
              text: "bold",
              marks: [{ type: "bold" }],
            },
            { type: "text", text: " world" },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("Hello **bold** world");
  });

  test("converts italic text to single asterisks", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hello " },
            {
              type: "text",
              text: "italic",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: " world" },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("Hello *italic* world");
  });

  test("converts bullet lists to dash syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "First" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Second" }],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("- First\n- Second");
  });

  test("converts ordered lists to numbered syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "First" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Second" }],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("1. First\n2. Second");
  });

  test("converts code blocks to fenced syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "codeBlock",
          content: [{ type: "text", text: "const x = 1;" }],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("```\nconst x = 1;\n```");
  });

  test("converts inline code to backtick syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use " },
            {
              type: "text",
              text: "useState",
              marks: [{ type: "code" }],
            },
            { type: "text", text: " hook" },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("Use `useState` hook");
  });

  test("converts links to markdown link syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Visit " },
            {
              type: "text",
              text: "Google",
              marks: [
                { type: "link", attrs: { href: "https://google.com" } },
              ],
            },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("Visit [Google](https://google.com)");
  });

  test("converts blockquotes to > syntax", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "To be or not to be" }],
            },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("> To be or not to be");
  });

  test("converts empty document to empty string", () => {
    const doc = { type: "doc", content: [] };
    expect(toMarkdown(doc)).toBe("");
  });

  test("handles nested lists in Markdown conversion", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Parent" }],
                },
                {
                  type: "bulletList",
                  content: [
                    {
                      type: "listItem",
                      content: [
                        {
                          type: "paragraph",
                          content: [{ type: "text", text: "Child" }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("- Parent\n  - Child");
  });

  test("handles combined marks like bold-italic", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "emphasis",
              marks: [{ type: "bold" }, { type: "italic" }],
            },
          ],
        },
      ],
    };

    expect(toMarkdown(doc)).toBe("***emphasis***");
  });
});

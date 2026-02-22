import { describe, test, expect, vi, beforeEach } from "vitest";
import { exportToFile, copyAsMarkdown, deriveFilename } from "./exportService";

vi.mock("@tauri-apps/plugin-dialog", () => ({
  save: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeTextFile: vi.fn(),
}));

import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

describe("exportToFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("opens save dialog with filename derived from document title", async () => {
    vi.mocked(save).mockResolvedValue(null);

    const tiptapJson = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello" }],
        },
      ],
    };

    await exportToFile("My Blog Post", tiptapJson, "<p>Hello</p>");

    expect(save).toHaveBeenCalledOnce();
    const callArgs = vi.mocked(save).mock.calls[0][0];
    expect(callArgs?.defaultPath).toContain("My-Blog-Post");
    expect(callArgs?.filters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Markdown", extensions: ["md"] }),
        expect.objectContaining({ name: "HTML", extensions: ["html"] }),
      ]),
    );
  });

  test("writes Markdown content when user picks .md extension", async () => {
    vi.mocked(save).mockResolvedValue("/path/to/My-Post.md");

    const tiptapJson = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello world" }],
        },
      ],
    };

    await exportToFile("My Post", tiptapJson, "<p>Hello world</p>");

    expect(writeTextFile).toHaveBeenCalledOnce();
    const [path, content] = vi.mocked(writeTextFile).mock.calls[0];
    expect(path).toBe("/path/to/My-Post.md");
    expect(content).toBe("Hello world");
  });

  test("writes cleaned HTML when user picks .html extension", async () => {
    vi.mocked(save).mockResolvedValue("/path/to/My-Post.html");

    const tiptapJson = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello" }],
        },
      ],
    };

    await exportToFile(
      "My Post",
      tiptapJson,
      '<p data-pm-slice="1 1 []">Hello</p>',
    );

    expect(writeTextFile).toHaveBeenCalledOnce();
    const [path, content] = vi.mocked(writeTextFile).mock.calls[0];
    expect(path).toBe("/path/to/My-Post.html");
    expect(content).toBe("<p>Hello</p>");
  });

  test("does nothing when user cancels the save dialog", async () => {
    vi.mocked(save).mockResolvedValue(null);

    const tiptapJson = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello" }],
        },
      ],
    };

    const result = await exportToFile("My Post", tiptapJson, "<p>Hello</p>");

    expect(writeTextFile).not.toHaveBeenCalled();
    expect(result).toBe("cancelled");
  });

  test("returns exported when file is written successfully", async () => {
    vi.mocked(save).mockResolvedValue("/path/to/file.md");

    const tiptapJson = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello" }],
        },
      ],
    };

    const result = await exportToFile("Post", tiptapJson, "<p>Hello</p>");

    expect(result).toBe("exported");
  });
});

describe("copyAsMarkdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  test("copies markdown text to clipboard", async () => {
    const tiptapJson = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "My Post" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello world" }],
        },
      ],
    };

    await copyAsMarkdown(tiptapJson);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "# My Post\n\nHello world",
    );
  });
});

describe("deriveFilename", () => {
  test("derives safe filename from title with special characters", () => {
    expect(deriveFilename("My Post: A Journey! (Part 1)")).toBe(
      "My-Post-A-Journey-Part-1",
    );
  });

  test("derives filename Untitled when title is empty", () => {
    expect(deriveFilename("")).toBe("Untitled");
  });
});

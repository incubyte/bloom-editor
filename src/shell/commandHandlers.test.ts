import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  registerCoreHandlers,
  registerCommandHandler,
  getCommandHandler,
  clearHandlers,
} from "./commandHandlers";
import type { CommandHandler } from "./commandHandlers";

describe("commandHandlers", () => {
  beforeEach(() => {
    clearHandlers();
  });

  test("registerCoreHandlers registers all expected command handlers", () => {
    registerCoreHandlers();

    const expectedIds = [
      "bold",
      "italic",
      "heading-1",
      "heading-2",
      "heading-3",
      "bullet-list",
      "ordered-list",
      "code-block",
      "inline-code",
      "blockquote",
      "undo",
      "redo",
      "new-document",
      "toggle-sidebar",
      "toggle-zen-mode",
      "toggle-dark-mode",
      "export-file",
      "copy-markdown",
    ];

    for (const id of expectedIds) {
      expect(getCommandHandler(id)).toBeDefined();
    }
  });

  test("getCommandHandler returns undefined for unknown command", () => {
    registerCoreHandlers();

    expect(getCommandHandler("nonexistent-command")).toBeUndefined();
  });

  test("registerCommandHandler allows adding custom handlers", () => {
    const customHandler: CommandHandler = () => {};
    registerCommandHandler("my-custom-command", customHandler);

    expect(getCommandHandler("my-custom-command")).toBe(customHandler);
  });

  test("core handler for bold calls editor.chain().focus().toggleBold().run()", () => {
    registerCoreHandlers();

    const run = vi.fn();
    const toggleBold = vi.fn(() => ({ run }));
    const focus = vi.fn(() => ({ toggleBold }));
    const chain = vi.fn(() => ({ focus }));
    const editor = { chain } as unknown as import("@tiptap/react").Editor;

    const ctx = {
      editor,
      toggleZenMode: vi.fn(),
      toggleTheme: vi.fn(),
      createNewDocument: vi.fn(),
      toggleCollapse: vi.fn(),
      selectDocument: vi.fn(),
      showMessage: vi.fn(),
      activeTitle: "Test",
    };

    const handler = getCommandHandler("bold");
    handler!(ctx);

    expect(chain).toHaveBeenCalled();
    expect(focus).toHaveBeenCalled();
    expect(toggleBold).toHaveBeenCalled();
    expect(run).toHaveBeenCalled();
  });
});

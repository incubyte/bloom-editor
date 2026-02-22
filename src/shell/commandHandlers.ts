import type { Editor } from "@tiptap/react";
import { exportToFile, copyAsMarkdown } from "../editor/exportService";

export interface CommandContext {
  editor: Editor | null;
  toggleZenMode: () => void;
  toggleTheme: () => void;
  createNewDocument: () => void;
  toggleCollapse: () => void;
  selectDocument: (id: string) => void;
  showMessage: (message: string) => void;
  activeTitle: string;
}

export type CommandHandler = (ctx: CommandContext) => void | Promise<void>;

const handlers = new Map<string, CommandHandler>();

export function registerCommandHandler(id: string, handler: CommandHandler) {
  handlers.set(id, handler);
}

export function getCommandHandler(id: string): CommandHandler | undefined {
  return handlers.get(id);
}

export function clearHandlers() {
  handlers.clear();
}

export function registerCoreHandlers() {
  registerCommandHandler("bold", (ctx) => {
    ctx.editor?.chain().focus().toggleBold().run();
  });

  registerCommandHandler("italic", (ctx) => {
    ctx.editor?.chain().focus().toggleItalic().run();
  });

  registerCommandHandler("heading-1", (ctx) => {
    ctx.editor?.chain().focus().toggleHeading({ level: 1 }).run();
  });

  registerCommandHandler("heading-2", (ctx) => {
    ctx.editor?.chain().focus().toggleHeading({ level: 2 }).run();
  });

  registerCommandHandler("heading-3", (ctx) => {
    ctx.editor?.chain().focus().toggleHeading({ level: 3 }).run();
  });

  registerCommandHandler("bullet-list", (ctx) => {
    ctx.editor?.chain().focus().toggleBulletList().run();
  });

  registerCommandHandler("ordered-list", (ctx) => {
    ctx.editor?.chain().focus().toggleOrderedList().run();
  });

  registerCommandHandler("code-block", (ctx) => {
    ctx.editor?.chain().focus().toggleCodeBlock().run();
  });

  registerCommandHandler("inline-code", (ctx) => {
    ctx.editor?.chain().focus().toggleCode().run();
  });

  registerCommandHandler("blockquote", (ctx) => {
    ctx.editor?.chain().focus().toggleBlockquote().run();
  });

  registerCommandHandler("undo", (ctx) => {
    ctx.editor?.chain().focus().undo().run();
  });

  registerCommandHandler("redo", (ctx) => {
    ctx.editor?.chain().focus().redo().run();
  });

  registerCommandHandler("new-document", (ctx) => {
    ctx.createNewDocument();
  });

  registerCommandHandler("toggle-sidebar", (ctx) => {
    ctx.toggleCollapse();
  });

  registerCommandHandler("toggle-zen-mode", (ctx) => {
    ctx.toggleZenMode();
  });

  registerCommandHandler("toggle-dark-mode", (ctx) => {
    ctx.toggleTheme();
  });

  registerCommandHandler("export-file", async (ctx) => {
    if (ctx.editor) {
      const json = ctx.editor.getJSON();
      const html = ctx.editor.getHTML();
      const result = await exportToFile(ctx.activeTitle, json, html);
      if (result === "exported") ctx.showMessage("Exported!");
    }
  });

  registerCommandHandler("copy-markdown", async (ctx) => {
    if (ctx.editor) {
      await copyAsMarkdown(ctx.editor.getJSON());
      ctx.showMessage("Copied to clipboard!");
    }
  });
}

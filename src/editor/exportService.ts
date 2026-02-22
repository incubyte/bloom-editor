import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toMarkdown } from "./markdownConverter";
import { cleanHtml } from "./htmlExporter";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export type ExportResult = "exported" | "cancelled";

export function deriveFilename(title: string): string {
  const sanitized = title
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return sanitized || "Untitled";
}

export async function exportToFile(
  title: string,
  content: TiptapNode,
  rawHtml: string,
): Promise<ExportResult> {
  const filename = deriveFilename(title);

  const filePath = await save({
    defaultPath: filename,
    filters: [
      { name: "Markdown", extensions: ["md"] },
      { name: "HTML", extensions: ["html"] },
    ],
  });

  if (!filePath) return "cancelled";

  const output = filePath.endsWith(".html")
    ? cleanHtml(rawHtml)
    : toMarkdown(content);

  await writeTextFile(filePath, output);
  return "exported";
}

export async function copyAsMarkdown(content: TiptapNode): Promise<void> {
  const markdown = toMarkdown(content);
  await navigator.clipboard.writeText(markdown);
}

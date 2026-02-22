import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toMarkdown } from "./markdownConverter";
import { getExportFormats } from "./exportFormats";

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

function findFormatByPath(filePath: string) {
  const formats = getExportFormats();
  return formats.find((f) => filePath.endsWith(`.${f.extension}`));
}

export async function exportToFile(
  title: string,
  content: TiptapNode,
  rawHtml: string,
): Promise<ExportResult> {
  const filename = deriveFilename(title);
  const formats = getExportFormats();

  const filters = formats.map((f) => ({
    name: f.name,
    extensions: [f.extension],
  }));

  const filePath = await save({ defaultPath: filename, filters });

  if (!filePath) return "cancelled";

  const format = findFormatByPath(filePath);
  const markdownFormat = formats.find((f) => f.extension === "md");
  const converter = format ?? markdownFormat ?? formats[0];
  const output = await converter.convert(content, rawHtml);

  await writeTextFile(filePath, output);
  return "exported";
}

export async function copyAsMarkdown(content: TiptapNode): Promise<void> {
  const markdown = toMarkdown(content);
  await navigator.clipboard.writeText(markdown);
}

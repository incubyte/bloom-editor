import { toMarkdown } from "./markdownConverter";
import { cleanHtml } from "./htmlExporter";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export interface ExportFormat {
  name: string;
  extension: string;
  convert: (content: TiptapNode, rawHtml: string) => string | Promise<string>;
}

const formats: ExportFormat[] = [
  {
    name: "Markdown",
    extension: "md",
    convert: (content) => toMarkdown(content),
  },
  {
    name: "HTML",
    extension: "html",
    convert: (_content, rawHtml) => cleanHtml(rawHtml),
  },
];

export function registerExportFormat(format: ExportFormat) {
  formats.push(format);
}

export function getExportFormats(): ExportFormat[] {
  return [...formats];
}

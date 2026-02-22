interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
}

export function extractTitle(content: TiptapNode): string {
  if (!content.content) return "Untitled";

  for (const node of content.content) {
    if (node.type === "heading" && node.attrs?.level === 1) {
      return collectText(node);
    }
  }

  for (const node of content.content) {
    const text = collectText(node).trim();
    if (text) return text;
  }

  return "Untitled";
}

function collectText(node: TiptapNode): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(collectText).join("");
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export function toMarkdown(doc: TiptapNode): string {
  if (!doc.content) return "";
  return doc.content.map((node) => convertNode(node, 0)).join("\n\n");
}

function convertNode(node: TiptapNode, indent: number): string {
  switch (node.type) {
    case "paragraph":
      return renderInlineContent(node);
    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      const prefix = "#".repeat(level);
      return `${prefix} ${renderInlineContent(node)}`;
    }
    case "bulletList":
      return renderList(node, indent, "-");
    case "orderedList":
      return renderList(node, indent, "1.");
    case "codeBlock": {
      const code = node.content?.map((c) => c.text ?? "").join("") ?? "";
      return `\`\`\`\n${code}\n\`\`\``;
    }
    case "blockquote": {
      if (!node.content) return "";
      return node.content
        .map((child) => `> ${convertNode(child, indent)}`)
        .join("\n");
    }
    default:
      return "";
  }
}

function renderList(
  node: TiptapNode,
  indent: number,
  marker: string,
): string {
  if (!node.content) return "";
  return node.content
    .map((item, index) => {
      const prefix =
        marker === "-" ? "- " : `${index + 1}. `;
      const padding = "  ".repeat(indent);
      return renderListItem(item, indent, `${padding}${prefix}`);
    })
    .join("\n");
}

function renderListItem(
  node: TiptapNode,
  indent: number,
  prefix: string,
): string {
  if (!node.content) return prefix;
  return node.content
    .map((child, index) => {
      if (index === 0 && child.type === "paragraph") {
        return `${prefix}${renderInlineContent(child)}`;
      }
      return convertNode(child, indent + 1);
    })
    .join("\n");
}

function renderInlineContent(node: TiptapNode): string {
  if (!node.content) return "";
  return node.content.map(renderInline).join("");
}

function renderInline(node: TiptapNode): string {
  if (node.type === "text") return applyMarks(node.text ?? "", node.marks);
  return "";
}

function applyMarks(
  text: string,
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>,
): string {
  if (!marks) return text;
  let result = text;
  for (const mark of marks) {
    result = wrapWithMark(result, mark);
  }
  return result;
}

function wrapWithMark(
  text: string,
  mark: { type: string; attrs?: Record<string, unknown> },
): string {
  switch (mark.type) {
    case "bold":
      return `**${text}**`;
    case "italic":
      return `*${text}*`;
    case "code":
      return `\`${text}\``;
    case "link": {
      const href = (mark.attrs?.href as string) ?? "";
      return `[${text}](${href})`;
    }
    default:
      return text;
  }
}

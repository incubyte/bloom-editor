export interface BloomDocument {
  content: Record<string, unknown>;
  title: string;
  subtitle: string;
  createdAt: string;
  modifiedAt: string;
  tags: string[];
  status: "draft" | "published";
  [key: string]: unknown;
}

export function serializeDocument(doc: BloomDocument): string {
  return JSON.stringify(doc);
}

export function deserializeDocument(json: string): BloomDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse bloom file: ${message}`);
  }

  const doc = parsed as Record<string, unknown>;
  return {
    content: (doc.content as Record<string, unknown>) ?? { type: "doc", content: [] },
    title: typeof doc.title === "string" ? doc.title : "Untitled",
    subtitle: typeof doc.subtitle === "string" ? doc.subtitle : "",
    createdAt: typeof doc.createdAt === "string" ? doc.createdAt : new Date().toISOString(),
    modifiedAt: typeof doc.modifiedAt === "string" ? doc.modifiedAt : new Date().toISOString(),
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    status: doc.status === "published" ? "published" : "draft",
    ...doc,
  } as BloomDocument;
}

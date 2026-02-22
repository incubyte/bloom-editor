import type { SidebarDocument } from "./documentSort";

export function filterByTag(
  docs: SidebarDocument[],
  tag: string | null | undefined,
): SidebarDocument[] {
  if (!tag) return docs;
  return docs.filter((doc) => doc.tags.includes(tag));
}

export function searchByTitle(
  docs: SidebarDocument[],
  query: string,
): SidebarDocument[] {
  if (!query.trim()) return docs;
  const lowerQuery = query.toLowerCase();
  return docs.filter((doc) => doc.title.toLowerCase().includes(lowerQuery));
}

export function collectTags(docs: SidebarDocument[]): string[] {
  const tagSet = new Set<string>();
  for (const doc of docs) {
    for (const tag of doc.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}

export interface SidebarDocument {
  id: string;
  title: string;
  modifiedAt: string;
  tags: string[];
}

export function sortByModified(docs: SidebarDocument[]): SidebarDocument[] {
  return [...docs].sort(
    (a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
  );
}

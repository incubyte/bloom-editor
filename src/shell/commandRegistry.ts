export type CommandCategory =
  | "formatting"
  | "document"
  | "navigation"
  | "view";

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category: CommandCategory;
}

const COMMANDS: Command[] = [
  // Formatting
  { id: "bold", label: "Bold", shortcut: "Mod+B", category: "formatting" },
  { id: "italic", label: "Italic", shortcut: "Mod+I", category: "formatting" },
  {
    id: "heading-1",
    label: "Heading 1",
    shortcut: "Mod+Alt+1",
    category: "formatting",
  },
  {
    id: "heading-2",
    label: "Heading 2",
    shortcut: "Mod+Alt+2",
    category: "formatting",
  },
  {
    id: "heading-3",
    label: "Heading 3",
    shortcut: "Mod+Alt+3",
    category: "formatting",
  },
  {
    id: "bullet-list",
    label: "Bullet List",
    shortcut: "Mod+Shift+8",
    category: "formatting",
  },
  {
    id: "ordered-list",
    label: "Ordered List",
    shortcut: "Mod+Shift+7",
    category: "formatting",
  },
  {
    id: "code-block",
    label: "Code Block",
    shortcut: "Mod+Alt+C",
    category: "formatting",
  },
  {
    id: "inline-code",
    label: "Inline Code",
    shortcut: "Mod+E",
    category: "formatting",
  },
  {
    id: "blockquote",
    label: "Blockquote",
    shortcut: "Mod+Shift+B",
    category: "formatting",
  },
  { id: "link", label: "Link", shortcut: "Mod+K", category: "formatting" },
  { id: "undo", label: "Undo", shortcut: "Mod+Z", category: "formatting" },
  {
    id: "redo",
    label: "Redo",
    shortcut: "Mod+Shift+Z",
    category: "formatting",
  },

  // Document
  {
    id: "new-document",
    label: "New Document",
    shortcut: "Mod+N",
    category: "document",
  },

  // Navigation
  {
    id: "toggle-sidebar",
    label: "Toggle Sidebar",
    shortcut: "Mod+\\",
    category: "navigation",
  },

  // View
  {
    id: "toggle-zen-mode",
    label: "Toggle Zen Mode",
    category: "view",
  },
  {
    id: "toggle-dark-mode",
    label: "Toggle Dark/Light Mode",
    category: "view",
  },
  {
    id: "export-file",
    label: "Export to file...",
    shortcut: "Mod+Shift+E",
    category: "document",
  },
  {
    id: "copy-markdown",
    label: "Copy as Markdown",
    shortcut: "Mod+Shift+C",
    category: "document",
  },
];

export function getAllCommands(): Command[] {
  return [...COMMANDS];
}

export function filterCommands(commands: Command[], query: string): Command[] {
  if (!query) return commands;
  const lowerQuery = query.toLowerCase();
  return commands.filter((cmd) => cmd.label.toLowerCase().includes(lowerQuery));
}

interface DocumentEntry {
  id: string;
  title: string;
}

export function mergeDocumentCommands(
  commands: Command[],
  documents: DocumentEntry[],
): Command[] {
  const documentCommands: Command[] = documents.map((doc) => ({
    id: `open-doc:${doc.id}`,
    label: doc.title,
    category: "document" as const,
  }));
  return [...commands, ...documentCommands];
}

export function formatShortcut(
  shortcut: string,
  platform: "mac" | "other" = "mac",
): string {
  const modifier = platform === "mac" ? "\u2318" : "Ctrl";
  return shortcut
    .replace(/Mod/g, modifier)
    .replace(/Alt/g, platform === "mac" ? "\u2325" : "Alt")
    .replace(/Shift/g, platform === "mac" ? "\u21E7" : "Shift");
}

export function sortByRecency(
  commands: Command[],
  recentIds: string[],
): Command[] {
  const recentSet = new Set(recentIds);
  const recent = recentIds
    .map((id) => commands.find((cmd) => cmd.id === id))
    .filter((cmd): cmd is Command => cmd !== undefined);
  const rest = commands.filter((cmd) => !recentSet.has(cmd.id));
  return [...recent, ...rest];
}

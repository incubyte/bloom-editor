import { describe, test, expect } from "vitest";
import {
  getAllCommands,
  filterCommands,
  mergeDocumentCommands,
  sortByRecency,
  formatShortcut,
} from "./commandRegistry";
import type { Command } from "./commandRegistry";

describe("commandRegistry", () => {
  test("getAllCommands returns all registered commands with required fields", () => {
    const commands = getAllCommands();

    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);

    for (const cmd of commands) {
      expect(typeof cmd.id).toBe("string");
      expect(typeof cmd.label).toBe("string");
      expect(typeof cmd.category).toBe("string");
    }

    const ids = commands.map((c) => c.id);
    expect(ids).toContain("new-document");
    expect(ids).toContain("toggle-sidebar");
    expect(ids).toContain("toggle-zen-mode");
    expect(ids).toContain("bold");
    expect(ids).toContain("italic");

    const commandsWithShortcuts = commands.filter((c) => c.shortcut);
    expect(commandsWithShortcuts.length).toBeGreaterThan(0);
    for (const cmd of commandsWithShortcuts) {
      expect(typeof cmd.shortcut).toBe("string");
    }
  });

  test("filterCommands returns commands matching the query case-insensitively", () => {
    const commands = getAllCommands();

    const headingResults = filterCommands(commands, "head");
    const headingIds = headingResults.map((c) => c.id);
    expect(headingIds).toContain("heading-1");
    expect(headingIds).toContain("heading-2");
    expect(headingIds).toContain("heading-3");
    expect(headingResults).toHaveLength(3);

    const allResults = filterCommands(commands, "");
    expect(allResults).toHaveLength(commands.length);
  });

  test("mergeDocumentCommands adds document titles as openable commands", () => {
    const baseCommands = getAllCommands();
    const documents = [
      { id: "abc", title: "My Post" },
      { id: "def", title: "Draft Ideas" },
    ];

    const merged = mergeDocumentCommands(baseCommands, documents);

    expect(merged).toHaveLength(baseCommands.length + 2);

    const myPost = merged.find((c) => c.label === "My Post");
    expect(myPost).toBeDefined();
    expect(myPost!.id).toBe("open-doc:abc");
    expect(myPost!.category).toBe("document");
    expect(myPost!.shortcut).toBeUndefined();

    const draftIdeas = merged.find((c) => c.label === "Draft Ideas");
    expect(draftIdeas).toBeDefined();
    expect(draftIdeas!.id).toBe("open-doc:def");
    expect(draftIdeas!.category).toBe("document");
  });

  test("sortByRecency places recent commands at the top in recency order", () => {
    const commands: Command[] = [
      { id: "a", label: "A", category: "formatting" },
      { id: "b", label: "B", category: "formatting" },
      { id: "c", label: "C", category: "formatting" },
      { id: "d", label: "D", category: "formatting" },
      { id: "e", label: "E", category: "formatting" },
    ];

    const sorted = sortByRecency(commands, ["c", "a"]);
    const sortedIds = sorted.map((c) => c.id);

    expect(sortedIds[0]).toBe("c");
    expect(sortedIds[1]).toBe("a");
    expect(sortedIds.slice(2)).toEqual(["b", "d", "e"]);
  });

  test("formatShortcut converts Mod to Cmd on macOS", () => {
    const result = formatShortcut("Mod+B", "mac");
    expect(result).toContain("B");
    expect(result).not.toContain("Mod");
    expect(result).not.toContain("Ctrl");
  });

  test("formatShortcut converts Mod to Ctrl on non-macOS", () => {
    const result = formatShortcut("Mod+B", "other");
    expect(result).toContain("Ctrl");
    expect(result).toContain("B");
    expect(result).not.toContain("Mod");
  });

  test("filterCommands handles special regex characters in query safely", () => {
    const commands = getAllCommands();
    expect(() => filterCommands(commands, "(bold")).not.toThrow();
    const result = filterCommands(commands, "(bold");
    expect(result).toEqual([]);
  });

  test("includes export-file and copy-markdown commands", () => {
    const commands = getAllCommands();
    const ids = commands.map((c) => c.id);
    expect(ids).toContain("export-file");
    expect(ids).toContain("copy-markdown");

    const exportFile = commands.find((c) => c.id === "export-file");
    expect(exportFile?.category).toBe("document");
    expect(exportFile?.shortcut).toBeDefined();

    const copyMarkdown = commands.find((c) => c.id === "copy-markdown");
    expect(copyMarkdown?.category).toBe("document");
    expect(copyMarkdown?.shortcut).toBeDefined();
  });
});

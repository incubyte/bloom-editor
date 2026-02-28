import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  saveDocument,
  loadDocument,
  listDocuments,
  deleteDocument,
} from "./storageService";
import type { BloomDocument } from "./bloomFile";

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeTextFile: vi.fn(),
  readTextFile: vi.fn(),
  readDir: vi.fn(),
  remove: vi.fn(),
  mkdir: vi.fn(),
  exists: vi.fn(),
}));

vi.mock("@tauri-apps/api/path", () => ({
  documentDir: vi.fn(() => Promise.resolve("/mock/documents")),
  join: vi.fn((...paths: string[]) => Promise.resolve(paths.join("/"))),
}));

import {
  writeTextFile,
  readTextFile,
  readDir,
  remove,
  exists,
} from "@tauri-apps/plugin-fs";

describe("storageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exists).mockResolvedValue(true);
  });

  test("saves a document as a .bloom file", async () => {
    const doc: BloomDocument = {
      content: { type: "doc", content: [] },
      title: "My Post",
      subtitle: "",
      createdAt: "2026-02-21T00:00:00.000Z",
      modifiedAt: "2026-02-21T01:00:00.000Z",
      tags: ["draft"],
      status: "draft",
    };

    await saveDocument("abc123", doc);

    expect(writeTextFile).toHaveBeenCalledOnce();
    const [path, contents] = vi.mocked(writeTextFile).mock.calls[0];
    expect(path).toContain("abc123.bloom");
    const parsed = JSON.parse(contents);
    expect(parsed.title).toBe("My Post");
  });

  test("loads a document from a .bloom file", async () => {
    const storedDoc = {
      content: { type: "doc", content: [] },
      title: "Loaded Post",
      createdAt: "2026-02-21T00:00:00.000Z",
      modifiedAt: "2026-02-21T01:00:00.000Z",
      tags: ["tech"],
      status: "draft",
    };

    vi.mocked(readTextFile).mockResolvedValue(JSON.stringify(storedDoc));

    const doc = await loadDocument("/mock/documents/Bloom/abc123.bloom");

    expect(doc.title).toBe("Loaded Post");
    expect(doc.tags).toEqual(["tech"]);
  });

  test("lists all .bloom files in the storage directory", async () => {
    vi.mocked(readDir).mockResolvedValue([
      { name: "abc123.bloom", isDirectory: false, isFile: true, isSymlink: false },
      { name: "def456.bloom", isDirectory: false, isFile: true, isSymlink: false },
      { name: "notes.txt", isDirectory: false, isFile: true, isSymlink: false },
    ]);

    const docs = await listDocuments();

    expect(docs).toHaveLength(2);
    expect(docs[0].id).toBe("abc123");
    expect(docs[0].fileName).toBe("abc123.bloom");
    expect(docs[1].id).toBe("def456");
  });

  test("deletes a document file from storage", async () => {
    await deleteDocument("abc123");

    expect(remove).toHaveBeenCalledOnce();
    const [path] = vi.mocked(remove).mock.calls[0];
    expect(path).toContain("abc123.bloom");
  });
});

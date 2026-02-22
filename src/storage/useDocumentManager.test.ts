import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDocumentManager } from "./useDocumentManager";
import { listDocuments, loadDocument } from "./storageService";
import { getLastViewed } from "./lastViewed";

vi.mock("./storageService", () => ({
  saveDocument: vi.fn().mockResolvedValue(undefined),
  loadDocument: vi.fn().mockResolvedValue({
    content: { type: "doc", content: [] },
    title: "Test Doc",
    createdAt: "2026-01-01T00:00:00.000Z",
    modifiedAt: "2026-01-01T00:00:00.000Z",
    tags: [],
    status: "draft",
  }),
  listDocuments: vi.fn().mockResolvedValue([]),
  deleteDocument: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./lastViewed", () => ({
  getLastViewed: vi.fn().mockReturnValue(null),
  setLastViewed: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useDocumentManager", () => {
  describe("contentVersion", () => {
    test("increments on each handleEditorUpdate call", async () => {
      const { result } = renderHook(() => useDocumentManager());

      await act(async () => {});

      const initialVersion = result.current.contentVersion;

      act(() => {
        result.current.handleEditorUpdate({ type: "doc", content: [] });
      });
      const versionAfterFirst = result.current.contentVersion;

      act(() => {
        result.current.handleEditorUpdate({ type: "doc", content: [] });
      });
      const versionAfterSecond = result.current.contentVersion;

      expect(versionAfterFirst).toBe(initialVersion + 1);
      expect(versionAfterSecond).toBe(initialVersion + 2);
    });
  });

  describe("init behavior", () => {
    test("creates a new document when list is empty and no lastViewed", async () => {
      vi.mocked(listDocuments).mockResolvedValue([]);
      vi.mocked(getLastViewed).mockReturnValue(null);

      const { result } = renderHook(() => useDocumentManager());

      await act(async () => {});

      expect(result.current.activeDocumentId).not.toBeNull();
    });

    test("opens first document when lastViewed is not in the list", async () => {
      vi.mocked(listDocuments).mockResolvedValue([
        { id: "doc-1", fileName: "doc-1.bloom", path: "/mock/doc-1.bloom" },
        { id: "doc-2", fileName: "doc-2.bloom", path: "/mock/doc-2.bloom" },
      ]);
      vi.mocked(loadDocument).mockResolvedValue({
        content: { type: "doc", content: [] },
        title: "First Doc",
        createdAt: "2026-01-01T00:00:00.000Z",
        modifiedAt: "2026-01-01T00:00:00.000Z",
        tags: [],
        status: "draft",
      });
      vi.mocked(getLastViewed).mockReturnValue("nonexistent-id");

      const { result } = renderHook(() => useDocumentManager());

      await act(async () => {});

      expect(result.current.activeDocumentId).toBe("doc-1");
    });

    test("opens last-viewed document when it exists in the list", async () => {
      vi.mocked(listDocuments).mockResolvedValue([
        { id: "doc-1", fileName: "doc-1.bloom", path: "/mock/doc-1.bloom" },
        { id: "doc-2", fileName: "doc-2.bloom", path: "/mock/doc-2.bloom" },
      ]);
      vi.mocked(loadDocument).mockResolvedValue({
        content: { type: "doc", content: [] },
        title: "Second Doc",
        createdAt: "2026-01-01T00:00:00.000Z",
        modifiedAt: "2026-01-01T00:00:00.000Z",
        tags: [],
        status: "draft",
      });
      vi.mocked(getLastViewed).mockReturnValue("doc-2");

      const { result } = renderHook(() => useDocumentManager());

      await act(async () => {});

      expect(result.current.activeDocumentId).toBe("doc-2");
    });
  });

  describe("saveStatus", () => {
    test("transitions from saved to unsaved on editor update", async () => {
      const { result } = renderHook(() => useDocumentManager());

      await act(async () => {});

      expect(result.current.saveStatus).toBe("saved");

      act(() => {
        result.current.handleEditorUpdate({ type: "doc", content: [] });
      });

      expect(result.current.saveStatus).toBe("unsaved");
    });

    test("remains observable across consecutive editor updates", async () => {
      const { result } = renderHook(() => useDocumentManager());

      await act(async () => {});

      act(() => {
        result.current.handleEditorUpdate({ type: "doc", content: [] });
      });
      expect(result.current.saveStatus).toBe("unsaved");

      const versionBefore = result.current.contentVersion;

      act(() => {
        result.current.handleEditorUpdate({ type: "doc", content: [] });
      });

      expect(result.current.contentVersion).toBeGreaterThan(versionBefore);
      expect(result.current.saveStatus).toBe("unsaved");
    });
  });
});

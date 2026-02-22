import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { debounce } from "./debounce";
import {
  saveDocument,
  loadDocument,
  listDocuments,
  deleteDocument,
} from "./storageService";
import { extractTitle } from "./titleExtractor";
import { getLastViewed, setLastViewed } from "./lastViewed";
import { sortByModified } from "./documentSort";
import { filterByTag, searchByTitle, collectTags } from "./documentFilter";
import { formatRelativeTime } from "./relativeTime";
import type { BloomDocument } from "./bloomFile";
import type { SidebarDocument } from "./documentSort";

const AUTO_SAVE_DELAY_MS = 1500;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface ProcessedSidebarItem {
  id: string;
  title: string;
  modifiedAtLabel: string;
  tags: string[];
}

export function useDocumentManager() {
  const [documents, setDocuments] = useState<SidebarDocument[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  const [editorKey, setEditorKey] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [activeSubtitle, setActiveSubtitle] = useState("");
  const [activeCreatedAt, setActiveCreatedAt] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [contentVersion, setContentVersion] = useState(0);

  const activeDocRef = useRef<{
    id: string;
    createdAt: string;
    tags: string[];
  } | null>(null);
  const activeTitleRef = useRef("");
  const activeSubtitleRef = useRef("");
  const activeContentRef = useRef<Record<string, unknown>>({
    type: "doc",
    content: [],
  });

  const allTags = useMemo(() => collectTags(documents), [documents]);

  const activeDocumentTags = useMemo(() => {
    if (!activeDocumentId) return [];
    const doc = documents.find((d) => d.id === activeDocumentId);
    return doc?.tags ?? [];
  }, [documents, activeDocumentId]);

  const filteredDocuments: ProcessedSidebarItem[] = useMemo(() => {
    const sorted = sortByModified(
      searchByTitle(filterByTag(documents, activeTagFilter), searchQuery),
    );
    return sorted.map((doc) => ({
      id: doc.id,
      title: doc.title,
      modifiedAtLabel: formatRelativeTime(new Date(doc.modifiedAt)),
      tags: doc.tags,
    }));
  }, [documents, activeTagFilter, searchQuery]);

  const refreshDocumentList = useCallback(async (): Promise<string[]> => {
    try {
      const metas = await listDocuments();
      const sidebarDocs: SidebarDocument[] = [];

      for (const meta of metas) {
        try {
          const doc = await loadDocument(meta.path);
          sidebarDocs.push({
            id: meta.id,
            title: doc.title || "Untitled",
            modifiedAt: doc.modifiedAt || new Date().toISOString(),
            tags: doc.tags || [],
          });
        } catch {
          sidebarDocs.push({
            id: meta.id,
            title: "Untitled",
            modifiedAt: new Date().toISOString(),
            tags: [],
          });
        }
      }

      setDocuments(sidebarDocs);
      return sidebarDocs.map((d) => d.id);
    } catch {
      // Storage not available (browser dev mode)
      return [];
    }
  }, []);

  useEffect(() => {
    async function init() {
      const documentIds = await refreshDocumentList();
      const lastId = getLastViewed();

      if (lastId && documentIds.includes(lastId)) {
        selectDocument(lastId);
      } else if (documentIds.length > 0) {
        selectDocument(documentIds[0]);
      } else {
        createNewDocument();
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function selectDocument(id: string) {
    try {
      const metas = await listDocuments();
      const meta = metas.find((m) => m.id === id);
      if (!meta) return;

      const doc = await loadDocument(meta.path);
      activeDocRef.current = {
        id,
        createdAt: doc.createdAt,
        tags: doc.tags || [],
      };
      activeTitleRef.current = doc.title || "";
      activeSubtitleRef.current = doc.subtitle || "";
      activeContentRef.current =
        (doc.content as Record<string, unknown>) ?? {
          type: "doc",
          content: [],
        };
      setActiveDocumentId(id);
      setActiveTitle(doc.title || "");
      setActiveSubtitle(doc.subtitle || "");
      setActiveCreatedAt(doc.createdAt);
      setEditorContent(doc.content as Record<string, unknown>);
      setEditorKey(id);
      setLastViewed(id);
      setSaveStatus("saved");
    } catch {
      // Document may not exist anymore
    }
  }

  function createNewDocument() {
    const id = generateId();
    const now = new Date().toISOString();
    activeDocRef.current = { id, createdAt: now, tags: [] };
    activeTitleRef.current = "";
    activeSubtitleRef.current = "";
    activeContentRef.current = { type: "doc", content: [] };
    setActiveDocumentId(id);
    setActiveTitle("");
    setActiveSubtitle("");
    setActiveCreatedAt(now);
    setEditorContent(undefined);
    setEditorKey(id);
    setLastViewed(id);
    setSaveStatus("saved");

    setDocuments((prev) => [
      { id, title: "Untitled", modifiedAt: now, tags: [] },
      ...prev,
    ]);
  }

  async function handleDelete(id: string) {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (activeDocumentId === id) {
        setActiveDocumentId(null);
        setEditorContent(undefined);
        setEditorKey("");
        setActiveTitle("");
        setActiveSubtitle("");
        setActiveCreatedAt("");
        setSaveStatus("saved");
        activeDocRef.current = null;
        activeTitleRef.current = "";
        activeSubtitleRef.current = "";
        activeContentRef.current = { type: "doc", content: [] };
      }
    } catch {
      // Storage not available
    }
  }

  async function handleUpdateTags(id: string, tags: string[]) {
    if (activeDocRef.current && activeDocRef.current.id === id) {
      activeDocRef.current.tags = tags;
    }

    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, tags } : d)),
    );

    try {
      const metas = await listDocuments();
      const meta = metas.find((m) => m.id === id);
      if (!meta) return;

      const doc = await loadDocument(meta.path);
      const updated: BloomDocument = { ...doc, tags };
      await saveDocument(id, updated);
    } catch {
      // Storage not available
    }
  }

  const performSave = useCallback(async () => {
    const ref = activeDocRef.current;
    if (!ref) return;

    const now = new Date().toISOString();
    const title =
      activeTitleRef.current ||
      extractTitle(
        activeContentRef.current as Parameters<typeof extractTitle>[0],
      ) ||
      "Untitled";

    const doc: BloomDocument = {
      content: activeContentRef.current,
      title,
      subtitle: activeSubtitleRef.current,
      createdAt: ref.createdAt,
      modifiedAt: now,
      tags: ref.tags,
      status: "draft",
    };

    try {
      await saveDocument(ref.id, doc);
      setLastViewed(ref.id);
      setSaveStatus("saved");

      setDocuments((prev) => {
        const exists = prev.some((d) => d.id === ref.id);
        if (exists) {
          return prev.map((d) =>
            d.id === ref.id
              ? { ...d, title, modifiedAt: now, tags: ref.tags }
              : d,
          );
        }
        return [
          { id: ref.id, title, modifiedAt: now, tags: ref.tags },
          ...prev,
        ];
      });
    } catch {
      // Tauri not available
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(performSave, AUTO_SAVE_DELAY_MS),
    [performSave],
  );

  function handleEditorUpdate(content: Record<string, unknown>) {
    activeContentRef.current = content;
    setSaveStatus("unsaved");
    setContentVersion((v) => v + 1);
    debouncedSave();
  }

  function handleSubtitleUpdate(subtitle: string) {
    activeSubtitleRef.current = subtitle;
    setActiveSubtitle(subtitle);
    setSaveStatus("unsaved");
    debouncedSave();
  }

  function handleTitleUpdate(title: string) {
    activeTitleRef.current = title;
    setActiveTitle(title);
    setSaveStatus("unsaved");

    if (activeDocRef.current) {
      const id = activeDocRef.current.id;
      const displayTitle = title || "Untitled";
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, title: displayTitle } : d)),
      );
    }

    debouncedSave();
  }

  function toggleCollapse() {
    setIsCollapsed((prev) => !prev);
  }

  return {
    filteredDocuments,
    allTags,
    activeDocumentId,
    activeTitle,
    activeSubtitle,
    activeCreatedAt,
    activeDocumentTags,
    editorContent,
    editorKey,
    isCollapsed,
    searchQuery,
    activeTagFilter,
    saveStatus,
    contentVersion,
    selectDocument,
    createNewDocument,
    handleDelete,
    handleUpdateTags,
    handleEditorUpdate,
    handleTitleUpdate,
    handleSubtitleUpdate,
    toggleCollapse,
    setSearchQuery,
    setActiveTagFilter,
  };
}

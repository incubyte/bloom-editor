import { useEffect, useState, useMemo, useCallback } from "react";
import { AppShell } from "./shell/AppShell";
import { Sidebar } from "./editor/Sidebar";
import { useEditorInstance, EditorCanvas, Toolbar } from "./editor/Editor";
import { PostHeader } from "./editor/PostHeader";
import { StatusBar } from "./editor/StatusBar";
import { useZenMode } from "./editor/useZenMode";
import { useTheme } from "./shell/useTheme";
import { useDocumentManager } from "./storage/useDocumentManager";
import { countWords } from "./editor/wordCount";
import { CommandPalette } from "./shell/CommandPalette";
import {
  getAllCommands,
  mergeDocumentCommands,
  sortByRecency,
} from "./shell/commandRegistry";
import { recordAction, getRecentActions } from "./shell/recentActions";
import { useKeyboardShortcuts } from "./shell/useKeyboardShortcuts";
import {
  registerCoreHandlers,
  getCommandHandler,
} from "./shell/commandHandlers";
import { usePluginSlots } from "./plugins/PluginContext";
import { getCurrentWindow } from "@tauri-apps/api/window";

registerCoreHandlers();

function App() {
  const { toolbarSections, statusBarSections } = usePluginSlots();
  const { isZenMode, toggleZenMode, exitZenMode } = useZenMode();
  const { toggleTheme } = useTheme();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();

  const showTemporaryMessage = useCallback((message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(undefined), 2000);
  }, []);
  const {
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
  } = useDocumentManager();

  const editor = useEditorInstance({
    onContentUpdate: handleEditorUpdate,
    initialContent: editorContent,
    editorKey,
  });

  const bodyWords = editor ? countWords(editor.getText()) : 0;
  const titleWords = countWords(activeTitle);
  const wordCount = titleWords + bodyWords;

  const sidebarDocuments = useMemo(
    () =>
      filteredDocuments.map((doc) =>
        doc.id === activeDocumentId
          ? { ...doc, wordCount }
          : doc,
      ),
    [filteredDocuments, activeDocumentId, wordCount],
  );

  useKeyboardShortcuts({
    onTogglePalette: () => setIsPaletteOpen((prev) => !prev),
    onNewDocument: createNewDocument,
    onToggleSidebar: toggleCollapse,
  });

  const commands = useMemo(() => {
    const base = getAllCommands();
    const withDocs = mergeDocumentCommands(base, filteredDocuments);
    const recentIds = isPaletteOpen ? getRecentActions() : [];
    return sortByRecency(withDocs, recentIds);
  }, [filteredDocuments, isPaletteOpen]);

  function handleCommandSelect(commandId: string) {
    recordAction(commandId);
    setIsPaletteOpen(false);

    if (commandId.startsWith("open-doc:")) {
      selectDocument(commandId.replace("open-doc:", ""));
      return;
    }

    const handler = getCommandHandler(commandId);
    if (handler) {
      handler({
        editor,
        toggleZenMode,
        toggleTheme,
        createNewDocument,
        toggleCollapse,
        selectDocument,
        showMessage: showTemporaryMessage,
        activeTitle,
      });
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isZenMode) {
        exitZenMode();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode, exitZenMode]);

  useEffect(() => {
    const title = activeTitle || "Untitled";
    getCurrentWindow().setTitle(`${title} — Bloom`).catch(() => {});
  }, [activeTitle]);

  return (
    <>
      <AppShell
        sidebar={
          <Sidebar
            documents={sidebarDocuments}
            allTags={allTags}
            activeDocumentId={activeDocumentId}
            onSelectDocument={selectDocument}
            onNewDocument={createNewDocument}
            onDeleteDocument={handleDelete}
            onUpdateTags={handleUpdateTags}
            onSearchChange={setSearchQuery}
            onTagFilterChange={setActiveTagFilter}
            activeTagFilter={activeTagFilter}
            searchQuery={searchQuery}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
          />
        }
        toolbar={
          !isZenMode ? (
            <>
              <Toolbar
                editor={editor}
                saveStatus={saveStatus}
                wordCount={wordCount}
              />
              {toolbarSections}
            </>
          ) : undefined
        }
        statusBar={
          activeDocumentId ? (
            <>
              <StatusBar saveStatus={saveStatus} message={statusMessage} />
              {statusBarSections}
            </>
          ) : undefined
        }
        isZenMode={isZenMode}
      >
        {activeDocumentId && (
          <PostHeader
            title={activeTitle}
            onTitleChange={handleTitleUpdate}
            subtitle={activeSubtitle}
            onSubtitleChange={handleSubtitleUpdate}
            createdAt={activeCreatedAt}
            wordCount={wordCount}
            tags={activeDocumentTags}
          />
        )}
        <EditorCanvas editor={editor} />
      </AppShell>
      <CommandPalette
        isOpen={isPaletteOpen}
        commands={commands}
        onSelect={handleCommandSelect}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  );
}

export default App;

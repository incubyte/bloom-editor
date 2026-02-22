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
import { exportToFile, copyAsMarkdown } from "./editor/exportService";

function App() {
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

    switch (commandId) {
      case "new-document":
        createNewDocument();
        break;
      case "toggle-sidebar":
        toggleCollapse();
        break;
      case "toggle-zen-mode":
        toggleZenMode();
        break;
      case "bold":
        editor?.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor?.chain().focus().toggleItalic().run();
        break;
      case "heading-1":
        editor?.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading-2":
        editor?.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading-3":
        editor?.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bullet-list":
        editor?.chain().focus().toggleBulletList().run();
        break;
      case "ordered-list":
        editor?.chain().focus().toggleOrderedList().run();
        break;
      case "code-block":
        editor?.chain().focus().toggleCodeBlock().run();
        break;
      case "inline-code":
        editor?.chain().focus().toggleCode().run();
        break;
      case "blockquote":
        editor?.chain().focus().toggleBlockquote().run();
        break;
      case "undo":
        editor?.chain().focus().undo().run();
        break;
      case "redo":
        editor?.chain().focus().redo().run();
        break;
      case "toggle-dark-mode":
        toggleTheme();
        break;
      case "export-file":
        if (editor) {
          const json = editor.getJSON();
          const html = editor.getHTML();
          exportToFile(activeTitle, json, html).then((result) => {
            if (result === "exported") showTemporaryMessage("Exported!");
          });
        }
        break;
      case "copy-markdown":
        if (editor) {
          copyAsMarkdown(editor.getJSON()).then(() => {
            showTemporaryMessage("Copied to clipboard!");
          });
        }
        break;
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

  return (
    <>
      <AppShell
        sidebar={
          <Sidebar
            documents={filteredDocuments}
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
            <Toolbar
              editor={editor}
              saveStatus={saveStatus}
              wordCount={wordCount}
            />
          ) : undefined
        }
        statusBar={
          activeDocumentId ? (
            <StatusBar saveStatus={saveStatus} message={statusMessage} />
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

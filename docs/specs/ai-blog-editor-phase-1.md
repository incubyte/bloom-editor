# Spec: AI Blog Editor -- Phase 1: The Editor (Open Source)

## Overview

A beautiful, offline-capable desktop writing app built with Tauri and React. No AI features -- just a best-in-class editor that solo creators love writing in. This is the open-source foundation that all future AI products build on. A writer can open the app, create and organize documents with tags, and write in a clean, distraction-free environment with continuous auto-save.

## Slice 1: App Shell and Empty Editor
The Tauri desktop app launches, shows a window with the sidebar + canvas layout, and renders an empty Tiptap editor. This is the walking skeleton -- proof that Tauri, React, and Tiptap work together. Full color tokens and component styles live in `.claude/DESIGN.md` -- the spec references key values for testable ACs but DESIGN.md is the source of truth.
<!-- -------- bee-comment -------- -->
> **@developer**: do we have to specify color scheme here or it will be taken care of.
> **@bee**: The spec only mentions specific hex values where they appear in acceptance criteria (e.g. "cream canvas #FAF9F7"). The full palette, spacing, shadows, and component details all live in `.claude/DESIGN.md` — that's the source of truth during implementation. Added a note to clarify this.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Modules:** `shell/`, `editor/`

- [ ] App launches as a native desktop window with a title bar and menu bar
- [ ] Window is resizable with a minimum size that keeps the layout usable
- [ ] Sidebar (240px default) appears on the left, editor canvas on the right
- [ ] Editor canvas centers content at a max width of 720px with at least 48px horizontal padding
- [ ] An empty Tiptap editor is mounted and accepts text input
- [ ] Light mode renders on launch using the Warm Ink palette (cream canvas #FAF9F7, warm gray text #2C2C2E)
- [ ] Inter is used for UI chrome (sidebar, toolbar); JetBrains Mono is used for editor body text
- [ ] App gracefully handles quit (Cmd+Q / Alt+F4) without errors

## Slice 2: Rich Text Editing

The editor supports all core formatting that a blog writer needs. Formatting is accessible via toolbar buttons and keyboard shortcuts.

**Module:** `editor/`
<!-- -------- bee-comment -------- -->
> **@developer**: can we introduce zen mode? Where clicking on it sends the app to full screen mode, with no side panes
> **@bee**: Love it — perfect fit for a distraction-free writing tool. Added a Zen Mode AC: fullscreen, sidebar hidden, toolbar hidden, just the canvas and your words. Toggle via shortcut and command palette. Also added it to the command palette slice.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

- [ ] Headings: H1, H2, H3 can be applied and toggled via toolbar and shortcuts
- [ ] Inline formatting: bold, italic can be toggled via toolbar and shortcuts (Cmd+B, Cmd+I)
- [ ] Bullet lists and ordered lists can be created, nested, and converted between types
- [ ] Code blocks render with a distinct background (bg-tertiary) and monospace font
- [ ] Inline code can be toggled with a shortcut (Cmd+E or backtick wrapping)
- [ ] Links can be inserted via a shortcut or toolbar button, showing a popover to enter a URL
- [ ] Blockquotes render with a left border accent and can be toggled
- [ ] Undo and redo work via Cmd+Z / Cmd+Shift+Z
- [ ] Pressing Enter in an empty list item exits the list (standard editor behavior)
- [ ] Markdown-style shortcuts work inline: typing `# ` at the start of a line creates H1, `## ` creates H2, `- ` creates a bullet list, `> ` creates a blockquote, triple backtick creates a code block
- [ ] Zen Mode: a toggle that enters fullscreen with sidebar hidden, toolbar hidden — just the editor canvas and text. Toggled via keyboard shortcut and command palette. Pressing Escape or the shortcut again exits Zen Mode

## Slice 3: Local Storage and Auto-Save
<!-- -------- bee-comment -------- -->
> **@developer**: why univault? Can i get a few options for the name? And we can create extension based on that
> **@bee**: Fair point — `.bloom` was a placeholder. Here are some options that fit the product's personality. Pick one (or suggest your own) and I'll update every reference in the spec:
>
> | Name | Extension | Vibe |
> |------|-----------|------|
> | Inkwell | `.ink` | Warm, writerly, matches the "Warm Ink" palette |
> | Quill | `.quill` | Classic writing instrument, elegant |
> | Draft | `.draft` | Honest — it's what you're making |
> | Muse | `.muse` | Creative inspiration, AI copilot as your muse |
> | Penmark | `.pen` | Simple, short, memorable |
> | Bloom | `.bloom` | Ideas blooming into writing |
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
<!-- -------- bee-comment -------- -->
> **@developer**: let's go ahead with bloom
> **@bee**: Done — updated every reference from `.bloom` to `.bloom` across the entire spec (slice description, ACs, and technical context).
> - [ ] mark as resolved
<!-- -------- /bee-comment -------- -->
Documents are persisted as JSON files with a custom `.bloom` extension. Saving is continuous and invisible -- the writer never thinks about saving.

**Module:** `storage/`

- [ ] Creating a new document generates a `.bloom` file containing Tiptap JSON content and metadata (title, created date, modified date, tags, status)
- [ ] Documents are saved to a default storage directory inside the user's documents folder
- [ ] Auto-save triggers on every pause in typing (debounced, roughly 1-2 seconds after last keystroke)
- [ ] There is no manual save action -- the app handles all persistence automatically
- [ ] Document title is auto-extracted from the first H1 or the first line of text in the editor
- [ ] If the document has no text content, it is treated as an empty draft (still saved, shown as "Untitled" in sidebar)
- [ ] Opening the app restores the last-viewed document in the editor
- [ ] A previously saved document can be opened by selecting it in the sidebar
- [ ] The file format is forward-compatible: unknown fields in the JSON are preserved (not stripped) when reading and writing

## Slice 4: Sidebar and Document Organization

The sidebar shows all documents and supports tag-based organization (Bear-style flat tags, no folders). Documents are searchable by title.

**Module:** `storage/` (data), `editor/` (sidebar UI integration)

- [ ] The sidebar lists all documents from the storage directory, sorted by most recently modified
- [ ] Each sidebar item shows the document title and a timestamp (relative, e.g., "2 min ago", "Yesterday")
- [ ] Selecting a sidebar item opens that document in the editor
- [ ] The currently open document is visually highlighted in the sidebar (active state with accent left border)
- [ ] A new document can be created from the sidebar (button or shortcut)
- [ ] Documents can be deleted (moves to trash / confirms before permanent delete)
- [ ] Tags can be assigned to a document (multiple tags per document)
- [ ] Tags appear as a filterable list in the sidebar -- clicking a tag filters the document list to show only documents with that tag
- [ ] An "All Notes" option in the sidebar clears any tag filter and shows all documents
- [ ] Search field in the sidebar filters documents by title as the user types
- [ ] The sidebar can be collapsed (hidden) and expanded via a button or keyboard shortcut
- [ ] When the window is narrow (under 900px), the sidebar collapses to an overlay instead of compressing the editor

## Slice 5: Keyboard-First UX and Command Palette

All common actions are accessible via keyboard. The command palette provides quick access to every action.

**Module:** `shell/` (command palette), `editor/` (formatting shortcuts)

- [x] Command palette opens with Cmd+K (macOS) / Ctrl+K (Linux/Windows)
- [x] Command palette shows a searchable list of all available actions, filtered as the user types
- [x] Command palette includes: all formatting actions, new document, toggle sidebar, toggle dark/light mode, toggle Zen Mode, export actions, and search by document title
- [x] Selecting a document title in the command palette opens that document
- [x] Command palette shows keyboard shortcuts next to each action
- [x] Recently used actions or recent files appear at the top of the command palette when first opened
- [x] Escape closes the command palette (and any other overlay: popovers, modals)
- [x] All formatting actions listed in Slice 2 have keyboard shortcuts that work without opening the command palette
- [x] New document shortcut: Cmd+N / Ctrl+N
- [x] Toggle sidebar shortcut exists and works

## Slice 6: Dark Mode and Theming

The app supports light and dark mode with the Warm Ink palette defined in the design brief. Theme preference is persisted.

**Module:** `shell/`

- [ ] Light mode uses the Warm Ink light palette (bg-primary #FAF9F7, text-primary #2C2C2E, accent #C4663A)
- [ ] Dark mode uses warm dark grays (bg-primary #1C1B19, text-primary #E8E6E1, accent #D4784A) -- no pure black
- [ ] The user can toggle between light and dark mode via the command palette or a menu item
- [ ] Theme preference is persisted across app restarts
- [ ] The app respects the OS-level dark mode preference on first launch (before the user has set a preference)
- [ ] All interactive elements show visible focus rings (2px solid accent with box-shadow)
- [ ] Transitions respect `prefers-reduced-motion` -- animations are disabled when the OS setting is on
- [ ] Semantic colors (success, warning, error, info) are applied correctly in both modes

## Slice 7: Export

The writer can export their document as Markdown or HTML.

**Module:** `editor/` (content conversion), `shell/` (file dialog)

- [ ] "Export to file..." opens the OS-native save dialog with format options for Markdown (.md) and HTML (.html)
- [ ] The default filename in the save dialog is derived from the document title
- [ ] Exported Markdown preserves headings, bold, italic, lists, code blocks, links, and blockquotes as standard Markdown syntax
- [ ] Exported HTML is clean, semantic markup (not Tiptap's internal representation)
- [ ] "Copy as Markdown" copies the full document as Markdown to the system clipboard
- [ ] A brief confirmation (toast or status bar message) appears after a successful export or copy
- [ ] Export actions are accessible from the menu bar, command palette, and keyboard shortcuts

## Out of Scope

- AI features of any kind (copilot, voice profiles, review, suggestions) -- these are Phase 2+
- Cloud sync or account system
- Profile files for author data (voice/tone settings) -- not needed until AI features in Phase 2
- Publishing integrations (Ghost, Substack, WordPress, Medium)
- Mobile or web versions
- Audio/video transcription
- Collaborative editing
- Full-text search across document bodies (sidebar search is title-only for Phase 1)
- Image embedding or drag-and-drop media
- Custom themes beyond light/dark
- Printing
- Versioning or revision history

## Technical Context

- **Framework:** Tauri (Rust backend for file I/O, React webview for UI)
- **Editor engine:** Tiptap (ProseMirror-based) with React integration
- **Frontend:** React (best Tiptap ecosystem support)
- **UI fonts:** Inter for chrome, JetBrains Mono for editor body
- **Icons:** Lucide (outlined, 1.5px stroke weight)
- **Storage format:** `.bloom` JSON files -- one per article, containing Tiptap JSON content + metadata
- **Storage location:** Default directory inside user's documents folder
- **Module boundaries:** `shell/` (app window, menu, lifecycle), `editor/` (Tiptap, extensions, editor state), `storage/` (file persistence, file management). No other modules are needed for Phase 1.
- **Design system:** Warm Ink palette, component specs, spacing, and typography defined in `.claude/DESIGN.md`
- **Risk level:** MODERATE (core tech is proven but this is greenfield, and the Tauri + React + Tiptap integration needs validation)
- **Open-source:** This phase ships as the open-source foundation for all future products
[x] reviewed
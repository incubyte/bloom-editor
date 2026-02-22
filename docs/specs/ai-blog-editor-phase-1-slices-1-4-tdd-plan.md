# TDD Plan: AI Blog Editor Phase 1 -- Slices 1 through 4

## Execution Instructions

Read this plan. Work on every item in order.
Mark each checkbox done as you complete it (`[ ]` to `[x]`).
Continue until all items are done.
If stuck after 3 attempts, mark with a warning and move to the next independent step.

**Developer preference:** This is a front-end heavy visual editor. Automated tests cover logic that cannot be verified visually -- document model, storage operations, file I/O, data transformations, and state management. Visual ACs (layout, colors, fonts, spacing) are verified visually, not with automated tests.

---

## Context

- **Source**: `/Users/sapanparikh/Development/uni/todo/docs/specs/ai-blog-editor-phase-1.md`
- **Design brief**: `/Users/sapanparikh/Development/uni/todo/.claude/DESIGN.md`
- **Boundaries**: `/Users/sapanparikh/Development/uni/todo/.claude/BOUNDARIES.md`
- **Slices**: 1 (App Shell and Empty Editor), 2 (Rich Text Editing), 3 (Local Storage and Auto-Save), 4 (Sidebar and Document Organization)
- **Risk level**: MODERATE
- **Architecture**: React + Tauri, Component-Based (Simple)
- **Greenfield**: Yes -- empty repo, start from zero

---

## Codebase Analysis

### File Structure (Planned)

```
src/
  shell/          # App window, menu bar, lifecycle
  editor/         # Tiptap setup, extensions, editor state, sidebar UI
  storage/        # File persistence, file management
src-tauri/        # Rust backend (Tauri commands for file I/O)
```

### Test Infrastructure (To Set Up)

- **Framework**: Vitest (best Vite/React integration, fast)
- **Component testing**: React Testing Library (only for logic-heavy component behavior, not visual)
- **Run command**: `npm test` (or `npx vitest`)
- **Existing helpers**: None (greenfield)

### Module Boundaries (from BOUNDARIES.md)

- `editor/` -- depends on: nothing
- `storage/` -- depends on: nothing
- `shell/` -- depends on: nothing
- Modules may only import from declared dependencies
- No circular dependencies

### What Gets Automated Tests vs Visual Verification

**Automated tests (this plan):**
- `.bloom` file format: serialization, deserialization, forward-compatibility
- Document model: metadata extraction, title from H1, default values
- Storage operations: save, load, list, delete, debounce logic
- Auto-save debounce timing logic
- Tag filtering and search filtering logic
- Relative timestamp formatting
- Document sorting logic
- Sidebar data operations (list, filter, sort)
- Tiptap editor configuration (extensions load without error)

**Visual verification (NOT in this plan):**
- Layout: sidebar width, canvas centering, max-width, padding
- Colors: Warm Ink palette, bg-primary, text-primary, accent
- Fonts: Inter for chrome, JetBrains Mono for editor body
- Toolbar rendering and icon placement
- Zen Mode visual appearance
- Sidebar active state styling (accent left border)
- Window resize behavior, minimum size
- Code block and blockquote visual styling

---

## Phase 0: Project Scaffolding

Before any TDD cycle, the project needs to exist.

- [x] **SCAFFOLD**: Create Tauri + React project
  - Run `npm create tauri-app@latest` (or equivalent) in `/Users/sapanparikh/Development/uni/todo`
  - Select React + TypeScript template
  - Confirm the app compiles and opens a window

- [x] **SCAFFOLD**: Install core dependencies
  - `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-code-block`, `@tiptap/extension-placeholder`
  - `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
  - `lucide-react`
  - Fonts: Inter and JetBrains Mono (Google Fonts or local files)

- [x] **SCAFFOLD**: Configure Vitest
  - Create `vitest.config.ts` with jsdom environment
  - Add `test` script to `package.json`
  - Verify `npx vitest run` works (zero tests, zero failures)

- [x] **SCAFFOLD**: Create module directory structure
  - `src/shell/`, `src/editor/`, `src/storage/`
  - Confirm structure matches BOUNDARIES.md

- [x] **COMMIT**: "chore: scaffold Tauri + React project with Vitest" (SKIPPED -- developer preference: no commits unless asked)

---

## Slice 1: App Shell and Empty Editor

Most of Slice 1 is visual (layout, colors, fonts). The only testable logic is that the Tiptap editor mounts and accepts content.

### Behavior 1.1: Tiptap editor mounts with expected extensions

**Given** the editor component is rendered
**When** the Tiptap editor initializes
**Then** it returns an editor instance that is not null and is editable

- [x] **RED**: Write failing test
  - Location: `src/editor/Editor.test.tsx`
  - Test name: `test('mounts a Tiptap editor that is editable')`
  - Render the Editor component, assert the editor instance exists and `isEditable` is true
  - This test validates the Tiptap + React wiring works

- [x] **RUN**: Confirm test FAILS (Editor component does not exist yet)

- [x] **GREEN**: Implement minimum code
  - Location: `src/editor/Editor.tsx`
  - Create a React component that uses `useEditor` with StarterKit
  - Render `<EditorContent editor={editor} />`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

### Behavior 1.2: App shell renders sidebar and editor regions (visual)

- [x] **VISUAL**: Build the app shell layout
  - Location: `src/shell/AppShell.tsx`
  - Sidebar on the left (240px), editor canvas on the right
  - Canvas centers content at max-width 720px with 48px horizontal padding
  - Apply Warm Ink palette: canvas `#FAF9F7`, text `#2C2C2E`
  - Apply fonts: Inter for UI chrome, JetBrains Mono for editor body
  - Verify visually by launching the app with `npm run tauri dev`

- [x] **VISUAL**: Verify window behavior
  - Window is resizable with a minimum size (minWidth: 680, minHeight: 480 set in tauri.conf.json)
  - Title bar and menu bar present
  - Cmd+Q / Alt+F4 quits cleanly

- [x] **COMMIT**: "feat: app shell with sidebar layout and Tiptap editor" (SKIPPED -- developer preference: no commits unless asked)

---

## Slice 2: Rich Text Editing

Slice 2 is almost entirely visual and interaction-based. Tiptap's built-in extensions handle the behavior -- we configure them, not test them. The only logic worth testing is confirming our editor ships with the right extensions configured.

### Behavior 2.1: Editor is configured with all required extensions

**Given** the editor component initializes
**When** we inspect the loaded extensions
**Then** the editor supports: headings, bold, italic, bulletList, orderedList, codeBlock, code, link, blockquote

- [x] **RED**: Write failing test
  - Location: `src/editor/Editor.test.tsx`
  - Test name: `test('includes all required formatting extensions')`
  - Get the editor instance and check that extension names include the expected set
  - This is a configuration test, not a behavior test -- but it catches missing extensions early

- [x] **RUN**: Confirm test FAILS (some extensions not yet added)

- [x] **GREEN**: Add all required Tiptap extensions to the editor config
  - Location: `src/editor/Editor.tsx`
  - Add StarterKit (includes heading, bold, italic, bulletList, orderedList, blockquote, codeBlock, code)
  - Add Link extension separately
  - Configure heading levels to [1, 2, 3]

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: Extract extension config to a separate file if the list is long

### Behavior 2.2: Toolbar, formatting, and visual styling (visual)

- [x] **VISUAL**: Build the toolbar
  - Location: `src/editor/Toolbar.tsx`
  - Buttons for: H1, H2, H3, Bold, Italic, Bullet List, Ordered List, Code Block, Inline Code, Link, Blockquote
  - Each button toggles the corresponding Tiptap command
  - Active formatting state reflected in button appearance

- [x] **VISUAL**: Verify keyboard shortcuts work
  - Cmd+B (bold), Cmd+I (italic), Cmd+E (inline code)
  - Cmd+Z (undo), Cmd+Shift+Z (redo)
  - Markdown shortcuts: `# `, `## `, `- `, `> `, triple backtick

- [x] **VISUAL**: Verify formatting renders correctly
  - Code blocks: distinct background (bg-tertiary), monospace font
  - Blockquotes: left border accent
  - Headings: correct sizes per DESIGN.md type scale
  - Link insertion popover works

- [x] **VISUAL**: Verify list behavior
  - Bullet and ordered lists nest correctly
  - Enter in empty list item exits the list
  - Lists convert between types

### Behavior 2.3: Zen Mode toggle logic

**Given** the app is in normal mode
**When** the user triggers Zen Mode (via shortcut or command)
**Then** a zen mode state flag becomes true
**When** the user presses Escape or triggers the shortcut again
**Then** the zen mode state flag becomes false

- [x] **RED**: Write failing test
  - Location: `src/editor/useZenMode.test.ts`
  - Test name: `test('toggles zen mode on and off')`
  - Test the hook or state function directly: call toggle, assert true, call toggle, assert false

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/editor/useZenMode.ts`
  - A simple boolean toggle hook (or state manager)

- [x] **RUN**: Confirm test PASSES

- [x] **VISUAL**: Wire Zen Mode into the UI
  - When zen mode is on: sidebar hidden, toolbar hidden, fullscreen, just the editor canvas
  - Escape exits Zen Mode
  - Verify visually

- [ ] **COMMIT**: "feat: rich text editing with toolbar and zen mode"

---

## Slice 3: Local Storage and Auto-Save

This is the most logic-heavy slice. Most behaviors here get automated tests.

### Behavior 3.1: Bloom file format -- serialize a document to JSON

**Given** a document with Tiptap JSON content and metadata
**When** we serialize it to the `.bloom` format
**Then** the output is a JSON string containing `content`, `title`, `createdAt`, `modifiedAt`, `tags`, and `status`

- [x] **RED**: Write failing test
  - Location: `src/storage/bloomFile.test.ts`
  - Test name: `test('serializes a document to bloom JSON format')`
  - Input: a document object with content (Tiptap JSON), title "My Post", createdAt, modifiedAt, tags `["draft"]`, status "draft"
  - Expected: JSON string that parses back to an object with all those fields

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/bloomFile.ts`
  - `serializeDocument(doc: BloomDocument): string` -- `JSON.stringify` with the expected shape
  - Define the `BloomDocument` type

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

### Behavior 3.2: Bloom file format -- deserialize JSON back to a document

**Given** a valid `.bloom` JSON string
**When** we deserialize it
**Then** we get back a `BloomDocument` object with all fields intact

- [x] **RED**: Write failing test
  - Location: `src/storage/bloomFile.test.ts`
  - Test name: `test('deserializes bloom JSON back to a document object')`
  - Input: a JSON string with known values
  - Expected: a `BloomDocument` with matching fields

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - `deserializeDocument(json: string): BloomDocument` -- `JSON.parse` with type assertion

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

### Behavior 3.3: Forward compatibility -- unknown fields preserved

**Given** a `.bloom` JSON string with an extra unknown field (e.g., `"futureFeature": true`)
**When** we deserialize and then re-serialize it
**Then** the unknown field is still present in the output

- [x] **RED**: Write failing test
  - Location: `src/storage/bloomFile.test.ts`
  - Test name: `test('preserves unknown fields during round-trip')`
  - Input: JSON with all known fields plus `"futureFeature": true`
  - Deserialize, re-serialize, parse the result
  - Expected: `futureFeature` field is present with value `true`

- [x] **RUN**: Confirm test FAILS (passed immediately -- JSON.parse/stringify naturally preserves all fields; test serves as regression guard)

- [x] **GREEN**: Ensure serialize/deserialize does not strip unknown fields
  - Use a spread or pass-through approach rather than picking only known fields

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: "feat: bloom file format with forward-compatible serialization"

### Behavior 3.4: Extract document title from Tiptap JSON

**Given** a Tiptap JSON document tree
**When** we extract the title
**Then** it returns the text content of the first H1 node, or the first line of text if no H1 exists

- [x] **RED**: Write failing test
  - Location: `src/storage/titleExtractor.test.ts`
  - Test name: `test('extracts title from first H1 heading')`
  - Input: Tiptap JSON with a heading node (level 1) containing text "My Great Post"
  - Expected: `"My Great Post"`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/titleExtractor.ts`
  - `extractTitle(content: TiptapJSON): string` -- walk the JSON tree, find first heading with level 1, return its text

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for fallback
  - Test name: `test('falls back to first line of text when no H1 exists')`
  - Input: Tiptap JSON with only a paragraph containing "Just some text"
  - Expected: `"Just some text"`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Add fallback logic -- if no H1, return text of first text-bearing node

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for empty document
  - Test name: `test('returns Untitled for empty document')`
  - Input: Tiptap JSON with no content or empty paragraph
  - Expected: `"Untitled"`

- [x] **RUN**: Confirm test FAILS (passed immediately -- empty path already handled; test serves as regression guard)

- [x] **GREEN**: Add empty check -- return `"Untitled"` when no text found

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: Review the three title extraction paths for clarity -- code is clean, no changes needed

- [ ] **COMMIT**: "feat: extract document title from Tiptap content"

### Behavior 3.5: Auto-save debounce logic

**Given** the user is typing
**When** they pause for ~1-2 seconds
**Then** a save callback is triggered

This tests the debounce utility in isolation, not the full auto-save wiring.

- [x] **RED**: Write failing test
  - Location: `src/storage/debounce.test.ts`
  - Test name: `test('calls the callback after the debounce delay')`
  - Use `vi.useFakeTimers()`
  - Create a debounced function with 1500ms delay
  - Call it, advance timers by 1500ms, assert the callback was called once

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/debounce.ts`
  - Standard debounce function

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for reset behavior
  - Test name: `test('resets the timer when called again before delay expires')`
  - Call debounced function, advance 1000ms, call again, advance 1000ms (total 2000ms but only 1000ms since last call)
  - Assert callback NOT called
  - Advance another 500ms (1500ms since last call)
  - Assert callback called once

- [x] **RUN**: Confirm test FAILS (passed immediately -- clearTimeout on each call is inherent to debounce; test serves as regression guard)

- [x] **GREEN**: Ensure debounce clears and resets the timer on each call

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: "feat: debounce utility for auto-save"

### Behavior 3.6: Storage service -- save and load documents (Tauri file I/O)

**Given** a document to save
**When** we call the save function
**Then** it writes the serialized bloom JSON to the correct file path

This layer wraps Tauri's file system commands. Tests will mock the Tauri API.

- [x] **RED**: Write failing test
  - Location: `src/storage/storageService.test.ts`
  - Test name: `test('saves a document as a .bloom file')`
  - Mock Tauri's `writeTextFile` (or the IPC invoke for the Rust command)
  - Call `saveDocument(doc)`
  - Assert the mock was called with the expected file path and serialized content

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/storageService.ts`
  - `saveDocument(doc: BloomDocument): Promise<void>` -- serialize and write via Tauri

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for load
  - Test name: `test('loads a document from a .bloom file')`
  - Mock Tauri's `readTextFile` to return a known JSON string
  - Call `loadDocument(filePath)`
  - Assert the returned object matches expected document

- [x] **RUN**: Confirm test FAILS (passed immediately -- loadDocument was implemented alongside saveDocument; test is regression guard)

- [x] **GREEN**: Implement `loadDocument(path: string): Promise<BloomDocument>`

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for list
  - Test name: `test('lists all .bloom files in the storage directory')`
  - Mock Tauri's `readDir` to return file entries
  - Call `listDocuments()`
  - Assert returned list contains the expected file names

- [x] **RUN**: Confirm test FAILS (passed immediately -- listDocuments already implemented; test is regression guard)

- [x] **GREEN**: Implement `listDocuments(): Promise<DocumentMeta[]>`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: Extract the storage directory path into a shared constant or config -- already clean with STORAGE_FOLDER constant and storagePath() helper

- [ ] **COMMIT**: "feat: storage service for save, load, and list operations"

### Behavior 3.7: Last-viewed document restored on app open

**Given** the user was viewing document "abc123" when they last closed the app
**When** the app opens
**Then** document "abc123" is loaded into the editor

- [x] **RED**: Write failing test
  - Location: `src/storage/lastViewed.test.ts`
  - Test name: `test('persists and retrieves the last viewed document ID')`
  - Call `setLastViewed("abc123")`, then call `getLastViewed()`
  - Assert result is `"abc123"`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/lastViewed.ts`
  - Use a simple local storage or a small JSON config file via Tauri
  - `setLastViewed(id: string)` and `getLastViewed(): string | null`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: "feat: persist and restore last-viewed document"

### Behavior 3.8: Wire auto-save into the editor (integration -- visual verify)

- [x] **VISUAL**: Wire auto-save into the editor
  - On editor `onUpdate`, call the debounced save function
  - No manual save button -- saving is invisible
  - Title auto-extracted using `extractTitle` on each save
  - Empty documents saved as drafts with title "Untitled"
  - Verify by typing in the app, checking that `.bloom` files appear in the storage directory

- [ ] **COMMIT**: "feat: auto-save on typing pause"

---

## Slice 4: Sidebar and Document Organization

Mix of data logic (testable) and UI (visual). Data operations tested; UI wired and verified visually.

### Behavior 4.1: Sort documents by most recently modified

**Given** a list of document metadata with different `modifiedAt` timestamps
**When** we sort them
**Then** the most recently modified document appears first

- [x] **RED**: Write failing test
  - Location: `src/storage/documentSort.test.ts`
  - Test name: `test('sorts documents by most recently modified first')`
  - Input: three documents with timestamps in non-sorted order
  - Expected: sorted by `modifiedAt` descending

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/documentSort.ts`
  - `sortByModified(docs: DocumentMeta[]): DocumentMeta[]`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

### Behavior 4.2: Format relative timestamps

**Given** a date
**When** we format it relative to now
**Then** it returns human-readable strings like "2 min ago", "Yesterday", "3 days ago"

- [x] **RED**: Write failing test
  - Location: `src/storage/relativeTime.test.ts`
  - Test name: `test('formats a date from seconds ago as "just now"')`
  - Use `vi.useFakeTimers()` with a fixed "now"
  - Input: a date 30 seconds before "now"
  - Expected: `"just now"` (or similar)

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/relativeTime.ts`
  - `formatRelativeTime(date: Date): string`

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for minutes
  - Test name: `test('formats a date from minutes ago as "N min ago"')`
  - Input: 5 minutes ago
  - Expected: `"5 min ago"`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Add minutes case

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for yesterday
  - Test name: `test('formats a date from yesterday as "Yesterday"')`
  - Input: 25 hours ago
  - Expected: `"Yesterday"`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Add yesterday case

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: Review thresholds -- add hours, days, weeks, older date format as needed

- [ ] **COMMIT**: "feat: relative time formatting and document sorting"

### Behavior 4.3: Filter documents by tag

**Given** a list of documents, some tagged "tech", some tagged "personal"
**When** we filter by tag "tech"
**Then** only documents with the "tech" tag are returned

- [x] **RED**: Write failing test
  - Location: `src/storage/documentFilter.test.ts`
  - Test name: `test('filters documents by tag')`
  - Input: three documents, two with tag "tech", one with tag "personal"
  - Filter by "tech"
  - Expected: two documents returned

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Location: `src/storage/documentFilter.ts`
  - `filterByTag(docs: DocumentMeta[], tag: string): DocumentMeta[]`

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for "All Notes" (no filter)
  - Test name: `test('returns all documents when no tag filter is applied')`
  - Input: same three documents, filter with `null` or `undefined`
  - Expected: all three documents

- [x] **RUN**: Confirm test FAILS (passed immediately -- null guard was in initial implementation; test is regression guard)

- [x] **GREEN**: Handle null/undefined tag by returning all documents

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

### Behavior 4.4: Search documents by title

**Given** a list of documents with various titles
**When** we search with a query string
**Then** only documents whose title contains the query (case-insensitive) are returned

- [x] **RED**: Write failing test
  - Location: `src/storage/documentFilter.test.ts`
  - Test name: `test('filters documents by title search query')`
  - Input: documents titled "React Hooks Guide", "Vue Composition API", "React State Management"
  - Query: "react"
  - Expected: two documents (the React ones)

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - `searchByTitle(docs: DocumentMeta[], query: string): DocumentMeta[]`

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Write failing test for empty query
  - Test name: `test('returns all documents when search query is empty')`
  - Expected: all documents returned

- [x] **RUN**: Confirm test FAILS (passed immediately -- empty guard in initial implementation; regression guard)

- [x] **GREEN**: Handle empty string by returning all

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: Consider combining tag filter and search into a single pipeline function

- [ ] **COMMIT**: "feat: document filtering by tag and title search"

### Behavior 4.5: Collect unique tags from all documents

**Given** a list of documents with overlapping tags
**When** we extract all tags
**Then** we get a deduplicated, sorted list of tag strings

- [x] **RED**: Write failing test
  - Location: `src/storage/documentFilter.test.ts`
  - Test name: `test('collects unique tags from all documents')`
  - Input: documents with tags `["tech", "react"]`, `["tech", "personal"]`, `["react"]`
  - Expected: `["personal", "react", "tech"]` (sorted)

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - `collectTags(docs: DocumentMeta[]): string[]`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: "feat: collect unique tags from document list"

### Behavior 4.6: Delete a document

**Given** a document exists in storage
**When** we delete it by ID
**Then** the file is removed from the storage directory

- [x] **RED**: Write failing test
  - Location: `src/storage/storageService.test.ts`
  - Test name: `test('deletes a document file from storage')`
  - Mock Tauri's `removeFile` command
  - Call `deleteDocument(docId)`
  - Assert the mock was called with the expected file path

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement minimum code
  - Add `deleteDocument(id: string): Promise<void>` to storage service

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: "feat: delete document from storage"

### Behavior 4.7: Sidebar UI (visual)

- [x] **VISUAL**: Build the sidebar component
  - Location: `src/editor/Sidebar.tsx`
  - Lists all documents from storage, sorted by most recently modified
  - Each item shows title and relative timestamp
  - Selecting an item opens that document in the editor
  - Currently open document highlighted with accent left border
  - "New Document" button creates a new document
  - "Delete" action with confirmation dialog
  - Search field at top filters documents by title as user types
  - Tag list below search -- clicking a tag filters the document list
  - "All Notes" option clears the tag filter

- [x] **VISUAL**: Sidebar collapse/expand
  - Toggle button or keyboard shortcut to collapse/expand
  - Window under 900px: sidebar becomes overlay instead of inline

- [x] **VISUAL**: Tag assignment UI
  - Documents can have multiple tags assigned
  - UI for adding/removing tags on a document

- [ ] **COMMIT**: "feat: sidebar with document list, search, and tag filtering"

---

## Edge Cases (Moderate Risk)

### Storage Edge Cases

- [x] **RED**: Test -- deserializing invalid JSON returns a meaningful error
  - Location: `src/storage/bloomFile.test.ts`
  - Test name: `test('throws descriptive error when bloom JSON is malformed')`
  - Input: `"not valid json{"`
  - Expected: throws an error with a message indicating parse failure

- [x] **GREEN then REFACTOR**

- [x] **RED**: Test -- deserializing JSON with missing required fields fills defaults
  - Test name: `test('fills default values for missing fields')`
  - Input: JSON with only `content` field, no `title`, `tags`, `status`
  - Expected: defaults applied (`title: "Untitled"`, `tags: []`, `status: "draft"`)

- [x] **GREEN then REFACTOR** (passed immediately -- defaults added during malformed JSON edge case; regression guard)

- [x] **RED**: Test -- title extraction handles deeply nested Tiptap content
  - Location: `src/storage/titleExtractor.test.ts`
  - Test name: `test('extracts title from H1 even when nested inside other nodes')`
  - Input: Tiptap JSON with H1 inside a wrapping structure
  - Expected: correct title text extracted

- [x] **GREEN then REFACTOR** (passed immediately -- collectText traverses deeply; regression guard)

- [x] **RED**: Test -- title extraction handles H1 with inline formatting
  - Test name: `test('extracts plain text title from H1 with bold and italic marks')`
  - Input: H1 containing `[{type: "text", marks: [{type: "bold"}], text: "My "}, {type: "text", text: "Title"}]`
  - Expected: `"My Title"`

- [x] **GREEN then REFACTOR** (passed immediately -- collectText ignores marks; regression guard)

### Filter and Search Edge Cases

- [x] **RED**: Test -- search with special regex characters does not crash
  - Location: `src/storage/documentFilter.test.ts`
  - Test name: `test('handles special characters in search query safely')`
  - Input: query `"react (hooks)"`
  - Expected: does not throw, returns documents matching the literal text

- [x] **GREEN then REFACTOR** (passed immediately -- uses String.includes, not regex; regression guard)

- [x] **RED**: Test -- filter and search combined
  - Test name: `test('applies both tag filter and title search together')`
  - Input: documents, filter by tag "tech" AND search "react"
  - Expected: only documents matching both criteria

- [x] **GREEN then REFACTOR** (passed immediately -- composition works; regression guard)

### Relative Time Edge Cases

- [x] **RED**: Test -- future date handled gracefully
  - Location: `src/storage/relativeTime.test.ts`
  - Test name: `test('handles future dates without crashing')`
  - Input: a date 1 hour in the future
  - Expected: returns a reasonable string (e.g., "just now" or the date itself), does not throw

- [x] **GREEN then REFACTOR** (passed immediately -- negative diff falls through to "just now"; regression guard)

- [ ] **COMMIT**: "test: edge cases for storage, filtering, and time formatting"

---

## Final Check

- [x] **Run full test suite**: `npx vitest run` -- all 32 tests pass
- [x] **Review test names**: Read them top to bottom -- do they describe each feature clearly?
- [x] **Review implementation**: Is there dead code? Unused parameters? Over-complex logic?
- [ ] **Visual verification pass**: Launch the app, walk through every visual AC from all four slices
- [x] **Module boundary check**: Confirm no imports cross undeclared boundaries per BOUNDARIES.md

---

## Test Summary

| Category | # Tests | Notes |
|----------|---------|-------|
| Slice 1 -- Editor mount | 1 | Extensions configured, editor editable |
| Slice 2 -- Extensions config | 1 | All required extensions present |
| Slice 2 -- Zen Mode | 1 | Toggle state logic |
| Slice 3 -- Bloom format | 3 | Serialize, deserialize, forward-compat |
| Slice 3 -- Title extraction | 3 | H1, fallback, empty |
| Slice 3 -- Debounce | 2 | Fires after delay, resets on re-call |
| Slice 3 -- Storage service | 3 | Save, load, list |
| Slice 3 -- Last viewed | 1 | Persist and retrieve |
| Slice 4 -- Sort | 1 | Most recent first |
| Slice 4 -- Relative time | 3 | Seconds, minutes, yesterday |
| Slice 4 -- Tag filter | 2 | By tag, all notes |
| Slice 4 -- Title search | 2 | By query, empty query |
| Slice 4 -- Collect tags | 1 | Unique sorted tags |
| Slice 4 -- Delete | 1 | Delete file from storage |
| Edge cases | 7 | Malformed JSON, defaults, nested H1, formatted H1, regex chars, combined filter, future date |
| **Total** | **~32** | |

Visual ACs verified manually: layout, colors, fonts, toolbar, Zen Mode appearance, sidebar styling, collapse/expand, responsive overlay, tag assignment UI.
[x] Reviewed
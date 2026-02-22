# TDD Plan: Export -- Slice 7

## Execution Instructions
Read this plan. Work on every item in order.
Mark each checkbox done as you complete it ([ ] -> [x]).
Continue until all items are done.
If stuck after 3 attempts, mark with a warning and move to the next independent step.

## Context
- **Source**: `docs/specs/ai-blog-editor-phase-1.md`
- **Slice**: Slice 7 -- Export
- **Risk**: MODERATE
- **Acceptance Criteria**:
  1. "Export to file..." opens OS-native save dialog with Markdown (.md) and HTML (.html) format options
  2. Default filename in save dialog is derived from document title
  3. Exported Markdown preserves headings, bold, italic, lists, code blocks, links, blockquotes
  4. Exported HTML is clean, semantic markup (not Tiptap internals)
  5. "Copy as Markdown" copies full document as Markdown to system clipboard
  6. Brief confirmation appears after successful export or copy
  7. Export actions accessible from menu bar, command palette, and keyboard shortcuts

## Codebase Analysis

### File Structure
- Markdown converter (new): `src/editor/markdownConverter.ts`
- HTML cleaner (new): `src/editor/htmlExporter.ts`
- Export orchestration (new): `src/editor/exportService.ts`
- Command registry update: `src/shell/commandRegistry.ts`
- StatusBar update: `src/editor/StatusBar.tsx`
- App wiring: `src/App.tsx`

### Test Infrastructure
- Framework: Vitest + jsdom + React Testing Library
- Run command: `npm test`
- Test convention: co-located `*.test.ts` files, `describe`/`test` blocks
- Mocking convention: `vi.mock()` at module level for Tauri APIs (see `storageService.test.ts`)
- Imports: `import { describe, test, expect, vi } from "vitest"`

### Module Boundaries
- `editor/` owns content conversion (Markdown converter, HTML cleaner)
- `shell/` owns the file dialog interaction
- Export orchestration lives in `editor/` since it coordinates content conversion + file writing
- `shell/commandRegistry.ts` already has a placeholder `"export"` command

### Existing Integration Points
- `titleExtractor.ts` has the `TiptapNode` interface -- reuse for Markdown converter input type
- `commandRegistry.ts` has the placeholder `{ id: "export", label: "Export", category: "view" }`
- `App.tsx` has an empty `case "export": break;` in `handleCommandSelect`
- `StatusBar.tsx` currently shows save status -- will gain a temporary message capability
- Tauri APIs to mock: `@tauri-apps/plugin-dialog` (save dialog), `@tauri-apps/plugin-fs` (writeTextFile)

---

## Behavior 1: Convert Tiptap JSON to Markdown

The core pure function. Given Tiptap JSON (the same structure used in `titleExtractor.ts`), produce standard Markdown text.

**Given** a Tiptap JSON document with headings, paragraphs, bold, italic, lists, code blocks, links, and blockquotes
**When** `toMarkdown(doc)` is called
**Then** it returns a string of standard Markdown preserving all formatting

- [x] **RED**: Write failing test
  - Location: `src/editor/markdownConverter.test.ts`
  - Test name: `test('converts a paragraph to plain text')`
  - Input: `{ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello world" }] }] }`
  - Expected: `"Hello world"`

- [x] **RUN**: Confirm test FAILS (module does not exist yet)

- [x] **GREEN**: Create `src/editor/markdownConverter.ts` with `toMarkdown()` that handles paragraph nodes
  - Reuse the `TiptapNode` type from `titleExtractor.ts` (or duplicate it per BOUNDARIES.md guidance)

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Add tests for each node type, one at a time. Each test should cover one formatting type:
  - `test('converts headings to # syntax')` -- H1 -> `# `, H2 -> `## `, H3 -> `### `
  - `test('converts bold text to double asterisks')` -- `**bold**`
  - `test('converts italic text to single asterisks')` -- `*italic*`
  - `test('converts bullet lists to dash syntax')` -- `- item`
  - `test('converts ordered lists to numbered syntax')` -- `1. item`
  - `test('converts code blocks to fenced syntax')` -- triple backtick blocks
  - `test('converts inline code to backtick syntax')` -- `` `code` ``
  - `test('converts links to markdown link syntax')` -- `[text](url)`
  - `test('converts blockquotes to > syntax')` -- `> text`
  - For each: write the test, watch it fail, implement just enough to pass, then next.

- [x] **RUN**: All Markdown conversion tests PASS

- [x] **REFACTOR**: Extract helpers if the function gets long. Ensure node-type dispatch is clean (a map or switch, not nested ifs).

- [x] **COMMIT**: `feat: add Tiptap JSON to Markdown converter`

---

## Behavior 2: Clean HTML export

Tiptap's `.getHTML()` returns HTML with Tiptap-specific attributes and wrappers. The cleaner strips those to produce semantic HTML.

**Given** raw HTML from Tiptap's `.getHTML()` (contains `data-*` attributes, class names, etc.)
**When** `cleanHtml(rawHtml)` is called
**Then** it returns semantic HTML without Tiptap internals

- [x] **RED**: Write failing test
  - Location: `src/editor/htmlExporter.test.ts`
  - Test name: `test('strips data attributes from Tiptap HTML')`
  - Input: `'<p data-pm-slice="1 1 []">Hello</p>'`
  - Expected: `'<p>Hello</p>'`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Create `src/editor/htmlExporter.ts` with `cleanHtml()` using regex or DOM parsing to strip `data-*` attributes

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Add tests:
  - `test('preserves semantic tags like strong, em, h1, ul, ol, li, pre, code, a, blockquote')`
  - `test('removes Tiptap wrapper classes')`
  - `test('preserves href attributes on links')`

- [x] **RUN**: All HTML cleaner tests PASS

- [x] **REFACTOR**: Simplify regex patterns or switch to DOMParser approach if cleaner

- [x] **COMMIT**: `feat: add HTML export cleaner`

---

## Behavior 3: Export to file via save dialog

Orchestrates the full export flow: get content, convert to chosen format, open save dialog, write file.

**Given** a document title and editor content
**When** `exportToFile(title, content, html)` is called
**Then** it opens a save dialog with the title as default filename, and writes the converted content to the chosen path

- [x] **RED**: Write failing test
  - Location: `src/editor/exportService.test.ts`
  - Test name: `test('opens save dialog with filename derived from document title')`
  - Mock `@tauri-apps/plugin-dialog` `save()` and `@tauri-apps/plugin-fs` `writeTextFile()`
  - Call `exportToFile("My Blog Post", tiptapJson, rawHtml)`
  - Expected: `save()` called with `defaultPath` containing `"My-Blog-Post"` and filters for `.md` and `.html`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Create `src/editor/exportService.ts` with `exportToFile()`:
  - Derive filename from title (replace spaces, strip special chars)
  - Call Tauri `save()` dialog with filters
  - Based on chosen path extension, convert content (`.md` -> `toMarkdown`, `.html` -> `cleanHtml`)
  - Write file with `writeTextFile`

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Add tests:
  - `test('writes Markdown content when user picks .md extension')`
  - `test('writes cleaned HTML when user picks .html extension')`
  - `test('does nothing when user cancels the save dialog')` -- `save()` returns `null`
  - `test('returns a result indicating success or cancellation')` -- for StatusBar feedback

- [x] **RUN**: All export service tests PASS

- [x] **REFACTOR**: Ensure the filename derivation is a separate pure function if logic is non-trivial

- [x] **COMMIT**: `feat: add export-to-file service with save dialog`

---

## Behavior 4: Copy as Markdown to clipboard

**Given** editor content as Tiptap JSON
**When** `copyAsMarkdown(content)` is called
**Then** the full Markdown text is written to the system clipboard

- [x] **RED**: Write failing test
  - Location: add to `src/editor/exportService.test.ts`
  - Test name: `test('copies markdown text to clipboard')`
  - Mock `navigator.clipboard.writeText`
  - Call `copyAsMarkdown(tiptapJson)`
  - Expected: `navigator.clipboard.writeText` called with the Markdown string

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Add `copyAsMarkdown()` to `exportService.ts` -- calls `toMarkdown` then `navigator.clipboard.writeText`

- [x] **RUN**: Confirm test PASSES

- [x] **COMMIT**: `feat: add copy-as-markdown to clipboard`

---

## Behavior 5: StatusBar shows confirmation message

**Given** a successful export or copy action
**When** the action completes
**Then** the StatusBar briefly shows "Exported!" or "Copied to clipboard!" then reverts to normal

- [x] **RED**: Write failing test
  - Location: `src/editor/StatusBar.test.tsx` (new file)
  - Test name: `test('displays a temporary message when message prop is provided')`
  - Render `<StatusBar saveStatus="saved" message="Exported!" />`
  - Expected: screen has text "Exported!"

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Add optional `message` prop to `StatusBar`. When present, display it. The auto-dismiss timer logic lives in the parent (App.tsx), keeping StatusBar a pure display component.

- [x] **RUN**: Confirm test PASSES

- [x] **RED**: Add test:
  - `test('shows save status when no message is present')` -- existing behavior preserved

- [x] **RUN**: All StatusBar tests PASS

- [x] **REFACTOR**: None expected -- keep StatusBar simple

- [x] **COMMIT**: `feat: StatusBar supports temporary confirmation messages`

---

## Behavior 6: Wire export commands into command palette and App

Connect the existing placeholder command to the real export flow. Add the missing commands for granular export actions.

**Given** the command palette has export-related commands registered
**When** the user selects "Export to file..." or "Copy as Markdown"
**Then** the corresponding export function is called

- [x] **RED**: Write failing test
  - Location: update `src/shell/commandRegistry.test.ts`
  - Test name: `test('includes export-file and copy-markdown commands')`
  - Call `getAllCommands()`
  - Expected: commands list contains `{ id: "export-file", ... }` and `{ id: "copy-markdown", ... }`

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Update `commandRegistry.ts`:
  - Replace the single `"export"` placeholder with:
    - `{ id: "export-file", label: "Export to file...", shortcut: "Mod+Shift+E", category: "document" }`
    - `{ id: "copy-markdown", label: "Copy as Markdown", shortcut: "Mod+Shift+C", category: "document" }`

- [x] **RUN**: Confirm test PASSES

- [x] **GREEN**: Wire `App.tsx` -- in `handleCommandSelect`, add cases for `"export-file"` and `"copy-markdown"` that call the export service functions, then set a temporary StatusBar message

- [x] **RUN**: Full test suite PASSES (no regressions from command registry changes)

- [x] **COMMIT**: `feat: wire export commands into palette and app`

---

## Edge Cases (Moderate Risk)

- [x] **RED**: `test('converts empty document to empty string')` in `markdownConverter.test.ts`
  - Input: `{ type: "doc", content: [] }`
  - Expected: `""`

- [x] **GREEN -> REFACTOR**

- [x] **RED**: `test('derives safe filename from title with special characters')` in `exportService.test.ts`
  - Input: title `"My Post: A Journey! (Part 1)"`
  - Expected: filename contains `"My-Post-A-Journey-Part-1"` (no colons, bangs, parens)

- [x] **GREEN -> REFACTOR**

- [x] **RED**: `test('derives filename Untitled when title is empty')` in `exportService.test.ts`
  - Input: title `""`
  - Expected: filename contains `"Untitled"`

- [x] **GREEN -> REFACTOR**

- [x] **RED**: `test('handles nested lists in Markdown conversion')` in `markdownConverter.test.ts`
  - Input: bullet list with a nested bullet list
  - Expected: nested items indented with spaces

- [x] **GREEN -> REFACTOR**

- [x] **RED**: `test('handles combined marks like bold-italic')` in `markdownConverter.test.ts`
  - Input: text node with both bold and italic marks
  - Expected: `"***text***"`

- [x] **GREEN -> REFACTOR**

- [x] **COMMIT**: `test: export edge cases`

---

## Final Check

- [x] **Run full test suite**: `npm test` -- all tests pass
- [x] **Review test names**: Read them top to bottom -- do they describe the export feature clearly?
- [x] **Review implementation**: No dead code, no unused parameters, no over-engineering

## Test Summary
| Category | # Tests | Status |
|----------|---------|--------|
| Markdown conversion | ~12 | pending |
| HTML cleaning | ~4 | pending |
| Export to file | ~4 | pending |
| Copy to clipboard | ~1 | pending |
| StatusBar message | ~2 | pending |
| Command wiring | ~1 | pending |
| Edge cases | ~5 | pending |
| **Total** | **~29** | pending |

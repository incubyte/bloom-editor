# TDD Plan: Keyboard-First UX and Command Palette -- Slice 5

## Execution Instructions
Read this plan. Work on every item in order.
Mark each checkbox done as you complete it (`[ ]` to `[x]`).
Continue until all items are done.
If stuck after 3 attempts, mark with a warning and move to the next independent step.

## Context
- **Source**: `docs/specs/ai-blog-editor-phase-1.md`
- **Slice**: 5 -- Keyboard-First UX and Command Palette
- **Risk level**: MODERATE
- **Design brief**: `.claude/DESIGN.md`
- **Module boundaries**: `shell/` owns command palette, `editor/` owns formatting shortcuts

### Acceptance Criteria (from spec)
1. Command palette opens with Cmd+K (macOS) / Ctrl+K (Linux/Windows)
2. Command palette shows a searchable list of all available actions, filtered as the user types
3. Command palette includes: all formatting actions, new document, toggle sidebar, toggle dark/light mode, toggle Zen Mode, export actions, and search by document title
4. Selecting a document title in the command palette opens that document
5. Command palette shows keyboard shortcuts next to each action
6. Recently used actions or recent files appear at the top of the command palette when first opened
7. Escape closes the command palette (and any other overlay)
8. All formatting actions listed in Slice 2 have keyboard shortcuts that work without opening the command palette
9. New document shortcut: Cmd+N / Ctrl+N
10. Toggle sidebar shortcut exists and works

### What already exists
- Tiptap provides formatting shortcuts (Cmd+B, Cmd+I, Cmd+E, Cmd+Z, Cmd+Shift+Z) via StarterKit
- `useZenMode` hook with `toggleZenMode` and `exitZenMode`
- `useDocumentManager` exposes `createNewDocument`, `selectDocument`, `toggleCollapse`, `filteredDocuments`
- Escape already exits Zen Mode (wired in `App.tsx`)
- Sidebar collapse toggle already works

### What we build
- A **command registry** (pure data + functions) -- the canonical list of all actions
- A **filter function** for searching commands by name
- A **recent actions tracker** (pure logic with localStorage)
- A **CommandPalette component** in `shell/`
- Keyboard shortcut wiring for Cmd+K, Cmd+N, Cmd+\\ (toggle sidebar)

## Codebase Analysis

### File Structure
- Command registry (pure logic): `src/shell/commandRegistry.ts`
- Command registry tests: `src/shell/commandRegistry.test.ts`
- Recent actions tracker: `src/shell/recentActions.ts`
- Recent actions tests: `src/shell/recentActions.test.ts`
- Command palette component: `src/shell/CommandPalette.tsx`
- Command palette tests: `src/shell/CommandPalette.test.tsx`
- Command palette styles: `src/shell/CommandPalette.css`
- Integration: wired into `src/App.tsx`

### Test Infrastructure
- Framework: Vitest + React Testing Library + jsdom
- Run command: `npx vitest run`
- Setup file: `src/test-setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Conventions: co-located test files (`*.test.ts` / `*.test.tsx`), `describe`/`test`/`expect` from vitest

### Design constraints (from `.claude/DESIGN.md`)
- Command palette: `shadow-lg` (`0 8px 24px rgba(0,0,0,0.08)`), `12px` border radius (modal)
- Input fields: `36px` height, `border-default` border, accent focus ring
- Background: `bg-elevated` (`#FFFFFF`)
- Font: Inter `ui` size (14px) for list items, `ui-tiny` (11px) for shortcut hints
- Keyboard shortcuts text: `text-tertiary` color

---

## Step 1: Command registry -- define and retrieve commands

**Given** a command registry with all Bloom actions registered
**When** I call `getAllCommands()`
**Then** I get an array of command objects, each with `id`, `label`, `shortcut` (optional), and `category`

- [x] **RED**: Write failing test
  - Location: `src/shell/commandRegistry.test.ts`
  - Test name: `test('getAllCommands returns all registered commands with required fields')`
  - Assert: result is an array, each item has `id` (string), `label` (string), `category` (string). Assert known commands exist: `"new-document"`, `"toggle-sidebar"`, `"toggle-zen-mode"`, `"bold"`, `"italic"`. Assert commands with shortcuts have a `shortcut` string.

- [x] **RUN**: Confirm test FAILS (module does not exist)

- [x] **GREEN**: Implement `commandRegistry.ts`
  - Define a `Command` type: `{ id: string; label: string; shortcut?: string; category: 'formatting' | 'navigation' | 'document' | 'view' }`
  - Create a `COMMANDS` array with all entries (formatting: bold, italic, heading 1/2/3, bullet list, ordered list, code block, inline code, blockquote, link, undo, redo; document: new document; navigation: toggle sidebar; view: toggle zen mode, toggle dark/light mode (placeholder), export (placeholder))
  - Export `getAllCommands()` returning a copy of the array

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: Ensure categories are consistent, shortcuts use platform-agnostic format (e.g., `"Mod+B"` displayed as Cmd/Ctrl based on OS)

- [x] **COMMIT**: `feat: add command registry with all Bloom actions`

---

## Step 2: Filter commands by search query

**Given** the full command list
**When** I call `filterCommands(commands, "bold")`
**Then** I get only commands whose label matches the query (case-insensitive, substring match)

- [x] **RED**: Write failing test
  - Location: `src/shell/commandRegistry.test.ts`
  - Test name: `test('filterCommands returns commands matching the query case-insensitively')`
  - Input: full command list, query `"head"`
  - Expected: returns only Heading 1, Heading 2, Heading 3
  - Additional assertion: empty query returns all commands

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement `filterCommands(commands, query)` in `commandRegistry.ts`
  - Lowercase both label and query, use `includes`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None expected -- function is trivial

- [x] **COMMIT**: `feat: add filterCommands for command palette search`

---

## Step 3: Merge document titles into the command list

**Given** a list of documents from `useDocumentManager`
**When** I call `mergeDocumentCommands(commands, documents)`
**Then** the result includes document entries with `category: 'document'` and `id: 'open-doc:{docId}'`

- [x] **RED**: Write failing test
  - Location: `src/shell/commandRegistry.test.ts`
  - Test name: `test('mergeDocumentCommands adds document titles as openable commands')`
  - Input: base commands + array of `[{ id: "abc", title: "My Post" }, { id: "def", title: "Draft Ideas" }]`
  - Expected: result contains two extra commands with labels `"My Post"`, `"Draft Ideas"`, category `"document"`, no shortcut

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement `mergeDocumentCommands(commands, documents)`
  - Map each document to a Command with `id: "open-doc:${doc.id}"`, `label: doc.title`, `category: "document"`
  - Concatenate with base commands and return

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None expected

- [x] **COMMIT**: `feat: merge document titles into command palette list`

---

## Step 4: Recent actions tracking

**Given** the recent actions tracker (localStorage-backed)
**When** I record actions `"bold"`, `"italic"`, `"bold"` and then call `getRecentActions()`
**Then** I get `["bold", "italic"]` (most recent first, deduplicated)

- [x] **RED**: Write failing tests
  - Location: `src/shell/recentActions.test.ts`
  - Test 1: `test('getRecentActions returns empty array when nothing recorded')`
  - Test 2: `test('recordAction stores action ids and getRecentActions returns most recent first, deduplicated')`
    - Record `"bold"`, `"italic"`, `"bold"`
    - Expected: `["bold", "italic"]`
  - Test 3: `test('getRecentActions caps at a maximum number of entries')`
    - Record 20 distinct actions, expect result length capped (e.g., 10)

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Implement `recentActions.ts`
  - `recordAction(id: string)` -- read from localStorage, prepend, deduplicate, cap at max, write back
  - `getRecentActions(): string[]` -- read from localStorage, return array
  - `clearRecentActions()` -- for testing
  - Use a localStorage key like `"bloom:recent-actions"`

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Extract localStorage key as constant

- [x] **COMMIT**: `feat: add recent actions tracker with localStorage persistence`

---

## Step 5: Sort commands with recents at top

**Given** a command list and recent action ids `["toggle-zen-mode", "bold"]`
**When** I call `sortByRecency(commands, recentIds)`
**Then** `"toggle-zen-mode"` and `"bold"` appear first (in that order), followed by the rest in original order

- [x] **RED**: Write failing test
  - Location: `src/shell/commandRegistry.test.ts`
  - Test name: `test('sortByRecency places recent commands at the top in recency order')`
  - Input: 5 commands, recentIds `["c", "a"]`
  - Expected: first two results have ids `"c"` and `"a"`, remaining maintain original order

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Implement `sortByRecency(commands, recentIds)` in `commandRegistry.ts`
  - Partition commands into "recent" and "rest", order "recent" by position in recentIds array

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None expected

- [x] **COMMIT**: `feat: add sortByRecency for command palette ordering`

---

## Step 6: CommandPalette component -- renders and filters

**Given** the CommandPalette component is open
**When** I type into the search input
**Then** the visible list filters to matching commands

- [x] **RED**: Write failing tests
  - Location: `src/shell/CommandPalette.test.tsx`
  - Test 1: `test('renders a search input and a list of commands when open')`
    - Render `<CommandPalette isOpen={true} commands={mockCommands} onSelect={vi.fn()} onClose={vi.fn()} />`
    - Assert: search input is in the document, command labels are visible
  - Test 2: `test('filters commands as user types in the search input')`
    - Render with 5 commands, type `"zen"` into input
    - Assert: only the Zen Mode command is visible
  - Test 3: `test('does not render anything when isOpen is false')`
    - Render with `isOpen={false}`
    - Assert: no search input in the document

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Implement `CommandPalette.tsx`
  - Props: `isOpen`, `commands`, `onSelect(commandId)`, `onClose()`
  - Internal state: `query` string
  - Render: backdrop overlay, modal with search input, filtered command list
  - Each list item shows `label` and `shortcut` (if present)
  - Use `filterCommands` from registry

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Add `CommandPalette.css` with design tokens from DESIGN.md (shadow-lg, 12px radius, bg-elevated)

- [x] **COMMIT**: `feat: add CommandPalette component with search filtering`

---

## Step 7: CommandPalette -- selecting a command and closing with Escape

**Given** the CommandPalette is open with commands visible
**When** the user clicks a command item
**Then** `onSelect` is called with that command's `id`
**And when** the user presses Escape
**Then** `onClose` is called

- [x] **RED**: Write failing tests
  - Location: `src/shell/CommandPalette.test.tsx`
  - Test 1: `test('calls onSelect with command id when a command is clicked')`
    - Render with `onSelect` spy, click a command item
    - Assert: `onSelect` called with the correct command id
  - Test 2: `test('calls onClose when Escape is pressed')`
    - Render with `onClose` spy, press Escape key
    - Assert: `onClose` called once
  - Test 3: `test('calls onClose when backdrop is clicked')`
    - Render, click the backdrop overlay
    - Assert: `onClose` called

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Add click handlers to command items, keyboard listener for Escape, backdrop click handler

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Ensure the search input auto-focuses when the palette opens

- [x] **COMMIT**: `feat: command palette selection and dismiss behavior`

---

## Step 8: CommandPalette -- keyboard navigation with arrow keys

**Given** the command palette is open with a filtered list
**When** the user presses ArrowDown/ArrowUp
**Then** the highlighted item moves accordingly
**And when** the user presses Enter
**Then** the highlighted item is selected

- [x] **RED**: Write failing tests
  - Location: `src/shell/CommandPalette.test.tsx`
  - Test 1: `test('ArrowDown moves highlight to next item')`
    - Render with 3 commands, press ArrowDown twice
    - Assert: third item has active/highlighted styling (aria-selected or data attribute)
  - Test 2: `test('Enter selects the highlighted item')`
    - Render, press ArrowDown once, press Enter
    - Assert: `onSelect` called with second command's id

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Add `highlightedIndex` state, keydown handler for ArrowDown/ArrowUp/Enter, reset highlight when query changes

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Ensure highlight wraps around (ArrowDown on last item goes to first). Ensure highlighted item scrolls into view.

- [x] **COMMIT**: `feat: keyboard navigation in command palette`

---

## Step 9: Shortcut display -- commands show their keyboard shortcut

**Given** a command with `shortcut: "Mod+B"`
**When** the CommandPalette renders that command
**Then** the shortcut is displayed next to the label, formatted for the current platform (Cmd on macOS, Ctrl on others)

- [x] **RED**: Write failing tests
  - Location: `src/shell/commandRegistry.test.ts`
  - Test 1: `test('formatShortcut converts Mod to Cmd on macOS')`
    - Input: `"Mod+B"`, platform: `"mac"`
    - Expected: contains the appropriate platform symbol/text (e.g., displays with the proper modifier)
  - Test 2: `test('formatShortcut converts Mod to Ctrl on non-macOS')`
    - Input: `"Mod+B"`, platform: `"other"`

  - Location: `src/shell/CommandPalette.test.tsx`
  - Test 3: `test('displays formatted keyboard shortcut next to command label')`
    - Render with a command that has `shortcut: "Mod+B"`
    - Assert: shortcut text is visible in the rendered output

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Implement `formatShortcut(shortcut, platform)` in `commandRegistry.ts`. Update CommandPalette to render shortcut using this function.

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Use `navigator.platform` or `navigator.userAgent` to auto-detect platform in the component

- [x] **COMMIT**: `feat: display platform-appropriate shortcuts in command palette`

---

## Step 10: Wire Cmd+K, Cmd+N, and sidebar toggle shortcut in App

**Given** the app is running
**When** the user presses Cmd+K (macOS) or Ctrl+K
**Then** the command palette opens
**And when** the user presses Cmd+N or Ctrl+N
**Then** a new document is created
**And when** the user presses Cmd+\\ or Ctrl+\\
**Then** the sidebar toggles

- [x] **RED**: Write failing tests
  - Location: `src/shell/CommandPalette.test.tsx` (or a new `src/shell/useKeyboardShortcuts.test.ts`)
  - Test 1: `test('useKeyboardShortcuts calls onTogglePalette when Mod+K is pressed')`
    - Use `renderHook` with a callback spy
    - Simulate `keydown` event with `metaKey: true, key: "k"`
    - Assert: callback called
  - Test 2: `test('useKeyboardShortcuts calls onNewDocument when Mod+N is pressed')`
    - Simulate keydown with `metaKey: true, key: "n"`
    - Assert: callback called
  - Test 3: `test('useKeyboardShortcuts calls onToggleSidebar when Mod+\\ is pressed')`
    - Simulate keydown with `metaKey: true, key: "\\"`
    - Assert: callback called

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Implement `useKeyboardShortcuts(handlers)` hook in `src/shell/useKeyboardShortcuts.ts`
  - Listens for global keydown events
  - Maps Cmd/Ctrl+K to `handlers.onTogglePalette`
  - Maps Cmd/Ctrl+N to `handlers.onNewDocument`
  - Maps Cmd/Ctrl+\\ to `handlers.onToggleSidebar`
  - Calls `event.preventDefault()` to prevent browser defaults

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Consolidate with the existing Escape handler in App.tsx

- [x] **COMMIT**: `feat: add global keyboard shortcuts for palette, new doc, sidebar toggle`

---

## Edge Cases (MODERATE risk)

### Empty state
- [x] **RED**: `test('command palette shows "No results" when filter matches nothing')`
  - Type a nonsense query like `"zzzzz"`
  - Assert: "No results" message is visible, no command items rendered
- [x] **GREEN then REFACTOR**

### Special characters in search
- [x] **RED**: `test('filterCommands handles special regex characters in query safely')`
  - Input: query `"(bold"`
  - Assert: does not throw, returns empty array (no match)
- [x] **GREEN then REFACTOR**

### Rapid open/close
- [x] **RED**: `test('opening palette resets search query and highlight')`
  - Open palette, type query, close, reopen
  - Assert: search input is empty, no item highlighted
- [x] **GREEN then REFACTOR**

- [x] **COMMIT**: `test: command palette edge cases`

---

## Final Check

- [x] **Run full test suite**: `npx vitest run` -- all tests pass (existing 42 + new 24 = 66 total)
- [x] **Review test names**: Read them top to bottom -- do they describe the feature clearly?
- [x] **Review implementation**: Is there dead code? Unused parameters? Overly complex logic?
- [x] **Verify module boundaries**: command palette code lives in `shell/`, no forbidden cross-module imports

## Test Summary
| Category | # Tests | Status |
|----------|---------|--------|
| Command registry (pure) | ~5 | Pending |
| Recent actions (pure) | ~3 | Pending |
| CommandPalette component | ~10 | Pending |
| Keyboard shortcuts hook | ~3 | Pending |
| Edge cases | ~3 | Pending |
| **Total** | **~24** | Pending |

## Architecture Notes

The command palette follows a clean separation:

1. **Pure logic** (easy to test, no React):
   - `commandRegistry.ts` -- command definitions, filtering, sorting, shortcut formatting
   - `recentActions.ts` -- localStorage-backed recency tracking

2. **Component** (React Testing Library):
   - `CommandPalette.tsx` -- UI rendering, keyboard navigation, search interaction

3. **Hook** (renderHook tests):
   - `useKeyboardShortcuts.ts` -- global shortcut listener

4. **Integration** (wired in `App.tsx`):
   - Palette state management (open/close)
   - Connecting `onSelect` to actual actions (`createNewDocument`, `selectDocument`, `toggleCollapse`, `toggleZenMode`, editor formatting commands)
   - Passing document list to `mergeDocumentCommands`

The integration wiring in `App.tsx` is straightforward prop-passing and is verified visually rather than with integration tests -- keeping the test suite fast and focused on logic.

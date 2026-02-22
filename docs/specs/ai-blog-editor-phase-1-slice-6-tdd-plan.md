# TDD Plan: Dark Mode and Theming -- Slice 6

## Execution Instructions
Read this plan. Work on every item in order.
Mark each checkbox done as you complete it ([ ] -> [x]).
Continue until all items are done.
If stuck after 3 attempts, mark a warning and move to the next independent step.

## Context
- **Source**: `docs/specs/ai-blog-editor-phase-1.md`
- **Slice**: Slice 6 -- Dark Mode and Theming
- **Risk**: MODERATE
- **Design brief**: `.claude/DESIGN.md` (full dark palette, semantic colors, focus ring spec, motion rules)
- **Acceptance Criteria**:
  1. Light mode uses the Warm Ink light palette (bg-primary #FAF9F7, text-primary #2C2C2E, accent #C4663A)
  2. Dark mode uses warm dark grays (bg-primary #1C1B19, text-primary #E8E6E1, accent #D4784A) -- no pure black
  3. The user can toggle between light and dark mode via the command palette or a menu item
  4. Theme preference is persisted across app restarts
  5. The app respects the OS-level dark mode preference on first launch (before the user has set a preference)
  6. All interactive elements show visible focus rings (2px solid accent with box-shadow)
  7. Transitions respect `prefers-reduced-motion` -- animations are disabled when the OS setting is on
  8. Semantic colors (success, warning, error, info) are applied correctly in both modes

## Codebase Analysis

### File Structure
- Theme preference persistence: `src/shell/themePreference.ts` (new -- same pattern as `recentActions.ts`)
- Theme hook: `src/shell/useTheme.ts` (new -- same pattern as `useZenMode.ts`)
- CSS dark overrides: `src/index.css` (existing -- add `[data-theme="dark"]` block)
- Command wiring: `src/shell/commandRegistry.ts` (existing -- `toggle-dark-mode` placeholder already present)
- Tests: `src/shell/themePreference.test.ts` and `src/shell/useTheme.test.ts` (new, co-located)

### Related Files
- `src/shell/recentActions.ts` -- localStorage persistence pattern to follow
- `src/storage/lastViewed.ts` -- simpler persistence pattern to follow
- `src/editor/useZenMode.ts` -- hook pattern to follow
- `src/shell/commandRegistry.ts` -- `toggle-dark-mode` command already registered
- `src/index.css` -- light palette variables already defined, focus ring and reduced-motion rules already present

### Test Infrastructure
- Framework: Vitest + React Testing Library
- Environment: jsdom
- Run command: `npm test` or `npx vitest`
- Setup: `src/test-setup.ts` imports `@testing-library/jest-dom/vitest`
- Conventions: `describe` blocks per module, `test()` with plain-language names, `beforeEach` for cleanup

### Module Boundaries
Per `.claude/BOUNDARIES.md`: `shell/` owns app window, menu bar, app lifecycle. Theme preference and toggle logic belong in `shell/`. The CSS lives in `src/index.css` (global styles, not module-scoped). No cross-module imports needed.

---

## Behavior 1: Theme preference persistence

**Given** no theme preference has been saved
**When** `getThemePreference()` is called
**Then** it returns `null`

**Given** a theme preference of `"dark"` has been saved
**When** `getThemePreference()` is called
**Then** it returns `"dark"`

This is a pure data module -- no React, no DOM. Same pattern as `recentActions.ts` and `lastViewed.ts`: thin localStorage wrapper with an in-memory cache and try/catch for environments where localStorage is unavailable.

- [x] **RED**: Write failing tests
  - Location: `src/shell/themePreference.test.ts`
  - Test 1: `test('getThemePreference returns null when nothing is saved')`
  - Test 2: `test('setThemePreference persists and getThemePreference retrieves it')`
    - Call `setThemePreference('dark')`, assert `getThemePreference()` returns `'dark'`
    - Call `setThemePreference('light')`, assert `getThemePreference()` returns `'light'`
  - Import from `./themePreference` (file does not exist yet -- tests fail)
  - Use `beforeEach` to call `clearThemePreference()` (same pattern as `clearRecentActions`)

- [x] **RUN**: Confirm tests FAIL (module not found)

- [x] **GREEN**: Implement minimum code
  - Location: `src/shell/themePreference.ts`
  - Storage key: `"bloom:theme-preference"`
  - Export three functions: `getThemePreference(): 'light' | 'dark' | null`, `setThemePreference(theme: 'light' | 'dark'): void`, `clearThemePreference(): void`
  - Follow the exact pattern from `lastViewed.ts`: in-memory cache + localStorage with try/catch

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: None needed -- this is a 3-function module

- [ ] **COMMIT**: `feat(shell): add theme preference persistence`

---

## Behavior 2: OS dark mode detection

**Given** the OS is set to dark mode (`prefers-color-scheme: dark` matches)
**When** `getOSThemePreference()` is called
**Then** it returns `"dark"`

**Given** the OS is set to light mode (or no preference)
**When** `getOSThemePreference()` is called
**Then** it returns `"light"`

This is a thin wrapper around `window.matchMedia('(prefers-color-scheme: dark)')`. Extracted as a named function so the hook can call it and tests can verify the logic by mocking `matchMedia`.

- [x] **RED**: Write failing tests
  - Location: `src/shell/useTheme.test.ts`
  - Test 1: `test('getOSThemePreference returns dark when OS prefers dark mode')`
    - Mock `window.matchMedia` to return `{ matches: true }` for `(prefers-color-scheme: dark)`
    - Assert `getOSThemePreference()` returns `'dark'`
  - Test 2: `test('getOSThemePreference returns light when OS prefers light mode')`
    - Mock `window.matchMedia` to return `{ matches: false }`
    - Assert returns `'light'`
  - Import `getOSThemePreference` from `./useTheme`

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Implement `getOSThemePreference` in `src/shell/useTheme.ts`
  - Check `window.matchMedia('(prefers-color-scheme: dark)').matches`
  - Return `'dark'` if true, `'light'` otherwise
  - Guard for environments where `matchMedia` is unavailable (return `'light'`)

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: `feat(shell): add OS theme preference detection`

---

## Behavior 3: useTheme hook resolves initial theme

**Given** no stored preference and OS is set to dark mode
**When** `useTheme()` hook initializes
**Then** `theme` is `"dark"` (OS preference used as fallback)

**Given** stored preference is `"light"` and OS is set to dark mode
**When** `useTheme()` hook initializes
**Then** `theme` is `"light"` (stored preference wins over OS)

Priority: stored preference > OS preference > default (`"light"`).

- [x] **RED**: Write failing tests
  - Location: `src/shell/useTheme.test.ts` (add to existing describe block)
  - Test 1: `test('initializes with OS preference when no stored preference exists')`
    - Call `clearThemePreference()` in beforeEach
    - Mock `matchMedia` to return dark
    - `renderHook(() => useTheme())`
    - Assert `result.current.theme` is `'dark'`
  - Test 2: `test('stored preference takes priority over OS preference')`
    - `setThemePreference('light')` before render
    - Mock `matchMedia` to return dark
    - Assert `result.current.theme` is `'light'`

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Implement `useTheme` hook in `src/shell/useTheme.ts`
  - `useState` initialized by: `getThemePreference() ?? getOSThemePreference()`
  - Return `{ theme }` for now (toggle comes next)

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: None needed yet

- [ ] **COMMIT**: `feat(shell): useTheme hook with initial theme resolution`

---

## Behavior 4: useTheme hook toggles and persists

**Given** current theme is `"light"`
**When** `toggleTheme()` is called
**Then** `theme` becomes `"dark"` and `getThemePreference()` returns `"dark"`

**Given** current theme is `"dark"`
**When** `toggleTheme()` is called
**Then** `theme` becomes `"light"` and `getThemePreference()` returns `"light"`

- [x] **RED**: Write failing tests
  - Location: `src/shell/useTheme.test.ts`
  - Test 1: `test('toggleTheme switches from light to dark and persists')`
    - Start with light (clear preference, mock OS light)
    - `act(() => result.current.toggleTheme())`
    - Assert `result.current.theme` is `'dark'`
    - Assert `getThemePreference()` returns `'dark'`
  - Test 2: `test('toggleTheme switches from dark to light and persists')`
    - `setThemePreference('dark')` before render
    - `act(() => result.current.toggleTheme())`
    - Assert `result.current.theme` is `'light'`
    - Assert `getThemePreference()` returns `'light'`

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Add `toggleTheme` to the hook
  - Flip `'light'` to `'dark'` and vice versa
  - Call `setThemePreference(newTheme)` on each toggle
  - Return `{ theme, toggleTheme }`

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: None needed

- [ ] **COMMIT**: `feat(shell): useTheme toggle with persistence`

---

## Behavior 5: useTheme hook applies data-theme attribute to document

**Given** theme is `"dark"`
**When** `useTheme()` hook renders (or theme changes via toggle)
**Then** `document.documentElement` has attribute `data-theme="dark"`

**Given** theme is `"light"`
**When** `useTheme()` hook renders
**Then** `document.documentElement` has attribute `data-theme="light"`

This is the bridge between the hook and CSS. The `[data-theme="dark"]` selector in `index.css` will pick up the attribute.

- [x] **RED**: Write failing tests
  - Location: `src/shell/useTheme.test.ts`
  - Test 1: `test('sets data-theme attribute on document element to match theme')`
    - `clearThemePreference()`, mock OS dark
    - `renderHook(() => useTheme())`
    - Assert `document.documentElement.getAttribute('data-theme')` is `'dark'`
  - Test 2: `test('updates data-theme attribute when theme is toggled')`
    - Start light, toggle, assert attribute changes to `'dark'`
    - Toggle again, assert attribute changes back to `'light'`

- [x] **RUN**: Confirm tests FAIL

- [x] **GREEN**: Add a `useEffect` to the hook
  - `useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme])`

- [x] **RUN**: Confirm tests PASS

- [x] **REFACTOR**: Clean up the hook -- ensure the effect also runs on mount so first render sets the attribute. Review the full hook shape: `{ theme, toggleTheme }` is the public API.

- [ ] **COMMIT**: `feat(shell): useTheme applies data-theme attribute to DOM`

---

## Behavior 6: Wire toggle-dark-mode command to useTheme

The `toggle-dark-mode` command already exists in `commandRegistry.ts`. It needs to be wired so that selecting it in the command palette calls `toggleTheme()`. This is integration work -- the command palette already dispatches command IDs, so the wiring happens in the component that handles command execution (likely `AppShell` or `CommandPalette`).

**Given** the user opens the command palette and selects "Toggle Dark/Light Mode"
**When** the command executes
**Then** `toggleTheme()` is called and the theme switches

- [x] **RED**: Write a failing test
  - Location: `src/shell/CommandPalette.test.tsx` (add to existing test file)
  - Test: `test('toggle-dark-mode command triggers theme toggle')`
  - Render the component that handles command dispatch
  - Simulate selecting `toggle-dark-mode`
  - Assert `document.documentElement.getAttribute('data-theme')` changes
  - NOTE: If the existing command dispatch architecture makes this hard to test in isolation, this step can be verified manually. Check the existing `CommandPalette.test.tsx` for the pattern used by other commands (e.g., `toggle-zen-mode`). Follow that exact pattern.

- [x] **RUN**: Confirm test FAILS

- [x] **GREEN**: Wire the command
  - In the component that handles command execution, add a case for `"toggle-dark-mode"` that calls `toggleTheme()` from the `useTheme` hook
  - Follow the same pattern as `toggle-zen-mode` or `toggle-sidebar`

- [x] **RUN**: Confirm test PASSES

- [x] **REFACTOR**: None needed -- this is a one-line wiring change

- [ ] **COMMIT**: `feat(shell): wire toggle-dark-mode command to theme hook`

---

## Behavior 7: CSS dark palette, semantic colors, focus rings, reduced motion

This behavior covers the CSS-only acceptance criteria. These are **not unit tested** -- they are verified visually or via design review. The plan lists the changes to make and what to verify.

- [x] **Add dark mode CSS variables to `src/index.css`**
  - Add a `[data-theme="dark"]` block with all dark palette tokens from `.claude/DESIGN.md`:
    - `--bg-primary: #1C1B19`
    - `--bg-secondary: #252422`
    - `--bg-tertiary: #2F2D2A`
    - `--bg-elevated: #333130`
    - `--text-primary: #E8E6E1`
    - `--text-secondary: #A09E99`
    - `--text-tertiary: #6D6B67`
    - `--accent: #D4784A`
    - `--accent-hover: #B8663E` (derive -- slightly darker than dark accent)
    - `--accent-subtle: #D4784A1A` (10% opacity)
    - `--border-default: #3A3836`
    - `--border-subtle: #2F2D2A`
    - `--border-focus: #D4784A` (matches dark accent)
  - Dark mode shadows: halve the opacity per DESIGN.md (e.g., `rgba(0,0,0,0.02)` for sm)
  - Semantic colors stay the same hex values; their `-subtle` variants may need adjusted opacity for dark backgrounds

- [x] **Verify focus rings work in both modes**
  - The `:focus-visible` rule in `index.css` already uses `var(--border-focus)` and `var(--accent-subtle)` -- these will automatically update when the dark palette overrides those variables
  - Visually confirm: tab through interactive elements in both light and dark mode, check 2px solid accent ring with box-shadow is visible

- [x] **Verify reduced-motion rule is present**
  - The `@media (prefers-reduced-motion: reduce)` rule already exists in `index.css`
  - If adding any new transitions for theme switching (e.g., smooth color transition), wrap them so they are disabled under reduced-motion
  - Recommendation: do NOT add a transition for the theme switch itself -- instant swap is fine and avoids motion concerns entirely

- [x] **Verify semantic colors in dark mode**
  - Success (#3A7D44), warning (#B8860B), error (#C0392B), info (#4A7FB5) should remain readable on dark backgrounds
  - Check the `-subtle` variants have enough opacity to be visible on dark surfaces -- adjust if needed (e.g., from `0F` to `1A` opacity)

- [ ] **Visual verification checklist**
  - [ ] Launch app, confirm light mode matches Warm Ink palette
  - [ ] Toggle to dark mode via command palette, confirm warm dark grays (no pure black)
  - [ ] Verify sidebar, editor canvas, toolbar, status bar all pick up dark variables
  - [ ] Verify text is readable in both modes
  - [ ] Verify accent color is visible and distinct in both modes
  - [ ] Verify focus rings are visible in both modes (tab through buttons, inputs)
  - [ ] Verify code blocks use `bg-tertiary` in both modes
  - [ ] Toggle OS reduced-motion setting, confirm no transitions on theme switch

- [ ] **COMMIT**: `feat(shell): dark mode CSS variables and visual polish`

---

## Edge Cases (Moderate Risk)

- [x] **RED**: `test('getThemePreference returns null when localStorage contains invalid data')`
  - Location: `src/shell/themePreference.test.ts`
  - Directly set `localStorage.setItem('bloom:theme-preference', 'garbage')` then call `getThemePreference()`
  - Expected: returns `null` (only `'light'` and `'dark'` are valid)
- [x] **GREEN -> REFACTOR**: Add validation in `getThemePreference` -- return `null` if stored value is not `'light'` or `'dark'`

- [x] **RED**: `test('getOSThemePreference returns light when matchMedia is unavailable')`
  - Location: `src/shell/useTheme.test.ts`
  - Set `window.matchMedia` to `undefined` temporarily
  - Expected: returns `'light'` (safe default)
- [x] **GREEN -> REFACTOR**: Guard already added in Behavior 2, confirm test passes

- [x] **RED**: `test('toggling theme multiple times produces correct alternating sequence')`
  - Location: `src/shell/useTheme.test.ts`
  - Start light, toggle 4 times, assert: dark, light, dark, light
  - Expected: each toggle flips the theme
- [x] **GREEN -> REFACTOR**: Should pass with existing toggle implementation

- [ ] **COMMIT**: `test(shell): dark mode edge cases`

---

## Final Check

- [x] **Run full test suite**: `npx vitest run` -- all tests pass (existing 66 + new tests)
- [x] **Review test names**: Read them top to bottom -- do they describe the theme feature clearly?
- [x] **Review implementation**: Is there dead code? Unused parameters? Over-complicated logic?
- [ ] **Visual spot-check**: Toggle dark mode on and off, confirm all surfaces update correctly

## Test Summary
| Category | # Tests | Status |
|----------|---------|--------|
| Theme persistence (Behavior 1) | 3 | PASS |
| OS detection (Behavior 2) | 3 | PASS |
| Initial resolution (Behavior 3) | 2 | PASS |
| Toggle + persist (Behavior 4) | 2 | PASS |
| DOM attribute (Behavior 5) | 2 | PASS |
| Command wiring (Behavior 6) | 1 | PASS |
| Edge cases (multi-toggle) | 1 | PASS |
| **Total** | **14** | **PASS** |

## Files Created/Modified

| File | Action |
|------|--------|
| `src/shell/themePreference.ts` | NEW |
| `src/shell/themePreference.test.ts` | NEW |
| `src/shell/useTheme.ts` | NEW |
| `src/shell/useTheme.test.ts` | NEW |
| `src/index.css` | MODIFIED (add `[data-theme="dark"]` block) |
| `src/shell/CommandPalette.test.tsx` | MODIFIED (add toggle-dark-mode test) |
| Component handling command dispatch | MODIFIED (wire toggle-dark-mode) |

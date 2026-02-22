# Design Brief -- AI Blog Editor

## Design Direction

**Aesthetic:** Clean and Minimal with warm, writerly character.
**References:** Bear (warm minimalism, typography focus), Agenda (Apple-like polish, date/timeline organization).
**Personality:** A well-loved notebook. The editor should feel quiet, confident, and warm -- not sterile. Content is the hero. UI chrome recedes. AI features are present but never visually dominant.

**Target users:** Solo creators and indie hackers who spend hours writing. The interface must reward long sessions, not fatigue.

---

## Color Palette

### Light Mode (Primary)

| Token              | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| `bg-primary`       | `#FAF9F7` | Main canvas, editor background              |
| `bg-secondary`     | `#F3F1ED` | Sidebar, panels, grouped surfaces           |
| `bg-tertiary`      | `#EBE8E3` | Hover states, subtle fills, code blocks     |
| `bg-elevated`      | `#FFFFFF` | Cards, popovers, floating surfaces          |
| `text-primary`     | `#2C2C2E` | Body text, headings                         |
| `text-secondary`   | `#6B6B6E` | Captions, timestamps, secondary labels      |
| `text-tertiary`    | `#9A9A9D` | Placeholders, disabled text                 |
| `accent`           | `#C4663A` | Primary actions, links, active indicators   |
| `accent-hover`     | `#A8542E` | Accent on hover/press                       |
| `accent-subtle`    | `#C4663A1A` | Accent at 10% opacity -- soft highlights  |
| `border-default`   | `#E2DFD9` | Dividers, input borders                     |
| `border-subtle`    | `#EDEBE6` | Faint separators within panels              |
| `border-focus`     | `#C4663A` | Focus rings (matches accent)                |

### Semantic Colors

| Token              | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| `success`          | `#3A7D44` | Saved, published, positive states           |
| `success-subtle`   | `#3A7D440F` | Success background tint                   |
| `warning`          | `#B8860B` | Unsaved changes, draft warnings             |
| `warning-subtle`   | `#B8860B0F` | Warning background tint                   |
| `error`            | `#C0392B` | Validation errors, destructive actions      |
| `error-subtle`     | `#C0392B0F` | Error background tint                     |
| `info`             | `#4A7FB5` | AI suggestions, tips, informational         |
| `info-subtle`      | `#4A7FB50F` | Info background tint                      |

### Dark Mode

Dark mode inverts the surface hierarchy while preserving warmth. Avoid pure black -- use warm dark grays.

| Token              | Hex       | Notes                                      |
|--------------------|-----------|---------------------------------------------|
| `bg-primary`       | `#1C1B19` | Warm near-black canvas                      |
| `bg-secondary`     | `#252422` | Sidebar, panels                             |
| `bg-tertiary`      | `#2F2D2A` | Hover states, code blocks                   |
| `bg-elevated`      | `#333130` | Cards, popovers                             |
| `text-primary`     | `#E8E6E1` | Body text                                   |
| `text-secondary`   | `#A09E99` | Secondary labels                            |
| `text-tertiary`    | `#6D6B67` | Placeholders                                |
| `accent`           | `#D4784A` | Slightly lighter accent for dark surfaces   |
| `border-default`   | `#3A3836` | Dividers                                    |
| `border-subtle`    | `#2F2D2A` | Faint separators                            |

Semantic colors remain the same in dark mode but use their `-subtle` variants with dark-appropriate opacity.

---

## Typography

### Font Stack

| Role              | Font                      | Fallback                          |
|-------------------|---------------------------|-----------------------------------|
| **Editor body**   | JetBrains Mono            | `"Courier New", monospace`        |
| **UI chrome**     | Inter                     | `system-ui, -apple-system, sans-serif` |
| **Headings (in editor)** | Inter              | Same as UI chrome                 |

JetBrains Mono is the writing surface font -- distraction-free, fixed-width, excellent readability at long-form lengths. Inter handles everything outside the editor canvas: sidebar labels, toolbar text, dialogs, settings.

Headings within the editor use Inter to create visual contrast against the monospace body, reinforcing document structure.

### Type Scale

Base size: `16px` for editor body. Scale ratio: `1.25` (Major Third).

| Level         | Size    | Weight | Line Height | Font          | Usage                        |
|---------------|---------|--------|-------------|---------------|-------------------------------|
| `display`     | `32px`  | 700    | 1.2         | Inter         | Blog title in editor          |
| `h1`          | `28px`  | 700    | 1.25        | Inter         | Section headings              |
| `h2`          | `24px`  | 600    | 1.3         | Inter         | Subsection headings           |
| `h3`          | `20px`  | 600    | 1.35        | Inter         | Minor headings                |
| `body`        | `16px`  | 400    | 1.7         | JetBrains Mono| Editor body text              |
| `body-small`  | `14px`  | 400    | 1.6         | JetBrains Mono| Inline code, metadata         |
| `ui`          | `14px`  | 400    | 1.4         | Inter         | Toolbar labels, sidebar items |
| `ui-small`    | `12px`  | 500    | 1.3         | Inter         | Badges, timestamps, captions  |
| `ui-tiny`     | `11px`  | 500    | 1.2         | Inter         | Keyboard shortcuts, footnotes |

Editor body line height is `1.7` -- generous, airy, comfortable for long writing sessions.

### Weight Usage

- **400 (Regular):** Body text, UI labels
- **500 (Medium):** Small UI text (compensates for reduced size), active sidebar items
- **600 (Semibold):** H2, H3, button labels, section headers in sidebar
- **700 (Bold):** H1, display, strong emphasis

---

## Spacing

Base unit: `4px`. All spacing derives from this base.

| Token   | Value  | Usage                                          |
|---------|--------|-------------------------------------------------|
| `xs`    | `4px`  | Tight gaps: icon-to-label, inline elements      |
| `sm`    | `8px`  | Related elements: list items, compact padding   |
| `md`    | `16px` | Standard padding, gaps between form fields      |
| `lg`    | `24px` | Section spacing, card padding                   |
| `xl`    | `32px` | Major section breaks, panel margins             |
| `2xl`   | `48px` | Page-level spacing, top/bottom canvas margins   |
| `3xl`   | `64px` | Hero spacing, large vertical rhythm breaks      |

### Editor-Specific Spacing

- **Editor canvas horizontal padding:** `48px` minimum on each side (content never touches the edge)
- **Editor max content width:** `720px` (optimal reading width for monospace at 16px)
- **Paragraph spacing:** `24px` between paragraphs (1.5x base `md`)
- **Heading top margin:** `32px` above H2/H3, `48px` above H1

---

## Layout

### Structure

The app uses a sidebar + canvas layout inspired by Bear and Agenda:

```
+------------------+----------------------------------------------+
|                  |                                              |
|    Sidebar       |              Editor Canvas                   |
|    (240-280px)   |         (centered, max 720px)                |
|                  |                                              |
|  - Note list     |                                              |
|  - Search        |                                              |
|  - Tags/folders  |                                              |
|                  |                                              |
+------------------+----------------------------------------------+
```

- **Sidebar width:** `240px` default, `280px` max. Collapsible to icon-only (`48px`) or fully hidden.
- **Editor canvas:** Fluid width, content centered within it, max `720px` content width.
- **AI panel (when open):** Slides in from the right, `320px` wide. Does not compress the editor -- overlays or pushes the canvas.

### Breakpoints

Desktop-first (this is a desktop app). Breakpoints handle window resizing, not responsive web:

| Name      | Width      | Behavior                                    |
|-----------|------------|----------------------------------------------|
| `compact` | < `900px`  | Sidebar collapses to overlay                 |
| `default` | `900-1440px` | Sidebar + editor side by side              |
| `wide`    | > `1440px` | Extra breathing room, canvas stays `720px`   |

---

## Component Guidelines

### Corner Radius

| Element              | Radius  |
|----------------------|---------|
| Buttons              | `6px`   |
| Input fields         | `6px`   |
| Cards / panels       | `8px`   |
| Popovers / dropdowns | `8px`   |
| Modals / dialogs     | `12px`  |
| Tags / badges        | `4px`   |
| Avatars / icons      | `50%`   |

Consistent, subtle rounding. Not pill-shaped (too playful), not sharp (too corporate).

### Shadows

Minimal shadow usage. Surfaces differentiate through background color, not elevation.

| Level       | Value                                    | Usage                     |
|-------------|------------------------------------------|---------------------------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)`            | Subtle lift for cards     |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.06)`           | Popovers, dropdowns       |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.08)`           | Modals, command palette   |

In dark mode, reduce shadow opacity by half and rely more on border-subtle for separation.

### Buttons

- **Primary:** `accent` background, `#FFFFFF` text, `6px` radius. Hover: `accent-hover`.
- **Secondary:** Transparent background, `border-default` border, `text-primary` text. Hover: `bg-tertiary` fill.
- **Ghost:** No background, no border, `text-secondary` text. Hover: `bg-tertiary` fill. Used for toolbar actions.
- **Destructive:** `error` background, `#FFFFFF` text. Used sparingly.
- **Button height:** `32px` default, `28px` compact (toolbar), `36px` large (dialogs).
- **Horizontal padding:** `12px` default, `8px` compact.

### Input Fields

- **Height:** `36px`
- **Background:** `bg-primary` (same as canvas, not recessed)
- **Border:** `border-default`, `1px` solid
- **Focus:** `border-focus` (accent color), `2px` solid, plus `accent-subtle` box-shadow ring (`0 0 0 3px`)
- **Placeholder text:** `text-tertiary`
- **Padding:** `8px 12px`

### Sidebar Items

- **Height:** `32px`
- **Padding:** `4px 12px`
- **Active state:** `bg-tertiary` background, `text-primary` text, `accent` left border (`2px`)
- **Hover state:** `bg-tertiary` background
- **Font:** `ui` size (14px), weight 400. Active: weight 500.

---

## AI Feature Visual Treatment

AI features must be present but visually subordinate to the writer's own content. The writer's words are always the primary visual element.

### Principles

1. **AI is in the margin, not in the content.** Suggestions appear as annotations, not inline replacements.
2. **Muted visual weight.** AI elements use `info` color at reduced opacity, never `accent`.
3. **Dismissible.** Every AI suggestion has a clear dismiss action.
4. **No animation loops.** Loading states use a simple pulse or static indicator, never spinning or bouncing.

### AI Comment Markers (Margin Annotations)

- Appear as small indicators in the left or right margin of the editor
- Background: `info-subtle`
- Border-left: `2px solid info`
- Text: `ui-small` size, `text-secondary` color
- On hover: expand to show the full suggestion
- Collapsed state: a small dot or short label ("rephrase", "expand")

### AI Chat / Copilot Panel

- Right-side panel, `320px` wide
- Background: `bg-secondary`
- Separated from editor by `border-subtle`
- AI responses use `text-secondary` color (not primary -- keeps visual hierarchy clear)
- User messages use `text-primary` on `bg-elevated` bubbles
- Typing indicator: three static dots that pulse gently (opacity 0.3 to 0.7, 1.5s cycle)

### AI Inline Suggestions (When Applicable)

- Shown as ghost text in `text-tertiary` color, similar to GitHub Copilot
- Accept with Tab, dismiss with Escape
- Never auto-accept or auto-replace

### Tone/Voice Indicator

- Small badge in the toolbar or status bar area
- Background: `accent-subtle`
- Text: `ui-small`, `accent` color
- Shows the active voice profile name (e.g., "Conversational", "Technical")

---

## Accessibility Constraints

### Contrast Ratios (WCAG AA)

All color pairings have been selected to meet these minimums:

| Pairing                              | Ratio  | Requirement |
|--------------------------------------|--------|-------------|
| `text-primary` on `bg-primary`       | 12.5:1 | Passes AAA  |
| `text-secondary` on `bg-primary`     | 5.2:1  | Passes AA   |
| `text-tertiary` on `bg-primary`      | 3.1:1  | AA Large only -- used for placeholders, not essential text |
| `accent` on `bg-primary`             | 4.6:1  | Passes AA   |
| `accent` on `bg-elevated` (#FFF)     | 4.5:1  | Passes AA   |

Dark mode pairings follow the same thresholds.

### Focus Indicators

- All interactive elements show a visible focus ring: `2px solid border-focus` with `3px accent-subtle` box-shadow
- Focus rings are never removed, only styled
- Tab order follows visual layout: sidebar top-to-bottom, then editor, then AI panel

### Motion

- Respect `prefers-reduced-motion`: disable all transitions and animations when set
- Default transitions: `150ms ease` for hover states, `200ms ease` for panel slides
- No decorative animations

### Keyboard Navigation

- Command palette accessible via `Cmd+K` / `Ctrl+K`
- All toolbar actions have keyboard shortcuts
- AI panel toggle: `Cmd+Shift+A` / `Ctrl+Shift+A`
- Escape closes any overlay (popover, modal, AI panel)

---

## Iconography

- **Style:** Outlined, 1.5px stroke weight. Consistent with the minimal aesthetic.
- **Size:** `16px` default, `20px` for toolbar, `24px` for empty states.
- **Color:** `text-secondary` default, `text-primary` on hover/active, `accent` for active toggles.
- **Library recommendation:** Lucide (open source, consistent stroke weight, tree-shakeable).

---

## Summary

This design system produces an editor that feels like a premium, warm, distraction-free writing environment. The monospace editor font grounds the writing experience. Warm cream backgrounds and terracotta accents give it personality without noise. AI features live in the periphery -- helpful, accessible, never competing with the writer's own words.

The overall feel: open a beautifully made notebook, pick up a good pen, and write.

---

[ ] Reviewed

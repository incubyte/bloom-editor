# Bloom Editor

A clean, distraction-free blog editor built as a desktop app. Write beautifully, organize effortlessly, export anywhere.

Built by [Incubyte](https://incubyte.co).

## Features

- **Rich text editing** — Powered by Tiptap with support for headings, bold, italic, links, code blocks, lists, and blockquotes
- **Document management** — Create, switch, and delete documents from the sidebar. Auto-saves as you type
- **Command palette** — Press `Cmd+K` to search and run any command
- **Dark mode** — Toggle between light and dark themes, or let it follow your OS preference
- **Export** — Save as Markdown or HTML via native file dialog, or copy Markdown to clipboard
- **Zen mode** — Hide the sidebar and focus on writing
- **Word count and read time** — Live stats in the status bar

## Tech Stack

- [Tauri v2](https://v2.tauri.app/) — Lightweight desktop runtime (Rust backend)
- [React 19](https://react.dev/) + TypeScript
- [Tiptap](https://tiptap.dev/) — Rich text editor framework
- [Vite](https://vite.dev/) — Build tooling
- [Vitest](https://vitest.dev/) — Testing (118 tests)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- Tauri prerequisites for your platform — see [Tauri setup guide](https://v2.tauri.app/start/prerequisites/)

### Run

```bash
git clone https://github.com/incubyte/bloom-editor.git
cd bloom-editor
npm install
npm run tauri dev
```

### Test

```bash
npm test
```

## Project Structure

```
src/
├── editor/       # Tiptap editor, extensions, export
├── storage/      # Document persistence (.bloom files in ~/Documents/Bloom/)
├── shell/        # Command palette, keyboard shortcuts, theme
└── plugins/      # Plugin registration API
```

## Plugin API

Bloom Editor exposes a plugin API for extending the editor with custom commands, editor extensions, export formats, keyboard shortcuts, and UI panels.

```typescript
import {
  registerCommands,
  registerCommandHandler,
  registerEditorExtension,
  registerExportFormat,
  registerKeyboardShortcut,
  PluginProvider,
} from "./plugins";
```

See `src/plugins/index.ts` for the full API surface.

## License

MIT

---

Made with care by [Incubyte](https://incubyte.co)

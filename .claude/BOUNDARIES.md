# Module Boundaries

> Edit this file to adjust boundaries as the project evolves.

## Modules

- `editor/` — owns: Tiptap setup, custom extensions, editor state, document model. Depends on: (none)
- `storage/` — owns: local draft persistence, file management, settings. Depends on: (none)
- `shell/` — owns: command palette, keyboard shortcuts, theme, app layout. Depends on: (none)
- `plugins/` — owns: plugin registration API, UI slot context. Depends on: editor, shell

## Rules

- Modules may only import from declared dependencies
- Domain concepts live in their owning module — do not scatter across modules
- No circular dependencies
- When in doubt, duplicate code rather than create a coupling that violates boundaries

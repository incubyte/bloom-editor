import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { resolveExtensions, type AnyExtension } from "@tiptap/core";

const coreExtensions: AnyExtension[] = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: { openOnClick: false },
  }),
  Placeholder.configure({
    placeholder: "Start writing...",
  }),
];

const additionalExtensions: AnyExtension[] = [];

export function registerEditorExtension(extension: AnyExtension) {
  additionalExtensions.push(extension);
}

export function getEditorExtensions(): AnyExtension[] {
  return [...coreExtensions, ...additionalExtensions];
}

export const editorExtensions = coreExtensions;

export function resolveExtensionNames(): string[] {
  return resolveExtensions(getEditorExtensions()).map((ext) => ext.name);
}

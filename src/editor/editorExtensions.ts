import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { resolveExtensions } from "@tiptap/core";

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: { openOnClick: false },
  }),
  Placeholder.configure({
    placeholder: "Start writing...",
  }),
];

export function resolveExtensionNames(): string[] {
  return resolveExtensions(editorExtensions).map((ext) => ext.name);
}

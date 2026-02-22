import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "./editorExtensions";
export { Toolbar } from "./Toolbar";

interface EditorProps {
  hideToolbar?: boolean;
  onContentUpdate?: (content: Record<string, unknown>) => void;
  initialContent?: Record<string, unknown>;
  editorKey?: string;
}

export function useEditorInstance({
  onContentUpdate,
  initialContent,
  editorKey,
}: Omit<EditorProps, "hideToolbar">) {
  return useEditor(
    {
      extensions: editorExtensions,
      content: initialContent,
      onUpdate: ({ editor: e }) => {
        if (onContentUpdate) {
          onContentUpdate(e.getJSON() as Record<string, unknown>);
        }
      },
    },
    [editorKey],
  );
}

export function EditorCanvas({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  return <EditorContent editor={editor} />;
}

import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { EditorCanvas, useEditorInstance } from "./Editor";
import { resolveExtensionNames } from "./editorExtensions";

function TestEditor() {
  const editor = useEditorInstance({});
  return <EditorCanvas editor={editor} />;
}

describe("Editor", () => {
  test("mounts a Tiptap editor that is editable", () => {
    render(<TestEditor />);
    const editorElement = screen.getByRole("textbox");
    expect(editorElement).toBeInTheDocument();
    expect(editorElement).toHaveAttribute("contenteditable", "true");
  });

  test("includes all required formatting extensions", () => {
    const extensionNames = resolveExtensionNames();
    const requiredExtensions = [
      "heading",
      "bold",
      "italic",
      "bulletList",
      "orderedList",
      "codeBlock",
      "code",
      "link",
      "blockquote",
    ];

    for (const name of requiredExtensions) {
      expect(extensionNames).toContain(name);
    }
  });
});

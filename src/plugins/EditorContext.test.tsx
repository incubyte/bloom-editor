import { describe, test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useState } from "react";
import { EditorProvider, usePluginEditor } from "./EditorContext";
import { PluginProvider, usePluginSlots } from "./PluginContext";
import type { PluginUISlots } from "./PluginContext";

function EditorDisplay() {
  const editor = usePluginEditor();
  return <span data-testid="editor-value">{editor === null ? "null" : "present"}</span>;
}

describe("EditorContext", () => {
  test("usePluginEditor returns null when no provider present", () => {
    render(<EditorDisplay />);
    expect(screen.getByTestId("editor-value").textContent).toBe("null");
  });

  test("EditorProvider passes editor to consumers", () => {
    const fakeEditor = { getText: () => "hello" } as never;

    render(
      <EditorProvider editor={fakeEditor}>
        <EditorDisplay />
      </EditorProvider>,
    );

    expect(screen.getByTestId("editor-value").textContent).toBe("present");
  });

  test("EditorProvider forwards null when editor is null", () => {
    render(
      <EditorProvider editor={null}>
        <EditorDisplay />
      </EditorProvider>,
    );

    expect(screen.getByTestId("editor-value").textContent).toBe("null");
  });

  test("EditorContext is independent from PluginContext", () => {
    const fakeEditor = { getText: () => "hello" } as never;
    const slots: PluginUISlots = {
      sidebarPanels: [],
      toolbarSections: [<div key="t1">Toolbar</div>],
      statusBarSections: [],
      marginPanels: [],
    };

    function Combined() {
      const editor = usePluginEditor();
      const { toolbarSections } = usePluginSlots();
      return (
        <>
          <span data-testid="editor-value">{editor === null ? "null" : "present"}</span>
          <span data-testid="toolbar-count">{toolbarSections.length}</span>
        </>
      );
    }

    render(
      <PluginProvider slots={slots}>
        <EditorProvider editor={fakeEditor}>
          <Combined />
        </EditorProvider>
      </PluginProvider>,
    );

    expect(screen.getByTestId("editor-value").textContent).toBe("present");
    expect(screen.getByTestId("toolbar-count").textContent).toBe("1");
  });

  test("usePluginEditor returns Editor, not a setter — read-only", () => {
    const fakeEditor = { getText: () => "test" } as never;

    function TypeCheck() {
      const result = usePluginEditor();
      const isEditorOrNull = result === null || typeof result === "object";
      return <span data-testid="type-check">{String(isEditorOrNull)}</span>;
    }

    render(
      <EditorProvider editor={fakeEditor}>
        <TypeCheck />
      </EditorProvider>,
    );

    expect(screen.getByTestId("type-check").textContent).toBe("true");
  });

  test("editor updates propagate to consumers", () => {
    function Wrapper() {
      const [editor, setEditor] = useState<{ getText: () => string } | null>(null);

      return (
        <EditorProvider editor={editor as never}>
          <EditorDisplay />
          <button
            data-testid="set-editor"
            onClick={() => setEditor({ getText: () => "updated" })}
          />
        </EditorProvider>
      );
    }

    render(<Wrapper />);
    expect(screen.getByTestId("editor-value").textContent).toBe("null");

    act(() => {
      screen.getByTestId("set-editor").click();
    });

    expect(screen.getByTestId("editor-value").textContent).toBe("present");
  });
});

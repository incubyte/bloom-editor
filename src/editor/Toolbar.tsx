import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  CodeSquare,
  Link,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import "./Toolbar.css";

interface ToolbarProps {
  editor: Editor | null;
  saveStatus: "saved" | "unsaved";
  wordCount: number;
  children?: ReactNode;
}

export function Toolbar({ editor, saveStatus, wordCount, children }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <div className="toolbar-left">
        <ToolbarGroup>
          <ToolbarButton
            icon={<Heading1 size={16} />}
            label="Heading 1"
            isActive={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          />
          <ToolbarButton
            icon={<Heading2 size={16} />}
            label="Heading 2"
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />
          <ToolbarButton
            icon={<Heading3 size={16} />}
            label="Heading 3"
            isActive={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<Bold size={16} />}
            label="Bold"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={<Italic size={16} />}
            label="Italic"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<Code size={16} />}
            label="Inline Code"
            isActive={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<List size={16} />}
            label="Bullet List"
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={<ListOrdered size={16} />}
            label="Ordered List"
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<Quote size={16} />}
            label="Blockquote"
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={<CodeSquare size={16} />}
            label="Code Block"
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<Link size={16} />}
            label="Link"
            isActive={editor.isActive("link")}
            onClick={() => handleLinkToggle(editor)}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<Undo size={16} />}
            label="Undo"
            isActive={false}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <ToolbarButton
            icon={<Redo size={16} />}
            label="Redo"
            isActive={false}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </ToolbarGroup>
      </div>

      <div className="toolbar-right">
        {children}
        <span className={saveStatus === "unsaved" ? "toolbar-word-count toolbar-unsaved" : "toolbar-word-count"}>
          {wordCount.toLocaleString()} words{saveStatus === "unsaved" && "*"}
        </span>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({
  icon,
  label,
  isActive,
  onClick,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`toolbar-button ${isActive ? "toolbar-button--active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={isActive}
    >
      {icon}
    </button>
  );
}

function ToolbarGroup({ children }: { children: ReactNode }) {
  return <div className="toolbar-group">{children}</div>;
}

function ToolbarDivider() {
  return <div className="toolbar-divider" role="separator" />;
}

function handleLinkToggle(editor: Editor) {
  if (editor.isActive("link")) {
    editor.chain().focus().unsetLink().run();
    return;
  }

  const url = window.prompt("Enter URL:");
  if (url) {
    editor.chain().focus().setLink({ href: url }).run();
  }
}

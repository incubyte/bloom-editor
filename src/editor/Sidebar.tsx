import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tag,
  X,
} from "lucide-react";
import "./Sidebar.css";

export interface SidebarItem {
  id: string;
  title: string;
  modifiedAtLabel: string;
  tags: string[];
}

interface SidebarProps {
  documents: SidebarItem[];
  allTags: string[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onNewDocument: () => void;
  onDeleteDocument: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onSearchChange: (query: string) => void;
  onTagFilterChange: (tag: string | null) => void;
  activeTagFilter: string | null;
  searchQuery: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  documents,
  allTags,
  activeDocumentId,
  onSelectDocument,
  onNewDocument,
  onDeleteDocument,
  onUpdateTags,
  onSearchChange,
  onTagFilterChange,
  activeTagFilter,
  searchQuery,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [tagInputDocId, setTagInputDocId] = useState<string | null>(null);
  const [tagInputValue, setTagInputValue] = useState("");

  function handleDeleteWithConfirmation(id: string, title: string) {
    if (window.confirm(`Delete "${title}"?`)) {
      onDeleteDocument(id);
    }
  }

  function handleAddTag(docId: string) {
    const trimmed = tagInputValue.trim();
    if (!trimmed) return;

    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    if (!doc.tags.includes(trimmed)) {
      onUpdateTags(docId, [...doc.tags, trimmed]);
    }
    setTagInputValue("");
    setTagInputDocId(null);
  }

  function handleRemoveTag(docId: string, tagToRemove: string) {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;
    onUpdateTags(docId, doc.tags.filter((t) => t !== tagToRemove));
  }

  if (isCollapsed) {
    return (
      <aside className="sidebar sidebar--collapsed">
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">POSTS</h2>
        <button
            type="button"
            className="sidebar-icon-btn"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
      </div>

      <div className="sidebar-search">
        <Search size={14} className="sidebar-search-icon" />
        <input
          type="text"
          className="sidebar-search-input"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search documents"
        />
      </div>

      <div className="sidebar-tags">
        <button
          type="button"
          className={`sidebar-tag-btn ${activeTagFilter === null ? "sidebar-tag-btn--active" : ""}`}
          onClick={() => onTagFilterChange(null)}
        >
          All Notes
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`sidebar-tag-btn ${activeTagFilter === tag ? "sidebar-tag-btn--active" : ""}`}
            onClick={() => onTagFilterChange(tag)}
          >
            <Tag size={12} />
            {tag}
          </button>
        ))}
      </div>

      <nav className="sidebar-nav" aria-label="Document list">
        {documents.length === 0 ? (
          <p className="sidebar-empty">
            No notes yet.
            <br />
            <span style={{ fontSize: "11px", marginTop: "4px", display: "inline-block" }}>
              Press <strong>+</strong> to start writing
            </span>
          </p>
        ) : (
          <ul className="sidebar-list">
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  className={`sidebar-item ${activeDocumentId === doc.id ? "sidebar-item--active" : ""}`}
                  onClick={() => onSelectDocument(doc.id)}
                  aria-current={activeDocumentId === doc.id ? "page" : undefined}
                >
                  <span className="sidebar-item-title">{doc.title || "Untitled"}</span>
                  <span className="sidebar-item-time">{doc.modifiedAtLabel}</span>
                </button>

                <div className="sidebar-item-tags">
                  {doc.tags.map((tag) => (
                    <span key={tag} className="sidebar-item-tag">
                      {tag}
                      <button
                        type="button"
                        className="sidebar-item-tag-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(doc.id, tag);
                        }}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {tagInputDocId === doc.id ? (
                    <input
                      type="text"
                      className="sidebar-tag-input"
                      placeholder="Add tag..."
                      value={tagInputValue}
                      onChange={(e) => setTagInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTag(doc.id);
                        if (e.key === "Escape") setTagInputDocId(null);
                      }}
                      onBlur={() => setTagInputDocId(null)}
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      className="sidebar-add-tag-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTagInputDocId(doc.id);
                        setTagInputValue("");
                      }}
                      aria-label="Add tag"
                    >
                      <Plus size={10} />
                    </button>
                  )}
                </div>

                {activeDocumentId === doc.id && (
                  <button
                    type="button"
                    className="sidebar-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWithConfirmation(doc.id, doc.title);
                    }}
                    aria-label={`Delete ${doc.title}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>

      <button
        type="button"
        className="sidebar-new-post-btn"
        onClick={onNewDocument}
      >
        + New Post
      </button>
    </aside>
  );
}

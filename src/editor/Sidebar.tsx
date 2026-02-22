import {
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import "./Sidebar.css";

export interface SidebarItem {
  id: string;
  title: string;
  modifiedAtLabel: string;
  tags: string[];
  wordCount?: number;
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
  function handleDeleteWithConfirmation(id: string, title: string) {
    if (window.confirm(`Delete "${title}"?`)) {
      onDeleteDocument(id);
    }
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
                  <span className="sidebar-item-time">
                    {doc.modifiedAtLabel}
                    {doc.wordCount != null && doc.wordCount > 0 && ` · ${doc.wordCount.toLocaleString()} words`}
                  </span>
                  {doc.tags.length > 0 && (
                    <span className="sidebar-item-tags">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="sidebar-item-tag">
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </button>

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
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="sidebar-new-post-footer">
        <button
          type="button"
          className="sidebar-new-post-btn"
          onClick={onNewDocument}
        >
          <Plus size={14} />
          New Post
        </button>
      </div>
    </aside>
  );
}

import "./PostHeader.css";

interface PostHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  subtitle: string;
  onSubtitleChange: (subtitle: string) => void;
  createdAt: string;
  wordCount: number;
  tags: string[];
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / 250));
  return `${minutes} min read`;
}

export function PostHeader({
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  createdAt,
  wordCount,
  tags,
}: PostHeaderProps) {
  return (
    <div className="post-header">
      <input
        type="text"
        className="post-header-title"
        placeholder="Untitled"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Post title"
      />
      <input
        type="text"
        className="post-header-subtitle"
        placeholder="Add a subtitle..."
        value={subtitle}
        onChange={(e) => onSubtitleChange(e.target.value)}
        aria-label="Post subtitle"
      />
      <div className="post-header-meta">
        <span className="post-header-info">
          {formatDate(createdAt)}
          {wordCount > 0 && <> &middot; {estimateReadTime(wordCount)}</>}
        </span>
        {tags.length > 0 && (
          <div className="post-header-tags">
            {tags.map((tag) => (
              <span key={tag} className="post-header-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

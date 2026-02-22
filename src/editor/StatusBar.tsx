import "./StatusBar.css";

interface StatusBarProps {
  saveStatus: "saved" | "unsaved";
  message?: string;
}

export function StatusBar({ saveStatus, message }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        {message ? (
          <span className="status-bar-message">{message}</span>
        ) : (
          <>
            <span
              className={`status-bar-indicator ${saveStatus === "saved" ? "status-bar-indicator--saved" : "status-bar-indicator--unsaved"}`}
            >
              {saveStatus === "saved" ? "Auto-saved" : "Unsaved"}
            </span>
            <span className="status-bar-format">Markdown</span>
          </>
        )}
      </div>
    </div>
  );
}

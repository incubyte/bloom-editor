import { useState, useEffect, useRef, useCallback } from "react";
import { filterCommands, formatShortcut } from "./commandRegistry";
import type { Command } from "./commandRegistry";
import "./CommandPalette.css";

const platform =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    ? "mac"
    : "other";

interface CommandPaletteProps {
  isOpen: boolean;
  commands: Command[];
  onSelect: (commandId: string) => void;
  onClose: () => void;
}

export function CommandPalette({
  isOpen,
  commands,
  onSelect,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filtered = filterCommands(commands, query);
  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;

  const highlightedRef = useRef(highlightedIndex);
  highlightedRef.current = highlightedIndex;

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev + 1;
          return next >= filteredRef.current.length ? 0 : next;
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? filteredRef.current.length - 1 : next;
        });
        return;
      }
      if (
        e.key === "Enter" &&
        highlightedRef.current >= 0 &&
        highlightedRef.current < filteredRef.current.length
      ) {
        e.preventDefault();
        onSelect(filteredRef.current[highlightedRef.current].id);
      }
    },
    [onClose, onSelect],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          className="command-palette-input"
          type="text"
          placeholder="Type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="command-palette-list">
          {filtered.length === 0 && (
            <li className="command-palette-empty">No results</li>
          )}
          {filtered.map((cmd, index) => (
            <li
              key={cmd.id}
              className={`command-palette-item${index === highlightedIndex ? " highlighted" : ""}`}
              data-highlighted={
                index === highlightedIndex ? "true" : undefined
              }
              onClick={() => onSelect(cmd.id)}
            >
              <span className="command-palette-label">{cmd.label}</span>
              {cmd.shortcut && (
                <span className="command-palette-shortcut">
                  {formatShortcut(cmd.shortcut, platform)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

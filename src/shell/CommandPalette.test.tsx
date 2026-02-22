import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "./CommandPalette";
import type { Command } from "./commandRegistry";

const mockCommands: Command[] = [
  { id: "bold", label: "Bold", shortcut: "Mod+B", category: "formatting" },
  { id: "italic", label: "Italic", shortcut: "Mod+I", category: "formatting" },
  {
    id: "toggle-zen-mode",
    label: "Toggle Zen Mode",
    category: "view",
  },
  {
    id: "new-document",
    label: "New Document",
    shortcut: "Mod+N",
    category: "document",
  },
  {
    id: "toggle-sidebar",
    label: "Toggle Sidebar",
    shortcut: "Mod+\\",
    category: "navigation",
  },
  {
    id: "toggle-dark-mode",
    label: "Toggle Dark/Light Mode",
    category: "view",
  },
];

describe("CommandPalette", () => {
  test("renders a search input and a list of commands when open", () => {
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText("Type a command..."),
    ).toBeInTheDocument();

    for (const cmd of mockCommands) {
      expect(screen.getByText(cmd.label)).toBeInTheDocument();
    }
  });

  test("filters commands as user types in the search input", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Type a command...");
    await user.type(input, "zen");

    expect(screen.getByText("Toggle Zen Mode")).toBeInTheDocument();
    expect(screen.queryByText("Bold")).not.toBeInTheDocument();
    expect(screen.queryByText("Italic")).not.toBeInTheDocument();
  });

  test("does not render anything when isOpen is false", () => {
    render(
      <CommandPalette
        isOpen={false}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByPlaceholderText("Type a command..."),
    ).not.toBeInTheDocument();
  });

  test("calls onSelect with command id when a command is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={handleSelect}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByText("Bold"));
    expect(handleSelect).toHaveBeenCalledWith("bold");
  });

  test("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={handleClose}
      />,
    );

    await user.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalledOnce();
  });

  test("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={handleClose}
      />,
    );

    const backdrop = document.querySelector(".command-palette-backdrop")!;
    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  test("ArrowDown moves highlight to next item", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands.slice(0, 3)}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    const items = document.querySelectorAll(".command-palette-item");
    expect(items[2]).toHaveAttribute("data-highlighted", "true");
  });

  test("Enter selects the highlighted item", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands.slice(0, 3)}
        onSelect={handleSelect}
        onClose={vi.fn()}
      />,
    );

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(handleSelect).toHaveBeenCalledWith("italic");
  });

  test("displays formatted keyboard shortcut next to command label", () => {
    render(
      <CommandPalette
        isOpen={true}
        commands={[
          {
            id: "bold",
            label: "Bold",
            shortcut: "Mod+B",
            category: "formatting",
          },
        ]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const shortcutElement = document.querySelector(
      ".command-palette-shortcut",
    );
    expect(shortcutElement).toBeInTheDocument();
    expect(shortcutElement!.textContent).not.toContain("Mod");
  });

  test("shows No results when filter matches nothing", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Type a command...");
    await user.type(input, "zzzzz");

    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(
      document.querySelectorAll(".command-palette-item"),
    ).toHaveLength(0);
  });

  test("toggle-dark-mode command triggers onSelect with correct id", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={handleSelect}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByText("Toggle Dark/Light Mode"));
    expect(handleSelect).toHaveBeenCalledWith("toggle-dark-mode");
  });

  test("opening palette resets search query and highlight", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Type a command...");
    await user.type(input, "zen");
    expect(screen.queryByText("Bold")).not.toBeInTheDocument();

    rerender(
      <CommandPalette
        isOpen={false}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    rerender(
      <CommandPalette
        isOpen={true}
        commands={mockCommands}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const newInput = screen.getByPlaceholderText("Type a command...");
    expect(newInput).toHaveValue("");
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });
});

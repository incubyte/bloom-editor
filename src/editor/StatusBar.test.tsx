import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBar } from "./StatusBar";

describe("StatusBar", () => {
  test("displays a temporary message when message prop is provided", () => {
    render(<StatusBar saveStatus="saved" message="Exported!" />);
    expect(screen.getByText("Exported!")).toBeInTheDocument();
  });

  test("shows save status when no message is present", () => {
    render(<StatusBar saveStatus="saved" />);
    expect(screen.getByText("Auto-saved")).toBeInTheDocument();
    expect(screen.queryByText("Exported!")).not.toBeInTheDocument();
  });
});

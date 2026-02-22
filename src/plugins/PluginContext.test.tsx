import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePluginSlots, PluginProvider } from "./PluginContext";
import type { PluginUISlots } from "./PluginContext";

function SlotsDisplay() {
  const { sidebarPanels, toolbarSections, statusBarSections } =
    usePluginSlots();
  return (
    <div>
      <span data-testid="sidebar-count">{sidebarPanels.length}</span>
      <span data-testid="toolbar-count">{toolbarSections.length}</span>
      <span data-testid="statusbar-count">{statusBarSections.length}</span>
    </div>
  );
}

describe("PluginContext", () => {
  test("usePluginSlots returns empty arrays when no provider present", () => {
    render(<SlotsDisplay />);

    expect(screen.getByTestId("sidebar-count").textContent).toBe("0");
    expect(screen.getByTestId("toolbar-count").textContent).toBe("0");
    expect(screen.getByTestId("statusbar-count").textContent).toBe("0");
  });

  test("PluginProvider passes slots to consumers", () => {
    const slots: PluginUISlots = {
      sidebarPanels: [
        { id: "panel-1", label: "Panel 1", component: <div>Panel</div> },
      ],
      toolbarSections: [<div key="t1">Toolbar</div>],
      statusBarSections: [<div key="s1">Status</div>, <div key="s2">Bar</div>],
    };

    render(
      <PluginProvider slots={slots}>
        <SlotsDisplay />
      </PluginProvider>,
    );

    expect(screen.getByTestId("sidebar-count").textContent).toBe("1");
    expect(screen.getByTestId("toolbar-count").textContent).toBe("1");
    expect(screen.getByTestId("statusbar-count").textContent).toBe("2");
  });
});

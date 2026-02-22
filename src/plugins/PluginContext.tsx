import { createContext, useContext, type ReactNode } from "react";

export interface SidebarPanel {
  id: string;
  label: string;
  component: ReactNode;
}

export interface PluginUISlots {
  sidebarPanels: SidebarPanel[];
  toolbarSections: ReactNode[];
  statusBarSections: ReactNode[];
}

const defaultSlots: PluginUISlots = {
  sidebarPanels: [],
  toolbarSections: [],
  statusBarSections: [],
};

const PluginContext = createContext<PluginUISlots>(defaultSlots);

export function PluginProvider({
  slots,
  children,
}: {
  slots: PluginUISlots;
  children: ReactNode;
}) {
  return (
    <PluginContext.Provider value={slots}>{children}</PluginContext.Provider>
  );
}

export function usePluginSlots(): PluginUISlots {
  return useContext(PluginContext);
}

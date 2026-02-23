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
  marginPanels: ReactNode[];
}

const defaultSlots: PluginUISlots = {
  sidebarPanels: [],
  toolbarSections: [],
  statusBarSections: [],
  marginPanels: [],
};

let registeredSlots: Partial<PluginUISlots> = {};

export function registerPluginSlots(slots: Partial<PluginUISlots>) {
  registeredSlots = { ...registeredSlots, ...slots };
}

export function getRegisteredSlots(): PluginUISlots {
  return {
    sidebarPanels: registeredSlots.sidebarPanels ?? defaultSlots.sidebarPanels,
    toolbarSections: registeredSlots.toolbarSections ?? defaultSlots.toolbarSections,
    statusBarSections: registeredSlots.statusBarSections ?? defaultSlots.statusBarSections,
    marginPanels: registeredSlots.marginPanels ?? defaultSlots.marginPanels,
  };
}

export function clearPluginSlots() {
  registeredSlots = {};
}

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

import type { ReactNode } from "react";
import "./AppShell.css";

interface AppShellProps {
  sidebar: ReactNode;
  toolbar?: ReactNode;
  statusBar?: ReactNode;
  children: ReactNode;
  isZenMode?: boolean;
}

export function AppShell({
  sidebar,
  toolbar,
  statusBar,
  children,
  isZenMode = false,
}: AppShellProps) {
  const shellClassName = `app-shell${isZenMode ? " app-shell--zen" : ""}`;

  return (
    <div className={shellClassName}>
      {!isZenMode && sidebar}
      <main className="canvas">
        {toolbar && <div className="canvas-toolbar">{toolbar}</div>}
        <div className="canvas-scroll">
          <div className="canvas-content">{children}</div>
        </div>
        {statusBar}
      </main>
    </div>
  );
}

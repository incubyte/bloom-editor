import type { ReactNode } from "react";
import "./AppShell.css";

interface AppShellProps {
  sidebar: ReactNode;
  toolbar?: ReactNode;
  statusBar?: ReactNode;
  marginPanel?: ReactNode;
  children: ReactNode;
  isZenMode?: boolean;
}

export function AppShell({
  sidebar,
  toolbar,
  statusBar,
  marginPanel,
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
          {marginPanel && <aside className="canvas-margin">{marginPanel}</aside>}
        </div>
        {statusBar}
      </main>
    </div>
  );
}

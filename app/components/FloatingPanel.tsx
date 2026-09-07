import type { ReactNode } from "react";
import { usePanelDrag } from "@/hooks/usePanelDrag";

const PANEL_WIDTH = 288;
const PANEL_HEIGHT = 168;
const MENUBAR_HEIGHT = 48;

const styles = {
  panel: "fixed z-40 flex flex-col rounded-lg border bg-card text-card-foreground shadow-lg",
  header: "border-b px-3 py-2 cursor-grab select-none active:cursor-grabbing",
  title: "text-sm font-semibold truncate",
  body: "overflow-y-auto scrollbar-thin",
} as const;

interface FloatingPanelProps {
  title: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
}

export function FloatingPanel({ title, children, defaultPosition }: FloatingPanelProps) {
  const { position, handleDragStart } = usePanelDrag({
    defaultPosition: defaultPosition ?? {
      x: window.innerWidth - PANEL_WIDTH - 3,
      y: window.innerHeight - PANEL_HEIGHT - 3,
    },
    panelWidth: PANEL_WIDTH,
    panelHeight: PANEL_HEIGHT,
    topOffset: MENUBAR_HEIGHT,
  });

  return (
    <div
      className={styles.panel}
      style={{
        left: position.x,
        top: position.y,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
      }}
    >
      <div className={styles.header} onMouseDown={handleDragStart}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

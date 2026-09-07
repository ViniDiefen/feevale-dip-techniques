import type { ReactNode } from "react";
import { usePanelDrag } from "@/shared/hooks/usePanelDrag";

const PANEL_WIDTH = 288;
const MENUBAR_HEIGHT = 48;

const styles = {
  panel: "fixed z-40 flex flex-col rounded-lg border bg-card text-card-foreground shadow-lg",
  header: "border-b px-3 py-2 cursor-grab select-none active:cursor-grabbing",
  title: "text-sm font-semibold truncate",
  body: "flex-1 overflow-y-auto scrollbar-thin",
  footer: "border-t",
} as const;

interface FloatingPanelProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  defaultPosition?: { x: number; y: number };
  height?: number;
}

export function FloatingPanel({ title, children, footer, defaultPosition, height = 168 }: FloatingPanelProps) {
  const { position, handleDragStart } = usePanelDrag({
    defaultPosition: defaultPosition ?? {
      x: window.innerWidth - PANEL_WIDTH - 3,
      y: window.innerHeight - height - 3,
    },
    panelWidth: PANEL_WIDTH,
    panelHeight: height,
    topOffset: MENUBAR_HEIGHT,
  });

  return (
    <div
      className={styles.panel}
      style={{
        left: position.x,
        top: position.y,
        width: PANEL_WIDTH,
        height,
      }}
    >
      <div className={styles.header} onMouseDown={handleDragStart}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

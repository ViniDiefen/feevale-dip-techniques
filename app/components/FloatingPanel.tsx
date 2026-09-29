import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Draggable from "react-draggable";

export const PANEL_WIDTH = 288;
export const PANEL_HEIGHT = 240;
export const MENUBAR_HEIGHT = 48;
export const PANEL_MARGIN = 3;

const styles = {
  panel: "fixed z-40 flex flex-col rounded-lg border bg-card text-card-foreground shadow-lg",
  panelHeader:
    "border-b px-3 py-2 cursor-grab select-none active:cursor-grabbing",
  panelTitle: "text-sm font-semibold truncate",
  panelBody: "flex-1 overflow-y-auto scrollbar-thin",
  panelFooter: "border-t",
} as const;

function clampPanelPosition(x: number, y: number, panelHeight: number) {
  return {
    x: Math.max(PANEL_MARGIN, Math.min(x, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN)),
    y: Math.max(
      MENUBAR_HEIGHT + PANEL_MARGIN,
      Math.min(y, window.innerHeight - panelHeight - PANEL_MARGIN)
    ),
  };
}

export function FloatingPanel({
  title,
  children,
  footer,
  defaultPosition,
  height = 168,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  defaultPosition?: { x: number; y: number };
  height?: number;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() =>
    clampPanelPosition(
      defaultPosition?.x ?? window.innerWidth - PANEL_WIDTH - PANEL_MARGIN,
      defaultPosition?.y ?? window.innerHeight - height - PANEL_MARGIN,
      height
    )
  );

  useEffect(() => {
    const handleResize = () =>
      setPosition((prev) => clampPanelPosition(prev.x, prev.y, height));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".panel-handle"
      position={position}
      bounds={{
        left: PANEL_MARGIN,
        top: MENUBAR_HEIGHT + PANEL_MARGIN,
        right: window.innerWidth - PANEL_WIDTH - PANEL_MARGIN,
        bottom: window.innerHeight - height - PANEL_MARGIN,
      }}
      onDrag={(_, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className={styles.panel}
        style={{ left: 0, top: 0, width: PANEL_WIDTH, height }}
      >
        <div className={`panel-handle ${styles.panelHeader}`}>
          <span className={styles.panelTitle}>{title}</span>
        </div>
        <div className={styles.panelBody}>{children}</div>
        {footer ? <div className={styles.panelFooter}>{footer}</div> : null}
      </div>
    </Draggable>
  );
}

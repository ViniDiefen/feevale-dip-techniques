import { useCallback, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface UsePanelDragOptions {
  defaultPosition: Position;
  panelWidth: number;
  panelHeight: number;
  topOffset?: number;
  margin?: number;
}

export function usePanelDrag({
  defaultPosition,
  panelWidth,
  panelHeight,
  topOffset = 48,
  margin = 3,
}: UsePanelDragOptions) {
  const [position, setPosition] = useState(defaultPosition);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const clamp = useCallback(
    (x: number, y: number) => ({
      x: Math.max(margin, Math.min(x, window.innerWidth - panelWidth - margin)),
      y: Math.max(topOffset + margin, Math.min(y, window.innerHeight - panelHeight - margin)),
    }),
    [panelWidth, panelHeight, topOffset, margin]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current) return;
      const { startX, startY, startPosX, startPosY } = dragState.current;
      const x = startPosX + (e.clientX - startX);
      const y = startPosY + (e.clientY - startY);
      setPosition(clamp(x, y));
    },
    [clamp]
  );

  const handleMouseUp = useCallback(() => {
    dragState.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [handleMouseMove]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [position, handleMouseMove, handleMouseUp]
  );

  return { position, handleDragStart };
}

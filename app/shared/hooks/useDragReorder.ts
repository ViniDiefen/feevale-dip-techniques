import { useCallback, useState } from "react";

interface UseDragReorderOptions {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

interface DragProps {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

interface UseDragReorderReturn {
  dragIndex: number | null;
  overIndex: number | null;
  getDragProps: (index: number) => DragProps;
}

export function useDragReorder({ onReorder }: UseDragReorderOptions): UseDragReorderReturn {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverIndex((prev) => {
        if (prev === index) return prev;
        if (dragIndex === index) return prev;
        return index;
      });
    },
    [dragIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromIndex = dragIndex;
      if (fromIndex !== null && fromIndex !== toIndex) {
        onReorder(fromIndex, toIndex);
      }
      setDragIndex(null);
      setOverIndex(null);
    },
    [dragIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const getDragProps = useCallback(
    (index: number): DragProps => ({
      draggable: true,
      onDragStart: (e) => handleDragStart(e, index),
      onDragOver: (e) => handleDragOver(e, index),
      onDrop: (e) => handleDrop(e, index),
      onDragEnd: handleDragEnd,
    }),
    [handleDragStart, handleDragOver, handleDrop, handleDragEnd]
  );

  return { dragIndex, overIndex, getDragProps };
}

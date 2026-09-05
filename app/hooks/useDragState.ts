import { useCallback, useState } from "react";

interface UseDragStateOptions {
  onDrop?: (image: File | undefined) => void;
}

export function useDragState({ onDrop }: UseDragStateOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        setIsDragging(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      onDrop?.(event.dataTransfer.files?.[0]);
    },
    [onDrop]
  );

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}

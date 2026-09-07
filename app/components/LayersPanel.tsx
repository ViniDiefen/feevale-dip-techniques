import { useCallback, useState } from "react";
import {
  GripVertical,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Layer } from "@/layers/types";

const styles = {
  list: "min-h-[120px] divide-y",
  empty:
    "flex items-center justify-center h-[120px] text-xs text-muted-foreground",
  item:
    "group flex items-center gap-2 px-3 py-2 text-sm cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors",
  dragHandle: "shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground",
  icon: "shrink-0 text-muted-foreground",
  name: "flex-1 truncate",
  removeButton:
    "shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity",
  dragging: "opacity-40",
  dragOver: "border-t-2 border-primary",
} as const;

interface LayersPanelProps {
  layers: Layer[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
}

export function LayersPanel({
  layers,
  onReorder,
  onRemove,
}: LayersPanelProps) {
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
      if (index !== overIndex) setOverIndex(index);
    },
    [overIndex]
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

  if (layers.length === 0) {
    return <div className={styles.empty}>Nenhuma camada aplicada</div>;
  }

  return (
    <ul className={styles.list}>
      {layers.map((layer, index) => {
        const Icon = layer.command.icon;
        return (
          <li
            key={layer.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              styles.item,
              dragIndex === index && styles.dragging,
              overIndex === index && dragIndex !== index && styles.dragOver
            )}
          >
            <GripVertical size={14} className={styles.dragHandle} />
            <Icon size={14} className={styles.icon} />
            <span className={styles.name}>{layer.command.label}</span>
            <button
              className={styles.removeButton}
              onClick={() => onRemove(layer.id)}
              aria-label="Remover camada"
            >
              <Trash2 size={14} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

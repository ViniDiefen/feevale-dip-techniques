import {
  GripVertical,
  Trash2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useDragReorder } from "@/shared/hooks";
import type { CommandLayer } from "@/layers/types";

const styles = {
  list: "min-h-[120px]",
  empty: "flex items-center justify-center h-[120px] text-xs text-muted-foreground",
  item: "group flex items-center gap-2 px-3 py-2 text-sm cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors",
  dragHandle: "shrink-0 pointer-events-none text-muted-foreground/50 group-hover:text-muted-foreground",
  icon: "shrink-0 pointer-events-none text-muted-foreground",
  name: "flex-1 truncate pointer-events-none",
  removeButton: "shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity",
  dragging: "opacity-40",
  dragOver: "bg-primary/10",
} as const;

interface LayersPanelProps {
  layers: CommandLayer[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
}

export function LayersPanel({ layers, onReorder, onRemove }: LayersPanelProps) {
  const { dragIndex, overIndex, getDragProps } = useDragReorder({ onReorder });

  if (layers.length === 0) {
    return <div className={styles.empty}>Nenhuma camada aplicada</div>;
  }

  return (
    <ul className={styles.list}>
      {layers.map((layer, index) => (
        <li
          key={layer.id}
          {...getDragProps(index)}
          className={cn(
            styles.item,
            dragIndex === index && styles.dragging,
            overIndex === index && dragIndex !== index && styles.dragOver
          )}
        >
          <GripVertical size={14} className={styles.dragHandle} />
          <layer.command.icon size={14} className={styles.icon} />
          <span className={styles.name}>{layer.command.label}</span>
          <button
            className={cn(styles.removeButton, dragIndex !== null && "pointer-events-none")}
            onClick={() => onRemove(layer.id)}
            aria-label="Remover camada"
          >
            <Trash2 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}

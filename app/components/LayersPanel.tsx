import { useCallback } from "react";
import { GripVertical, Image as ImageIcon, Trash2 } from "lucide-react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import type { CommandLayer, ImageLayer } from "@/layers/types";
import { FloatingPanel, PANEL_HEIGHT } from "./FloatingPanel";

const styles = {
  imageFooter: "flex items-center gap-2 px-3 py-2 text-sm",
  imageIcon: "shrink-0 text-muted-foreground",
  imageName: "flex-1 truncate text-muted-foreground",
  imageRemoveButton:
    "shrink-0 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors",
  list: "min-h-[120px]",
  empty:
    "flex items-center justify-center h-[120px] text-xs text-muted-foreground",
  item: "group flex items-center gap-2 px-3 py-2 text-sm cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors",
  itemSelected: "bg-accent/70",
  itemDragging: "opacity-40",
  dragHandle:
    "shrink-0 pointer-events-none text-muted-foreground/50 group-hover:text-muted-foreground",
  itemIcon: "shrink-0 pointer-events-none text-muted-foreground",
  itemName: "flex-1 truncate pointer-events-none",
  itemRemoveButton:
    "shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity",
} as const;

function LayerRow({
  layer,
  index,
  selected,
  onSelect,
  onRemove,
}: {
  layer: CommandLayer;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { ref, isDragging } = useSortable({ id: layer.id, index });
  const Icon = layer.command.icon;

  return (
    <li
      ref={ref}
      className={`${styles.item} ${isDragging ? styles.itemDragging : ""} ${
        selected ? styles.itemSelected : ""
      }`}
      onClick={() => onSelect(layer.id)}
    >
      <GripVertical size={14} className={styles.dragHandle} />
      <Icon size={14} className={styles.itemIcon} />
      <span className={styles.itemName}>{layer.command.label}</span>
      <button
        type="button"
        className={styles.itemRemoveButton}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(layer.id);
        }}
        aria-label="Remover camada"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

export function LayersPanel({
  commandLayers,
  imageLayer,
  selectedLayerId,
  onSelect,
  onRemove,
  onReorder,
  onImageRemove,
}: {
  commandLayers: CommandLayer[];
  imageLayer: ImageLayer;
  selectedLayerId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onImageRemove: () => void;
}) {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) return;
      const source = event.operation.source;
      if (!source || !isSortable(source)) return;
      const { initialIndex, index } = source;
      if (initialIndex === index) return;
      onReorder(initialIndex, index);
    },
    [onReorder]
  );

  return (
    <FloatingPanel
      title="Camadas"
      height={PANEL_HEIGHT}
      footer={
        <div className={styles.imageFooter}>
          <ImageIcon size={14} className={styles.imageIcon} />
          <span className={styles.imageName}>{imageLayer.image.name}</span>
          <button
            type="button"
            className={styles.imageRemoveButton}
            onClick={onImageRemove}
            aria-label="Remover imagem"
          >
            <Trash2 size={14} />
          </button>
        </div>
      }
    >
      {commandLayers.length === 0 ? (
        <div className={styles.empty}>Nenhuma camada aplicada</div>
      ) : (
        <DragDropProvider onDragEnd={handleDragEnd}>
          <ul className={styles.list}>
            {commandLayers.map((layer, index) => (
              <LayerRow
                key={layer.id}
                layer={layer}
                index={index}
                selected={selectedLayerId === layer.id}
                onSelect={onSelect}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </DragDropProvider>
      )}
    </FloatingPanel>
  );
}

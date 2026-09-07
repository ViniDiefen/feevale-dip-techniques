import { Image as ImageIcon, Trash2 } from "lucide-react";
import { Menubar } from "@/features/editor/components/Menubar";
import type { Route } from "./+types/home";
import { ImagePicker } from "@/features/image/components/ImagePicker";
import { ImagePreview } from "@/features/editor/components/ImagePreview";
import { FloatingPanel } from "@/features/editor/components/FloatingPanel";
import { LayersPanel } from "@/features/editor/components/LayersPanel";
import { useEditor } from "@/features/editor/hooks/useEditor";

const styles = {
  layout: "flex flex-col h-screen",
  picker: "flex-1 min-h-0",
  preview: "flex-1 min-h-0 p-5",
  imageFooter: "flex items-center gap-2 px-3 py-2 text-sm",
  imageIcon: "shrink-0 text-muted-foreground",
  imageName: "flex-1 truncate text-muted-foreground",
  removeButton: "shrink-0 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors",
} as const;

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Feevale DIP Techniques" },
    {
      name: "description",
      content:
        "A solution for managing and testing DIP techniques, applying techniques presented at the Feevale DIP conference.",
    },
  ];
}

export default function Home() {
  const {
    image,
    processedCanvas,
    commandLayers,
    imageLayer,
    handleImageLoad,
    handleImageRemove,
    handleCommandExecute,
    handleReorder,
    handleRemove,
  } = useEditor();

  return (
    <div className={styles.layout}>
      {image === undefined ? <ImagePicker className={styles.picker} onChange={handleImageLoad} /> : null}
      {image !== undefined ? <Menubar onCommandExecute={handleCommandExecute} /> : null}
      {image !== undefined ? <ImagePreview canvas={processedCanvas} className={styles.preview} /> : null}
      {image !== undefined && imageLayer !== undefined ? (
        <FloatingPanel
          title="Camadas"
          height={240}
          footer={
            <div className={styles.imageFooter}>
              <ImageIcon size={14} className={styles.imageIcon} />
              <span className={styles.imageName}>{imageLayer.image.name}</span>
              <button
                className={styles.removeButton}
                onClick={handleImageRemove}
                aria-label="Remover imagem"
              >
                <Trash2 size={14} />
              </button>
            </div>
          }
        >
          <LayersPanel
            layers={commandLayers}
            onReorder={handleReorder}
            onRemove={handleRemove}
          />
        </FloatingPanel>
      ) : null}
    </div>
  );
}

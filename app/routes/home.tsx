import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { Menubar } from "@/features/editor";
import type { Route } from "./+types/home";
import { ImagePicker } from "@/features/image";
import { ImagePreview } from "@/features/editor";
import { FloatingPanel } from "@/features/editor";
import { LayersPanel } from "@/features/editor";
import type { Layer } from "@/layers/types";
import type { MenuItem } from "@/data/menu";
import { reorder, remove } from "@/shared/lib/utils";

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

let layerIdCounter = 0;

function applyLayers(
  original: HTMLCanvasElement,
  layers: Layer[]
): HTMLCanvasElement {
  let canvas = original;
  const commandLayers = layers.filter((l) => l.type === "command");
  for (const layer of commandLayers) {
    canvas = layer.command.execute(canvas, layer.command.defaultParams);
  }
  return canvas;
}

export default function Home() {
  const [image, setImage] = useState<File>();
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement>();
  const [layers, setLayers] = useState<Layer[]>([]);

  const handleImageLoad = useCallback((file: File | undefined) => {
    if (!file) return;
    setImage(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      setOriginalCanvas(canvas);
      setLayers([{
        id: `layer-${++layerIdCounter}`,
        type: "image",
        image: file,
        appliedAt: new Date(),
      }]);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let cancelled = false;

    fetch("/lena.jpg")
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        const file = new File([blob], "lena.jpg", { type: "image/jpeg" });
        handleImageLoad(file);
      });

    return () => { cancelled = true; };
  }, [handleImageLoad]);

  const processedCanvas = useMemo(() => {
    if (!originalCanvas) return undefined;
    return applyLayers(originalCanvas, layers);
  }, [originalCanvas, layers]);

  const handleImageRemove = useCallback(() => {
    setImage(undefined);
    setOriginalCanvas(undefined);
    setLayers([]);
  }, []);

  const handleCommandExecute = useCallback(
    (item: MenuItem) => {
      if (!originalCanvas) return;
      setLayers((prev) => [
        ...prev,
        {
          id: `layer-${++layerIdCounter}`,
          type: "command",
          command: item.command,
          appliedAt: new Date(),
        },
      ]);
    },
    [originalCanvas]
  );

  const imageLayer = layers.find((l) => l.type === "image");

  return (
    <div className={styles.layout}>
      {!image && <ImagePicker className={styles.picker} onChange={handleImageLoad} />}
      {image && <Menubar onCommandExecute={handleCommandExecute} />}
      {image && <ImagePreview canvas={processedCanvas} className={styles.preview} />}
      {image && imageLayer && (
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
            layers={layers}
            onReorder={(from, to) =>
              setLayers((prev) => reorder(prev, from, to))
            }
            onRemove={(id) =>
              setLayers((prev) => remove(prev, id, "id"))
            }
          />
        </FloatingPanel>
      )}
    </div>
  );
}

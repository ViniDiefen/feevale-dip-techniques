import { useCallback, useState } from "react";
import { Menubar } from "@/components/Menubar";
import type { Route } from "./+types/home";
import { ImagePicker } from "@/components/ImagePicker";
import { ImagePreview } from "@/components/ImagePreview";
import { FloatingPanel } from "@/components/FloatingPanel";
import { LayersPanel } from "@/components/LayersPanel";
import type { Layer } from "@/layers/types";
import type { MenuItem } from "@/data/menu";
import { reorder, remove } from "@/lib/utils";

const styles = {
  layout: "flex flex-col h-screen",
  picker: "flex-1 min-h-0",
  preview: "flex-1 min-h-0 p-5",
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

export default function Home() {
  const [image, setImage] = useState<File>();
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement>();
  const [layers, setLayers] = useState<Layer[]>([]);

  const handleImageLoad = useCallback((file: File | undefined) => {
    if (!file) return;
    setImage(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      setProcessedCanvas(canvas);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleCommandExecute = useCallback(
    (item: MenuItem) => {
      if (!processedCanvas) return;
      const result = item.command.execute(processedCanvas, item.command.defaultParams);
      setProcessedCanvas(result);
      setLayers((prev) => [
        ...prev,
        {
          id: `layer-${++layerIdCounter}`,
          command: item.command,
          appliedAt: new Date(),
        },
      ]);
    },
    [processedCanvas]
  );

  return (
    <div className={styles.layout}>
      {!image && (
        <ImagePicker className={styles.picker} onChange={handleImageLoad} />
      )}
      {image && <Menubar onCommandExecute={handleCommandExecute} />}
      {image && <ImagePreview image={image} className={styles.preview} />}
      {image && (
        <FloatingPanel title="Camadas">
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

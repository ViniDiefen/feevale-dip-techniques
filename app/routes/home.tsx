import { CommandParamsPanel } from "@/components/CommandParamsPanel";
import { ImagePicker } from "@/components/ImagePicker";
import { ImagePreview } from "@/components/ImagePreview";
import { LayersPanel } from "@/components/LayersPanel";
import { Menubar } from "@/components/Menubar";
import { useEditor } from "@/hooks/useEditor";
import type { Route } from "./+types/home";

const styles = {
  layout: "flex flex-col h-screen",
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
    selectedLayer,
    loadImage,
    removeImage,
    executeCommand,
    selectLayer,
    removeLayer,
    updateLayerParams,
    reorderLayers,
  } = useEditor();

  return (
    <div className={styles.layout}>
      {image === undefined ? <ImagePicker onImageLoad={loadImage} /> : null}

      {image !== undefined ? <Menubar onCommandExecute={executeCommand} /> : null}

      {image !== undefined ? <ImagePreview canvas={processedCanvas} /> : null}

      {image !== undefined && imageLayer !== undefined ? (
        <LayersPanel
          commandLayers={commandLayers}
          imageLayer={imageLayer}
          selectedLayerId={selectedLayer?.id ?? null}
          onSelect={selectLayer}
          onRemove={removeLayer}
          onReorder={reorderLayers}
          onImageRemove={removeImage}
        />
      ) : null}

      {selectedLayer !== undefined && selectedLayer.type === "command" ? (
        <CommandParamsPanel
          layer={selectedLayer}
          onParamsChange={(params) => updateLayerParams(selectedLayer.id, params)}
        />
      ) : null}
    </div>
  );
}

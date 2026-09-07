import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Layer } from "@/layers/types";
import type { MenuItem } from "@/data/menu";
import { reorder, remove } from "@/shared/lib/utils";

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

export function useEditor() {
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

  const commandLayers = useMemo(
    () => layers.filter((l) => l.type === "command").reverse(),
    [layers]
  );

  const imageLayer = layers.find((l) => l.type === "image");

  const handleReorder = useCallback((from: number, to: number) => {
    setLayers((prev) => {
      const commands = prev.filter((l) => l.type === "command");
      const images = prev.filter((l) => l.type === "image");
      const fromOrig = commands.length - 1 - from;
      const toOrig = commands.length - 1 - to;
      return [...images, ...reorder(commands, fromOrig, toOrig)];
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setLayers((prev) => remove(prev, id, "id"));
  }, []);

  return {
    image,
    processedCanvas,
    commandLayers,
    imageLayer,
    handleImageLoad,
    handleImageRemove,
    handleCommandExecute,
    handleReorder,
    handleRemove,
  };
}

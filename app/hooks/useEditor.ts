import { useCallback, useEffect, useMemo, useState } from "react";
import type { Command } from "@/commands/types";
import {
  applyLayers,
  createCommandLayer,
  createImageLayer,
  findLayer,
  getImageLayer,
  listCommandLayers,
  removeLayer as removeLayerFromList,
  reorderCommandLayers,
  updateLayerParams as updateParamsInList,
} from "@/layers/layers";
import type { Layer } from "@/layers/types";
import { fileToCanvas, loadSampleImage } from "@/lib/image";

export function useEditor() {
  const [image, setImage] = useState<File>();
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const loadImage = useCallback((file: File | undefined) => {
    if (!file) return;
    setImage(file);
    fileToCanvas(file)
      .then((canvas) => {
        setOriginalCanvas(canvas);
        setLayers([createImageLayer(file)]);
      })
      .catch(() => {
        setImage(undefined);
        setOriginalCanvas(undefined);
      });
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let cancelled = false;
    loadSampleImage()
      .then((file) => {
        if (!cancelled) loadImage(file);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [loadImage]);

  const removeImage = useCallback(() => {
    setImage(undefined);
    setOriginalCanvas(undefined);
    setLayers([]);
    setSelectedLayerId(null);
  }, []);

  const executeCommand = useCallback(
    (command: Command<any>) => {
      if (!originalCanvas) return;
      const layer = createCommandLayer(command);
      setLayers((prev) => [...prev, layer]);
      setSelectedLayerId(layer.id);
    },
    [originalCanvas]
  );

  const selectLayer = useCallback((id: string) => {
    setSelectedLayerId((prev) => (prev === id ? null : id));
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => removeLayerFromList(prev, id));
    setSelectedLayerId((prev) => (prev === id ? null : prev));
  }, []);

  const updateLayerParams = useCallback((id: string, params: any) => {
    setLayers((prev) => updateParamsInList(prev, id, params));
  }, []);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => reorderCommandLayers(prev, fromIndex, toIndex));
  }, []);

  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement>();
  useEffect(() => {
    if (!originalCanvas) {
      setProcessedCanvas(undefined);
      return;
    }
    const frame = requestAnimationFrame(() =>
      setProcessedCanvas(applyLayers(originalCanvas, layers))
    );
    return () => cancelAnimationFrame(frame);
  }, [originalCanvas, layers]);

  const commandLayers = useMemo(() => listCommandLayers(layers), [layers]);
  const imageLayer = useMemo(() => getImageLayer(layers), [layers]);
  const selectedLayer = useMemo(
    () => findLayer(layers, selectedLayerId),
    [layers, selectedLayerId]
  );

  return {
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
  };
}

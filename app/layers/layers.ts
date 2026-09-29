import type { Command } from "@/commands/types";
import type { CommandLayer, ImageLayer, Layer } from "./types";

let layerIdCounter = 0;

function nextLayerId(): string {
  return `layer-${++layerIdCounter}`;
}

function isCommandLayer(layer: Layer): layer is CommandLayer {
  return layer.type === "command";
}

export function createImageLayer(image: File): ImageLayer {
  return {
    id: nextLayerId(),
    type: "image",
    image,
    appliedAt: new Date(),
  };
}

export function createCommandLayer(command: Command<any>): CommandLayer {
  return {
    id: nextLayerId(),
    type: "command",
    command,
    params: command.defaultParams,
    appliedAt: new Date(),
  };
}

export function applyLayers(
  original: HTMLCanvasElement,
  layers: Layer[]
): HTMLCanvasElement {
  return layers.reduce(
    (canvas, layer) =>
      layer.type === "command"
        ? layer.command.execute(canvas, layer.params)
        : canvas,
    original
  );
}

export function listCommandLayers(layers: Layer[]): CommandLayer[] {
  return layers.filter(isCommandLayer).reverse();
}

export function getImageLayer(layers: Layer[]): ImageLayer | undefined {
  return layers.find((layer): layer is ImageLayer => layer.type === "image");
}

export function findLayer(layers: Layer[], id: string | null): Layer | undefined {
  if (!id) return undefined;
  return layers.find((layer) => layer.id === id);
}

export function removeLayer(layers: Layer[], id: string): Layer[] {
  return layers.filter((layer) => layer.id !== id);
}

export function updateLayerParams(layers: Layer[], id: string, params: any): Layer[] {
  return layers.map((layer) =>
    layer.id === id && layer.type === "command"
      ? { ...layer, params }
      : layer
  );
}

export function reorderCommandLayers(
  layers: Layer[],
  fromIndex: number,
  toIndex: number
): Layer[] {
  const commands = listCommandLayers(layers);
  const reordered = [...commands];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  return [...layers.filter((layer) => layer.type === "image"), ...reordered.reverse()];
}

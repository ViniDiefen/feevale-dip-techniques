import type { Command } from "@/commands/types";
import type { Layer } from "./types";

// Layers are stored in panel order: newest first.

let layerIdCounter = 0;

export function createLayer(command: Command<any>): Layer {
  return {
    id: `layer-${++layerIdCounter}`,
    command,
    params: command.defaultParams,
  };
}

// Applies from the oldest layer (end of the list) to the newest.
export function applyLayers(original: HTMLCanvasElement, layers: Layer[]): HTMLCanvasElement {
  return layers.reduceRight(
    (canvas, layer) => layer.command.execute(canvas, layer.params),
    original
  );
}

export function findLayer(layers: Layer[], id: string | null): Layer | undefined {
  if (!id) return undefined;
  return layers.find((layer) => layer.id === id);
}

export function removeLayer(layers: Layer[], id: string): Layer[] {
  return layers.filter((layer) => layer.id !== id);
}

export function updateLayerParams(layers: Layer[], id: string, params: any): Layer[] {
  return layers.map((layer) => (layer.id === id ? { ...layer, params } : layer));
}

export function moveLayer(layers: Layer[], fromIndex: number, toIndex: number): Layer[] {
  const reordered = [...layers];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  return reordered;
}

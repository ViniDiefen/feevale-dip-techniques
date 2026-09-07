export type PixelProcessor = (
  r: number,
  g: number,
  b: number,
  a: number
) => [number, number, number, number];

export function processPixels(
  source: HTMLCanvasElement,
  processor: PixelProcessor
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = processor(data[i], data[i + 1], data[i + 2], data[i + 3]);
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
    data[i + 3] = Math.max(0, Math.min(255, a));
  }

  const destCtx = canvas.getContext("2d", { willReadFrequently: true })!;
  destCtx.putImageData(imageData, 0, 0);
  return canvas;
}

export function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

// Gray-level transformation applied to one pixel: s = T(r) for each channel.
export type PointOperator = (
  r: number,
  g: number,
  b: number,
  a: number
) => [number, number, number, number];

// Point operation: each output pixel depends only on the pixel
// at the same position in the input image.
export function pointOperation(
  source: HTMLCanvasElement,
  operator: PointOperator
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = operator(data[i], data[i + 1], data[i + 2], data[i + 3]);
    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
    data[i + 3] = clamp(a);
  }

  const destCtx = canvas.getContext("2d", { willReadFrequently: true })!;
  destCtx.putImageData(imageData, 0, 0);
  return canvas;
}

// Keeps a value inside the gray-level range [0, 255].
export function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

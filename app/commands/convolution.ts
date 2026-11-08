import { clamp } from "./pixels";

// Mask (matrix) applied over the pixel neighborhood.
export type Mask = number[][];

// Position of the evaluated pixel inside the mask: the center for odd
// masks (3×3, 5×5...) and the top-left corner for Roberts' 2×2.
function anchor(size: number): number {
  return Math.floor((size - 1) / 2);
}

// Values of channel `c` in the size×size window around (x, y), row by row.
export function neighborhood(
  pixels: ImageData,
  size: number,
  x: number,
  y: number,
  c: number
): number[] {
  const a = anchor(size);
  const values: number[] = [];
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      values.push(pixels.data[((y + j - a) * pixels.width + (x + i - a)) * 4 + c]);
    }
  }
  return values;
}

// Convolution: sum of the neighbors multiplied by the mask weights.
export function convolve(pixels: ImageData, mask: Mask, x: number, y: number, c: number): number {
  const size = mask.length;
  const a = anchor(size);
  let sum = 0;
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      sum += pixels.data[((y + j - a) * pixels.width + (x + i - a)) * 4 + c] * mask[j][i];
    }
  }
  return sum;
}

// Local operation: computes a new value for each pixel from its neighborhood.
// At the borders the mask doesn't fit inside the image, so those
// pixels keep their original value.
export function filterImage(
  source: HTMLCanvasElement,
  maskSize: number,
  filter: (pixels: ImageData, x: number, y: number, c: number) => number
): HTMLCanvasElement {
  const { width, height } = source;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const src = sourceCtx.getImageData(0, 0, width, height);
  const dest = ctx.createImageData(width, height);
  dest.data.set(src.data);

  const a = anchor(maskSize);
  for (let y = a; y <= height - maskSize + a; y++) {
    for (let x = a; x <= width - maskSize + a; x++) {
      const idx = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        dest.data[idx + c] = clamp(filter(src, x, y, c));
      }
    }
  }

  ctx.putImageData(dest, 0, 0);
  return canvas;
}

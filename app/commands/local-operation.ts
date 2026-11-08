import { clamp } from "./point-operation";

// Mask (kernel) applied over the pixel neighborhood.
export type Mask = number[][];

// Computes the new value of channel `channel` at (x, y) from the input image.
export type LocalOperator = (image: ImageData, x: number, y: number, channel: number) => number;

// Position of the evaluated pixel inside the mask: the center for odd
// masks (3×3, 5×5...) and the top-left corner for Roberts' 2×2.
function maskOrigin(size: number): number {
  return Math.floor((size - 1) / 2);
}

// Values of `channel` in the size×size neighborhood of (x, y), row by row.
export function neighborhood(
  image: ImageData,
  size: number,
  x: number,
  y: number,
  channel: number
): number[] {
  const o = maskOrigin(size);
  const values: number[] = [];
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      values.push(image.data[((y + j - o) * image.width + (x + i - o)) * 4 + channel]);
    }
  }
  return values;
}

// Convolution: sum of the neighbors multiplied by the mask weights.
// As in the course slides, the mask is not rotated 180°.
export function convolve(image: ImageData, mask: Mask, x: number, y: number, channel: number): number {
  const size = mask.length;
  const o = maskOrigin(size);
  let sum = 0;
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      sum += image.data[((y + j - o) * image.width + (x + i - o)) * 4 + channel] * mask[j][i];
    }
  }
  return sum;
}

// Local operation: computes a new value for each pixel
// from its neighborhood. At the borders the mask doesn't fit inside the
// image, so those pixels keep their original value.
export function localOperation(
  source: HTMLCanvasElement,
  maskSize: number,
  operator: LocalOperator
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

  const o = maskOrigin(maskSize);
  for (let y = o; y <= height - maskSize + o; y++) {
    for (let x = o; x <= width - maskSize + o; x++) {
      const idx = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        dest.data[idx + channel] = clamp(operator(src, x, y, channel));
      }
    }
  }

  ctx.putImageData(dest, 0, 0);
  return canvas;
}

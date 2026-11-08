// Affine transformation matrix in homogeneous coordinates.
export type AffineMatrix = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

// Geometric transform by forward mapping: moves the tone of the pixel at
// (xo, yo) in the source image to position (xd, yd) in the destination image:
//
//   [xd]   [a b c]   [xo]
//   [yd] = [d e f] . [yo]
//   [1 ]   [0 0 1]   [1 ]
//
// Pixels that land outside the destination image are discarded.
export function affineTransform(source: HTMLCanvasElement, matrix: AffineMatrix): HTMLCanvasElement {
  const { width, height } = source;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const src = sourceCtx.getImageData(0, 0, width, height).data;
  const destData = ctx.createImageData(width, height);
  const dest = destData.data;

  for (let yo = 0; yo < height; yo++) {
    for (let xo = 0; xo < width; xo++) {
      const xd = Math.round(matrix[0][0] * xo + matrix[0][1] * yo + matrix[0][2]);
      const yd = Math.round(matrix[1][0] * xo + matrix[1][1] * yo + matrix[1][2]);

      if (xd < 0 || xd >= width || yd < 0 || yd >= height) continue;

      const o = (yo * width + xo) * 4;
      const d = (yd * width + xd) * 4;
      dest[d] = src[o];
      dest[d + 1] = src[o + 1];
      dest[d + 2] = src[o + 2];
      dest[d + 3] = src[o + 3];
    }
  }

  ctx.putImageData(destData, 0, 0);
  return canvas;
}

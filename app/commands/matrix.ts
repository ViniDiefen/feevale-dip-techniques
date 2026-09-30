import { clamp } from "./pixels";

export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

function transformPoint(
  matrix: Matrix3x3,
  x: number,
  y: number
): [number, number] {
  const newX = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2];
  const newY = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2];
  return [newX, newY];
}

function invertMatrix(m: Matrix3x3): Matrix3x3 {
  const det =
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  if (Math.abs(det) < 1e-10) {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  const invDet = 1 / det;

  return [
    [
      (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
      (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
      (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet,
    ],
    [
      (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
      (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
      (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet,
    ],
    [
      (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
      (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
      (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet,
    ],
  ];
}

function assertSquareKernel(kernel: number[][]): number {
  const size = kernel.length;
  if (size === 0 || kernel.some((row) => row.length !== size)) {
    throw new Error("Kernel deve ser uma matriz quadrada não vazia.");
  }
  return size;
}

export function applyMatrix(
  source: HTMLCanvasElement,
  matrix: Matrix3x3
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const destData = ctx.createImageData(canvas.width, canvas.height);

  const invMatrix = invertMatrix(matrix);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const [srcX, srcY] = transformPoint(invMatrix, x, y);

      const srcXFloor = Math.floor(srcX);
      const srcYFloor = Math.floor(srcY);

      if (
        srcXFloor >= 0 &&
        srcXFloor < source.width &&
        srcYFloor >= 0 &&
        srcYFloor < source.height
      ) {
        const srcIdx = (srcYFloor * source.width + srcXFloor) * 4;
        const destIdx = (y * canvas.width + x) * 4;

        destData.data[destIdx] = sourceData.data[srcIdx];
        destData.data[destIdx + 1] = sourceData.data[srcIdx + 1];
        destData.data[destIdx + 2] = sourceData.data[srcIdx + 2];
        destData.data[destIdx + 3] = sourceData.data[srcIdx + 3];
      }
    }
  }

  ctx.putImageData(destData, 0, 0);
  return canvas;
}

export function mapNeighborhood(source: HTMLCanvasElement, size: number,
  visit: (x: number, y: number, source: Uint8ClampedArray, dest: Uint8ClampedArray, width: number) => void
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const sourceData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const destData = ctx.createImageData(canvas.width, canvas.height);
  destData.data.set(sourceData.data);

  const half = Math.floor(size / 2);
  const { width, height } = source;

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      visit(x, y, sourceData.data, destData.data, width);
    }
  }

  ctx.putImageData(destData, 0, 0);
  return canvas;
}

export function applyConvolutionMagnitude(
  source: HTMLCanvasElement,
  kernelX: number[][],
  kernelY?: number[][],
  threshold?: number
): HTMLCanvasElement {
  const size = assertSquareKernel(kernelX);
  if (kernelY && assertSquareKernel(kernelY) !== size) {
    throw new Error("Kernels devem ter o mesmo tamanho.");
  }

  const weightsY = kernelY ?? kernelX.map((row) => row.map(() => 0));
  const half = Math.floor(size / 2);

  return mapNeighborhood(source, size, (x, y, src, dest, width) => {
    const destIdx = (y * width + x) * 4;
    for (let c = 0; c < 3; c++) {
      let gx = 0;
      let gy = 0;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const v = src[((y + j - half) * width + (x + i - half)) * 4 + c];
          gx += v * kernelX[j][i];
          gy += v * weightsY[j][i];
        }
      }
      const g = Math.sqrt(gx * gx + gy * gy);
      dest[destIdx + c] =
        threshold === undefined ? clamp(g) : g > threshold ? 255 : 0;
    }
  });
}

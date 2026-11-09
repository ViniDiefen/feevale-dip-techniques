import { ThresholdCommand } from "./filters/threshold";

// Neighbors of P, numbered as in the course material:
//   N4 N3 N2
//   N5  P N1
//   N6 N7 N8
// Odd k are the side neighbors, even k are the corners between them.
// By compass direction, N1..N8 are E, NE, N, NW, W, SW, S, SE.
const NEIGHBOR_OFFSETS: [number, number][] = [
  [1, 0], // N1
  [1, -1], // N2
  [0, -1], // N3
  [-1, -1], // N4
  [-1, 0], // N5
  [-1, 1], // N6
  [0, 1], // N7
  [1, 1], // N8
];

// Pixels outside the image count as background.
export class BinaryImage {
  readonly data: Uint8Array;

  constructor(
    readonly width: number,
    readonly height: number
  ) {
    this.data = new Uint8Array(width * height);
  }

  at(x: number, y: number): number {
    return x >= 0 && x < this.width && y >= 0 && y < this.height ? this.data[y * this.width + x] : 0;
  }

  // N1..N8 of (x, y), in the order of NEIGHBOR_OFFSETS.
  neighbors(x: number, y: number): number[] {
    return NEIGHBOR_OFFSETS.map(([dx, dy]) => this.at(x + dx, y + dy));
  }
}

function threshold(image: HTMLCanvasElement): HTMLCanvasElement {
  return new ThresholdCommand().execute(image, { threshold: 128 });
}

// Thresholds the image and takes the black pixels as the object. An image that
// is already black and white (e.g. from the Threshold command) is left as is.
export function toBinary(image: HTMLCanvasElement): BinaryImage {
  const { width, height } = image;
  const src = threshold(image).getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, width, height);
  const bin = new BinaryImage(width, height);
  for (let i = 0; i < bin.data.length; i++) {
    bin.data[i] = src.data[i * 4] === 0 ? 1 : 0;
  }
  return bin;
}

// Draws the object in black on a white background.
export function toCanvas(bin: BinaryImage): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = bin.width;
  canvas.height = bin.height;
  const ctx = canvas.getContext("2d")!;
  const dest = ctx.createImageData(bin.width, bin.height);
  for (let i = 0; i < bin.data.length; i++) {
    const v = bin.data[i] ? 0 : 255;
    dest.data[i * 4] = dest.data[i * 4 + 1] = dest.data[i * 4 + 2] = v;
    dest.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(dest, 0, 0);
  return canvas;
}

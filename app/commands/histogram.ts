import { GrayscaleCommand } from "./filters/grayscale";

// Histogram: how many pixels have each gray level 0..255. The image is
// converted to gray with the simple average, the same used by Threshold.
export function histogram(image: HTMLCanvasElement): number[] {
  const gray = new GrayscaleCommand().execute(image, { method: "average" });
  const data = gray.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, gray.width, gray.height).data;
  const hist = new Array<number>(256).fill(0);
  for (let i = 0; i < data.length; i += 4) hist[data[i]]++;
  return hist;
}

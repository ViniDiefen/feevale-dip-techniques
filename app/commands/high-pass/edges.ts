import { GrayscaleCommand } from "../filters/grayscale";
import { convolve, filterImage, type Mask } from "../convolution";

function toGrayscale(image: HTMLCanvasElement): HTMLCanvasElement {
  return new GrayscaleCommand().execute(image, { method: "average" });
}

// Edge detection by gradient:
//   Gx ← convolution of the neighborhood with mask X
//   Gy ← convolution of the neighborhood with mask Y
//   G  ← √(Gx² + Gy²)
//   If G > T then 255, else 0
export function detectEdges(
  image: HTMLCanvasElement,
  maskX: Mask,
  maskY: Mask,
  threshold: number
): HTMLCanvasElement {
  return filterImage(toGrayscale(image), maskX.length, (pixels, x, y, c) => {
    const gx = convolve(pixels, maskX, x, y, c);
    const gy = convolve(pixels, maskY, x, y, c);
    const g = Math.sqrt(gx * gx + gy * gy);
    return g > threshold ? 255 : 0;
  });
}

import { GrayscaleCommand } from "./filters/grayscale";
import { localOperation, convolve, type Mask } from "./local-operation";

function toGrayscale(image: HTMLCanvasElement): HTMLCanvasElement {
  return new GrayscaleCommand().execute(image, { method: "average" });
}

// Edge detection by gradient magnitude and thresholding:
//   Gx ← convolution of the neighborhood with mask X
//   Gy ← convolution of the neighborhood with mask Y
//   G  ← √(Gx² + Gy²)
//   If G > T then 255, else 0
export function gradientEdgeDetection(
  image: HTMLCanvasElement,
  maskX: Mask,
  maskY: Mask,
  threshold: number
): HTMLCanvasElement {
  return localOperation(toGrayscale(image), maskX.length, (gray, x, y, channel) => {
    const gx = convolve(gray, maskX, x, y, channel);
    const gy = convolve(gray, maskY, x, y, channel);
    const g = Math.sqrt(gx * gx + gy * gy);
    return g > threshold ? 255 : 0;
  });
}

import type { Command } from "../types";
import { histogram } from "../histogram";
import { ThresholdCommand } from "./threshold";

// Otsu's method: tries every T from 0 to 255. Each T splits the pixels into
// two classes, at or below T (class 0) and above T (class 1), and gets the
// between-class variance
//   σ²B(T) = w0 · w1 · (μ0 − μ1)²
// where w0, w1 are the pixel counts of the classes and μ0, μ1 their mean
// gray levels. The chosen T is the one with the highest σ²B: the split whose
// two groups are farthest apart, weighted by their sizes.
export function otsuThreshold(image: HTMLCanvasElement): number {
  const hist = histogram(image);
  const total = hist.reduce((sum, n) => sum + n, 0);
  let sumAll = 0;
  for (let t = 0; t < 256; t++) sumAll += t * hist[t];

  let w0 = 0; // pixels at or below T
  let sum0 = 0; // sum of their gray levels
  let best = 0;
  let bestVariance = -1;
  for (let t = 0; t < 256; t++) {
    w0 += hist[t];
    sum0 += t * hist[t];
    const w1 = total - w0;
    if (w0 === 0 || w1 === 0) continue;
    const mu0 = sum0 / w0;
    const mu1 = (sumAll - sum0) / w1;
    const variance = w0 * w1 * (mu0 - mu1) ** 2;
    if (variance > bestVariance) {
      bestVariance = variance;
      best = t;
    }
  }
  return best;
}

// Thresholding with T chosen by Otsu's method instead of by hand. Works best
// when the histogram has two peaks (object and background).
export class OtsuThresholdCommand implements Command {
  label = "Otsu threshold";
  params = [];
  defaultParams = undefined;

  execute(image: HTMLCanvasElement): HTMLCanvasElement {
    return new ThresholdCommand().execute(image, { threshold: otsuThreshold(image) });
  }
}

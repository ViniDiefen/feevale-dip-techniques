import { Grid3x3Icon } from "lucide-react";
import type { Command } from "../types";
import { convolve, filterImage, type Mask } from "../convolution";

export interface MeanParams {
  size: "3" | "5" | "7";
}

// n×n mask with every coefficient equal to 1.
function onesMask(size: number): Mask {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 1));
}

export class MeanCommand implements Command<MeanParams> {
  label = "Mean";
  icon = Grid3x3Icon;
  params = [
    {
      key: "size",
      label: "Window",
      type: "select" as const,
      options: [
        { value: "3", label: "3 × 3" },
        { value: "5", label: "5 × 5" },
        { value: "7", label: "7 × 7" },
      ],
    },
  ];
  defaultParams: MeanParams = { size: "3" };

  execute(image: HTMLCanvasElement, params: MeanParams): HTMLCanvasElement {
    const size = Number(params.size);
    const mask = onesMask(size);
    // Center pixel = window sum divided by the number of pixels (n²).
    return filterImage(image, size, (pixels, x, y, c) => convolve(pixels, mask, x, y, c) / (size * size));
  }
}

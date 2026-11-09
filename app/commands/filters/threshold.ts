import { BinaryIcon } from "lucide-react";
import type { Command } from "../types";
import { pointOperation } from "../point-operation";
import { GrayscaleCommand } from "./grayscale";

function toGrayscale(image: HTMLCanvasElement): HTMLCanvasElement {
  return new GrayscaleCommand().execute(image, { method: "average" });
}

export interface ThresholdParams {
  threshold: number;
}

// Thresholding (binarization): each pixel becomes white if its gray level is
// above T, and black otherwise.
//   If f(x,y) > T then 255, else 0
export class ThresholdCommand implements Command<ThresholdParams> {
  label = "Threshold";
  icon = BinaryIcon;
  params = [
    {
      key: "threshold",
      label: "Threshold",
      type: "number" as const,
      min: 0,
      max: 255,
      step: 1,
    },
  ];
  defaultParams: ThresholdParams = { threshold: 128 };

  execute(image: HTMLCanvasElement, params: ThresholdParams): HTMLCanvasElement {
    return pointOperation(toGrayscale(image), (gray, _g, _b, a) => {
      const v = gray > params.threshold ? 255 : 0;
      return [v, v, v, a];
    });
  }
}

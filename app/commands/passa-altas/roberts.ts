import { ScanIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { GrayscaleCommand } from "../filters/grayscale";
import { applyConvolutionMagnitude } from "../matrix";

const KERNEL_X = [
  [1, 0],
  [0, -1],
];
const KERNEL_Y = [
  [0, 1],
  [-1, 0],
];

export interface RobertsParams {
  threshold: number;
}

export class RobertsCommand extends BaseCommand<RobertsParams> {
  label = "Roberts";
  icon = ScanIcon;
  params = [
    {
      key: "threshold",
      label: "Limiar",
      type: "number" as const,
      min: 0,
      max: 255,
      step: 1,
    },
  ];
  defaultParams: RobertsParams = { threshold: 50 };

  execute(image: HTMLCanvasElement, params: RobertsParams): HTMLCanvasElement {
    const grayscale = new GrayscaleCommand().execute(image, {
      method: "luminosity",
    });
    return applyConvolutionMagnitude(
      grayscale,
      KERNEL_X,
      KERNEL_Y,
      params.threshold
    );
  }
}

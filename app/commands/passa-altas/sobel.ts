import { FocusIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { GrayscaleCommand } from "../filters/grayscale";
import { applyConvolutionMagnitude } from "../matrix";

const KERNEL_X = [
  [1, 0, -1],
  [2, 0, -2],
  [1, 0, -1],
];
const KERNEL_Y = [
  [1, 2, 1],
  [0, 0, 0],
  [-1, -2, -1],
];

export interface SobelParams {
  threshold: number;
}

export class SobelCommand extends BaseCommand<SobelParams> {
  label = "Sobel";
  icon = FocusIcon;
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
  defaultParams: SobelParams = { threshold: 50 };

  execute(image: HTMLCanvasElement, params: SobelParams): HTMLCanvasElement {
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

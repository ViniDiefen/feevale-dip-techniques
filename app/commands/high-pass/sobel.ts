import { FocusIcon } from "lucide-react";
import type { Command } from "../types";
import { detectEdges } from "./edges";

const MASK_X = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
];
const MASK_Y = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1],
];

export interface SobelParams {
  threshold: number;
}

export class SobelCommand implements Command<SobelParams> {
  label = "Sobel";
  icon = FocusIcon;
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
  defaultParams: SobelParams = { threshold: 50 };

  execute(image: HTMLCanvasElement, params: SobelParams): HTMLCanvasElement {
    return detectEdges(image, MASK_X, MASK_Y, params.threshold);
  }
}

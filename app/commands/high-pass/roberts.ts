import { ScanIcon } from "lucide-react";
import type { Command } from "../types";
import { gradientEdgeDetection } from "../edge-detection";

// G1 = f(x,y) − f(x+1,y+1)
const MASK_G1 = [
  [1, 0],
  [0, -1],
];
// G2 = f(x+1,y) − f(x,y+1)
const MASK_G2 = [
  [0, 1],
  [-1, 0],
];

export interface RobertsParams {
  threshold: number;
}

export class RobertsCommand implements Command<RobertsParams> {
  label = "Roberts";
  icon = ScanIcon;
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
  defaultParams: RobertsParams = { threshold: 50 };

  execute(image: HTMLCanvasElement, params: RobertsParams): HTMLCanvasElement {
    return gradientEdgeDetection(image, MASK_G1, MASK_G2, params.threshold);
  }
}

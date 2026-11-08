import { ScalingIcon } from "lucide-react";
import type { Command } from "../types";
import { affineTransform, type AffineMatrix } from "../geometric-transform";

export interface ScaleParams {
  factor: number;
}

function scaleMatrix(sx: number, sy: number): AffineMatrix {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
}

export class ScaleCommand implements Command<ScaleParams> {
  label = "Scale";
  icon = ScalingIcon;
  params = [
    {
      key: "factor",
      label: "Factor",
      type: "number" as const,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
  ];
  defaultParams: ScaleParams = { factor: 1.5 };

  execute(image: HTMLCanvasElement, params: ScaleParams): HTMLCanvasElement {
    const matrix = scaleMatrix(params.factor, params.factor);
    return affineTransform(image, matrix);
  }
}

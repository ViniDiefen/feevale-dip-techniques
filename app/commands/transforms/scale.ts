import { ScalingIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { applyMatrix, type Matrix3x3 } from "../matrix";

export interface ScaleParams {
  factor: number;
}

function scaleMatrix(sx: number, sy: number): Matrix3x3 {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
}

export class ScaleCommand extends BaseCommand<ScaleParams> {
  label = "Escala";
  icon = ScalingIcon;
  params = [
    {
      key: "factor",
      label: "Fator",
      type: "number" as const,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
  ];
  defaultParams: ScaleParams = { factor: 1.5 };

  execute(image: HTMLCanvasElement, params: ScaleParams): HTMLCanvasElement {
    const matrix = scaleMatrix(params.factor, params.factor);
    return applyMatrix(image, matrix);
  }
}

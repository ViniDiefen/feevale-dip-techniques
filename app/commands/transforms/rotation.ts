import { RotateCwIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { applyMatrix, type Matrix3x3 } from "../matrix";

export interface RotationParams {
  degrees: number;
}

function rotationMatrix(degrees: number): Matrix3x3 {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return [
    [cos, -sin, 0],
    [sin, cos, 0],
    [0, 0, 1],
  ];
}

export class RotationCommand extends BaseCommand<RotationParams> {
  label = "Rotação";
  icon = RotateCwIcon;
  params = [
    {
      key: "degrees",
      label: "Graus",
      type: "number" as const,
      min: -360,
      max: 360,
      step: 1,
    },
  ];
  defaultParams: RotationParams = { degrees: 45 };

  execute(image: HTMLCanvasElement, params: RotationParams): HTMLCanvasElement {
    const matrix = rotationMatrix(params.degrees);
    return applyMatrix(image, matrix);
  }
}

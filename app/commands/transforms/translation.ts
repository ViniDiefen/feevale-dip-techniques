import { MoveIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { applyMatrix, type Matrix3x3 } from "../matrix";

export interface TranslationParams {
  dx: number;
  dy: number;
}

function translationMatrix(dx: number, dy: number): Matrix3x3 {
  return [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1],
  ];
}

export class TranslationCommand extends BaseCommand<TranslationParams> {
  label = "Translação";
  icon = MoveIcon;
  params = [
    {
      key: "dx",
      label: "Deslocamento X",
      type: "number" as const,
      min: -200,
      max: 200,
      step: 1,
    },
    {
      key: "dy",
      label: "Deslocamento Y",
      type: "number" as const,
      min: -200,
      max: 200,
      step: 1,
    },
  ];
  defaultParams: TranslationParams = { dx: 50, dy: 50 };

  execute(image: HTMLCanvasElement, params: TranslationParams): HTMLCanvasElement {
    const matrix = translationMatrix(params.dx, params.dy);
    return applyMatrix(image, matrix);
  }
}

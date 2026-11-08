import { MoveIcon } from "lucide-react";
import type { Command } from "../types";
import { affineTransform, type AffineMatrix } from "../geometric-transform";

export interface TranslationParams {
  dx: number;
  dy: number;
}

function translationMatrix(dx: number, dy: number): AffineMatrix {
  return [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1],
  ];
}

export class TranslationCommand implements Command<TranslationParams> {
  label = "Translation";
  icon = MoveIcon;
  params = [
    {
      key: "dx",
      label: "Offset X",
      type: "number" as const,
      min: -200,
      max: 200,
      step: 1,
    },
    {
      key: "dy",
      label: "Offset Y",
      type: "number" as const,
      min: -200,
      max: 200,
      step: 1,
    },
  ];
  defaultParams: TranslationParams = { dx: 50, dy: 50 };

  execute(image: HTMLCanvasElement, params: TranslationParams): HTMLCanvasElement {
    const matrix = translationMatrix(params.dx, params.dy);
    return affineTransform(image, matrix);
  }
}

import { ContrastIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { processPixels, clamp } from "../pixels";

export interface ContrastParams {
  factor: number;
}

export class ContrastCommand extends BaseCommand<ContrastParams> {
  label = "Contraste";
  icon = ContrastIcon;
  params = [
    {
      key: "factor",
      label: "Fator",
      type: "number" as const,
      min: 0,
      max: 3,
      step: 0.1,
    },
  ];
  defaultParams: ContrastParams = { factor: 1.5 };

  execute(image: HTMLCanvasElement, params: ContrastParams): HTMLCanvasElement {
    return processPixels(image, (r, g, b, a) => {
      const factor = params.factor;
      return [
        clamp(((r / 255 - 0.5) * factor + 0.5) * 255),
        clamp(((g / 255 - 0.5) * factor + 0.5) * 255),
        clamp(((b / 255 - 0.5) * factor + 0.5) * 255),
        a,
      ];
    });
  }
}

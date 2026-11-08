import { ContrastIcon } from "lucide-react";
import type { Command } from "../types";
import { processPixels } from "../pixels";

export interface ContrastParams {
  factor: number;
}

export class ContrastCommand implements Command<ContrastParams> {
  label = "Contrast";
  icon = ContrastIcon;
  params = [
    {
      key: "factor",
      label: "Factor",
      type: "number" as const,
      min: 0,
      max: 3,
      step: 0.1,
    },
  ];
  defaultParams: ContrastParams = { factor: 1.5 };

  execute(image: HTMLCanvasElement, params: ContrastParams): HTMLCanvasElement {
    // D(x,y) = C * f(x,y)
    const c = params.factor;
    return processPixels(image, (r, g, b, a) => [c * r, c * g, c * b, a]);
  }
}

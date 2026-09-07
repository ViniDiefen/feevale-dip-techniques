import { SunIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { processPixels, clamp } from "../pixels";

export interface BrightnessParams {
  amount: number;
}

export class BrightnessCommand extends BaseCommand<BrightnessParams> {
  label = "Brilho";
  icon = SunIcon;
  params = [
    {
      key: "amount",
      label: "Quantidade",
      type: "number" as const,
      min: -255,
      max: 255,
      step: 1,
    },
  ];
  defaultParams: BrightnessParams = { amount: 20 };

  execute(image: HTMLCanvasElement, params: BrightnessParams): HTMLCanvasElement {
    return processPixels(image, (r, g, b, a) => [
      clamp(r + params.amount),
      clamp(g + params.amount),
      clamp(b + params.amount),
      a,
    ]);
  }
}

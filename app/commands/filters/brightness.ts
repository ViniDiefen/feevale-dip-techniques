import { SunIcon } from "lucide-react";
import type { Command } from "../types";
import { pointOperation } from "../point-operation";

export interface BrightnessParams {
  amount: number;
}

export class BrightnessCommand implements Command<BrightnessParams> {
  label = "Brightness";
  icon = SunIcon;
  params = [
    {
      key: "amount",
      label: "Amount",
      type: "number" as const,
      min: -255,
      max: 255,
      step: 1,
    },
  ];
  defaultParams: BrightnessParams = { amount: 20 };

  execute(image: HTMLCanvasElement, params: BrightnessParams): HTMLCanvasElement {
    // D(x,y) = f(x,y) + B
    return pointOperation(image, (r, g, b, a) => [
      r + params.amount,
      g + params.amount,
      b + params.amount,
      a,
    ]);
  }
}

import { SunIcon } from "lucide-react";
import { BaseCommand } from "./base";

export interface BrightnessParams {
  amount: number;
}

export class BrightnessCommand extends BaseCommand<BrightnessParams> {
  label = "Brilho";
  icon = SunIcon;
  defaultParams: BrightnessParams = { amount: 50 };
}

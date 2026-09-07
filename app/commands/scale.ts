import { ScalingIcon } from "lucide-react";
import { BaseCommand } from "./base";

export interface ScaleParams {
  factor: number;
}

export class ScaleCommand extends BaseCommand<ScaleParams> {
  label = "Escala";
  icon = ScalingIcon;
  defaultParams: ScaleParams = { factor: 1 };
}

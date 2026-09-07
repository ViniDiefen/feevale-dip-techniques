import { RotateCwIcon } from "lucide-react";
import { BaseCommand } from "./base";

export interface RotationParams {
  degrees: number;
}

export class RotationCommand extends BaseCommand<RotationParams> {
  label = "Rotação";
  icon = RotateCwIcon;
  defaultParams: RotationParams = { degrees: 0 };
}

import { MoveIcon } from "lucide-react";
import { BaseCommand } from "./base";

export interface TranslationParams {
  dx: number;
  dy: number;
}

export class TranslationCommand extends BaseCommand<TranslationParams> {
  label = "Translação";
  icon = MoveIcon;
  defaultParams: TranslationParams = { dx: 0, dy: 0 };
}

import { ContrastIcon } from "lucide-react";
import { BaseCommand } from "./base";

export interface ContrastParams {
  factor: number;
}

export class ContrastCommand extends BaseCommand<ContrastParams> {
  label = "Contraste";
  icon = ContrastIcon;
  defaultParams: ContrastParams = { factor: 1 };
}

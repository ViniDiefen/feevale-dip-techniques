import { FlipHorizontalIcon } from "lucide-react";
import { BaseCommand } from "./base";

export class MirrorCommand extends BaseCommand {
  label = "Espelhamento";
  icon = FlipHorizontalIcon;
  defaultParams = undefined;
}

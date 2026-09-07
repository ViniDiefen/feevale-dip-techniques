import { BlendIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { processPixels } from "../pixels";

export class GrayscaleCommand extends BaseCommand {
  label = "Escala de cinza";
  icon = BlendIcon;
  params = [];
  defaultParams = undefined;

  execute(image: HTMLCanvasElement): HTMLCanvasElement {
    return processPixels(image, (r, g, b, a) => {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      return [gray, gray, gray, a];
    });
  }
}

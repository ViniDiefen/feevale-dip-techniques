import { BlendIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { processPixels } from "../pixels";

export interface GrayscaleParams {
  method: "luminosity" | "average" | "desaturation";
}

export class GrayscaleCommand extends BaseCommand<GrayscaleParams> {
  label = "Escala de cinza";
  icon = BlendIcon;
  params = [
    {
      key: "method",
      label: "Método",
      type: "select" as const,
      options: [
        { value: "luminosity", label: "Luminosidade (BT.601)" },
        { value: "average", label: "Média simples" },
        { value: "desaturation", label: "Desaturação (BT.709)" },
      ],
    },
  ];
  defaultParams: GrayscaleParams = { method: "luminosity" };

  execute(image: HTMLCanvasElement, params: GrayscaleParams): HTMLCanvasElement {
    return processPixels(image, (r, g, b, a) => {
      let gray: number;
      switch (params.method) {
        case "average":
          gray = (r + g + b) / 3;
          break;
        case "desaturation":
          gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          break;
        case "luminosity":
        default:
          gray = 0.299 * r + 0.587 * g + 0.114 * b;
          break;
      }
      return [gray, gray, gray, a];
    });
  }
}

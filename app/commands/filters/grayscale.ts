import { BlendIcon } from "lucide-react";
import type { Command } from "../types";
import { pointOperation } from "../point-operation";

// Weights follow the course slides ("Transformações Grayscale").
// The slides divide the weighted formulas by 3, but their weights
// already sum to 1, so no division is needed (it would cap output at 85).
export interface GrayscaleParams {
  method: "average" | "bt709" | "redWeighted";
}

export class GrayscaleCommand implements Command<GrayscaleParams> {
  label = "Grayscale";
  icon = BlendIcon;
  params = [
    {
      key: "method",
      label: "Method",
      type: "select" as const,
      options: [
        { value: "average", label: "Simple average" },
        { value: "bt709", label: "Weighted (BT.709)" },
        { value: "redWeighted", label: "Weighted (red)" },
      ],
    },
  ];
  defaultParams: GrayscaleParams = { method: "average" };

  execute(image: HTMLCanvasElement, params: GrayscaleParams): HTMLCanvasElement {
    return pointOperation(image, (r, g, b, a) => {
      let gray: number;
      switch (params.method) {
        case "bt709":
          gray = r * 0.2125 + g * 0.7154 + b * 0.0721;
          break;
        case "redWeighted":
          gray = r * 0.5 + g * 0.419 + b * 0.081;
          break;
        case "average":
        default:
          gray = (r + g + b) / 3;
          break;
      }
      return [gray, gray, gray, a];
    });
  }
}

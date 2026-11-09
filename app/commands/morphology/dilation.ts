import { DiamondIcon, ExpandIcon, MinusIcon, PlusIcon, SquareIcon } from "lucide-react";
import type { Command } from "../types";
import { localOperation } from "../local-operation";
import { coveredValues, structuringElement, VerticalLineIcon, type Shape } from "../structuring-element";

export interface DilationParams {
  shape: Shape;
  size: "3" | "5" | "7";
}

// Dilation: each pixel takes the highest value covered by the structuring
// element. In a binary image this means "1 if any covered neighbor is 1", so
// bright objects grow and small dark holes are filled.
export class DilationCommand implements Command<DilationParams> {
  label = "Dilation";
  icon = ExpandIcon;
  params = [
    {
      key: "shape",
      label: "Structuring element",
      type: "segmented" as const,
      options: [
        { value: "square", label: "Square", icon: SquareIcon },
        { value: "cross", label: "Cross", icon: PlusIcon },
        { value: "diamond", label: "Diamond", icon: DiamondIcon },
        { value: "horizontal", label: "Horizontal line", icon: MinusIcon },
        { value: "vertical", label: "Vertical line", icon: VerticalLineIcon },
      ],
    },
    {
      key: "size",
      label: "Size",
      type: "select" as const,
      options: [
        { value: "3", label: "3 × 3" },
        { value: "5", label: "5 × 5" },
        { value: "7", label: "7 × 7" },
      ],
    },
  ];
  defaultParams: DilationParams = { shape: "square", size: "3" };

  execute(image: HTMLCanvasElement, params: DilationParams): HTMLCanvasElement {
    const size = Number(params.size);
    const covered = coveredValues(structuringElement(params.shape, size));
    return localOperation(image, size, (src, x, y, channel) => Math.max(...covered(src, x, y, channel)));
  }
}

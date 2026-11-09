import { DiamondIcon, MinusIcon, PaintBucketIcon, PlusIcon, SquareIcon } from "lucide-react";
import type { Command } from "../types";
import { VerticalLineIcon, type Shape } from "../structuring-element";
import { DilationCommand } from "./dilation";
import { ErosionCommand } from "./erosion";

export interface ClosingParams {
  shape: Shape;
  size: "3" | "5" | "7";
}

function dilate(image: HTMLCanvasElement, params: ClosingParams): HTMLCanvasElement {
  return new DilationCommand().execute(image, params);
}

function erode(image: HTMLCanvasElement, params: ClosingParams): HTMLCanvasElement {
  return new ErosionCommand().execute(image, params);
}

// Closing: dilation followed by erosion with the same structuring element.
// Dark holes and gaps smaller than the element are filled by the dilation and
// stay filled; larger objects get roughly their original size back.
export class ClosingCommand implements Command<ClosingParams> {
  label = "Closing";
  icon = PaintBucketIcon;
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
  defaultParams: ClosingParams = { shape: "square", size: "3" };

  execute(image: HTMLCanvasElement, params: ClosingParams): HTMLCanvasElement {
    return erode(dilate(image, params), params);
  }
}

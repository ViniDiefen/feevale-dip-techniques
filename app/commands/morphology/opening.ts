import { DiamondIcon, EraserIcon, MinusIcon, PlusIcon, SquareIcon } from "lucide-react";
import type { Command } from "../types";
import { VerticalLineIcon, type Shape } from "../structuring-element";
import { DilationCommand } from "./dilation";
import { ErosionCommand } from "./erosion";

export interface OpeningParams {
  shape: Shape;
  size: "3" | "5" | "7";
}

function erode(image: HTMLCanvasElement, params: OpeningParams): HTMLCanvasElement {
  return new ErosionCommand().execute(image, params);
}

function dilate(image: HTMLCanvasElement, params: OpeningParams): HTMLCanvasElement {
  return new DilationCommand().execute(image, params);
}

// Opening: erosion followed by dilation with the same structuring element.
// Bright details smaller than the element are removed by the erosion and do
// not come back; larger objects get roughly their original size back.
export class OpeningCommand implements Command<OpeningParams> {
  label = "Opening";
  icon = EraserIcon;
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
  defaultParams: OpeningParams = { shape: "square", size: "3" };

  execute(image: HTMLCanvasElement, params: OpeningParams): HTMLCanvasElement {
    return dilate(erode(image, params), params);
  }
}

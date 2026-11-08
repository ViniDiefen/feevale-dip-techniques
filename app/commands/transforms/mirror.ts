import { FlipHorizontalIcon } from "lucide-react";
import type { Command } from "../types";
import { applyMatrix, type Matrix3x3 } from "../matrix";

export interface MirrorParams {
  direction: "horizontal" | "vertical";
}

function mirrorMatrix(direction: "horizontal" | "vertical", width: number, height: number): Matrix3x3 {
  if (direction === "horizontal") {
    return [
      [-1, 0, width - 1],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }
  return [
    [1, 0, 0],
    [0, -1, height - 1],
    [0, 0, 1],
  ];
}

export class MirrorCommand implements Command<MirrorParams> {
  label = "Mirror";
  icon = FlipHorizontalIcon;
  params = [
    {
      key: "direction",
      label: "Direction",
      type: "select" as const,
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "vertical", label: "Vertical" },
      ],
    },
  ];
  defaultParams: MirrorParams = { direction: "horizontal" };

  execute(image: HTMLCanvasElement, params: MirrorParams): HTMLCanvasElement {
    const matrix = mirrorMatrix(params.direction, image.width, image.height);
    return applyMatrix(image, matrix);
  }
}

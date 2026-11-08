import { FlipHorizontalIcon } from "lucide-react";
import type { Command } from "../types";
import { applyMatrix, type Matrix3x3 } from "../geometric";

export interface MirrorParams {
  direction: "horizontal" | "vertical";
}

// Slide matrix with -1 on the diagonal. The -1 alone would move the image
// to negative coordinates (off screen), so we add a translation of
// (width - 1) or (height - 1) to bring it back.
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

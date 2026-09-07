import { FlipHorizontalIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { applyMatrix, type Matrix3x3 } from "../matrix";

function mirrorMatrix(horizontal: boolean, width: number): Matrix3x3 {
  if (horizontal) {
    return [
      [-1, 0, width - 1],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }
  return [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ];
}

export class MirrorCommand extends BaseCommand {
  label = "Espelhamento";
  icon = FlipHorizontalIcon;
  params = [];
  defaultParams = undefined;

  execute(image: HTMLCanvasElement): HTMLCanvasElement {
    const matrix = mirrorMatrix(true, image.width);
    return applyMatrix(image, matrix);
  }
}

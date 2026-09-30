import { Grid3x3Icon } from "lucide-react";
import { BaseCommand } from "../base";
import { applyConvolutionMagnitude } from "../matrix";

export interface MediaParams {
  size: "3" | "5" | "7";
}

function meanKernel(size: number): number[][] {
  const weight = 1 / (size * size);
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => weight)
  );
}

const MEAN_KERNELS: Record<MediaParams["size"], number[][]> = {
  "3": meanKernel(3),
  "5": meanKernel(5),
  "7": meanKernel(7),
};

export class MediaCommand extends BaseCommand<MediaParams> {
  label = "Média";
  icon = Grid3x3Icon;
  params = [
    {
      key: "size",
      label: "Janela",
      type: "select" as const,
      options: [
        { value: "3", label: "3 × 3" },
        { value: "5", label: "5 × 5" },
        { value: "7", label: "7 × 7" },
      ],
    },
  ];
  defaultParams: MediaParams = { size: "3" };

  execute(image: HTMLCanvasElement, params: MediaParams): HTMLCanvasElement {
    return applyConvolutionMagnitude(image, MEAN_KERNELS[params.size]);
  }
}

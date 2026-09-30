import { ChartBarIcon } from "lucide-react";
import { BaseCommand } from "../base";
import { mapNeighborhood } from "../matrix";

export interface ModaParams {
  size: "3" | "5" | "7";
}

const countsR = new Uint32Array(256);
const countsG = new Uint32Array(256);
const countsB = new Uint32Array(256);

function mode(counts: Uint32Array): number {
  let best = 0;
  let bestCount = 0;
  for (let value = 0; value < counts.length; value++) {
    if (counts[value] > bestCount) {
      bestCount = counts[value];
      best = value;
    }
  }
  return best;
}

function createModeVisit(size: number) {
  const half = Math.floor(size / 2);
  return (
    x: number,
    y: number,
    source: Uint8ClampedArray,
    dest: Uint8ClampedArray,
    width: number
  ) => {
    countsR.fill(0);
    countsG.fill(0);
    countsB.fill(0);
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        const srcIdx = ((y + j - half) * width + (x + i - half)) * 4;
        countsR[source[srcIdx]]++;
        countsG[source[srcIdx + 1]]++;
        countsB[source[srcIdx + 2]]++;
      }
    }
    const destIdx = (y * width + x) * 4;
    dest[destIdx] = mode(countsR);
    dest[destIdx + 1] = mode(countsG);
    dest[destIdx + 2] = mode(countsB);
  };
}

export class ModaCommand extends BaseCommand<ModaParams> {
  label = "Moda";
  icon = ChartBarIcon;
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
  defaultParams: ModaParams = { size: "3" };

  execute(image: HTMLCanvasElement, params: ModaParams): HTMLCanvasElement {
    const size = Number(params.size);
    return mapNeighborhood(image, size, createModeVisit(size));
  }
}

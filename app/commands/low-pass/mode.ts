import { ChartBarIcon } from "lucide-react";
import type { Command } from "../types";
import { localOperation, neighborhood } from "../local-operation";

export interface ModeParams {
  size: "3" | "5" | "7";
}

// How many times each tone (0 to 255) appears in the window.
const counts = new Uint8Array(256);

// Most frequent tone inside the window.
function mode(values: number[]): number {
  let best = values[0];
  for (const value of values) {
    counts[value]++;
    if (counts[value] > counts[best]) best = value;
  }
  for (const value of values) counts[value] = 0;
  return best;
}

export class ModeCommand implements Command<ModeParams> {
  label = "Mode";
  icon = ChartBarIcon;
  params = [
    {
      key: "size",
      label: "Window",
      type: "select" as const,
      options: [
        { value: "3", label: "3 × 3" },
        { value: "5", label: "5 × 5" },
        { value: "7", label: "7 × 7" },
      ],
    },
  ];
  defaultParams: ModeParams = { size: "3" };

  execute(image: HTMLCanvasElement, params: ModeParams): HTMLCanvasElement {
    const size = Number(params.size);
    return localOperation(image, size, (src, x, y, channel) => mode(neighborhood(src, size, x, y, channel)));
  }
}

import type { Command } from "../types";
import {
  isDeletableBorder,
  defaultThinningParams,
  thinning,
  thinningParams,
  type DeleteTest,
  type ThinningParams,
} from "../thinning";

const PASSES: DeleteTest[] = [
  // Pass 1: south-east border and north-west corners.
  (bin, x, y) => {
    const neighbors = bin.neighbors(x, y);
    const [e, , n, , w, , s] = neighbors;
    return isDeletableBorder(neighbors) && n * e * s === 0 && e * s * w === 0;
  },
  // Pass 2: north-west border and south-east corners.
  (bin, x, y) => {
    const neighbors = bin.neighbors(x, y);
    const [e, , n, , w, , s] = neighbors;
    return isDeletableBorder(neighbors) && n * e * w === 0 && n * s * w === 0;
  },
];

// Zhang-Suen thinning: two parallel passes per iteration, each removing the
// border pixels on opposite sides of the object, until nothing changes.
export class ZhangSuenCommand implements Command<ThinningParams> {
  label = "Zhang-Suen";
  params = thinningParams;
  defaultParams = defaultThinningParams;

  execute(image: HTMLCanvasElement, params: ThinningParams): HTMLCanvasElement {
    return thinning(image, params.object, PASSES);
  }
}

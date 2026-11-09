import type { Command, ParamSchema } from "../types";
import type { BinaryImage } from "../binary-image";
import { isDeletableBorder, thinning, type DeleteTest } from "../thinning";

// edge(P): P is an object pixel that Zhang-Suen would consider deleting.
function isEdge(bin: BinaryImage, x: number, y: number): boolean {
  return bin.at(x, y) === 1 && isDeletableBorder(bin.neighbors(x, y));
}

// Holt does all the work in a single parallel pass. An edge pixel is deleted
// unless looking one pixel ahead shows that the neighbor on the other side
// would be deleted too, which would break a line two pixels thick:
//   edge(E) ∧ N ∧ S          — vertical line, keep the left column
//   edge(S) ∧ W ∧ E          — horizontal line, keep the top row
//   edge(E) ∧ edge(SE) ∧ edge(S) — 2×2 square, keep the top-left pixel
const thin: DeleteTest = (bin, x, y) => {
  if (!isEdge(bin, x, y)) return false;
  const [e, , n, , w, , s] = bin.neighbors(x, y).map((v) => v === 1);
  const edgeE = isEdge(bin, x + 1, y);
  const edgeS = isEdge(bin, x, y + 1);
  const edgeSE = isEdge(bin, x + 1, y + 1);
  const keep = (edgeE && n && s) || (edgeS && w && e) || (edgeE && edgeSE && edgeS);
  return !keep;
};

// Staircase removal: the skeleton can be left with "steps" where a pixel only
// joins two neighbors that already touch diagonally. One pass looks at steps
// with an object pixel above P, the other at steps with one below.
const removeNorthSteps: DeleteTest = (bin, x, y) => {
  const [e, ne, n, nw, w, sw, s, se] = bin.neighbors(x, y).map((v) => v === 1);
  return n && ((e && !ne && !sw && (!w || !s)) || (w && !nw && !se && (!e || !s)));
};

const removeSouthSteps: DeleteTest = (bin, x, y) => {
  const [e, ne, n, nw, w, sw, s, se] = bin.neighbors(x, y).map((v) => v === 1);
  return s && ((e && !se && !nw && (!w || !n)) || (w && !sw && !ne && (!e || !n)));
};

// Holt thinning: a single-pass variant of Zhang-Suen that peeks at the
// neighbors' own edge status instead of splitting each iteration in two.
// Once the skeleton is stable, staircases are removed so lines end up exactly
// one pixel wide.
export class HoltCommand implements Command {
  label = "Holt";
  params: ParamSchema[] = [];
  defaultParams = undefined;

  execute(image: HTMLCanvasElement): HTMLCanvasElement {
    return thinning(image, [thin], [removeNorthSteps, removeSouthSteps]);
  }
}

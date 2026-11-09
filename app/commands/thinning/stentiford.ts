import type { Command } from "../types";
import {
  defaultThinningParams,
  thinning,
  thinningParams,
  type DeleteTest,
  type ThinningParams,
} from "../thinning";

// Endpoint: tip of a line, with exactly one object neighbor.
function isEndpoint(n: number[]): boolean {
  return n.reduce((sum, v) => sum + v, 0) === 1;
}

// Connectivity number (Yokoi), for an 8-connected object:
//   C = Σ (N̄k − N̄k·N̄k+1·N̄k+2), k ∈ {1, 3, 5, 7}, with N̄k = 1 − Nk and N9 = N1
// It counts the separate object pieces around P, so C = 1 means deleting P does
// not split the object. The formula has to be applied to the complement: on
// Nk itself it gives the 4-connected count, which ignores diagonal neighbors.
// That deletes pixels joining two diagonal-only neighbors (cutting diagonal
// lines down to a few dots) and keeps pixels that are actually redundant.
function connectivity(n: number[]): number {
  const bg = n.map((v) => 1 - v);
  let c = 0;
  for (let k = 0; k < 8; k += 2) {
    c += bg[k] - bg[k] * bg[k + 1] * bg[(k + 2) % 8];
  }
  return c;
}

// Stentiford templates: the neighbor on one side of P must be background and
// the opposite one object. Indices are k − 1 in N1..N8.
const TEMPLATES: [number, number][] = [
  [2, 6], // M1: N3 background, N7 object (top edge)
  [4, 0], // M2: N5 background, N1 object (left edge)
  [6, 2], // M3: N7 background, N3 object (bottom edge)
  [0, 4], // M4: N1 background, N5 object (right edge)
];

// One pass per template. Marked pixels are deleted after each template, not
// only at the end of the four passes. Otherwise M1 and M3 would both remove a
// line that is two pixels thick, and it would vanish.
const PASSES: DeleteTest[] = TEMPLATES.map(([background, object]) => (bin, x, y) => {
  const n = bin.neighbors(x, y);
  return !n[background] && n[object] === 1 && !isEndpoint(n) && connectivity(n) === 1;
});

// Stentiford thinning: peels the object's border one side at a time until a
// one-pixel-wide skeleton remains. A border pixel is removed only if it is
// not an endpoint and its connectivity number is 1.
export class StentifordCommand implements Command<ThinningParams> {
  label = "Stentiford";
  params = thinningParams;
  defaultParams = defaultThinningParams;

  execute(image: HTMLCanvasElement, params: ThinningParams): HTMLCanvasElement {
    return thinning(image, params.object, PASSES);
  }
}

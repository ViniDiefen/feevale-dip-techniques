import type { Command, ParamSchema } from "../types";
import { thinning, type DeleteTest } from "../thinning";

// Endpoint: tip of a line, with exactly one object neighbor.
function isEndpoint(n: number[]): boolean {
  return n.reduce((sum, v) => sum + v, 0) === 1;
}

// Connectivity number: C = Σ (Nk − Nk·Nk+1·Nk+2), k ∈ {1, 3, 5, 7}, with N9 = N1.
function connectivity(n: number[]): number {
  let c = 0;
  for (let k = 0; k < 8; k += 2) {
    c += n[k] - n[k] * n[k + 1] * n[(k + 2) % 8];
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
export class StentifordCommand implements Command {
  label = "Stentiford";
  params: ParamSchema[] = [];
  defaultParams = undefined;

  execute(image: HTMLCanvasElement): HTMLCanvasElement {
    return thinning(image, PASSES);
  }
}

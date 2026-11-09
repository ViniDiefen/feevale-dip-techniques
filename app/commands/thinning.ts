import { toBinary, toCanvas, type BinaryImage } from "./binary-image";

// Test deciding whether the object pixel at (x, y) is deleted in a pass.
// It only sees the image as it was when the pass started.
export type DeleteTest = (bin: BinaryImage, x: number, y: number) => boolean;

// One parallel pass: marks every object pixel that passes the test, then
// deletes them all at once. Returns whether anything was deleted.
function deleteMarked(bin: BinaryImage, test: DeleteTest): boolean {
  const marked: number[] = [];
  for (let y = 0; y < bin.height; y++) {
    for (let x = 0; x < bin.width; x++) {
      if (bin.at(x, y) && test(bin, x, y)) marked.push(y * bin.width + x);
    }
  }
  for (const i of marked) bin.data[i] = 0;
  return marked.length > 0;
}

// Thinning: removes border pixels of the object, pass after pass, until only
// a one-pixel-wide skeleton is left.
//   1. Binarize the image (black = object)
//   2. Run the passes in order, over and over, until a full round deletes
//      nothing
//   3. Run each cleanup pass once on the stable skeleton
// Each algorithm only supplies the tests that decide which pixels go.
export function thinning(
  image: HTMLCanvasElement,
  passes: DeleteTest[],
  cleanup: DeleteTest[] = []
): HTMLCanvasElement {
  const bin = toBinary(image);

  let changed = true;
  while (changed) {
    changed = false;
    for (const pass of passes) {
      if (deleteMarked(bin, pass)) changed = true;
    }
  }

  for (const pass of cleanup) deleteMarked(bin, pass);

  return toCanvas(bin);
}

// Border pixel that can go without changing the shape's topology: 2 to 6
// object neighbors (not an endpoint, not an interior pixel) and exactly one
// 0 → 1 transition going around N1..N8 (deleting it does not split the
// object). Used by Zhang-Suen, and by Holt as its "edge" test.
export function isDeletableBorder(n: number[]): boolean {
  const b = n.reduce((sum, v) => sum + v, 0);
  let a = 0;
  for (let k = 0; k < 8; k++) {
    if (n[k] === 0 && n[(k + 1) % 8] === 1) a++;
  }
  return b >= 2 && b <= 6 && a === 1;
}

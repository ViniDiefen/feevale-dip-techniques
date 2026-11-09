import { createLucideIcon } from "lucide-react";
import { neighborhood } from "./local-operation";

// Structuring element: which pixels of the size×size window take part in the
// operation (true) and which are ignored (false).
export type StructuringElement = boolean[][];

export type Shape = "square" | "cross" | "diamond" | "horizontal" | "vertical";

export function structuringElement(shape: Shape, size: number): StructuringElement {
  const center = Math.floor(size / 2);
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const dx = Math.abs(x - center);
      const dy = Math.abs(y - center);
      switch (shape) {
        case "square":
          return true;
        case "cross":
          return dx === 0 || dy === 0;
        case "diamond":
          return dx + dy <= center;
        case "horizontal":
          return dy === 0;
        case "vertical":
          return dx === 0;
      }
    })
  );
}

// Lucide has no plain vertical line, so this is MinusIcon standing up.
export const VerticalLineIcon = createLucideIcon("vertical-line", [["path", { d: "M12 5v14", key: "vertical-line" }]]);

// Returns a function giving the values of `channel` around (x, y) that fall
// inside the structuring element. The element is flattened once, up front.
export function coveredValues(element: StructuringElement) {
  const size = element.length;
  const inside = element.flat();
  return (image: ImageData, x: number, y: number, channel: number): number[] =>
    neighborhood(image, size, x, y, channel).filter((_, i) => inside[i]);
}

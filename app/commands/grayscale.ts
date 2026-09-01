import type { Command } from "./types";

export class GrayscaleCommand implements Command {
  execute(): void {
    console.log("Grayscale executed");
  }
}

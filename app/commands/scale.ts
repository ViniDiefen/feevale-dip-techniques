import type { Command } from "./types";

export class ScaleCommand implements Command {
  execute(): void {
    console.log("Scale executed");
  }
}

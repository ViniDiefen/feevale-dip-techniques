import type { Command } from "./types";

export class ContrastCommand implements Command {
  execute(): void {
    console.log("Contrast executed");
  }
}

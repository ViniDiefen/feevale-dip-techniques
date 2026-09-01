import type { Command } from "./types";

export class BrightnessCommand implements Command {
  execute(): void {
    console.log("Brightness executed");
  }
}

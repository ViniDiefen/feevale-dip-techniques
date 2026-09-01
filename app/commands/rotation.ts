import type { Command } from "./types";

export class RotationCommand implements Command {
  execute(): void {
    console.log("Rotation executed");
  }
}

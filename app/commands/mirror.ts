import type { Command } from "./types";

export class MirrorCommand implements Command {
  execute(): void {
    console.log("Mirror executed");
  }
}

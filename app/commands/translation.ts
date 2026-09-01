import type { Command } from "./types";

export class TranslationCommand implements Command {
  execute(): void {
    console.log("Translation executed");
  }
}

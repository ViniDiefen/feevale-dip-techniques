import type { LucideIcon } from "lucide-react";
import type { Command } from "./types";

export abstract class BaseCommand<P = void> implements Command<P> {
  abstract label: string;
  abstract icon: LucideIcon;
  abstract defaultParams: P;

  execute(image: HTMLCanvasElement, params: P): HTMLCanvasElement {
    return image;
  }
}

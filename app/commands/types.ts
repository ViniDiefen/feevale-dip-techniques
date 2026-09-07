import type { LucideIcon } from "lucide-react";

export interface Command<P = void> {
  label: string;
  icon: LucideIcon;
  defaultParams: P;
  execute(image: HTMLCanvasElement, params: P): HTMLCanvasElement;
}

import type { LucideIcon } from "lucide-react";

export interface ParamSchema {
  key: string;
  label: string;
  type: "number";
  min: number;
  max: number;
  step: number;
}

export interface Command<P = void> {
  label: string;
  icon: LucideIcon;
  params: ParamSchema[];
  defaultParams: P;
  execute(image: HTMLCanvasElement, params: P): HTMLCanvasElement;
}

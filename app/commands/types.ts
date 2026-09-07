import type { LucideIcon } from "lucide-react";

export interface NumberParamSchema {
  key: string;
  label: string;
  type: "number";
  min: number;
  max: number;
  step: number;
}

export interface SelectParamSchema {
  key: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
}

export type ParamSchema = NumberParamSchema | SelectParamSchema;

export interface Command<P = void> {
  label: string;
  icon: LucideIcon;
  params: ParamSchema[];
  defaultParams: P;
  execute(image: HTMLCanvasElement, params: P): HTMLCanvasElement;
}

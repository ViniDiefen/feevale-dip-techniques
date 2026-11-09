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

// Row of buttons; options with an icon show it instead of the label.
export interface SegmentedParamSchema {
  key: string;
  label: string;
  type: "segmented";
  options: { value: string; label: string; icon?: LucideIcon }[];
}

export type ParamSchema = NumberParamSchema | SelectParamSchema | SegmentedParamSchema;

export interface Command<P = void> {
  label: string;
  // Optional: commands without one show only their label.
  icon?: LucideIcon;
  params: ParamSchema[];
  defaultParams: P;
  execute(image: HTMLCanvasElement, params: P): HTMLCanvasElement;
}

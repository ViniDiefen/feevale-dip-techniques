import type { Command } from "@/commands/types";

export interface CommandLayer<P = any> {
  id: string;
  type: "command";
  command: Command<P>;
  params: P;
  appliedAt: Date;
}

export interface ImageLayer {
  id: string;
  type: "image";
  image: File;
  appliedAt: Date;
}

export type Layer = CommandLayer | ImageLayer;

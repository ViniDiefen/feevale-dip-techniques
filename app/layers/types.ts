import type { Command } from "@/commands/types";

export interface CommandLayer {
  id: string;
  type: "command";
  command: Command;
  appliedAt: Date;
}

export interface ImageLayer {
  id: string;
  type: "image";
  image: File;
  appliedAt: Date;
}

export type Layer = CommandLayer | ImageLayer;

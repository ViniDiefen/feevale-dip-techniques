import type { Command } from "@/commands/types";

export interface Layer {
  id: string;
  command: Command;
  appliedAt: Date;
}

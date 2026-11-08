import type { Command } from "@/commands/types";

export interface Layer<P = any> {
  id: string;
  command: Command<P>;
  params: P;
}

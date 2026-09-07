import type { Command } from "@/commands/types";
import { TranslationCommand } from "@/commands/transforms/translation";
import { ScaleCommand } from "@/commands/transforms/scale";
import { RotationCommand } from "@/commands/transforms/rotation";
import { MirrorCommand } from "@/commands/transforms/mirror";
import { GrayscaleCommand } from "@/commands/filters/grayscale";
import { BrightnessCommand } from "@/commands/filters/brightness";
import { ContrastCommand } from "@/commands/filters/contrast";

export type MenuItem = {
  type: "item";
  command: Command<any>;
  shortcut?: string;
  variant?: "default" | "destructive";
};

export type MenuSeparator = {
  type: "separator";
};

export type MenuEntry = MenuItem | MenuSeparator;

export type Menu = {
  label: string;
  items: MenuEntry[];
};

export const menus: Menu[] = [
  {
    label: "Transformações Geométricas",
    items: [
      { type: "item", command: new TranslationCommand() },
      { type: "item", command: new ScaleCommand() },
      { type: "item", command: new RotationCommand() },
      { type: "item", command: new MirrorCommand() },
    ],
  },
  {
    label: "Filtros",
    items: [
      { type: "item", command: new GrayscaleCommand() },
      { type: "item", command: new BrightnessCommand() },
      { type: "item", command: new ContrastCommand() },
    ],
  },
];

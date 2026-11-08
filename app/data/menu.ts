import type { Command } from "@/commands/types";
import { TranslationCommand } from "@/commands/transforms/translation";
import { ScaleCommand } from "@/commands/transforms/scale";
import { RotationCommand } from "@/commands/transforms/rotation";
import { MirrorCommand } from "@/commands/transforms/mirror";
import { GrayscaleCommand } from "@/commands/filters/grayscale";
import { BrightnessCommand } from "@/commands/filters/brightness";
import { ContrastCommand } from "@/commands/filters/contrast";
import { MediaCommand } from "@/commands/passa-baixas/media";
import { ModaCommand } from "@/commands/passa-baixas/moda";
import { RobertsCommand } from "@/commands/passa-altas/roberts";
import { SobelCommand } from "@/commands/passa-altas/sobel";

export type Menu = {
  label: string;
  commands: Command<any>[];
};

export const menus: Menu[] = [
  {
    label: "Transformações Geométricas",
    commands: [
      new TranslationCommand(),
      new ScaleCommand(),
      new RotationCommand(),
      new MirrorCommand(),
    ],
  },
  {
    label: "Filtros",
    commands: [
      new GrayscaleCommand(),
      new BrightnessCommand(),
      new ContrastCommand(),
    ],
  },
  {
    label: "Passa-baixas",
    commands: [
      new MediaCommand(),
      new ModaCommand(),
    ],
  },
  {
    label: "Passa-altas",
    commands: [
      new RobertsCommand(),
      new SobelCommand(),
    ],
  },
];

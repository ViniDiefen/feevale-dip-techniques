import type { Command } from "@/commands/types";
import { TranslationCommand } from "@/commands/transforms/translation";
import { ScaleCommand } from "@/commands/transforms/scale";
import { RotationCommand } from "@/commands/transforms/rotation";
import { MirrorCommand } from "@/commands/transforms/mirror";
import { GrayscaleCommand } from "@/commands/filters/grayscale";
import { BrightnessCommand } from "@/commands/filters/brightness";
import { ContrastCommand } from "@/commands/filters/contrast";
import { MeanCommand } from "@/commands/low-pass/mean";
import { ModeCommand } from "@/commands/low-pass/mode";
import { RobertsCommand } from "@/commands/high-pass/roberts";
import { SobelCommand } from "@/commands/high-pass/sobel";
import { DilationCommand } from "@/commands/morphology/dilation";
import { ErosionCommand } from "@/commands/morphology/erosion";

export type Menu = {
  label: string;
  commands: Command<any>[];
};

export const menus: Menu[] = [
  {
    label: "Geometric Transforms",
    commands: [
      new TranslationCommand(),
      new ScaleCommand(),
      new RotationCommand(),
      new MirrorCommand(),
    ],
  },
  {
    label: "Filters",
    commands: [
      new GrayscaleCommand(),
      new BrightnessCommand(),
      new ContrastCommand(),
    ],
  },
  {
    label: "Low-pass",
    commands: [
      new MeanCommand(),
      new ModeCommand(),
    ],
  },
  {
    label: "High-pass",
    commands: [
      new RobertsCommand(),
      new SobelCommand(),
    ],
  },
  {
    label: "Morphology",
    commands: [
      new DilationCommand(),
      new ErosionCommand(),
    ],
  },
];

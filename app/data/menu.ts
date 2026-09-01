import {
  BlendIcon,
  ContrastIcon,
  FlipHorizontalIcon,
  MoveIcon,
  RotateCwIcon,
  ScalingIcon,
  SunIcon,
  type LucideIcon
} from "lucide-react";
import type { Command } from "@/commands/types";
import { TranslationCommand } from "@/commands/translation";
import { ScaleCommand } from "@/commands/scale";
import { RotationCommand } from "@/commands/rotation";
import { MirrorCommand } from "@/commands/mirror";
import { GrayscaleCommand } from "@/commands/grayscale";
import { BrightnessCommand } from "@/commands/brightness";
import { ContrastCommand } from "@/commands/contrast";

export type MenuItem = {
  type: "item";
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  variant?: "default" | "destructive";
  command: Command;
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
      { type: "item", label: "Translação", icon: MoveIcon, command: new TranslationCommand() },
      { type: "item", label: "Escala", icon: ScalingIcon, command: new ScaleCommand() },
      { type: "item", label: "Rotação", icon: RotateCwIcon, command: new RotationCommand() },
      { type: "item", label: "Espelhamento", icon: FlipHorizontalIcon, command: new MirrorCommand() },
    ],
  },
  {
    label: "Filtros",
    items: [
      { type: "item", label: "Escalas de cinza", icon: BlendIcon, command: new GrayscaleCommand() },
      { type: "item", label: "Brilho", icon: SunIcon, command: new BrightnessCommand() },
      { type: "item", label: "Contraste", icon: ContrastIcon, command: new ContrastCommand() },
    ],
  },
];

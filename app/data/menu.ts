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

export type MenuItem = {
  type: "item";
  label: string;
  icon: LucideIcon;
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
      { type: "item", label: "Translação", icon: MoveIcon, shortcut: "⌘N" },
      { type: "item", label: "Escala", icon: ScalingIcon },
      { type: "item", label: "Rotação", icon: RotateCwIcon },
      { type: "item", label: "Espelhamento", icon: FlipHorizontalIcon, shortcut: "⌘S" },
    ],
  },
  {
    label: "Filtros",
    items: [
      { type: "item", label: "Escalas de cinza", icon: BlendIcon },
      { type: "item", label: "Brilho", icon: SunIcon },
      { type: "item", label: "Contraste", icon: ContrastIcon },
    ],
  },
];

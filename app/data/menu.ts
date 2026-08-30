import {
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  SaveIcon,
  SettingsIcon,
  TrashIcon,
  type LucideIcon,
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
    label: "File",
    items: [
      { type: "item", label: "New File", icon: FileIcon, shortcut: "⌘N" },
      { type: "item", label: "Open Folder", icon: FolderIcon },
      { type: "separator" },
      { type: "item", label: "Save", icon: SaveIcon, shortcut: "⌘S" },
    ],
  },
  {
    label: "More",
    items: [
      { type: "item", label: "Settings", icon: SettingsIcon },
      { type: "item", label: "Help", icon: HelpCircleIcon },
      { type: "separator" },
      { type: "item", label: "Delete", icon: TrashIcon, variant: "destructive" },
    ],
  },
];

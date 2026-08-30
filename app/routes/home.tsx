import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { menus, type Menu, type MenuEntry, type MenuItem } from "@/data/menu";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feevale DIP Techniques" },
    {
      name: "description",
      content:
        "A solution for managing and testing DIP techniques, applying techniques presented at the Feevale DIP conference.",
    },
  ];
}

export default function Home() {
  return <Menubar className="w-full rounded-none border-x-0 border-t-0 h-12">{menus.map(renderMenu)}</Menubar>;
}

function renderMenu(menu: Menu) {
  return (
    <MenubarMenu key={menu.label}>
      <MenubarTrigger className="h-10 px-3">{menu.label}</MenubarTrigger>
      <MenubarContent>{menu.items.map(renderMenuEntry)}</MenubarContent>
    </MenubarMenu>
  );
}

function renderMenuEntry(item: MenuEntry, index: number) {
  if (item.type === "separator") {
    return renderMenuSeparator(index);
  }
  if (item.type === "item") {
    return renderMenuItem(item);
  }
}

function renderMenuSeparator(index: number) {
  return <MenubarSeparator key={index} />;
}

function renderMenuItem(item: MenuItem) {
  const Icon = item.icon;
  return (
    <MenubarItem key={item.label} variant={item.variant}>
      <Icon />
      {item.label}
      {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
    </MenubarItem>
  );
}

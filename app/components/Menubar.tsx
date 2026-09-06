import {
  Menubar as MenubarUI,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { menus, type Menu, type MenuEntry, type MenuItem } from "@/data/menu";

const styles = {
  menubar: "w-full rounded-none border-x-0 border-t-0 h-12",
  trigger: "h-10 px-3",
} as const;

export function Menubar() {
  return (
    <MenubarUI className={styles.menubar}>
      {menus.map(renderMenu)}
    </MenubarUI>
  );
}

function renderMenu(menu: Menu) {
  return (
    <MenubarMenu key={menu.label}>
      <MenubarTrigger className={styles.trigger}>{menu.label}</MenubarTrigger>
      <MenubarContent>{menu.items.map(renderMenuEntry)}</MenubarContent>
    </MenubarMenu>
  );
}

function renderMenuEntry(item: MenuEntry, index: number) {
  switch (item.type) {
    case "separator":
      return renderMenuSeparator(index);
    case "item":
      return renderMenuItem(item);
  }
}

function renderMenuSeparator(index: number) {
  return <MenubarSeparator key={index} />;
}

function renderMenuItem(item: MenuItem) {
  const Icon = item.icon;
  return (
    <MenubarItem key={item.label} variant={item.variant} onClick={() => item.command.execute()}>
      <Icon />
      {item.label}
      {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
    </MenubarItem>
  );
}

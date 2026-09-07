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

interface MenubarProps {
  onCommandExecute: (item: MenuItem) => void;
}

export function Menubar({ onCommandExecute }: MenubarProps) {
  function renderMenu(menu: Menu) {
    return (
      <MenubarMenu key={menu.label}>
        <MenubarTrigger className={styles.trigger}>{menu.label}</MenubarTrigger>
        <MenubarContent>
          {menu.items.map(renderMenuEntry)}
        </MenubarContent>
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
    const Icon = item.command.icon;
    return (
      <MenubarItem
        key={item.command.label}
        variant={item.variant}
        onClick={() => onCommandExecute(item)}
      >
        <Icon />
        {item.command.label}
        {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
      </MenubarItem>
    );
  }

  return (
    <MenubarUI className={styles.menubar}>
      {menus.map(renderMenu)}
    </MenubarUI>
  );
}

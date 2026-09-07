import {
  Menubar as MenubarUI,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/shared/ui/menubar";
import { menus, type Menu, type MenuEntry, type MenuItem } from "@/data/menu";

const styles = {
  menubar: "w-full rounded-none border-x-0 border-t-0 h-12",
  trigger: "h-10 px-3",
} as const;

interface MenubarProps {
  onCommandExecute: (item: MenuItem) => void;
}

function MenuSeparator({ index }: { index: number }) {
  return <MenubarSeparator key={index} />;
}

function MenuItemComponent({
  item,
  onCommandExecute,
}: {
  item: MenuItem;
  onCommandExecute: (item: MenuItem) => void;
}) {
  const Icon = item.command.icon;
  return (
    <MenubarItem
      key={item.command.label}
      variant={item.variant}
      onClick={() => onCommandExecute(item)}
    >
      <Icon />
      {item.command.label}
      {item.shortcut !== undefined ? <MenubarShortcut>{item.shortcut}</MenubarShortcut> : null}
    </MenubarItem>
  );
}

function MenuEntry({
  entry,
  onCommandExecute,
}: {
  entry: MenuEntry;
  onCommandExecute: (item: MenuItem) => void;
}) {
  if (entry.type === "separator") {
    return <MenuSeparator index={0} />;
  }
  return <MenuItemComponent item={entry} onCommandExecute={onCommandExecute} />;
}

function Menu({
  menu,
  onCommandExecute,
}: {
  menu: Menu;
  onCommandExecute: (item: MenuItem) => void;
}) {
  return (
    <MenubarMenu key={menu.label}>
      <MenubarTrigger className={styles.trigger}>{menu.label}</MenubarTrigger>
      <MenubarContent>
        {menu.items.map((entry, index) => (
          <MenuEntry
            key={index}
            entry={entry}
            onCommandExecute={onCommandExecute}
          />
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
}

export function Menubar({ onCommandExecute }: MenubarProps) {
  return (
    <MenubarUI className={styles.menubar}>
      {menus.map((menu) => (
        <Menu key={menu.label} menu={menu} onCommandExecute={onCommandExecute} />
      ))}
    </MenubarUI>
  );
}
